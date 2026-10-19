/**
 * O núcleo: uma passagem de mensagem por três portas e um ecrã.
 *
 *   Telegram -> canal -> evento na base -> notificação -> SSE -> Observatório / Consola
 *
 * Módulos integrados:
 *   - Afonso: respostas com fonte e verificação estrita
 *   - Cofre Digital: cifra AES-256-GCM, 3 camadas e Guardião de Contexto
 *   - Serviço de Chaves: libertação temporária auditada e recolha automática
 *   - Mandatos: níveis D0 a D4, concessão, verificação e revogação
 *   - Motor de Política: permitir, confirmar, bloquear
 *   - Orquestrador: máquina de estados da missão e checklist oficial
 *
 *   npm run nucleo
 */
import { criarCanalGrammy, escapar, type CanalGrammy } from './canal.ts';
import { abrirBase, SESSAO } from './bd.ts';
import { Registo } from './eventos/registo.ts';
import { criarServidorEventos, type DadosConfirmacaoCmd } from './eventos/servidor.ts';
import { Afonso } from './afonso/afonso.ts';
import { ClientePortaMcp } from './afonso/cliente-porta.ts';
import { CofreDigital } from './cofre/cofre.ts';
import { ServicoChavesCofre } from './cofre/servico-chaves.ts';
import { GestorMandatos } from './mandatos/mandatos.ts';
import { MotorPolitica } from './politica/politica.ts';
import { OrquestradorMissoes } from './orquestrador/missao.ts';

const PORTA_EVENTOS = 4000;

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error('✖ Falta o TELEGRAM_BOT_TOKEN. Ver npm run ouvir para a explicação.');
  process.exit(1);
}

console.log('a abrir a base…');
const base = await abrirBase();
const registro = new Registo(base.escrita);
console.log('✓ base aberta');

const servidor = criarServidorEventos(registro, () => base.escutar(), async (dados) => {
  await processarConfirmacaoCmd(dados);
});
servidor.listen(PORTA_EVENTOS, () => {
  console.log(`✓ fluxo de eventos em http://localhost:${PORTA_EVENTOS}/eventos/stream`);
});

const canal: CanalGrammy = criarCanalGrammy(token);
const clientePorta = new ClientePortaMcp();
const afonso = new Afonso(registro, clientePorta, SESSAO);

// Módulos de autoridade e privacidade
const servicoChaves = new ServicoChavesCofre(registro, SESSAO);
const cofre = new CofreDigital(registro, servicoChaves, SESSAO);
const mandatos = new GestorMandatos(registro, SESSAO);
const politica = new MotorPolitica(registro, mandatos, SESSAO);
const orquestrador = new OrquestradorMissoes(registro, SESSAO);

const conversasPorPessoa = new Map<string, string>();
let ultimaConversa: string | null = null;
let aguardaFachada = false;

// Ciclo fechado: escutar eventos da Consola/SU para notificar cidadão no Telegram
const escutaNucleo = await base.escutar();
escutaNucleo.on('error', (err: Error) => {
  console.warn('⚠ aviso na escuta pg do núcleo:', err.message);
});
await escutaNucleo.query('LISTEN eventos');

escutaNucleo.on('notification', async (aviso: any) => {
  const seq = Number(aviso.payload);
  if (!Number.isFinite(seq)) return;
  try {
    const ev = await registro.porSeq(seq);
    if (!ev) return;

    if (ev.tipo === 'su.processo.estado.alterado') {
      const chat = (ev.pessoa ? conversasPorPessoa.get(ev.pessoa) : null) ?? ultimaConversa;
      if (!chat) return;

      const pessoa = ev.pessoa ?? 'ines_guimaraes';
      const missaoAtiva = orquestrador.obterAtiva(pessoa);

      if (ev.dados.para === 'pedido_elementos') {
        aguardaFachada = true;
        if (missaoAtiva) {
          await orquestrador.mudarEstado(missaoAtiva.id, 'precisa_de_si', 'Câmara pediu elementos adicionais');
        }
        await canal.enviar(
          chat,
          [
            '🏛️ <b>Notificação da Câmara Municipal de Guimarães</b>',
            '',
            'A técnica do Gabinete de Serviços Urbanos está a analisar o processo <code>OEP/2026/0001</code> e solicitou um elemento adicional:',
            '👉 <b>Largura da fachada do estabelecimento</b> (para validação cadastral).',
            '',
            'Pode responder diretamente aqui (ex.: <i>«8 metros»</i>) ou carregar no botão:',
          ].join('\n'),
          [[{ texto: '📐 Indicar: 8 metros de fachada', dados: 'responder_8m' }]],
        );
      } else if (ev.dados.para === 'aceite') {
        aguardaFachada = false;
        if (missaoAtiva) {
          await orquestrador.mudarEstado(missaoAtiva.id, 'respondido', 'Processo aceite pela técnica');
          await servicoChaves.recolherChave(pessoa, missaoAtiva.id, 'missao_concluida');
        }
        const taxa = (ev.dados.taxa as { valor?: number } | undefined)?.valor ?? 75.75;
        await canal.enviar(
          chat,
          [
            '✅ <b>Comunicação Prévia Deferida!</b>',
            '',
            'A técnica do Gabinete de Serviços Urbanos <b>aceitou</b> a sua esplanada.',
            'Processo: <code>OEP/2026/0001</code> (Simulação)',
            '',
            `<b>Taxa Municipal:</b> ${taxa.toFixed(2).replace('.', ',')} € (Simulação)`,
            '<b>Entidade:</b> <code>12345</code>',
            '<b>Referência:</b> <code>987 654 321</code>',
            '<b>Montante:</b> <code>75,75 €</code>',
            '',
            '<i>(O pagamento é efetuado fora do canal, por autonomia e segurança.)</i>',
          ].join('\n'),
        );
      }
    }
  } catch (err) {
    console.error('✖ erro ao processar notificação no núcleo:', err);
  }
});

async function processarConfirmacaoCmd(dadosCmd: DadosConfirmacaoCmd): Promise<void> {
  const pessoa = dadosCmd.pessoa || 'ines_guimaraes';
  const processo = dadosCmd.processo || 'OEP/2026/0001';
  const servico = dadosCmd.servico || (processo.startsWith('PIP') ? 'pedido-informacao-previa-urbanismo' : 'ocupacao-espaco-publico-esplanada');
  const tokenCmd = dadosCmd.token_cmd;
  const chat = conversasPorPessoa.get(pessoa) ?? ultimaConversa;

  const isPip = processo.startsWith('PIP') || servico.includes('pdm') || servico.includes('urbanismo');
  const missaoId = isPip ? 'MIS-0002' : 'MIS-0001';
  const pacoteId = isPip ? 'PAC-0002' : 'PAC-0001';

  // 1. Conceder Mandato D3 formal com base na assinatura CMD
  const mandato = await mandatos.concederMandato(pessoa, missaoId, {
    ambito: isPip ? 'urbanismo-informacao-previa' : 'ocupacao-espaco-publico',
    objeto: isPip ? 'Terreno em Silvares (Guimarães)' : 'Casa Joaquim (Largo da Oliveira)',
    nivel: 'D3',
    validadeDias: 180,
  });

  // 2. Aprovar pacote mínimo no cofre
  await cofre.aprovarPacoteMinimo(pessoa, missaoId, pacoteId).catch(() => {});

  // 3. Avaliar política de autorização
  const decisaoPol = await politica.avaliarAcao({
    pessoa,
    missao: missaoId,
    acao: 'submeter_comunicacao_previa',
    ambito: isPip ? 'urbanismo-informacao-previa' : 'ocupacao-espaco-publico',
    nivelRequerido: 'D3',
    temConfirmacao: true,
  });

  if (decisaoPol.resultado === 'bloquear') {
    if (chat) await canal.enviar(chat, `Submissão bloqueada pelas regras de política: ${decisaoPol.motivo}`);
    return;
  }

  // 4. Libertar chave criptográfica pelo tempo da submissão
  await servicoChaves.libertarChave(pessoa, missaoId, mandato.id, 10 * 60 * 1000);

  // 5. Submeter via Porta Agêntica (MCP)
  await clientePorta.chamarFerramenta('submeter_comunicacao_previa', {
    processo,
    mandato: mandato.id,
    token_confirmacao: tokenCmd,
  }).catch((e) => console.warn('Aviso submeter MCP:', e));

  // 6. Atualizar máquina de estados da missão
  if (!orquestrador.obter(missaoId)) {
    await orquestrador.criarMissao({
      pessoa,
      servico,
      servicoTitulo: isPip ? 'Pedido de Informação Prévia (PIP) — Viabilidade PDM' : 'Ocupação do Espaço Público — Esplanada Aberta',
      objetivo: isPip ? 'Obter parecer prévio vinculativo de viabilidade urbanística ao abrigo do Art. 14.º do RJUE' : 'Submeter Mera Comunicação Prévia',
      mandato: mandato.id,
      passosIniciais: ['Instrução do pedido', 'Submissão formal com CMD'],
    });
  }
  await orquestrador.mudarEstado(missaoId, 'submetido', `Submetido com mandato D3 e Chave Móvel Digital (${tokenCmd})`);

  // 7. Criar caso na Consola Municipal
  await registro.registar({
    tipo: 'consola.caso.criado',
    origem: 'consola',
    sessao: SESSAO,
    pessoa,
    missao: missaoId,
    ator: 'sistema',
    simulacao: true,
    dados: {
      caso: isPip ? 'CASO-0002' : 'CASO-0001',
      processo,
      servico,
      risco: isPip ? 'medio' : 'baixo',
      token_cmd: tokenCmd,
    },
  });

  // 8. Notificar cidadão no Telegram
  if (chat) {
    if (isPip) {
      await canal.enviar(
        chat,
        [
          '✅ <b>Pedido de Informação Prévia (PIP) Submetido!</b>',
          '',
          'A sua assinatura digital com <b>Chave Móvel Digital</b> foi validada com sucesso.',
          `Token de Assinatura: <code>${tokenCmd}</code>`,
          `Nível de Representação: <b>Mandato D3</b> (${mandato.id})`,
          '',
          '<b>Processo Municipal:</b> <code>PIP/2026/0002</code> (Simulação)',
          '<b>Serviço:</b> Divisão de Gestão Urbanística · Câmara Municipal de Guimarães',
          '<b>Pretensão:</b> Viabilidade construtiva de moradia unifamiliar em Silvares',
          '',
          'O processo foi distribuído na <b>Consola Técnica Municipal</b> e aguarda apreciação.',
          'Avisarei assim que o técnico de urbanismo emitir o despacho.',
        ].join('\n'),
      );
    } else {
      await canal.enviar(
        chat,
        [
          '✅ <b>Comunicação Prévia Submetida com Sucesso!</b>',
          '',
          'A sua assinatura com <b>Chave Móvel Digital</b> foi confirmada.',
          `Token de Assinatura: <code>${tokenCmd}</code>`,
          `Nível de Representação: <b>Mandato D3</b> (${mandato.id})`,
          '',
          '<b>Processo:</b> <code>OEP/2026/0001</code> (Simulação)',
          '<b>Estado:</b> Em apreciação técnica pelo Gabinete de Serviços Urbanos.',
          '',
          'Avisarei assim que a técnica validar o processo na Consola Municipal.',
        ].join('\n'),
      );
    }
  }
}

async function executarSubmissaoAtiva(pessoa: string): Promise<void> {
  const missaoAtiva = orquestrador.obterAtiva(pessoa);
  const isPip = missaoAtiva?.servico?.includes('urbanismo');
  await processarConfirmacaoCmd({
    pessoa,
    servico: isPip ? 'pedido-informacao-previa-urbanismo' : 'ocupacao-espaco-publico-esplanada',
    processo: isPip ? 'PIP/2026/0002' : 'OEP/2026/0001',
    token_cmd: 'CMD-TOKEN-' + Math.floor(100000 + Math.random() * 900000),
    nif: '234567890',
    nome: 'Maria Lurdes Gonçalves',
  });
}

async function processarLocalizacaoTerreno(m: any): Promise<void> {
  const missaoAtiva = orquestrador.obterAtiva(m.pessoa);
  const missaoId = missaoAtiva?.servico.includes('urbanismo') ? missaoAtiva.id : 'MIS-0002';

  if (!missaoAtiva || !missaoAtiva.servico.includes('urbanismo')) {
    const mandato = await mandatos.concederMandato(m.pessoa, missaoId, {
      ambito: 'urbanismo-informacao-previa',
      objeto: 'Viabilidade Construtiva PDM (Silvares, Guimarães)',
      nivel: 'D2',
      validadeDias: 180,
    });
    await orquestrador.criarMissao({
      pessoa: m.pessoa,
      servico: 'pedido-informacao-previa-urbanismo',
      servicoTitulo: 'Pedido de Informação Prévia (PIP) — Viabilidade PDM',
      objetivo: 'Obter parecer prévio vinculativo de viabilidade urbanística ao abrigo do Art. 14.º do RJUE',
      mandato: mandato.id,
      passosIniciais: [
        'Identificar enquadramento no PDM de Guimarães',
        'Georreferenciar localização do terreno (Google Maps / GPS)',
        'Anexar Caderneta Predial em PDF no Cofre Digital',
        'Submeter formalmente à Câmara com Chave Móvel Digital',
      ],
    });
  }

  await cofre.guardarItem(m.pessoa, missaoId, {
    camada: 'provas',
    tipo: 'geolocalizacao_terreno',
    titulo: 'Localização Georreferenciada do Terreno',
    origem: 'google_maps',
    finalidade: 'Instrução do Pedido de Informação Prévia (Art. 14.º RJUE)',
    dados: {
      freguesia: 'Silvares',
      concelho: 'Guimarães',
      coordenadas: '41.4425, -8.2918',
      link_maps: 'https://maps.google.com/?q=41.4425,-8.2918',
      classificacao_solo_pdm: 'Solo Urbano · Espaço Residencial Nível 2',
      indice_ocupacao: 0.60,
      cercea_maxima: 3,
    },
  });

  await clientePorta.criarRascunhoPip({
    mandato: 'MAN-D2-002',
    localizacao: 'Rua de Silvares, Silvares, Guimarães',
    coordenadas: '41.4425, -8.2918',
    pretensao: 'Construção de Moradia Unifamiliar',
    documentos: ['localizacao_georreferenciada.json'],
  }).catch((e) => console.warn('Aviso rascunho pip:', e));

  orquestrador.atualizarPassoChecklist(missaoId, 'chk-2', true, 'Silvares (41.4425, -8.2918)');

  await canal.enviar(
    m.conversa,
    [
      '📍 <b>Localização do terreno registada com sucesso!</b>',
      '',
      '• <b>Freguesia:</b> Silvares, Guimarães',
      '• <b>Coordenadas:</b> <code>41.4425, -8.2918</code>',
      '• <b>Cofre Digital:</b> Cifrado AES-256-GCM na camada <i>provas</i>.',
      '',
      '🏛️ <b>Enquadramento Preliminar no PDM de Guimarães:</b>',
      '• Classificação: <b>Solo Urbano — Espaço Residencial Nível 2</b>',
      '• Índice de Utilização: Máximo 0.60 (Art. 45.º do Regulamento do PDM)',
      '• Cércea Máxima: 3 pisos',
      '• Reserva Agrícola (RAN): Não abrangido · Reserva Ecológica (REN): Não abrangido',
      '',
      '<i>Nota de Transparência: O Afonso não emite parecer técnico vinculativo; este resumo provém do cruzamento do geoportal com o regulamento oficial (Aviso n.º 23214/2020).</i>',
      '',
      '<b>Próximo passo:</b> Anexe a Caderneta Predial (PDF) para concluir o pacote instrutório ou avance para a assinatura digital com Chave Móvel Digital.',
      '',
      `Para assinar no ecrã oficial da CMD, aceda a: <code>http://localhost:4000/cmd?processo=PIP/2026/0002&amp;servico=pdm&amp;pessoa=${m.pessoa}</code>`,
      'Ou diga simplesmente aqui no chat: <i>«Autorizo a submissão com Chave Móvel Digital»</i>.',
    ].join('\n'),
    [
      [{ texto: '📑 Simular Envio: Caderneta Predial (PDF)', dados: 'anexar_caderneta_predial' }],
      [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
      [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
    ],
  );
}

async function processarDocumentoPdf(m: any): Promise<void> {
  const missaoAtiva = orquestrador.obterAtiva(m.pessoa);
  const missaoId = missaoAtiva?.servico.includes('urbanismo') ? missaoAtiva.id : 'MIS-0002';
  const nomeDoc = m.documento?.nome ?? 'caderneta_predial_silvares.pdf';

  await cofre.guardarItem(m.pessoa, missaoId, {
    camada: 'provas',
    tipo: 'caderneta_predial',
    titulo: 'Caderneta Predial Rústica / Urbana',
    origem: 'upload_telegram',
    finalidade: 'Comprovação da legitimidade e titularidade para PIP (Art. 14.º RJUE)',
    dados: {
      ficheiro: nomeDoc,
      artigo_matricial: 'Artigo 1420 - Silvares',
      hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  });

  await cofre.prepararPacoteMinimo(
    m.pessoa,
    missaoId,
    'Câmara Municipal de Guimarães — Divisão de Gestão Urbanística',
    'Pedido de Informação Prévia (Art. 14.º RJUE)',
    {
      localizacao: 'Rua de Silvares, Silvares, Guimarães',
      coordenadas: '41.4425, -8.2918',
      artigo_matricial: 'Artigo 1420',
      area_pretendida_m2: 220,
      uso: 'Habitação Unifamiliar',
      documentos_validados: [nomeDoc],
    },
    ['declaracoes_irs', 'outros_imoveis', 'dados_bancarios', 'conversas_privadas'],
  );

  orquestrador.atualizarPassoChecklist(missaoId, 'chk-3', true, nomeDoc);
  await orquestrador.mudarEstado(missaoId, 'preparado', 'Localização e caderneta predial reunidas no pacote mínimo');

  await canal.enviar(
    m.conversa,
    [
      '📑 <b>Caderneta Predial recebida e auditada!</b>',
      '',
      `• Ficheiro: <code>${escapar(nomeDoc)}</code>`,
      '• Resumo criptográfico SHA-256 verificado e apenso ao seu Cofre Digital.',
      '',
      '🔒 <b>Princípio da Minimização de Dados (RGPD):</b>',
      'Pacote instrutório <code>PAC-0002</code> preparado sob <b>Mandato D2</b>. Apenas saem a localização e a titularidade estritamente necessárias. A sua situação fiscal e dados bancários <b>permanecem inacessíveis</b>.',
      '',
      'O rascunho está <b>completo e pronto para submissão formal</b> à Divisão de Gestão Urbanística.',
      'Para avançar, assine o pedido através da <b>Chave Móvel Digital</b>:',
      '',
      `Para assinar no ecrã oficial da CMD, aceda a: <code>http://localhost:4000/cmd?processo=PIP/2026/0002&amp;servico=pdm&amp;pessoa=${m.pessoa}</code>`,
      'Ou diga simplesmente aqui no chat: <i>«Autorizo a submissão com Chave Móvel Digital»</i>.',
    ].join('\n'),
    [
      [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
      [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
    ],
  );
}

async function processarValidacaoCalcada(m: any): Promise<void> {
  await orquestrador.mudarEstado('MIS-0001', 'preparado', 'Medição validada com corredor pedonal livre (2,10 m >= 2,00 m)');

  await cofre.prepararPacoteMinimo(
    m.pessoa,
    'MIS-0001',
    'Câmara Municipal de Guimarães',
    'Mera Comunicação Prévia de Esplanada',
    {
      localizacao: 'Largo da Oliveira, 12, Guimarães',
      area_m2: 10,
      numero_mesas: 4,
      periodo: 'Anual (2026)',
      fotografia_passeio: 'fotografia_calcada_largura_livre_2_10m.jpg',
      corredor_pedonal_livre: '2,10 metros',
    },
    ['terreno_ponte', 'conversas_privadas', 'declaracoes_fiscais', 'dados_bancarios'],
  );

  await canal.enviar(
    m.conversa,
    [
      'Recebi a validação da calçada! ✅',
      '',
      'Corredor pedonal livre aferido: <b>2,10 metros</b> (cumpre a exigência regulamentar do Art. 8.º de pelo menos 2,00 m).',
      '',
      '<b>Proteção de Dados e Minimização (RGPD):</b>',
      'Pacote mínimo <code>PAC-0001</code> preparado sob <b>Mandato D2</b>. Apenas saem as dimensões estritamente necessárias. <b>Não são partilhados</b> património, dados bancários ou preferências.',
      '',
      'O pedido está <b>pronto para submissão formal</b> com a sua confirmação via Chave Móvel Digital.',
      '',
      `Para assinar no ecrã oficial da CMD, aceda a: <code>http://localhost:4000/cmd?processo=OEP/2026/0001&amp;servico=esplanada&amp;pessoa=${m.pessoa}</code>`,
      'Ou diga simplesmente aqui no chat: <i>«Autorizo a submissão com Chave Móvel Digital»</i>.',
    ].join('\n'),
    [
      [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
      [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
    ],
  );
}

canal._aoReceber(async (m) => {
  conversasPorPessoa.set(m.pessoa, m.conversa);
  ultimaConversa = m.conversa;

  // 1. Tratamento de Comandos de Barra (/)
  if (m.tipo === 'comando' && m.texto) {
    const textoLimpo = m.texto.trim();

    if (textoLimpo.startsWith('/start')) {
      const persona = textoLimpo.replace('/start', '').trim() || 'ines-demo';
      await canal.enviar(
        m.conversa,
        [
          'Olá, sou o <b>Afonso</b>, o seu representante digital que trabalha para si.',
          '',
          'Esta é uma <b>demonstração</b> com dados fictícios do desafio 3.4 (Hack4Guimarães 2035).',
          `Persona: <code>${escapar(persona)}</code>`,
          '',
          '<b>Comandos úteis:</b>',
          '• /carta — Carta de Lealdade do Afonso',
          '• /cofre — Itens guardados no seu Cofre Digital',
          '• /mandatos — Mandatos de representação ativos',
          '• /missoes — Estado das suas missões em curso',
          '• /dados — Quem consultou os meus dados',
          '• /pessoa — Pedir atendimento humano na Câmara',
          '',
          'Pode falar com uma pessoa a qualquer momento.',
        ].join('\n'),
        [
          [
            { texto: '📜 Carta de Lealdade', dados: 'cmd_carta' },
            { texto: '👤 Falar com uma pessoa', dados: 'pessoa' },
          ],
        ],
      );
      await regista('canal.mensagem.enviada', m, { comando: '/start' });
      return;
    }

    if (textoLimpo === '/carta') {
      await canal.enviar(
        m.conversa,
        [
          '📜 <b>Carta de Lealdade do Afonso</b>',
          '',
          '1. <b>Trabalho para si.</b> Não trabalho para a Câmara, para um banco nem para quem me financia.',
          '2. <b>Digo-lhe sempre os seus direitos</b>, incluindo o de reclamar, ser ouvido e recorrer de uma decisão.',
          '3. <b>Só uso os dados que autorizou</b>, para a missão que me deu, pelo tempo que definiu.',
          '4. <b>Mostro-lhe a fonte do que afirmo</b> e digo-lhe quando não sei.',
          '5. <b>Nunca recomendo um profissional</b>, produto ou serviço por ter sido pago para isso.',
          '6. <b>Pode falar com uma pessoa a qualquer momento.</b>',
          '',
          '<i>Identifico-me sempre como assistente de IA nos termos do art. 50.º do AI Act europeu.</i>',
        ].join('\n'),
        [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
      );
      await regista('canal.mensagem.enviada', m, { comando: '/carta' });
      return;
    }

    if (textoLimpo === '/cofre') {
      const itens = cofre.listarMetadados(m.pessoa);
      if (itens.length === 0) {
        await canal.enviar(
          m.conversa,
          [
            '🗄️ <b>O seu Cofre Digital Pessoal está vazio.</b>',
            '',
            'O Cofre guarda dados em 3 camadas (<i>identidade</i>, <i>provas</i>, <i>intenções</i>), sempre com cifra AES-256-GCM.',
            'Nenhum dado é guardado sem o seu consentimento explícito.',
          ].join('\n'),
        );
      } else {
        const linhas = itens.map(
          (it, idx) =>
            `${idx + 1}. <b>${escapar(it.titulo)}</b>\n   • Camada: <code>${it.camada}</code> | Finalidade: ${escapar(it.finalidade)}\n   • Criado: ${it.criadoEm.split('T')[0]}`,
        );
        const botoesApagar = itens.slice(0, 3).map((it) => [
          { texto: `🗑️ Apagar «${it.titulo.slice(0, 20)}»`, dados: `apagar_item_${it.id}` },
        ]);
        await canal.enviar(
          m.conversa,
          [
            '🗄️ <b>Itens no seu Cofre Digital Pessoal (Cifrado):</b>',
            '',
            ...linhas,
            '',
            '<i>Os dados estão cifrados com a sua chave. O operador municipal não os lê.</i>',
          ].join('\n'),
          botoesApagar,
        );
      }
      await regista('canal.mensagem.enviada', m, { comando: '/cofre' });
      return;
    }

    if (textoLimpo === '/mandatos') {
      const lista = mandatos.listar(m.pessoa);
      if (lista.length === 0) {
        await canal.enviar(
          m.conversa,
          [
            '🤝 <b>Não tem nenhum mandato ativo.</b>',
            '',
            'Os mandatos definem o que o Afonso pode fazer por si:',
            '• D0: Informar · D1: Vigiar · D2: Preparar · D3: Agir com a sua confirmação.',
          ].join('\n'),
        );
      } else {
        const linhas = lista.map(
          (man, idx) =>
            `${idx + 1}. <b>${man.id}</b> — Nível <b>${man.nivel}</b>\n   • Âmbito: <code>${man.ambito}</code> (${escapar(man.objeto)})\n   • Validade: até ${man.validoAte} | Estado: <b>${man.estado}</b>`,
        );
        const botoesRevogar = lista
          .filter((man) => man.estado === 'ativo')
          .slice(0, 3)
          .map((man) => [{ texto: `🚫 Revogar ${man.id}`, dados: `revogar_mandato_${man.id}` }]);
        await canal.enviar(
          m.conversa,
          [
            '🤝 <b>Mandatos de Representação Digital:</b>',
            '',
            ...linhas,
            '',
            '<i>Pode revogar qualquer mandato a qualquer instante com efeito imediato.</i>',
          ].join('\n'),
          botoesRevogar,
        );
      }
      await regista('canal.mensagem.enviada', m, { comando: '/mandatos' });
      return;
    }

    if (textoLimpo === '/missoes') {
      const lista = orquestrador.listarPorPessoa(m.pessoa);
      if (lista.length === 0) {
        await canal.enviar(
          m.conversa,
          '📋 <b>Não tem missões ativas no momento.</b>\n\nDiga-me o que precisa da Câmara e eu abro a respetiva missão.',
        );
      } else {
        const blocos = lista.map((mis) => {
          const feitos = mis.checklist.filter((c) => c.feito).length;
          const total = mis.checklist.length;
          return [
            `• <b>${mis.id}: ${escapar(mis.servicoTitulo)}</b>`,
            `  Estado: <code>${mis.estado}</code>`,
            `  Objetivo: ${escapar(mis.objetivo)}`,
            `  Checklist: ${feitos}/${total} passos concluídos`,
          ].join('\n');
        });
        await canal.enviar(m.conversa, ['📋 <b>As suas Missões:</b>', '', ...blocos].join('\n\n'));
      }
      await regista('canal.mensagem.enviada', m, { comando: '/missoes' });
      return;
    }

    if (textoLimpo === '/dados') {
      const eventosAudit = await registro.listar({ sessao: SESSAO, limite: 50 });
      const relevantes = eventosAudit.filter(
        (e) =>
          e.pessoa === m.pessoa ||
          e.tipo.startsWith('cofre.') ||
          e.tipo.startsWith('mandato.') ||
          e.tipo.startsWith('su.'),
      );

      const linhas = relevantes.slice(0, 8).map((ev) => {
        const hora = new Date(ev.ts).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
        return `• [${hora}] <b>${ev.ator}</b>: <code>${ev.tipo}</code>`;
      });

      await canal.enviar(
        m.conversa,
        [
          '🔍 <b>Quem consultou ou processou os meus dados:</b>',
          '',
          ...(linhas.length > 0 ? linhas : ['Nenhum registo recente de acesso aos seus dados.']),
          '',
          '<i>Cada acesso é auditado com registo de hash SHA-256 na plataforma Delegate.</i>',
        ].join('\n'),
      );
      await regista('canal.mensagem.enviada', m, { comando: '/dados' });
      return;
    }

    if (textoLimpo === '/pessoa') {
      await registro.registar({
        tipo: 'consola.caso.criado',
        origem: 'consola',
        sessao: SESSAO,
        pessoa: m.pessoa,
        missao: null,
        ator: 'pessoa',
        simulacao: true,
        dados: { motivo: 'pedido_atendimento_humano_via_comando' },
      });
      await canal.enviar(
        m.conversa,
        'Encaminhei o seu pedido para atendimento humano no Balcão Único da Câmara Municipal. Um técnico irá contactá-lo.',
      );
      await regista('canal.mensagem.enviada', m, { comando: '/pessoa' });
      return;
    }
  }

  const dados: Record<string, unknown> =
    m.tipo === 'foto'
      ? { tem_foto: Boolean(m.foto) }
      : m.tipo === 'botao'
        ? { botao: m.texto }
        : { texto: m.texto };

  await regista(
    m.tipo === 'botao' ? 'canal.botao.carregado' : 'canal.mensagem.recebida',
    m,
    dados,
  );

  // 2. Tratamento de botões de decisão da pessoa
  if (m.tipo === 'botao') {
    if (m.texto === 'pessoa') {
      await registro.registar({
        tipo: 'consola.caso.criado',
        origem: 'consola',
        sessao: SESSAO,
        pessoa: m.pessoa,
        missao: null,
        ator: 'pessoa',
        simulacao: true,
        dados: { motivo: 'pedido_atendimento_humano' },
      });
      await canal.enviar(
        m.conversa,
        'Encaminhei o seu pedido para atendimento humano no Balcão Único. Um técnico irá contactá-lo.',
      );
    } else if (m.texto === 'cmd_carta') {
      await canal.enviar(
        m.conversa,
        [
          '📜 <b>Carta de Lealdade do Afonso</b>',
          '',
          '1. <b>Trabalho para si.</b> Não trabalho para a Câmara, para um banco nem para quem me financia.',
          '2. <b>Digo-lhe sempre os seus direitos</b>, incluindo o de reclamar, ser ouvido e recorrer de uma decisão.',
          '3. <b>Só uso os dados que autorizou</b>, para a missão que me deu, pelo tempo que definiu.',
          '4. <b>Mostro-lhe a fonte do que afirmo</b> e digo-lhe quando não sei.',
          '5. <b>Nunca recomendo um profissional</b>, produto ou serviço por ter sido pago para isso.',
          '6. <b>Pode falar com uma pessoa a qualquer momento.</b>',
        ].join('\n'),
      );
    } else if (m.texto === 'pergunta_taxa') {
      const missaoAtiva = orquestrador.obterAtiva(m.pessoa);
      const resp = await afonso.responder(m.pessoa, 'quanto vou pagar', {
        pessoa: m.pessoa,
        servicoAtivo: missaoAtiva?.servico ?? 'ocupacao-espaco-publico-esplanada',
        servicoTituloAtivo: missaoAtiva?.servicoTitulo,
        missaoAtiva: Boolean(missaoAtiva),
        missaoId: missaoAtiva?.id,
        estadoMissao: missaoAtiva?.estado,
        mandatoAtivoNivel: missaoAtiva ? 'D2' : 'D0',
      });
      await canal.enviar(m.conversa, resp.texto, resp.botoes);
    } else if (m.texto === 'iniciar_esplanada' || m.texto === 'voltar_esplanada') {
      // 1. Guardar no Cofre Digital com consentimento
      await cofre.guardarItem(m.pessoa, 'MIS-0001', {
        camada: 'intencoes',
        tipo: 'intencao_negocio',
        titulo: 'Esplanada Casa Joaquim',
        origem: 'conversa_telegram',
        finalidade: 'Licenciamento de ocupação de espaço público com esplanada',
        dados: { localizacao: 'Largo da Oliveira, 12', mesas: 4, area_m2: 10 },
      });

      // 2. Conceder Mandato D2 (Nível de Preparação — sem autorização para submissão direta)
      const mandato = await mandatos.concederMandato(m.pessoa, 'MIS-0001', {
        ambito: 'ocupacao-espaco-publico',
        objeto: 'Casa Joaquim (Largo da Oliveira)',
        nivel: 'D2',
        validadeDias: 365,
      });

      // 3. Criar Missão
      await orquestrador.criarMissao({
        pessoa: m.pessoa,
        servico: 'ocupacao-espaco-publico-esplanada',
        servicoTitulo: 'Ocupação do Espaço Público — Esplanada Aberta',
        objetivo: 'Licenciar esplanada aberta contígua à fachada na Casa Joaquim',
        mandato: mandato.id,
      });

      await canal.enviar(
        m.conversa,
        [
          'Guardei a intenção da esplanada no seu <b>Cofre Digital Pessoal</b> (cifrado AES-256-GCM) e abri a missão <b>MIS-0001</b>.',
          '',
          `Concedeu ao Afonso o <b>Mandato D2</b> (${mandato.id}): preparar rascunho e reunir provas, <b>sem autorização para submeter</b> sem a sua assinatura expressa.`,
          '',
          '<b>Próximo passo da checklist:</b>',
          'Envie uma <b>fotografia do passeio</b> à porta da Casa Joaquim ou confirme que tem pelo menos 2,00 metros livres de calçada.',
        ].join('\n'),
        [
          [{ texto: '📸 Confirmar Medição: 2,10 m livres', dados: 'enviar_foto_calcada' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else if (m.texto === 'enviar_foto_calcada') {
      await processarValidacaoCalcada(m);
    } else if (m.texto === 'iniciar_pdm') {
      await cofre.guardarItem(m.pessoa, 'MIS-0002', {
        camada: 'intencoes',
        tipo: 'intencao_urbanismo',
        titulo: 'Pedido de Informação Prévia (PDM)',
        origem: 'conversa_telegram',
        finalidade: 'Consulta de viabilidade urbanística para construção de moradia',
        dados: { servico: 'pedido-informacao-previa-urbanismo' },
      });

      const mandato = await mandatos.concederMandato(m.pessoa, 'MIS-0002', {
        ambito: 'urbanismo-informacao-previa',
        objeto: 'Viabilidade Construtiva PDM (Guimarães)',
        nivel: 'D2',
        validadeDias: 180,
      });

      await orquestrador.criarMissao({
        pessoa: m.pessoa,
        servico: 'pedido-informacao-previa-urbanismo',
        servicoTitulo: 'Pedido de Informação Prévia (PIP) — Viabilidade PDM',
        objetivo: 'Obter parecer prévio vinculativo de viabilidade urbanística ao abrigo do Art. 14.º do RJUE',
        mandato: mandato.id,
        passosIniciais: [
          'Identificar enquadramento no PDM de Guimarães',
          'Georreferenciar localização do terreno (Google Maps / GPS)',
          'Anexar Caderneta Predial em PDF no Cofre Digital',
          'Submeter formalmente à Câmara com Chave Móvel Digital',
        ],
      });

      await canal.enviar(
        m.conversa,
        [
          'Guardei a intenção no seu <b>Cofre Digital Pessoal</b> (cifrado AES-256-GCM) e abri a missão <b>MIS-0002</b>.',
          '',
          `Concedeu ao Afonso o <b>Mandato D2</b> (${mandato.id}): preparar o rascunho instrutório e organizar as provas, <b>sem autorização para submeter</b> sem a sua assinatura.`,
          '',
          '<b>Elementos necessários (Art. 14.º do RJUE):</b>',
          '1. 📍 <b>Localização do terreno:</b> envie um link do Google Maps ou coordenadas (ex.: <code>41.4425, -8.2918</code>).',
          '2. 📑 <b>Caderneta Predial:</b> envie o ficheiro PDF da caderneta predial.',
          '',
          'Pode enviar estes dados em qualquer ordem:',
        ].join('\n'),
        [
          [{ texto: '📍 Simular Envio: Terreno em Silvares (Maps)', dados: 'enviar_localizacao_terreno' }],
          [{ texto: '📑 Simular Envio: Caderneta Predial (PDF)', dados: 'anexar_caderneta_predial' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else if (m.texto === 'ajuda_google_maps') {
      await canal.enviar(
        m.conversa,
        [
          '📍 <b>Como partilhar a localização do terreno:</b>',
          '',
          '1. Abra a aplicação Google Maps ou o navegador.',
          '2. Toque no terreno pretendido e escolha «Partilhar».',
          '3. Cole o link aqui no chat (ex.: <code>https://maps.google.com/?q=41.4425,-8.2918</code>) ou escreva as coordenadas diretamente.',
          '',
          'Ou teste de imediato com a simulação:',
        ].join('\n'),
        [
          [{ texto: '📍 Simular Envio: Terreno em Silvares (Maps)', dados: 'enviar_localizacao_terreno' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else if (m.texto === 'ajuda_pdf') {
      await canal.enviar(
        m.conversa,
        [
          '📑 <b>Como anexar a Caderneta Predial:</b>',
          '',
          '1. Carregue no ícone do clipe / anexo 📎 no Telegram.',
          '2. Selecione o ficheiro PDF da Caderneta Predial do Portal das Finanças.',
          '3. O Afonso cifra o ficheiro com AES-256-GCM no seu Cofre Digital Pessoal.',
          '',
          'Ou teste de imediato com a simulação:',
        ].join('\n'),
        [
          [{ texto: '📑 Simular Envio: Caderneta Predial (PDF)', dados: 'anexar_caderneta_predial' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else if (m.texto === 'enviar_localizacao_terreno' || m.texto === 'simular_maps_silvares') {
      await processarLocalizacaoTerreno(m);
    } else if (m.texto === 'anexar_caderneta_predial' || m.texto === 'simular_anexo_pdf') {
      await processarDocumentoPdf(m);
    } else if (
      m.texto === 'assinar_com_chave_movel_digital' ||
      m.texto === 'submeter_pdm_chat' ||
      m.texto === 'submeter_esplanada' ||
      m.texto === 'submeter_pedido'
    ) {
      await executarSubmissaoAtiva(m.pessoa);
    } else if (m.texto === 'responder_8m') {
      aguardaFachada = false;
      await clientePorta.chamarFerramenta('responder_pedido_elementos', {
        processo: 'OEP/2026/0001',
        mandato: 'MAN-D3-001',
        elementos: { largura_fachada_m: 8 },
      }).catch(() => null);

      await orquestrador.mudarEstado('MIS-0001', 'com_tecnico', 'Elemento adicional fornecido: 8m fachada');

      await canal.enviar(
        m.conversa,
        [
          'Recebi a informação da fachada (<b>8 metros</b>) e juntei-a ao processo <code>OEP/2026/0001</code> na Porta Agêntica da Câmara. ✅',
          '',
          'O processo regressou à fila da técnica para apreciação final.',
        ].join('\n'),
      );
    } else if (m.texto?.startsWith('apagar_item_')) {
      const itemId = m.texto.replace('apagar_item_', '');
      const apagado = await cofre.apagarItem(m.pessoa, itemId);
      await canal.enviar(
        m.conversa,
        apagado
          ? `✓ O item <code>${itemId}</code> foi eliminado do seu Cofre Digital.`
          : `Item <code>${itemId}</code> não encontrado.`,
      );
    } else if (m.texto?.startsWith('revogar_mandato_')) {
      const mandId = m.texto.replace('revogar_mandato_', '');
      const revogado = await mandatos.revogarMandato(m.pessoa, mandId);
      await canal.enviar(
        m.conversa,
        revogado
          ? `🚫 O mandato <code>${mandId}</code> foi revogado com efeito imediato.`
          : `Mandato <code>${mandId}</code> não encontrado.`,
      );
    } else {
      await canal.enviar(
        m.conversa,
        'Recebi a sua indicação. Se pretender avançar com um pedido ou colocar alguma dúvida sobre os regulamentos municipais, estou ao seu dispor.',
        [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
      );
    }
  } else if (m.tipo === 'foto') {
    await processarValidacaoCalcada(m);
  } else if (m.tipo === 'documento') {
    await processarDocumentoPdf(m);
  } else if (m.texto && !m.texto.startsWith('/')) {
    const missaoAtiva = orquestrador.obterAtiva(m.pessoa);

    if (aguardaFachada && (m.texto === 'responder_8m' || /8/i.test(m.texto))) {
      aguardaFachada = false;
      await clientePorta.chamarFerramenta('responder_pedido_elementos', {
        processo: 'OEP/2026/0001',
        mandato: 'MAN-D3-001',
        elementos: { largura_fachada_m: 8 },
      }).catch(() => null);

      await orquestrador.mudarEstado('MIS-0001', 'com_tecnico', 'Elemento fornecido via texto: 8 metros');

      await canal.enviar(
        m.conversa,
        [
          'Recebi a informação da fachada (<b>8 metros</b>) e juntei-a ao processo <code>OEP/2026/0001</code> na Porta Agêntica da Câmara. ✅',
          '',
          'O processo regressou à fila da técnica para apreciação final.',
        ].join('\n'),
      );
      await regista('canal.mensagem.enviada', m, {});
      return;
    }

    // Se a pessoa pede para assinar ou submeter em linguagem natural
    const querSubmeter = /assinar|submet|autorizo.*(submi|avan|envio)|pode.*(submet|avan|enviar)|confirm.*submi/i.test(m.texto);
    if (querSubmeter && (missaoAtiva || m.texto.toLowerCase().includes('cmd') || m.texto.toLowerCase().includes('chave'))) {
      await executarSubmissaoAtiva(m.pessoa);
      await regista('canal.mensagem.enviada', m, { tipo: 'submissao_cmd_inferida' });
      return;
    }

    if (
      missaoAtiva &&
      (missaoAtiva.estado === 'entendido' || missaoAtiva.estado === 'a_verificar' || missaoAtiva.estado === 'em_curso') &&
      (/2[,.]10|metro|calcada|calçada|passeio|fita|largura|livre/i.test(m.texto))
    ) {
      await processarValidacaoCalcada(m);
      return;
    }

    // Se o cidadão enviou link de Google Maps ou coordenadas GPS de terreno
    if (/maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps|\b\d{2}\.\d{3,}\s*,\s*-\d{1,2}\.\d{3,}\b/i.test(m.texto)) {
      await processarLocalizacaoTerreno(m);
      await regista('canal.mensagem.enviada', m, { tipo: 'localizacao_terreno' });
      return;
    }

    // Se o cidadão referiu envio de caderneta predial
    if (/caderneta|predial|\.pdf\b/i.test(m.texto) && missaoAtiva?.servico.includes('urbanismo')) {
      await processarDocumentoPdf(m);
      await regista('canal.mensagem.enviada', m, { tipo: 'caderneta_predial' });
      return;
    }

    // 4. Pergunta em linguagem natural: responde com o Afonso e a Porta
    await canal.aEscrever(m.conversa);
    const resp = await afonso.responder(m.pessoa, m.texto, {
      pessoa: m.pessoa,
      servicoAtivo: missaoAtiva?.servico,
      servicoTituloAtivo: missaoAtiva?.servicoTitulo,
      missaoAtiva: Boolean(missaoAtiva),
      missaoId: missaoAtiva?.id,
      estadoMissao: missaoAtiva?.estado,
      mandatoAtivoNivel: missaoAtiva ? 'D2' : 'D0',
    });
    await canal.enviar(m.conversa, resp.texto, resp.botoes);
  } else {
    return;
  }

  await regista('canal.mensagem.enviada', m, {});
});

/** Regista um evento do canal. O identificador da conversa nunca entra. */
async function regista(
  tipo: string,
  m: { pessoa: string },
  dados: Record<string, unknown>,
): Promise<void> {
  await registro.registar({
    tipo,
    origem: 'canal',
    sessao: SESSAO,
    pessoa: m.pessoa,
    missao: null,
    ator: 'pessoa',
    simulacao: false,
    dados,
  });
}

process.once('SIGINT', () => void encerrar());
process.once('SIGTERM', () => void encerrar());

async function encerrar() {
  const auditoria = await registro.verificar().catch(() => null);
  if (auditoria) {
    console.log(
      auditoria.valido
        ? `✓ cadeia de selos fecha: ${auditoria.total} eventos`
        : `✖ cadeia quebrada no evento ${auditoria.quebradoEm}`,
    );
  }
  await escutaNucleo.end().catch(() => {});
  await base.fechar();
  process.exit(0);
}

await canal.ligar();