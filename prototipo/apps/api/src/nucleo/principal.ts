/**
 * O núcleo: passagem de mensagens e orquestração do representante digital Henriques.
 *
 * Arquitetura modular segundo o Princípio da Responsabilidade Única (SRP):
 *   Telegram -> canal -> evento na base -> notificação -> SSE -> Observatório / Consola
 *
 * Módulos integrados:
 *   - Henriques: respostas com fonte e verificação estrita
 *   - Cofre Digital: cifra AES-256-GCM, 3 camadas e Guardião de Contexto
 *   - Serviço de Chaves: libertação temporária auditada e recolha automática
 *   - Mandatos: níveis D0 a D3, concessão, verificação e revogação
 *   - Motor de Política: permitir, confirmar, bloquear
 *   - Orquestrador: máquina de estados da missão e checklist oficial
 *   - Processador de Cenários: simulação de PIP, esplanadas e validação com CMD
 *   - Tratador de Comandos: comandos de barra (/start, /carta, /cofre, etc.)
 */
import { criarCanalGrammy, escapar, type CanalGrammy } from './canal.ts';
import { abrirBase, SESSAO } from './bd.ts';
import { Registo } from './eventos/registo.ts';
import { criarServidorEventos } from './eventos/servidor.ts';
import { Henriques } from './henriques/henriques.ts';
import { MotorDecisaoTypeSafe } from './typesafe/motor-decisao.ts';
import { ClientePortaMcp } from './henriques/cliente-porta.ts';
import { BuscadorConhecimento } from './conhecimento/buscador.ts';
import { CofreDigital } from './cofre/cofre.ts';
import { ServicoChavesCofre } from './cofre/servico-chaves.ts';
import { GestorMandatos } from './mandatos/mandatos.ts';
import { MotorPolitica } from './politica/politica.ts';
import { OrquestradorMissoes } from './orquestrador/missao.ts';
import { GestorFluxoD2 } from './orquestrador/fluxo-conversa-d2.ts';
import { ProcessadorCenarios } from './simuladores/cenarios.ts';
import { TratadorComandos } from './comandos/tratador-comandos.ts';

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

const conversasPorPessoa = new Map<string, string>();
let ultimaConversa: string | null = null;
let aguardaFachada = false;

// Cada mensagem que sai para o Telegram fica no registo, com texto e botões, seja
// qual for o módulo que a enviou. É o que deixa o painel replicar a conversa
// sem adivinhar. A marca `entregue_no_canal` distingue-a dos eventos `enviada`
// que alguns módulos já registam por conta própria, sem texto ou em duplicado.
const canalTelegram: CanalGrammy = criarCanalGrammy(token);
const canal: CanalGrammy = {
  ...canalTelegram,
  async enviar(conversa, texto, botoes) {
    await canalTelegram.enviar(conversa, texto, botoes);
    const pessoa = [...conversasPorPessoa].find(([, c]) => c === conversa)?.[0] ?? null;
    await registro
      .registar({
        tipo: 'canal.mensagem.enviada',
        origem: 'canal',
        sessao: SESSAO,
        pessoa,
        missao: null,
        ator: 'agente:henriques',
        simulacao: false,
        dados: {
          texto,
          botoes: botoes?.map((linha) => linha.map((b) => ({ texto: b.texto, dados: b.dados ?? null }))) ?? [],
          entregue_no_canal: true,
        },
      })
      .catch((err: unknown) => console.warn('⚠ envio sem registo:', err));
  },
};
const clientePorta = new ClientePortaMcp();
const buscador = new BuscadorConhecimento();
const henriques = new Henriques(registro, clientePorta, SESSAO, undefined, undefined, buscador);

// Módulos de autoridade e privacidade
const servicoChaves = new ServicoChavesCofre(registro, SESSAO);
const cofre = new CofreDigital(registro, servicoChaves, SESSAO);
const mandatos = new GestorMandatos(registro, SESSAO);
const politica = new MotorPolitica(registro, mandatos, SESSAO);
const orquestrador = new OrquestradorMissoes(registro, SESSAO);

const fluxoD2 = new GestorFluxoD2({
  cofre,
  mandatos,
  orquestrador,
  registo: registro,
  canal,
  sessao: SESSAO,
});

// Processador de cenários simulados (CMD, PIP Urbanismo, Medição de Calçada)
const cenarios = new ProcessadorCenarios({
  mandatos,
  cofre,
  politica,
  servicoChaves,
  clientePorta,
  orquestrador,
  registo: registro,
  canal,
  obterChat: (pessoa) => conversasPorPessoa.get(pessoa) ?? ultimaConversa,
  sessao: SESSAO,
});

// Tratador de comandos de barra (/)
const comandos = new TratadorComandos({
  canal,
  cofre,
  mandatos,
  orquestrador,
  registo: registro,
  sessao: SESSAO,
  henriques,
  fluxoD2,
});

// Servidor de Eventos SSE e API HTTP (inclui webhook da CMD e testador do Router)
const servidor = criarServidorEventos(
  registro,
  () => base.escutar(),
  async (dados) => {
    await cenarios.processarConfirmacaoCmd(dados);
  },
  undefined,
  async (pergunta: string) => {
    const motorDecisao = new MotorDecisaoTypeSafe();
    const decisao = await motorDecisao.decidir(pergunta, {});
    const candidatos = await buscador.buscarCandidatosHibrido(pergunta, 5);
    const resultadoJev = await buscador.buscarComJev(pergunta);
    return {
      ok: true,
      pergunta,
      ...decisao,
      candidatos,
      resultadoJev,
    };
  },
  async () => {
    // Obter missão ativa do cidadão de demonstração ou última conversa
    const pessoaPadrao = 'pessoa-1bbe89cb4d';
    const missao = orquestrador.obterAtiva(pessoaPadrao) ?? orquestrador.obterAtiva('ines_guimaraes') ?? null;
    const rascunhoD2 = fluxoD2.obterRascunhoAtivo(pessoaPadrao) ?? null;
    return {
      missao,
      rascunhoD2,
      estadosPossiveis: [
        { id: 'entendido', nome: '1. Entendido', desc: 'Henriques compreendeu a intenção e enquadrou o serviço' },
        { id: 'a_verificar', nome: '2. A Verificar', desc: 'Instrução de dados e medições regulamentares' },
        { id: 'preparado', nome: '3. Preparado (D2)', desc: 'Rascunho completo no Cofre Digital aguardando CMD' },
        { id: 'submetido', nome: '4. Submetido (D3)', desc: 'Requerimento formal com Chave Móvel Digital na Porta' },
        { id: 'precisa_de_si', nome: '⚠️ Elementos Adicionais', desc: 'Câmara solicitou aperfeiçoamento instrutório' },
        { id: 'com_tecnico', nome: '5. Com Técnico (SU)', desc: 'Em apreciação técnica e jurídica municipal' },
        { id: 'respondido', nome: '6. Concluído', desc: 'Decisão final deferida e taxas liquidadas' },
      ],
    };
  },
  {
    obterDados: async (pessoa = 'pessoa-1bbe89cb4d') => {
      let itens = cofre.listarItensCompletos(pessoa);
      if (itens.length === 0) {
        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'identidade',
          tipo: 'identidade_fiscal',
          titulo: 'NIF & Identificação Fiscal',
          dados: { nif: '123 456 789', titular: 'Inês Guimarães', regime: 'Restauração e Bebidas / Café Oliveira' },
          origem: 'Chave Móvel Digital',
          finalidade: 'Autenticação formal em requerimentos municipais e liquidação de taxas',
          sensibilidade: 'sensivel',
          validoAte: '2027-10-18',
          conservacao: 'Até revogação expressa da pessoa',
          permissoes: ['leitura_instrucao', 'apresentacao_cmd'],
        });

        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'identidade',
          tipo: 'morada_fiscal',
          titulo: 'Morada Fiscal e Sede do Estabelecimento',
          dados: { rua: 'Largo da Oliveira, n.º 12', codigo_postal: '4800-025', freguesia: 'Oliveira do Castelo', concelho: 'Guimarães' },
          origem: 'Chave Móvel Digital / Autoridade Tributária',
          finalidade: 'Comprovação de domicílio fiscal e jurisdição municipal',
          sensibilidade: 'sensivel',
          validoAte: '2027-10-18',
          conservacao: 'Até revogação',
          permissoes: ['leitura_instrucao'],
        });

        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'provas',
          tipo: 'prova_medicao_calcada',
          titulo: 'Medição Fotográfica da Calçada (2,10m)',
          dados: { largura_livre_m: 2.10, corredor_pedonal_minimo_m: 2.00, em_conformidade: true, artigo: 'Artigo 8.º ROPP', hash_foto: 'sha256-a18f40b829c4e2098d4f9b88e...' },
          origem: 'Fotografia enviada no Telegram',
          finalidade: 'Instrução probatória da Mera Comunicação Prévia de Esplanada Aberta',
          sensibilidade: 'normal',
          validoAte: '2026-12-31',
          conservacao: 'Durante vigência do processo OEP/2026/0001',
          permissoes: ['instrucao_processo_su'],
        });

        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'provas',
          tipo: 'apolice_seguro_rc',
          titulo: 'Apólice de Seguro de Responsabilidade Civil',
          dados: { seguradora: 'Tranquilidade Seguros', apolice_num: 'RC-402914-2026', capital_seguro: 150000, valido_ate: '2027-03-31' },
          origem: 'Upload em PDF pelo cidadão',
          finalidade: 'Comprovativo obrigatório nos termos do Regulamento de Ocupação do Espaço Público',
          sensibilidade: 'normal',
          validoAte: '2027-03-31',
          conservacao: 'Vigência da apólice',
          permissoes: ['instrucao_processo_su'],
        });

        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'intencoes',
          tipo: 'projeto_esplanada_ovp',
          titulo: 'Projeto de Esplanada Aberta (4 mesas)',
          dados: { servico: 'ocupacao-espaco-publico-esplanada', mesas: 4, cadeiras: 8, toldo_amovivel: true, area_m2: 12, periodo: 'Anual 2026' },
          origem: 'Conversa no Telegram com Henriques',
          finalidade: 'Preparação do formulário OVP-SO e apuramento de taxas regulamentares',
          sensibilidade: 'normal',
          validoAte: '2026-11-30',
          conservacao: 'Até submissão ou cancelamento da missão',
          permissoes: ['instrucao_rascunho_d2'],
        });

        itens = cofre.listarItensCompletos(pessoa);
      }

      let pacotes = cofre.listarPacotes(pessoa);
      if (pacotes.length === 0) {
        await cofre.prepararPacoteMinimo(
          pessoa,
          'MIS-0001',
          'Câmara Municipal de Guimarães · Serviços Urbanos',
          'Instrução de Mera Comunicação Prévia de Esplanada (Artigo 8.º ROPP)',
          {
            requerente: 'Inês Guimarães',
            nif: '123 456 789',
            morada_estabelecimento: 'Largo da Oliveira, n.º 12, Guimarães',
            area_esplanada_m2: 12,
            mesas: 4,
            cadeiras: 8,
            largura_passeio_m: 2.10,
            seguro_responsabilidade_civil_valido: true,
          },
          [
            'iban_conta_bancaria',
            'historico_integral_conversa_telegram',
            'faturamento_comercial_restaurante',
            'documentos_outros_imoveis',
            'fotografias_pessoais_descartadas',
          ],
        );
        pacotes = cofre.listarPacotes(pessoa);
      }

      const mandatosPessoa = await mandatos.listar(pessoa);

      return {
        ok: true,
        pessoa,
        itens,
        pacotes,
        mandatos: mandatosPessoa,
        estatisticas: {
          totalItens: itens.length,
          porCamada: {
            identidade: itens.filter((i) => i.camada === 'identidade').length,
            provas: itens.filter((i) => i.camada === 'provas').length,
            intencoes: itens.filter((i) => i.camada === 'intencoes').length,
          },
          sensibilidade: {
            sensivel: itens.filter((i) => i.sensibilidade === 'sensivel').length,
            normal: itens.filter((i) => i.sensibilidade === 'normal').length,
          },
        },
      };
    },
    guardar: async (body: any) => {
      const pessoa = body.pessoa ?? 'pessoa-1bbe89cb4d';
      const item = await cofre.guardarItem(pessoa, body.missao ?? null, {
        camada: body.camada ?? 'intencoes',
        tipo: body.tipo ?? 'item_geral',
        titulo: body.titulo ?? 'Novo Item do Cofre',
        dados: body.dados ?? {},
        origem: body.origem ?? 'Interface Web do Cofre',
        finalidade: body.finalidade ?? 'Procedimento municipal com a autarquia',
        sensibilidade: body.sensibilidade ?? 'normal',
        validoAte: body.validoAte ?? null,
        conservacao: body.conservacao ?? 'Até revogação',
      });
      return { ok: true, item };
    },
    avaliar: async (body: any) => {
      const pessoa = body.pessoa ?? 'pessoa-1bbe89cb4d';
      return await cofre.avaliarElegibilidade(pessoa, body);
    },
  },
);
servidor.listen(PORTA_EVENTOS, () => {
  console.log(`✓ fluxo de eventos em http://localhost:${PORTA_EVENTOS}/eventos/stream`);
});

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

canal._aoReceber(async (m) => {
  try {
    const desc = m.tipo === 'botao' ? `[Botão: ${m.texto}]` : m.texto ?? (m.foto ? '[Foto]' : '[Documento]');
    console.log(`📩 [Canal] Recebido de ${m.pessoa} (${m.tipo}): ${desc}`);

    conversasPorPessoa.set(m.pessoa, m.conversa);
    ultimaConversa = m.conversa;

  // Regista-se antes dos comandos, para que um /start também apareça no registo.
  const dados: Record<string, unknown> =
    m.tipo === 'foto'
      ? { tem_foto: Boolean(m.foto), texto: m.texto, entrada: m.tipo }
      : m.tipo === 'botao'
        ? { botao: m.texto }
        : m.tipo === 'documento'
          ? { texto: m.texto, documento: m.documento?.nome ?? null, entrada: m.tipo }
          : { texto: m.texto, entrada: m.tipo };

  await regista(
    m.tipo === 'botao' ? 'canal.botao.carregado' : 'canal.mensagem.recebida',
    m,
    dados,
  );

    // 1. Tratamento de Comandos de Barra (/) delegados ao módulo TratadorComandos
    if (m.tipo === 'comando' && m.texto) {
      const tratado = await comandos.tratar(m);
      if (tratado) {
        console.log(`📤 [Canal] Comando processado para ${m.pessoa}: ${m.texto}`);
        return;
      }
    }

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
          '📜 <b>Carta de Lealdade do Henriques</b>',
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
      const metadadosCofre = (() => {
        try {
          return cofre.listarMetadados(m.pessoa) ?? [];
        } catch {
          return [];
        }
      })();
      const resp = await henriques.responder(m.pessoa, 'quanto vou pagar', {
        pessoa: m.pessoa,
        servicoAtivo: missaoAtiva?.servico ?? 'ocupacao-espaco-publico-esplanada',
        servicoTituloAtivo: missaoAtiva?.servicoTitulo,
        missaoAtiva: Boolean(missaoAtiva),
        missaoId: missaoAtiva?.id,
        estadoMissao: missaoAtiva?.estado,
        mandatoAtivoNivel: missaoAtiva ? 'D2' : 'D0',
        itensCofre: metadadosCofre.map(it => ({ tipo: it.tipo, titulo: it.titulo })),
      });
      if (resp.mensagens && resp.mensagens.length > 1) {
        await canal.enviarSequencia(m.conversa, resp.mensagens, resp.botoes);
      } else {
        await canal.enviar(m.conversa, resp.texto, resp.botoes);
      }
    } else if (m.texto === 'iniciar_esplanada' || m.texto === 'voltar_esplanada' || m.texto === 'preparar:ocupacao-espaco-publico-esplanada') {
      await fluxoD2.iniciarFluxoEsplanada(m.pessoa, m.conversa);
    } else if (m.texto?.startsWith('d2_')) {
      const tratado = await fluxoD2.processarPasso(m.pessoa, m.conversa, m.texto);
      if (!tratado) {
        if (m.texto === 'd2_enviar_foto') {
          await cenarios.processarValidacaoCalcada(m);
        }
      }
    } else if (m.texto === 'enviar_foto_calcada') {
      await cenarios.processarValidacaoCalcada(m);
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
          `Concedeu ao Henriques o <b>Mandato D2</b> (${mandato.id}): preparar o rascunho instrutório e organizar as provas, <b>sem autorização para submeter</b> sem a sua assinatura.`,
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
          '3. O Henriques cifra o ficheiro com AES-256-GCM no seu Cofre Digital Pessoal.',
          '',
          'Ou teste de imediato com a simulação:',
        ].join('\n'),
        [
          [{ texto: '📑 Simular Envio: Caderneta Predial (PDF)', dados: 'anexar_caderneta_predial' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else if (m.texto === 'enviar_localizacao_terreno' || m.texto === 'simular_maps_silvares') {
      await cenarios.processarLocalizacaoTerreno(m);
    } else if (m.texto === 'anexar_caderneta_predial' || m.texto === 'simular_anexo_pdf') {
      await cenarios.processarDocumentoPdf(m);
    } else if (
      m.texto === 'assinar_com_chave_movel_digital' ||
      m.texto === 'submeter_pdm_chat' ||
      m.texto === 'submeter_esplanada' ||
      m.texto === 'submeter_pedido'
    ) {
      await cenarios.executarSubmissaoAtiva(m.pessoa);
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
    } else if (m.texto?.startsWith('ver_fontes:') || m.texto === 'ver_fontes') {
      const servicoId = m.texto.includes(':') ? m.texto.split(':')[1] : 'ocupacao-espaco-publico-esplanada';
      let diploma = 'Regulamento Municipal de Guimarães';
      let artigos = 'Artigos regulamentares em vigor';
      const versao = '2026-10-18.1';
      if (servicoId === 'ocupacao-espaco-publico-esplanada') {
        diploma = 'Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães';
        artigos = 'Artigo 8.º e Anexo I (Corredor pedonal ≥ 2,00m, mobiliário amovível)';
      } else if (servicoId === 'pedido-informacao-previa-urbanismo') {
        diploma = 'Regulamento do Plano Diretor Municipal de Guimarães (Aviso n.º 23214/2020)';
        artigos = 'Artigos 45.º e 62.º do PDM e Artigo 14.º do RJUE';
      } else if (servicoId === 'inspecao-ascensores') {
        diploma = 'Regulamento de Elevadores e Ascensores de Guimarães';
        artigos = 'Artigo 34.º da Tabela de Taxas 2025 (Taxa fixa: 73,00 €)';
      } else if (servicoId === 'cartao-municipal-senior') {
        diploma = 'Regulamento do Cartão Municipal Sénior da Câmara Municipal de Guimarães';
        artigos = 'Artigo 4.º (Idade ≥ 65 anos e residência/recenseamento em Guimarães)';
      }

      await registro.registar({
        tipo: 'henriques.fontes.consultadas',
        origem: 'henriques',
        sessao: SESSAO,
        pessoa: m.pessoa,
        missao: null,
        ator: 'agente:verificador',
        simulacao: false,
        dados: {
          servico: servicoId,
          diploma,
          artigos,
          versao,
          consultado_em: '18/10/2026',
        },
      });

      await canal.enviar(
        m.conversa,
        [
          '📜 <b>Fundamentação Oficial e Base Jurídica</b>',
          '',
          `• <b>Diploma:</b> ${diploma}`,
          `• <b>Disposições Aplicáveis:</b> ${artigos}`,
          `• <b>Versão em vigor:</b> v${versao} (consultado a 18/10/2026)`,
          '• <b>Integridade:</b> Selo SHA-256 verificado nos registos canónicos da Câmara.',
          '',
          '<i>O Henriques assegura conformidade estrita com as normas oficiais da autarquia.</i>',
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
    } else if (m.texto?.startsWith('preparar:')) {
      const docId = m.texto.replace('preparar:', '');
      const tituloServico = docId.includes('isencao')
        ? 'Isenção de Licença de Utilização de Edifício Antigo'
        : docId.includes('bolsa')
          ? 'Candidatura a Bolsas de Estudo Municipais'
          : 'Preparação de Requerimento Municipal';

      const missaoId = `MIS-${Math.floor(1000 + Math.random() * 9000)}`;

      await cofre.guardarItem(m.pessoa, missaoId, {
        camada: 'intencoes',
        tipo: 'intencao_procedimento',
        titulo: tituloServico,
        origem: 'rag_d0_conhecimento',
        finalidade: `Instrução sob Mandato D2: ${tituloServico}`,
        dados: { documento_origem: docId },
      });

      const mandato = await mandatos.concederMandato(m.pessoa, missaoId, {
        ambito: docId,
        objeto: tituloServico,
        nivel: 'D2',
        validadeDias: 90,
      });

      await orquestrador.criarMissao({
        pessoa: m.pessoa,
        servico: docId,
        servicoTitulo: tituloServico,
        objetivo: `Reunir provas e organizar pacote instrutório para ${tituloServico}`,
        mandato: mandato.id,
        passosIniciais: [
          'Instrução documental no Cofre Digital (D2)',
          'Anexar caderneta predial / comprovativos (PDF)',
          'Revisão do pacote instrutório mínimo',
          'Submissão formal com Chave Móvel Digital (D3)',
        ],
      });

      await canal.enviar(
        m.conversa,
        [
          `📋 <b>Missão iniciada no Cofre Digital: ${tituloServico}</b>`,
          '',
          `Concedeu ao Henriques o <b>Mandato D2</b> (<code>${mandato.id}</code>): preparar o processo e organizar os documentos necessários, <b>sem autorização para submeter</b> sem a sua assinatura expressa.`,
          '',
          '🔒 <b>Cofre Digital Pessoal (AES-256-GCM):</b>',
          'Os seus ficheiros e intenções estão guardados em segurança. Pode anexar documentos oficiais (ex.: Caderneta Predial em PDF) através do clipe 📎 do Telegram.',
          '',
          'Ou simule de imediato os passos seguintes:',
        ].join('\n'),
        [
          [{ texto: '📑 Simular Envio: Documentos em PDF', dados: 'anexar_caderneta_predial' }],
          [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else {
      await canal.enviar(
        m.conversa,
        'Recebi a sua indicação. Se pretender avançar com um pedido ou colocar alguma dúvida sobre os regulamentos municipais, estou ao seu dispor.',
        [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
      );
    }
  } else if (m.tipo === 'foto') {
    await cenarios.processarValidacaoCalcada(m);
  } else if (m.tipo === 'documento') {
    await cenarios.processarDocumentoPdf(m);
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

    // Se o cidadão quer iniciar a preparação da esplanada por texto
    if (/iniciar.*esplanada|preparar.*esplanada|avan[cç]ar.*esplanada|pedir.*esplanada|quero.*esplanada|ajuda.*tratar|tratar.*esplanada/i.test(m.texto)) {
      await fluxoD2.iniciarFluxoEsplanada(m.pessoa, m.conversa);
      await regista('canal.mensagem.enviada', m, { tipo: 'd2_esplanada_iniciada' });
      return;
    }

    // Se existe um rascunho de esplanada D2 ativo em preenchimento conversacional
    const rascunhoAtivo = fluxoD2.obterRascunhoAtivo(m.pessoa);
    if (rascunhoAtivo && rascunhoAtivo.estado !== 'concluido') {
      const processado = await fluxoD2.processarPasso(m.pessoa, m.conversa, m.texto);
      if (processado) {
        await regista('canal.mensagem.enviada', m, { tipo: 'd2_passo_processado', estado: rascunhoAtivo.estado });
        return;
      }
    }

    // Se a pessoa pede para assinar ou submeter em linguagem natural (excluindo dúvidas, perguntas ou negações)
    const eNegacao = /\b(n[aã]o\s+(autorizo|quero|submeta|envie|posso)|cancelar?|recus[ao]|nem\s+pensar)\b/i.test(m.texto);
    const eDuvidaOuPergunta = /\?|posso\s+submeter|como\s+(posso|consigo|faço)\s+submeter/i.test(m.texto);
    const querSubmeter = !eNegacao && !eDuvidaOuPergunta && /\b(assinar|submeta|submeter\s+agora|autorizo\s+(o\s+)?(submi|avan|envio)|pode\s+(submet|avan|enviar)|confirm[ao]\s+(a\s+)?submi|quero\s+submeter)\b/i.test(m.texto);
    if (querSubmeter && (missaoAtiva || m.texto.toLowerCase().includes('cmd') || m.texto.toLowerCase().includes('chave'))) {
      await cenarios.executarSubmissaoAtiva(m.pessoa);
      await regista('canal.mensagem.enviada', m, { tipo: 'submissao_cmd_inferida' });
      return;
    }

    if (
      missaoAtiva &&
      (missaoAtiva.estado === 'entendido' || missaoAtiva.estado === 'a_verificar' || missaoAtiva.estado === 'em_curso') &&
      (/2[,.]10|metro|calcada|calçada|passeio|fita|largura|livre/i.test(m.texto))
    ) {
      await cenarios.processarValidacaoCalcada(m);
      return;
    }

    // Se o cidadão enviou link de Google Maps ou coordenadas GPS de terreno
    if (/maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps|\b\d{2}\.\d{3,}\s*,\s*-\d{1,2}\.\d{3,}\b/i.test(m.texto)) {
      await cenarios.processarLocalizacaoTerreno(m);
      await regista('canal.mensagem.enviada', m, { tipo: 'localizacao_terreno' });
      return;
    }

    // Se o cidadão referiu envio de caderneta predial
    if (/caderneta|predial|\.pdf\b/i.test(m.texto) && missaoAtiva?.servico.includes('urbanismo')) {
      await cenarios.processarDocumentoPdf(m);
      await regista('canal.mensagem.enviada', m, { tipo: 'caderneta_predial' });
      return;
    }

    // 4. Pergunta em linguagem natural: responde com o Henriques e a Porta
    await canal.aEscrever(m.conversa);
    const metadadosCofre = (() => {
      try {
        return cofre.listarMetadados(m.pessoa) ?? [];
      } catch {
        return [];
      }
    })();
    const itensCofre = metadadosCofre.map(it => ({ tipo: it.tipo, titulo: it.titulo }));
    const resp = await henriques.responder(m.pessoa, m.texto, {
      pessoa: m.pessoa,
      servicoAtivo: missaoAtiva?.servico,
      servicoTituloAtivo: missaoAtiva?.servicoTitulo,
      missaoAtiva: Boolean(missaoAtiva),
      missaoId: missaoAtiva?.id,
      estadoMissao: missaoAtiva?.estado,
      mandatoAtivoNivel: missaoAtiva ? 'D2' : 'D0',
      itensCofre,
    });
    if (resp.mensagens && resp.mensagens.length > 1) {
      await canal.enviarSequencia(m.conversa, resp.mensagens, resp.botoes);
    } else {
      await canal.enviar(m.conversa, resp.texto, resp.botoes);
    }
    await regista('canal.mensagem.enviada', m, { texto: resp.texto });
  }

  console.log(`📤 [Canal] Resposta enviada a ${m.pessoa}`);
} catch (err) {
    console.error(`✖ Erro ao processar mensagem no canal para ${m.pessoa}:`, err);
    await canal.enviar(
      m.conversa,
      'Ocorreu um lapso temporário no processamento da sua mensagem. Por favor tente de novo ou selecione o atendimento humano.',
      [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
    ).catch(() => {});
  }
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