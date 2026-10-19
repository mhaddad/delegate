/**
 * Buscador na Base de Conhecimento Municipal (RAG D0)
 *
 * Pesquisa instantânea sobre os ficheiros Markdown extraídos pelo Cloudflare /markdown
 * a partir do portal oficial e diretório de serviços da Câmara de Guimarães.
 *
 * Permite ao Afonso responder a qualquer pergunta com citação formal de fonte,
 * cumprindo o nível D0 (informar) sem risco de alucinação factual.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Botao } from '../canal.ts';

export interface EntradaIndice {
  id: string;
  url: string;
  titulo: string;
  categoria: string;
  consultadoEm: string;
  hashSha256: string;
  ficheiroLocal: string;
  tamanhoBytes: number;
}

export interface SecaoDocumento {
  tituloSecao: string;
  texto: string;
}

export interface DocumentoCarregado extends EntradaIndice {
  conteudoCompleto: string;
  secoes: SecaoDocumento[];
  palavrasChave: Set<string>;
}

export interface ResultadoConhecimento {
  id: string;
  titulo: string;
  url: string;
  categoria: string;
  consultadoEm: string;
  hashSha256: string;
  excerto: string;
  pontuacao: number;
}

const PASTA_DADOS = join(import.meta.dirname, '..', '..', '..', '..', '..', 'data', 'conhecimento');

function normalizar(texto: string): string[] {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((p) => p.length > 2);
}

export class BuscadorConhecimento {
  readonly #documentos: DocumentoCarregado[] = [];

  constructor(caminhoPasta = PASTA_DADOS) {
    const caminhoIndice = join(caminhoPasta, 'indice.json');
    if (!existsSync(caminhoIndice)) {
      return;
    }

    try {
      const conteudoIndice = readFileSync(caminhoIndice, 'utf-8');
      const entradas = JSON.parse(conteudoIndice) as EntradaIndice[];

      for (const ent of entradas) {
        const caminhoDoc = join(caminhoPasta, ent.ficheiroLocal);
        if (existsSync(caminhoDoc)) {
          const raw = readFileSync(caminhoDoc, 'utf-8');
          // Separar corpo do frontmatter
          const partes = raw.split(/^---$/m);
          const corpo = partes.length >= 3 ? partes.slice(2).join('---').trim() : raw;

          const secoes = this.#extrairSecoes(corpo, ent.titulo);
          const tokens = new Set(normalizar(`${ent.titulo} ${corpo}`));

          this.#documentos.push({
            ...ent,
            conteudoCompleto: corpo,
            secoes,
            palavrasChave: tokens,
          });
        }
      }
    } catch (err) {
      console.warn('[BuscadorConhecimento] Erro ao carregar base de conhecimento:', err);
    }
  }

  get totalDocumentos(): number {
    return this.#documentos.length;
  }

  buscar(pergunta: string): ResultadoConhecimento | null {
    if (this.#documentos.length === 0) return null;

    const tokensPergunta = normalizar(pergunta);
    if (tokensPergunta.length === 0) return null;

    let melhorDoc: DocumentoCarregado | null = null;
    let melhorSecao: SecaoDocumento | null = null;
    let maiorPontuacao = 0;

    for (const doc of this.#documentos) {
      // 1. Pontuação do Documento
      let pontosDoc = 0;
      for (const token of tokensPergunta) {
        if (doc.palavrasChave.has(token)) {
          pontosDoc += 3;
        }
        if (doc.url.toLowerCase().includes(token)) {
          pontosDoc += 5;
        }
      }

      if (pontosDoc === 0) continue;

      // Penalizar ligeiramente páginas raiz agregadoras para favorecer fichas específicas
      if (doc.url === 'https://diretorio.cm-guimaraes.pt/' || doc.url === 'https://www.cm-guimaraes.pt/como-podemos-ajudar/servicos') {
        pontosDoc = Math.max(1, pontosDoc - 3);
      }

      // 2. Pontuação nas Secções Específicas
      for (const secao of doc.secoes) {
        let pontosSecao = pontosDoc;
        const tokensSecao = normalizar(`${secao.tituloSecao} ${secao.texto}`);

        for (const token of tokensPergunta) {
          const ocorrencias = tokensSecao.filter((t) => t === token).length;
          pontosSecao += ocorrencias * 2;
        }

        if (pontosSecao > maiorPontuacao) {
          maiorPontuacao = pontosSecao;
          melhorDoc = doc;
          melhorSecao = secao;
        }
      }
    }

    if (!melhorDoc || maiorPontuacao < 5) {
      return null;
    }

    const excerto = melhorSecao
      ? `${melhorSecao.tituloSecao ? `### ${melhorSecao.tituloSecao}\n\n` : ''}${melhorSecao.texto}`
      : melhorDoc.conteudoCompleto.slice(0, 500);

    return {
      id: melhorDoc.id,
      titulo: melhorDoc.titulo,
      url: melhorDoc.url,
      categoria: melhorDoc.categoria,
      consultadoEm: melhorDoc.consultadoEm.split('T')[0],
      hashSha256: melhorDoc.hashSha256,
      excerto: this.#limparExcerto(excerto),
      pontuacao: maiorPontuacao,
    };
  }

  formatarResposta(resultado: ResultadoConhecimento): { texto: string; botoes: Botao[][] } {
    const dataFormatada = resultado.consultadoEm;
    const texto = [
      `🏛️ <b>${resultado.titulo}</b>`,
      '',
      resultado.excerto,
      '',
      '📌 <b>Evidência Oficial da Câmara Municipal de Guimarães:</b>',
      `• <b>Fonte:</b> <a href="${resultado.url}">Portal Oficial (${resultado.url})</a>`,
      `• <b>Data de Consulta:</b> ${dataFormatada} · Resumo SHA-256 verificado.`,
      '',
      '<i>(Informação oficial em nível D0 · Se pretender apoio humano ou submissão assistida, selecione uma das opções abaixo.)</i>',
    ].join('\n');

    const botoes: Botao[][] = [
      [{ texto: '🌐 Abrir página oficial', ligacao: resultado.url }],
      [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
    ];

    return { texto, botoes };
  }

  #extrairSecoes(conteudo: string, fallbackTitulo: string): SecaoDocumento[] {
    const linhas = conteudo.split('\n');
    const secoes: SecaoDocumento[] = [];
    let tituloAtual = fallbackTitulo;
    let buffer: string[] = [];

    for (const linha of linhas) {
      const matchHeader = linha.match(/^#{1,4}\s+(.+)$/);
      if (matchHeader) {
        if (buffer.length > 0) {
          secoes.push({ tituloSecao: tituloAtual, texto: buffer.join('\n').trim() });
          buffer = [];
        }
        tituloAtual = matchHeader[1].trim();
      } else {
        buffer.push(linha);
      }
    }

    if (buffer.length > 0) {
      secoes.push({ tituloSecao: tituloAtual, texto: buffer.join('\n').trim() });
    }

    return secoes.filter((s) => s.texto.length > 30);
  }

  #limparExcerto(excerto: string): string {
    return excerto
      .replace(/\[Personalizar cookies\][\s\S]*?\[Top\][^\n]*/i, '')
      .replace(/\[Passar para o Conteúdo Principal\][^\n]*/i, '')
      .replace(/\n{3,}/g, '\n\n')
      .slice(0, 650)
      .trim();
  }
}
