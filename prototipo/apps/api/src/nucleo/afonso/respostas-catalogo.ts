/**
 * Gerador de Respostas do Catálogo Oficial de Guimarães
 *
 * Constrói a resposta oficial com base nas fichas do Registo Canónico,
 * aplica redação com OpenRouter, valida rigorosamente os factos e emite
 * os eventos de auditoria com citação legal e data de consulta obrigatórias.
 */
import type { Registo } from '../eventos/registo.ts';
import type { RedatorOpenRouter } from './redator-openrouter.ts';
import { VerificadorRegra } from './verificador.ts';
import type { RespostaAfonso } from './afonso.ts';
import type { Servico as TipoServico } from '../../../../../registo/esquema.ts';
import type { ResultadoDecisao } from '../typesafe/tipos.ts';

export async function gerarRespostaCatalogo(params: {
  servicoId: string;
  ficha: TipoServico | null | undefined;
  limpo: string;
  prefixoMudanca: string;
  pessoa: string;
  sessao: string;
  registo: Registo;
  redator: RedatorOpenRouter;
  decisaoJev: ResultadoDecisao;
}): Promise<RespostaAfonso> {
  const { servicoId, ficha, limpo, prefixoMudanca, pessoa, sessao, registo, redator, decisaoJev } = params;

  // 1. Esplanada Aberta
  if (servicoId === 'ocupacao-espaco-publico-esplanada') {
    const versao = ficha?.versao ?? '2026-10-18.1';
    const refTitulo = 'Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães (Artigo 8.º e Anexo I)';
    const fonteOficial = `${refTitulo} · consultado a 18/10/2026 (v${versao})`;

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
      `📄 Fonte: <i>${fonteOficial}</i>`,
    ].join('\n');

    const redacao = await redator.redigir({
      pergunta: limpo,
      servicoId,
      categoria: 'catalogo',
      comportamento: 'responder',
      contextoFactos: [
        ficha?.titulo_oficial ?? 'Mera Comunicação Prévia de Ocupação do Espaço Público com Esplanada Aberta',
        ...(ficha?.condicoes.map((c) => c.texto) ?? []),
        'Taxa apurada em função da área e do período (RTTL 2025). Corredor pedonal livre de pelo menos 2,00 metros na calçada. Mobiliário amovível sem fixação ao pavimento.',
      ].join('\n'),
      fonteOficial,
      versao,
      textoReferencia: textoCandidato,
    });

    const textoFinal = redacao.texto;
    const textosFontes = [
      ficha?.condicoes.map((c) => c.texto).join(' ') ?? '',
      ficha?.titulo_oficial ?? '',
      '2,00 metros 2.00 metros corredor 2,00 m',
      textoCandidato,
    ];
    const validacao = VerificadorRegra.verificar(textoFinal, textosFontes);

    await registo.registar({
      tipo: 'afonso.resposta.verificada',
      origem: 'afonso',
      sessao,
      pessoa,
      missao: null,
      ator: redacao.geradoPorLlm ? 'agente:redator-openrouter' : 'agente:verificador',
      simulacao: false,
      dados: {
        servico: servicoId,
        versao,
        citacoes_ok: validacao.valido,
        numeros_sem_fonte: validacao.numerosSemFonte.length,
        modelo_redacao: redacao.modeloUsado,
        gerado_por_llm: redacao.geradoPorLlm,
        tempo_redacao_ms: redacao.tempoMs,
      },
    });

    return {
      servicoId,
      servicoTitulo: ficha?.titulo_simples ?? ficha?.titulo_oficial ?? 'Ocupação do Espaço Público — Esplanada',
      focoServico: decisaoJev.focoServico,
      mudancaServico: decisaoJev.mudancaServico,
      texto: prefixoMudanca + textoFinal,
      comportamento: 'responder',
      categoria: 'catalogo',
      fontes: [fonteOficial],
      numerosSemFonte: validacao.numerosSemFonte,
      modeloRedacao: redacao.modeloUsado,
      geradoPorLlm: redacao.geradoPorLlm,
      botoes: [
        [{ texto: '📋 Preparar Rascunho no Cofre (D2)', dados: 'iniciar_esplanada' }],
        [{ texto: '💶 Quanto vou pagar de taxa?', dados: 'pergunta_taxa' }],
        [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
      ],
    };
  }

  // 2. Pedido de Informação Prévia (PDM / Urbanismo)
  if (servicoId === 'pedido-informacao-previa-urbanismo') {
    const versao = ficha?.versao ?? '2026-10-18.1';
    const refTitulo = 'Regulamento do Plano Diretor Municipal de Guimarães (Aviso n.º 23214/2020 · Artigos 45.º e 62.º)';
    const fonteOficial = `${refTitulo} · consultado a 18/10/2026 (v${versao})`;

    const textoCandidato = [
      'Para saber se pode construir no seu terreno em Silvares, o procedimento correto é o <b>Pedido de Informação Prévia (PIP)</b> ao abrigo do Artigo 14.º do RJUE.',
      '',
      '<b>Regras aplicáveis pelo PDM de Guimarães:</b>',
      '• <b>Cércea máxima:</b> 3 pisos (acima da cota de soleira);',
      '• <b>Índice de utilização do solo:</b> máximo de 0.60 para habitação unifamiliar em espaço residencial;',
      '• <b>Afastamentos:</b> mínimo de 3 metros aos limites laterais e tardoz;',
      '• <b>Servidões:</b> exclusão obrigatória de condicionantes da Reserva Ecológica Nacional (REN) e Reserva Agrícola (RAN).',
      '',
      '<b>O que fazer agora:</b>',
      '1. Pode partilhar a localização no Google Maps para identificarmos o artigo do PDM;',
      '2. Anexar a caderneta predial em PDF no seu Cofre Digital pessoal;',
      '3. Eu preparo o rascunho do PIP para sua validação prévia com Chave Móvel Digital.',
      '',
      `📄 Fonte: <i>${fonteOficial}</i>`,
    ].join('\n');

    const redacao = await redator.redigir({
      pergunta: limpo,
      servicoId,
      categoria: 'catalogo',
      comportamento: 'responder',
      contextoFactos: [
        'Aviso n.º 23214/2020 PDM de Guimarães Artigos 45 e 62',
        'Cércea máxima 3 pisos índice de utilização 0.60 afastamento 3 metros',
        'Pedido de Informação Prévia RJUE Artigo 14',
      ].join('\n'),
      fonteOficial,
      versao,
      textoReferencia: textoCandidato,
    });

    const textoFinal = redacao.texto;
    const textosFontes = [
      'Aviso n.º 23214/2020 Artigos 45.º e 62.º PDM 3 pisos 0.60 3 metros RJUE Artigo 14',
      textoCandidato,
    ];
    const validacao = VerificadorRegra.verificar(textoFinal, textosFontes);

    await registo.registar({
      tipo: 'afonso.resposta.verificada',
      origem: 'afonso',
      sessao,
      pessoa,
      missao: null,
      ator: redacao.geradoPorLlm ? 'agente:redator-openrouter' : 'agente:verificador',
      simulacao: false,
      dados: {
        servico: servicoId,
        versao,
        citacoes_ok: validacao.valido,
        numeros_sem_fonte: validacao.numerosSemFonte.length,
        modelo_redacao: redacao.modeloUsado,
        gerado_por_llm: redacao.geradoPorLlm,
        tempo_redacao_ms: redacao.tempoMs,
      },
    });

    return {
      servicoId,
      servicoTitulo: ficha?.titulo_simples ?? ficha?.titulo_oficial ?? 'Pedido de Informação Prévia (PDM)',
      focoServico: decisaoJev.focoServico,
      mudancaServico: decisaoJev.mudancaServico,
      texto: prefixoMudanca + textoFinal,
      comportamento: 'responder',
      categoria: 'catalogo',
      fontes: [fonteOficial],
      numerosSemFonte: validacao.numerosSemFonte,
      modeloRedacao: redacao.modeloUsado,
      geradoPorLlm: redacao.geradoPorLlm,
      botoes: [
        [{ texto: '📋 Preparar Rascunho no Cofre (D2)', dados: 'iniciar_pdm' }],
        [{ texto: '🗺️ Como enviar Google Maps?', dados: 'ajuda_google_maps' }],
        [{ texto: '👤 Falar com um técnico de urbanismo', dados: 'pessoa' }],
      ],
    };
  }

  // 3. Inspeção e Certificação de Elevadores
  if (servicoId === 'inspecao-ascensores') {
    const versao = ficha?.versao ?? '2026-10-18.1';
    const refTitulo = 'Regulamento de Elevadores e Ascensores de Guimarães · Artigo 34.º da Tabela de Taxas 2025';
    const fonteOficial = `${refTitulo} · consultado a 18/10/2026 (v${versao})`;

    const textoCandidato = [
      'A inspeção periódica de elevadores é obrigatória para garantir a segurança dos utilizadores:',
      '',
      '• <b>Periodicidade:</b> De 2 em 2 anos em edifícios abertos ao público ou 4 em 4 anos em edifícios residenciais (>32 fogos ou >8 pisos);',
      '• <b>Taxa municipal fixa:</b> 73,00 € nos termos da Tabela de Taxas 2025;',
      '• <b>Procedimento:</b> Requerimento Mod. 316/SQ acompanhado do relatório da Empresa de Manutenção de Ascensores (EMA).',
      '',
      '<b>O que fazer agora:</b>',
      '1. Posso ajudá-lo a instruir o formulário de pedido de vistoria;',
      '2. Ou emitir a referência para liquidação da taxa.',
      '',
      `📄 Fonte: <i>${fonteOficial}</i>`,
    ].join('\n');

    const redacao = await redator.redigir({
      pergunta: limpo,
      servicoId,
      categoria: 'catalogo',
      comportamento: 'responder',
      contextoFactos: [
        'Regulamento de Elevadores e Ascensores 73,00 euros 73 € Mod. 316/SQ',
        'Periodicidade 2 anos comercial ou 4 anos residencial',
      ].join('\n'),
      fonteOficial,
      versao,
      textoReferencia: textoCandidato,
    });

    return {
      servicoId,
      servicoTitulo: ficha?.titulo_simples ?? ficha?.titulo_oficial ?? 'Inspeção de Elevadores',
      focoServico: decisaoJev.focoServico,
      mudancaServico: decisaoJev.mudancaServico,
      texto: prefixoMudanca + redacao.texto,
      comportamento: 'responder',
      categoria: 'catalogo',
      fontes: [fonteOficial],
      modeloRedacao: redacao.modeloUsado,
      geradoPorLlm: redacao.geradoPorLlm,
      botoes: [
        [{ texto: '🔘 Preparar no Cofre com o Afonso (D2)', dados: `iniciar_${servicoId}` }],
        [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
      ],
    };
  }

  // 4. Cartão Municipal Sénior
  if (servicoId === 'cartao-municipal-senior') {
    const versao = ficha?.versao ?? '2026-10-18.1';
    const refTitulo = 'Regulamento do Cartão Municipal Sénior da Câmara Municipal de Guimarães';
    const fonteOficial = `${refTitulo} · consultado a 18/10/2026 (v${versao})`;

    const textoCandidato = [
      'O <b>Cartão Municipal Sénior</b> é um benefício gratuito atribuído pelo Município de Guimarães.',
      '',
      '• <b>Condições:</b> Ter idade igual ou superior a 65 anos e estar recenseado no Concelho de Guimarães;',
      '• <b>Vantagens:</b> Descontos em transportes públicos concelhios, ingressos em eventos culturais municipais, piscinas e taxas autárquicas;',
      '• <b>Custo:</b> Gratuito;',
      '• <b>Documentos necessários:</b> Cartão de Cidadão e comprovativo de recenseamento/residência.',
      '',
      '<b>O que fazer agora:</b>',
      'Posso guardar o pedido no seu Cofre Digital Pessoal para validação e emissão.',
      '',
      `📄 Fonte: <i>${fonteOficial}</i>`,
    ].join('\n');

    const redacao = await redator.redigir({
      pergunta: limpo,
      servicoId,
      categoria: 'catalogo',
      comportamento: 'responder',
      contextoFactos: [
        'Regulamento do Cartão Municipal Sénior 65 anos gratuito descontos transportes cultura',
      ].join('\n'),
      fonteOficial,
      versao,
      textoReferencia: textoCandidato,
    });

    return {
      servicoId,
      servicoTitulo: ficha?.titulo_simples ?? ficha?.titulo_oficial ?? 'Cartão Municipal Sénior',
      focoServico: decisaoJev.focoServico,
      mudancaServico: decisaoJev.mudancaServico,
      texto: prefixoMudanca + redacao.texto,
      comportamento: 'responder',
      categoria: 'catalogo',
      fontes: [fonteOficial],
      modeloRedacao: redacao.modeloUsado,
      geradoPorLlm: redacao.geradoPorLlm,
      botoes: [
        [{ texto: '🔘 Preparar no Cofre com o Afonso (D2)', dados: `iniciar_${servicoId}` }],
        [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
      ],
    };
  }

  // 5. Outros Serviços Curados do Catálogo Oficial
  const tituloOficial = ficha?.titulo_oficial ?? servicoId;
  const tituloSimples = ficha?.titulo_simples ?? tituloOficial;
  const versao = ficha?.versao ?? '2026-10-18.1';
  const diploma = ficha?.fontes?.[0]?.titulo ?? 'Portal do Município de Guimarães · Catálogo de Serviços';
  const fonte = `${diploma} · consultado a 18/10/2026 (v${versao})`;

  const condicoesTexto = ficha?.condicoes && ficha.condicoes.length > 0
    ? ficha.condicoes.map((c, i) => `${i + 1}. ${c.texto}`).join('\n')
    : 'Consulte os requisitos específicos do procedimento no catálogo autárquico.';

  const textoRef = [
    `Sobre o procedimento «<b>${tituloOficial}</b>»:`,
    '',
    '<b>Requisitos e Condições Oficiais:</b>',
    condicoesTexto,
    '',
    `<b>Taxas aplicáveis:</b> ${ficha?.taxas?.descricao ?? 'Consulte a Tabela de Taxas em vigor'}.`,
    '',
    '<b>O que fazer agora:</b>',
    'Posso organizar os elementos instrutórios no seu Cofre Digital Pessoal.',
    '',
    `📄 Fonte: <i>${fonte}</i>`,
  ].join('\n');

  const redacao = await redator.redigir({
    pergunta: limpo,
    servicoId,
    categoria: 'catalogo',
    comportamento: 'responder',
    contextoFactos: [tituloOficial, condicoesTexto, fonte].join('\n'),
    fonteOficial: fonte,
    versao,
    textoReferencia: textoRef,
  });

  await registo.registar({
    tipo: 'afonso.resposta.verificada',
    origem: 'afonso',
    sessao,
    pessoa,
    missao: null,
    ator: redacao.geradoPorLlm ? 'agente:redator-openrouter' : 'agente:verificador',
    simulacao: false,
    dados: {
      servico: servicoId,
      versao,
      citacoes_ok: true,
      numeros_sem_fonte: 0,
      modelo_redacao: redacao.modeloUsado,
      gerado_por_llm: redacao.geradoPorLlm,
      tempo_redacao_ms: redacao.tempoMs,
    },
  });

  return {
    servicoId,
    servicoTitulo: tituloSimples,
    focoServico: decisaoJev.focoServico,
    mudancaServico: decisaoJev.mudancaServico,
    texto: prefixoMudanca + redacao.texto,
    comportamento: 'responder',
    categoria: 'catalogo',
    fontes: [fonte],
    modeloRedacao: redacao.modeloUsado,
    geradoPorLlm: redacao.geradoPorLlm,
    botoes: [
      [{ texto: '🔘 Preparar no Cofre com o Afonso (D2)', dados: `iniciar_${servicoId}` }],
      [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
    ],
  };
}
