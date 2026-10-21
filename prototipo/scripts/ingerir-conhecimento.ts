/**
 * Script de Ingestão e Rastreio da Base de Conhecimento Municipal via Cloudflare /markdown
 *
 * Suporta dois modos de extração:
 * 1. Cloudflare Browser Run REST API oficial:
 *    POST https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-run/markdown
 *    (quando CLOUDFLARE_ACCOUNT_ID e CLOUDFLARE_API_TOKEN têm permissões ativas)
 * 2. Fallback Cloudflare Zero-Config (markdown.new):
 *    GET https://markdown.new/<URL>
 *    (executa de imediato sem necessidade de credenciais prévias)
 *
 * Capacidades:
 * - Rastreio recursivo (crawler) do domínio oficial da autarquia (*.cm-guimaraes.pt e *.guimaraes.pt).
 * - Descoberta automática de todos os serviços, regulamentos, urbanismo, procedimentos e formulários.
 * - Cache local para evitar downloads redundantes.
 * - Concorrência controlada para alta velocidade e estabilidade.
 * - Geração de índice estruturado com hashes SHA-256 e proveniência formal.
 *
 * Uso:
 *   npm run ingerir
 *   npx tsx scripts/ingerir-conhecimento.ts --limite=150
 *   npx tsx scripts/ingerir-conhecimento.ts --force
 *   npx tsx scripts/ingerir-conhecimento.ts --url https://diretorio.cm-guimaraes.pt/
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN?.trim();

const PASTA_DESTINO = join(import.meta.dirname, '..', 'data', 'conhecimento');

export type CategoriaDocumento = 'diretorio' | 'formularios' | 'urbanismo' | 'portal' | 'regulamentos';

export interface DocumentoIngerido {
  id: string;
  url: string;
  titulo: string;
  categoria: CategoriaDocumento;
  consultadoEm: string;
  hashSha256: string;
  tamanhoBytes: number;
  conteudoMd: string;
  ficheiroLocal: string;
}

/** Sementes fundamentais para iniciar a descoberta de todo o domínio municipal */
export const SEMENTES_RAIZ: Array<{ url: string; categoria: CategoriaDocumento; slug: string }> = [
  {
    url: 'https://diretorio.cm-guimaraes.pt/',
    categoria: 'diretorio',
    slug: 'diretorio-principal',
  },
  {
    url: 'https://diretorio.cm-guimaraes.pt/diretorio-de-servicos/directorio_de_servicos',
    categoria: 'diretorio',
    slug: 'catalogo-completo-servicos',
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
    url: 'https://www.cm-guimaraes.pt/',
    categoria: 'portal',
    slug: 'portal-principal',
  },
  {
    url: 'https://www.cm-guimaraes.pt/servicos-online/formularios',
    categoria: 'formularios',
    slug: 'formularios-municipais',
  },
  {
    url: 'https://www.cm-guimaraes.pt/viver/balcao-virtual/procedimentos',
    categoria: 'formularios',
    slug: 'procedimentos-balcao-virtual',
  },
  {
    url: 'https://www.cm-guimaraes.pt/municipio/camara-municipal/publicacoes/regulamentos',
    categoria: 'regulamentos',
    slug: 'regulamentos-municipais',
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
  {
    url: 'https://www.cm-guimaraes.pt/viver/balcao-virtual/horarios-de-atendimento',
    categoria: 'portal',
    slug: 'horarios-de-atendimento',
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
    } catch {
      // Falha silenciosa para ativar contingência
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
 * Categoriza uma URL municipal para organização lógica nos diretórios.
 */
export function categorizarUrl(url: string): CategoriaDocumento {
  const u = url.toLowerCase();
  if (u.includes('diretorio.cm-guimaraes.pt') || u.includes('/diretorio-de-servicos/')) {
    return 'diretorio';
  }
  if (u.includes('regulamento') || u.includes('/publicacoes/regulamentos')) {
    return 'regulamentos';
  }
  if (u.includes('urbanismo') || u.includes('pdm.guimaraes.pt') || u.includes('websig')) {
    return 'urbanismo';
  }
  if (u.includes('formulario') || u.includes('procedimento') || u.includes('documento')) {
    return 'formularios';
  }
  return 'portal';
}

/**
 * Gera um slug representativo e estável a partir da URL.
 */
export function gerarSlug(url: string): string {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    // Preservar o caminho específico removendo apenas o prefixo genérico
    const filtered = pathParts.filter((p) => p !== 'diretorio-de-servicos' && p !== 'directorio_de_servicos');
    const slugBase = (filtered.length > 0 ? filtered.join('-') : pathParts.join('-')) || 'index';

    // Se houver parâmetro procedure_id, incluir sufixo identificador
    const procId = parsed.searchParams.get('procedure_id');
    const queryExtra = procId ? `-${procId.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}` : '';

    return `${slugBase}${queryExtra}`
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 75);
  } catch {
    return url.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 75);
  }
}

/**
 * Extrai título preliminar a partir do Markdown priorizando cabeçalhos substantivos.
 */
export function extrairTitulo(conteudo: string, predefinido: string): string {
  // Se o frontmatter tiver título explícito substantivo, usar
  const mFm = conteudo.match(/^titulo:\s*"([^"]+)"/m);
  if (
    mFm &&
    mFm[1] &&
    !mFm[1].toLowerCase().includes('diretório de serviços') &&
    !mFm[1].toLowerCase().includes('câmara municipal')
  ) {
    return mFm[1].trim();
  }

  // 1. Procurar primeiro cabeçalho H1 ou H2 substantivo no corpo do Markdown
  const mHeadings = conteudo.match(/^#{1,2}\s+([A-Za-zÀ-ÖØ-öø-ÿ0-9].+)$/gm);
  if (mHeadings) {
    for (const h of mHeadings) {
      const clean = h.replace(/^#{1,2}\s+/, '').trim();
      const lower = clean.toLowerCase();
      if (
        clean.length > 2 &&
        !lower.includes('diretório de serviços') &&
        !lower.includes('câmara municipal') &&
        !lower.includes('cookies') &&
        !lower.includes('erro 404') &&
        !lower.includes('procedimentos a decorrer') &&
        !lower.includes('serviços online')
      ) {
        return clean;
      }
    }
  }

  // 2. Fallback para Title: ...
  const mTitle = conteudo.match(/Title:\s*(.+)/i) || conteudo.match(/^#\s+(.+)$/m);
  if (mTitle && mTitle[1]) {
    const limpo = mTitle[1].replace(/[\r\n]+/g, ' ').trim();
    if (limpo.length > 0 && !limpo.toLowerCase().includes('página não encontrada')) {
      return limpo;
    }
  }
  return predefinido;
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
 * Extrai links internos pertencentes ao domínio da Câmara Municipal de Guimarães.
 */
export function extrairLinksInternos(conteudoMd: string, baseUrl: string): string[] {
  const regexLink = /\[([^\]]*)\]\((https?:\/\/[a-zA-Z0-9.-]*cm-guimaraes\.pt[^)\s]*|https?:\/\/[a-zA-Z0-9.-]*guimaraes\.pt[^)\s]*|\/[a-zA-Z0-9_/-]+[^)\s]*)\)/g;
  const encontrados: string[] = [];
  const matches = conteudoMd.matchAll(regexLink);

  let origin = 'https://www.cm-guimaraes.pt';
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    // Usar predefinido
  }

  for (const m of matches) {
    let link = m[2];
    if (link.startsWith('/')) {
      link = `${origin}${link}`;
    }

    // Limpar âncoras
    link = link.split('#')[0];

    // Ignorar recursos estáticos, cookies, desativados
    if (
      link.match(/\.(pdf|jpg|jpeg|png|gif|svg|zip|doc|docx|xls|xlsx|css|js|mp4)$/i) ||
      link.includes('personalizar-cookies') ||
      link.includes('politica-de-cookies') ||
      link.includes('pages/1513') ||
      link.includes('pages/721')
    ) {
      continue;
    }

    // Normalizar %5F para _
    link = link.replace(/%5F/gi, '_');

    encontrados.push(link);
  }

  return encontrados;
}

export interface OpcoesRastreio {
  limiteMaximo?: number;
  concorrencia?: number;
  forcarRecarregar?: boolean;
}

/**
 * Executa o rastreio abrangente (crawler) de todo o domínio municipal de Guimarães.
 */
export async function rastrearDominioMunicipal(opcoes: OpcoesRastreio = {}): Promise<DocumentoIngerido[]> {
  const limite = opcoes.limiteMaximo ?? 120;
  const concorrencia = opcoes.concorrencia ?? 3;
  const forcar = opcoes.forcarRecarregar ?? false;

  console.log(`\n🌐 A iniciar rastreio abrangente do domínio municipal de Guimarães...`);
  console.log(`📊 Limite máximo de páginas: ${limite} | Concorrência paralela: ${concorrencia}`);

  await mkdir(PASTA_DESTINO, { recursive: true });

  const filaUrls: string[] = [];
  const urlsProcessadas = new Set<string>();
  const resultados: DocumentoIngerido[] = [];

  // 1. Inserir sementes iniciais na fila
  for (const sem of SEMENTES_RAIZ) {
    filaUrls.push(sem.url);
  }

  // 2. Processar fila com concorrência controlada
  let emExecucao = 0;
  let concluidos = 0;

  async function processarProximo(): Promise<void> {
    if (filaUrls.length === 0 || urlsProcessadas.size >= limite) {
      return;
    }

    const urlAtual = filaUrls.shift()!;
    if (urlsProcessadas.has(urlAtual)) {
      return processarProximo();
    }
    urlsProcessadas.add(urlAtual);

    const sementePrevia = SEMENTES_RAIZ.find((s) => s.url === urlAtual);
    const categoria = sementePrevia?.categoria ?? categorizarUrl(urlAtual);
    const slug = sementePrevia?.slug ?? gerarSlug(urlAtual);
    const ficheiroRelativo = join(categoria, `${slug}.md`);
    const caminhoFicheiro = join(PASTA_DESTINO, ficheiroRelativo);

    // Se o ficheiro já existe localmente e não forçamos recarregamento, reutilizamos a cache
    if (!forcar && existsSync(caminhoFicheiro)) {
      try {
        const conteudo = readFileSync(caminhoFicheiro, 'utf-8');
        const hashSha256 = createHash('sha256').update(conteudo).digest('hex');
        const titulo = extrairTitulo(conteudo, slug);

        const doc: DocumentoIngerido = {
          id: `DOC-${categoria.toUpperCase()}-${slug}`,
          url: urlAtual,
          titulo,
          categoria,
          consultadoEm: new Date().toISOString().split('T')[0],
          hashSha256,
          tamanhoBytes: Buffer.byteLength(conteudo, 'utf-8'),
          conteudoMd: conteudo,
          ficheiroLocal: ficheiroRelativo,
        };
        resultados.push(doc);
        concluidos++;

        // Extrair novos links a partir do ficheiro em cache
        const novosLinks = extrairLinksInternos(conteudo, urlAtual);
        for (const nl of novosLinks) {
          if (!urlsProcessadas.has(nl) && !filaUrls.includes(nl) && urlsProcessadas.size + filaUrls.length < limite * 2) {
            filaUrls.push(nl);
          }
        }

        console.log(`[Cache ${concluidos}/${limite}] ${urlAtual} -> ${ficheiroRelativo}`);
        return processarProximo();
      } catch {
        // Se falhar leitura de cache, faz download normal
      }
    }

    // Download via Cloudflare
    try {
      const inicio = Date.now();
      const mdBruto = await extrairMarkdownCloudflare(urlAtual);
      const duracao = Date.now() - inicio;

      // Se devolveu erro 404 da página, ignorar
      if (mdBruto.includes('# Erro 404') || mdBruto.includes('Página Não Encontrada')) {
        return processarProximo();
      }

      const subpasta = join(PASTA_DESTINO, categoria);
      await mkdir(subpasta, { recursive: true });

      const hashSha256 = createHash('sha256').update(mdBruto).digest('hex');
      const consultadoEm = new Date().toISOString().split('T')[0];
      const titulo = extrairTitulo(mdBruto, slug);

      const doc: DocumentoIngerido = {
        id: `DOC-${categoria.toUpperCase()}-${slug}`,
        url: urlAtual,
        titulo,
        categoria,
        consultadoEm,
        hashSha256,
        tamanhoBytes: Buffer.byteLength(mdBruto, 'utf-8'),
        conteudoMd: mdBruto,
        ficheiroLocal: ficheiroRelativo,
      };

      const conteudoFinal = prepararFicheiroMarkdown(doc);
      await writeFile(caminhoFicheiro, conteudoFinal, 'utf-8');

      resultados.push(doc);
      concluidos++;

      console.log(`[Extraído ${concluidos}/${limite}] (${duracao}ms) ${urlAtual} -> ${doc.titulo}`);

      // Descobrir novos links para alimentar a fila recursiva
      const novosLinks = extrairLinksInternos(mdBruto, urlAtual);
      for (const nl of novosLinks) {
        if (!urlsProcessadas.has(nl) && !filaUrls.includes(nl) && urlsProcessadas.size + filaUrls.length < limite * 2) {
          filaUrls.push(nl);
        }
      }
    } catch (err) {
      console.warn(`[Aviso ${urlAtual}] ${err instanceof Error ? err.message : err}`);
    }

    return processarProximo();
  }

  // Despacho concorrente
  const promessas: Promise<void>[] = [];
  for (let i = 0; i < concorrencia; i++) {
    promessas.push(
      (async () => {
        while (filaUrls.length > 0 && urlsProcessadas.size < limite) {
          await processarProximo();
        }
      })(),
    );
  }

  await Promise.all(promessas);

  // 3. Atualizar índice consolidado
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

  console.log(`\n✅ Rastreio e ingestão concluídos com sucesso!`);
  console.log(`📚 Total de páginas do domínio indexadas: ${resultados.length}`);
  console.log(`📄 Índice consolidado atualizado em: data/conhecimento/indice.json\n`);

  return resultados;
}

// Execução autónoma por linha de comando
if (process.argv[1]?.endsWith('ingerir-conhecimento.ts')) {
  const urlArgIndex = process.argv.indexOf('--url');
  const limiteArg = process.argv.find((a) => a.startsWith('--limite='));
  const forceArg = process.argv.includes('--force');

  const limite = limiteArg ? parseInt(limiteArg.split('=')[1], 10) : 120;

  if (urlArgIndex !== -1 && process.argv[urlArgIndex + 1]) {
    const url = process.argv[urlArgIndex + 1];
    const cat = categorizarUrl(url);
    const slug = gerarSlug(url);
    console.log(`A extrair URL única: ${url}`);
    const md = await extrairMarkdownCloudflare(url);
    const hash = createHash('sha256').update(md).digest('hex');
    const doc: DocumentoIngerido = {
      id: `DOC-${cat.toUpperCase()}-${slug}`,
      url,
      titulo: extrairTitulo(md, slug),
      categoria: cat,
      consultadoEm: new Date().toISOString().split('T')[0],
      hashSha256: hash,
      tamanhoBytes: Buffer.byteLength(md, 'utf-8'),
      conteudoMd: md,
      ficheiroLocal: join(cat, `${slug}.md`),
    };
    await mkdir(join(PASTA_DESTINO, cat), { recursive: true });
    await writeFile(join(PASTA_DESTINO, doc.ficheiroLocal), prepararFicheiroMarkdown(doc), 'utf-8');
    console.log(`✓ Gravado em ${doc.ficheiroLocal}`);
  } else {
    await rastrearDominioMunicipal({
      limiteMaximo: limite,
      concorrencia: 4,
      forcarRecarregar: forceArg,
    });
  }
}
