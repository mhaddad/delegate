/**
 * Ponto de entrada do processo da Porta Agêntica.
 *
 * Corre isolado do núcleo, expondo o servidor MCP e REST na porta 4001.
 * É a fronteira de rede que o Observatório mostra e que o júri avalia.
 *
 *   npm run porta
 */
import pg from 'pg';
import { criarServidorPorta, PORTA_HTTP_PADRAO } from './servidor.ts';
import { Registo } from '../nucleo/eventos/registo.ts';

const PORTA_HTTP = Number(process.env.PORTA_HTTP_PORT ?? PORTA_HTTP_PADRAO);
const BD_PORTA = Number(process.env.PGPORT ?? 5433);

console.log('a ligar a Porta à base de eventos…');
const client = new pg.Client({
  host: '127.0.0.1',
  port: BD_PORTA,
  user: 'postgres',
  password: 'delegado',
  database: 'delegado',
});
client.on('error', (err: Error) => {
  console.warn('⚠ aviso na ligação pg da Porta:', err.message);
});

let registoEventos: Registo | undefined;

try {
  await client.connect();
  registoEventos = new Registo(client);
  console.log('✓ base ligada para auditoria da Porta');
} catch {
  console.warn('⚠ base não encontrada em localhost:5433 — a Porta arranca sem emitir eventos');
}

const portaInstancia = await criarServidorPorta({
  registoEventos,
});

portaInstancia.servidor.listen(PORTA_HTTP, () => {
  console.log(`✓ Porta Agêntica MCP disponível em http://localhost:${PORTA_HTTP}/mcp`);
  console.log(`✓ Catálogo carregado com ${portaInstancia.catalogo.total} serviços`);
});

process.once('SIGINT', () => void encerrar());
process.once('SIGTERM', () => void encerrar());

async function encerrar() {
  console.log('\na encerrar a Porta…');
  await portaInstancia.fechar();
  await client.end().catch(() => {});
  process.exit(0);
}
