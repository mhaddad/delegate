/**
 * Sistema Simulado: Gabinete de Serviços Urbanos (Ocupação do Espaço Público)
 *
 * É a fonte do ato administrativo municipal: o processo e a decisão vivem aqui,
 * não no Delegate nem no chat.
 *
 * Estados:
 *   rascunho -> submetido -> em_apreciacao -> pedido_elementos -> aceite / rejeitado
 *
 * Regras:
 *  - Corredor de circulação livre >= 2,00 m (verificado na fotografia da calçada).
 *  - Número de processo com formato fictício: OEP/2026/0001.
 *  - Taxa calculada com marcação explícita de simulação (valor_ficticio: true).
 *  - O Afonso e terceiros só acedem a este sistema através da Porta Agêntica (MCP).
 *  - A Consola Municipal acede a este sistema para consulta e decisão técnica.
 */

export type EstadoProcesso =
  | 'rascunho'
  | 'submetido'
  | 'em_apreciacao'
  | 'pedido_elementos'
  | 'aceite'
  | 'rejeitado';

export interface ProcessoSU {
  numero: string; // ex: OEP/2026/0001
  caso: string; // ex: CASO-0001
  servico: string; // ex: ocupacao-espaco-publico-esplanada
  servicoTitulo: string;
  estado: EstadoProcesso;
  pessoa: string; // pseudónimo da pessoa (ex: ines_guimaraes)
  sessao: string;
  missao: string; // ex: MIS-0001
  dados: {
    localizacao: string;
    area_m2: number;
    numero_mesas: number;
    periodo: string;
    fotografia_passeio?: string;
    largura_corredor_m?: number;
    largura_fachada_m?: number;
    [chave: string]: unknown;
  };
  elementos_pedidos: string[];
  proposta_ia: string;
  fontes: Array<{ id: string; titulo: string; versao: string }>;
  taxa_calculada?: {
    valor: number;
    moeda: string;
    valor_ficticio: true;
    discriminacao: string;
  };
  referencia_pagamento?: {
    entidade: string;
    referencia: string;
    montante: string;
    valor_ficticio: true;
  };
  historico: Array<{
    ts: string;
    de: EstadoProcesso;
    para: EstadoProcesso;
    ator: string;
    fundamento?: string;
  }>;
  criadoEm: string;
  atualizadoEm: string;
  simulacao: true;
}

export class ArmazenamentoSU {
  readonly #processos = new Map<string, ProcessoSU>();

  constructor() {
    // Inicializar com o processo semente da demonstração da Inês
    const semente: ProcessoSU = {
      numero: 'OEP/2026/0001',
      caso: 'CASO-0001',
      servico: 'ocupacao-espaco-publico-esplanada',
      servicoTitulo: 'Ocupação do Espaço Público — Esplanada Aberta',
      estado: 'em_apreciacao',
      pessoa: 'ines_guimaraes',
      sessao: 'demo',
      missao: 'MIS-0001',
      dados: {
        localizacao: 'Largo da Oliveira, n.º 12, Guimarães',
        area_m2: 10,
        numero_mesas: 4,
        periodo: 'Anual (2026)',
        fotografia_passeio: 'fotografia_calcada_largura_livre_2_10m.jpg',
        largura_corredor_m: 2.1,
      },
      elementos_pedidos: [],
      proposta_ia:
        'O corredor pedonal medido é de 2,10 m (cumpre a regra regulamentar >= 2,00 m). Recomenda-se solicitar a confirmação da largura da fachada do restaurante antes de emitir a liquidação final.',
      fontes: [
        {
          id: 'cm-licenciamento-zero',
          titulo: 'Balcão do Empreendedor — Licenciamento Zero',
          versao: '2026-10-18.1',
        },
        {
          id: 'rttl-2025-esplanadas',
          titulo: 'RTTL 2025 — Artigo 68.º (Ocupação com Mobiliário Urbano)',
          versao: '2025.1',
        },
      ],
      historico: [
        {
          ts: new Date(Date.now() - 3600000).toISOString(),
          de: 'rascunho',
          para: 'submetido',
          ator: 'pessoa:ines_guimaraes',
          fundamento: 'Mera Comunicação Prévia submetida com mandato D3',
        },
        {
          ts: new Date(Date.now() - 1800000).toISOString(),
          de: 'submetido',
          para: 'em_apreciacao',
          ator: 'tecnica:servicos-urbanos',
          fundamento: 'Abertura para triagem técnica',
        },
      ],
      criadoEm: new Date(Date.now() - 3600000).toISOString(),
      atualizadoEm: new Date(Date.now() - 1800000).toISOString(),
      simulacao: true,
    };
    this.#processos.set(semente.numero, semente);
  }

  listar(filtroEstado?: EstadoProcesso): ProcessoSU[] {
    const todos = Array.from(this.#processos.values());
    if (!filtroEstado) return todos;
    return todos.filter((p) => p.estado === filtroEstado);
  }

  obter(numero: string): ProcessoSU | undefined {
    return this.#processos.get(numero);
  }

  obterPorCaso(caso: string): ProcessoSU | undefined {
    return Array.from(this.#processos.values()).find((p) => p.caso === caso);
  }

  criarRascunho(
    dados: Partial<ProcessoSU['dados']> & { pessoa: string; sessao: string; missao: string },
  ): ProcessoSU {
    const numero = `OEP/2026/${String(this.#processos.size + 1).padStart(4, '0')}`;
    const caso = `CASO-${String(this.#processos.size + 1).padStart(4, '0')}`;
    const agora = new Date().toISOString();

    const novo: ProcessoSU = {
      numero,
      caso,
      servico: 'ocupacao-espaco-publico-esplanada',
      servicoTitulo: 'Ocupação do Espaço Público — Esplanada Aberta',
      estado: 'rascunho',
      pessoa: dados.pessoa,
      sessao: dados.sessao,
      missao: dados.missao,
      dados: {
        localizacao: dados.localizacao ?? 'Largo da Oliveira, Guimarães',
        area_m2: dados.area_m2 ?? 10,
        numero_mesas: dados.numero_mesas ?? 4,
        periodo: dados.periodo ?? 'Anual (2026)',
        fotografia_passeio: dados.fotografia_passeio,
        largura_corredor_m: dados.largura_corredor_m ?? 2.1,
      },
      elementos_pedidos: [],
      proposta_ia:
        'Rascunho preparado pelo Afonso. Aguarda confirmação formal da pessoa com Chave Móvel Digital.',
      fontes: [
        {
          id: 'cm-licenciamento-zero',
          titulo: 'Balcão do Empreendedor — Licenciamento Zero',
          versao: '2026-10-18.1',
        },
      ],
      historico: [],
      criadoEm: agora,
      atualizadoEm: agora,
      simulacao: true,
    };

    this.#processos.set(numero, novo);
    return novo;
  }

  submeter(numero: string, ator = 'pessoa'): ProcessoSU | null {
    const p = this.#processos.get(numero);
    if (!p) return null;
    const agora = new Date().toISOString();
    p.historico.push({
      ts: agora,
      de: p.estado,
      para: 'submetido',
      ator,
      fundamento: 'Submissão formal autorizada pela munícipe',
    });
    p.estado = 'submetido';
    p.atualizadoEm = agora;
    return p;
  }

  transitarParaEmApreciacao(numero: string, ator = 'tecnica'): ProcessoSU | null {
    const p = this.#processos.get(numero);
    if (!p) return null;
    const agora = new Date().toISOString();
    p.historico.push({
      ts: agora,
      de: p.estado,
      para: 'em_apreciacao',
      ator,
      fundamento: 'Abertura para apreciação técnica',
    });
    p.estado = 'em_apreciacao';
    p.atualizadoEm = agora;
    return p;
  }

  pedirElementos(numero: string, elemento: string, fundamento: string, ator = 'tecnica:servicos-urbanos'): ProcessoSU | null {
    const p = this.#processos.get(numero);
    if (!p) return null;
    const agora = new Date().toISOString();
    if (!p.elementos_pedidos.includes(elemento)) {
      p.elementos_pedidos.push(elemento);
    }
    p.historico.push({
      ts: agora,
      de: p.estado,
      para: 'pedido_elementos',
      ator,
      fundamento,
    });
    p.estado = 'pedido_elementos';
    p.atualizadoEm = agora;
    return p;
  }

  juntarElementos(numero: string, novosDados: Record<string, unknown>, ator = 'agente:afonso'): ProcessoSU | null {
    const p = this.#processos.get(numero);
    if (!p) return null;
    const agora = new Date().toISOString();
    Object.assign(p.dados, novosDados);
    p.elementos_pedidos = [];
    p.historico.push({
      ts: agora,
      de: p.estado,
      para: 'em_apreciacao',
      ator,
      fundamento: 'Elementos adicionais submetidos pela munícipe através do Afonso',
    });
    p.estado = 'em_apreciacao';
    p.proposta_ia =
      'Elementos recebidos com sucesso (largura da fachada: 8 m). Corredor livre validado. O processo está em condições regulamentares para ser deferido.';
    p.atualizadoEm = agora;
    return p;
  }

  aceitar(numero: string, ator = 'tecnica:servicos-urbanos', fundamento?: string): ProcessoSU | null {
    const p = this.#processos.get(numero);
    if (!p) return null;
    const agora = new Date().toISOString();

    // Cálculo da taxa simulada (10 m2 x 7.575 EUR/m2 = 75.75 EUR)
    const area = Number(p.dados.area_m2 ?? 10);
    const taxaTotal = Number((area * 7.575).toFixed(2));
    p.taxa_calculada = {
      valor: taxaTotal,
      moeda: 'EUR',
      valor_ficticio: true,
      discriminacao: `${area} m² ocupação anual (simulação RTTL 2025)`,
    };

    p.referencia_pagamento = {
      entidade: '12345',
      referencia: '987 654 321',
      montante: `${taxaTotal.toFixed(2).replace('.', ',')} €`,
      valor_ficticio: true,
    };

    p.historico.push({
      ts: agora,
      de: p.estado,
      para: 'aceite',
      ator,
      fundamento: fundamento ?? 'Comunicação prévia aceite com emissão de guia de pagamento (simulação)',
    });
    p.estado = 'aceite';
    p.atualizadoEm = agora;
    return p;
  }

  rejeitar(numero: string, ator = 'tecnica:servicos-urbanos', fundamento: string): ProcessoSU | null {
    const p = this.#processos.get(numero);
    if (!p) return null;
    const agora = new Date().toISOString();
    p.historico.push({
      ts: agora,
      de: p.estado,
      para: 'rejeitado',
      ator,
      fundamento,
    });
    p.estado = 'rejeitado';
    p.atualizadoEm = agora;
    return p;
  }
}

export const servicosUrbanos = new ArmazenamentoSU();
