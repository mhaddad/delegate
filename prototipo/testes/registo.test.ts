/**
 * O teste que dá sentido ao Registo Canónico.
 *
 * A regra do projecto é uma só: nenhum número sai sem a fonte ao lado. Se o
 * esquema deixar passar um valor órfão, toda a defesa cai — e cai em silêncio,
 * porque um número inventado tem sempre aspecto certo.
 */
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { Servico } from '../registo/esquema.ts';

const PASTA = resolve(import.meta.dirname, '../registo');
const ficheiros = (await readdir(PASTA)).filter((f) => f.endsWith('.yaml')).sort();

const carregar = async (nome: string) =>
  Servico.parse(parse(await readFile(resolve(PASTA, nome), 'utf-8')));

describe('as fichas do registo', () => {
  it('todas passam o esquema', async () => {
    expect(ficheiros.length).toBeGreaterThanOrEqual(5);
    for (const f of ficheiros) {
      const bruto = parse(await readFile(resolve(PASTA, f), 'utf-8'));
      const r = Servico.safeParse(bruto);
      expect(r.success, `${f}: ${r.success ? '' : JSON.stringify(r.error.issues)}`).toBe(true);
    }
  });

  it('nenhum serviço tem um valor de taxa sem fonte', async () => {
    for (const f of ficheiros) {
      const ficha = await carregar(f);
      if (ficha.taxas.valor !== null) {
        expect(ficha.taxas.fonte, `${f} tem taxa sem fonte`).toBeTruthy();
        expect(ficha.fontes.some((x) => x.id === ficha.taxas.fonte)).toBe(true);
      }
    }
  });

  it('nenhuma ficha se declara validada, porque só a Câmara valida', async () => {
    for (const f of ficheiros) {
      const ficha = await carregar(f);
      expect(ficha.estado).not.toBe('validado');
    }
  });

  it('o serviço do PDM fica em rascunho, porque ainda não há fonte', async () => {
    const ficha = await carregar('pedido-informacao-previa-urbanismo.yaml');
    expect(ficha.estado).toBe('rascunho');
    expect(ficha.taxas.valor).toBeNull();
    expect(ficha.condicoes).toEqual([]);
  });
});

describe('o esquema recusa o que não deve passar', () => {
  const base = async () => {
    const bruto = parse(await readFile(resolve(PASTA, 'inspecao-ascensores.yaml'), 'utf-8')) as Record<string, unknown>;
    return bruto;
  };

  it('um valor de taxa sem fonte é recusado', async () => {
    const ficha = await base();
    ficha.taxas = { descricao: 'Taxa inventada', valor: 500, fonte: null, unidade: null };
    const r = Servico.safeParse(ficha);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r)).toContain('a taxa tem valor mas não tem fonte');
  });

  it('uma condição que aponta para uma fonte que não existe é recusada', async () => {
    const ficha = await base();
    ficha.condicoes = [{ texto: 'Condição inventada', fonte: 'fonte-que-nao-existe' }];
    expect(Servico.safeParse(ficha).success).toBe(false);
  });

  it('uma ficha que se declara validada é recusada', async () => {
    const ficha = await base();
    ficha.estado = 'validado';
    expect(Servico.safeParse(ficha).success).toBe(false);
  });

  it('um pseudónimo de canal dentro de um dado é recusado pelo esquema', async () => {
    const { Envelope } = await import('@delegate/eventos');
    const r = Envelope.safeParse({
      v: 1,
      id: 'x',
      ts: new Date().toISOString(),
      tipo: 'canal.mensagem.recebida',
      origem: 'canal',
      sessao: 'demo',
      missao: null,
      pessoa: '123456789',
      ator: 'pessoa',
      simulacao: false,
      dados: {},
      hash_anterior: null,
      hash: 'a'.repeat(64),
    });
    expect(r.success).toBe(false);
  });
});