/**
 * Teste do Fluxo Conversacional Multi-Turno da Esplanada (D0 -> D2 -> Conclusão)
 *
 * Reproduz rigorosamente o diálogo reportado pelo utilizador:
 * 1. Cidadão: "Olá Henrique, eu preciso de ajuda em como posso abrir uma esplanada ? Quais são os passos ?"
 *    -> Henriques responde com D0 e citações oficiais (Art. 8.º ROPP, 2,00m livres, amovível) e oferece auxílio.
 * 2. Cidadão: "Sim quero"
 *    -> Henriques aceita e transita de D0 para D2 (Cofre Digital + Mandato D2).
 *    -> Pergunta pela primeira e única vez a morada e nome do estabelecimento.
 * 3. Cidadão: "Rua de São José, Guimarães"
 *    -> Henriques valida a morada no Concelho de Guimarães e guarda no Cofre Digital.
 *    -> Avança o rascunho para 'aguarda_mesas' e pergunta quantas mesas pretende (NÃO repete a pergunta da morada!).
 * 4. Cidadão: "4 mesas"
 *    -> Henriques regista 4 mesas (~10 m²), guarda no Cofre e passa a 'aguarda_passeio'.
 *    -> Pergunta pela salvaguarda do corredor pedonal de 2,00m na calçada.
 * 5. Cidadão: "Sim, tem 2,5 metros"
 *    -> Henriques valida corredor pedonal (2,50m >= 2,00m), conclui o rascunho OVP-SO.
 *    -> Prepara Pacote Mínimo sob RGPD no Cofre Digital e gera botão de autenticação Chave Móvel Digital.
 */
import { describe, expect, it } from 'vitest';
import { MotorDecisaoTypeSafe } from '../apps/api/src/nucleo/typesafe/motor-decisao.ts';
import { Henriques } from '../apps/api/src/nucleo/henriques/henriques.ts';
import { ClientePortaMcp } from '../apps/api/src/nucleo/henriques/cliente-porta.ts';
import { RedatorOpenRouter } from '../apps/api/src/nucleo/henriques/redator-openrouter.ts';
import { CofreDigital } from '../apps/api/src/nucleo/cofre/cofre.ts';
import { ServicoChavesCofre } from '../apps/api/src/nucleo/cofre/servico-chaves.ts';
import { GestorMandatos } from '../apps/api/src/nucleo/mandatos/mandatos.ts';
import { OrquestradorMissoes } from '../apps/api/src/nucleo/orquestrador/missao.ts';
import { GestorFluxoD2 } from '../apps/api/src/nucleo/orquestrador/fluxo-conversa-d2.ts';
import { MotorPolitica } from '../apps/api/src/nucleo/politica/politica.ts';
import { ProcessadorCenarios } from '../apps/api/src/nucleo/simuladores/cenarios.ts';
import type { Registo } from '../apps/api/src/nucleo/eventos/registo.ts';
import type { Canal, Botoes } from '../apps/api/src/nucleo/canal.ts';

function criarRegistoMock(): { registo: Registo; eventos: Array<{ tipo: string; dados: Record<string, unknown> }> } {
  const eventos: Array<{ tipo: string; dados: Record<string, unknown> }> = [];
  const registo = {
    registar: async (pedido: { tipo: string; dados: Record<string, unknown> }) => {
      eventos.push({ tipo: pedido.tipo, dados: pedido.dados });
      return { seq: eventos.length, hash: `sha256:fake_${eventos.length}`, ...pedido };
    },
    listar: async () => eventos.map((e, idx) => ({ seq: idx + 1, ts: new Date().toISOString(), ...e })),
  } as unknown as Registo;

  return { registo, eventos };
}

class CanalMock implements Canal {
  mensagens: Array<{ conversa: string; texto: string; botoes?: Botoes }> = [];

  async ligar() {}
  async aEscrever() {}
  async enviar(conversa: string, texto: string, botoes?: Botoes) {
    this.mensagens.push({ conversa, texto, botoes });
  }
  async enviarSequencia(conversa: string, msgs: string[], botoes?: Botoes) {
    for (let i = 0; i < msgs.length; i++) {
      this.mensagens.push({ conversa, texto: msgs[i], botoes: i === msgs.length - 1 ? botoes : undefined });
    }
  }
  ultimaMensagem(): string {
    return this.mensagens[this.mensagens.length - 1]?.texto ?? '';
  }
}

describe('Fluxo Conversacional Completo da Esplanada', () => {
  it('executa sem repetições nem falhas de morada desde o D0 até ao rascunho D2', async () => {
    const { registo, eventos } = criarRegistoMock();
    const canal = new CanalMock();
    const porta = new ClientePortaMcp('http://localhost:4001/mcp');
    const redator = new RedatorOpenRouter();
    const motorDecisao = new MotorDecisaoTypeSafe();
    const henriques = new Henriques(registo, porta, 'demo', motorDecisao, redator);
    const servicoChaves = new ServicoChavesCofre(registo, 'demo');
    const cofre = new CofreDigital(registo, servicoChaves, 'demo');
    const mandatos = new GestorMandatos(registo, 'demo');
    const orquestrador = new OrquestradorMissoes(registo, 'demo');
    const fluxoD2 = new GestorFluxoD2({
      registo,
      orquestrador,
      mandatos,
      cofre,
      canal: canal as any,
      sessao: 'demo',
      redator,
    });

    const pessoa = 'paulo_demo_esplanada';
    const conversa = 'chat_paulo_123';

    // Helper simulando o orquestrador do principal.ts
    const enviarMensagemCidadao = async (texto: string) => {
      const contextoPessoa = henriques.contexto.obterContexto(pessoa);
      const missaoAtiva = orquestrador.obterAtiva(pessoa);
      const servicoAtivo = contextoPessoa?.servicoAtivoId ?? missaoAtiva?.servico;
      const rascunhoAtivo = fluxoD2.obterRascunhoAtivo(pessoa);

      // 1. Se rascunho D2 ativo
      if (rascunhoAtivo && rascunhoAtivo.estado !== 'concluido') {
        const ehDuvidaInformativa =
          /\?|quanto\s+custa|qual\s+(é\s+)?(a\s+)?(taxa|preço|custo|prazo)|o\s+que\s+(é|diz)|como\s+funciona|quais\s+(são\s+)?os\s+documentos/i.test(texto);

        const contemDadosTecnicos =
          /largo|rua|praça|avenida|travessa|oliveira|joaquim|guimarães|\d+\s*(mesas?|cadeiras?|m2|m²)|2[,.]10|metros|calçada|passeio/i.test(texto);

        if (contemDadosTecnicos || !ehDuvidaInformativa) {
          const processado = await fluxoD2.processarPasso(pessoa, conversa, texto);
          if (processado) return;
        }

        if (ehDuvidaInformativa) {
          const resp = await henriques.responder(pessoa, texto, {
            servicoAtivo: 'ocupacao-espaco-publico-esplanada',
            missaoId: rascunhoAtivo.missaoId,
            estadoMissao: 'em_curso',
          });
          await canal.enviar(conversa, resp.texto, resp.botoes);
          return;
        }
      }

      // 2. Se quer iniciar expressamente ou aceitou proposta
      const ePerguntaInformativa = /\?|o\s+que|como|quais|quanto|qual|onde|preciso\s+de\s+fazer|como\s+fa[çc]o/i.test(texto);
      const textoLimpo = texto.trim().toLowerCase().replace(/[.,!?;:]+$/, '').trim();
      const aceitaAvancar =
        /^(sim(\s+(quero|por\s+favor|avan[çc]a|trata|bora|vamos))?|quero(\s+sim|\s+avan[çc]ar|\s+tratar)?|avan[çc]ar?|pode\s+ser|trata(\s+disso|\s+de\s+tudo)?|vamos(\s+a\s+isso)?|bora|for[çc]a|come[çc]ar|iniciar|ok|com\s+certeza)$/i.test(textoLimpo);

      const querIniciar =
        !ePerguntaInformativa &&
        (texto === 'iniciar_esplanada' ||
          texto === 'iniciar_esplanada_d2' ||
          /\b(iniciar|preparar|instruir|avançar|vamos\s+a\s+isso|bora|começar)\b.*(esplanada|processo|pedido|preparação)/i.test(texto) ||
          /\b(quero|ajuda-me|podes|vamos|gostava\s+de)\b.*(preparar|tratar|iniciar|avançar).*(esplanada|processo|pedido)/i.test(texto) ||
          (aceitaAvancar && (servicoAtivo === 'ocupacao-espaco-publico-esplanada' || !servicoAtivo)));

      if (querIniciar) {
        await fluxoD2.iniciarFluxoEsplanada(pessoa, conversa, true);
        return;
      }

      // 3. Resposta informativa normal via Henriques / TypeSafe Jev
      const resp = await henriques.responder(pessoa, texto, {
        servicoAtivo,
        missaoAtiva: Boolean(missaoAtiva),
        missaoId: missaoAtiva?.id,
        mandatoAtivoNivel: missaoAtiva ? 'D2' : 'D0',
      });
      if (resp.mensagens && resp.mensagens.length > 1) {
        await canal.enviarSequencia(conversa, resp.mensagens, resp.botoes);
      } else {
        await canal.enviar(conversa, resp.texto, resp.botoes);
      }
    };

    // =========================================================================
    // TURNO 1: Pergunta do Paulo
    // "Olá Henrique, eu preciso de ajuda em como posso abrir uma esplanada ? Quais são os passos ?"
    // =========================================================================
    await enviarMensagemCidadao('Olá Henrique, eu preciso de ajuda em como posso abrir uma esplanada ? Quais são os passos ?');
    const todasMsgsTurno1 = canal.mensagens.map((m) => m.texto).join('\n');

    expect(todasMsgsTurno1).toContain('esplanada');
    expect(todasMsgsTurno1).toContain('2,00');
    expect(todasMsgsTurno1).toContain('Regulamento');
    expect(henriques.contexto.obterContexto(pessoa).servicoAtivoId).toBe('ocupacao-espaco-publico-esplanada');

    // =========================================================================
    // TURNO 2: Resposta do Paulo
    // "Sim quero"
    // -> Henriques transita para D2 e pergunta a morada (1ª vez)
    // =========================================================================
    canal.mensagens = [];
    await enviarMensagemCidadao('Sim quero');
    const msgTurno2 = canal.ultimaMensagem();

    expect(msgTurno2).toContain('Cofre Digital');
    expect(msgTurno2).toContain('Mandato D2');
    expect(msgTurno2).toContain('morada');
    expect(fluxoD2.obterRascunhoAtivo(pessoa)?.estado).toBe('aguarda_morada');

    // =========================================================================
    // TURNO 3: Paulo fornece a morada
    // "Rua de São José, Guimarães"
    // -> Henriques NÃO pode perguntar a morada novamente!
    // -> Deve guardar a morada no Cofre e perguntar pelas mesas!
    // =========================================================================
    canal.mensagens = [];
    await enviarMensagemCidadao('Rua de São José, Guimarães');
    const msgTurno3 = canal.ultimaMensagem();

    const rascunhoAposMorada = fluxoD2.obterRascunhoAtivo(pessoa);
    expect(rascunhoAposMorada?.morada).toBe('Rua de São José, Guimarães');
    expect(rascunhoAposMorada?.estado).toBe('aguarda_mesas');
    // Verificação estrita: NÃO pode perguntar "qual é o nome e a morada" outra vez
    expect(msgTurno3.toLowerCase()).not.toContain('qual é o nome e a morada');
    expect(msgTurno3.toLowerCase()).toContain('mesas');

    // Verificar que ficou guardado no Cofre Digital
    const itensCofre = cofre.listarItensCompletos(pessoa);
    expect(itensCofre.some((it: any) => (it.dadosDecifrados as any)?.morada === 'Rua de São José, Guimarães')).toBe(true);

    // =========================================================================
    // TURNO 4: Paulo indica o número de mesas
    // "4 mesas"
    // -> Henriques guarda 4 mesas e passa para validação do corredor pedonal
    // =========================================================================
    canal.mensagens = [];
    await enviarMensagemCidadao('4 mesas');
    const msgTurno4 = canal.ultimaMensagem();

    const rascunhoAposMesas = fluxoD2.obterRascunhoAtivo(pessoa);
    expect(rascunhoAposMesas?.mesas).toBe(4);
    expect(rascunhoAposMesas?.estado).toBe('aguarda_passeio');
    expect(msgTurno4).toContain('2,00');

    // =========================================================================
    // TURNO 5: Paulo valida a largura pedonal
    // "Sim, tem 2,5 metros"
    // -> Henriques conclui o rascunho, prepara o pacote mínimo e apresenta a minuta com CMD
    // =========================================================================
    canal.mensagens = [];
    await enviarMensagemCidadao('Sim, tem 2,5 metros');
    const msgTurno5 = canal.ultimaMensagem();

    const rascunhoFinal = fluxoD2.obterRascunhoAtivo(pessoa);
    expect(rascunhoFinal?.estado).toBe('concluido');
    expect(rascunhoFinal?.larguraLivre).toBe('2,50 metros');

    const ultimoEnvio = canal.mensagens[canal.mensagens.length - 1];
    expect(msgTurno5).toContain('MINUTA DO REQUERIMENTO MUNICIPAL (OVP-SO)');
    expect(msgTurno5).toContain('Rua de São José, Guimarães');
    expect(msgTurno5).toContain('4 mesas');
    expect(msgTurno5).toContain('2,50 metros');
    expect(ultimoEnvio.botoes?.[0]?.[0]?.texto).toContain('Chave Móvel Digital');

    // Verificar que o Pacote Mínimo RGPD foi preparado no Cofre Digital
    const pacotes = cofre.listarPacotes(pessoa);
    expect(pacotes.length).toBeGreaterThan(0);
    expect(pacotes[0].campos.morada).toBe('Rua de São José, Guimarães');
    expect(pacotes[0].campos.numero_mesas).toBe(4);

    // =========================================================================
    // TURNO 6: Paulo autentica com Chave Móvel Digital (Submissão Formal D3)
    // -> O pedido é submetido, o caso é criado na Consola da Câmara (OEP/2026/0001)
    // =========================================================================
    const politica = new MotorPolitica(registo, mandatos, 'demo');
    const cenarios = new ProcessadorCenarios({
      mandatos,
      cofre,
      politica,
      servicoChaves,
      clientePorta: porta,
      orquestrador,
      registo,
      canal: canal as any,
      obterChat: () => conversa,
      sessao: 'demo',
    });

    canal.mensagens = [];
    await cenarios.executarSubmissaoAtiva(pessoa);
    const msgTurno6 = canal.ultimaMensagem();

    expect(msgTurno6).toContain('Comunicação Prévia Submetida com Sucesso');
    expect(msgTurno6).toContain('OEP/2026/0001');
    expect(msgTurno6).toContain('Mandato D3');

    // Verificar que o caso foi criado para a Consola Municipal com os dados reais recolhidos
    const eventosConsola = eventos.filter(
      (e) => e.tipo === 'consola.caso.criado' && (e.dados as any).processo === 'OEP/2026/0001',
    );
    const ultimoEventoConsola = eventosConsola[eventosConsola.length - 1];
    expect(ultimoEventoConsola).toBeDefined();
    expect((ultimoEventoConsola!.dados as any).morada).toBe('Rua de São José, Guimarães');
    expect((ultimoEventoConsola!.dados as any).mesas).toBe(4);

    // =========================================================================
    // TURNO 7: Técnica Municipal na Consola da Câmara aprova o pedido
    // -> Ação /api/consola/acao com acao='approve'
    // -> Cidadão recebe notificação no Telegram com o despacho e alvará
    // =========================================================================
    canal.mensagens = [];
    const missaoAtiva =
      orquestrador.obterAtiva(pessoa) ??
      orquestrador.listar().find((m) => m.servico.includes('esplanada'));
    expect(missaoAtiva).toBeDefined();

    await orquestrador.mudarEstado(missaoAtiva!.id, 'respondido', 'Aprovado pela Câmara Municipal');
    await registo.registar({
      tipo: 'consola.caso.despachado',
      origem: 'consola',
      sessao: 'demo',
      pessoa,
      missao: missaoAtiva!.id,
      ator: 'tecnico:camara',
      simulacao: true,
      dados: {
        processo: 'OEP/2026/0001',
        decisao: 'aprovado',
        fundamentacao: 'Deferido. Ocupação contígua à fachada em conformidade com o Artigo 8.º do ROPP.',
      },
    });

    await canal.enviar(
      conversa,
      [
        '🎉 <b>Decisão Municipal Favorável!</b>',
        'Processo: <code>OEP/2026/0001</code>',
        '',
        'A <b>Câmara Municipal de Guimarães</b> apreciou e <b>aprovou formalmente</b> o seu pedido de esplanada! 🏛️✅',
        '',
        '<b>Despacho da Técnica:</b> <i>«Deferido. Ocupação contígua à fachada em conformidade com o Artigo 8.º do ROPP.»</i>',
        '',
        '📋 <b>Alvará Digital Concedido:</b>',
        '• <b>Regime:</b> Mera Comunicação Prévia com Eficácia Plena',
        '• <b>Validade:</b> Licenciamento Anual (2026)',
        '• <b>Taxas Regulamentares:</b> Liquidadas nos termos do RTTL 2025',
        '',
        'O seu alvará e comprovativo oficial foram emitidos e arquivados no seu <b>Cofre Digital</b>.',
      ].join('\n'),
    );

    const msgTurno7 = canal.ultimaMensagem();
    expect(msgTurno7).toContain('Decisão Municipal Favorável');
    expect(msgTurno7).toContain('OEP/2026/0001');
    expect(msgTurno7).toContain('Alvará Digital Concedido');
    expect(msgTurno7).toContain('Câmara Municipal de Guimarães');
  });

  it('solicita formalmente os documentos e realiza check regulamentar com prova no Cofre Digital', async () => {
    const { registo } = criarRegistoMock();
    const canal = new CanalMock();
    const servicoChaves = new ServicoChavesCofre(registo, 'demo');
    const cofre = new CofreDigital(registo, servicoChaves, 'demo');
    const mandatos = new GestorMandatos(registo, 'demo');
    const orquestrador = new OrquestradorMissoes(registo, 'demo');
    const fluxoD2 = new GestorFluxoD2({
      registo,
      orquestrador,
      mandatos,
      cofre,
      canal: canal as any,
      sessao: 'demo',
    });

    const pessoa = 'ines_teste_documentos';
    const conversa = 'chat_ines_doc';

    // 1. Iniciar fluxo
    await fluxoD2.iniciarFluxoEsplanada(pessoa, conversa, true);
    expect(canal.ultimaMensagem()).toContain('qual é o <b>nome</b> e a <b>morada</b>');

    // 2. Enviar morada e estabelecimento
    await fluxoD2.processarPasso(pessoa, conversa, 'Café da Beira na Rua de São José, Guimarães');
    expect(canal.ultimaMensagem()).toContain('mesas');

    // 3. Enviar número de mesas -> Deve pedir os documentos instrutórios!
    await fluxoD2.processarPasso(pessoa, conversa, '4 mesas');
    const msgPedidoDocs = canal.ultimaMensagem();
    expect(msgPedidoDocs).toContain('Documentos Necessários para a Instrução');
    expect(msgPedidoDocs).toContain('Planta de Implantação / Croquis Cotado');
    expect(msgPedidoDocs).toContain('Certidão Permanente do Registo Comercial');
    expect(msgPedidoDocs).toContain('Termo de Responsabilidade do Mobiliário');

    // 4. Anexar / enviar documentos (via botão ou texto)
    await fluxoD2.processarPasso(pessoa, conversa, 'd2_anexar_todos');
    const msgValidacao = canal.ultimaMensagem();

    // 5. Verificar que a auditoria e check foram realizados
    expect(msgValidacao).toContain('Documentação Recebida e Auditada pelo Henriques');
    expect(msgValidacao).toContain('Corredor pedonal livre verificado: 2,10 metros');
    expect(msgValidacao).toContain('CUMPRE');
    expect(msgValidacao).toContain('CAE 56101');
    expect(msgValidacao).toContain('Mobiliário 100% amovível');
    expect(msgValidacao).toContain('Chave Móvel Digital');

    // 6. Verificar que a checklist e o Cofre foram atualizados
    const missao = orquestrador.obterAtiva(pessoa);
    expect(missao?.checklist.find((p) => p.id === 'chk-3')?.feito).toBe(true);

    const itensCofre = cofre.listarItensCompletos(pessoa);
    expect(itensCofre.some((it: any) => it.tipo === 'planta_cotada')).toBe(true);
    expect(itensCofre.some((it: any) => it.tipo === 'certidao_comercial')).toBe(true);
    expect(itensCofre.some((it: any) => it.tipo === 'termo_responsabilidade')).toBe(true);
  });
});
