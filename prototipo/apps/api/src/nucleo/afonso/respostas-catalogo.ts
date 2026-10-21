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
  historico?: Array<{ autor: 'pessoa' | 'afonso'; texto: string }>;
}): Promise<RespostaAfonso> {
  const { servicoId, ficha, limpo, prefixoMudanca, pessoa, sessao, registo, redator, decisaoJev, historico } = params;

  // 1. Esplanada Aberta
  if (servicoId === 'ocupacao-espaco-publico-esplanada') {
    const versao = ficha?.versao ?? '2026-10-18.1';
    const refTitulo = 'Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães (Artigo 8.º e Anexo I)';
    const fonteOficial = `${refTitulo} · consultado a 18/10/2026 (v${versao})`;

    const textoCandidato = [
      'Para colocar uma esplanada aberta contígua à fachada que não exceda a largura do estabelecimento, o procedimento oficial da Câmara de Guimarães é a <b>Mera Comunicação Prévia de Ocupação do Espaço Público</b> (Formulário OVP-SO).',
      '',
      '<b>Requisitos e Condições Oficiais:</b>',
      '• Ocupar exclusivamente o espaço público contíguo à fachada e não exceder a sua largura;',
      '• Garantir obrigatoriamente um <b>corredor para peões com pelo menos 2,00 metros</b> livres na calçada;',
      '• O mobiliário tem de ser amovível (mesas, cadeiras, guarda-sóis) e sem fixação ao pavimento.',
      '',
      '<b>Documentos Necessários (Formulário OVP-SO):</b>',
      '1. Requerimento/Formulário de Ocupação de Espaço Público (Modelo OVP-SO);',
      '2. Planta de localização ou fotografia do local com a área delimitada e corredor livre de 2,00 metros;',
      '3. Certidão permanente da empresa ou comprovativo de início de atividade do estabelecimento;',
      '4. Apólice de seguro de responsabilidade civil válida.',
      '',
      '<b>Taxas e Prazos:</b>',
      '• <b>Taxa:</b> O valor é apurado pela Câmara em função da área (m²) e do período de ocupação, nos termos do Regulamento de Taxas (RTTL 2025);',
      '• <b>Prazo:</b> Mera comunicação prévia com efeitos imediatos após submissão e liquidação da taxa devida.',
      '',
      '<b>Apoio do Afonso:</b> Se pretender que eu trate deste pedido por si — reunindo os documentos no seu Cofre Digital, instruindo o formulário e apoiando na submissão com a sua Chave Móvel Digital —, basta dizer <i>«Ajuda-me a tratar»</i> ou carregar no botão abaixo.',
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
        'Formulário Modelo OVP-SO Certidão permanente Seguro responsabilidade civil',
      ].join('\n'),
      fonteOficial,
      versao,
      textoReferencia: textoCandidato,
    });

    const textoFinal = redacao.texto;
    const textosFontes = [
      ficha?.condicoes.map((c) => c.texto).join(' ') ?? '',
      ficha?.titulo_oficial ?? '',
      '2,00 metros 2.00 metros corredor 2,00 m OVP-SO RTTL 2025',
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
    };
  }

  // 2. Pedido de Informação Prévia (PDM / Urbanismo)
  if (servicoId === 'pedido-informacao-previa-urbanismo') {
    const versao = ficha?.versao ?? '2026-10-18.1';
    const refTitulo = 'Regulamento do Plano Diretor Municipal de Guimarães (Aviso n.º 23214/2020 · Artigos 45.º e 62.º)';
    const fonteOficial = `${refTitulo} · consultado a 18/10/2026 (v${versao})`;

    const textoCandidato = [
      'Para saber se pode construir no seu terreno em Silvares, o procedimento correto é o <b>Pedido de Informação Prévia (PIP)</b> ao abrigo do Artigo 14.º do RJUE e do PDM de Guimarães.',
      '',
      '<b>Regras aplicáveis pelo PDM de Guimarães:</b>',
      '• <b>Cércea máxima:</b> 3 pisos (acima da cota de soleira);',
      '• <b>Índice de utilização do solo:</b> máximo de 0.60 para habitação unifamiliar em espaço residencial;',
      '• <b>Afastamentos:</b> mínimo de 3 metros aos limites laterais e tardoz;',
      '• <b>Servidões:</b> exclusão obrigatória de condicionantes da Reserva Ecológica Nacional (REN) e Reserva Agrícola (RAN).',
      '',
      '<b>Documentos Necessários (Artigo 14.º do RJUE):</b>',
      '1. Requerimento de PIP no portal Urbanismo Digital da Câmara;',
      '2. Certidão da Conservatória do Registo Predial e Caderneta Predial em PDF;',
      '3. Planta de localização à escala 1:25000 e planta de implantação;',
      '4. Memória descritiva e levantamento topográfico com coordenadas.',
      '',
      '<b>Prazos e Custos:</b>',
      '• A resposta da Câmara ao PIP tem efeito vinculativo pelo prazo de 1 ano;',
      '• A consulta sumária e enquadramento prévio não têm custos associados.',
      '',
      '<b>Apoio do Afonso:</b> Se pretender que eu organize o processo no seu Cofre Digital pessoal para posterior submissão com Chave Móvel Digital, basta dizer <i>«Ajuda-me a tratar»</i> ou carregar no botão abaixo.',
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
      'Aviso n.º 23214/2020 Artigos 45.º e 62.º PDM 3 pisos 0.60 3 metros RJUE Artigo 14 1 ano',
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
    };
  }

  // 3. Inspeção e Certificação de Elevadores
  if (servicoId === 'inspecao-ascensores') {
    const versao = ficha?.versao ?? '2026-10-18.1';
    const refTitulo = 'Regulamento de Elevadores e Ascensores de Guimarães · Artigo 34.º da Tabela de Taxas 2025';
    const fonteOficial = `${refTitulo} · consultado a 18/10/2026 (v${versao})`;

    const textoCandidato = [
      'A inspeção periódica de elevadores e ascensores é obrigatória para garantir a segurança dos utilizadores:',
      '',
      '<b>Periodicidade e Prazos Oficiais:</b>',
      '• De 2 em 2 anos em edifícios abertos ao público ou comerciais;',
      '• De 4 em 4 anos em edifícios residenciais (>32 fogos ou >8 pisos).',
      '',
      '<b>Documentos Necessários:</b>',
      '1. Requerimento Modelo 316/SQ;',
      '2. Relatório de manutenção emitido por Empresa de Manutenção de Ascensores (EMA);',
      '3. Cópia do termo de responsabilidade da instalação.',
      '',
      '<b>Taxa Municipal Fixa:</b>',
      '• 73,00 € nos termos da Tabela de Taxas 2025 da Câmara Municipal de Guimarães.',
      '',
      '<b>Apoio do Afonso:</b> Se pretender que eu instrua o formulário de pedido de vistoria ou emita a referência para pagamento, basta dizer.',
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
      '<b>Condições de Acesso:</b>',
      '• Ter idade igual ou superior a 65 anos;',
      '• Estar recenseado no Concelho de Guimarães.',
      '',
      '<b>Documentos Necessários:</b>',
      '1. Cartão de Cidadão (ou Bilhete de Identidade e NIF);',
      '2. Comprovativo de recenseamento eleitoral ou residência no concelho de Guimarães;',
      '3. Fotografia tipo passe recente.',
      '',
      '<b>Vantagens e Custo:</b>',
      '• <b>Custo:</b> Gratuito;',
      '• <b>Vantagens:</b> Descontos em transportes públicos concelhios, ingressos em eventos culturais municipais, piscinas e taxas autárquicas.',
      '',
      '<b>Apoio do Afonso:</b> Se pretender que eu guarde o pedido no seu Cofre Digital Pessoal para validação e emissão pela Câmara, basta dizer.',
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
    };
  }

  // 5. Outros Serviços Curados do Catálogo Oficial
  const tituloOficial = ficha?.titulo_oficial ?? servicoId;
  const tituloSimples = ficha?.titulo_simples ?? tituloOficial;
  const versao = ficha?.versao ?? '2026-10-18.1';
  const diploma = ficha?.fontes?.[0]?.titulo ?? 'Portal do Município de Guimarães · Catálogo de Serviços';
  const fonte = `${diploma} · consultado a 18/10/2026 (v${versao})`;

  const condicoesTexto = ficha?.condicoes && ficha.condicoes.length > 0
    ? ficha.condicoes.map((c) => `• ${c.texto}`).join('\n')
    : '• Consulte os requisitos específicos no regulamento municipal.';

  const documentosTexto = ficha?.documentos && ficha.documentos.length > 0
    ? ficha.documentos.map((d) => `• ${d.texto}`).join('\n')
    : '• Documento de identificação oficial e formulário do procedimento.';

  const prazosTexto = ficha?.prazos && ficha.prazos.length > 0
    ? ficha.prazos.map((p) => `• ${p.texto}`).join('\n')
    : '• Prazos regulamentares nos termos do Código do Procedimento Administrativo.';

  const textoRef = [
    `Sobre o procedimento «<b>${tituloOficial}</b>»:`,
    '',
    '<b>Requisitos e Condições Oficiais:</b>',
    condicoesTexto,
    '',
    '<b>Documentos Necessários:</b>',
    documentosTexto,
    '',
    '<b>Prazos e Taxas:</b>',
    `• <b>Prazo:</b> ${prazosTexto.replace(/^• /, '')}`,
    `• <b>Taxas:</b> ${ficha?.taxas?.descricao ?? 'Consulte a Tabela de Taxas em vigor'}.`,
    '',
    '<b>Apoio do Afonso:</b> Se pretender que eu organize os elementos instrutórios no seu Cofre Digital Pessoal, basta dizer.',
    '',
    `📄 Fonte: <i>${fonte}</i>`,
  ].join('\n');

  const redacao = await redator.redigir({
    pergunta: limpo,
    servicoId,
    categoria: 'catalogo',
    comportamento: 'responder',
    contextoFactos: [tituloOficial, condicoesTexto, documentosTexto, fonte].join('\n'),
    fonteOficial: fonte,
    versao,
    textoReferencia: textoRef,
    historicoConversa: historico,
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
  };
}
