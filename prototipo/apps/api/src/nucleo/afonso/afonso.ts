/**
 * Afonso · Representante Digital Leal do Cidadão
 *
 * Princípios de Lealdade e Regras de Ouro:
 * 1. Responde com fonte regulamentar única e comprovada à vista em todo o número;
 * 2. Sem fonte válida, abstém-se formalmente sem inventar prazos nem custos;
 * 3. Nunca assume juízos discricionários reservados aos técnicos autárquicos;
 * 4. Encaminha com clareza assuntos de entidades externas;
 * 5. Preserva o contexto em conversas multi-turno e respeita o quadro de mandatos D0-D4.
 */
import type { Registo } from '../eventos/registo.ts';
import { ClientePortaMcp } from './cliente-porta.ts';
import { ClassificadorAfonso } from './classificador.ts';
import { MotorDecisaoTypeSafe, type ContextoDecisao } from '../typesafe/motor-decisao.ts';
import { RedatorOpenRouter } from './redator-openrouter.ts';
import {
  tratarAdversarial,
  tratarJuizoTecnico,
  tratarForaCompetencia,
  tratarSemFonte,
} from './respostas-fronteira.ts';
import { gerarRespostaCatalogo } from './respostas-catalogo.ts';
import type { Botoes } from '../canal.ts';

export interface MemoriaConversa {
  ultimoServicoId?: string;
  ultimoServicoTitulo?: string;
  historico?: Array<{ autor: 'pessoa' | 'afonso'; texto: string }>;
}

export interface RespostaAfonso {
  texto: string;
  botoes?: Botoes;
  servicoId?: string;
  servicoTitulo?: string;
  focoServico?: string;
  mudancaServico?: boolean;
  comportamento?: 'responder' | 'abster' | 'encaminhar' | 'recusar';
  categoria?: string;
  fontes?: string[];
  numerosSemFonte?: string[];
  entidade?: string;
  mandatoInferido?: string;
  ferramentaMcp?: string;
  modeloRedacao?: string;
  geradoPorLlm?: boolean;
}

export class Afonso {
  readonly #registo: Registo;
  readonly #porta: ClientePortaMcp;
  readonly #sessao: string;
  readonly #motorDecisao: MotorDecisaoTypeSafe;
  readonly #redator: RedatorOpenRouter;
  readonly #contextoConversa = new Map<string, MemoriaConversa>();

  constructor(
    registo: Registo,
    porta?: ClientePortaMcp,
    sessao = 'demo',
    motorDecisao?: MotorDecisaoTypeSafe,
    redator?: RedatorOpenRouter,
  ) {
    this.#registo = registo;
    this.#porta = porta ?? new ClientePortaMcp();
    this.#sessao = sessao;
    this.#motorDecisao = motorDecisao ?? new MotorDecisaoTypeSafe();
    this.#redator = redator ?? new RedatorOpenRouter();
  }

  /** Trata uma mensagem de texto recebida no canal com acompanhamento de continuidade de serviço. */
  async responder(pessoa: string, texto: string, contextoExterno: ContextoDecisao = {}): Promise<RespostaAfonso> {
    const limpo = texto.trim();
    const anterior = this.#contextoConversa.get(pessoa);
    const historicoRecente: Array<{ autor: 'pessoa' | 'afonso'; texto: string }> =
      contextoExterno.historicoRecente ?? (anterior?.historico ? anterior.historico.slice(-6) : []);

    const contextoDecisao: ContextoDecisao = {
      pessoa,
      servicoAtivo: contextoExterno.servicoAtivo ?? anterior?.ultimoServicoId,
      servicoTituloAtivo: contextoExterno.servicoTituloAtivo ?? anterior?.ultimoServicoTitulo,
      missaoAtiva: contextoExterno.missaoAtiva,
      missaoId: contextoExterno.missaoId,
      estadoMissao: contextoExterno.estadoMissao,
      mandatoAtivoNivel: contextoExterno.mandatoAtivoNivel,
      historicoRecente,
      itensCofre: contextoExterno.itensCofre ?? [],
    };

    const resposta = await this.#tratarMensagem(pessoa, limpo, contextoDecisao);

    // Gravar histórico conversacional e persistir contexto do cidadão
    const novoHistorico = [
      ...historicoRecente,
      { autor: 'pessoa' as const, texto: limpo },
      { autor: 'afonso' as const, texto: resposta.texto },
    ].slice(-10);

    this.#contextoConversa.set(pessoa, {
      ultimoServicoId: resposta.servicoId ?? anterior?.ultimoServicoId,
      ultimoServicoTitulo: resposta.servicoTitulo ?? anterior?.ultimoServicoTitulo,
      historico: novoHistorico,
    });

    return resposta;
  }

  async #tratarMensagem(pessoa: string, limpo: string, contextoDecisao: ContextoDecisao): Promise<RespostaAfonso> {
    const decisaoJev = await this.#motorDecisao.decidir(limpo, contextoDecisao);
    const classificacao = ClassificadorAfonso.classificar(limpo);

    // Registar imediatamente o evento de decisão com métricas TypeSafe/Jev
    await this.#registo.registar({
      tipo: 'afonso.intencao.classificada',
      origem: 'afonso',
      sessao: this.#sessao,
      pessoa,
      missao: contextoDecisao.missaoId ?? null,
      ator: decisaoJev.motor === 'typesafe-jev' ? 'agente:jev' : 'agente:entendimento',
      simulacao: false,
      dados: {
        servico: decisaoJev.servicoId,
        foco_servico: decisaoJev.focoServico,
        mudanca_servico: decisaoJev.mudancaServico,
        servico_anterior: decisaoJev.servicoAnterior ?? contextoDecisao.servicoAtivo ?? null,
        intencao: decisaoJev.servicoId ?? decisaoJev.categoria,
        confianca: decisaoJev.confianca,
        categoria: decisaoJev.categoria,
        motor: decisaoJev.motor,
        modelo: decisaoJev.modelo,
        mandato_inferido: decisaoJev.nivelMandato,
        mcp_ferramenta: decisaoJev.ferramentaMcp,
        tempo_ms: decisaoJev.tempoRespostaMs,
      },
    });

    // 1. Deteção Adversarial e Privacidade
    const respAdversarial = await tratarAdversarial(pessoa, classificacao, this.#registo, this.#sessao);
    if (respAdversarial) return respAdversarial;

    // 2. Juízo Técnico (Recusa Formal de Pareceres Subjetivos)
    const respJuizo = await tratarJuizoTecnico(pessoa, classificacao, this.#registo, this.#sessao);
    if (respJuizo) return respJuizo;

    // 3. Fora de Competência (Encaminhamento para Vimágua, IRN / Espaço Cidadão)
    const respFora = await tratarForaCompetencia(pessoa, classificacao, this.#registo, this.#sessao);
    if (respFora) return respFora;

    // 4. Sem Fonte (Abstenção Formal e Atendimento Geral)
    const respSemFonte = await tratarSemFonte(pessoa, classificacao, limpo, this.#registo, this.#sessao);
    if (respSemFonte) return respSemFonte;

    // 5. Catálogo de Serviços Oficiais
    const servicoId = decisaoJev.servicoId ?? classificacao.servicoId ?? 'ocupacao-espaco-publico-esplanada';

    // Obter ficha do catálogo da Porta Agêntica
    let ficha;
    try {
      ficha = await this.#porta.obterServico(servicoId);
    } catch {
      ficha = null;
    }

    const prefixoMudanca =
      decisaoJev.mudancaServico && contextoDecisao.missaoAtiva && contextoDecisao.servicoTituloAtivo
        ? `💡 <i>Nota: O seu pedido em curso sobre «${contextoDecisao.servicoTituloAtivo}» permanece guardado em segurança no seu Cofre Digital.</i>\n\n`
        : '';

    return gerarRespostaCatalogo({
      servicoId,
      ficha,
      limpo,
      prefixoMudanca,
      pessoa,
      sessao: this.#sessao,
      registo: this.#registo,
      redator: this.#redator,
      decisaoJev,
    });
  }
}
