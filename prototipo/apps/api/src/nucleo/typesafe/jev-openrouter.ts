/**
 * Cliente do TypeSafe Jev via OpenRouter (typesafe/jev-router)
 *
 * Conforme ADR-024:
 * O TypeSafe Jev é acedido diretamente através da API do OpenRouter
 * com o modelo `typesafe/jev-router`, unificando todo o acesso a IA
 * numa única chave (`OPEN_ROUTER_API_TOKEN` ou `OPENROUTER_API_KEY`).
 * Sem dependência externa de chaves adicionais ou SDKs proprietários.
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
 * Cliente do Jev via OpenRouter (typesafe/jev-router)
 */
export class ClienteJevOpenRouter implements ClienteJev {
  readonly #token: string;

  constructor(token: string) {
    this.#token = token;
  }

  async julgar(pedido: { state: unknown; questions: Record<string, PerguntaJev> }): Promise<RespostaJev> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TEMPO_LIMITE_MS);

    try {
      const propriedades: Record<string, unknown> = {};
      const obrigatorios: string[] = [];

      for (const [nome, p] of Object.entries(pedido.questions)) {
        obrigatorios.push(nome);
        if (p.tipo === 'escolha') {
          const chaves = Object.keys(p.criterios);
          propriedades[nome] = {
            type: 'object',
            properties: {
              escolha: { type: 'string', enum: chaves },
              confianca: { type: 'number', minimum: 0, maximum: 1 },
              probabilidades: {
                type: 'object',
                properties: Object.fromEntries(chaves.map((c) => [c, { type: 'number', minimum: 0, maximum: 1 }])),
                required: chaves,
                additionalProperties: false,
              },
            },
            required: ['escolha', 'confianca', 'probabilidades'],
            additionalProperties: false,
          };
        } else {
          propriedades[nome] = {
            type: 'object',
            properties: {
              probabilidade: { type: 'number', minimum: 0, maximum: 1 },
            },
            required: ['probabilidade'],
            additionalProperties: false,
          };
        }
      }

      const schema = {
        type: 'object',
        properties: propriedades,
        required: obrigatorios,
        additionalProperties: false,
      };

      const corpo = {
        model: MODELO_JEV_OPENROUTER,
        messages: [
          {
            role: 'system',
            content:
              'És o motor de julgamento TypeSafe Jev. Avalia o estado e as perguntas de forma estritamente probabilística e estruturada.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              estado: pedido.state,
              perguntas: pedido.questions,
            }),
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'resposta_jev',
            strict: true,
            schema,
          },
        },
        temperature: 0.1,
      };

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#token}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://delegate.guimaraes.local',
          'X-Title': 'Delegate TypeSafe Jev',
        },
        body: JSON.stringify(corpo),
        signal: controller.signal,
      });

      if (!res.ok) {
        const textoErro = await res.text().catch(() => '');
        throw new Error(`OpenRouter HTTP ${res.status}: ${textoErro.slice(0, 200)}`);
      }

      const dados = (await res.json()) as any;
      const conteudo = dados?.choices?.[0]?.message?.content;
      if (!conteudo) {
        throw new Error('OpenRouter não devolveu conteúdo no formato esperado.');
      }

      const parsed = JSON.parse(conteudo);
      const answers: RespostaJev['answers'] = {};

      for (const [nome, p] of Object.entries(pedido.questions)) {
        const r = parsed[nome];
        if (p.tipo === 'escolha') {
          const chaves = Object.keys(p.criterios);
          const escolha = typeof r?.escolha === 'string' && chaves.includes(r.escolha) ? r.escolha : chaves[0];
          const probs: Record<string, number> = {};
          for (const k of chaves) {
            probs[k] = limitar(r?.probabilidades?.[k]);
          }
          answers[nome] = {
            choice: escolha,
            confidence: limitar(r?.confianca ?? probs[escolha]),
            probabilities: probs,
          };
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
 * Cria o cliente do TypeSafe Jev unificado via OpenRouter (ADR-024).
 * Utiliza OPEN_ROUTER_API_TOKEN ou OPENROUTER_API_KEY.
 */
export function criarClienteJev(): ClienteJev | null {
  const tokenOpenRouter = process.env.OPEN_ROUTER_API_TOKEN || process.env.OPENROUTER_API_KEY;

  if (tokenOpenRouter && tokenOpenRouter.trim().length > 0) {
    return new ClienteJevOpenRouter(tokenOpenRouter.trim());
  }

  return null;
}
