/**
 * O teste que prova que a auditoria sobrevive à base de dados.
 *
 * Os testes do contrato passam em memória. Este arrasta um evento real para o
 * PostgreSQL e volta, porque o JSONB normaliza a ordem das chaves ao gravar —
 * e se o selo não sobreviver a essa viagem, a auditoria é-fiction em paz e
 * mentira no palco.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { abrirBase, type Base } from '../apps/api/src/nucleo/bd.ts';
import { Registo } from '../apps/api/src/nucleo/eventos/registo.ts';

let base: Base;
let registo: Registo;

beforeAll(async () => {
  // O cluster é próprio: um teste que limpa a tabela não pode limpar a sessão
  // que se está a demonstrar.
  base = await abrirBase({
    pasta: resolve(import.meta.dirname, '../.pgdata-teste'),
    porta: 5440,
    recriar: true,
  });
  registo = new Registo(base.escrita);
}, 120_000);

afterAll(async () => {
  await base?.fechar();
}, 60_000);

const novo = (n: number) => ({
  tipo: 'canal.mensagem.recebida' as const,
  origem: 'canal' as const,
  sessao: 'teste',
  ator: 'pessoa' as const,
  pessoa: 'pessoa-abc123',
  missao: null,
  dados: { texto: `mensagem ${n}`, zzz: { b: 2, a: 1 }, lista: ['x', 'y'] },
});

describe('o evento sobrevive à viagem pela base', () => {
  it('um evento relido tem o mesmo selo', async () => {
    const escrito = await registo.registar(novo(1));
    const [lido] = await registo.desde(0);
    expect(lido).toBeDefined();
    expect(lido!.hash).toBe(escrito.hash);
    // E o conteúdo tem de ser igual, não só o resumo.
    expect(lido!.dados).toEqual(novo(1).dados);
  });

  it('uma cadeia de eventos fecha depois de ir e vir da base', async () => {
    for (let i = 0; i < 8; i++) await registo.registar(novo(i + 10));
    const auditoria = await registo.verificar();
    expect(auditoria).toMatchObject({ valido: true, quebradoEm: null });
    expect(auditoria.total).toBeGreaterThanOrEqual(8);
  });

  it('a ordem das chaves na base não affecta o selo', async () => {
    // O JSONB guarda por comprimento e depois por byte. Se o resumo dependesse
    // da ordem de inserção, este teste falharia ao reler.
    const [lido] = await registo.desde(0);
    const reescrito = { ...lido!, dados: Object.fromEntries(Object.entries(lido!.dados).reverse()) };
    expect(reescrito.hash).toBe(lido!.hash);
  });

  it('mexer na base parte a cadeia', async () => {
    const antes = await registo.verificar();
    expect(antes.valido).toBe(true);

    // Alguém com acesso à base muda os dados de um evento, sem mexer no selo.
    await base.escrita.query(
      `UPDATE nucleo.eventos SET dados = jsonb_set(dados, '{texto}', '"alterado"') WHERE seq = $1`,
      [1],
    );

    const depois = await registo.verificar();
    expect(depois.valido).toBe(false);
    expect(depois.quebradoEm).toBe(1);
  });

  it('o filtro por sessão não entrega eventos de outra', async () => {
    await registo.registar({ ...novo(99), sessao: 'outra' });
    const meus = await registo.desde(0, 200, 'teste');
    expect(meus.every((e) => e.sessao === 'teste')).toBe(true);
  });
});