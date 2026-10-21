/**
 * Teste do Fluxo Completo de PDM (Pedido de Informação Prévia — Urbanismo)
 *
 * Simula a jornada completa de uma cidadã (ex.: Inês de Guimarães):
 * 1. Pergunta em linguagem natural sobre regras de PDM para terreno em Silvares (D0);
 * 2. Iniciação e instrução da missão com Mandato D2 e Cofre Digital;
 * 3. Envio de localização georreferenciada (Google Maps) e criação de rascunho na Porta Agêntica;
 * 4. Envio de Caderneta Predial (PDF) para o Cofre Digital com cifra AES-256-GCM;
 * 5. Submissão formal vinculativa com Chave Móvel Digital (Mandato D3);
 * 6. Verificação do rastro de auditoria e preservação do contexto.
 */
import { describe, expect, it } from 'vitest';
import { MotorDecisaoTypeSafe } from '../apps/api/src/nucleo/typesafe/motor-decisao.ts';
import { Afonso } from '../apps/api/src/nucleo/afonso/afonso.ts';
import { ClientePortaMcp } from '../apps/api/src/nucleo/afonso/cliente-porta.ts';
import { RedatorOpenRouter } from '../apps/api/src/nucleo/afonso/redator-openrouter.ts';
import { CofreDigital } from '../apps/api/src/nucleo/cofre/cofre.ts';
import { ServicoChavesCofre } from '../apps/api/src/nucleo/cofre/servico-chaves.ts';
import { GestorMandatos } from '../apps/api/src/nucleo/mandatos/mandatos.ts';
import { OrquestradorMissoes } from '../apps/api/src/nucleo/orquestrador/missao.ts';
import type { Registo } from '../apps/api/src/nucleo/eventos/registo.ts';

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

describe('Simulação do Fluxo Completo de PDM / PIP Urbanismo', () => {
  it('executa a jornada completa do cidadão do D0 ao D3 com garantias de lealdade', async () => {
    const { registo, eventos } = criarRegistoMock();
    const porta = new ClientePortaMcp('http://localhost:4001/mcp');
    const redator = new RedatorOpenRouter();
    const motorDecisao = new MotorDecisaoTypeSafe();
    const afonso = new Afonso(registo, porta, 'demo', motorDecisao, redator);
    const servicoChaves = new ServicoChavesCofre(registo, 'demo');
    const cofre = new CofreDigital(registo, servicoChaves, 'demo');
    const mandatos = new GestorMandatos(registo, 'demo');
    const orquestrador = new OrquestradorMissoes(registo, 'demo');

    const pessoa = 'ines_silvares_pdm';

    // -------------------------------------------------------------
    // PASSO 1: Pergunta inicial em linguagem natural sobre o PDM (D0)
    // -------------------------------------------------------------
    const pergunta1 = 'Tenho um terreno em Silvares e quero saber as regras do PDM para construir uma casa';
    const resp1 = await afonso.responder(pessoa, pergunta1);

    expect(resp1.servicoId).toBe('pedido-informacao-previa-urbanismo');
    expect(resp1.focoServico).toBe('primeiro_contacto');
    expect(resp1.texto).toContain('Regulamento do Plano Diretor Municipal de Guimarães');
    expect(resp1.texto).toContain('Aviso n.º 23214/2020');
    expect(resp1.texto).toContain('Artigos 45.º');
    expect(resp1.texto).toContain('consultado a 18/10/2026');
    expect(resp1.texto).not.toMatch(/\bmunícipe\b/i);

    // -------------------------------------------------------------
    // PASSO 2: Pergunta de seguimento mantendo o contexto de PDM
    // -------------------------------------------------------------
    const pergunta2 = 'Qual é a cércea máxima e o índice de utilização do solo permitidos?';
    const resp2 = await afonso.responder(pessoa, pergunta2);

    expect(resp2.servicoId).toBe('pedido-informacao-previa-urbanismo');
    expect(resp2.focoServico).toBe('mesmo_servico');
    expect(resp2.texto).toContain('3 pisos');
    expect(resp2.texto).toContain('0.60');

    // -------------------------------------------------------------
    // PASSO 3: Cidadã instrui início de missão e preparação de rascunho (D2)
    // -------------------------------------------------------------
    const mandatoD2 = await mandatos.concederMandato(pessoa, 'MIS-0001', {
      ambito: 'urbanismo-informacao-previa',
      objeto: 'Viabilidade Construtiva PDM (Silvares, Guimarães)',
      nivel: 'D2',
      validadeDias: 180,
    });

    expect(mandatoD2.nivel).toBe('D2');
    expect(mandatoD2.estado).toBe('ativo');

    const missao = await orquestrador.criarMissao({
      pessoa,
      servico: 'pedido-informacao-previa-urbanismo',
      servicoTitulo: 'Pedido de Informação Prévia (PIP) — Viabilidade PDM',
      objetivo: 'Obter parecer prévio vinculativo de viabilidade urbanística ao abrigo do Art. 14.º do RJUE',
      mandato: mandatoD2.id,
      passosIniciais: [
        'Identificar enquadramento no PDM de Guimarães',
        'Georreferenciar localização do terreno (Google Maps / GPS)',
        'Anexar Caderneta Predial em PDF no Cofre Digital',
        'Submeter formalmente à Câmara com Chave Móvel Digital',
      ],
    });

    const missaoId = missao.id;
    expect(missao.estado).toBe('entendido');

    await cofre.guardarItem(pessoa, missaoId, {
      camada: 'intencoes',
      tipo: 'intencao_urbanismo',
      titulo: 'Pedido de Informação Prévia (PDM)',
      origem: 'conversa_telegram',
      finalidade: 'Consulta de viabilidade urbanística para construção de moradia em Silvares',
      dados: { servico: 'pedido-informacao-previa-urbanismo' },
    });

    await orquestrador.mudarEstado(missaoId, 'a_verificar', 'A analisar dados de instrução do terreno');
    expect(orquestrador.obter(missaoId)?.estado).toBe('a_verificar');

    // -------------------------------------------------------------
    // PASSO 4: Envio de localização (Google Maps) -> Guardar no cofre
    // -------------------------------------------------------------
    const itemLocalizacao = await cofre.guardarItem(pessoa, missaoId, {
      camada: 'provas',
      tipo: 'georreferenciacao_terreno',
      titulo: 'Localização do Terreno (Silvares)',
      origem: 'google_maps',
      finalidade: 'Instrução do rascunho de PIP de Urbanismo',
      dados: {
        coordenadas: '41.4425, -8.2918',
        freguesia: 'Silvares',
        concelho: 'Guimarães',
        enquadramento_pdm: 'Solo Urbano · Espaço Residencial Nível 2',
      },
    });

    expect(itemLocalizacao.id).toBeDefined();
    orquestrador.atualizarPassoChecklist(missaoId, 'chk-2', true, 'Coordenadas validadas em Solo Urbano R2');

    // -------------------------------------------------------------
    // PASSO 5: Envio de Caderneta Predial (PDF) -> Cifrado no Cofre
    // -------------------------------------------------------------
    const itemPdf = await cofre.guardarItem(pessoa, missaoId, {
      camada: 'provas',
      tipo: 'caderneta_predial_pdf',
      titulo: 'Caderneta Predial Urbana (Silvares)',
      origem: 'upload_documento',
      finalidade: 'Comprovação de legitimidade registral para instrução de PIP',
      dados: {
        artigo_matricial: 'U-1234-Silvares',
        titular: 'Inês de Guimarães',
        area_total_m2: 450,
      },
    });

    expect(itemPdf.id).toBeDefined();
    orquestrador.atualizarPassoChecklist(missaoId, 'chk-3', true, 'Caderneta predial guardada com AES-256-GCM');

    // Transitar missão para preparado
    await orquestrador.mudarEstado(missaoId, 'preparado', 'Instrução completa: terreno e caderneta no cofre');
    expect(orquestrador.obter(missaoId)?.estado).toBe('preparado');

    // Verificar que o cofre contém os itens
    const itensNoCofre = await cofre.listarMetadados(pessoa);
    expect(itensNoCofre.length).toBeGreaterThanOrEqual(3);
    expect(itensNoCofre.some((it) => it.tipo === 'georreferenciacao_terreno')).toBe(true);
    expect(itensNoCofre.some((it) => it.tipo === 'caderneta_predial_pdf')).toBe(true);

    // -------------------------------------------------------------
    // PASSO 6: Intenção de Submissão em Linguagem Natural inferida pelo Jev (D3)
    // -------------------------------------------------------------
    const decisaoSubmissao = await motorDecisao.decidir('Quero assinar com Chave Móvel Digital e submeter o processo', {
      pessoa,
      servicoAtivo: 'pedido-informacao-previa-urbanismo',
      servicoTituloAtivo: 'Pedido de Informação Prévia (PIP) — Viabilidade PDM',
      missaoAtiva: true,
      missaoId,
      estadoMissao: 'preparado',
      mandatoAtivoNivel: 'D2',
      itensCofre: itensNoCofre.map((it) => ({ tipo: it.tipo, titulo: it.titulo })),
    });

    expect(decisaoSubmissao.nivelMandato).toBe('D3');
    expect(decisaoSubmissao.exigeConsentimento).toBe(true);
    expect(decisaoSubmissao.ferramentaMcp).toBe('submeter_comunicacao_previa');

    // -------------------------------------------------------------
    // PASSO 7: Concessão formal de Mandato D3 e Submissão Vinculativa
    // -------------------------------------------------------------
    const mandatoD3 = await mandatos.concederMandato(pessoa, missaoId, {
      ambito: 'urbanismo-informacao-previa',
      objeto: 'Submissão de PIP Terreno Silvares (Guimarães)',
      nivel: 'D3',
      validadeDias: 180,
    });

    expect(mandatoD3.nivel).toBe('D3');

    // Libertar chave temporariamente para a submissão
    const chave = await servicoChaves.libertarChave(pessoa, missaoId, mandatoD3.id, 60000);
    expect(chave).toBeInstanceOf(Buffer);

    // Atualizar estado da missão para submetido
    orquestrador.atualizarPassoChecklist(missaoId, 'chk-4', true, 'Submetido com CMD token_cmd_validado');
    await orquestrador.mudarEstado(missaoId, 'submetido', 'Processo submetido formalmente à Câmara com assinatura CMD');

    const missaoFinal = orquestrador.obter(missaoId);
    expect(missaoFinal?.estado).toBe('submetido');
    expect(missaoFinal?.checklist.every((c) => c.feito)).toBe(true);

    // Recolher chave após a submissão
    await servicoChaves.recolherChave(pessoa, missaoId, 'submissao_concluida');
    expect(servicoChaves.obterChaveAtiva(pessoa, missaoId)).toBeNull();

    // -------------------------------------------------------------
    // PASSO 8: Auditoria de Eventos
    // -------------------------------------------------------------
    expect(eventos.some((e) => e.tipo === 'afonso.intencao.classificada')).toBe(true);
    expect(eventos.some((e) => e.tipo === 'cofre.item.guardado')).toBe(true);
    expect(eventos.some((e) => e.tipo === 'mandato.concedido')).toBe(true);
    expect(eventos.some((e) => e.tipo === 'missao.criada')).toBe(true);
    expect(eventos.some((e) => e.tipo === 'missao.estado.alterado')).toBe(true);
    expect(eventos.some((e) => e.tipo === 'cofre.chave.libertada')).toBe(true);
    expect(eventos.some((e) => e.tipo === 'cofre.chave.recolhida')).toBe(true);
  });
});
