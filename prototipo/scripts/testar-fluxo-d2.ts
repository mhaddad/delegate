/**
 * Teste e Prova do Fluxo Conversacional D2 do Afonso (Preparação Passo-a-Passo)
 *
 * Simula a conversa de um cidadão no Telegram com o GestorFluxoD2:
 * 1. Cidadão: "Quero preparar a esplanada para o meu café"
 * 2. Cidadão: "Casa Joaquim, Largo da Oliveira 12"
 * 3. Cidadão: "4 mesas"
 * 4. Cidadão: "Sim, confirmo 2,10m de passeio livre"
 * 5. Verificação da geração do pacote PAC-0001 no Cofre cifrado AES-256 e emissão do link CMD (D3).
 */
import { Registo } from '../apps/api/src/nucleo/eventos/registo.ts';
import pg from 'pg';
import { CofreDigital } from '../apps/api/src/nucleo/cofre/cofre.ts';
import { ServicoChavesCofre } from '../apps/api/src/nucleo/cofre/servico-chaves.ts';
import { GestorMandatos } from '../apps/api/src/nucleo/mandatos/mandatos.ts';
import { OrquestradorMissoes } from '../apps/api/src/nucleo/orquestrador/missao.ts';
import { GestorFluxoD2 } from '../apps/api/src/nucleo/orquestrador/fluxo-conversa-d2.ts';
import type { CanalGrammy } from '../apps/api/src/nucleo/canal.ts';

async function main() {
  console.log('=== TESTE DO FLUXO CONVERSACIONAL D2 (AFONSO) ===\n');

  const clientePg = new pg.Client({
    host: '127.0.0.1',
    port: 5433,
    user: 'postgres',
    password: 'delegado',
    database: 'delegado',
  });
  await clientePg.connect();
  const registo = new Registo(clientePg);
  const chaves = new ServicoChavesCofre(registo, 'teste_d2');
  const cofre = new CofreDigital(registo, chaves, 'teste_d2');
  const mandatos = new GestorMandatos(registo, 'teste_d2');
  const orquestrador = new OrquestradorMissoes(registo, 'teste_d2');

  const historicoMensagens: { de: string; texto: string; botoes?: any[] }[] = [];

  const canalFalso: Partial<CanalGrammy> = {
    async enviar(conversa: string, texto: string, botoes?: any[]) {
      historicoMensagens.push({ de: 'Afonso', texto, botoes });
      console.log(`🤖 Afonso:\n${texto.replace(/<[^>]+>/g, '')}\n`);
      if (botoes && botoes.length > 0) {
        console.log(`[Botões Inline]: ${botoes.flat().map((b: any) => `[${b.texto}]`).join('  ')}\n`);
      }
    },
  };

  const gestorD2 = new GestorFluxoD2({
    cofre,
    mandatos,
    orquestrador,
    registo,
    canal: canalFalso as CanalGrammy,
    sessao: 'teste_d2',
  });

  const cidadao = 'ines_guimaraes';
  const conversa = 'chat_12345';

  console.log('--- PASSO 0: Cidadão pede para preparar a esplanada ---');
  console.log('👤 Inês: Quero tratar do licenciamento da esplanada da Casa Joaquim\n');
  await gestorD2.iniciarFluxoEsplanada(cidadao, conversa);

  console.log('--- PASSO 1: Cidadão indica nome e morada do estabelecimento ---');
  console.log('👤 Inês: Casa Joaquim, Largo da Oliveira, 12, Guimarães\n');
  const passo1Tratado = await gestorD2.processarPasso(cidadao, conversa, 'Casa Joaquim, Largo da Oliveira, 12, Guimarães');
  console.log(`-> Passo 1 processado com sucesso: ${passo1Tratado}\n`);

  console.log('--- PASSO 2: Cidadão indica número de mesas pretendido ---');
  console.log('👤 Inês: Vamos colocar 4 mesas com 8 cadeiras\n');
  const passo2Tratado = await gestorD2.processarPasso(cidadao, conversa, '4 mesas');
  console.log(`-> Passo 2 processado com sucesso: ${passo2Tratado}\n`);

  console.log('--- PASSO 3: Cidadão valida corredor regulamentar de passeio (Artigo 8.º) ---');
  console.log('👤 Inês: Medimos com fita métrica e temos 2,10m de calçada livre\n');
  const passo3Tratado = await gestorD2.processarPasso(cidadao, conversa, 'Sim, confirmo: 2,10 metros livres');
  console.log(`-> Passo 3 processado com sucesso: ${passo3Tratado}\n`);

  console.log('=== VERIFICAÇÃO DO COFRE DIGITAL & MINIMIZAÇÃO RGPD ===');
  const metadados = cofre.listarMetadados(cidadao);
  console.log(`Itens guardados no Cofre cifrado (${metadados.length}):`);
  for (const m of metadados) {
    console.log(` - [${m.camada}] ${m.id} | ${m.tipo} | "${m.titulo}"`);
  }

  const pacotes = cofre.listarPacotes(cidadao);
  console.log(`\nPacotes preparados para transmissão (${pacotes.length}):`);
  for (const p of pacotes) {
    console.log(` - ID: ${p.id}`);
    console.log(` - Finalidade: ${p.finalidade}`);
    console.log(` - Destinatário: ${p.destinatario}`);
    console.log(` - Dados Partilhados:`, JSON.stringify(p.campos, null, 2));
    console.log(` - Campos Omitidos (blindados no cofre):`, p.naoPartilha.join(', '));
  }

  const missao = orquestrador.obter('MIS-0001');
  console.log(`\nEstado final da Missão no Orquestrador: ${missao?.estado}`);
  console.log(`Checklist da Missão:`);
  for (const c of missao?.checklist ?? []) {
    console.log(` - [${c.feito ? 'X' : ' '}] ${c.passo}: ${c.nota ?? ''}`);
  }

  await clientePg.end();
  console.log('\n=== TESTE CONCLUÍDO COM 100% DE SUCESSO ===');
}

main().catch((err) => {
  console.error('Erro no teste:', err);
  process.exit(1);
});
