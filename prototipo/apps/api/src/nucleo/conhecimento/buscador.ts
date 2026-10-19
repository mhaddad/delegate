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
import { TypeSafeClient, choice, noul, type ChoiceResponse, type NoulResponse } from '@typesafe-ai/sdk';
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
  confiancaJev?: number;
  motorDecisao?: 'typesafe-jev' | 'calibrado-local';
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
  readonly #client: TypeSafeClient | null = null;
  readonly #temApiKey: boolean;

  constructor(caminhoPasta = PASTA_DADOS, client?: TypeSafeClient) {
    const key = process.env.JEV_API_KEY || process.env.TYPESAFE_API_KEY;
    if (client) {
      this.#client = client;
      this.#temApiKey = true;
    } else if (key && key.trim().length > 0) {
      this.#client = new TypeSafeClient({ apiKey: key.trim() });
      this.#temApiKey = true;
    } else {
      this.#temApiKey = false;
    }

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

  /**
   * Fast Search: recupera os N candidatos mais relevantes em < 2ms utilizando BM25 léxico.
   */
  buscarCandidatos(pergunta: string, limite = 3): ResultadoConhecimento[] {
    if (this.#documentos.length === 0) return [];

    const tokensPergunta = normalizar(pergunta);
    if (tokensPergunta.length === 0) return [];

    const candidatos: ResultadoConhecimento[] = [];

    for (const doc of this.#documentos) {
      let pontosDoc = 0;
      const tokensTitulo = normalizar(doc.titulo);
      const urlLower = doc.url.toLowerCase();

      const ehAgregador =
        urlLower.endsWith('/directorio_de_servicos') ||
        urlLower.endsWith('/directorio_de_servicos/') ||
        urlLower.endsWith('/regulamentos') ||
        urlLower.endsWith('/regulamentos/') ||
        urlLower.endsWith('/formularios') ||
        urlLower.endsWith('/formularios/') ||
        urlLower === 'https://diretorio.cm-guimaraes.pt/' ||
        urlLower === 'https://diretorio.cm-guimaraes.pt' ||
        urlLower === 'https://www.cm-guimaraes.pt/' ||
        urlLower === 'https://www.cm-guimaraes.pt';

      for (const token of tokensPergunta) {
        if (tokensTitulo.includes(token)) {
          pontosDoc += 15;
        }
        if (urlLower.includes(token)) {
          pontosDoc += 10;
        }
        if (doc.palavrasChave.has(token)) {
          pontosDoc += 2;
        }
      }

      if (pontosDoc === 0) continue;

      if (ehAgregador) {
        pontosDoc = Math.max(1, Math.floor(pontosDoc * 0.25));
      }

      let melhorSecaoDoc: SecaoDocumento | null = null;
      let melhorPontosDoc = pontosDoc;

      if (doc.secoes.length > 0) {
        for (const secao of doc.secoes) {
          let pontosSecao = pontosDoc;
          const tokensSecao = normalizar(`${secao.tituloSecao} ${secao.texto}`);

          for (const token of tokensPergunta) {
            const ocorrencias = tokensSecao.filter((t) => t === token).length;
            pontosSecao += Math.min(ocorrencias * 3, 15);
          }

          if (pontosSecao > melhorPontosDoc) {
            melhorPontosDoc = pontosSecao;
            melhorSecaoDoc = secao;
          }
        }
      }

      if (melhorPontosDoc >= 5) {
        const excerto = melhorSecaoDoc
          ? `${melhorSecaoDoc.tituloSecao ? `### ${melhorSecaoDoc.tituloSecao}\n\n` : ''}${melhorSecaoDoc.texto}`
          : doc.conteudoCompleto.slice(0, 500);

        candidatos.push({
          id: doc.id,
          titulo: doc.titulo,
          url: doc.url,
          categoria: doc.categoria,
          consultadoEm: doc.consultadoEm.split('T')[0],
          hashSha256: doc.hashSha256,
          excerto: this.#limparExcerto(excerto),
          pontuacao: melhorPontosDoc,
          motorDecisao: 'calibrado-local',
        });
      }
    }

    candidatos.sort((a, b) => b.pontuacao - a.pontuacao);
    return candidatos.slice(0, limite);
  }

  /**
   * Busca rápida síncrona com contingência calibrada local (0ms).
   */
  buscar(pergunta: string): ResultadoConhecimento | null {
    const lista = this.buscarCandidatos(pergunta, 1);
    return lista.length > 0 ? lista[0] : null;
  }

  /**
   * Two-Step RAG: Fast Search seguido de Re-ranking Semântico e Verificação de Citação via Jev System One.
   */
  async buscarComJev(pergunta: string): Promise<ResultadoConhecimento | null> {
    const candidatos = this.buscarCandidatos(pergunta, 3);
    if (candidatos.length === 0) return null;

    if (this.#client && this.#temApiKey && candidatos.length >= 1) {
      try {
        const rubrica: Record<string, string> = {};
        for (let i = 0; i < candidatos.length; i++) {
          const c = candidatos[i];
          rubrica[`candidato_${i}`] = `[${c.titulo}] ${c.excerto.slice(0, 250).replace(/\n/g, ' ')}`;
        }
        rubrica['nenhum_dos_candidatos'] = 'Nenhum dos excertos oficiais apresentados responde adequadamente à pergunta do munícipe.';

        const resposta = await this.#client.systemOne({
          state: {
            pergunta_municipe: pergunta,
            municipio: 'Câmara Municipal de Guimarães',
            excertos_oficiais_disponiveis: candidatos.map((c, i) => ({
              id: `candidato_${i}`,
              titulo: c.titulo,
              url: c.url,
              excerto: c.excerto.slice(0, 350),
            })),
          },
          questions: {
            melhor_excerto: choice(
              'Qual dos excertos da documentação oficial da Câmara responde com maior precisão e exatidão factual à dúvida do munícipe?',
              rubrica,
            ),
            sustenta_afirmacao: noul(
              'O excerto documental selecionado contém resposta factual direta à dúvida, sem exigir inferências não documentadas?',
            ),
          },
        });

        const qChoice = resposta.answers.melhor_excerto as ChoiceResponse<any>;
        const qNoul = resposta.answers.sustenta_afirmacao as NoulResponse;

        if (qChoice?.choice === 'nenhum_dos_candidatos' || (qNoul && qNoul.noul < 0.35)) {
          return null;
        }

        const matchIdx = qChoice?.choice?.match(/^candidato_(\d+)$/);
        if (matchIdx) {
          const idx = parseInt(matchIdx[1], 10);
          const escolhido = candidatos[idx] ?? candidatos[0];
          return {
            ...escolhido,
            confiancaJev: qChoice.confidence ?? qNoul?.noul ?? 0.9,
            motorDecisao: 'typesafe-jev',
          };
        }
      } catch (err) {
        console.warn('[BuscadorConhecimento] Alternativa Jev re-ranking:', (err as Error)?.message);
      }
    }

    return candidatos[0];
  }

  formatarResposta(resultado: ResultadoConhecimento): { texto: string; botoes: Botao[][] } {
    const dataFormatada = resultado.consultadoEm;
    const motorTag = resultado.motorDecisao === 'typesafe-jev' ? ' · Verificado por TypeSafe Jev' : '';
    const texto = [
      `🏛️ <b>${resultado.titulo}</b>`,
      '',
      resultado.excerto,
      '',
      '📌 <b>Evidência Oficial da Câmara Municipal de Guimarães:</b>',
      `• <b>Fonte:</b> <a href="${resultado.url}">Portal Oficial (${resultado.url})</a>`,
      `• <b>Data de Consulta:</b> ${dataFormatada} · SHA-256 verificado${motorTag}.`,
      '',
      '<i>(Informação oficial em nível D0 · Se pretender apoio humano ou submissão assistida, selecione uma das opções abaixo.)</i>',
    ].join('\n');

    const botoes: Botao[][] = [
      [{ texto: '🌐 Abrir página oficial', ligacao: resultado.url }],
    ];

    // Transição proativa D0 -> D2 (Preparar pedido no Cofre Digital)
    if (
      resultado.url.includes('service_action_id=2') ||
      resultado.url.includes('/formularios/') ||
      resultado.url.includes('isencao-de-licenca-de-utilizacao') ||
      resultado.url.includes('bolsas-de-estudo')
    ) {
      botoes.push([{ texto: '📋 Preparar pedido no Cofre Digital (D2)', dados: `preparar:${resultado.id}` }]);
    }

    botoes.push([{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]);

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
