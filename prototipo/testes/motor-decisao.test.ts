/**
 * Testes do Motor de Decisão TypeSafe e Continuidade Conversacional (Jev / System One)
 *
 * Valida a avaliação bidimensional em cada interação:
 * 1. Continuidade do Serviço vs Transição de Tema (primeiro_contacto, mesmo_servico, novo_servico)
 * 2. Intencionalidade e Nível de Mandato (D0, D1, D2, D3, D4)
 */
import { describe, expect, it } from 'vitest';
import { MotorDecisaoTypeSafe } from '../apps/api/src/nucleo/typesafe/motor-decisao.ts';
import { Afonso } from '../apps/api/src/nucleo/afonso/afonso.ts';
import { ClientePortaMcp } from '../apps/api/src/nucleo/afonso/cliente-porta.ts';
import { RedatorOpenRouter } from '../apps/api/src/nucleo/afonso/redator-openrouter.ts';
import type { Registo } from '../apps/api/src/nucleo/eventos/registo.ts';

function criarRegistoMock(): { registo: Registo; eventos: Array<{ tipo: string; dados: Record<string, unknown> }> } {
  const eventos: Array<{ tipo: string; dados: Record<string, unknown> }> = [];
  const registo = {
    registar: async (pedido: { tipo: string; dados: Record<string, unknown> }) => {
      eventos.push({ tipo: pedido.tipo, dados: pedido.dados });
      return { seq: eventos.length, hash: 'sha256:fake', ...pedido };
    },
    listar: async () => eventos.map((e, idx) => ({ seq: idx + 1, ts: new Date().toISOString(), ...e })),
  } as unknown as Registo;

  return { registo, eventos };
}

describe('Motor de Decisão TypeSafe · Continuidade de Serviço e Intencionalidade', () => {
  const motor = new MotorDecisaoTypeSafe();

  it('Turno 1: Primeiro contacto identifica serviço em D0', async () => {
    const res = await motor.decidir('Boa tarde, tenho um terreno em Silvares e queria saber as regras do PDM para construir');
    expect(res.focoServico).toBe('primeiro_contacto');
    expect(res.mudancaServico).toBe(false);
    expect(res.servicoId).toBe('pedido-informacao-previa-urbanismo');
    expect(res.nivelMandato).toBe('D0');
    expect(res.comportamento).toBe('responder');
  });

  it('Turno 2: Seguimento de dúvidas mantém o mesmo serviço em D0', async () => {
    const res = await motor.decidir('E quais são os prazos médios de resposta da Câmara?', {
      servicoAtivo: 'pedido-informacao-previa-urbanismo',
      servicoTituloAtivo: 'Pedido de Informação Prévia (PIP) — Viabilidade PDM',
      missaoAtiva: true,
      mandatoAtivoNivel: 'D0',
    });
    expect(res.focoServico).toBe('mesmo_servico');
    expect(res.mudancaServico).toBe(false);
    expect(res.servicoId).toBe('pedido-informacao-previa-urbanismo');
    expect(res.nivelMandato).toBe('D0');
  });

  it('Turno 3: Envio de provas e instrução eleva intencionalidade para D2 mantendo o mesmo serviço', async () => {
    const res = await motor.decidir('Quero preparar o rascunho, anexar a caderneta predial e enviar as coordenadas Maps', {
      servicoAtivo: 'pedido-informacao-previa-urbanismo',
      servicoTituloAtivo: 'Pedido de Informação Prévia (PIP) — Viabilidade PDM',
      missaoAtiva: true,
      mandatoAtivoNivel: 'D0',
    });
    expect(res.focoServico).toBe('mesmo_servico');
    expect(res.mudancaServico).toBe(false);
    expect(res.servicoId).toBe('pedido-informacao-previa-urbanismo');
    expect(res.nivelMandato).toBe('D2');
    expect(res.ferramentaMcp).toBe('criar_rascunho_pip');
  });

  it('Turno 4: Transição de assunto deteta novo serviço e regista serviço anterior', async () => {
    const res = await motor.decidir('E já agora, como faço para colocar uma esplanada com mesas no meu café?', {
      servicoAtivo: 'pedido-informacao-previa-urbanismo',
      servicoTituloAtivo: 'Pedido de Informação Prévia (PIP) — Viabilidade PDM',
      missaoAtiva: true,
      mandatoAtivoNivel: 'D2',
    });
    expect(res.focoServico).toBe('novo_servico');
    expect(res.mudancaServico).toBe(true);
    expect(res.servicoAnterior).toBe('pedido-informacao-previa-urbanismo');
    expect(res.servicoId).toBe('ocupacao-espaco-publico-esplanada');
    expect(res.nivelMandato).toBe('D0');
  });

  it('Turno 5: Autorização expressa com CMD eleva para D3', async () => {
    const res = await motor.decidir('Confirmo e autorizo a submeter formalmente com a minha Chave Móvel Digital', {
      servicoAtivo: 'ocupacao-espaco-publico-esplanada',
      servicoTituloAtivo: 'Ocupação do Espaço Público — Esplanada Aberta',
      missaoAtiva: true,
      mandatoAtivoNivel: 'D2',
    });
    expect(res.focoServico).toBe('mesmo_servico');
    expect(res.mudancaServico).toBe(false);
    expect(res.servicoId).toBe('ocupacao-espaco-publico-esplanada');
    expect(res.nivelMandato).toBe('D3');
    expect(res.ferramentaMcp).toBe('submeter_comunicacao_previa');
    expect(res.exigeConsentimento).toBe(true);
  });
});

describe('Afonso · Memória de Conversa e Preservação de Contexto', () => {
  it('Afonso preserva serviço em multi-turno e emite eventos afonso.intencao.classificada com continuidade', async () => {
    const { registo, eventos } = criarRegistoMock();
    const porta = new ClientePortaMcp('http://localhost:4001/mcp');
    const redator = new RedatorOpenRouter();
    const afonso = new Afonso(registo, porta, 'demo', undefined, redator);

    const pessoa = 'cidadao_guimaraes_123';

    // 1. Pergunta inicial de PDM
    const r1 = await afonso.responder(pessoa, 'Tenho um terreno em Silvares e quero saber as regras do PDM');
    expect(r1.servicoId).toBe('pedido-informacao-previa-urbanismo');
    expect(r1.focoServico).toBe('primeiro_contacto');
    expect(r1.mudancaServico).toBe(false);

    // 2. Pergunta de seguimento sem mencionar a palavra PDM
    const r2 = await afonso.responder(pessoa, 'E é preciso certidão predial ou algum documento das finanças?');
    expect(r2.servicoId).toBe('pedido-informacao-previa-urbanismo');
    expect(r2.focoServico).toBe('mesmo_servico');
    expect(r2.mudancaServico).toBe(false);

    // 3. Pergunta mudando deliberadamente para esplanada
    const r3 = await afonso.responder(pessoa, 'E se eu quiser abrir uma esplanada com mesas no Largo da Oliveira?');
    expect(r3.servicoId).toBe('ocupacao-espaco-publico-esplanada');
    expect(r3.focoServico).toBe('novo_servico');
    expect(r3.mudancaServico).toBe(true);

    // Verificar eventos registados
    const evIntencao = eventos.filter((e) => e.tipo === 'afonso.intencao.classificada');
    expect(evIntencao.length).toBe(3);
    expect(evIntencao[0]?.dados.foco_servico).toBe('primeiro_contacto');
    expect(evIntencao[1]?.dados.foco_servico).toBe('mesmo_servico');
    expect(evIntencao[2]?.dados.foco_servico).toBe('novo_servico');
    expect(evIntencao[2]?.dados.mudanca_servico).toBe(true);
    expect(evIntencao[2]?.dados.servico_anterior).toBe('pedido-informacao-previa-urbanismo');
  });
});
