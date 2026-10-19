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
import { criarServidorEventos } from './eventos/servidor.ts';
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

const servidor = criarServidorEventos(registro, () => base.escutar());
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

// Ciclo fechado: escutar eventos da Consola/SU para notificar munícipe no Telegram
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
      'Pacote mínimo <code>PAC-0001</code> preparado sob <b>Mandato D3</b>. Apenas saem as dimensões estritamente necessárias. <b>Não são partilhados</b> património, dados bancários ou preferências.',
      '',
      'O pedido está <b>pronto para submissão formal</b> com a sua confirmação.',
    ].join('\n'),
    [
      [{ texto: '✍️ Rever e Submeter com CMD (Simulação)', dados: 'submeter_esplanada' }],
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
      const resp = await afonso.responder(m.pessoa, 'quanto vou pagar');
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

      // 2. Conceder Mandato D3
      const mandato = await mandatos.concederMandato(m.pessoa, 'MIS-0001', {
        ambito: 'ocupacao-espaco-publico',
        objeto: 'Casa Joaquim (Largo da Oliveira)',
        nivel: 'D3',
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
          `Concedeu ao Afonso o <b>Mandato ${mandato.nivel}</b> (${mandato.id}): preparar e submeter com a sua confirmação explícita.`,
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
    } else if (m.texto === 'submeter_esplanada') {
      // 1. Aprovar pacote mínimo
      await cofre.aprovarPacoteMinimo(m.pessoa, 'MIS-0001', 'PAC-0001');

      // 2. Avaliar política de autorização
      const decisaoPol = await politica.avaliarAcao({
        pessoa: m.pessoa,
        missao: 'MIS-0001',
        acao: 'submeter_comunicacao_previa',
        ambito: 'ocupacao-espaco-publico',
        nivelRequerido: 'D3',
        temConfirmacao: true,
      });

      if (decisaoPol.resultado === 'bloquear') {
        await canal.enviar(m.conversa, `Submissão bloqueada: ${decisaoPol.motivo}`);
        return;
      }

      // 3. Libertar chave criptográfica pelo tempo da submissão
      await servicoChaves.libertarChave(m.pessoa, 'MIS-0001', 'MAN-D3-001', 10 * 60 * 1000);

      // 4. Submeter via Porta Agêntica (MCP)
      await clientePorta.chamarFerramenta('submeter_comunicacao_previa', {
        processo: 'OEP/2026/0001',
        mandato: 'MAN-D3-001',
        token_confirmacao: 'token_cmd_simulado_ines',
      }).catch(() => null);

      // 5. Atualizar máquina de estados da missão
      await orquestrador.mudarEstado('MIS-0001', 'submetido', 'Submetido com mandato D3 e CMD');

      // 6. Criar caso na Consola Municipal
      await registro.registar({
        tipo: 'consola.caso.criado',
        origem: 'consola',
        sessao: SESSAO,
        pessoa: m.pessoa,
        missao: 'MIS-0001',
        ator: 'sistema',
        simulacao: true,
        dados: { caso: 'CASO-0001', processo: 'OEP/2026/0001', risco: 'baixo' },
      });

      await canal.enviar(
        m.conversa,
        [
          'Comunicação Prévia submetida com sucesso! ✅',
          '',
          '<b>Processo:</b> <code>OEP/2026/0001</code> (Simulação)',
          '<b>Estado:</b> Em apreciação técnica pelo Gabinete de Serviços Urbanos.',
          '',
          'Avisarei assim que a técnica validar o processo na Consola Municipal.',
        ].join('\n'),
      );
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
      await canal.enviar(m.conversa, `Carregaste <b>${escapar(m.texto ?? '')}</b>`);
    }
  } else if (m.tipo === 'foto') {
    await processarValidacaoCalcada(m);
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

    if (
      missaoAtiva &&
      (missaoAtiva.estado === 'entendido' || missaoAtiva.estado === 'a_verificar' || missaoAtiva.estado === 'em_curso') &&
      (/2[,.]10|metro|calcada|calçada|passeio|fita|largura|livre/i.test(m.texto))
    ) {
      await processarValidacaoCalcada(m);
      return;
    }

    // 4. Pergunta em linguagem natural: responde com o Afonso e a Porta
    await canal.aEscrever(m.conversa);
    const resp = await afonso.responder(m.pessoa, m.texto);
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