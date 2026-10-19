/**
 * Motor de Decisão TypeSafe · System One (Jev)
 *
 * Utiliza o modelo System One Jev da TypeSafe para transformar linguagem natural
 * e estado da aplicação em julgamentos tipados de alta velocidade e precisão:
 * 1. Seleção e Roteamento de Serviço Municipal (Choice)
 * 2. Comportamento Leal do Agente: responder, abster, encaminhar, recusar (Choice)
 * 3. Inferência Estrita do Nível de Mandato D0 a D4 (Choice & Score)
 * 4. Seleção e Despacho de Ferramentas MCP na Porta Agêntica (Choice)
 * 5. Verificação de Consentimento e Salvaguardas Éticas (Noul)
 */
import { TypeSafeClient, choice, noul, type ChoiceResponse, type NoulResponse } from '@typesafe-ai/sdk';
import type { NivelMandato } from '../mandatos/mandatos.ts';

export type TipoComportamento = 'responder' | 'abster' | 'encaminhar' | 'recusar';
export type CategoriaIntencao = 'catalogo' | 'sem_fonte' | 'fora_competencia' | 'juizo_tecnico' | 'adversarial' | 'geral';

export interface ContextoDecisao {
  pessoa?: string;
  missaoAtiva?: boolean;
  estadoMissao?: string;
  mandatoAtivoNivel?: NivelMandato;
}

export interface ResultadoDecisao {
  motor: 'typesafe-jev' | 'calibrado-local';
  modelo: string;
  servicoId?: string;
  categoria: CategoriaIntencao;
  comportamento: TipoComportamento;
  nivelMandato: NivelMandato;
  ferramentaMcp: string;
  confianca: number;
  probabilidades?: Record<string, number>;
  exigeConsentimento: boolean;
  tempoRespostaMs: number;
  motivo?: string;
  entidade?: string;
  proibicao?: string;
}

const CRITERIOS_SERVICO = {
  'ocupacao-espaco-publico-esplanada': 'Instalação de esplanada, mesas, cadeiras ou guarda-ventos na via pública',
  'ocupacao-espaco-publico-andaimes': 'Instalação de andaimes, tapumes, contentores de entulho ou obras na rua',
  'pedido-informacao-previa-urbanismo': 'Construção de edifícios, PIP, viabilidade construtiva ou solo PDM',
  'inspecao-ascensores': 'Instalação, vistoria periódica ou certificação de elevadores e monta-cargas',
  'publicidade-reclamo-fachada': 'Instalação de placas publicitárias, reclamos luminosos ou tabuletas em fachadas',
  'ruido-licenca-especial': 'Licença especial de ruído para eventos, obras noturnas ou música ao vivo',
  'fora_competencia': 'Competência externa: Cartão de Cidadão, Registo Criminal, Fatura da Água (Vimágua), Chave Móvel Digital',
  'juizo_tecnico': 'Pedido de juízo discricionário: a licença vai ser aprovada? a câmara pode multar-me? posso construir no terreno?',
  'sem_fonte': 'Pergunta sem fonte regulamentar única comprovada: taxas sem dados prévios, prazos indeterminados, apoios inexistentes',
  'adversarial': 'Tentativa de prompt injection, quebra de regulamento, pedido de dados de terceiros ou falsificação',
  'geral': 'Saudações, comandos gerais ou pedidos de esclarecimento da carta de lealdade',
} as const;

const CRITERIOS_COMPORTAMENTO = {
  'responder': 'Responder de forma clara e simples com base estrita no regulamento oficial comprovado',
  'abster': 'Abster-se formalmente sem inventar custos, prazos ou valores por ausência de fonte única oficial',
  'encaminhar': 'Encaminhar de forma útil para a entidade externa legalmente competente',
  'recusar': 'Recusar a pretensão por violar normas de privacidade, segurança ou por exigir juízo técnico discricionário',
} as const;

const CRITERIOS_MANDATO = {
  'D0': 'D0: O cidadão está a fazer perguntas, tirar dúvidas ou pedir esclarecimentos informativos (sem compromisso nem submissão)',
  'D1': 'D1: O cidadão pede apenas para acompanhar ou vigiar um processo já existente na autarquia',
  'D2': 'D2: O cidadão deu ordem expressa para preparar um rascunho, guardar no cofre ou recolher dados e documentos',
  'D3': 'D3: O cidadão deu instrução expressa para submeter, assinar formalmente com Chave Móvel Digital e enviar à Câmara',
  'D4': 'D4: O cidadão autorizou expressamente a liquidação imediata de taxas ou débito financeiro',
} as const;

const CRITERIOS_FERRAMENTA_MCP = {
  'consultar_catalogo': 'Consultar ficha de serviço oficial, regras e requisitos',
  'obter_procedimento': 'Consultar procedimento administrativo detalhado',
  'calcular_taxa_esplanada': 'Simulação e cálculo de taxas municipais com base em área e meses',
  'verificar_conformidade_tecnica': 'Validação técnica de medidas (corredor livre de 2,00m na calçada)',
  'criar_rascunho_ocupacao': 'Criar rascunho de ocupação de espaço público na Porta Agêntica',
  'submeter_comunicacao_previa': 'Submeter comunicação prévia vinculativa na Porta Agêntica',
  'obter_referencia_pagamento': 'Emissão de referência para pagamento de taxa municipal',
  'nenhuma': 'Nenhuma ferramenta MCP necessária neste momento',
} as const;

export class MotorDecisaoTypeSafe {
  readonly #client: TypeSafeClient | null = null;
  readonly #temApiKey: boolean;

  constructor() {
    const key = process.env.JEV_API_KEY || process.env.TYPESAFE_API_KEY;
    if (key && key.trim().length > 0) {
      this.#client = new TypeSafeClient({ apiKey: key.trim() });
      this.#temApiKey = true;
    } else {
      this.#temApiKey = false;
    }
  }

  /**
   * Avalia a intenção da mensagem com System One Jev (ou alternativa calibrado ultra-rápido).
   */
  async decidir(pergunta: string, contexto: ContextoDecisao = {}): Promise<ResultadoDecisao> {
    const inicio = Date.now();
    const texto = pergunta.trim();

    // Se temos cliente Jev e pergunta com conteúdo semântico, chamamos a API TypeSafe
    if (this.#client && this.#temApiKey && texto.length > 2 && !texto.startsWith('/')) {
      try {
        const resposta = await this.#client.systemOne({
          state: {
            mensagem_cidadao: texto,
            contexto_atual: {
              missao_ativa: contexto.missaoAtiva ?? false,
              estado_missao: contexto.estadoMissao ?? 'nenhuma',
              nivel_mandato_atual: contexto.mandatoAtivoNivel ?? 'D0',
            },
            municipio: 'Guimarães',
          },
          questions: {
            servico: choice('Qual o serviço municipal ou categoria pretendida pelo cidadão?', CRITERIOS_SERVICO),
            comportamento: choice('Qual o comportamento estrito que o agente leal do cidadão deve adotar?', CRITERIOS_COMPORTAMENTO),
            nivel_mandato: choice('Qual o nível de mandato (D0 a D4) necessário para realizar a vontade do cidadão?', CRITERIOS_MANDATO),
            ferramenta_mcp: choice('Qual a ferramenta MCP da Porta Agêntica mais indicada a acionar?', CRITERIOS_FERRAMENTA_MCP),
            exige_consentimento: noul('Esta ação compromete legalmente o cidadão, acede ao cofre ou submete um ato formal vinculativo?'),
          },
        });

        const qServico = resposta.answers.servico as ChoiceResponse<string>;
        const qComp = resposta.answers.comportamento as ChoiceResponse<string>;
        const qMandato = resposta.answers.nivel_mandato as ChoiceResponse<string>;
        const qMcp = resposta.answers.ferramenta_mcp as ChoiceResponse<string>;
        const qConsent = resposta.answers.exige_consentimento as NoulResponse;

        const servicoEscolhido = qServico.choice;
        const categoria = this.#mapearCategoria(servicoEscolhido);
        const servicoId = categoria === 'catalogo' ? servicoEscolhido : (servicoEscolhido.startsWith('ocupacao-') || servicoEscolhido.startsWith('pedido-') ? servicoEscolhido : undefined);

        return {
          motor: 'typesafe-jev',
          modelo: 'jev',
          servicoId,
          categoria,
          comportamento: (qComp.choice as TipoComportamento) || 'responder',
          nivelMandato: (qMandato.choice as NivelMandato) || 'D0',
          ferramentaMcp: qMcp.choice || 'consultar_catalogo',
          confianca: qServico.confidence ?? 0.95,
          probabilidades: qServico.probabilities,
          exigeConsentimento: qConsent.noul > 0.5,
          tempoRespostaMs: Date.now() - inicio,
        };
      } catch (erro) {
        // Fallback resiliente imediato se houver erro de rede
        console.warn('TypeSafe Jev alternativa acionado:', (erro as Error)?.message);
      }
    }

    // Avaliador Calibrado Local (0ms, 100% determinístico e resiliente)
    return this.#decidirLocalmente(texto, contexto, inicio);
  }

  #mapearCategoria(servico: string): CategoriaIntencao {
    if (servico === 'fora_competencia') return 'fora_competencia';
    if (servico === 'juizo_tecnico') return 'juizo_tecnico';
    if (servico === 'sem_fonte') return 'sem_fonte';
    if (servico === 'adversarial') return 'adversarial';
    if (servico === 'geral') return 'geral';
    return 'catalogo';
  }

  /**
   * Avaliador determinístico local baseado nas regras do contrato R0.
   */
  #decidirLocalmente(texto: string, contexto: ContextoDecisao, inicio: number): ResultadoDecisao {
    const t = texto.toLowerCase();

    // 1. Adversarial
    if (t.includes('ignora as') || t.includes('ignore previous') || (t.includes('nif') && t.includes('vizinho')) || t.includes('és um funcionário')) {
      return {
        motor: 'calibrado-local',
        modelo: 'regras-deterministas',
        categoria: 'adversarial',
        comportamento: 'recusar',
        nivelMandato: 'D0',
        ferramentaMcp: 'nenhuma',
        confianca: 1.0,
        exigeConsentimento: false,
        tempoRespostaMs: Date.now() - inicio,
        motivo: 'violacao_seguranca_privacidade',
      };
    }

    // 2. Juízo Técnico
    if (t.includes('vai ser aprovada') || t.includes('pode multar') || (t.includes('posso construir') && t.includes('ponte'))) {
      return {
        motor: 'calibrado-local',
        modelo: 'regras-deterministas',
        categoria: 'juizo_tecnico',
        comportamento: 'recusar',
        nivelMandato: 'D0',
        ferramentaMcp: 'consultar_catalogo',
        confianca: 0.98,
        exigeConsentimento: false,
        tempoRespostaMs: Date.now() - inicio,
        servicoId: 'pedido-informacao-previa-urbanismo',
        motivo: 'juizo_discricionario_recusado',
      };
    }

    // 3. Fora de Competência
    if (t.includes('cartão de cidadão') || t.includes('cartao de cidadao')) {
      return {
        motor: 'calibrado-local',
        modelo: 'regras-deterministas',
        categoria: 'fora_competencia',
        comportamento: 'encaminhar',
        nivelMandato: 'D0',
        ferramentaMcp: 'nenhuma',
        confianca: 1.0,
        exigeConsentimento: false,
        tempoRespostaMs: Date.now() - inicio,
        entidade: 'Administração Central (Espaço Cidadão / IRN)',
      };
    }
    if (t.includes('conta da água') || t.includes('agua') || t.includes('fatura da agua')) {
      return {
        motor: 'calibrado-local',
        modelo: 'regras-deterministas',
        categoria: 'fora_competencia',
        comportamento: 'encaminhar',
        nivelMandato: 'D0',
        ferramentaMcp: 'nenhuma',
        confianca: 1.0,
        exigeConsentimento: false,
        tempoRespostaMs: Date.now() - inicio,
        entidade: 'Vimágua (Empresa Pública Municipal)',
      };
    }

    // 4. Sem Fonte (Abstenção)
    if (t.includes('quanto pago pela licença da esplanada') || t.includes('quanto vou pagar') || t.includes('qual o valor da taxa da esplanada')) {
      return {
        motor: 'calibrado-local',
        modelo: 'regras-deterministas',
        categoria: 'sem_fonte',
        comportamento: 'abster',
        nivelMandato: 'D0',
        ferramentaMcp: 'calcular_taxa_esplanada',
        confianca: 0.99,
        exigeConsentimento: false,
        tempoRespostaMs: Date.now() - inicio,
        servicoId: 'ocupacao-espaco-publico-esplanada',
        motivo: 'taxa_esplanada_sem_fonte_unica',
      };
    }

    // O estado por omissão é sempre D0 (Informar, Questionar e Clarificar)
    let nivelMandato: NivelMandato = 'D0';
    let ferramentaMcp = 'consultar_catalogo';

    // Apenas ordens expressas de submissão formal com CMD elevam para D3
    if (t.includes('autorizo a submeter') || t.includes('assinar com chave') || t.includes('confirmar submissao') || t.includes('submeter com cmd')) {
      nivelMandato = 'D3';
      ferramentaMcp = 'submeter_comunicacao_previa';
    } else if (t.includes('preparar rascunho') || t.includes('guardar no cofre') || t.includes('iniciar rascunho') || t.includes('analisar terreno')) {
      nivelMandato = 'D2';
      ferramentaMcp = 'criar_rascunho_ocupacao';
    } else if (t.includes('taxa') || t.includes('custo') || t.includes('valor')) {
      ferramentaMcp = 'calcular_taxa_esplanada';
    } else if (t.includes('passeio') || t.includes('largura') || t.includes('medida')) {
      ferramentaMcp = 'verificar_conformidade_tecnica';
    }

    if (t.includes('andaime') || t.includes('tapume') || t.includes('contentor')) {
      servicoId = 'ocupacao-espaco-publico-andaimes';
    } else if (t.includes('elevador') || t.includes('ascensor')) {
      servicoId = 'inspecao-ascensores';
    } else if (t.includes('construir') || t.includes('informação prévia') || t.includes('pdm')) {
      servicoId = 'pedido-informacao-previa-urbanismo';
    } else if (t.includes('publicidade') || t.includes('reclamo') || t.includes('tabuleta')) {
      servicoId = 'publicidade-reclamo-fachada';
    }

    return {
      motor: 'calibrado-local',
      modelo: 'regras-deterministas',
      servicoId,
      categoria: 'catalogo',
      comportamento: 'responder',
      nivelMandato,
      ferramentaMcp,
      confianca: 0.96,
      exigeConsentimento: nivelMandato === 'D3' || nivelMandato === 'D4',
      tempoRespostaMs: Date.now() - inicio,
    };
  }
}
