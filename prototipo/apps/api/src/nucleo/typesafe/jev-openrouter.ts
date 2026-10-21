/**
 * Cliente do Jev (Híbrido: TypeSafe System One Nativo + OpenRouter)
 *
 * Suporta dois motores de julgamento:
 * 1. TypeSafe System One Nativo (@typesafe-ai/sdk) via JEV_API_KEY ou TYPESAFE_API_KEY.
 * 2. Jev via OpenRouter (typesafe/jev-router) via OPEN_ROUTER_API_TOKEN ou OPENROUTER_API_KEY.
 *
 * Se existirem ambas as chaves (modo multi-api local), prioriza o System One nativo
 * com alternativa automática para o OpenRouter. Se existir apenas OpenRouter, funciona
 * diretamente via OpenRouter sem dependência de chaves adicionais.
 */
import { TypeSafeClient, choice as sdkChoice, noul as sdkNoul } from '@typesafe-ai/sdk';

export const MODELO_JEV_OPENROUTER = 'typesafe/jev-router';
export const MODELO_JEV_NATIVO = 'typesafe-jev-system-one';
const TEMPO_LIMITE_MS = 10_000;

export interface PerguntaEscolha {
  tipo: 'escolha';
  instrucao: string;
  criterios: Record<string, unknown>;
}

export interface PerguntaNoul {
  tipo: 'noul';
  instrucao: string;
}

export type PerguntaJev = PerguntaEscolha | PerguntaNoul;

export interface ChoiceResponse {
  choice: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export interface NoulResponse {
  noul: number;
}

export interface RespostaJev {
  answers: Record<string, ChoiceResponse | NoulResponse>;
  /** Modelo que respondeu de facto. */
  modelo: string;
}

export interface ClienteJev {
  julgar(pedido: { state: unknown; questions: Record<string, PerguntaJev> }): Promise<RespostaJev>;
}

export function choice(instrucao: string, criterios: Record<string, unknown>): PerguntaEscolha {
  return { tipo: 'escolha', instrucao, criterios };
}

export function noul(instrucao: string): PerguntaNoul {
  return { tipo: 'noul', instrucao };
}

const limitar = (valor: unknown): number => Math.min(1, Math.max(0, Number(valor) || 0));

/**
 * Cliente nativo do TypeSafe Jev System One via @typesafe-ai/sdk
 */
export class ClienteJevTypeSafe implements ClienteJev {
  readonly #client: TypeSafeClient;

  constructor(apiKey: string) {
    this.#client = new TypeSafeClient({ apiKey });
  }

  async julgar(pedido: { state: unknown; questions: Record<string, PerguntaJev> }): Promise<RespostaJev> {
    const perguntas = Object.entries(pedido.questions);
    const sdkQuestions: Record<string, any> = {};

    for (const [nome, p] of perguntas) {
      if (p.tipo === 'escolha') {
        sdkQuestions[nome] = sdkChoice(p.instrucao, p.criterios);
      } else {
        sdkQuestions[nome] = sdkNoul(p.instrucao);
      }
    }

    const resultado = await this.#client.systemOne({
      state: pedido.state as any,
      questions: sdkQuestions,
    });

    const answers: RespostaJev['answers'] = {};
    for (const [nome, ans] of Object.entries(resultado.answers)) {
      const a = ans as any;
      if (a?.type === 'choice' || a?.choice !== undefined) {
        answers[nome] = {
          choice: a.choice,
          confidence: a.confidence ?? 1.0,
          probabilities: a.probabilities ?? { [a.choice]: a.confidence ?? 1.0 },
        };
      } else if (a?.type === 'noul' || a?.noul !== undefined) {
        answers[nome] = {
          noul: a.noul,
        };
      }
    }

    return {
      answers,
      modelo: resultado.model || MODELO_JEV_NATIVO,
    };
  }
}

/**
 * Cliente do Jev via OpenRouter (typesafe/jev-router)
 */
export class ClienteJevOpenRouter implements ClienteJev {
  readonly #token: string;

  constructor(token: string) {
    this.#token = token;
  }

  async julgar(pedido: { state: unknown; questions: Record<string, PerguntaJev> }): Promise<RespostaJev> {
    const perguntas = Object.entries(pedido.questions);

    const propriedades: Record<string, unknown> = {};
    for (const [nome, p] of perguntas) {
      propriedades[nome] =
        p.tipo === 'escolha'
          ? {
              type: 'object',
              additionalProperties: false,
              required: ['escolha', 'confianca'],
              properties: {
                escolha: { type: 'string', enum: Object.keys(p.criterios) },
                confianca: { type: 'number' },
              },
            }
          : {
              type: 'object',
              additionalProperties: false,
              required: ['probabilidade'],
              properties: { probabilidade: { type: 'number' } },
            };
    }

    const textoPerguntas = perguntas
      .map(([nome, p]) =>
        p.tipo === 'escolha'
          ? [
              `### ${nome} (escolha uma opção)`,
              p.instrucao,
              ...Object.entries(p.criterios).map(([k, d]) => `- ${k}${d ? `: ${typeof d === 'string' ? d : JSON.stringify(d)}` : ''}`),
            ].join('\n')
          : [`### ${nome} (sim/não)`, p.instrucao, 'Indica a probabilidade, de 0 a 1, de a resposta ser «sim».'].join('\n'),
      )
      .join('\n\n');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TEMPO_LIMITE_MS);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.#token}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://delegate.guimaraes.pt',
          'X-Title': 'Delegate Guimarães · Henriques',
        },
        body: JSON.stringify({
          model: MODELO_JEV_OPENROUTER,
          messages: [
            {
              role: 'system',
              content:
                'Respondes a perguntas de julgamento sobre o estado fornecido, sem inventar factos. Devolve apenas JSON conforme o esquema. «confianca» e «probabilidade» são valores entre 0 e 1.',
            },
            { role: 'user', content: `Estado:\n${JSON.stringify(pedido.state)}\n\nPerguntas:\n\n${textoPerguntas}` },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'julgamento',
              strict: true,
              schema: { type: 'object', additionalProperties: false, required: Object.keys(propriedades), properties: propriedades },
            },
          },
          provider: { require_parameters: true },
          temperature: 0,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`OpenRouter devolveu HTTP ${res.status}`);
      }

      const dados = await res.json();
      const conteudo: string = dados.choices?.[0]?.message?.content ?? '';
      const json = JSON.parse(conteudo.replace(/^```(?:json)?\s*|\s*```$/g, ''));

      const answers: RespostaJev['answers'] = {};
      for (const [nome, p] of perguntas) {
        const r = json[nome];
        if (p.tipo === 'escolha') {
          if (!r || !Object.hasOwn(p.criterios, r.escolha)) {
            throw new Error(`Resposta inválida para «${nome}»: ${JSON.stringify(r)}`);
          }
          const confianca = limitar(r.confianca);
          answers[nome] = { choice: r.escolha, confidence: confianca, probabilities: { [r.escolha]: confianca } };
        } else {
          answers[nome] = { noul: limitar(r?.probabilidade) };
        }
      }

      return { answers, modelo: dados.model || MODELO_JEV_OPENROUTER };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Cliente Híbrido: tenta Jev Nativo primeiro (se configurado), com alternativa para OpenRouter.
 */
export class ClienteJevHibrido implements ClienteJev {
  readonly #tipoSafe: ClienteJevTypeSafe | null;
  readonly #openRouter: ClienteJevOpenRouter | null;

  constructor(opcoes: { keyJev?: string; tokenOpenRouter?: string }) {
    this.#tipoSafe = opcoes.keyJev ? new ClienteJevTypeSafe(opcoes.keyJev) : null;
    this.#openRouter = opcoes.tokenOpenRouter ? new ClienteJevOpenRouter(opcoes.tokenOpenRouter) : null;
  }

  async julgar(pedido: { state: unknown; questions: Record<string, PerguntaJev> }): Promise<RespostaJev> {
    if (this.#tipoSafe) {
      try {
        return await this.#tipoSafe.julgar(pedido);
      } catch (erro) {
        console.warn('TypeSafe Jev Nativo falhou; recurso a OpenRouter:', (erro as Error)?.message);
      }
    }

    if (this.#openRouter) {
      return await this.#openRouter.julgar(pedido);
    }

    throw new Error('Nenhum motor Jev (Nativo ou OpenRouter) disponível com sucesso.');
  }
}

/** Devolve um cliente Jev (Híbrido ou OpenRouter) conforme as chaves disponíveis no ambiente. */
export function criarClienteJev(): ClienteJev | null {
  const tokenOpenRouter = process.env.OPEN_ROUTER_API_TOKEN || process.env.OPENROUTER_API_KEY;
  const keyJev = process.env.JEV_API_KEY || process.env.TYPESAFE_API_KEY;

  if (keyJev && keyJev.trim().length > 0) {
    return new ClienteJevHibrido({
      keyJev: keyJev.trim(),
      tokenOpenRouter: tokenOpenRouter?.trim(),
    });
  }

  if (tokenOpenRouter && tokenOpenRouter.trim().length > 0) {
    return new ClienteJevOpenRouter(tokenOpenRouter.trim());
  }

  return null;
}
