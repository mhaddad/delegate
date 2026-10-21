/**
 * Prova de que o PostgreSQL embutido serve.
 *
 * Este é o maior risco da stack: o pacote está em beta, e o mecanismo de que
 * dependemos — uma notificação emitida numa ligação chegar a quem está em
 * escuta noutra — é exactamente o que o PGlite não conseguia fazer. Melhor
 * descobrir hoje do que quarta-feira.
 *
 *   npm run provar:postgres
 */
import EmbeddedPostgres from 'embedded-postgres';
import pg from 'pg';
import { resolve } from 'node:path';

const PASTA = resolve(import.meta.dirname, '../.pgdata-prova');
const SENHA = 'delegado';
const PORTA = 5433;
const base = { host: '127.0.0.1', port: PORTA, user: 'postgres', password: SENHA };

const ESCOLAS = ['nucleo', 'porta', 'su_simulado', 'tesouraria_simulada'];
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

let bd: EmbeddedPostgres | undefined;
let escritor: pg.Client | undefined;
let leitor: pg.Client | undefined;

async function limpar() {
  await escritor?.end().catch(() => {});
  await leitor?.end().catch(() => {});
  await bd?.stop().catch(() => {});
}

console.log('a arrancar o PostgreSQL embutido…');
bd = new EmbeddedPostgres({
  databaseDir: PASTA,
  user: 'postgres',
  password: SENHA,
  port: PORTA,
  persistent: false,
});
await bd.initialise();
await bd.start();
console.log('✓ arrancado');

const admin = new pg.Client({ ...base, database: 'postgres' });
await admin.connect();
// IF NOT EXISTS evita que uma segunda execução rebente — este script usa a
// sua própria pasta, precisamente para não mexer no cluster da demonstração.
await admin.query('CREATE DATABASE IF NOT EXISTS delegado');
await admin.end();

leitor = new pg.Client({ ...base, database: 'delegado' });
await leitor.connect();
for (const e of ESCOLAS) await leitor.query(`CREATE SCHEMA ${e}`);
console.log('✓ esquemas separados:', ESCOLAS.join(', '));

// A tabela de eventos, só de acréscimo. É a auditoria (ADR-015).
await leitor.query(`
  CREATE TABLE nucleo.eventos (
    seq BIGSERIAL PRIMARY KEY,
    id TEXT NOT NULL,
    ts TIMESTAMPTZ NOT NULL,
    tipo TEXT NOT NULL,
    origem TEXT NOT NULL,
    sessao TEXT NOT NULL,
    missao TEXT,
    pessoa TEXT,
    ator TEXT NOT NULL,
    simulacao BOOLEAN NOT NULL,
    dados JSONB NOT NULL,
    hash_anterior TEXT,
    hash TEXT
  )`);

// O gatilho que transforma cada evento numa notificação.
await leitor.query(`
  CREATE FUNCTION nucleo.notificar() RETURNS trigger AS $$
  BEGIN
    PERFORM pg_notify('eventos', NEW.seq::TEXT);
    RETURN NEW;
  END $$ LANGUAGE plpgsql`);
await leitor.query(`
  CREATE TRIGGER evento_notifica AFTER INSERT ON nucleo.eventos
  FOR EACH ROW EXECUTE FUNCTION nucleo.notificar()`);
console.log('✓ tabela de eventos com gatilho de notificação');

// Duas ligações, como os dois processos do protótipo: uma escuta, outra escreve.
escritor = new pg.Client({ ...base, database: 'delegado' });
await escritor.connect();

const recebidos: string[] = [];
leitor.on('notification', (n) => recebidos.push(`${n.channel} → ${n.payload}`));
await leitor.query('LISTEN eventos');
console.log('✓ à escuta numa ligação, a escrever noutra');

const inserir = (i: number, esquema: string) =>
  escritor!.query(
    `INSERT INTO nucleo.eventos (id, ts, tipo, origem, sessao, ator, simulacao, dados, hash)
     VALUES ($1, now(), 'canal.mensagem.recebida', 'canal', 'prova', 'pessoa', $2, $3, $4)`,
    [`ev-${i}`, esquema === 'su_simulado', JSON.stringify({ i, esquema }), `hash-${i}`],
  );

for (const [i, e] of ESCOLAS.entries()) await inserir(i, e);
await espera(600);

console.log(recebidos.length > 0 ? '✓ NOTIFY chegou à escuta:' : '✖ NOTIFY não chegou');
for (const r of recebidos) console.log('   ', r);

const { rows } = await leitor.query('SELECT count(*)::int AS n FROM nucleo.eventos');
console.log(`✓ eventos gravados: ${rows[0].n}`);

const passou = recebidos.length === ESCOLAS.length && rows[0].n === ESCOLAS.length;
console.log(
  passou
    ? '\n✓ PostgreSQL embutido serve: esquemas separados e NOTIFY entre ligações.'
    : '\n✖ Falhou. Plano B: PostgreSQL do sistema (pacman).',
);

await limpar();
process.exit(passou ? 0 : 1);