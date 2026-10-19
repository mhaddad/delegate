/**
 * Os testes do contrato de eventos.
 *
 * A pergunta que estes testes respondem é uma só: se alguém mexer no registo,
 * vemos? Se a resposta é não, o Observatório é um ecrã de ficção e o projecto
 * não pode serdemonstrado.
 */
import { describe, expect, it } from 'vitest';
import {
  CATALOGO,
  Envelope,
  selar,
  verificarCadeia,
  calcularHash,
} from '@delegate/eventos';

const base = {
  v: 1 as const,
  id: 'ev-1',
  ts: '2026-10-19T10:00:00.000Z',
  sessao: 'demo',
  missao: null,
  pessoa: null,
  ator: 'sistema' as const,
  simulacao: false,
  hash_anterior: null,
};

describe('o selo cobre os dados do evento', () => {
  it('dois eventos com textos diferentes dão resumos diferentes', () => {
    const a = selar({ ...base, tipo: 'canal.mensagem.recebida', origem: 'canal', ator: 'pessoa', dados: { texto: 'quero uma esplanada' } }, null);
    const b = selar({ ...base, id: 'ev-2', tipo: 'canal.mensagem.recebida', origem: 'canal', ator: 'pessoa', dados: { texto: 'completely different' } }, null);
    expect(a.hash).not.toBe(b.hash);
  });

  it('a ordem das chaves não muda o resumo', () => {
    const um = selar({ ...base, tipo: 'canal.mensagem.recebida', origem: 'canal', ator: 'pessoa', dados: { a: 1, b: 2 } }, null);
    const dois = selar({ ...base, tipo: 'canal.mensagem.recebida', origem: 'canal', ator: 'pessoa', dados: { b: 2, a: 1 } }, null);
    expect(um.hash).toBe(dois.hash);
  });

  it('mexer num valor altera o resumo', () => {
    const um = selar({ ...base, tipo: 'canal.mensagem.recebida', origem: 'canal', ator: 'pessoa', dados: { texto: 'original' } }, null);
    const dois = selar({ ...base, tipo: 'canal.mensagem.recebida', origem: 'canal', ator: 'pessoa', dados: { texto: 'alterado' } }, null);
    expect(um.hash).not.toBe(dois.hash);
  });

  it('mexer no que está dentro de uma lista também altera o resumo', () => {
    const um = selar({ ...base, tipo: 'consola.caso.decidido', origem: 'consola', ator: 'tecnica', dados: { documentos: ['a4'] } }, null);
    const dois = selar({ ...base, tipo: 'consola.caso.decidido', origem: 'consola', ator: 'tecnica', dados: { documentos: ['a4', 'cc'] } }, null);
    expect(um.hash).not.toBe(dois.hash);
  });
});

describe('a cadeia detecta alterações', () => {
  const construir = (quantos: number) => {
    const eventos = [];
    let anterior = null;
    for (let i = 0; i < quantos; i++) {
      const evento = selar(
        { ...base, id: `ev-${i}`, tipo: 'canal.mensagem.recebida', origem: 'canal', ator: 'pessoa', dados: { n: i } },
        anterior,
      );
      eventos.push({ ...evento, seq: i + 1 });
      anterior = evento;
    }
    return eventos;
  };

  it('uma cadeia intacta fecha', () => {
    expect(verificarCadeia(construir(5))).toMatchObject({ valido: true, elos: 5, quebradoEm: null });
  });

  it('alguém que muda os dados de um evento antigo parte a cadeia', () => {
    const eventos = construir(5);
    // Mexe no terceiro, como alguém faria na base de dados.
    const { dados, ...resto } = eventos[2]!;
    eventos[2] = { ...resto, dados: { ...dados, n: 999 } };

    const v = verificarCadeia(eventos);
    expect(v.valido).toBe(false);
    expect(v.quebradoEm).toBe(3);
  });

  it('alguém que apaga um evento parte a cadeia', () => {
    const eventos = construir(5);
    eventos.splice(2, 1);
    expect(verificarCadeia(eventos).valido).toBe(false);
  });

  it('o diagnóstico aponta para o número do evento, não para a posição', () => {
    const eventos = construir(5);
    eventos[3] = { ...eventos[3]!, hash: 'a'.repeat(64) };
    expect(verificarCadeia(eventos).quebradoEm).toBe(4);
  });
});

describe('o esquema é executado e o catálogo obedece-lhe', () => {
  it('todos os tipos do catálogo passam o esquema', () => {
    const maus: string[] = [];
    for (const entrada of CATALOGO) {
      // Os eventos da Porta têm de trazer mandato e fontes em `dados`. Sem
      // isto, o teste estaria a medir a ausência da regra, não o catálogo.
      const dados = entrada.tipo.startsWith('porta.')
        ? { mandato: { nivel: 'D0' }, fontes: [], resultado: { ok: true } }
        : {};
      const resultado = Envelope.safeParse({
        ...base,
        tipo: entrada.tipo,
        origem: entrada.origem,
        dados,
        hash: 'a'.repeat(64),
      });
      if (!resultado.success) maus.push(entrada.tipo);
    }
    expect(maus).toEqual([]);
  });

  it('um evento da Porta sem mandato é recusado — é a auditoria a ser imposta', () => {
    const semMandato = Envelope.safeParse({
      ...base,
      tipo: 'porta.capacidade.chamada',
      origem: 'porta',
      dados: { fontes: [], resultado: { ok: true } },
      hash: 'a'.repeat(64),
    });
    expect(semMandato.success).toBe(false);
    expect(JSON.stringify(semMandato)).toContain('dados.mandato');

    const completo = Envelope.safeParse({
      ...base,
      tipo: 'porta.capacidade.chamada',
      origem: 'porta',
      dados: { mandato: { nivel: 'D0' }, fontes: ['reg-x@2026-10-18.1'], resultado: { ok: true } },
      hash: 'a'.repeat(64),
    });
    expect(completo.success).toBe(true);
  });

  it('todo o catálogo tem legenda, senão não aparece no Observatório', async () => {
    const { TIPOS_SEM_LEGENDA } = await import('@delegate/eventos');
    expect(TIPOS_SEM_LEGENDA).toEqual([]);
  });

  it('o esquema recusa um pseudónimo que seja um identificador de canal', () => {
    const resultado = Envelope.safeParse({
      ...base,
      tipo: 'canal.mensagem.recebida',
      origem: 'canal',
      pessoa: '123456789',
      dados: {},
      hash: 'a'.repeat(64),
    });
    expect(resultado.success).toBe(false);
  });

  it('o esquema recusa um tipo mal formado', () => {
    expect(
      Envelope.safeParse({ ...base, tipo: 'NAO.É.um.tipo', origem: 'canal', dados: {}, hash: 'a'.repeat(64) }).success,
    ).toBe(false);
  });
});

describe('calcularHash ignora o campo do próprio resumo', () => {
  it('o resumo não depende do resumo', () => {
    const evento = selar({ ...base, tipo: 'canal.mensagem.recebida', origem: 'canal', dados: {} }, null);
    expect(calcularHash(evento)).toBe(evento.hash);
  });
});