/**
 * Teste Comparativo de RAG com Embeddings Vetoriais (OpenRouter / text-embedding-3-small)
 *
 * Gera/carrega embeddings para os 120 documentos municipais e testa as queries
 * com erros ortográficos, ruído e linguagem coloquial para comparar com o BM25.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TOKEN = process.env.OPEN_ROUTER_API_TOKEN || process.env.OPENROUTER_API_KEY;
if (!TOKEN) {
  console.error('OPEN_ROUTER_API_TOKEN não definido');
  process.exit(1);
}

const PASTA_DADOS = join(import.meta.dirname, '..', 'data', 'conhecimento');
const CAMINHO_INDICE = join(PASTA_DADOS, 'indice.json');
const CAMINHO_EMBEDDINGS = join(PASTA_DADOS, 'embeddings_cache.json');

interface DocEmbed {
  id: string;
  titulo: string;
  url: string;
  categoria: string;
  texto: string;
  vector: number[];
}

function produtoInterno(a: number[], b: number[]): number {
  let soma = 0;
  for (let i = 0; i < a.length; i++) {
    soma += a[i] * b[i];
  }
  return soma;
}

async function obterEmbeddings(textos: string[]): Promise<number[][]> {
  const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: textos,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erro API OpenRouter (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.data.map((d: any) => d.embedding);
}

async function carregarOuGerarEmbeddings(): Promise<DocEmbed[]> {
  if (existsSync(CAMINHO_EMBEDDINGS)) {
    console.log('⚡ A carregar embeddings do ficheiro local (cache instantânea)...');
    return JSON.parse(readFileSync(CAMINHO_EMBEDDINGS, 'utf-8'));
  }

  console.log('🔄 A indexar e gerar embeddings para a Base de Conhecimento Municipal...');
  const indice = JSON.parse(readFileSync(CAMINHO_INDICE, 'utf-8'));
  const docs: Array<{ id: string; titulo: string; url: string; categoria: string; texto: string }> = [];

  for (const ent of indice) {
    const docPath = join(PASTA_DADOS, ent.ficheiroLocal);
    let texto = ent.titulo;
    if (existsSync(docPath)) {
      const raw = readFileSync(docPath, 'utf-8');
      const partes = raw.split(/^---$/m);
      const corpo = (partes.length >= 3 ? partes.slice(2).join('---') : raw)
        .replace(/\[Personalizar cookies\][\s\S]*?\[Top\][^\n]*/i, '')
        .replace(/\n{2,}/g, ' ')
        .slice(0, 1000);
      texto = `Título: ${ent.titulo}. Categoria: ${ent.categoria}. ${corpo}`;
    }
    docs.push({
      id: ent.id,
      titulo: ent.titulo,
      url: ent.url,
      categoria: ent.categoria,
      texto,
    });
  }

  console.log(`-> A gerar vetores para ${docs.length} documentos em lotes...`);
  const resultado: DocEmbed[] = [];
  const BATCH_SIZE = 25;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    process.stdout.write(`   Processando lote ${Math.floor(i / BATCH_SIZE) + 1} de ${Math.ceil(docs.length / BATCH_SIZE)}...\r`);
    const vectors = await obterEmbeddings(batch.map((d) => d.texto));
    for (let j = 0; j < batch.length; j++) {
      resultado.push({
        ...batch[j],
        vector: vectors[j],
      });
    }
  }
  console.log('\n✅ Todos os embeddings gerados com sucesso!');
  writeFileSync(CAMINHO_EMBEDDINGS, JSON.stringify(resultado), 'utf-8');
  return resultado;
}

async function main() {
  const base = await carregarOuGerarEmbeddings();

  const queriesRuidosas = [
    { tipo: 'Typos graves', q: 'quero isensao da lisensa de utilizasao duma casa velha', esperado: 'Isenção de Licença de Utilização' },
    { tipo: 'Typos graves', q: 'comu pedir numro de porta pra minha cazinha', esperado: 'Atribuição de número de porta' },
    { tipo: 'Typos + contrações', q: 'bolsas destudo pa faculdade como faco', esperado: 'Bolsas de Estudo' },
    { tipo: 'Typos', q: 'reduzir o ivva a 6% nas obras de casa', esperado: 'Redução do IVA' },
    { tipo: 'Coloquial / Gíria', q: 'tenho uma motinha 50cc ciclomotor pa matricular', esperado: 'Ciclomotores' },
    { tipo: 'Sem pontuação / Telegráfico', q: 'marcar hora balcao unico ir la presencial', esperado: 'Agendar / Balcão Único' },
    { tipo: 'Termo separado com erro', q: 'plantas e mapa no web sig ou sig municipal', esperado: 'Websig - mapas online' },
    { tipo: 'Desabafo / Sintomas', q: 'a rua ta cheia de buracos e a luz apagada arranjem isso', esperado: 'Registar Ocorrências' },
    { tipo: 'Desabafo / Ruído', q: 'o meu vizinho nao cala os caes a noite toda onde me queixo', esperado: 'Fiscalização / Ocorrências' },
    { tipo: 'Super informal', q: 'quero por mesas la fora no passeio po verao no meu cafe', esperado: 'Esplanada / Balcão Único' },
    { tipo: 'Pergunta vaga / Fragmentada', q: 'pdm terreno rustico urbano onde vejo', esperado: 'PDM / Urbanismo' },
    { tipo: 'Erros gramaticais', q: 'como faser para mandar papeis e formulareos pela net', esperado: 'Documentos Online / Formulários' },
  ];

  console.log('\n================================================================================');
  console.log('RESULTADOS: RAG VETORIAL (EMBEDDINGS SEMÂNTICOS)');
  console.log('================================================================================\n');

  for (let i = 0; i < queriesRuidosas.length; i++) {
    const item = queriesRuidosas[i];
    const [qVector] = await obterEmbeddings([item.q]);

    // Calcular similaridade de cosseno
    const ranking = base
      .map((doc) => ({
        ...doc,
        similaridade: produtoInterno(qVector, doc.vector),
      }))
      .sort((a, b) => b.similaridade - a.similaridade)
      .slice(0, 3);

    const top = ranking[0];
    console.log(`[${i + 1}/12] [${item.tipo}]`);
    console.log(`   Pergunta: "${item.q}"`);
    console.log(`   Esperado: ${item.esperado}`);
    console.log(`   -> #1 Vetorial: "${top.titulo}" (Sim: ${(top.similaridade * 100).toFixed(1)}%)`);
    console.log(`      URL: ${top.url}`);
    if (ranking[1]) {
      console.log(`   -> #2 Alternativa: "${ranking[1].titulo}" (Sim: ${(ranking[1].similaridade * 100).toFixed(1)}%)`);
    }
    console.log('');
  }
}

main().catch(console.error);
