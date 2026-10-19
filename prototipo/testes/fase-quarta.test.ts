/**
 * Testes da Fase Quarta:
 *   - Cofre Digital (cifra AES-256-GCM, 3 camadas, privacidade e consentimento)
 *   - Serviço de Chaves (libertação temporária e recolha automática)
 *   - Guardião de Contexto (pacote mínimo PAC-xxxx e separação de nao_partilha)
 *   - Gestor de Mandatos (níveis D0-D4, verificação hierárquica e revogação)
 *   - Motor de Política (permitir, confirmar e bloquear)
 *   - Orquestrador de Missões (máquina de estados e checklist)
 */
import { describe, expect, it } from 'vitest';
import { cifrarDados, decifrarDados, derivarChavePessoa } from '../apps/api/src/nucleo/cofre/cifra.ts';
import { ServicoChavesCofre } from '../apps/api/src/nucleo/cofre/servico-chaves.ts';
import { CofreDigital } from '../apps/api/src/nucleo/cofre/cofre.ts';
import { GestorMandatos } from '../apps/api/src/nucleo/mandatos/mandatos.ts';
import { MotorPolitica } from '../apps/api/src/nucleo/politica/politica.ts';
import { OrquestradorMissoes } from '../apps/api/src/nucleo/orquestrador/missao.ts';
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

describe('Fase Quarta · Cofre, Chaves e Guardião de Contexto', () => {
  it('cifra AES-256-GCM preserva integridade e chaves de pessoas diferentes são distintas', () => {
    const chave1 = derivarChavePessoa('ines');
    const chave2 = derivarChavePessoa('joao');

    expect(chave1).not.toEqual(chave2);
    expect(chave1.length).toBe(32);

    const dadoOriginal = { segredo: 'planta_do_restaurante', area: 12.5 };
    const cifrado = cifrarDados(dadoOriginal, chave1);

    expect(cifrado.iv).toBeDefined();
    expect(cifrado.tag).toBeDefined();
    expect(cifrado.dados).toBeDefined();

    const decifrado = decifrarDados<typeof dadoOriginal>(cifrado, chave1);
    expect(decifrado).toEqual(dadoOriginal);

    // Chave errada deve falhar
    expect(() => decifrarDados(cifrado, chave2)).toThrow();
  });

  it('Serviço de Chaves emite cofre.chave.libertada e cofre.chave.recolhida', async () => {
    const { registo, eventos } = criarRegistoMock();
    const servico = new ServicoChavesCofre(registo, 'demo');

    const chave = await servico.libertarChave('ines', 'MIS-0001', 'MAN-001', 60000);
    expect(chave).toBeInstanceOf(Buffer);

    expect(eventos.some((e) => e.tipo === 'cofre.chave.libertada')).toBe(true);

    const chaveAtiva = servico.obterChaveAtiva('ines', 'MIS-0001');
    expect(chaveAtiva).toEqual(chave);

    await servico.recolherChave('ines', 'MIS-0001', 'missao_terminada');
    expect(eventos.some((e) => e.tipo === 'cofre.chave.recolhida')).toBe(true);
    expect(servico.obterChaveAtiva('ines', 'MIS-0001')).toBeNull();
  });

  it('Cofre Digital guarda dados cifrados, metadados em claro e gera pacote mínimo', async () => {
    const { registo, eventos } = criarRegistoMock();
    const servicoChaves = new ServicoChavesCofre(registo, 'demo');
    const cofre = new CofreDigital(registo, servicoChaves, 'demo');

    // 1. Guardar item com consentimento
    const item = await cofre.guardarItem('ines', 'MIS-0001', {
      camada: 'intencoes',
      tipo: 'esplanada',
      titulo: 'Casa Joaquim - Esplanada',
      dados: { mesas: 4, local: 'Largo da Oliveira' },
      origem: 'chat',
      finalidade: 'Comunicação prévia de ocupação de espaço público',
    });

    expect(item.id).toMatch(/^COF-\d{4}$/);
    expect(eventos.some((e) => e.tipo === 'cofre.item.guardado')).toBe(true);

    // No evento de auditoria NUNCA entra o dado em claro
    const evGuardado = eventos.find((e) => e.tipo === 'cofre.item.guardado');
    expect(JSON.stringify(evGuardado?.dados)).not.toContain('planta_do_restaurante');

    // Metadados visíveis sem decifrar
    const meta = cofre.listarMetadados('ines');
    expect(meta.length).toBe(1);
    expect(meta[0].titulo).toBe('Casa Joaquim - Esplanada');

    // 2. Guardião de Contexto prepara pacote mínimo separando partilha de não partilha
    const pacote = await cofre.prepararPacoteMinimo(
      'ines',
      'MIS-0001',
      'Câmara Municipal de Guimarães',
      'Comunicação prévia',
      { mesas: 4, area_m2: 10 },
      ['terreno_ponte', 'conversas_privadas'],
    );

    expect(pacote.id).toMatch(/^PAC-\d{4}$/);
    expect(pacote.naoPartilha).toContain('terreno_ponte');
    expect(eventos.some((e) => e.tipo === 'cofre.pacote.preparado')).toBe(true);

    // 3. Cidadão aprova pacote
    await cofre.aprovarPacoteMinimo('ines', 'MIS-0001', pacote.id);
    expect(eventos.some((e) => e.tipo === 'cofre.pacote.aprovado')).toBe(true);
  });
});

describe('Fase Quarta · Mandatos Digitais e Motor de Política', () => {
  it('Gestor de Mandatos verifica hierarquia de níveis D0 < D1 < D2 < D3', async () => {
    const { registo, eventos } = criarRegistoMock();
    const gestor = new GestorMandatos(registo, 'demo');

    // Sem mandatos
    const sem = gestor.verificar('ines', 'ocupacao-espaco-publico', 'D2');
    expect(sem.valido).toBe(false);

    // Conceder D3
    const mandato = await gestor.concederMandato('ines', 'MIS-0001', {
      ambito: 'ocupacao-espaco-publico',
      objeto: 'Casa Joaquim',
      nivel: 'D3',
    });

    expect(mandato.nivel).toBe('D3');
    expect(eventos.some((e) => e.tipo === 'mandato.concedido')).toBe(true);

    // D3 satisfaz D1, D2 e D3
    expect(gestor.verificar('ines', 'ocupacao-espaco-publico', 'D1').valido).toBe(true);
    expect(gestor.verificar('ines', 'ocupacao-espaco-publico', 'D2').valido).toBe(true);
    expect(gestor.verificar('ines', 'ocupacao-espaco-publico', 'D3').valido).toBe(true);

    // Outro âmbito não abrangido falha
    expect(gestor.verificar('ines', 'obras-particulares', 'D1').valido).toBe(false);

    // Revogação
    await gestor.revogarMandato('ines', mandato.id);
    expect(eventos.some((e) => e.tipo === 'mandato.revogado')).toBe(true);
    expect(gestor.verificar('ines', 'ocupacao-espaco-publico', 'D1').valido).toBe(false);
  });

  it('Motor de Política decide permitir, confirmar ou bloquear', async () => {
    const { registo, eventos } = criarRegistoMock();
    const gestor = new GestorMandatos(registo, 'demo');
    const politica = new MotorPolitica(registo, gestor, 'demo');

    // 1. Sem mandato -> bloquear
    const d1 = await politica.avaliarAcao({
      pessoa: 'ines',
      missao: 'MIS-0001',
      acao: 'criar_rascunho',
      ambito: 'ocupacao-espaco-publico',
      nivelRequerido: 'D2',
    });
    expect(d1.resultado).toBe('bloquear');

    // 2. Concede D3 mas sem confirmação da pessoa para submissão vinculativa -> confirmar
    await gestor.concederMandato('ines', 'MIS-0001', {
      ambito: 'ocupacao-espaco-publico',
      objeto: 'Casa Joaquim',
      nivel: 'D3',
    });

    const d2 = await politica.avaliarAcao({
      pessoa: 'ines',
      missao: 'MIS-0001',
      acao: 'submeter_comunicacao_previa',
      ambito: 'ocupacao-espaco-publico',
      nivelRequerido: 'D3',
      temConfirmacao: false,
    });
    expect(d2.resultado).toBe('confirmar');
    expect(d2.exigeConfirmacao).toBe(true);

    // 3. Com confirmação expressa -> permitir
    const d3 = await politica.avaliarAcao({
      pessoa: 'ines',
      missao: 'MIS-0001',
      acao: 'submeter_comunicacao_previa',
      ambito: 'ocupacao-espaco-publico',
      nivelRequerido: 'D3',
      temConfirmacao: true,
    });
    expect(d3.resultado).toBe('permitir');

    // 4. Juízo discricionário reservado à técnica -> bloquear sempre
    const d4 = await politica.avaliarAcao({
      pessoa: 'ines',
      missao: 'MIS-0001',
      acao: 'deferir_licenca_excecional',
      ambito: 'ocupacao-espaco-publico',
      nivelRequerido: 'D3',
      temConfirmacao: true,
      juizoDiscricionario: true,
    });
    expect(d4.resultado).toBe('bloquear');
    expect(d4.regra).toBe('reserva_decisoria_humana');

    expect(eventos.filter((e) => e.tipo === 'politica.decisao').length).toBe(4);
  });
});

describe('Fase Quarta · Orquestrador de Missões e Máquina de Estados', () => {
  it('cria missão com checklist oficial e avança pelos estados do procedimento', async () => {
    const { registo, eventos } = criarRegistoMock();
    const orquestrador = new OrquestradorMissoes(registo, 'demo');

    // 1. Criar missão
    const missao = await orquestrador.criarMissao({
      pessoa: 'ines',
      servico: 'ocupacao-espaco-publico-esplanada',
      servicoTitulo: 'Ocupação do Espaço Público — Esplanada Aberta',
      objetivo: 'Licenciar esplanada na Casa Joaquim',
      mandato: 'MAN-2026-0001',
    });

    expect(missao.id).toMatch(/^MIS-\d{4}$/);
    expect(missao.estado).toBe('entendido');
    expect(missao.checklist.length).toBeGreaterThan(0);
    expect(eventos.some((e) => e.tipo === 'missao.criada')).toBe(true);
    expect(eventos.some((e) => e.tipo === 'missao.checklist.gerada')).toBe(true);

    // 2. Transições de estado
    await orquestrador.mudarEstado(missao.id, 'a_verificar', 'A analisar fotografia do passeio');
    expect(missao.estado).toBe('a_verificar');

    await orquestrador.mudarEstado(missao.id, 'preparado', 'Corredor de 2,10m verificado');
    expect(missao.estado).toBe('preparado');

    await orquestrador.mudarEstado(missao.id, 'submetido', 'Submetido com mandato D3 e CMD');
    expect(missao.estado).toBe('submetido');

    await orquestrador.mudarEstado(missao.id, 'precisa_de_si', 'Câmara solicitou largura da fachada');
    expect(missao.estado).toBe('precisa_de_si');

    await orquestrador.mudarEstado(missao.id, 'com_tecnico', 'Elemento fornecido: 8 metros');
    expect(missao.estado).toBe('com_tecnico');

    await orquestrador.mudarEstado(missao.id, 'respondido', 'Processo deferido pela técnica');
    expect(missao.estado).toBe('respondido');

    // Histórico de estados preservado
    expect(missao.historicoEstados.length).toBe(7);
  });
});
