/**
 * Gestor Central de Contexto Conversacional do Henriques
 *
 * Aplica as melhores práticas de gestão de contexto para agentes de IA:
 * 1. Arquitetura Multi-Tiered (Working Memory com TTL vs. Memória Semântica de Factos);
 * 2. Invalidação Atómica e Prevenção de Context Rot (Ghost Context);
 * 3. Extração e Compactação de Factos Estruturados (Entidades vs. Texto Bruto);
 * 4. Deteção de Ruptura / Mudança de Contexto (Context Shift Detection).
 */
import type { ContextoDecisao } from '../typesafe/tipos.ts';

export interface FactoExtraido {
  campo: string;
  valor: any;
  confianca?: number;
  atualizadoEm: number;
}

export interface EstadoContextoSessao {
  pessoa: string;
  servicoAtivoId?: string;
  servicoAtivoTitulo?: string;
  missaoAtivaId?: string;
  estadoProcesso?: string;
  ultimoContactoEm: number;
  historicoRecente: Array<{ autor: 'pessoa' | 'henriques'; texto: string; timestamp: number }>;
  factosValidados: Map<string, FactoExtraido>;
}

export class GestorContextoConversa {
  readonly #sessoes = new Map<string, EstadoContextoSessao>();
  readonly #ttlMs: number;

  constructor(ttlMinutos = 30) {
    this.#ttlMs = ttlMinutos * 60 * 1000;
  }

  /**
   * Obtém o contexto de trabalho ativo para uma pessoa, aplicando expiração automática por TTL.
   */
  obterContexto(pessoa: string): EstadoContextoSessao {
    const agora = Date.now();
    let sessao = this.#sessoes.get(pessoa);

    // Se a sessão expirou por inatividade, faz o reset do foco operacional
    if (sessao && agora - sessao.ultimoContactoEm > this.#ttlMs) {
      sessao = {
        pessoa,
        ultimoContactoEm: agora,
        historicoRecente: [],
        factosValidados: new Map(),
      };
      this.#sessoes.set(pessoa, sessao);
    } else if (!sessao) {
      sessao = {
        pessoa,
        ultimoContactoEm: agora,
        historicoRecente: [],
        factosValidados: new Map(),
      };
      this.#sessoes.set(pessoa, sessao);
    }

    return sessao;
  }

  /**
   * Constrói o ContextoDecisao limpo e compactado para o Jev / System One.
   */
  prepararContextoDecisao(
    pessoa: string,
    contextoExterno: ContextoDecisao = {},
  ): ContextoDecisao {
    const sessao = this.obterContexto(pessoa);

    // Extrair histórico em formato de pares de diálogo (últimos 6 turnos)
    const historicoLimpo = sessao.historicoRecente.slice(-6).map((h) => ({
      autor: h.autor,
      texto: h.texto,
    }));

    return {
      pessoa,
      servicoAtivo: contextoExterno.servicoAtivo ?? sessao.servicoAtivoId,
      servicoTituloAtivo: contextoExterno.servicoTituloAtivo ?? sessao.servicoAtivoTitulo,
      missaoAtiva: contextoExterno.missaoAtiva ?? Boolean(sessao.missaoAtivaId),
      missaoId: contextoExterno.missaoId ?? sessao.missaoAtivaId,
      estadoMissao: contextoExterno.estadoMissao ?? sessao.estadoProcesso,
      mandatoAtivoNivel: contextoExterno.mandatoAtivoNivel ?? (sessao.missaoAtivaId ? 'D2' : 'D0'),
      historicoRecente: contextoExterno.historicoRecente ?? historicoLimpo,
      itensCofre: contextoExterno.itensCofre ?? [],
    };
  }

  /**
   * Atualiza a sessão após uma interação do agente, evitando poluição de serviços em saudações ou recusas.
   */
  atualizarInteracao(params: {
    pessoa: string;
    mensagemCidadao: string;
    respostaTexto: string;
    categoria?: string;
    servicoId?: string;
    servicoTitulo?: string;
    mudancaServico?: boolean;
    missaoId?: string;
    estadoProcesso?: string;
  }): void {
    const agora = Date.now();
    const sessao = this.obterContexto(params.pessoa);
    sessao.ultimoContactoEm = agora;

    const ehGeralOuCurtoCircuito =
      params.categoria === 'geral' ||
      params.categoria === 'adversarial' ||
      params.categoria === 'fora_competencia';

    if (ehGeralOuCurtoCircuito) {
      // Saudações e curto-circuitos não fixam foco de serviços nem acumulam histórico de procedimentos
      sessao.servicoAtivoId = undefined;
      sessao.servicoAtivoTitulo = undefined;
      sessao.historicoRecente = [];
      return;
    }

    // Se houve mudança de assunto deliberada, arquiva os factos do serviço anterior
    if (params.mudancaServico && params.servicoId && params.servicoId !== sessao.servicoAtivoId) {
      sessao.factosValidados.clear();
    }

    if (params.servicoId) {
      sessao.servicoAtivoId = params.servicoId;
    }
    if (params.servicoTitulo) {
      sessao.servicoAtivoTitulo = params.servicoTitulo;
    }
    if (params.missaoId) {
      sessao.missaoAtivaId = params.missaoId;
    }
    if (params.estadoProcesso) {
      sessao.estadoProcesso = params.estadoProcesso;
    }

    // Adicionar turnos ao histórico recente com cap de 8 turnos
    sessao.historicoRecente.push(
      { autor: 'pessoa', texto: params.mensagemCidadao, timestamp: agora },
      { autor: 'henriques', texto: params.respostaTexto, timestamp: agora },
    );
    if (sessao.historicoRecente.length > 8) {
      sessao.historicoRecente = sessao.historicoRecente.slice(-8);
    }
  }

  /**
   * Regista um facto atómico validado (ex: morada, dimensão, freguesia) para evitar perguntas repetidas.
   */
  anotarFacto(pessoa: string, campo: string, valor: any, confianca = 1.0): void {
    const sessao = this.obterContexto(pessoa);
    sessao.factosValidados.set(campo, {
      campo,
      valor,
      confianca,
      atualizadoEm: Date.now(),
    });
  }

  /**
   * Obtém todos os factos validados compactados num dicionário para o LLM.
   */
  obterFactosCompactados(pessoa: string): Record<string, any> {
    const sessao = this.obterContexto(pessoa);
    const resultado: Record<string, any> = {};
    for (const [chave, item] of sessao.factosValidados.entries()) {
      resultado[chave] = item.valor;
    }
    return resultado;
  }

  /**
   * Reinicia e invalida completamente o contexto de uma pessoa (usado por /start ou pedido do utilizador).
   */
  limparTudo(pessoa: string): void {
    this.#sessoes.delete(pessoa);
  }
}
