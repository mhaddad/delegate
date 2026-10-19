/**
 * Motor de Decisão TypeSafe · System One (Jev)
 *
 * Utiliza o modelo System One Jev da TypeSafe para transformar linguagem natural
 * e o contexto da sessão em julgamentos tipados de alta velocidade e precisão.
 */
import { TypeSafeClient, choice, noul, type ChoiceResponse, type NoulResponse } from '@typesafe-ai/sdk';
import type { ContextoDecisao, FocoServico, ResultadoDecisao, TipoComportamento } from './tipos.ts';
import type { NivelMandato } from '../mandatos/mandatos.ts';
import { BASE_INTENCOES_MUNICIPAIS } from './catalogo-intencoes.ts';
import {
  FRONTEIRAS_E_SALVAGUARDAS,
  CRITERIOS_FOCO_SERVICO,
  CRITERIOS_SERVICO,
  CRITERIOS_COMPORTAMENTO,
  CRITERIOS_MANDATO,
  CRITERIOS_FERRAMENTA_MCP,
} from './criterios.ts';
import { AvaliadorLocal } from './avaliador-local.ts';

// Re-exportações de compatibilidade para consumidores do módulo
export * from './tipos.ts';
export * from './catalogo-intencoes.ts';
export * from './criterios.ts';
export * from './avaliador-local.ts';

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
   * Avalia a intenção da mensagem com System One Jev fundamentado na Base Canónica de Intenções Municipais.
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
            contexto_sessao: {
              servico_ativo: contexto.servicoAtivo ?? null,
              servico_titulo_ativo: contexto.servicoTituloAtivo ?? null,
              missao_em_curso: contexto.missaoAtiva
                ? {
                    id: contexto.missaoId ?? 'MIS-ATIVA',
                    estado: contexto.estadoMissao ?? 'em_curso',
                    mandato_atual: contexto.mandatoAtivoNivel ?? 'D0',
                  }
                : null,
              historico_recente: contexto.historicoRecente ?? [],
              itens_no_cofre_digital: contexto.itensCofre ?? [],
            },
            base_intencoes_catalogo: BASE_INTENCOES_MUNICIPAIS,
            fronteiras_e_salvaguardas: FRONTEIRAS_E_SALVAGUARDAS,
            quadro_mandatos: CRITERIOS_MANDATO,
            municipio: 'Município de Guimarães',
          },
          questions: {
            foco_servico: choice(
              'Avalie a continuidade conversacional: com base no contexto_sessao, o cidadão mantém o foco no serviço_ativo, transita para outro serviço da base_intencoes_catalogo ou inicia um primeiro contacto?',
              CRITERIOS_FOCO_SERVICO,
            ),
            servico: choice(
              'A qual intenção ou serviço da base_intencoes_catalogo (ou fronteira externa em fronteiras_e_salvaguardas) corresponde estritamente a mensagem do cidadão?',
              CRITERIOS_SERVICO,
            ),
            comportamento: choice(
              'Qual o comportamento oficial obrigatório que o representante digital leal deve adotar com base nas fronteiras_e_salvaguardas?',
              CRITERIOS_COMPORTAMENTO,
            ),
            nivel_mandato: choice(
              'Qual o nível de mandato (D0 a D4) estritamente manifestado e autorizado pelo cidadão nesta mensagem?',
              CRITERIOS_MANDATO,
            ),
            ferramenta_mcp: choice(
              'Qual a ferramenta do barramento MCP da Porta Agêntica a acionar para cumprir o mandato solicitado?',
              CRITERIOS_FERRAMENTA_MCP,
            ),
            exige_consentimento: noul(
              'Esta ação exige consentimento expresso, acede a dados privados do cofre digital ou remete submissão vinculativa à autarquia?',
            ),
          },
        });

        const qFoco = resposta.answers.foco_servico as ChoiceResponse<string>;
        const qServico = resposta.answers.servico as ChoiceResponse<string>;
        const qComp = resposta.answers.comportamento as ChoiceResponse<string>;
        const qMandato = resposta.answers.nivel_mandato as ChoiceResponse<string>;
        const qMcp = resposta.answers.ferramenta_mcp as ChoiceResponse<string>;
        const qConsent = resposta.answers.exige_consentimento as NoulResponse;

        const servicoAtivoPrevio = contexto.servicoAtivo;
        let focoServico: FocoServico = (qFoco?.choice as FocoServico) ?? (servicoAtivoPrevio ? 'mesmo_servico' : 'primeiro_contacto');
        if (!servicoAtivoPrevio) {
          focoServico = 'primeiro_contacto';
        }

        const servicoEscolhido = qServico.choice;
        const categoria = AvaliadorLocal.mapearCategoria(servicoEscolhido);

        let servicoId: string | undefined;
        let mudancaServico = false;

        if (focoServico === 'mesmo_servico' && servicoAtivoPrevio) {
          servicoId = servicoAtivoPrevio;
          mudancaServico = false;
        } else if (focoServico === 'mudar_outro_servico' && servicoAtivoPrevio) {
          mudancaServico = true;
          servicoId = categoria === 'catalogo' ? servicoEscolhido : (servicoEscolhido.startsWith('ocupacao-') || servicoEscolhido.startsWith('pedido-') ? servicoEscolhido : undefined);
        } else {
          servicoId = categoria === 'catalogo' ? servicoEscolhido : (servicoEscolhido.startsWith('ocupacao-') || servicoEscolhido.startsWith('pedido-') ? servicoEscolhido : undefined);
          mudancaServico = false;
        }

        return {
          motor: 'typesafe-jev',
          modelo: 'jev',
          servicoId,
          focoServico,
          mudancaServico,
          servicoAnterior: mudancaServico ? servicoAtivoPrevio : undefined,
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
        console.warn('TypeSafe Jev alternativa acionado:', (erro as Error)?.message);
      }
    }

    // Avaliador Calibrado Local (0ms, 100% determinístico e resiliente)
    return AvaliadorLocal.decidir(texto, contexto, inicio);
  }
}
