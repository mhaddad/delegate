/**
 * Redator OpenRouter do Afonso.
 *
 * Utiliza modelos gratuitos do OpenRouter (ex.: minimax/minimax-m3.1-flash:free)
 * para redigir respostas em linguagem natural simples e rigorosa (pt-PT),
 * estritamente fundamentadas em fontes oficiais e validadas pelo Verificador por Regra.
 */
import { VerificadorRegra } from './verificador.ts';

export interface ParametrosRedacao {
  pergunta: string;
  servicoId?: string;
  categoria?: string;
  comportamento?: 'responder' | 'abster' | 'encaminhar' | 'recusar';
  contextoFactos: string;
  fonteOficial: string;
  versao?: string;
  textoReferencia: string;
}

export interface ResultadoRedacao {
  texto: string;
  modeloUsado: string;
  tempoMs: number;
  geradoPorLlm: boolean;
}

export class RedatorOpenRouter {
  readonly #token: string | null;
  readonly #modelo: string;
  readonly #modelosCandidatos: string[];

  constructor(modelo = 'google/gemma-4-31b-it') {
    this.#token = process.env.OPEN_ROUTER_API_TOKEN || process.env.OPENROUTER_API_KEY || null;
    this.#modelo = modelo;
    this.#modelosCandidatos = [
      modelo,
      'google/gemma-4-31b-it:free',
      'google/gemma-4-26b-a4b-it:free',
      'minimax/minimax-m3.1-flash:free',
      'minimax/minimax-m3.1-flash',
      'openrouter/free',
    ];
  }

  /**
   * Redige uma resposta via OpenRouter fundamentada nos factos oficiais.
   * Se a chave não estiver configurada ou a chamada falhar, devolve o texto de referência.
   */
  async redigir(params: ParametrosRedacao): Promise<ResultadoRedacao> {
    const inicio = Date.now();

    if (!this.#token || this.#token.trim().length === 0) {
      return {
        texto: params.textoReferencia,
        modeloUsado: 'modelo-estatico-calibrado',
        tempoMs: 0,
        geradoPorLlm: false,
      };
    }

    const promptSistema = [
      'És o Afonso, o representante digital leal da pessoa e dos negócios em Guimarães.',
      'Missão: Diga o que precisa. O Afonso trata do resto.',
      '',
      'Regras inegociáveis:',
      '1. Comunica SEMPRE em português de Portugal (pt-PT).',
      '2. Sê conciso, educado, empático e extremamente rigoroso.',
      '3. Baseia-te EXCLUSIVAMENTE nos factos e condições fornecidos. NUNCA inventes taxas, custos, prazos ou regras.',
      '4. Se o comportamento for "abster", assume a abstenção formal: explica claramente que não inventas valores sem fonte única comprovada.',
      '5. Se o comportamento for "recusar", explica a recusa de forma educada por imperativo legal (ex.: privacidade RGPD ou juízo discricionário dos técnicos).',
      '6. Se o comportamento for "encaminhar", indica com precisão o serviço competente externo.',
      '',
      'Estrutura obrigatória da resposta:',
      '- Resposta direta em 1-2 frases claras;',
      '- Secção "<b>O que fazer agora:</b>" com passos numerados práticos;',
      '- Se houver algo que não é possível confirmar, secção "<b>O que não consigo confirmar:</b>";',
      `- Termina obrigatoriamente com a linha de fonte: "📄 Fonte: <i>${params.fonteOficial}</i>"`,
      '',
      'Usa apenas formatação HTML aceite pelo Telegram (<b>, <i>, <code>).',
    ].join('\n');

    const promptUtilizador = [
      `Factos e Requisitos Oficiais Comprovados:`,
      params.contextoFactos,
      '',
      `Fonte Oficial: ${params.fonteOficial}${params.versao ? ` (v${params.versao})` : ''}`,
      `Comportamento Obrigatório: ${params.comportamento ?? 'responder'}`,
      '',
      `Pergunta da pessoa: "${params.pergunta}"`,
    ].join('\n');

    for (const modelo of this.#modelosCandidatos) {
      try {
        console.log(`[OpenRouter] A redigir resposta com modelo ${modelo}...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.#token.trim()}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://delegate.guimaraes.pt',
            'X-Title': 'Delegate Guimarães · Afonso',
          },
          body: JSON.stringify({
            model: modelo,
            messages: [
              { role: 'system', content: promptSistema },
              { role: 'user', content: promptUtilizador },
            ],
            temperature: 0.2,
            max_tokens: 1200,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          console.warn(`[OpenRouter] Modelo ${modelo} devolveu HTTP ${res.status}`);
          continue;
        }

        const dados = await res.json();
        const textoGerado = dados.choices?.[0]?.message?.content?.trim();

        if (textoGerado && textoGerado.length > 20) {
          // Validação por Regra: garantir que nenhum número ou grandeza foi inventado
          const validacao = VerificadorRegra.verificar(textoGerado, [
            params.contextoFactos,
            params.textoReferencia,
            params.fonteOficial,
          ]);

          if (validacao.valido) {
            console.log(`✓ [OpenRouter] Resposta validada e aceite via ${dados.model || modelo} (${Date.now() - inicio}ms)`);
            return {
              texto: textoGerado,
              modeloUsado: dados.model || modelo,
              tempoMs: Date.now() - inicio,
              geradoPorLlm: true,
            };
          } else {
            console.warn(`[Afonso Redator] Rejeitado por número sem fonte: ${validacao.numerosSemFonte.join(', ')}`);
          }
        }
      } catch (erro) {
        console.warn(`[Afonso Redator] Erro no modelo ${modelo}:`, (erro as Error)?.message);
      }
    }

    // Se todos os modelos falharem ou houver rejeição de segurança, devolve o texto calibrado
    return {
      texto: params.textoReferencia,
      modeloUsado: 'modelo-estatico-calibrado',
      tempoMs: Date.now() - inicio,
      geradoPorLlm: false,
    };
  }
}
