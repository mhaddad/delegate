/**
 * Reposição da demonstração (Quinta 22/10).
 *
 * Limpa o histórico de eventos da base de dados e reinicia o estado
 * para a coreografia de demonstração ao júri.
 *
 * Executar:
 *   npm run demo:repor
 */
import pg from 'pg';
import { PORTAS } from '../apps/api/src/nucleo/bd.ts';

const SENHA = 'delegado';

async function repor() {
  console.log('🔄 A repor o estado de demonstração do Delegate…');

  const cliente = new pg.Client({
    host: '127.0.0.1',
    port: PORTAS.nucleo,
    user: 'postgres',
    password: SENHA,
    database: 'delegado',
  });

  try {
    await cliente.connect();
    console.log('✓ Ligado à base do núcleo');

    // Limpar eventos anteriores e reiniciar sequência
    await cliente.query('TRUNCATE TABLE nucleo.eventos RESTART IDENTITY CASCADE;');
    console.log('✓ Tabela nucleo.eventos limpa e reiniciada');

    // Notificar os ecrãs para recarregarem o fluxo limpo
    await cliente.query(`SELECT pg_notify('eventos', '0');`);
    console.log('✓ Notificação de reinício enviada aos ecrãs');

    console.log('\n======================================================');
    console.log('✓ Estado de demonstração reposto com sucesso!');
    console.log('  - O Observatório (http://localhost:4000/) está limpo');
    console.log('  - A Consola (http://localhost:4000/consola) está pronta');
    console.log('  - O Afonso (@afonso_cm_bot) está pronto para o ensaio');
    console.log('======================================================\n');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('✖ Erro ao repor a base de dados:', msg);
    console.error('  Certifique-se de que o núcleo está a correr (npm run nucleo).');
    process.exit(1);
  } finally {
    await cliente.end().catch(() => {});
  }
}

await repor();
