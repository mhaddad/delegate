/**
 * Henriques · Representante Digital Leal do Cidadão
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
import { fracionarResposta, type Botoes } from '../canal.ts';

export interface MemoriaConversa {
  ultimoServicoId?: string;
  ultimoServicoTitulo?: string;
  historico?: Array<{ autor: 'pessoa' | 'henriques'; texto: string }>;
}

export interface RespostaHenriques {
  texto: string;
  mensagens?: string[];
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

import { GestorContextoConversa } from './gestor-contexto.ts';

export class Henriques {
  readonly #registo: Registo;
  readonly #porta: ClientePortaMcp;
  readonly #sessao: string;
  readonly #motorDecisao: MotorDecisaoTypeSafe;
  readonly #redator: RedatorOpenRouter;
  readonly #buscador: BuscadorConhecimento;
  readonly #gestorContexto: GestorContextoConversa;

  constructor(
    registo: Registo,
    porta?: ClientePortaMcp,
    sessao = 'demo',
    motorDecisao?: MotorDecisaoTypeSafe,
    redator?: RedatorOpenRouter,
    buscador?: BuscadorConhecimento,
    gestorContexto?: GestorContextoConversa,
  ) {
    this.#registo = registo;
    this.#porta = porta ?? new ClientePortaMcp();
    this.#sessao = sessao;
    this.#motorDecisao = motorDecisao ?? new MotorDecisaoTypeSafe();
    this.#redator = redator ?? new RedatorOpenRouter();
    this.#buscador = buscador ?? new BuscadorConhecimento();
    this.#gestorContexto = gestorContexto ?? new GestorContextoConversa();
  }

  /** Acesso ao gestor de contexto avançado */
  get contexto(): GestorContextoConversa {
    return this.#gestorContexto;
  }

  /** Trata uma mensagem de texto recebida no canal com acompanhamento de continuidade de serviço. */
  async responder(pessoa: string, texto: string, contextoExterno: ContextoDecisao = {}): Promise<RespostaHenriques> {
    const limpo = texto.trim();
    const contextoDecisao = this.#gestorContexto.prepararContextoDecisao(pessoa, contextoExterno);

    const resposta = await this.#tratarMensagem(pessoa, limpo, contextoDecisao);

    if (!resposta.mensagens) {
      resposta.mensagens = fracionarResposta(resposta.texto, resposta.categoria);
    }

    if (resposta.mensagens.length > 1) {
      await this.#registo.registar({
        tipo: 'henriques.mensagem.fracionada',
        origem: 'henriques',
        sessao: this.#sessao,
        pessoa,
        missao: contextoDecisao.missaoId ?? null,
        ator: 'agente:acolhimento',
        simulacao: false,
        dados: {
          baloes: resposta.mensagens.length,
          categoria: resposta.categoria ?? 'geral',
          factor_variabilidade: Number(Math.random().toFixed(2)),
        },
      });
    }

    this.#gestorContexto.atualizarInteracao({
      pessoa,
      mensagemCidadao: limpo,
      respostaTexto: resposta.texto,
      categoria: resposta.categoria,
      servicoId: resposta.servicoId,
      servicoTitulo: resposta.servicoTitulo,
      mudancaServico: resposta.mudancaServico,
      missaoId: contextoDecisao.missaoId,
      estadoProcesso: contextoDecisao.estadoMissao,
    });

    return resposta;
  }

  /** Reinicia a memória conversacional e o contexto de serviço ativo para uma pessoa. */
  reiniciarConversa(pessoa: string): void {
    this.#gestorContexto.limparTudo(pessoa);
  }

  async #tratarMensagem(pessoa: string, limpo: string, contextoDecisao: ContextoDecisao): Promise<RespostaHenriques> {
    const decisaoJev = await this.#motorDecisao.decidir(limpo, contextoDecisao);

    // Registar imediatamente o evento de decisão com métricas TypeSafe/Jev
    await this.#registo.registar({
      tipo: 'henriques.intencao.classificada',
      origem: 'henriques',
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
        tipo: 'henriques.resposta.verificada',
        origem: 'henriques',
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
          'Olá! Sou o <b>Henriques</b>, o seu representante digital.',
          '',
          'Estou aqui para o ajudar a tratar de assuntos com a Câmara Municipal de Guimarães sem burocracia.',
          '',
          'Diga-me o que precisa de fazer ou qual é a sua dúvida.',
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
          tipo: 'henriques.resposta.verificada',
          origem: 'henriques',
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
      factosConfirmados: contextoDecisao.factosValidados,
    });
  }
}
