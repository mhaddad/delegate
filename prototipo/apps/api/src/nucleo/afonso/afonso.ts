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
import { MotorDecisaoTypeSafe, type ContextoDecisao } from '../typesafe/motor-decisao.ts';
import { RedatorOpenRouter } from './redator-openrouter.ts';
import {
  tratarAdversarial,
  tratarJuizoTecnico,
  tratarForaCompetencia,
  tratarSemFonte,
} from './respostas-fronteira.ts';
import { tratarAmbiguidade } from './router-ambiguidade.ts';
import { gerarRespostaCatalogo } from './respostas-catalogo.ts';
import { BuscadorConhecimento } from '../conhecimento/buscador.ts';
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
  readonly #buscador: BuscadorConhecimento;
  readonly #contextoConversa = new Map<string, MemoriaConversa>();

  constructor(
    registo: Registo,
    porta?: ClientePortaMcp,
    sessao = 'demo',
    motorDecisao?: MotorDecisaoTypeSafe,
    redator?: RedatorOpenRouter,
    buscador?: BuscadorConhecimento,
  ) {
    this.#registo = registo;
    this.#porta = porta ?? new ClientePortaMcp();
    this.#sessao = sessao;
    this.#motorDecisao = motorDecisao ?? new MotorDecisaoTypeSafe();
    this.#redator = redator ?? new RedatorOpenRouter();
    this.#buscador = buscador ?? new BuscadorConhecimento();
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
        probabilidades: decisaoJev.probabilidades ?? null,
        arvore_jev: decisaoJev.arvoreJev ?? null,
        percurso: decisaoJev.percurso ?? null,
        perguntas_poupadas: decisaoJev.perguntasPoupadas ?? 0,
      },
    });

    // 0. Saudações e Acolhimento Geral (sem disparar RAG nem citar regulamentos irrelevantes)
    if (decisaoJev.categoria === 'geral') {
      await this.#registo.registar({
        tipo: 'afonso.resposta.verificada',
        origem: 'afonso',
        sessao: this.#sessao,
        pessoa,
        missao: contextoDecisao.missaoId ?? null,
        ator: 'agente:acolhimento',
        simulacao: false,
        dados: {
          motivo: 'saudacao_acolhimento',
          pergunta: limpo,
        },
      });

      return {
        texto: [
          'Olá! Sou o <b>Afonso</b>, o seu representante digital.',
          '',
          'Estou aqui para o ajudar a tratar de assuntos com a Câmara Municipal de Guimarães sem burocracia.',
          '',
          'Diga-me o que precisa de fazer ou qual é a sua dúvida (por exemplo: <i>abrir uma esplanada</i>, <i>consultar viabilidade de um terreno no PDM</i>, <i>isenção de licença de utilização</i>, ou <i>pedir cartão sénior</i>).'
        ].join('\n'),
        comportamento: 'responder',
        categoria: 'geral',
      };
    }

    // 1. Deteção Adversarial e Privacidade
    const respAdversarial = await tratarAdversarial(pessoa, decisaoJev, this.#registo, this.#sessao);
    if (respAdversarial) return respAdversarial;

    // 2. Juízo Técnico (Recusa Formal de Pareceres Subjetivos)
    const respJuizo = await tratarJuizoTecnico(pessoa, decisaoJev, this.#registo, this.#sessao);
    if (respJuizo) return respJuizo;

    // 3. Fora de Competência (Encaminhamento para Vimágua, IRN / Espaço Cidadão)
    const respFora = await tratarForaCompetencia(pessoa, decisaoJev, this.#registo, this.#sessao);
    if (respFora) return respFora;

    // 4. Detetor de Ambiguidade (Roteamento Pedagógico para Perguntas Vagas)
    const respAmbigua = await tratarAmbiguidade(pessoa, limpo, contextoDecisao, this.#registo, this.#sessao);
    if (respAmbigua) return respAmbigua;

    // 5. Sem Fonte (Abstenção Formal e Atendimento Geral)
    const respSemFonte = await tratarSemFonte(pessoa, decisaoJev, limpo, this.#registo, this.#sessao);
    if (respSemFonte) return respSemFonte;

    // 5. Base de Conhecimento RAG D0 (Site e Diretório de Guimarães via Cloudflare /markdown)
    const pediuEsplanadaExplicitamente = /esplanada|mesas na rua|abrir esplanada|restaurante|toldo|estrado/i.test(limpo);
    const temServicoExplicito =
      decisaoJev.servicoId && (decisaoJev.servicoId !== 'ocupacao-espaco-publico-esplanada' || pediuEsplanadaExplicitamente);
    if (!temServicoExplicito || decisaoJev.categoria === 'conhecimento_d0') {
      const matchRAG = await this.#buscador.buscarComJev(limpo);
      if (matchRAG && matchRAG.pontuacao >= 7) {
        await this.#registo.registar({
          tipo: 'afonso.resposta.verificada',
          origem: 'afonso',
          sessao: this.#sessao,
          pessoa,
          missao: contextoDecisao.missaoId ?? null,
          ator: matchRAG.motorDecisao === 'typesafe-jev' ? 'agente:jev-rerank' : 'agente:conhecimento-rag',
          simulacao: false,
          dados: {
            fonte: matchRAG.url,
            titulo: matchRAG.titulo,
            categoria: matchRAG.categoria,
            hash_sha256: matchRAG.hashSha256,
            consultado_em: matchRAG.consultadoEm,
            pontuacao: matchRAG.pontuacao,
            confianca_jev: matchRAG.confiancaJev ?? null,
            motor_rag: matchRAG.motorDecisao ?? 'calibrado-local',
          },
        });

        const respFormatada = this.#buscador.formatarResposta(matchRAG);
        return {
          texto: respFormatada.texto,
          botoes: respFormatada.botoes,
          servicoId: matchRAG.id,
          servicoTitulo: matchRAG.titulo,
          comportamento: 'responder',
          categoria: 'conhecimento_d0',
          fontes: [matchRAG.url],
        };
      }
    }

    // 6. Catálogo de Serviços Oficiais
    const servicoId = decisaoJev.servicoId ?? 'ocupacao-espaco-publico-esplanada';

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
      historico: contextoDecisao.historicoRecente,
    });
  }
}
