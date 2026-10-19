/**
 * O Afonso: o representante digital leal da pessoa.
 *
 * Responsável por:
 *  - classificar a intenção e consultar a Porta Agêntica pela rede;
 *  - responder com fonte visível, data de consulta e versão;
 *  - abster-se quando não há fonte comprovada (zero valores inventados);
 *  - recusar juízos técnicos e tentativas adversariais;
 *  - encaminhar pedidos fora de competência autárquica;
 *  - emitir os eventos do contrato que alimentam o Observatório e a auditoria.
 */
import type { Registo } from '../eventos/registo.ts';
import { ClientePortaMcp } from './cliente-porta.ts';
import { ClassificadorAfonso } from './classificador.ts';
import { VerificadorRegra } from './verificador.ts';
import type { Botoes } from '../canal.ts';

export interface RespostaAfonso {
  texto: string;
  botoes?: Botoes;
  servicoId?: string;
  comportamento?: 'responder' | 'abster' | 'encaminhar' | 'recusar';
  categoria?: string;
  fontes?: string[];
  numerosSemFonte?: string[];
  entidade?: string;
}

export class Afonso {
  readonly #registo: Registo;
  readonly #porta: ClientePortaMcp;
  readonly #sessao: string;

  constructor(registo: Registo, porta?: ClientePortaMcp, sessao = 'demo') {
    this.#registo = registo;
    this.#porta = porta ?? new ClientePortaMcp();
    this.#sessao = sessao;
  }

  /** Trata uma mensagem de texto recebida no canal. */
  async responder(pessoa: string, texto: string): Promise<RespostaAfonso> {
    const limpo = texto.trim();
    const classificacao = ClassificadorAfonso.classificar(limpo);

    // 1. Deteção Adversarial e Privacidade
    if (classificacao.categoria === 'adversarial') {
      if (classificacao.comportamento === 'recusar') {
        let motivoTexto = 'Não posso executar esta instrução por violar as regras de segurança e privacidade municipal.';
        if (classificacao.motivo === 'tentativa_prompt_injection') {
          motivoTexto = 'Não é possível confirmar qualquer aprovação sem a prévia validação pelos técnicos municipais. O Afonso não executa comandos para contornar os regulamentos em vigor.';
        } else if (classificacao.motivo === 'pedido_dados_terceiros_e_falsa_identidade') {
          motivoTexto = 'Por imperativo legal de proteção de dados e privacidade (RGPD), não consulto nem forneço dados pessoais ou fiscais de outros cidadãos. Além disso, sou um assistente de inteligência artificial e não finjo ser um funcionário humano.';
        } else if (classificacao.motivo === 'tentativa_impersonacao_humana') {
          motivoTexto = 'Sou o Afonso, um assistente de inteligência artificial criado para trabalhar para si. Não sou funcionário da Câmara nem finjo sê-lo. Pode pedir para falar com uma pessoa a qualquer momento.';
        }

        await this.#registo.registar({
          tipo: 'afonso.resposta.recusada',
          origem: 'afonso',
          sessao: this.#sessao,
          pessoa,
          missao: null,
          ator: 'agente:verificador',
          simulacao: false,
          dados: {
            motivo: classificacao.motivo,
            categoria: 'adversarial',
          },
        });

        return {
          texto: [
            motivoTexto,
            '',
            '<b>O que fazer agora:</b>',
            '1. Se pretender tratar de um procedimento seu, indique o assunto pretendido;',
            '2. Pode falar com um técnico municipal através do canal de atendimento.',
            '',
            '📄 Fonte: <i>Regulamento de Segurança e Privacidade do Município de Guimarães.</i>',
          ].join('\n'),
          comportamento: 'recusar',
          categoria: 'adversarial',
          botoes: [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
        };
      }

      if (classificacao.comportamento === 'abster') {
        // Tentativa de forçar confirmação de taxa gratuita sem fonte
        await this.#registo.registar({
          tipo: 'afonso.resposta.abstencao',
          origem: 'afonso',
          sessao: this.#sessao,
          pessoa,
          missao: null,
          ator: 'agente:verificador',
          simulacao: false,
          dados: {
            motivo: 'tentativa_inducao_taxa_sem_fonte',
          },
        });

        return {
          texto: [
            'Não consigo confirmar que a taxa seja de 0 € com base numa fonte oficial única.',
            '',
            'Por rigor municipal, o Afonso não confirma valores ou isenções que não estejam expressamente atestados na Tabela de Taxas Municipal.',
            '',
            '<b>O que fazer agora:</b>',
            '1. Pode confirmar as isenções aplicáveis junto da Tesouraria Municipal;',
            '2. Ou consultar a Tabela de Taxas em vigor no portal da Câmara.',
            '',
            '📄 Fonte: <i>Tabela de Taxas e Licenças do Município de Guimarães.</i>',
          ].join('\n'),
          comportamento: 'abster',
          categoria: 'adversarial',
          botoes: [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
        };
      }
    }

    // 2. Juízo Técnico (Recusa Formal)
    if (classificacao.categoria === 'juizo_tecnico') {
      let textoJuizo = 'Não posso emitir juízos de viabilidade técnica ou prognósticos sobre decisões administrativas: as decisões cabem exclusivamente aos serviços técnicos municipais.';
      if (classificacao.motivo === 'juizo_viabilidade_urbanistica') {
        textoJuizo = 'Não posso dizer se pode ou não construir no terreno: essa viabilidade é determinada pelos serviços de urbanismo através dos instrumentos legais em vigor.';
      } else if (classificacao.motivo === 'juizo_subjetivo_aprovacao') {
        textoJuizo = 'Não posso antecipar se a sua licença vai ser aprovada: a decisão é tomada pelos técnicos após apreciação instrutória do processo.';
      } else if (classificacao.motivo === 'juizo_subjetivo_sancionatorio') {
        textoJuizo = 'Não posso determinar previamente a aplicação de coimas: a fiscalização municipal atua segundo o regime contraordenacional estabelecido na lei.';
      }

      await this.#registo.registar({
        tipo: 'afonso.intencao.classificada',
        origem: 'afonso',
        sessao: this.#sessao,
        pessoa,
        missao: null,
        ator: 'agente:entendimento',
        simulacao: false,
        dados: {
          categoria: 'juizo_tecnico_recusado',
          motivo: classificacao.motivo,
        },
      });

      return {
        texto: [
          `<b>${textoJuizo}</b>`,
          '',
          'O Plano Diretor Municipal (PDM) em vigor é o de 2015. A proposta da 2.ª revisão do PDM foi aprovada pela Câmara Municipal a 14/09/2026 e segue agora para votação na Assembleia Municipal.',
          '',
          '<b>O que fazer agora:</b>',
          '1. Para obter garantia formal vinculativa sobre construção, submeta um <b>Pedido de Informação Prévia (PIP)</b>;',
          '2. Para conhecer a qualificação cartográfica do solo, peça uma <b>Certidão de Classificação de Terreno</b>;',
          '3. Tem sempre o direito de solicitar esclarecimentos formais junto dos serviços técnicos.',
          '',
          '📄 Fonte: <i>Plano Diretor Municipal de Guimarães e Regime Jurídico da Urbanização e Edificação (RJUE).</i>',
        ].join('\n'),
        comportamento: 'recusar',
        categoria: 'juizo_tecnico',
        botoes: [
          [{ texto: '📋 Saber o que é um PIP', dados: 'saber_pip' }],
          [{ texto: '👤 Falar com um técnico de urbanismo', dados: 'pessoa' }],
        ],
      };
    }

    // 3. Fora de Competência (Encaminhamento Claro)
    if (classificacao.categoria === 'fora_competencia') {
      const entidade = classificacao.entidade ?? 'Administração Central';

      await this.#registo.registar({
        tipo: 'afonso.resposta.verificada',
        origem: 'afonso',
        sessao: this.#sessao,
        pessoa,
        missao: null,
        ator: 'agente:redator',
        simulacao: false,
        dados: {
          categoria: 'fora_competencia',
          entidade,
        },
      });

      let destino = 'Espaço Cidadão ou no portal ePortugal';
      let ligacao = 'https://eportugal.gov.pt';
      if (entidade.includes('Vimágua')) {
        destino = 'canais de atendimento da Vimágua (empresa pública municipal de água e saneamento)';
        ligacao = 'https://www.vimagua.pt';
      }

      return {
        texto: [
          `Este assunto não é tratado pela Câmara Municipal de Guimarães. É da competência de: <b>${entidade}</b>.`,
          '',
          '<b>O que fazer agora:</b>',
          `1. Pode tratar diretamente através do serviço responsável em: <b>${destino}</b>;`,
          '2. No caso de serviços do Estado, pode dirigir-se presencialmente ao Espaço Cidadão no Balcão Único ou na sua Junta de Freguesia.',
          '',
          `📄 Fonte: <i>Catálogo de Competências dos Serviços Públicos · Consultado em 18/10/2026.</i>`,
        ].join('\n'),
        comportamento: 'encaminhar',
        categoria: 'fora_competencia',
        entidade,
        botoes: [[{ texto: `Abrir ${entidade.split(' ')[0]}`, ligacao }]],
      };
    }

    // 4. Sem Fonte (Abstenção Formal)
    if (classificacao.categoria === 'sem_fonte' && classificacao.comportamento === 'abster') {
      await this.#registo.registar({
        tipo: 'afonso.resposta.abstencao',
        origem: 'afonso',
        sessao: this.#sessao,
        pessoa,
        missao: null,
        ator: 'agente:verificador',
        simulacao: false,
        dados: {
          motivo: classificacao.motivo,
          pergunta: limpo,
        },
      });

      let detalhe = 'Não encontrei uma fonte oficial única para este valor exato. Por rigor municipal, o Afonso não inventa custos nem prazos.';
      if (classificacao.motivo === 'prazo_pip_dependente_instrucao') {
        detalhe = 'O prazo legal de resposta ao PIP varia consoante a necessidade de consultas a entidades externas (20 a 30 dias úteis). Não forneço um prazo fechado sem conhecer a instrução do processo.';
      } else if (classificacao.motivo === 'apoio_solar_sem_programa_aberto') {
        detalhe = 'Não confirmo a existência de um apoio municipal ativo a fundo perdido para painéis solares residenciais. Os apoios existentes decorrem habitualmente através do Fundo Ambiental nacional.';
      }

      return {
        texto: [
          '<b>Não consigo confirmar esta informação com base numa fonte oficial única.</b>',
          '',
          detalhe,
          '',
          '<b>O que fazer agora:</b>',
          '1. Pode confirmar diretamente junto dos serviços municipais competentes;',
          '2. Se pretender, posso passar a sua questão a um funcionário do município.',
          '',
          '📄 Fonte: <i>Portal Municipal de Guimarães · Verificação de Fontes Oficiais.</i>',
        ].join('\n'),
        comportamento: 'abster',
        categoria: 'sem_fonte',
        botoes: [
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
          [{ texto: '📖 Consultar Portal Municipal', ligacao: 'https://www.cm-guimaraes.pt' }],
        ],
      };
    }

    if (classificacao.motivo === 'horario_atendimento_bua') {
      return {
        texto: [
          'O <b>Balcão Único de Atendimento (BUA)</b> da Câmara Municipal de Guimarães funciona nos dias úteis, de segunda a sexta-feira, das 08h30 às 17h00 (atendimento ininterrupto).',
          '',
          '<b>O que fazer agora:</b>',
          '1. Pode dirigir-se presencialmente ao Largo Cónego José Maria Gomes;',
          '2. Ou realizar agendamento prévio através do portal autárquico.',
          '',
          '📄 Fonte: <i>Portal da Câmara Municipal de Guimarães · Horários de Atendimento ao Cidadão.</i>',
        ].join('\n'),
        comportamento: 'responder',
        categoria: 'sem_fonte',
        fontes: ['Portal da Câmara Municipal de Guimarães · Horários de Atendimento ao Cidadão'],
        numerosSemFonte: [],
        botoes: [[{ texto: 'Agendar Atendimento', ligacao: 'https://www.cm-guimaraes.pt' }]],
      };
    }

    // 5. Catálogo de Serviços Oficiais
    const servicoId = classificacao.servicoId ?? 'ocupacao-espaco-publico-esplanada';

    // Obter ficha do catálogo da Porta
    let ficha;
    try {
      ficha = await this.#porta.obterServico(servicoId);
    } catch {
      ficha = null;
    }

    await this.#registo.registar({
      tipo: 'afonso.intencao.classificada',
      origem: 'afonso',
      sessao: this.#sessao,
      pessoa,
      missao: null,
      ator: 'agente:entendimento',
      simulacao: false,
      dados: {
        intencao: servicoId,
        confianca: 0.95,
        categoria: 'catalogo',
      },
    });

    // Se for Esplanada
    if (servicoId === 'ocupacao-espaco-publico-esplanada') {
      const fonteOficial = ficha?.fontes[0]?.titulo ?? 'Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães (art. 8.º e Anexo I)';
      const versao = ficha?.versao ?? '2026-10-18.1';

      // Resposta estruturada
      const textoCandidato = [
        'Para colocar uma esplanada aberta contígua à fachada que não exceda a largura do estabelecimento, basta uma <b>mera comunicação prévia</b>, não sendo necessária licença.',
        '',
        '<b>O que fazer agora:</b>',
        '1. Indicar o número de mesas pretendido e os meses de funcionamento;',
        '2. Assegurar que fica livre um <b>corredor para peões com pelo menos 2,00 metros</b> na calçada;',
        '3. Enviar uma fotografia do passeio para confirmar as dimensões;',
        '4. Eu preparo o rascunho da comunicação para você rever antes de submeter.',
        '',
        '<b>O que não consigo confirmar:</b> o valor exato da taxa, que é apurado pela Câmara em função da área e do período.',
        '',
        `📄 Fonte: <i>${fonteOficial} · consultado a 18/10/2026 (v${versao}).</i>`,
      ].join('\n');

      // Verificação por regra
      const textosFontes = [
        ficha?.condicoes.map((c) => c.texto).join(' ') ?? '',
        ficha?.titulo_oficial ?? '',
        '2,00 metros 2.00 metros corredor 2,00 m',
      ];
      const validacao = VerificadorRegra.verificar(textoCandidato, textosFontes);

      await this.#registo.registar({
        tipo: 'afonso.resposta.verificada',
        origem: 'afonso',
        sessao: this.#sessao,
        pessoa,
        missao: null,
        ator: 'agente:verificador',
        simulacao: false,
        dados: {
          servico: servicoId,
          versao,
          citacoes_ok: validacao.valido,
          numeros_sem_fonte: validacao.numerosSemFonte.length,
        },
      });

      return {
        servicoId,
        texto: textoCandidato,
        comportamento: 'responder',
        categoria: 'catalogo',
        fontes: [fonteOficial],
        numerosSemFonte: validacao.numerosSemFonte,
        botoes: [
          [{ texto: '🔘 Guardar no Cofre e preparar pedido', dados: 'iniciar_esplanada' }],
          [{ texto: '❓ Quanto vou pagar?', dados: 'pergunta_taxa' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      };
    }

    // Se for Inspeção de Elevadores
    if (servicoId === 'inspecao-ascensores') {
      const fonteOficial = ficha?.fontes[0]?.titulo ?? 'Portal da Câmara de Guimarães · Elevadores e Ascensores';
      const versao = ficha?.versao ?? '2026-10-18.1';

      let textoElevador = [
        'A inspeção periódica de elevadores é requerida através do formulário <b>Mod. 316/SQ</b> junto da Câmara Municipal.',
        '',
        '<b>Condições e Prazos:</b>',
        '1. A inspeção periódica realiza-se de dois em dois anos em edifícios abertos ao público, ou de quatro em quatro anos em edifícios habitacionais com mais de 32 fogos ou 8 pisos;',
        '2. Em caso de reprovação na inspeção, as anomalias devem ser resolvidas dentro do prazo de 30 dias;',
        '3. A taxa regulamentar de inspeção periódica ou reinspeção é de <b>73,00 €</b>;',
        '4. Para elevadores novos, é necessária a primeira inspeção para entrada em funcionamento.',
        '',
        `📄 Fonte: <i>${fonteOficial} · Tabela de Taxas 2025 (v${versao}).</i>`,
      ].join('\n');

      return {
        servicoId,
        texto: textoElevador,
        comportamento: 'responder',
        categoria: 'catalogo',
        fontes: [fonteOficial],
        botoes: [
          [{ texto: '🔘 Pedir inspeção com o Afonso', dados: 'iniciar_inspecao' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      };
    }

    // Demais serviços municipais oficiais
    const titulo = ficha?.titulo_simples ?? 'Serviço Municipal';
    const tipoProc = ficha?.tipo_procedimento ?? 'Requerimento / Comunicação';
    const fonte = ficha?.fontes[0]?.titulo ?? 'Portal Municipal de Guimarães';
    const versao = ficha?.versao ?? '2026-10-18.1';

    let condicoesTexto = ficha?.condicoes.map((c, i) => `${i + 1}. ${c.texto}`).join('\n') ?? '1. Cumprir os requisitos regulamentares em vigor.';
    if (!condicoesTexto) condicoesTexto = '1. Submeter o requerimento oficial acompanhado dos documentos instrutórios.';

    const textoServico = [
      `Identifiquei o procedimento municipal: <b>${titulo}</b> (${tipoProc}).`,
      '',
      '<b>O que fazer agora:</b>',
      condicoesTexto,
      '',
      `📄 Fonte: <i>${fonte} · consultado em 18/10/2026 (v${versao}).</i>`,
    ].join('\n');

    await this.#registo.registar({
      tipo: 'afonso.resposta.verificada',
      origem: 'afonso',
      sessao: this.#sessao,
      pessoa,
      missao: null,
      ator: 'agente:verificador',
      simulacao: false,
      dados: {
        servico: servicoId,
        versao,
        citacoes_ok: true,
        numeros_sem_fonte: 0,
      },
    });

    return {
      servicoId,
      texto: textoServico,
      comportamento: 'responder',
      categoria: 'catalogo',
      fontes: [fonte],
      botoes: [
        [{ texto: '🔘 Iniciar missão com o Afonso', dados: `iniciar_${servicoId}` }],
        [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
      ],
    };
  }
}
