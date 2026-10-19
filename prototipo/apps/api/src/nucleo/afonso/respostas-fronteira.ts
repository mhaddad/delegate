/**
 * Respostas de Salvaguarda e Fronteiras Regulamentares do Afonso
 *
 * Trata os casos em que o representante leal deve recusar, encaminhar
 * ou abster-se formalmente para proteger o cidadão e a integridade legal:
 * 1. Tentativas adversariais, de personificação humana ou violação de privacidade (RGPD);
 * 2. Pedidos de juízo técnico ou prognósticos de viabilidade discricionária;
 * 3. Assuntos fora da competência autárquica (Vimágua, Administração Central / IRN);
 * 4. Perguntas sem fonte regulamentar única e comprovada (abstenção formal).
 */
import type { Registo } from '../eventos/registo.ts';
import type { ClassificacaoIntencao } from './classificador.ts';
import type { RespostaAfonso } from './afonso.ts';

export async function tratarAdversarial(
  pessoa: string,
  classificacao: ClassificacaoIntencao,
  registo: Registo,
  sessao: string,
): Promise<RespostaAfonso | null> {
  if (classificacao.categoria !== 'adversarial') return null;

  if (classificacao.comportamento === 'recusar') {
    let motivoTexto = 'Não posso executar esta instrução por violar as regras de segurança e privacidade municipal.';
    if (classificacao.motivo === 'tentativa_prompt_injection') {
      motivoTexto = 'Não é possível confirmar qualquer aprovação sem a prévia validação pelos técnicos municipais. O Afonso não executa comandos para contornar os regulamentos em vigor.';
    } else if (classificacao.motivo === 'pedido_dados_terceiros_e_falsa_identidade') {
      motivoTexto = 'Por imperativo legal de proteção de dados e privacidade (RGPD), não consulto nem forneço dados pessoais ou fiscais de outros cidadãos. Além disso, sou um assistente de inteligência artificial e não finjo ser um funcionário humano.';
    } else if (classificacao.motivo === 'tentativa_impersonacao_humana') {
      motivoTexto = 'Sou o Afonso, um assistente de inteligência artificial criado para trabalhar para si. Não sou funcionário da Câmara nem finjo sê-lo. Pode pedir para falar com uma pessoa a qualquer momento.';
    }

    await registo.registar({
      tipo: 'afonso.resposta.recusada',
      origem: 'afonso',
      sessao,
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
    await registo.registar({
      tipo: 'afonso.resposta.abstencao',
      origem: 'afonso',
      sessao,
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

  return null;
}

export async function tratarJuizoTecnico(
  pessoa: string,
  classificacao: ClassificacaoIntencao,
  registo: Registo,
  sessao: string,
): Promise<RespostaAfonso | null> {
  if (classificacao.categoria !== 'juizo_tecnico') return null;

  let textoJuizo = 'Não posso emitir juízos de viabilidade técnica ou prognósticos sobre decisões administrativas: as decisões cabem exclusivamente aos serviços técnicos municipais.';
  if (classificacao.motivo === 'juizo_viabilidade_urbanistica') {
    textoJuizo = 'Não posso dizer se pode ou não construir no terreno: essa viabilidade é determinada pelos serviços de urbanismo através dos instrumentos legais em vigor.';
  } else if (classificacao.motivo === 'juizo_subjetivo_aprovacao') {
    textoJuizo = 'Não posso antecipar se a sua licença vai ser aprovada: a decisão é tomada pelos técnicos após apreciação instrutória do processo.';
  } else if (classificacao.motivo === 'juizo_subjetivo_sancionatorio') {
    textoJuizo = 'Não posso determinar previamente a aplicação de coimas: a fiscalização municipal atua segundo o regime contraordenacional estabelecido na lei.';
  }

  await registo.registar({
    tipo: 'afonso.intencao.classificada',
    origem: 'afonso',
    sessao,
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

export async function tratarForaCompetencia(
  pessoa: string,
  classificacao: ClassificacaoIntencao,
  registo: Registo,
  sessao: string,
): Promise<RespostaAfonso | null> {
  if (classificacao.categoria !== 'fora_competencia') return null;

  const entidade = classificacao.entidade ?? 'Administração Central';

  await registo.registar({
    tipo: 'afonso.resposta.verificada',
    origem: 'afonso',
    sessao,
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
      '📄 Fonte: <i>Catálogo de Competências dos Serviços Públicos · Consultado em 18/10/2026.</i>',
    ].join('\n'),
    comportamento: 'encaminhar',
    categoria: 'fora_competencia',
    entidade,
    botoes: [[{ texto: `Abrir ${entidade.split(' ')[0]}`, ligacao }]],
  };
}

export async function tratarSemFonte(
  pessoa: string,
  classificacao: ClassificacaoIntencao,
  limpo: string,
  registo: Registo,
  sessao: string,
): Promise<RespostaAfonso | null> {
  if (classificacao.categoria !== 'sem_fonte') return null;

  if (classificacao.comportamento === 'abster') {
    await registo.registar({
      tipo: 'afonso.resposta.abstencao',
      origem: 'afonso',
      sessao,
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

  // Atendimento Geral presencial
  if (classificacao.motivo === 'atendimento_geral_presencial') {
    return {
      texto: [
        'O atendimento geral presencial da Câmara Municipal de Guimarães funciona de <b>segunda a sexta-feira, das 09h00 às 17h00</b>, no Balcão Único de Atendimento (Largo Cónego José Maria Gomes).',
        '',
        '<b>O que fazer agora:</b>',
        '1. Pode dirigir-se diretamente ao Balcão Único;',
        '2. Ou agendar previamente para evitar tempos de espera.',
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

  return null;
}
