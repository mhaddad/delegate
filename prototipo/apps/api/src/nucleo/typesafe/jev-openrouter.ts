/**
 * Cliente do Jev via OpenRouter
 *
 * Envia perguntas tipadas (escolha e noul) ao `typesafe/jev-router` pela mesma API
 * do redator. O Jev escolhe o modelo que responde e a resposta segue um JSON Schema
 * estrito. A confiança é declarada pelo modelo, não é uma probabilidade calibrada.
 */

export const MODELO_JEV_OPENROUTER = 'typesafe/jev-router';
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
  /** Modelo que respondeu de facto, escolhido pelo router. */
  modelo: string;
}

export function choice(instrucao: string, criterios: Record<string, unknown>): PerguntaEscolha {
  return { tipo: 'escolha', instrucao, criterios };
}

export function noul(instrucao: string): PerguntaNoul {
  return { tipo: 'noul', instrucao };
}

/** Devolve um cliente se houver chave do OpenRouter no ambiente; caso contrário, `null`. */
export function criarClienteJev(): ClienteJevOpenRouter | null {
  const token = process.env.OPEN_ROUTER_API_TOKEN || process.env.OPENROUTER_API_KEY;
  return token && token.trim().length > 0 ? new ClienteJevOpenRouter(token.trim()) : null;
}

const limitar = (valor: unknown): number => Math.min(1, Math.max(0, Number(valor) || 0));

export class ClienteJevOpenRouter {
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
