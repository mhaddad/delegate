/**
 * Ingestão de Todos os Serviços Municipais e Tabela de Taxas (RTTL 2025)
 *
 * 1. Converte os 98 blocos em 28 áreas de `procedures.json` em ficheiros Markdown ricos
 *    em `prototipo/data/conhecimento/procedimentos/`.
 * 2. Converte os 18 capítulos da Tabela de Taxas (RTTL 2025 de `rttl_cache.json`) em guias
 *    estruturados em `prototipo/data/conhecimento/taxas/`.
 * 3. Corrige metadados do PDM.
 * 4. Consolida tudo no `indice.json`.
 * 5. Gera embeddings para todos os novos documentos no `embeddings_cache.json`.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const TOKEN = process.env.OPEN_ROUTER_API_TOKEN || process.env.OPENROUTER_API_KEY;

const PASTA_PROT = join(import.meta.dirname, '..');
const PASTA_DADOS = join(PASTA_PROT, 'data', 'conhecimento');
const PASTA_PROC = join(PASTA_DADOS, 'procedimentos');
const PASTA_TAXAS = join(PASTA_DADOS, 'taxas');

mkdirSync(PASTA_PROC, { recursive: true });
mkdirSync(PASTA_TAXAS, { recursive: true });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sha256(content: string): string {
  return createHash('sha256').update(content, 'utf-8').digest('hex');
}

// 1. Processar procedures.json
console.log('📦 A processar procedures.json (28 áreas, 98 blocos)...');
const proceduresJson = JSON.parse(readFileSync(join(PASTA_PROT, 'data', 'procedures.json'), 'utf-8'));
const novasEntradas: any[] = [];

for (const proc of proceduresJson) {
  const areaTitle = proc.title.trim();
  const areaId = proc.id;
  const blocks = proc.blocks || [];

  for (const block of blocks) {
    const blockId = block.id;
    const secao = block.section ? block.section.trim() : areaTitle;
    const corpo = block.body ? block.body.trim() : '';

    const slug = `${slugify(areaTitle)}-${slugify(blockId)}`;
    const fileName = `procedimentos/${slug}.md`;
    const fullPath = join(PASTA_DADOS, fileName);

    const mdContent = [
      '---',
      `id: PROC-${areaId}-${blockId}`,
      `area: "${areaTitle}"`,
      `secao: "${secao.replace(/"/g, '\\"')}"`,
      `fonte: "Portal Oficial da Câmara Municipal de Guimarães / Diretório de Serviços"`,
      `codigo_bloco: "${blockId}"`,
      '---',
      `# ${secao}`,
      '',
      `### Área de Serviço Municipal: ${areaTitle}`,
      '',
      corpo,
      '',
      '### Informações Oficiais e Requisitos',
      `- **Entidade Competente:** Município de Guimarães (Câmara Municipal)`,
      `- **Área Administrativa:** ${areaTitle}`,
      `- **Código de Procedimento:** ${blockId}`,
      `- **Canal Oficial:** Balcão Único e Balcão Virtual da CMG`,
      '',
    ].join('\n');

    writeFileSync(fullPath, mdContent, 'utf-8');
    const hash = sha256(mdContent);

    novasEntradas.push({
      id: `DOC-PROC-${areaId}-${blockId}`,
      url: `https://www.cm-guimaraes.pt/servicos/procedimento?id=${areaId}&bloco=${blockId}`,
      titulo: secao.length > 5 ? secao : `${areaTitle} - ${blockId}`,
      categoria: 'diretorio',
      consultadoEm: '2026-10-20',
      hashSha256: hash,
      ficheiroLocal: fileName,
      tamanhoBytes: Buffer.byteLength(mdContent, 'utf-8'),
    });
  }
}

// 2. Processar Tabela de Taxas (RTTL 2025)
console.log('💰 A processar rttl_cache.json (Tabela de Taxas 2025)...');
const rttlCache = JSON.parse(readFileSync(join(PASTA_PROT, 'data', 'fees', 'rttl_cache.json'), 'utf-8'));

const titulosCapitulos: Record<string, string> = {
  I: 'Serviços Diversos, Certidões, Vistorias e Plantas',
  II: 'Bibliotecas, Arquivo Municipal e Documentação',
  III: 'Publicidade, Esplanadas e Ocupação do Espaço Público',
  IV: 'Estacionamento e Parquímetros',
  V: 'Postos de Abastecimento de Carburantes',
  VI: 'Licenças Acidentais de Recintos e Espetáculos',
  VII: 'Licenciamento de Atividades Diversas (Ruído, Queimadas, Fogueiras, Acampamentos e Provas Desportivas)',
  VIII: 'Cemitérios Municipais (Jazigos, Covais, Sepulturas e Ossários)',
  IX: 'Mercados Municipais e Feiras (Bancas, Terrados e Lojas)',
  X: 'Certificado de Registo de Cidadão da União Europeia (CRUE)',
  XII: 'Parque de Campismo da Penha',
  XIII: 'Mobilidade, Transportes e Estação Central de Camionagem',
  XIV: 'Instalações Desportivas Municipais e Atividades Desportivas',
  XV: 'Cultura e Espaços Culturais',
  XVI: 'Complexo Multifuncional de Couros e Centro de Juventude',
  XVII: 'Teatro Jordão',
  XIX: 'Desenvolvimento Económico e Quiosques Municipais',
  XX: 'Centro de Ciência Viva de Guimarães',
};

const itensPorCapitulo: Record<string, any[]> = {};
for (const item of rttlCache) {
  const cap = item.capitulo || 'I';
  if (!itensPorCapitulo[cap]) itensPorCapitulo[cap] = [];
  itensPorCapitulo[cap].push(item);
}

for (const [cap, itens] of Object.entries(itensPorCapitulo)) {
  const nomeCap = titulosCapitulos[cap] || `Capítulo ${cap}`;
  const slug = `taxas-capitulo-${cap.toLowerCase()}-${slugify(nomeCap).slice(0, 30)}`;
  const fileName = `taxas/${slug}.md`;
  const fullPath = join(PASTA_DADOS, fileName);

  const linhasMd: string[] = [
    '---',
    `id: TAXAS-RTTL-CAP-${cap}`,
    `capitulo: "${cap}"`,
    `titulo: "Tabela de Taxas RTTL 2025 - Capítulo ${cap}: ${nomeCap}"`,
    `fonte: "Regulamento e Tabela de Taxas e Licenças de Guimarães 2025 (RTTL / Edital 597/2025)"`,
    '---',
    `# Tabela de Taxas e Licenças 2025 — Capítulo ${cap}: ${nomeCap}`,
    '',
    `Este documento reúne os valores oficiais e artigos regulamentares da Câmara Municipal de Guimarães em vigor para **${nomeCap}**.`,
    '',
    '### Itens e Valores Comprovados (RTTL 2025)',
    '',
    '| Artigo | Designação do Ato ou Licença | Valor Oficial (€) | Confiança |',
    '|---|---|:---:|:---:|',
  ];

  for (const it of itens.slice(0, 35)) {
    const desig = it.designacao.replace(/\|/g, '-').slice(0, 100);
    linhasMd.push(`| Art. ${it.artigo || '-'} | ${desig} | **${it.valor.toFixed(2)} €** | ${it.confianca} |`);
  }

  linhasMd.push(
    '',
    '### Enquadramento Regulamentar',
    `- **Diploma:** Regulamento e Tabela de Taxas e Outras Receitas do Município de Guimarães (RTTL 2025)`,
    `- **Data de Entrada em Vigor:** 2025`,
    `- **Publicação:** Edital 597/2025 da Câmara Municipal de Guimarães`,
  );

  const mdContent = linhasMd.join('\n');
  writeFileSync(fullPath, mdContent, 'utf-8');
  const hash = sha256(mdContent);

  novasEntradas.push({
    id: `DOC-TAXAS-CAP-${cap}`,
    url: `https://www.cm-guimaraes.pt/municipio/camara-municipal/publicacoes/regulamentos?rttl=cap-${cap.toLowerCase()}`,
    titulo: `Taxas e Valores Oficiais: ${nomeCap}`,
    categoria: 'regulamentos',
    consultadoEm: '2026-10-20',
    hashSha256: hash,
    ficheiroLocal: fileName,
    tamanhoBytes: Buffer.byteLength(mdContent, 'utf-8'),
  });
}

// 3. Atualizar indice.json
console.log('📝 A consolidar indice.json...');
const indiceOriginal: any[] = JSON.parse(readFileSync(join(PASTA_DADOS, 'indice.json'), 'utf-8'));

// Corrigir título do PDM
for (const item of indiceOriginal) {
  if (item.id === 'DOC-URBANISMO-pdm-guimaraes') {
    item.titulo = 'Plano Diretor Municipal (PDM) de Guimarães';
  }
}

// Desduplicar por id
const mapaIndice = new Map<string, any>();
for (const it of indiceOriginal) {
  mapaIndice.set(it.id, it);
}
for (const it of novasEntradas) {
  mapaIndice.set(it.id, it);
}

const indiceConsolidado = Array.from(mapaIndice.values());
writeFileSync(join(PASTA_DADOS, 'indice.json'), JSON.stringify(indiceConsolidado, null, 2), 'utf-8');
console.log(`✅ Índice atualizado com sucesso! Total de documentos: ${indiceConsolidado.length} (eram ${indiceOriginal.length})`);

// 4. Gerar Embeddings Vetoriais para os novos documentos
if (TOKEN) {
  console.log('🧠 A gerar embeddings vetoriais para os novos documentos...');
  const CAMINHO_EMBEDDINGS = join(PASTA_DADOS, 'embeddings_cache.json');
  let cacheEmbeddings: any[] = [];
  if (existsSync(CAMINHO_EMBEDDINGS)) {
    try {
      cacheEmbeddings = JSON.parse(readFileSync(CAMINHO_EMBEDDINGS, 'utf-8'));
    } catch {
      cacheEmbeddings = [];
    }
  }

  const idsExistentes = new Set(cacheEmbeddings.map((e) => e.id));
  const docsParaGerar: any[] = [];

  for (const ent of indiceConsolidado) {
    if (!idsExistentes.has(ent.id)) {
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
      docsParaGerar.push({
        id: ent.id,
        titulo: ent.titulo,
        url: ent.url,
        categoria: ent.categoria,
        ficheiroLocal: ent.ficheiroLocal,
        texto,
      });
    }
  }

  console.log(`-> Documentos novos a vetorizar: ${docsParaGerar.length}`);

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
    if (!res.ok) throw new Error(`Falha API: ${res.status}`);
    const data = await res.json();
    return data.data.map((d: any) => d.embedding);
  }

  const BATCH_SIZE = 25;
  for (let i = 0; i < docsParaGerar.length; i += BATCH_SIZE) {
    const batch = docsParaGerar.slice(i, i + BATCH_SIZE);
    process.stdout.write(`   Lote ${Math.floor(i / BATCH_SIZE) + 1} de ${Math.ceil(docsParaGerar.length / BATCH_SIZE)}...\r`);
    const vectors = await obterEmbeddings(batch.map((d) => d.texto));
    for (let j = 0; j < batch.length; j++) {
      cacheEmbeddings.push({
        ...batch[j],
        vector: vectors[j],
      });
    }
  }

  writeFileSync(CAMINHO_EMBEDDINGS, JSON.stringify(cacheEmbeddings), 'utf-8');
  console.log(`\n🎉 Cache vetorial atualizada! Total com embeddings: ${cacheEmbeddings.length}`);
} else {
  console.log('⚠️ OPEN_ROUTER_API_TOKEN não definido. Embeddings podem ser gerados posteriormente.');
}
