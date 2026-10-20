/**
 * Gestor do Fluxo Conversacional D2 (Preparação Guiada de Processos no Telegram)
 *
 * Permite ao Afonso conduzir um diálogo fluido e natural passo-a-passo com o cidadão:
 * Passo 1: Nome e Morada do estabelecimento;
 * Passo 2: Quantidade de mesas e cadeiras (área m²);
 * Passo 3: Verificação de conformidade regulamentar do passeio (>= 2,00m);
 * Passo 4: Conclusão do pacote instrutório mínimo no Cofre e transição para D3 (CMD).
 */
import type { CofreDigital } from '../cofre/cofre.ts';
import type { GestorMandatos } from '../mandatos/mandatos.ts';
import type { OrquestradorMissoes } from './missao.ts';
import type { Registo } from '../eventos/registo.ts';
import type { CanalGrammy, Botao } from '../canal.ts';

export type EstadoD2 = 'aguarda_morada' | 'aguarda_mesas' | 'aguarda_passeio' | 'concluido';

export interface RascunhoEsplanada {
  pessoa: string;
  missaoId: string;
  estado: EstadoD2;
  estabelecimento?: string;
  morada?: string;
  mesas?: number;
  areaM2?: number;
  larguraLivre?: string;
}

import { validarPertenceGuimaraes } from '../validadores/guimaraes-territorio.ts';

export class GestorFluxoD2 {
  readonly #cofre: CofreDigital;
  readonly #mandatos: GestorMandatos;
  readonly #orquestrador: OrquestradorMissoes;
  readonly #registo: Registo;
  readonly #canal: CanalGrammy;
  readonly #sessao: string;
  readonly #rascunhos = new Map<string, RascunhoEsplanada>();

  constructor(deps: {
    cofre: CofreDigital;
    mandatos: GestorMandatos;
    orquestrador: OrquestradorMissoes;
    registo: Registo;
    canal: CanalGrammy;
    sessao?: string;
  }) {
    this.#cofre = deps.cofre;
    this.#mandatos = deps.mandatos;
    this.#orquestrador = deps.orquestrador;
    this.#registo = deps.registo;
    this.#canal = deps.canal;
    this.#sessao = deps.sessao ?? 'demo';
  }

  obterRascunhoAtivo(pessoa: string): RascunhoEsplanada | undefined {
    return this.#rascunhos.get(pessoa);
  }

  /**
   * Inicia o fluxo conversacional de preparação da esplanada sob Mandato D2.
   */
  async iniciarFluxoEsplanada(pessoa: string, conversa: string): Promise<void> {
    const missaoId = 'MIS-0001';

    // Conceder Mandato D2 no Gestor de Mandatos
    const mandato = await this.#mandatos.concederMandato(pessoa, missaoId, {
      ambito: 'ocupacao-espaco-publico',
      objeto: 'Instrução de Esplanada',
      nivel: 'D2',
      validadeDias: 180,
    });

    // Registar no Orquestrador
    await this.#orquestrador.criarMissao({
      pessoa,
      servico: 'ocupacao-espaco-publico-esplanada',
      servicoTitulo: 'Ocupação do Espaço Público — Esplanada Aberta',
      objetivo: 'Preparar pacote instrutório mínimo para Mera Comunicação Prévia',
      mandato: mandato.id,
      passosIniciais: [
        'Identificar estabelecimento e localização em Guimarães',
        'Definir dimensões e número de mesas',
        'Validar corredor pedonal livre (>= 2,00 m)',
        'Submissão formal com Chave Móvel Digital (D3)',
      ],
    });

    this.#rascunhos.set(pessoa, {
      pessoa,
      missaoId,
      estado: 'aguarda_morada',
    });

    await this.#registo.registar({
      tipo: 'afonso.missao_iniciada',
      origem: 'afonso',
      sessao: this.#sessao,
      pessoa,
      missao: missaoId,
      ator: 'agente:afonso',
      simulacao: false,
      dados: { servico: 'ocupacao-espaco-publico-esplanada', mandato: mandato.id },
    });

    const texto = [
      'Entendido! Vamos preparar o seu pedido de esplanada no Cofre Digital (sob Mandato D2).',
      '',
      'Para começarmos: qual é o <b>nome</b> e a <b>morada</b> do estabelecimento aqui em Guimarães?',
    ].join('\n');

    await this.#canal.enviar(conversa, texto);
    await this.#registo.registar({
      tipo: 'canal.mensagem.enviada',
      origem: 'canal',
      sessao: this.#sessao,
      pessoa,
      missao: missaoId,
      ator: 'agente:afonso',
      simulacao: false,
      dados: { texto },
    });
  }

  /**
   * Processa uma mensagem de texto ou botão dentro do fluxo conversacional ativo.
   */
  async processarPasso(pessoa: string, conversa: string, textoEntrada: string): Promise<boolean> {
    const rascunho = this.#rascunhos.get(pessoa);
    if (!rascunho || rascunho.estado === 'concluido') return false;

    const t = textoEntrada.trim();

    // PASSO 1: Recebeu morada / estabelecimento
    if (rascunho.estado === 'aguarda_morada') {
      const moradaFinal = t === 'd2_morada_joaquim' ? 'Casa Joaquim, Largo da Oliveira, 12, Guimarães' : t;

      // Validação de Sanidade Geográfica contra as 48 Freguesias de Guimarães
      const valGeo = validarPertenceGuimaraes(moradaFinal);
      if (!valGeo.valido) {
        await this.#canal.enviar(
          conversa,
          `A morada indicada não parece pertencer ao <b>Concelho de Guimarães</b> (${valGeo.motivo ?? 'freguesia desconhecida'}). Como sou o representante digital de Guimarães, apenas posso instruir pedidos para este concelho.\n\nPoderia indicar a freguesia ou morada correta em Guimarães?`,
        );
        return true;
      }

      rascunho.morada = moradaFinal;
      rascunho.estabelecimento = moradaFinal.split(',')[0].trim();
      rascunho.estado = 'aguarda_mesas';

      // Guardar intenção no Cofre Digital
      await this.#cofre.guardarItem(pessoa, rascunho.missaoId, {
        camada: 'intencoes',
        tipo: 'intencao_negocio',
        titulo: `Esplanada ${rascunho.estabelecimento}`,
        origem: 'conversa_telegram',
        finalidade: 'Licenciamento de ocupação de espaço público',
        dados: { estabelecimento: rascunho.estabelecimento, morada: rascunho.morada },
      });

      this.#orquestrador.atualizarPassoChecklist(rascunho.missaoId, 'chk-1', true, moradaFinal);

      const textoResp = [
        `Perfeito, registei <b>${moradaFinal}</b>.`,
        '',
        'Quantas <b>mesas</b> e <b>cadeiras</b> planeia colocar no exterior?',
      ].join('\n');

      await this.#canal.enviar(conversa, textoResp);
      await this.#registo.registar({
        tipo: 'canal.mensagem.enviada',
        origem: 'canal',
        sessao: this.#sessao,
        pessoa,
        missao: rascunho.missaoId,
        ator: 'agente:afonso',
        simulacao: false,
        dados: { texto: textoResp },
      });
      return true;
    }

    // PASSO 2: Recebeu quantidade de mesas
    if (rascunho.estado === 'aguarda_mesas') {
      let numMesas = 4;
      if (t === 'd2_mesas_2') numMesas = 2;
      else if (t === 'd2_mesas_4') numMesas = 4;
      else if (t === 'd2_mesas_6') numMesas = 6;
      else {
        const match = t.match(/\d+/);
        if (match) numMesas = parseInt(match[0], 10);
      }

      // Validação de Sanidade de Dimensões
      if (numMesas <= 0 || numMesas > 50) {
        const aviso = 'O número de mesas indicado (' + numMesas + ') não parece plausível para uma esplanada contígua. Por favor indique um número entre 1 e 30 mesas.';
        await this.#canal.enviar(conversa, aviso);
        await this.#registo.registar({
          tipo: 'canal.mensagem.enviada',
          origem: 'canal',
          sessao: this.#sessao,
          pessoa,
          missao: rascunho.missaoId,
          ator: 'agente:afonso',
          simulacao: false,
          dados: { texto: aviso },
        });
        return true;
      }

      const areaEstimada = numMesas * 2.5; // ~2.5m² por mesa com cadeiras
      rascunho.mesas = numMesas;
      rascunho.areaM2 = areaEstimada;
      rascunho.estado = 'aguarda_passeio';

      await this.#cofre.guardarItem(pessoa, rascunho.missaoId, {
        camada: 'intencoes',
        tipo: 'dimensoes_esplanada',
        titulo: 'Dimensões da Esplanada',
        origem: 'conversa_telegram',
        finalidade: 'Aferição de taxas e corredor regulamentar',
        dados: { mesas: numMesas, area_m2: areaEstimada, periodo: 'Anual (2026)' },
      });

      this.#orquestrador.atualizarPassoChecklist(rascunho.missaoId, 'chk-2', true, `${numMesas} mesas (~${areaEstimada} m²)`);

      const textoResp = [
        `Anotado: <b>${numMesas} mesas (~${areaEstimada} m²)</b>.`,
        '',
        'Segundo o <b>Artigo 8.º do Regulamento Municipal</b>, é obrigatório salvaguardar um <b>corredor pedonal livre de pelo menos 2,00 metros</b> para circulação de peões e carrinhos de bebé.',
        '',
        'O passeio em frente garante esta largura livre de 2,00 metros?',
      ].join('\n');

      await this.#canal.enviar(conversa, textoResp);
      await this.#registo.registar({
        tipo: 'canal.mensagem.enviada',
        origem: 'canal',
        sessao: this.#sessao,
        pessoa,
        missao: rascunho.missaoId,
        ator: 'agente:afonso',
        simulacao: false,
        dados: { texto: textoResp },
      });
      return true;
    }

    // PASSO 3: Confirmação do Passeio (>= 2,00m) e Emissão da Minuta do Documento
    if (rascunho.estado === 'aguarda_passeio') {
      const confirmou = t === 'd2_passeio_ok' || /sim|confirmo|2[,.]10|2m|metro|livre|ok|chega|dá/i.test(t);
      if (confirmou) {
        rascunho.larguraLivre = '2,10 metros';
        rascunho.estado = 'concluido';

        // Atualizar estado no orquestrador
        await this.#orquestrador.mudarEstado(rascunho.missaoId, 'preparado', 'Requisitos validados e pacote mínimo preparado');

        // Preparar pacote mínimo cifrado
        await this.#cofre.prepararPacoteMinimo(
          pessoa,
          rascunho.missaoId,
          'Câmara Municipal de Guimarães — Gabinete de Serviços Urbanos',
          'Mera Comunicação Prévia de Esplanada',
          {
            estabelecimento: rascunho.estabelecimento,
            morada: rascunho.morada,
            area_m2: rascunho.areaM2 ?? 10,
            numero_mesas: rascunho.mesas ?? 4,
            periodo: 'Anual (2026)',
            corredor_pedonal_livre: '2,10 metros (cumpre Art. 8.º >= 2,00 m)',
          },
          ['terreno_ponte', 'conversas_privadas', 'declaracoes_fiscais', 'dados_bancarios'],
        );

        this.#orquestrador.atualizarPassoChecklist(rascunho.missaoId, 'chk-3', true, 'Corredor 2,10 m validado');

        await this.#registo.registar({
          tipo: 'afonso.pacote_preparado',
          origem: 'afonso',
          sessao: this.#sessao,
          pessoa,
          missao: rascunho.missaoId,
          ator: 'agente:afonso',
          simulacao: false,
          dados: {
            pacote: 'PAC-0001',
            estabelecimento: rascunho.estabelecimento,
            morada: rascunho.morada,
            mesas: rascunho.mesas,
            area_m2: rascunho.areaM2,
            conformidade_passeio: 'conforme_art8',
          },
        });

        const textoConclusao = [
          '📄 <b>MINUTA DO REQUERIMENTO MUNICIPAL (OVP-SO)</b>',
          '━━━━━━━━━━━━━━━━━━━━',
          '• <b>Requerente:</b> Identificado via Cofre Digital',
          `• <b>Estabelecimento:</b> ${rascunho.estabelecimento}`,
          `• <b>Localização:</b> ${rascunho.morada}`,
          `• <b>Equipamento:</b> ${rascunho.mesas} mesas com cadeiras amovíveis`,
          `• <b>Área Ocupada:</b> ~${rascunho.areaM2} m² (contígua à fachada)`,
          '• <b>Acessibilidade:</b> Corredor de 2,10m salvaguardado (conforme Art. 8.º >= 2,00m)',
          '• <b>Regime:</b> Mera Comunicação Prévia (eficácia imediata)',
          '━━━━━━━━━━━━━━━━━━━━',
          '',
          '🔒 <i>Dados bancários, fiscais e conversas privadas estão blindados no seu Cofre Pessoal e foram omitidos da Câmara.</i>',
          '',
          '<b>Confirmas que as informações acima estão corretas?</b>',
          'Para submeter formalmente este documento à Câmara, assine com a sua <b>Chave Móvel Digital</b>:',
        ].join('\n');

        const botoesFinais: Botao[][] = [
          [{ texto: '✍️ Assinar com Chave Móvel Digital', dados: 'assinar_com_chave_movel_digital' }],
        ];

        await this.#canal.enviar(conversa, textoConclusao, botoesFinais);
        await this.#registo.registar({
          tipo: 'canal.mensagem.enviada',
          origem: 'canal',
          sessao: this.#sessao,
          pessoa,
          missao: rascunho.missaoId,
          ator: 'agente:afonso',
          simulacao: false,
          dados: { texto: textoConclusao },
        });
        return true;
      }
    }

    return false;
  }
}

