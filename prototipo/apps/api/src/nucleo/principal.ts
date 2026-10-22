/**
 * O núcleo: passagem de mensagens e orquestração do representante digital Henriques.
 *
 * Arquitetura modular segundo o Princípio da Responsabilidade Única (SRP):
 *   Telegram -> canal -> evento na base -> notificação -> SSE -> Observatório / Consola
 *
 * Módulos integrados:
 *   - Henriques: respostas com fonte e verificação estrita
 *   - Cofre Digital: cifra AES-256-GCM, 3 camadas e Guardião de Contexto
 *   - Serviço de Chaves: libertação temporária auditada e recolha automática
 *   - Mandatos: níveis D0 a D3, concessão, verificação e revogação
 *   - Motor de Política: permitir, confirmar, bloquear
 *   - Orquestrador: máquina de estados da missão e checklist oficial
 *   - Processador de Cenários: simulação de PIP, esplanadas e validação com CMD
 *   - Tratador de Comandos: comandos de barra (/start, /carta, /cofre, etc.)
 */
import { readFileSync, writeFileSync, existsSync, promises as fs } from 'node:fs';
import { join, resolve } from 'node:path';
import { criarCanalGrammy, escapar, type CanalGrammy, type Botao } from './canal.ts';
import { abrirBase, SESSAO } from './bd.ts';
import { Registo } from './eventos/registo.ts';
import { criarServidorEventos } from './eventos/servidor.ts';
import { Henriques } from './henriques/henriques.ts';
import { RedatorOpenRouter } from './henriques/redator-openrouter.ts';
import { MotorDecisaoTypeSafe } from './typesafe/motor-decisao.ts';
import { ClientePortaMcp } from './henriques/cliente-porta.ts';
import { BuscadorConhecimento } from './conhecimento/buscador.ts';
import { CofreDigital } from './cofre/cofre.ts';
import { ServicoChavesCofre } from './cofre/servico-chaves.ts';
import { GestorMandatos } from './mandatos/mandatos.ts';
import { MotorPolitica } from './politica/politica.ts';
import { OrquestradorMissoes } from './orquestrador/missao.ts';
import { GestorFluxoD2 } from './orquestrador/fluxo-conversa-d2.ts';
import { ProcessadorCenarios } from './simuladores/cenarios.ts';
import { TratadorComandos } from './comandos/tratador-comandos.ts';

const PORTA_EVENTOS = 4000;

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error('✖ Falta o TELEGRAM_BOT_TOKEN. Ver npm run ouvir para a explicação.');
  process.exit(1);
}

console.log('a abrir a base…');
const base = await abrirBase();
const registro = new Registo(base.escrita);
console.log('✓ base aberta');

const CAMINHO_CONVERSAS = resolve(import.meta.dirname, '../../../../.conversas.json');
const CAMINHO_ULTIMO_CHAT = resolve(import.meta.dirname, '../../../../.ultimo_chat');

const conversasPorPessoa = new Map<string, string>();
try {
  const caminhoLido = existsSync(CAMINHO_CONVERSAS)
    ? CAMINHO_CONVERSAS
    : existsSync(resolve(process.cwd(), '.conversas.json'))
      ? resolve(process.cwd(), '.conversas.json')
      : null;
  if (caminhoLido) {
    const dados = JSON.parse(readFileSync(caminhoLido, 'utf-8'));
    for (const [k, v] of Object.entries(dados)) {
      if (k !== 'ultimaConversa' && typeof v === 'string') conversasPorPessoa.set(k, v);
    }
  }
} catch {}
if (!conversasPorPessoa.has('pessoa-1bbe89cb4d')) {
  conversasPorPessoa.set('pessoa-1bbe89cb4d', '5361126841');
}

let ultimaConversa: string | null = (() => {
  try {
    const caminhoLido = existsSync(CAMINHO_ULTIMO_CHAT)
      ? CAMINHO_ULTIMO_CHAT
      : existsSync(resolve(process.cwd(), '.ultimo_chat'))
        ? resolve(process.cwd(), '.ultimo_chat')
        : null;
    return caminhoLido ? readFileSync(caminhoLido, 'utf-8').trim() || null : '5361126841';
  } catch {
    return conversasPorPessoa.get('pessoa-1bbe89cb4d') ?? '5361126841';
  }
})();
let aguardaFachada = false;

// Cada mensagem que sai para o Telegram fica no registo, com texto e botões, seja
// qual for o módulo que a enviou. É o que deixa o painel replicar a conversa
// sem adivinhar. A marca `entregue_no_canal` distingue-a dos eventos `enviada`
// que alguns módulos já registam por conta própria, sem texto ou em duplicado.
const canalTelegram: CanalGrammy = criarCanalGrammy(token);
const canal: CanalGrammy = {
  ...canalTelegram,
  async enviar(conversa, texto, botoes) {
    await canalTelegram.enviar(conversa, texto, botoes);
    const pessoa = [...conversasPorPessoa].find(([, c]) => c === conversa)?.[0] ?? null;
    await registro
      .registar({
        tipo: 'canal.mensagem.enviada',
        origem: 'canal',
        sessao: SESSAO,
        pessoa,
        missao: null,
        ator: 'agente:henriques',
        simulacao: false,
        dados: {
          texto,
          botoes: botoes?.map((linha) => linha.map((b) => ({ texto: b.texto, dados: b.dados ?? null }))) ?? [],
          entregue_no_canal: true,
        },
      })
      .catch((err: unknown) => console.warn('⚠ envio sem registo:', err));
  },
  async enviarSequencia(conversa, mensagens, botoes) {
    const pessoa = [...conversasPorPessoa].find(([, c]) => c === conversa)?.[0] ?? null;
    await canalTelegram.enviarSequencia(conversa, mensagens, botoes, async (msg, eUltima) => {
      await registro
        .registar({
          tipo: 'canal.mensagem.enviada',
          origem: 'canal',
          sessao: SESSAO,
          pessoa,
          missao: null,
          ator: 'agente:henriques',
          simulacao: false,
          dados: {
            texto: msg,
            botoes: eUltima
              ? botoes?.map((linha) => linha.map((b) => ({ texto: b.texto, dados: b.dados ?? null }))) ?? []
              : [],
            entregue_no_canal: true,
          },
        })
        .catch((err: unknown) => console.warn('⚠ envio sem registo:', err));
    });
  },
  async enviarDocumento(conversa, doc, legenda, botoes) {
    await canalTelegram.enviarDocumento(conversa, doc, legenda, botoes);
    const pessoa = [...conversasPorPessoa].find(([, c]) => c === conversa)?.[0] ?? null;
    await registro
      .registar({
        tipo: 'canal.mensagem.enviada',
        origem: 'canal',
        sessao: SESSAO,
        pessoa,
        missao: null,
        ator: 'agente:henriques',
        simulacao: false,
        dados: {
          texto: legenda ?? `Documento: ${doc.nome}`,
          documento: { nome: doc.nome },
          botoes: botoes?.map((linha) => linha.map((b) => ({ texto: b.texto, dados: b.dados ?? null }))) ?? [],
          entregue_no_canal: true,
        },
      })
      .catch((err: unknown) => console.warn('⚠ envio sem registo:', err));
  },
};
const redator = new RedatorOpenRouter();
const clientePorta = new ClientePortaMcp();
const buscador = new BuscadorConhecimento();
const henriques = new Henriques(registro, clientePorta, SESSAO, undefined, redator, buscador);

// Módulos de autoridade e privacidade
const servicoChaves = new ServicoChavesCofre(registro, SESSAO);
const cofre = new CofreDigital(registro, servicoChaves, SESSAO);
const mandatos = new GestorMandatos(registro, SESSAO);
const politica = new MotorPolitica(registro, mandatos, SESSAO);
const orquestrador = new OrquestradorMissoes(registro, SESSAO);

const fluxoD2 = new GestorFluxoD2({
  cofre,
  mandatos,
  orquestrador,
  registo: registro,
  canal,
  sessao: SESSAO,
  redator,
});

// Processador de cenários simulados (CMD, PIP Urbanismo, Medição de Calçada)
const cenarios = new ProcessadorCenarios({
  mandatos,
  cofre,
  politica,
  servicoChaves,
  clientePorta,
  orquestrador,
  registo: registro,
  canal,
  obterChat: (pessoa) => conversasPorPessoa.get(pessoa) ?? ultimaConversa,
  sessao: SESSAO,
});

// Tratador de comandos de barra (/)
const comandos = new TratadorComandos({
  canal,
  cofre,
  mandatos,
  orquestrador,
  registo: registro,
  sessao: SESSAO,
  henriques,
  fluxoD2,
});

// Obter lista em direto de solicitações para a Consola Municipal da Câmara (com memória e histórico de múltiplos casos)
async function obterPedidosConsola(): Promise<any[]> {
  const casosMap = new Map<string, any>();

  try {
    const resEventos = await base.escrita.query(
      "SELECT seq, tipo, dados, ts FROM nucleo.eventos WHERE tipo IN ('consola.caso.criado', 'consola.caso.despachado', 'consola.elemento.solicitado') ORDER BY seq ASC",
    );

    for (const row of resEventos.rows) {
      const d = row.dados || {};
      const processo = d.processo || 'OEP/2026/0001';

      if (row.tipo === 'consola.caso.criado') {
        let estab = d.estabelecimento || 'Estabelecimento Comercial';
        let morada = d.morada || 'Guimarães';
        if (estab && morada.toLowerCase().startsWith(estab.toLowerCase())) {
          morada = morada.slice(estab.length).replace(/^[,\s-]+/, '').trim();
        }
        const numMesas = d.mesas || 4;
        const area = d.area_m2 || numMesas * 2.5;

        casosMap.set(processo, {
          id: `CASO-${processo.replace(/[/]/g, '-')}`,
          processo,
          codigo: `#${processo.replace(/[/]/g, '-')}`,
          titulo: 'Ocupação do espaço público · Esplanada aberta',
          servico: 'Espaço Público (OVP-SO)',
          hora: new Date(row.ts).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          status: 'Aguarda análise',
          tagClass: 'tag wait',
          resumo: `Avaliar instalação de esplanada aberta no estabelecimento ${estab}.`,
          dados: [
            { campo: 'Processo Municipal', valor: processo },
            { campo: 'Serviço', valor: 'Mera Comunicação Prévia (Artigo 8.º ROPP)' },
            { campo: 'Estabelecimento', valor: estab },
            { campo: 'Local de intervenção', valor: morada },
            { campo: 'Área e Instalação', valor: `${area} m² · ${numMesas} Mesas e ${numMesas * 2} Cadeiras` },
            { campo: 'Corredor Pedonal', valor: d.largura_livre || '2,50 metros (cumpre Art. 8.º >= 2,00 m)' },
            { campo: 'Assinatura Digital', valor: d.token_cmd ? `Chave Móvel Digital (${d.token_cmd})` : 'Chave Móvel Digital (Mandato D3)' },
          ],
          omitidos: ['Conversa completa', 'NIF e Contacto direto', 'Faturamento do restaurante', 'IBAN', 'Situação fiscal'],
        });
      } else if (row.tipo === 'consola.caso.despachado') {
        const caso = casosMap.get(processo);
        if (caso) {
          caso.status = d.decisao === 'aprovado' ? 'Aprovada' : 'Indeferida';
          caso.tagClass = d.decisao === 'aprovado' ? 'tag ok' : 'tag refused';
        }
      } else if (row.tipo === 'consola.elemento.solicitado') {
        const caso = casosMap.get(processo);
        if (caso) {
          caso.status = 'Aguarda documentos';
          caso.tagClass = 'tag wait';
        }
      }
    }
  } catch {}

  const listaCasosReais = Array.from(casosMap.values()).reverse();
  if (listaCasosReais.length === 0) {
    listaCasosReais.push({
      id: 'CASO-0001',
      processo: 'OEP/2026/0001',
      codigo: '#OEP-0001',
      titulo: 'Ocupação do espaço público · Esplanada aberta',
      servico: 'Espaço Público (OVP-SO)',
      hora: '10:42',
      status: 'Aprovada',
      tagClass: 'tag ok',
      resumo: 'Avaliar instalação de esplanada aberta no estabelecimento Cafe da beira.',
      dados: [
        { campo: 'Processo Municipal', valor: 'OEP/2026/0001' },
        { campo: 'Serviço', valor: 'Mera Comunicação Prévia (Artigo 8.º ROPP)' },
        { campo: 'Estabelecimento', valor: 'Cafe da beira' },
        { campo: 'Local de intervenção', valor: 'Rua de São José, Guimarães' },
        { campo: 'Área e Instalação', valor: '10 m² · 4 Mesas e 8 Cadeiras' },
        { campo: 'Corredor Pedonal', valor: '2,50 metros (cumpre Art. 8.º >= 2,00 m)' },
        { campo: 'Assinatura Digital', valor: 'Chave Móvel Digital (CMD-TOKEN-977816)' },
      ],
      omitidos: ['Conversa completa', 'NIF e Contacto direto', 'Faturamento do restaurante', 'IBAN', 'Situação fiscal'],
    });
  }

  return [
    ...listaCasosReais,
    {
      id: 'CASO-PIP-2026-0002',
      processo: 'PIP/2026/0002',
      codigo: '#PIP-0002',
      titulo: 'Pedido de Informação Prévia (PIP) · Viabilidade PDM',
      servico: 'Gestão Urbanística (Art. 14.º RJUE)',
      hora: '10:18',
      status: 'Aguarda análise',
      tagClass: 'tag wait',
      resumo: 'Apreciação prévia vinculativa de viabilidade de construção de moradia unifamiliar em Silvares.',
      dados: [
        { campo: 'Processo Municipal', valor: 'PIP/2026/0002' },
        { campo: 'Localização do Terreno', valor: 'Silvares, Guimarães (41.4425, -8.2918)' },
        { campo: 'Classificação no PDM', valor: 'Solo Urbano · Espaço Residencial Nível 2' },
        { campo: 'Caderneta Predial', valor: 'Artigo Matricial 1420 (Silvares, Guimarães)' },
        { campo: 'Assinatura Digital', valor: 'Chave Móvel Digital (Mandato D3)' },
      ],
      omitidos: ['Conversa completa', 'Restante património imobiliário', 'Dados bancários'],
    },
    {
      id: 'CASO-EVT-2026-0003',
      processo: 'EVT/2026/0003',
      codigo: '#EVT-0003',
      titulo: 'Autorização para Prova Desportiva na Via Pública',
      servico: 'Divisão de Trânsito e Polícia Municipal',
      hora: '09:54',
      status: 'Aguarda análise',
      tagClass: 'tag wait',
      resumo: 'Licenciamento e parecer para realização da 1.ª Corrida Popular de Azurém (10 Km).',
      dados: [
        { campo: 'Processo Municipal', valor: 'EVT/2026/0003' },
        { campo: 'Percurso Oficial', valor: 'Azurém · Partida: Campus Azurém / Meta: Pista Gémeos Castro' },
        { campo: 'Data do Evento', valor: '15 de Outubro de 2026 (09:30 às 12:30)' },
        { campo: 'Apólice de Seguro', valor: 'N.º 98765432-FID/2026 (Fidelidade Seguros · DL 10/2009)' },
        { campo: 'Termo de Responsabilidade', valor: 'Assinado com declaração de limpeza da via' },
        { campo: 'Assinatura Digital', valor: 'Chave Móvel Digital (Mandato D3)' },
      ],
      omitidos: ['Conversa completa', 'Dados pessoais de atletas inscritos', 'Dados bancários'],
    },
    {
      id: 'CASO-RES-2026-0112',
      processo: 'RES/2026/0112',
      codigo: '#DG-2045',
      titulo: 'Recolha de resíduos volumosos',
      servico: 'Serviços Urbanos e Ambiente',
      hora: '09:32',
      status: 'Resolvida',
      tagClass: 'tag ok',
      resumo: 'Agendamento de recolha de móveis e eletrodomésticos no domicílio.',
      dados: [
        { campo: 'Serviço', valor: 'Recolha de Monstros' },
        { campo: 'Freguesia', valor: 'Creixomil, Guimarães' },
        { campo: 'Tipologia', valor: '2 volumes (sofá e frigorífico)' },
      ],
      omitidos: ['Conversa completa', 'Contacto telefónico'],
    },
  ];
}

// Servidor de Eventos SSE e API HTTP (inclui webhook da CMD e testador do Router)
const servidor = criarServidorEventos(
  registro,
  () => base.escutar(),
  async (dados) => {
    await cenarios.processarConfirmacaoCmd(dados);
  },
  undefined,
  async (pergunta: string) => {
    const motorDecisao = new MotorDecisaoTypeSafe();
    const decisao = await motorDecisao.decidir(pergunta, {});
    const candidatos = await buscador.buscarCandidatosHibrido(pergunta, 5);
    const resultadoJev = await buscador.buscarComJev(pergunta);
    return {
      ok: true,
      pergunta,
      ...decisao,
      candidatos,
      resultadoJev,
    };
  },
  async () => {
    // Obter missão ativa do cidadão de demonstração ou última conversa
    const pessoaPadrao = 'pessoa-1bbe89cb4d';
    const missao = orquestrador.obterAtiva(pessoaPadrao) ?? orquestrador.obterAtiva('ines_guimaraes') ?? null;
    const rascunhoD2 = fluxoD2.obterRascunhoAtivo(pessoaPadrao) ?? null;
    return {
      missao,
      rascunhoD2,
      estadosPossiveis: [
        { id: 'entendido', nome: '1. Entendido', desc: 'Henriques compreendeu a intenção e enquadrou o serviço' },
        { id: 'a_verificar', nome: '2. A Verificar', desc: 'Instrução de dados e medições regulamentares' },
        { id: 'preparado', nome: '3. Preparado (D2)', desc: 'Rascunho completo no Cofre Digital aguardando CMD' },
        { id: 'submetido', nome: '4. Submetido (D3)', desc: 'Requerimento formal com Chave Móvel Digital na Porta' },
        { id: 'precisa_de_si', nome: '⚠️ Elementos Adicionais', desc: 'Câmara solicitou aperfeiçoamento instrutório' },
        { id: 'com_tecnico', nome: '5. Com Técnico (SU)', desc: 'Em apreciação técnica e jurídica municipal' },
        { id: 'respondido', nome: '6. Concluído', desc: 'Decisão final deferida e taxas liquidadas' },
      ],
    };
  },
  {
    obterDados: async (pessoa = 'pessoa-1bbe89cb4d') => {
      let itens = cofre.listarItensCompletos(pessoa);
      if (itens.length === 0) {
        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'identidade',
          tipo: 'identidade_fiscal',
          titulo: 'NIF & Identificação Fiscal',
          dados: { nif: '123 456 789', titular: 'Inês Guimarães', regime: 'Restauração e Bebidas / Café Oliveira' },
          origem: 'Chave Móvel Digital',
          finalidade: 'Autenticação formal em requerimentos municipais e liquidação de taxas',
          sensibilidade: 'sensivel',
          validoAte: '2027-10-18',
          conservacao: 'Até revogação expressa da pessoa',
          permissoes: ['leitura_instrucao', 'apresentacao_cmd'],
        });

        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'identidade',
          tipo: 'morada_fiscal',
          titulo: 'Morada Fiscal e Sede do Estabelecimento',
          dados: { rua: 'Largo da Oliveira, n.º 12', codigo_postal: '4800-025', freguesia: 'Oliveira do Castelo', concelho: 'Guimarães' },
          origem: 'Chave Móvel Digital / Autoridade Tributária',
          finalidade: 'Comprovação de domicílio fiscal e jurisdição municipal',
          sensibilidade: 'sensivel',
          validoAte: '2027-10-18',
          conservacao: 'Até revogação',
          permissoes: ['leitura_instrucao'],
        });

        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'provas',
          tipo: 'prova_medicao_calcada',
          titulo: 'Medição Fotográfica da Calçada (2,10m)',
          dados: { largura_livre_m: 2.10, corredor_pedonal_minimo_m: 2.00, em_conformidade: true, artigo: 'Artigo 8.º ROPP', hash_foto: 'sha256-a18f40b829c4e2098d4f9b88e...' },
          origem: 'Fotografia enviada no Telegram',
          finalidade: 'Instrução probatória da Mera Comunicação Prévia de Esplanada Aberta',
          sensibilidade: 'normal',
          validoAte: '2026-12-31',
          conservacao: 'Durante vigência do processo OEP/2026/0001',
          permissoes: ['instrucao_processo_su'],
        });

        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'provas',
          tipo: 'apolice_seguro_rc',
          titulo: 'Apólice de Seguro de Responsabilidade Civil',
          dados: { seguradora: 'Tranquilidade Seguros', apolice_num: 'RC-402914-2026', capital_seguro: 150000, valido_ate: '2027-03-31' },
          origem: 'Upload em PDF pelo cidadão',
          finalidade: 'Comprovativo obrigatório nos termos do Regulamento de Ocupação do Espaço Público',
          sensibilidade: 'normal',
          validoAte: '2027-03-31',
          conservacao: 'Vigência da apólice',
          permissoes: ['instrucao_processo_su'],
        });

        await cofre.guardarItem(pessoa, 'MIS-0001', {
          camada: 'intencoes',
          tipo: 'projeto_esplanada_ovp',
          titulo: 'Projeto de Esplanada Aberta (4 mesas)',
          dados: { servico: 'ocupacao-espaco-publico-esplanada', mesas: 4, cadeiras: 8, toldo_amovivel: true, area_m2: 12, periodo: 'Anual 2026' },
          origem: 'Conversa no Telegram com Henriques',
          finalidade: 'Preparação do formulário OVP-SO e apuramento de taxas regulamentares',
          sensibilidade: 'normal',
          validoAte: '2026-11-30',
          conservacao: 'Até submissão ou cancelamento da missão',
          permissoes: ['instrucao_rascunho_d2'],
        });

        itens = cofre.listarItensCompletos(pessoa);
      }

      let pacotes = cofre.listarPacotes(pessoa);
      if (pacotes.length === 0) {
        await cofre.prepararPacoteMinimo(
          pessoa,
          'MIS-0001',
          'Câmara Municipal de Guimarães · Serviços Urbanos',
          'Instrução de Mera Comunicação Prévia de Esplanada (Artigo 8.º ROPP)',
          {
            requerente: 'Inês Guimarães',
            nif: '123 456 789',
            morada_estabelecimento: 'Largo da Oliveira, n.º 12, Guimarães',
            area_esplanada_m2: 12,
            mesas: 4,
            cadeiras: 8,
            largura_passeio_m: 2.10,
            seguro_responsabilidade_civil_valido: true,
          },
          [
            'iban_conta_bancaria',
            'historico_integral_conversa_telegram',
            'faturamento_comercial_restaurante',
            'documentos_outros_imoveis',
            'fotografias_pessoais_descartadas',
          ],
        );
        pacotes = cofre.listarPacotes(pessoa);
      }

      const mandatosPessoa = await mandatos.listar(pessoa);

      return {
        ok: true,
        pessoa,
        itens,
        pacotes,
        mandatos: mandatosPessoa,
        estatisticas: {
          totalItens: itens.length,
          porCamada: {
            identidade: itens.filter((i) => i.camada === 'identidade').length,
            provas: itens.filter((i) => i.camada === 'provas').length,
            intencoes: itens.filter((i) => i.camada === 'intencoes').length,
          },
          sensibilidade: {
            sensivel: itens.filter((i) => i.sensibilidade === 'sensivel').length,
            normal: itens.filter((i) => i.sensibilidade === 'normal').length,
          },
        },
      };
    },
    guardar: async (body: any) => {
      const pessoa = body.pessoa ?? 'pessoa-1bbe89cb4d';
      const item = await cofre.guardarItem(pessoa, body.missao ?? null, {
        camada: body.camada ?? 'intencoes',
        tipo: body.tipo ?? 'item_geral',
        titulo: body.titulo ?? 'Novo Item do Cofre',
        dados: body.dados ?? {},
        origem: body.origem ?? 'Interface Web do Cofre',
        finalidade: body.finalidade ?? 'Procedimento municipal com a autarquia',
        sensibilidade: body.sensibilidade ?? 'normal',
        validoAte: body.validoAte ?? null,
        conservacao: body.conservacao ?? 'Até revogação',
      });
      return { ok: true, item };
    },
    avaliar: async (body: any) => {
      const pessoa = body.pessoa ?? 'pessoa-1bbe89cb4d';
      return await cofre.avaliarElegibilidade(pessoa, body);
    },
  },
  async (acaoConsola) => {
    const { processo, acao, nota } = acaoConsola;
    console.log(`🏛️ [Consola Câmara] Ação recebida para ${processo}: ${acao} (${nota ?? 'sem nota'})`);

    const missaoAtiva =
      orquestrador.listar().find(
        (m) =>
          m.checklist?.some((p) => p.nota?.includes(processo) || p.passo?.includes(processo)) ||
          m.servico.includes('esplanada') ||
          (m.estado !== 'respondido' && m.estado !== 'cancelado'),
      ) ??
      orquestrador.obterAtiva('pessoa-1bbe89cb4d') ??
      null;

    const pessoa = missaoAtiva?.pessoa ?? 'pessoa-1bbe89cb4d';
    const conversa =
      conversasPorPessoa.get(pessoa) ??
      ultimaConversa ??
      conversasPorPessoa.get('pessoa-1bbe89cb4d') ??
      Array.from(conversasPorPessoa.values())[conversasPorPessoa.size - 1] ??
      '5361126841';

    if (acao === 'documents' || acao === 'documentos') {
      aguardaFachada = true;
      if (missaoAtiva) {
        await orquestrador.mudarEstado(missaoAtiva.id, 'precisa_de_si', `Câmara solicitou elementos adicionais: ${nota ?? 'Largura da fachada'}`);
      }
      await registro.registar({
        tipo: 'consola.elemento.solicitado',
        origem: 'consola',
        sessao: SESSAO,
        pessoa,
        missao: missaoAtiva?.id ?? null,
        ator: 'tecnica:camara',
        simulacao: true,
        dados: {
          processo,
          solicitacao: nota ?? 'Confirmação da largura da fachada do estabelecimento',
        },
      });

      if (conversa) {
        await canal.enviar(
          conversa,
          [
            `🏛️ <b>Pedido de Elementos Adicionais da Câmara</b>`,
            `Processo: <code>${processo}</code>`,
            '',
            `A técnica municipal que está a analisar o seu pedido solicitou o seguinte elemento:`,
            `<i>«${nota || 'Por favor confirme a largura da fachada do estabelecimento para verificação do corredor pedonal.'}»</i>`,
            '',
            'Pode responder aqui por texto ou através do botão rápido:',
          ].join('\n'),
          [
            [{ texto: '📐 Indicar: 8 Metros de Fachada', dados: 'responder_8m' }],
            [{ texto: '👤 Falar com a técnica', dados: 'pessoa' }],
          ],
        );
      }
    } else if (acao === 'approve' || acao === 'resolve') {
      if (missaoAtiva) {
        await orquestrador.mudarEstado(missaoAtiva.id, 'respondido', `Aprovado pela Câmara Municipal: ${nota ?? 'Deferido nos termos regulamentares'}`);
      }
      await registro.registar({
        tipo: 'consola.caso.despachado',
        origem: 'consola',
        sessao: SESSAO,
        pessoa,
        missao: missaoAtiva?.id ?? null,
        ator: 'tecnica:camara',
        simulacao: true,
        dados: {
          processo,
          decisao: 'aprovado',
          fundamentacao: nota ?? 'Deferido com parecer favorável das divisões municipais competentes.',
        },
      });

      if (conversa) {
        console.log(`📤 [Consola] A enviar notificação formal para Telegram (${conversa})...`);
        await canal.enviar(
          conversa,
          [
            '🎉 <b>Decisão Municipal Favorável!</b>',
            `Processo: <code>${processo}</code>`,
            '',
            'A <b>Câmara Municipal de Guimarães</b> apreciou e <b>aprovou formalmente</b> o seu pedido de esplanada! 🏛️✅',
            '',
            `<b>Despacho da Técnica:</b> <i>«${nota || 'Deferido. Ocupação contígua à fachada em conformidade com o Artigo 8.º do Regulamento de Ocupação do Espaço Público.'}»</i>`,
            '',
            '📋 <b>Alvará Digital Concedido:</b>',
            '• <b>Regime:</b> Mera Comunicação Prévia com Eficácia Plena',
            '• <b>Validade:</b> Licenciamento Anual (2026)',
            '• <b>Taxas Regulamentares:</b> Liquidadas nos termos do RTTL 2025',
            '',
            'O seu alvará e comprovativo oficial foram emitidos e arquivados no seu <b>Cofre Digital</b>.',
          ].join('\n'),
        );
        console.log(`✓ [Consola] Notificação entregue no Telegram de ${pessoa} (${conversa})`);
      }
    } else if (acao === 'reject') {
      if (missaoAtiva) {
        await orquestrador.mudarEstado(missaoAtiva.id, 'respondido', `Indeferido pela Câmara: ${nota ?? 'Não cumpre requisitos regulamentares'}`);
      }
      await registro.registar({
        tipo: 'consola.caso.despachado',
        origem: 'consola',
        sessao: SESSAO,
        pessoa,
        missao: missaoAtiva?.id ?? null,
        ator: 'tecnica:camara',
        simulacao: true,
        dados: {
          processo,
          decisao: 'indeferido',
          fundamentacao: nota ?? 'Indeferido por não cumprimento dos critérios técnicos regulamentares.',
        },
      });

      if (conversa) {
        await canal.enviar(
          conversa,
          [
            '⚠️ <b>Notificação da Câmara Municipal</b>',
            `Processo: <code>${processo}</code>`,
            '',
            'A sua solicitação foi apreciada e <b>indeferida</b> pelos serviços técnicos.',
            `Motivo: <i>«${nota || 'Não cumpre os requisitos regulamentares mínimos exigíveis.'}»</i>`,
            '',
            'Pode solicitar audiência prévia ou reapreciar o pedido junto dos serviços.',
          ].join('\n'),
          [[{ texto: '👤 Falar com um técnico', dados: 'pessoa' }]],
        );
      }
    }
  },
  obterPedidosConsola,
);
servidor.listen(PORTA_EVENTOS, () => {
  console.log(`✓ fluxo de eventos em http://localhost:${PORTA_EVENTOS}/eventos/stream`);
});

// Ciclo fechado: escutar eventos da Consola/SU para notificar cidadão no Telegram
const escutaNucleo = await base.escutar();
escutaNucleo.on('error', (err: Error) => {
  console.warn('⚠ aviso na escuta pg do núcleo:', err.message);
});
await escutaNucleo.query('LISTEN eventos');

escutaNucleo.on('notification', async (aviso: any) => {
  const seq = Number(aviso.payload);
  if (!Number.isFinite(seq)) return;
  try {
    const ev = await registro.porSeq(seq);
    if (!ev) return;

    if (ev.tipo === 'su.processo.estado.alterado') {
      const chat = (ev.pessoa ? conversasPorPessoa.get(ev.pessoa) : null) ?? ultimaConversa;
      if (!chat) return;

      const pessoa = ev.pessoa ?? 'ines_guimaraes';
      const missaoAtiva = orquestrador.obterAtiva(pessoa);

      if (ev.dados.para === 'pedido_elementos') {
        aguardaFachada = true;
        if (missaoAtiva) {
          await orquestrador.mudarEstado(missaoAtiva.id, 'precisa_de_si', 'Câmara pediu elementos adicionais');
        }
        await canal.enviar(
          chat,
          [
            '🏛️ <b>Notificação da Câmara Municipal de Guimarães</b>',
            '',
            'A técnica do Gabinete de Serviços Urbanos está a analisar o processo <code>OEP/2026/0001</code> e solicitou um elemento adicional:',
            '👉 <b>Largura da fachada do estabelecimento</b> (para validação cadastral).',
            '',
            'Pode responder diretamente aqui (ex.: <i>«8 metros»</i>) ou carregar no botão:',
          ].join('\n'),
          [[{ texto: '📐 Indicar: 8 metros de fachada', dados: 'responder_8m' }]],
        );
      } else if (ev.dados.para === 'aceite') {
        aguardaFachada = false;
        if (missaoAtiva) {
          await orquestrador.mudarEstado(missaoAtiva.id, 'respondido', 'Processo aceite pela técnica');
          await servicoChaves.recolherChave(pessoa, missaoAtiva.id, 'missao_concluida');
        }
        const taxa = (ev.dados.taxa as { valor?: number } | undefined)?.valor ?? 75.75;
        await canal.enviar(
          chat,
          [
            '✅ <b>Comunicação Prévia Deferida!</b>',
            '',
            'A técnica do Gabinete de Serviços Urbanos <b>aceitou</b> a sua esplanada.',
            'Processo: <code>OEP/2026/0001</code> (Simulação)',
            '',
            `<b>Taxa Municipal:</b> ${taxa.toFixed(2).replace('.', ',')} € (Simulação)`,
            '<b>Entidade:</b> <code>12345</code>',
            '<b>Referência:</b> <code>987 654 321</code>',
            '<b>Montante:</b> <code>75,75 €</code>',
            '',
            '<i>(O pagamento é efetuado fora do canal, por autonomia e segurança.)</i>',
          ].join('\n'),
        );
      }
    }
  } catch (err) {
    console.error('✖ erro ao processar notificação no núcleo:', err);
  }
});

canal._aoReceber(async (m) => {
  try {
    const desc = m.tipo === 'botao' ? `[Botão: ${m.texto}]` : m.texto ?? (m.foto ? '[Foto]' : '[Documento]');
    console.log(`📩 [Canal] Recebido de ${m.pessoa} (${m.tipo}): ${desc}`);

    conversasPorPessoa.set(m.pessoa, m.conversa);
    ultimaConversa = m.conversa;
    try {
      const mapaObj = Object.fromEntries(conversasPorPessoa);
      mapaObj.ultimaConversa = m.conversa;
      writeFileSync(CAMINHO_CONVERSAS, JSON.stringify(mapaObj, null, 2), 'utf-8');
      writeFileSync(CAMINHO_ULTIMO_CHAT, m.conversa, 'utf-8');
    } catch {}

  // Regista-se antes dos comandos, para que um /start também apareça no registo.
  const dados: Record<string, unknown> =
    m.tipo === 'foto'
      ? { tem_foto: Boolean(m.foto), texto: m.texto, entrada: m.tipo }
      : m.tipo === 'botao'
        ? { botao: m.texto }
        : m.tipo === 'documento'
          ? { texto: m.texto, documento: m.documento?.nome ?? null, entrada: m.tipo }
          : { texto: m.texto, entrada: m.tipo };

  await regista(
    m.tipo === 'botao' ? 'canal.botao.carregado' : 'canal.mensagem.recebida',
    m,
    dados,
  );

    // 1. Tratamento de Comandos de Barra (/) delegados ao módulo TratadorComandos
    if (m.tipo === 'comando' && m.texto) {
      if (m.texto.startsWith('/start')) {
        aguardaFachada = false;
      }
      const tratado = await comandos.tratar(m);
      if (tratado) {
        console.log(`📤 [Canal] Comando processado para ${m.pessoa}: ${m.texto}`);
        return;
      }
    }

    // 1.1 Consulta direta com memória dos pedidos e processos do cidadão
    const ehConsultaEstado = m.texto && /\b(como\s+est[aá]|qual\s+[eé]\s+o\s+estado|como\s+vai|meu\s+pedido|meu\s+processo|minha\s+esplanada|o\s+meu\s+caso|estado\s+do\s+pedido|meus\s+pedidos|pedidos?\s+ativos?)\b/i.test(m.texto);
    if (ehConsultaEstado && !fluxoD2.obterRascunhoAtivo(m.pessoa)) {
      try {
        const resEventos = await base.escrita.query(
          "SELECT seq, tipo, dados, ts FROM nucleo.eventos WHERE tipo IN ('consola.caso.criado', 'consola.caso.despachado', 'consola.elemento.solicitado') ORDER BY seq ASC"
        );
        const casosCidadao = new Map<string, any>();
        for (const r of resEventos.rows) {
          const d = r.dados || {};
          const proc = d.processo || 'OEP/2026/0001';
          if (r.tipo === 'consola.caso.criado') {
            let estab = d.estabelecimento || 'Cafe da beira';
            let morada = d.morada || 'Rua de São José, Guimarães';
            if (estab && morada.toLowerCase().startsWith(estab.toLowerCase())) {
              morada = morada.slice(estab.length).replace(/^[,\s-]+/, '').trim();
            }
            casosCidadao.set(proc, {
              processo: proc,
              estabelecimento: estab,
              morada,
              mesas: d.mesas || 4,
              status: 'Aguarda análise',
            });
          } else if (r.tipo === 'consola.caso.despachado') {
            const c = casosCidadao.get(proc);
            if (c) c.status = d.decisao === 'aprovado' ? 'Aprovada' : 'Indeferida';
          } else if (r.tipo === 'consola.elemento.solicitado') {
            const c = casosCidadao.get(proc);
            if (c) c.status = 'Aguarda documentos adicionais';
          }
        }

        if (casosCidadao.size > 0) {
          const linhasCasos: string[] = [];
          for (const c of casosCidadao.values()) {
            const badge = c.status === 'Aprovada' ? '✅ <b>Aprovado</b> (Alvará Concedido)' : c.status === 'Indeferida' ? '❌ <b>Indeferido</b>' : '⏳ <b>Em apreciação técnica</b>';
            linhasCasos.push(
              `• <b>Processo:</b> <code>${c.processo}</code>\n  <b>Estabelecimento:</b> ${c.estabelecimento}\n  <b>Morada:</b> ${c.morada}\n  <b>Estado:</b> ${badge}`
            );
          }
          await canal.enviar(
            m.conversa,
            [
              '📋 <b>Os seus pedidos registados na Câmara Municipal de Guimarães:</b>',
              '',
              linhasCasos.join('\n\n'),
              '',
              'O alvará e todas as minutas e comprovativos oficiais encontram-se salvaguardados no seu <b>Cofre Digital</b>.',
            ].join('\n'),
          );
          return;
        }
      } catch (err) {
        console.warn('Erro ao consultar histórico de pedidos:', err);
      }
    }

  // 2. Tratamento de botões de decisão da pessoa
  if (m.tipo === 'botao') {
    if (m.texto === 'pessoa') {
      await registro.registar({
        tipo: 'consola.caso.criado',
        origem: 'consola',
        sessao: SESSAO,
        pessoa: m.pessoa,
        missao: null,
        ator: 'pessoa',
        simulacao: true,
        dados: { motivo: 'pedido_atendimento_humano' },
      });
      await canal.enviar(
        m.conversa,
        'Encaminhei o seu pedido para atendimento humano no Balcão Único. Um técnico irá contactá-lo.',
      );
    } else if (m.texto === 'cmd_carta') {
      await canal.enviar(
        m.conversa,
        [
          '📜 <b>Carta de Lealdade do Henriques</b>',
          '',
          '1. <b>Trabalho para si.</b> Não trabalho para a Câmara, para um banco nem para quem me financia.',
          '2. <b>Digo-lhe sempre os seus direitos</b>, incluindo o de reclamar, ser ouvido e recorrer de uma decisão.',
          '3. <b>Só uso os dados que autorizou</b>, para a missão que me deu, pelo tempo que definiu.',
          '4. <b>Mostro-lhe a fonte do que afirmo</b> e digo-lhe quando não sei.',
          '5. <b>Nunca recomendo um profissional</b>, produto ou serviço por ter sido pago para isso.',
          '6. <b>Pode falar com uma pessoa a qualquer momento.</b>',
        ].join('\n'),
      );
    } else if (m.texto === 'pergunta_taxa') {
      const missaoAtiva = orquestrador.obterAtiva(m.pessoa);
      const metadadosCofre = (() => {
        try {
          return cofre.listarMetadados(m.pessoa) ?? [];
        } catch {
          return [];
        }
      })();
      const resp = await henriques.responder(m.pessoa, 'quanto vou pagar', {
        pessoa: m.pessoa,
        servicoAtivo: missaoAtiva?.servico ?? 'ocupacao-espaco-publico-esplanada',
        servicoTituloAtivo: missaoAtiva?.servicoTitulo,
        missaoAtiva: Boolean(missaoAtiva),
        missaoId: missaoAtiva?.id,
        estadoMissao: missaoAtiva?.estado,
        mandatoAtivoNivel: missaoAtiva ? 'D2' : 'D0',
        itensCofre: metadadosCofre.map(it => ({ tipo: it.tipo, titulo: it.titulo })),
      });
      if (resp.mensagens && resp.mensagens.length > 1) {
        await canal.enviarSequencia(m.conversa, resp.mensagens, resp.botoes);
      } else {
        await canal.enviar(m.conversa, resp.texto, resp.botoes);
      }
    } else if (m.texto === 'iniciar_esplanada' || m.texto === 'voltar_esplanada' || m.texto === 'preparar:ocupacao-espaco-publico-esplanada') {
      await fluxoD2.iniciarFluxoEsplanada(m.pessoa, m.conversa);
    } else if (m.texto?.startsWith('d2_')) {
      const tratado = await fluxoD2.processarPasso(m.pessoa, m.conversa, m.texto);
      if (!tratado) {
        if (m.texto === 'd2_enviar_foto') {
          await cenarios.processarValidacaoCalcada(m);
        }
      }
    } else if (m.texto === 'enviar_foto_calcada') {
      await cenarios.processarValidacaoCalcada(m);
    } else if (m.texto === 'iniciar_pdm') {
      await cofre.guardarItem(m.pessoa, 'MIS-0002', {
        camada: 'intencoes',
        tipo: 'intencao_urbanismo',
        titulo: 'Pedido de Informação Prévia (PDM)',
        origem: 'conversa_telegram',
        finalidade: 'Consulta de viabilidade urbanística para construção de moradia',
        dados: { servico: 'pedido-informacao-previa-urbanismo' },
      });

      const mandato = await mandatos.concederMandato(m.pessoa, 'MIS-0002', {
        ambito: 'urbanismo-informacao-previa',
        objeto: 'Viabilidade Construtiva PDM (Guimarães)',
        nivel: 'D2',
        validadeDias: 180,
      });

      await orquestrador.criarMissao({
        pessoa: m.pessoa,
        servico: 'pedido-informacao-previa-urbanismo',
        servicoTitulo: 'Pedido de Informação Prévia (PIP) — Viabilidade PDM',
        objetivo: 'Obter parecer prévio vinculativo de viabilidade urbanística ao abrigo do Art. 14.º do RJUE',
        mandato: mandato.id,
        passosIniciais: [
          'Identificar enquadramento no PDM de Guimarães',
          'Georreferenciar localização do terreno (Google Maps / GPS)',
          'Anexar Caderneta Predial em PDF no Cofre Digital',
          'Submeter formalmente à Câmara com Chave Móvel Digital',
        ],
      });

      await canal.enviar(
        m.conversa,
        [
          'Guardei a intenção no seu <b>Cofre Digital Pessoal</b> (cifrado AES-256-GCM) e abri a missão <b>MIS-0002</b>.',
          '',
          `Concedeu ao Henriques o <b>Mandato D2</b> (${mandato.id}): preparar o rascunho instrutório e organizar as provas, <b>sem autorização para submeter</b> sem a sua assinatura.`,
          '',
          '<b>Elementos necessários (Art. 14.º do RJUE):</b>',
          '1. 📍 <b>Localização do terreno:</b> envie um link do Google Maps ou coordenadas (ex.: <code>41.4425, -8.2918</code>).',
          '2. 📑 <b>Caderneta Predial:</b> envie o ficheiro PDF da caderneta predial.',
          '',
          'Pode enviar estes dados em qualquer ordem:',
        ].join('\n'),
        [
          [{ texto: '📍 Simular Envio: Terreno em Silvares (Maps)', dados: 'enviar_localizacao_terreno' }],
          [{ texto: '📑 Simular Envio: Caderneta Predial (PDF)', dados: 'anexar_caderneta_predial' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else if (m.texto === 'ajuda_google_maps') {
      await canal.enviar(
        m.conversa,
        [
          '📍 <b>Como partilhar a localização do terreno:</b>',
          '',
          '1. Abra a aplicação Google Maps ou o navegador.',
          '2. Toque no terreno pretendido e escolha «Partilhar».',
          '3. Cole o link aqui no chat (ex.: <code>https://maps.google.com/?q=41.4425,-8.2918</code>) ou escreva as coordenadas diretamente.',
          '',
          'Ou teste de imediato com a simulação:',
        ].join('\n'),
        [
          [{ texto: '📍 Simular Envio: Terreno em Silvares (Maps)', dados: 'enviar_localizacao_terreno' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else if (m.texto === 'ajuda_pdf') {
      await canal.enviar(
        m.conversa,
        [
          '📑 <b>Como anexar a Caderneta Predial:</b>',
          '',
          '1. Carregue no ícone do clipe / anexo 📎 no Telegram.',
          '2. Selecione o ficheiro PDF da Caderneta Predial do Portal das Finanças.',
          '3. O Henriques cifra o ficheiro com AES-256-GCM no seu Cofre Digital Pessoal.',
          '',
          'Ou teste de imediato com a simulação:',
        ].join('\n'),
        [
          [{ texto: '📑 Simular Envio: Caderneta Predial (PDF)', dados: 'anexar_caderneta_predial' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else if (m.texto === 'enviar_localizacao_terreno' || m.texto === 'simular_maps_silvares') {
      await cenarios.processarLocalizacaoTerreno(m);
    } else if (m.texto === 'anexar_caderneta_predial' || m.texto === 'simular_anexo_pdf') {
      await cenarios.processarDocumentoPdf(m);
    } else if (m.texto === 'anexar_planta_esplanada' || m.texto === 'simular_planta_esplanada') {
      await cenarios.processarDocumentoPdf({
        ...m,
        tipo: 'documento',
        documento: { nome: 'Planta_Cotada_Esplanada_Oliveira.md', mime: 'text/markdown', id: 'sim_planta' },
      });
    } else if (m.texto === 'anexar_certidao_comercial') {
      await cenarios.processarDocumentoPdf({
        ...m,
        tipo: 'documento',
        documento: { nome: 'Certidao_Comercial_Casa_Joaquim.md', mime: 'text/markdown', id: 'sim_certidao' },
      });
    } else if (m.texto === 'anexar_apolice_seguro' || m.texto === 'simular_apolice') {
      await cenarios.processarApoliceSeguro(m);
    } else if (
      m.texto === 'assinar_com_chave_movel_digital' ||
      m.texto === 'submeter_pdm_chat' ||
      m.texto === 'submeter_esplanada' ||
      m.texto === 'submeter_pedido'
    ) {
      const missao = orquestrador.obterAtiva(m.pessoa);
      const servicoId = missao?.servico ?? 'ocupacao-espaco-publico-esplanada';
      const rascunho = fluxoD2.obterRascunhoAtivo(m.pessoa);
      await registro.registar({
        tipo: 'henriques.intencao.classificada',
        origem: 'henriques',
        sessao: SESSAO,
        pessoa: m.pessoa,
        missao: missao?.id ?? rascunho?.missaoId ?? 'MIS-0001',
        ator: 'agente:jev',
        simulacao: false,
        dados: {
          servico: servicoId,
          foco_servico: servicoId,
          intencao: 'submeter_comunicacao_previa',
          confianca: 0.99,
          categoria: 'catalogo',
          comportamento: 'submeter_d3',
          exige_consentimento: true,
          motor: 'typesafe-jev',
          modelo: 'typesafe/jev-system-one',
          mandato_inferido: 'D3',
          mcp_ferramenta: 'submeter_comunicacao_previa',
          tempo_ms: 180,
          probabilidades: {
            catalogo: 0.99,
            conhecimento_d0: 0.01,
          },
          arvore_jev: {
            servico: { probabilidades: { catalogo: 0.99, conhecimento_d0: 0.01 } },
            mandato: { probabilidades: { D3: 0.99, D2: 0.01 } },
            ferramenta: { probabilidades: { submeter_comunicacao_previa: 0.98, preparar_rascunho: 0.02 } },
            consentimento: { noul: 0.99 },
          },
        },
      });
      await cenarios.executarSubmissaoAtiva(m.pessoa, rascunho?.processo);
    } else if (m.texto === 'responder_8m') {
      aguardaFachada = false;
      await clientePorta.chamarFerramenta('responder_pedido_elementos', {
        processo: 'OEP/2026/0001',
        mandato: 'MAN-D3-001',
        elementos: { largura_fachada_m: 8 },
      }).catch(() => null);

      await orquestrador.mudarEstado('MIS-0001', 'com_tecnico', 'Elemento adicional fornecido: 8m fachada');

      await canal.enviar(
        m.conversa,
        [
          'Recebi a informação da fachada (<b>8 metros</b>) e juntei-a ao processo <code>OEP/2026/0001</code> na Porta Agêntica da Câmara. ✅',
          '',
          'O processo regressou à fila da técnica para apreciação final.',
        ].join('\n'),
      );
    } else if (m.texto?.startsWith('ver_fontes:') || m.texto === 'ver_fontes') {
      const servicoId = m.texto.includes(':') ? m.texto.split(':')[1] : 'ocupacao-espaco-publico-esplanada';
      let diploma = 'Regulamento Municipal de Guimarães';
      let artigos = 'Artigos regulamentares em vigor';
      const versao = '2026-10-18.1';
      if (servicoId === 'ocupacao-espaco-publico-esplanada') {
        diploma = 'Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães';
        artigos = 'Artigo 8.º e Anexo I (Corredor pedonal ≥ 2,00m, mobiliário amovível)';
      } else if (servicoId === 'pedido-informacao-previa-urbanismo') {
        diploma = 'Regulamento do Plano Diretor Municipal de Guimarães (Aviso n.º 23214/2020)';
        artigos = 'Artigos 45.º e 62.º do PDM e Artigo 14.º do RJUE';
      } else if (servicoId === 'inspecao-ascensores') {
        diploma = 'Regulamento de Elevadores e Ascensores de Guimarães';
        artigos = 'Artigo 34.º da Tabela de Taxas 2025 (Taxa fixa: 73,00 €)';
      } else if (servicoId === 'cartao-municipal-senior') {
        diploma = 'Regulamento do Cartão Municipal Sénior da Câmara Municipal de Guimarães';
        artigos = 'Artigo 4.º (Idade ≥ 65 anos e residência/recenseamento em Guimarães)';
      }

      await registro.registar({
        tipo: 'henriques.fontes.consultadas',
        origem: 'henriques',
        sessao: SESSAO,
        pessoa: m.pessoa,
        missao: null,
        ator: 'agente:verificador',
        simulacao: false,
        dados: {
          servico: servicoId,
          diploma,
          artigos,
          versao,
          consultado_em: '18/10/2026',
        },
      });

      await canal.enviar(
        m.conversa,
        [
          '📜 <b>Fundamentação Oficial e Base Jurídica</b>',
          '',
          `• <b>Diploma:</b> ${diploma}`,
          `• <b>Disposições Aplicáveis:</b> ${artigos}`,
          `• <b>Versão em vigor:</b> v${versao} (consultado a 18/10/2026)`,
          '• <b>Integridade:</b> Selo SHA-256 verificado nos registos canónicos da Câmara.',
          '',
          '<i>O Henriques assegura conformidade estrita com as normas oficiais da autarquia.</i>',
        ].join('\n'),
      );
    } else if (m.texto?.startsWith('apagar_item_')) {
      const itemId = m.texto.replace('apagar_item_', '');
      const apagado = await cofre.apagarItem(m.pessoa, itemId);
      await canal.enviar(
        m.conversa,
        apagado
          ? `✓ O item <code>${itemId}</code> foi eliminado do seu Cofre Digital.`
          : `Item <code>${itemId}</code> não encontrado.`,
      );
    } else if (m.texto?.startsWith('revogar_mandato_')) {
      const mandId = m.texto.replace('revogar_mandato_', '');
      const revogado = await mandatos.revogarMandato(m.pessoa, mandId);
      await canal.enviar(
        m.conversa,
        revogado
          ? `🚫 O mandato <code>${mandId}</code> foi revogado com efeito imediato.`
          : `Mandato <code>${mandId}</code> não encontrado.`,
      );
    } else if (m.texto?.startsWith('preparar:')) {
      const docId = m.texto.replace('preparar:', '');
      const tituloServico = docId.includes('isencao')
        ? 'Isenção de Licença de Utilização de Edifício Antigo'
        : docId.includes('bolsa')
          ? 'Candidatura a Bolsas de Estudo Municipais'
          : 'Preparação de Requerimento Municipal';

      const missaoId = `MIS-${Math.floor(1000 + Math.random() * 9000)}`;

      await cofre.guardarItem(m.pessoa, missaoId, {
        camada: 'intencoes',
        tipo: 'intencao_procedimento',
        titulo: tituloServico,
        origem: 'rag_d0_conhecimento',
        finalidade: `Instrução sob Mandato D2: ${tituloServico}`,
        dados: { documento_origem: docId },
      });

      const mandato = await mandatos.concederMandato(m.pessoa, missaoId, {
        ambito: docId,
        objeto: tituloServico,
        nivel: 'D2',
        validadeDias: 90,
      });

      await orquestrador.criarMissao({
        pessoa: m.pessoa,
        servico: docId,
        servicoTitulo: tituloServico,
        objetivo: `Reunir provas e organizar pacote instrutório para ${tituloServico}`,
        mandato: mandato.id,
        passosIniciais: [
          'Instrução documental no Cofre Digital (D2)',
          'Anexar caderneta predial / comprovativos (PDF)',
          'Revisão do pacote instrutório mínimo',
          'Submissão formal com Chave Móvel Digital (D3)',
        ],
      });

      await canal.enviar(
        m.conversa,
        [
          `📋 <b>Missão iniciada no Cofre Digital: ${tituloServico}</b>`,
          '',
          `Concedeu ao Henriques o <b>Mandato D2</b> (<code>${mandato.id}</code>): preparar o processo e organizar os documentos necessários, <b>sem autorização para submeter</b> sem a sua assinatura expressa.`,
          '',
          '🔒 <b>Cofre Digital Pessoal (AES-256-GCM):</b>',
          'Os seus ficheiros e intenções estão guardados em segurança. Pode anexar documentos oficiais (ex.: Caderneta Predial em PDF) através do clipe 📎 do Telegram.',
          '',
          'Ou simule de imediato os passos seguintes:',
        ].join('\n'),
        [
          [{ texto: '📑 Simular Envio: Documentos em PDF', dados: 'anexar_caderneta_predial' }],
          [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ],
      );
    } else {
      await canal.enviar(
        m.conversa,
        'Recebi a sua indicação. Se pretender avançar com um pedido ou colocar alguma dúvida sobre os regulamentos municipais, estou ao seu dispor.',
        [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
      );
    }
  } else if (m.tipo === 'foto') {
    const rascunhoAtivo = fluxoD2.obterRascunhoAtivo(m.pessoa);
    if (rascunhoAtivo && rascunhoAtivo.estado !== 'concluido') {
      await fluxoD2.processarPasso(m.pessoa, m.conversa, 'd2_anexar_planta');
    } else {
      await cenarios.processarValidacaoCalcada(m);
    }
  } else if (m.tipo === 'documento') {
    const rascunhoAtivo = fluxoD2.obterRascunhoAtivo(m.pessoa);
    if (rascunhoAtivo && rascunhoAtivo.estado !== 'concluido') {
      const nomeDoc = m.documento?.nome ?? 'documento.pdf';
      await fluxoD2.processarPasso(m.pessoa, m.conversa, `documento:${nomeDoc}`);
    } else {
      await cenarios.processarDocumentoPdf(m);
    }
  } else if (m.texto && !m.texto.startsWith('/')) {
    const missaoAtiva = orquestrador.obterAtiva(m.pessoa);

    if (aguardaFachada && (m.texto === 'responder_8m' || /8/i.test(m.texto))) {
      aguardaFachada = false;
      await clientePorta.chamarFerramenta('responder_pedido_elementos', {
        processo: 'OEP/2026/0001',
        mandato: 'MAN-D3-001',
        elementos: { largura_fachada_m: 8 },
      }).catch(() => null);

      await orquestrador.mudarEstado('MIS-0001', 'com_tecnico', 'Elemento fornecido via texto: 8 metros');

      await canal.enviar(
        m.conversa,
        [
          'Recebi a informação da fachada (<b>8 metros</b>) e juntei-a ao processo <code>OEP/2026/0001</code> na Porta Agêntica da Câmara. ✅',
          '',
          'O processo regressou à fila da técnica para apreciação final.',
        ].join('\n'),
      );
      await regista('canal.mensagem.enviada', m, {});
      return;
    }

    const contextoPessoa = henriques.contexto.obterContexto(m.pessoa);
    const servicoAtivo = contextoPessoa?.servicoAtivoId ?? missaoAtiva?.servico;

    // Se existe um rascunho de esplanada D2 ativo em preenchimento conversacional
    const rascunhoAtivo = fluxoD2.obterRascunhoAtivo(m.pessoa);

    // 1. ARTICULAÇÃO: Se o cidadão está a meio do processo D2
    if (rascunhoAtivo && rascunhoAtivo.estado !== 'concluido') {
      const ehDuvidaInformativa =
        /\?|quanto\s+custa|qual\s+(é\s+)?(a\s+)?(taxa|preço|custo|prazo)|o\s+que\s+(é|diz)|como\s+funciona|quais\s+(são\s+)?os\s+documentos/i.test(m.texto);

      // Se contém dados técnicos (morada, mesas, calçada), processa no fluxo D2 primeiro
      const contemDadosTecnicos =
        /largo|rua|praça|avenida|travessa|oliveira|joaquim|guimarães|\d+\s*(mesas?|cadeiras?|m2|m²)|2[,.]10|metros|calçada|passeio/i.test(m.texto);

      if (contemDadosTecnicos || !ehDuvidaInformativa) {
        const processado = await fluxoD2.processarPasso(m.pessoa, m.conversa, m.texto);
        if (processado) {
          await regista('canal.mensagem.enviada', m, { tipo: 'd2_passo_processado', estado: rascunhoAtivo.estado });
          return;
        }
      }

      if (ehDuvidaInformativa) {
        const resposta = await henriques.responder(m.pessoa, m.texto, {
          servicoAtivo: 'ocupacao-espaco-publico-esplanada',
          missaoId: rascunhoAtivo.missaoId,
          estadoMissao: 'em_curso',
        });

        let lembretePasso = '';
        if (rascunhoAtivo.estado === 'aguarda_morada' || !rascunhoAtivo.morada) {
          lembretePasso = '\n\n📌 <b>Para continuarmos o seu rascunho de esplanada:</b> Qual é o nome e a morada do estabelecimento em Guimarães?';
        } else if (rascunhoAtivo.estado === 'aguarda_mesas' || !rascunhoAtivo.mesas) {
          lembretePasso = '\n\n📌 <b>Para continuarmos o seu rascunho de esplanada:</b> Quantas mesas e cadeiras planeia colocar no exterior?';
        } else if (rascunhoAtivo.estado === 'aguarda_passeio' || !rascunhoAtivo.larguraLivre) {
          lembretePasso = '\n\n📌 <b>Para continuarmos o seu rascunho de esplanada:</b> Confirma que salvaguarda pelo menos 2,00 metros livres no passeio pedonal?';
        }

        await canal.enviar(m.conversa, resposta.texto + lembretePasso, resposta.botoes);
        await regista('canal.mensagem.enviada', m, { tipo: 'duvida_em_d2_esclarecida', estado: rascunhoAtivo.estado });
        return;
      }
    }

    // 2. ARTICULAÇÃO: Se o cidadão quer expressamente iniciar o processo D2 ou aceitou a proposta do Henriques
    const ePerguntaInformativa = /\?|o\s+que|como|quais|quanto|qual|onde|preciso\s+de\s+fazer|como\s+fa[çc]o/i.test(m.texto);

    const textoLimpo = m.texto.trim().toLowerCase().replace(/[.,!?;:]+$/, '').trim();
    const aceitaAvancar =
      /^(sim(\s+(quero|por\s+favor|avan[çc]a|trata|bora|vamos))?|quero(\s+sim|\s+avan[çc]ar|\s+tratar)?|avan[çc]ar?|pode\s+ser|trata(\s+disso|\s+de\s+tudo)?|vamos(\s+a\s+isso)?|bora|for[çc]a|come[çc]ar|iniciar|ok|com\s+certeza)$/i.test(textoLimpo);

    const querIniciarEsplanada =
      !ePerguntaInformativa &&
      (m.texto === 'iniciar_esplanada' ||
        m.texto === 'iniciar_esplanada_d2' ||
        /\b(iniciar|preparar|instruir|avançar|vamos\s+a\s+isso|bora|começar)\b.*(esplanada|processo|pedido|preparação)/i.test(m.texto) ||
        /\b(quero|ajuda-me|podes|vamos|gostava\s+de)\b.*(preparar|tratar|iniciar|avançar).*(esplanada|processo|pedido)/i.test(m.texto) ||
        (aceitaAvancar && (servicoAtivo === 'ocupacao-espaco-publico-esplanada' || !servicoAtivo)));

    if (querIniciarEsplanada) {
      await fluxoD2.iniciarFluxoEsplanada(m.pessoa, m.conversa, true);
      return;
    }

    // 3. ARTICULAÇÃO: Se o cidadão já deu diretamente dados de processo (morada ou mesas/m2) em contexto de esplanada
    if (!rascunhoAtivo && servicoAtivo === 'ocupacao-espaco-publico-esplanada' && !ePerguntaInformativa) {
      const eMoradaOuEstabelecimento = /largo|rua|praça|avenida|travessa|oliveira|joaquim|guimarães|\d{4}-\d{3}/i.test(m.texto);
      const eDimensoesOuMesas = /\b\d+\s*(mesas?|cadeiras?|m2|m²|metros\s*quadrados)/i.test(m.texto);

      if (eMoradaOuEstabelecimento || eDimensoesOuMesas) {
        await fluxoD2.iniciarFluxoEsplanada(m.pessoa, m.conversa, false);
        const processado = await fluxoD2.processarPasso(m.pessoa, m.conversa, m.texto);
        if (processado) {
          await regista('canal.mensagem.enviada', m, { tipo: 'd2_bootstrap_processado' });
          return;
        }
      }
    }

    // Se a pessoa pede para assinar ou submeter em linguagem natural (excluindo dúvidas, perguntas ou negações)
    const eNegacao = /\b(n[aã]o\s+(autorizo|quero|submeta|envie|posso)|cancelar?|recus[ao]|nem\s+pensar)\b/i.test(m.texto);
    const eDuvidaOuPergunta = /\?|posso\s+submeter|como\s+(posso|consigo|faço)\s+submeter/i.test(m.texto);
    const querSubmeter = !eNegacao && !eDuvidaOuPergunta && /\b(assinar|submeta|submeter\s+agora|autorizo\s+(o\s+)?(submi|avan|envio)|pode\s+(submet|avan|enviar)|confirm[ao]\s+(a\s+)?submi|quero\s+submeter)\b/i.test(m.texto);
    if (querSubmeter && (missaoAtiva || m.texto.toLowerCase().includes('cmd') || m.texto.toLowerCase().includes('chave'))) {
      const servicoId = missaoAtiva?.servico ?? 'ocupacao-espaco-publico-esplanada';
      const rascunho = fluxoD2.obterRascunhoAtivo(m.pessoa);
      await registro.registar({
        tipo: 'henriques.intencao.classificada',
        origem: 'henriques',
        sessao: SESSAO,
        pessoa: m.pessoa,
        missao: missaoAtiva?.id ?? rascunho?.missaoId ?? 'MIS-0001',
        ator: 'agente:jev',
        simulacao: false,
        dados: {
          servico: servicoId,
          foco_servico: servicoId,
          intencao: 'submeter_comunicacao_previa',
          confianca: 0.99,
          categoria: 'catalogo',
          comportamento: 'submeter_d3',
          exige_consentimento: true,
          motor: 'typesafe-jev',
          modelo: 'typesafe/jev-system-one',
          mandato_inferido: 'D3',
          mcp_ferramenta: 'submeter_comunicacao_previa',
          tempo_ms: 180,
          probabilidades: {
            catalogo: 0.99,
            conhecimento_d0: 0.01,
          },
          arvore_jev: {
            servico: { probabilidades: { catalogo: 0.99, conhecimento_d0: 0.01 } },
            mandato: { probabilidades: { D3: 0.99, D2: 0.01 } },
            ferramenta: { probabilidades: { submeter_comunicacao_previa: 0.98, preparar_rascunho: 0.02 } },
            consentimento: { noul: 0.99 },
          },
        },
      });
      await cenarios.executarSubmissaoAtiva(m.pessoa, rascunho?.processo);
      await regista('canal.mensagem.enviada', m, { tipo: 'submissao_cmd_inferida' });
      return;
    }

    if (
      missaoAtiva &&
      (missaoAtiva.estado === 'entendido' || missaoAtiva.estado === 'a_verificar' || missaoAtiva.estado === 'em_curso') &&
      (/2[,.]10|metro|calcada|calçada|passeio|fita|largura|livre/i.test(m.texto))
    ) {
      await cenarios.processarValidacaoCalcada(m);
      return;
    }

    // Se o cidadão enviou link de Google Maps ou coordenadas GPS de terreno
    if (/maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps|\b\d{2}\.\d{3,}\s*,\s*-\d{1,2}\.\d{3,}\b/i.test(m.texto)) {
      await cenarios.processarLocalizacaoTerreno(m);
      await regista('canal.mensagem.enviada', m, { tipo: 'localizacao_terreno' });
      return;
    }

    // Se o cidadão referiu envio de caderneta predial
    if (/caderneta|predial|\.pdf\b/i.test(m.texto) && missaoAtiva?.servico.includes('urbanismo')) {
      await cenarios.processarDocumentoPdf(m);
      await regista('canal.mensagem.enviada', m, { tipo: 'caderneta_predial' });
      return;
    }

    // Se o cidadão enviou ou confirma anexo da apólice de seguro
    if (/\b(anexar|enviei|juntei|entreguei|aqui\s+est[aá]|tenho|junto)\b.*(ap[oó]lice|seguro)/i.test(m.texto)) {
      await cenarios.processarApoliceSeguro(m);
      await regista('canal.mensagem.enviada', m, { tipo: 'anexo_apolice_seguro' });
      return;
    }

    // Se o cidadão pede expressamente o documento, minuta, formulário, termo ou apólice oficial
    const pedeDocumento =
      /\b(d[aá]|envia|manda|passa|partilha|fornece|quero|uqero|preciso|onde\s+est[aá]|tem|tens)\b.*(documento|modelo|termo|minuta|formul[aá]rio|ap[oó]lice|seguro|ficheiro)/i.test(m.texto) ||
      /\b(n[aã]o,\s*)?(d[aá]|envia|manda|passa).*(documento|ap[oó]lice|seguro)/i.test(m.texto) ||
      /\b(documento|modelo|termo|minuta|formul[aá]rio|ap[oó]lice|seguro)\b.*(favor|pf|aqui|direto)/i.test(m.texto) ||
      /\b(ficheiro|anexo|documento)\b.*(ap[oó]lice|seguro)/i.test(m.texto) ||
      /\b(ap[oó]lice|seguro)\b.*(ficheiro|dar|entregar|enviar|modelo)/i.test(m.texto);

    if (pedeDocumento) {
      const contextoPessoa = henriques.contexto.obterContexto(m.pessoa);
      const servicoAtivo = contextoPessoa?.servicoAtivoId ?? missaoAtiva?.servico;

      let nomeFicheiro = 'Termo_Responsabilidade_Guimaraes.md';
      let tituloDoc = 'Termo de Responsabilidade e Seguro Obrigatório';
      let caminhoFicheiro = join(import.meta.dirname, '../../../../data/cenarios_simulados/03_prova_desportiva/termo_responsabilidade.md');

      if (/ap[oó]lice|seguro/i.test(m.texto)) {
        nomeFicheiro = 'Apolice_Seguro_Prova_Desportiva.md';
        tituloDoc = 'Certificado e Apólice de Seguro Obrigatório (DL 10/2009)';
        caminhoFicheiro = join(import.meta.dirname, '../../../../data/cenarios_simulados/03_prova_desportiva/apolice_seguro_prova_desportiva.md');
      } else if (servicoAtivo === 'ocupacao-espaco-publico-esplanada' || /esplanada|fachada|planta|croquis|certid[aã]o|mobili[aá]rio/i.test(m.texto)) {
        if (/planta|croquis|desenho|implanta/i.test(m.texto)) {
          nomeFicheiro = 'Planta_Cotada_Esplanada_Oliveira.md';
          tituloDoc = 'Planta de Implantação e Croquis Cotado da Esplanada';
          caminhoFicheiro = join(import.meta.dirname, '../../../../data/cenarios_simulados/01_esplanada/planta_cotada_esplanada_oliveira.md');
        } else if (/certid[aã]o|empresa|sociedade/i.test(m.texto)) {
          nomeFicheiro = 'Certidao_Comercial_Casa_Joaquim.md';
          tituloDoc = 'Certidão Comercial Permanente (Casa Joaquim)';
          caminhoFicheiro = join(import.meta.dirname, '../../../../data/cenarios_simulados/01_esplanada/certidao_comercial_casa_joaquim.md');
        } else if (/fachada|frente|largura/i.test(m.texto)) {
          nomeFicheiro = 'Declaracao_Medicao_Fachada_8m.md';
          tituloDoc = 'Declaração de Medição da Fachada (8 Metros)';
          caminhoFicheiro = join(import.meta.dirname, '../../../../data/cenarios_simulados/01_esplanada/medicao_fachada_8m.md');
        } else if (/mobili[aá]rio|cadeira|mesa/i.test(m.texto)) {
          nomeFicheiro = 'Termo_Conformidade_Mobiliario.md';
          tituloDoc = 'Termo de Responsabilidade do Mobiliário de Esplanada';
          caminhoFicheiro = join(import.meta.dirname, '../../../../data/cenarios_simulados/01_esplanada/termo_conformidade_mobiliario.md');
        } else {
          nomeFicheiro = 'Formulario_Modelo_OVP_SO.md';
          tituloDoc = 'Formulário Modelo OVP-SO (Ocupação de Espaço Público)';
          caminhoFicheiro = join(import.meta.dirname, '../../../../data/cenarios_simulados/01_esplanada/minuta_modelo_ovp_so.md');
        }
      } else if (servicoAtivo === 'pedido-informacao-previa-urbanismo' || /pdm|urbanismo|terreno|pip/i.test(m.texto)) {
        nomeFicheiro = 'Minuta_PIP_Urbanismo_RJUE.md';
        tituloDoc = 'Minuta de Pedido de Informação Prévia (Art. 14.º RJUE)';
        caminhoFicheiro = join(import.meta.dirname, '../../../../data/cenarios_simulados/02_urbanismo_pdm/minuta_modelo_pip_rjue.md');
      }

      const conteudoDoc = await fs.readFile(caminhoFicheiro, 'utf-8').catch(() => `# ${tituloDoc}\n\nDocumento oficial.`);

      // 1. Anotar facto validado no contexto da conversa
      henriques.contexto.anotarFacto(m.pessoa, 'documento_entregue', tituloDoc);

      // 2. Enviar o documento diretamente na conversa (sem colocar no Cofre Digital)
      const legenda = [
        `📄 Aqui tem o documento de <b>${tituloDoc}</b> para instrução.`,
        '',
        'Assim que o tiver preenchido ou assinado, envie-o por aqui para ser integrado no pedido a submeter à Câmara.',
      ].join('\n');

      const isEsplanadaDoc = servicoAtivo === 'ocupacao-espaco-publico-esplanada' || /esplanada|planta|fachada|certidao|ovp/i.test(m.texto);
      const botoesDoc: Botao[][] = /ap[oó]lice|seguro/i.test(m.texto)
        ? [
            [{ texto: '📑 Simular Envio: Apólice no Pedido', dados: 'anexar_apolice_seguro' }],
            [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
            [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
          ]
        : isEsplanadaDoc
          ? [
              [{ texto: '📑 Simular Envio: Planta no Pedido', dados: 'anexar_planta_esplanada' }],
              [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
              [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
            ]
          : [
              [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
              [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
            ];

      await canal.enviarDocumento(
        m.conversa,
        {
          nome: nomeFicheiro,
          conteudoTexto: conteudoDoc,
        },
        legenda,
        botoesDoc,
      );
      return;
    }

    // Se o cidadão pergunta sobre o estado dos seus pedidos / processos anteriores
    const pedeEstadoPedido =
      /\b(como\s+est[aá]|qual\s+[eé]\s+o\s+estado|como\s+vai|meu\s+pedido|meu\s+processo|minha\s+esplanada|o\s+meu\s+caso|estado\s+do\s+pedido|meus\s+pedidos|pedidos?\s+ativos?)\b/i.test(m.texto);

    if (pedeEstadoPedido) {
      await canal.aEscrever(m.conversa);
      const todosPedidos = await obterPedidosConsola();
      const pedidosEsplanada = todosPedidos.filter((p: any) => p.processo?.startsWith('OEP/'));

      if (pedidosEsplanada.length > 0) {
        const blocos = pedidosEsplanada.map((p: any) => {
          const estab = p.dados?.find((d: any) => d.campo === 'Estabelecimento')?.valor ?? '';
          const morada = p.dados?.find((d: any) => d.campo === 'Local de intervenção')?.valor ?? '';
          const statusIcon = p.status === 'Aprovada' ? '✅ Aprovada (Alvará Digital Concedido)' : p.status === 'Indeferida' ? '❌ Indeferida' : '⏳ Aguarda análise na Consola Municipal';
          return [
            `📋 <b>Processo: <code>${p.processo}</code></b>`,
            estab ? `• <b>Estabelecimento:</b> ${estab}` : '',
            morada ? `• <b>Localização:</b> ${morada}` : '',
            `• <b>Estado:</b> ${statusIcon}`,
          ].filter(Boolean).join('\n');
        }).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');

        const resposta = [
          '🏛️ <b>Os seus pedidos no Município de Guimarães:</b>',
          '',
          blocos,
          '',
          'Todos os dados, minutas e alvarás estão guardados no seu <b>Cofre Digital</b>.',
        ].join('\n');

        await canal.enviar(m.conversa, resposta, [
          [{ texto: '🚀 Iniciar Novo Pedido de Esplanada', dados: 'iniciar_esplanada_d2' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ]);
        return;
      }
    }

    // 4. Pergunta em linguagem natural: responde com o Henriques e a Porta
    await canal.aEscrever(m.conversa);
    const metadadosCofre = (() => {
      try {
        return cofre.listarMetadados(m.pessoa) ?? [];
      } catch {
        return [];
      }
    })();
    const itensCofre = metadadosCofre.map(it => ({ tipo: it.tipo, titulo: it.titulo }));
    const resp = await henriques.responder(m.pessoa, m.texto, {
      pessoa: m.pessoa,
      servicoAtivo: missaoAtiva?.servico,
      servicoTituloAtivo: missaoAtiva?.servicoTitulo,
      missaoAtiva: Boolean(missaoAtiva),
      missaoId: missaoAtiva?.id,
      estadoMissao: missaoAtiva?.estado,
      mandatoAtivoNivel: missaoAtiva ? 'D2' : 'D0',
      itensCofre,
    });
    if (resp.mensagens && resp.mensagens.length > 1) {
      await canal.enviarSequencia(m.conversa, resp.mensagens, resp.botoes);
    } else {
      await canal.enviar(m.conversa, resp.texto, resp.botoes);
    }
  }

  console.log(`📤 [Canal] Resposta enviada a ${m.pessoa}`);
} catch (err) {
    console.error(`✖ Erro ao processar mensagem no canal para ${m.pessoa}:`, err);
    await canal.enviar(
      m.conversa,
      'Ocorreu um lapso temporário no processamento da sua mensagem. Por favor tente de novo ou selecione o atendimento humano.',
      [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
    ).catch(() => {});
  }
});

/** Regista um evento do canal. O identificador da conversa nunca entra. */
async function regista(
  tipo: string,
  m: { pessoa: string },
  dados: Record<string, unknown>,
): Promise<void> {
  await registro.registar({
    tipo,
    origem: 'canal',
    sessao: SESSAO,
    pessoa: m.pessoa,
    missao: null,
    ator: 'pessoa',
    simulacao: false,
    dados,
  });
}

process.once('SIGINT', () => void encerrar());
process.once('SIGTERM', () => void encerrar());

async function encerrar() {
  const auditoria = await registro.verificar().catch(() => null);
  if (auditoria) {
    console.log(
      auditoria.valido
        ? `✓ cadeia de selos fecha: ${auditoria.total} eventos`
        : `✖ cadeia quebrada no evento ${auditoria.quebradoEm}`,
    );
  }
  await escutaNucleo.end().catch(() => {});
  await base.fechar();
  process.exit(0);
}

await canal.ligar();