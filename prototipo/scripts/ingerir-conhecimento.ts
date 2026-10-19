/**
 * Script de Ingestão da Base de Conhecimento Municipal via Cloudflare /markdown
 *
 * Suporta dois modos:
 * 1. Cloudflare Browser Run REST API oficial:
 *    POST https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-run/markdown
 *    (requer CLOUDFLARE_ACCOUNT_ID e CLOUDFLARE_API_TOKEN no .env)
 * 2. Fallback Cloudflare Zero-Config (markdown.new):
 *    GET https://markdown.new/<URL>
 *    (executa de imediato sem necessidade de credenciais prévias)
 *
 * Uso:
 *   npx tsx scripts/ingerir-conhecimento.ts
 *   npx tsx scripts/ingerir-conhecimento.ts --url https://diretorio.cm-guimaraes.pt/
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN?.trim();

const PASTA_DESTINO = join(import.meta.dirname, '..', 'data', 'conhecimento');

export interface DocumentoIngerido {
  id: string;
  url: string;
  titulo: string;
  categoria: 'diretorio' | 'formularios' | 'urbanismo' | 'portal' | 'regulamentos';
  consultadoEm: string;
  hashSha256: string;
  tamanhoBytes: number;
  conteudoMd: string;
  ficheiroLocal: string;
}

/** Sementes prioritárias do ecossistema municipal de Guimarães */
export const SEMENTES_MUNICIPAIS: Array<{ url: string; categoria: DocumentoIngerido['categoria']; slug: string }> = [
  {
    url: 'https://diretorio.cm-guimaraes.pt/',
    categoria: 'diretorio',
    slug: 'diretorio-principal',
  },
  {
    url: 'https://diretorio.cm-guimaraes.pt/diretorio-de-servicos/directorio_de_servicos/certidoes/isencao-de-licenca-de-utilizacao',
    categoria: 'diretorio',
    slug: 'isencao-licenca-utilizacao',
  },
  {
    url: 'https://diretorio.cm-guimaraes.pt/diretorio-de-servicos/directorio_de_servicos/acao-social/bolsas-de-estudo',
    categoria: 'diretorio',
    slug: 'bolsas-de-estudo',
  },
  {
    url: 'https://www.cm-guimaraes.pt/servicos-online/formularios',
    categoria: 'formularios',
    slug: 'formularios-municipais',
  },
  {
    url: 'https://www.cm-guimaraes.pt/municipio/camara-municipal/servicos/urbanismo/urbanismo-digital',
    categoria: 'urbanismo',
    slug: 'urbanismo-digital',
  },
  {
    url: 'https://pdm.guimaraes.pt/',
    categoria: 'urbanismo',
    slug: 'pdm-guimaraes',
  },
  {
    url: 'https://www.cm-guimaraes.pt/como-podemos-ajudar/servicos',
    categoria: 'portal',
    slug: 'catalogo-como-podemos-ajudar',
  },
];

/**
 * Converte uma URL para Markdown utilizando a infraestrutura da Cloudflare.
 */
export async function extrairMarkdownCloudflare(url: string): Promise<string> {
  // 1. Tentar Endpoint Oficial de Browser Run se as chaves estiverem configuradas
  if (CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN) {
    try {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/browser-run/markdown`;
      const resposta = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
        body: JSON.stringify({
          url,
          rejectRequestPattern: ['^.*\\.(css|png|jpg|jpeg|gif|svg|woff2?)'],
          gotoOptions: { waitUntil: 'networkidle0' },
        }),
      });

      if (resposta.ok) {
        const dados = (await resposta.json()) as { success: boolean; result?: string; error?: string };
        if (dados.success && dados.result) {
          return dados.result;
        }
      }
      console.warn(`[Cloudflare API] Falha na API oficial (${resposta.status}), a recorrer à contingência...`);
    } catch (err) {
      console.warn('[Cloudflare API] Erro ao contactar Browser Run API, a recorrer à contingência:', err);
    }
  }

  // 2. Alternativa de alta disponibilidade: Cloudflare markdown.new
  const urlAlternativa = `https://markdown.new/${encodeURI(url)}`;
  const resposta = await fetch(urlAlternativa, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; DelegateBot/1.0; +https://github.com/mhaddad/delegate)',
      Accept: 'text/markdown, text/plain, */*',
    },
  });

  if (!resposta.ok) {
    throw new Error(`Falha ao extrair Markdown via Cloudflare para ${url} (HTTP ${resposta.status})`);
  }

  return await resposta.text();
}

/**
 * Normaliza e enriquece o Markdown extraído com metadados estruturados em Frontmatter.
 */
function prepararFicheiroMarkdown(doc: Omit<DocumentoIngerido, 'ficheiroLocal'>): string {
  const frontmatter = [
    '---',
    `id: "${doc.id}"`,
    `url: "${doc.url}"`,
    `titulo: "${doc.titulo.replace(/"/g, '\\"')}"`,
    `categoria: "${doc.categoria}"`,
    `consultado_em: "${doc.consultadoEm}"`,
    `hash_sha256: "${doc.hashSha256}"`,
    `tamanho_bytes: ${doc.tamanhoBytes}`,
    'fonte_extracao: "Cloudflare Browser Run /markdown"',
    '---',
    '',
    doc.conteudoMd.trim(),
    '',
  ].join('\n');

  return frontmatter;
}

/**
 * Extrai título preliminar a partir do Markdown.
 */
function extrairTitulo(conteudo: string, predefinido: string): string {
  const mTitle = conteudo.match(/Title:\s*(.+)/i) || conteudo.match(/^#\s+(.+)$/m);
  if (mTitle && mTitle[1]) {
    return mTitle[1].replace(/[\r\n]+/g, ' ').trim();
  }
  return predefinido;
}

export async function executarIngestao(sementes = SEMENTES_MUNICIPAIS): Promise<DocumentoIngerido[]> {
  console.log(`\n🚀 A iniciar ingestão com Cloudflare /markdown para ${sementes.length} sementes municipais...`);
  if (CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN) {
    console.log('✓ Credenciais Cloudflare detetadas (Modo: Browser Run REST API)');
  } else {
    console.log('ℹ Sem credenciais no .env (Modo: Cloudflare markdown.new Quick Action)');
  }

  await mkdir(PASTA_DESTINO, { recursive: true });

  const resultados: DocumentoIngerido[] = [];

  for (const semente of sementes) {
    console.log(`\n⏳ A extrair [${semente.categoria}] ${semente.url} ...`);
    try {
      const inicio = Date.now();
      const mdBruto = await extrairMarkdownCloudflare(semente.url);
      const duracao = Date.now() - inicio;

      const subpasta = join(PASTA_DESTINO, semente.categoria);
      await mkdir(subpasta, { recursive: true });

      const hashSha256 = createHash('sha256').update(mdBruto).digest('hex');
      const consultadoEm = new Date().toISOString();
      const titulo = extrairTitulo(mdBruto, semente.slug);

      const doc: DocumentoIngerido = {
        id: `DOC-${semente.categoria.toUpperCase()}-${semente.slug}`,
        url: semente.url,
        titulo,
        categoria: semente.categoria,
        consultadoEm,
        hashSha256,
        tamanhoBytes: Buffer.byteLength(mdBruto, 'utf-8'),
        conteudoMd: mdBruto,
        ficheiroLocal: join(semente.categoria, `${semente.slug}.md`),
      };

      const conteudoFinal = prepararFicheiroMarkdown(doc);
      const caminhoFicheiro = join(PASTA_DESTINO, doc.ficheiroLocal);
      await writeFile(caminhoFicheiro, conteudoFinal, 'utf-8');

      resultados.push(doc);
      console.log(`   ✓ Salvo em: ${doc.ficheiroLocal} (${(doc.tamanhoBytes / 1024).toFixed(1)} KB em ${duracao}ms)`);
      console.log(`   Título: "${titulo}"`);
    } catch (err) {
      console.error(`   ✖ Erro ao extrair ${semente.url}:`, err instanceof Error ? err.message : err);
    }
  }

  // Gravar índice JSON consolidado para consulta instantânea em tempo de execução
  const indice = resultados.map((r) => ({
    id: r.id,
    url: r.url,
    titulo: r.titulo,
    categoria: r.categoria,
    consultadoEm: r.consultadoEm,
    hashSha256: r.hashSha256,
    ficheiroLocal: r.ficheiroLocal,
    tamanhoBytes: r.tamanhoBytes,
  }));

  const caminhoIndice = join(PASTA_DESTINO, 'indice.json');
  await writeFile(caminhoIndice, JSON.stringify(indice, null, 2), 'utf-8');
  console.log(`\n✅ Ingestão concluída com sucesso: ${resultados.length}/${sementes.length} documentos ingeridos.`);
  console.log(`📄 Índice consolidado gerado em: data/conhecimento/indice.json\n`);

  return resultados;
}

// Execução autónoma se invocado diretamente
if (process.argv[1]?.endsWith('ingerir-conhecimento.ts')) {
  const urlArgIndex = process.argv.indexOf('--url');
  if (urlArgIndex !== -1 && process.argv[urlArgIndex + 1]) {
    const url = process.argv[urlArgIndex + 1];
    const slug = url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40);
    await executarIngestao([{ url, categoria: 'portal', slug }]);
  } else {
    await executarIngestao();
  }
}
