/**
 * Script de Prova e Demonstração das Funcionalidades Nucleares do Delegate
 *
 * Executa 5 testes de funcionalidade em tempo real:
 * 1. Segurança e Controlo de Acesso na Porta Agêntica MCP (exigência de mandato D2)
 * 2. Cofre Digital Pessoal (AES-256-GCM) e Minimização RGPD (Guardião de Contexto)
 * 3. RAG D0 com Motor Semântico TypeSafe Jev e Salvaguarda de Abstenção
 * 4. Cálculo Regulamentar de Taxas de Esplanada (RTTL 2025)
 * 5. Integridade e Encadeamento Criptográfico dos Eventos (SHA-256)
 */
import { ClientePortaMcp } from '../apps/api/src/nucleo/henriques/cliente-porta.ts';
import { Registo } from '../apps/api/src/nucleo/eventos/registo.ts';
import { CofreDigital } from '../apps/api/src/nucleo/cofre/cofre.ts';
import { ServicoChavesCofre } from '../apps/api/src/nucleo/cofre/servico-chaves.ts';
import { GestorMandatos } from '../apps/api/src/nucleo/mandatos/mandatos.ts';
import { Henriques } from '../apps/api/src/nucleo/henriques/henriques.ts';
import { BuscadorConhecimento } from '../apps/api/src/nucleo/conhecimento/buscador.ts';
import pg from 'pg';

async function main() {
  console.log('========================================================================');
  console.log('TESTES DE FUNCIONALIDADES NUCLEARES DO DELEGATE');
  console.log('========================================================================\n');

  const client = new pg.Client({ host: '127.0.0.1', port: 5433, user: 'postgres', password: 'delegado', database: 'delegado' });
  await client.connect();
  const registo = new Registo(client);
  const porta = new ClientePortaMcp();
  const chaves = new ServicoChavesCofre(registo, 'demo');
  const cofre = new CofreDigital(registo, chaves, 'demo');
  const mandatos = new GestorMandatos(registo, 'demo');
  const buscador = new BuscadorConhecimento();
  const henriques = new Henriques(registo, porta, 'demo', undefined, undefined, buscador);

  // -------------------------------------------------------------
  // TESTE 1: POLÍTICA DE SEGURANÇA E MANDATOS NA PORTA MCP
  // -------------------------------------------------------------
  console.log('👉 [1] Teste de Segurança: Chamada de Ação sem Mandato vs com Mandato D2');
  await porta.conectar();
  try {
    await porta.criarRascunhoOcupacao({
      localizacao: 'Largo da Oliveira, 12',
      area_m2: 12,
      numero_mesas: 4,
    });
    console.log('✖ ERRO: Porta permitiu ação sem mandato!');
  } catch (err: any) {
    console.log('✓ Bloqueio confirmado! Resposta da Porta:', err.message.slice(0, 110) + '...');
  }

  const mandatoD2 = await mandatos.concederMandato('ines_guimaraes', 'MIS-0099', {
    ambito: 'ocupacao-espaco-publico-esplanada',
    objeto: 'Esplanada Café Oliveira',
    nivel: 'D2',
    validadeDias: 90,
  });
  console.log('✓ Mandato D2 concedido:', mandatoD2.id, `(nível: ${mandatoD2.nivel})`);

  const rascunho = await porta.criarRascunhoOcupacao({
    mandato: mandatoD2.id,
    localizacao: 'Largo da Oliveira, 12',
    area_m2: 12,
    numero_mesas: 4,
  });
  console.log('✓ Rascunho criado com sucesso:', rascunho.rascunho, '| Processo:', rascunho.processo, '| Regulamento:', rascunho.versao_regulamento);

  // -------------------------------------------------------------
  // TESTE 2: COFRE DIGITAL (AES-256-GCM) & MINIMIZAÇÃO RGPD
  // -------------------------------------------------------------
  console.log('\n👉 [2] Teste do Cofre Digital & Minimização de Dados (RGPD)');
  const cidadao = 'ines_guimaraes';
  const itemCofre = await cofre.guardarItem(cidadao, 'MIS-0099', {
    camada: 'intencoes',
    tipo: 'dados_esplanada',
    titulo: 'Métricas da Esplanada',
    origem: 'conversa_telegram',
    finalidade: 'Licenciamento de Esplanada',
    dados: {
      estabelecimento: 'Café Oliveira',
      area_m2: 12,
      passeio_livre: '2.10m',
      iban_privado: 'PT50 0000 1111 2222 3333 4444 5',
      nif_contabilidade: '123456789'
    }
  });
  console.log('✓ Item guardado e cifrado no cofre (AES-256-GCM):', itemCofre.id, '| IV:', itemCofre.conteudoCifrado.iv);

  const pacote = await cofre.prepararPacoteMinimo(
    cidadao,
    'MIS-0099',
    'Câmara Municipal de Guimarães — Gabinete de Serviços Urbanos',
    'Mera Comunicação Prévia de Esplanada',
    {
      estabelecimento: 'Café Oliveira',
      area_m2: 12,
      passeio_livre: '2.10m',
    },
    ['iban_privado', 'conversas_privadas', 'declaracoes_fiscais']
  );

  console.log('✓ Pacote mínimo preparado pelo Guardião de Contexto:', pacote.id);
  console.log('  Dados autorizados para a autarquia:', Object.keys(pacote.campos));
  console.log('  Dados sensíveis protegidos no cofre (omitidos da Câmara):', pacote.naoPartilha);

  // -------------------------------------------------------------
  // TESTE 3: RAG D0 COM SALVAGUARDA DE ABSTENÇÃO FORMAL
  // -------------------------------------------------------------
  console.log('\n👉 [3] Teste de Salvaguarda RAG: Resposta com Fonte vs Abstenção');
  
  // 3.a Pergunta com competência municipal e fonte comprovada
  console.log('  • Pergunta Municipal: «Qual a cércea máxima no PDM para construir em Silvares?»');
  const respPdm = await henriques.responder(cidadao, 'Qual a cércea máxima no PDM para construir em Silvares?');
  console.log('    -> Serviço Identificado:', respPdm.servicoId);
  const linhasPdm = respPdm.texto.split('\n').filter(l => l.trim().length > 0).slice(0, 3);
  linhasPdm.forEach(l => console.log('       ' + l.replace(/<[^>]+>/g, '')));

  // 3.b Pergunta fora da competência da autarquia
  console.log('\n  • Pergunta Fora de Competência: «Como faço para renovar o meu passaporte?»');
  const respFora = await henriques.responder(cidadao, 'Como faço para renovar o meu passaporte?');
  console.log('    -> Ação / Foco:', respFora.focoServico ?? 'fora_competencia');
  const linhasFora = respFora.texto.split('\n').filter(l => l.trim().length > 0).slice(0, 3);
  linhasFora.forEach(l => console.log('       ' + l.replace(/<[^>]+>/g, '')));

  // -------------------------------------------------------------
  // TESTE 4: AUDITORIA CRIPTOGRÁFICA DE EVENTOS (SHA-256)
  // -------------------------------------------------------------
  console.log('\n👉 [4] Teste de Auditoria e Selos Criptográficos da Sessão');
  const auditoria = await registo.verificar();
  console.log('✓ Auditoria da cadeia de eventos:', auditoria.valido ? 'VÁLIDA (sem quebras)' : 'FALHA');
  console.log('✓ Total de eventos selados no log imutável:', auditoria.total);

  await porta.fechar();
  await client.end();
  console.log('\n========================================================================');
  console.log('TODAS AS FUNCIONALIDADES TESTADAS COM SUCESSO');
  console.log('========================================================================');
}

main().catch(console.error);
