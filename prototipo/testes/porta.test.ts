/**
 * Testes da Porta Agêntica via MCP v2 e REST.
 *
 * Provam que a Porta responde pela rede através de um cliente MCP real,
 * com versões, fontes e exigência de mandato para ações.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import http from 'node:http';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { criarServidorPorta } from '../apps/api/src/porta/servidor.ts';

const PORTA_TESTE = 4015;
let portaInstancia: Awaited<ReturnType<typeof criarServidorPorta>>;
let cliente: Client;

beforeAll(async () => {
  portaInstancia = await criarServidorPorta();
  await new Promise<void>((r) => portaInstancia.servidor.listen(PORTA_TESTE, () => r()));

  cliente = new Client({ name: 'test-client', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(
    new URL(`http://localhost:${PORTA_TESTE}/mcp`),
  );
  await cliente.connect(transport);
}, 30_000);

afterAll(async () => {
  await cliente?.close().catch(() => {});
  await portaInstancia?.fechar().catch(() => {});
}, 10_000);

describe('Porta Agêntica via MCP v2', () => {
  it('expõe as ferramentas previstas no AGENTS.md', async () => {
    const lista = await cliente.listTools();
    const nomes = lista.tools.map((t) => t.name);
    expect(nomes).toContain('procurar_servicos');
    expect(nomes).toContain('obter_servico');
    expect(nomes).toContain('criar_rascunho_ocupacao');
  });

  it('procurar_servicos devolve o serviço de esplanada com pontuação e versão', async () => {
    const res = await cliente.callTool({
      name: 'procurar_servicos',
      arguments: { consulta: 'quero uma esplanada à porta' },
    });
    expect(res.isError).toBeFalsy();
    const dados = JSON.parse((res.content[0] as { text: string }).text);
    expect(dados.resultados.length).toBeGreaterThanOrEqual(1);
    const primeiro = dados.resultados[0];
    expect(primeiro.id).toBe('ocupacao-espaco-publico-esplanada');
    expect(primeiro.versao).toBeDefined();
    expect(primeiro.pontuacao).toBeGreaterThan(0);
    expect(dados.aviso).toContain('Não validado pela Câmara');
  });

  it('obter_servico devolve a ficha completa com as fontes oficiais', async () => {
    const res = await cliente.callTool({
      name: 'obter_servico',
      arguments: { id: 'ocupacao-espaco-publico-esplanada' },
    });
    expect(res.isError).toBeFalsy();
    const servico = JSON.parse((res.content[0] as { text: string }).text);
    expect(servico.id).toBe('ocupacao-espaco-publico-esplanada');
    expect(servico.fontes.length).toBeGreaterThanOrEqual(1);
    expect(servico.tipo_procedimento).toBe('mera comunicação prévia');
  });

  it('obter_servico com id inexistente devolve erro SERVICO_NAO_ENCONTRADO', async () => {
    const res = await cliente.callTool({
      name: 'obter_servico',
      arguments: { id: 'servico-que-nao-existe' },
    });
    expect(res.isError).toBe(true);
    const erro = JSON.parse((res.content[0] as { text: string }).text);
    expect(erro.erro).toBe('SERVICO_NAO_ENCONTRADO');
  });

  it('criar_rascunho_ocupacao sem mandato devolve MANDATO_EM_FALTA', async () => {
    const res = await cliente.callTool({
      name: 'criar_rascunho_ocupacao',
      arguments: {
        localizacao: 'Largo do Toural, Guimarães',
        area_m2: 15,
        numero_mesas: 5,
      },
    });
    expect(res.isError).toBe(true);
    const erro = JSON.parse((res.content[0] as { text: string }).text);
    expect(erro.erro).toBe('MANDATO_EM_FALTA');
  });

  it('criar_rascunho_ocupacao com mandato devolve rascunho com etiqueta de simulação', async () => {
    const res = await cliente.callTool({
      name: 'criar_rascunho_ocupacao',
      arguments: {
        mandato: 'M-2026-TESTE',
        localizacao: 'Largo do Toural, Guimarães',
        area_m2: 15,
        numero_mesas: 5,
      },
    });
    expect(res.isError).toBeFalsy();
    const rascunho = JSON.parse((res.content[0] as { text: string }).text);
    expect(rascunho.rascunho).toBe('RASC-0001');
    expect(rascunho.simulacao).toBe(true);
  });

  it('bloqueia pedidos com cabeçalho Host suspeito (protecção DNS rebinding)', async () => {
    const status = await new Promise<number>((resolve) => {
      const req = http.request(
        { host: '127.0.0.1', port: PORTA_TESTE, path: '/servicos', headers: { host: 'site-malicioso.com' } },
        (res) => resolve(res.statusCode ?? 0),
      );
      req.end();
    });
    expect(status).toBe(403);
  });

  it('submeter_comunicacao_previa exige confirmação da pessoa (CONFIRMACAO_EM_FALTA)', async () => {
    const res = await cliente.callTool({
      name: 'submeter_comunicacao_previa',
      arguments: {
        mandato: 'MAN-D3-001',
        processo: 'OEP/2026/0001',
      },
    });
    expect(res.isError).toBe(true);
    const corpo = JSON.parse((res.content as Array<{ text: string }>)[0]!.text);
    expect(corpo.erro).toBe('CONFIRMACAO_EM_FALTA');
  });

  it('submeter_comunicacao_previa com confirmação submete o processo', async () => {
    const res = await cliente.callTool({
      name: 'submeter_comunicacao_previa',
      arguments: {
        mandato: 'MAN-D3-001',
        token_confirmacao: 'cmd_token_valido_demo',
        processo: 'OEP/2026/0001',
      },
    });
    expect(res.isError).toBeFalsy();
    const corpo = JSON.parse((res.content as Array<{ text: string }>)[0]!.text);
    expect(corpo.estado).toBe('submetido');
    expect(corpo.simulacao).toBe(true);
  });

  it('endpoint REST /processos permite à Consola Municipal listar e decidir', async () => {
    // 1. Listar processos
    const lista = await fetch(`http://127.0.0.1:${PORTA_TESTE}/processos`).then((r) => r.json());
    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBeGreaterThan(0);
    const proc = lista.find((p: { numero: string }) => p.numero === 'OEP/2026/0001');
    expect(proc).toBeDefined();

    // 2. Técnica toma decisão na Consola: pedir elementos
    const decisaoResp = await fetch(`http://127.0.0.1:${PORTA_TESTE}/processos/OEP%2F2026%2F0001/decisao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        acao: 'pedir_elementos',
        elemento: 'largura_fachada',
        fundamento: 'Solicitar confirmação da largura da fachada.',
      }),
    }).then((r) => r.json());

    expect(decisaoResp.estado).toBe('pedido_elementos');
    expect(decisaoResp.elementos_pedidos).toContain('largura_fachada');
  });
});
