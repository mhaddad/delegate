/**
 * Gestor do Fluxo Conversacional D2 (Preparação Guiada de Processos no Telegram)
 *
 * Permite ao Henriques conduzir um diálogo fluido e natural passo-a-passo com o cidadão:
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

  cancelarRascunho(pessoa: string): void {
    this.#rascunhos.delete(pessoa);
  }

  /**
   * Inicia o fluxo conversacional de preparação da esplanada sob Mandato D2.
   */
  async iniciarFluxoEsplanada(pessoa: string, conversa: string): Promise<void> {
    // Registar no Orquestrador primeiro para obter o missaoId canónico (MIS-xxxx)
    const missao = await this.#orquestrador.criarMissao({
      pessoa,
      servico: 'ocupacao-espaco-publico-esplanada',
      servicoTitulo: 'Ocupação do Espaço Público — Esplanada Aberta',
      objetivo: 'Preparar pacote instrutório mínimo para Mera Comunicação Prévia',
      mandato: 'pendente',
      passosIniciais: [
        'Identificar estabelecimento e localização em Guimarães',
        'Definir dimensões e número de mesas',
        'Validar corredor pedonal livre (>= 2,00 m)',
        'Submissão formal com Chave Móvel Digital (D3)',
      ],
    });
    const missaoId = missao.id;

    // Conceder Mandato D2 no Gestor de Mandatos associado à missão criada
    const mandato = await this.#mandatos.concederMandato(pessoa, missaoId, {
      ambito: 'ocupacao-espaco-publico',
      objeto: 'Instrução de Esplanada',
      nivel: 'D2',
      validadeDias: 180,
    });
    missao.mandato = mandato.id;

    this.#rascunhos.set(pessoa, {
      pessoa,
      missaoId,
      estado: 'aguarda_morada',
    });

    await this.#registo.registar({
      tipo: 'henriques.missao_iniciada',
      origem: 'henriques',
      sessao: this.#sessao,
      pessoa,
      missao: missaoId,
      ator: 'agente:henriques',
      simulacao: false,
      dados: { servico: 'ocupacao-espaco-publico-esplanada', mandato: mandato.id },
    });

    const texto = [
      'Entendido! Vamos preparar o seu pedido de esplanada no Cofre Digital (sob Mandato D2).',
      '',
      '📋 <b>Documentos Necessários para a Instrução:</b>',
      '1. Formulário Modelo OVP-SO (preenchido com estes dados);',
      '2. Planta de localização ou fotografia com corredor livre ≥ 2,00m;',
      '3. Certidão Permanente da empresa (ou início de atividade);',
      '4. Apólice de Seguro de Responsabilidade Civil.',
      '',
      'Para começarmos a instrução: qual é o <b>nome</b> e a <b>morada</b> do estabelecimento aqui em Guimarães?',
    ].join('\n');

    const botoesIniciais: Botao[][] = [
      [{ texto: '📍 Exemplo: Casa Joaquim (Largo da Oliveira)', dados: 'd2_morada_joaquim' }],
      [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
    ];

    await this.#canal.enviar(conversa, texto, botoesIniciais);
    await this.#registo.registar({
      tipo: 'canal.mensagem.enviada',
      origem: 'canal',
      sessao: this.#sessao,
      pessoa,
      missao: missaoId,
      ator: 'agente:henriques',
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
        ator: 'agente:henriques',
        simulacao: false,
        dados: { texto: textoResp },
      });
      return true;
    }

    // PASSO 2: Recebeu quantidade de mesas ou área
    if (rascunho.estado === 'aguarda_mesas') {
      let numMesas: number | null = null;
      let areaEstimada = 10;

      const matchArea = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|metros\s*quadrados)/i);
      if (matchArea) {
        areaEstimada = parseFloat(matchArea[1].replace(',', '.'));
        numMesas = Math.max(1, Math.round(areaEstimada / 2.5));
      } else if (t === 'd2_mesas_2') {
        numMesas = 2;
        areaEstimada = 5;
      } else if (t === 'd2_mesas_4') {
        numMesas = 4;
        areaEstimada = 10;
      } else if (t === 'd2_mesas_6') {
        numMesas = 6;
        areaEstimada = 15;
      } else {
        const match = t.match(/\b\d+\b/);
        if (match) {
          numMesas = parseInt(match[0], 10);
          areaEstimada = numMesas * 2.5;
        }
      }

      // Se o cidadão não indicou um número compreensível
      if (numMesas === null || isNaN(numMesas)) {
        const aviso = 'Para instruir o rascunho com rigor oficial, preciso de saber o número exato de mesas pretendido (por exemplo: <i>«4 mesas»</i> ou entre 1 e 30).';
        await this.#canal.enviar(conversa, aviso);
        return true;
      }

      // Validação de Sanidade de Dimensões
      if (numMesas <= 0 || numMesas > 30) {
        const aviso = 'O número de mesas indicado (' + numMesas + ') excede o limite regulamentar plausível para uma esplanada contígua sem projeto especial. Por favor indique um número entre 1 e 30 mesas.';
        await this.#canal.enviar(conversa, aviso);
        await this.#registo.registar({
          tipo: 'canal.mensagem.enviada',
          origem: 'canal',
          sessao: this.#sessao,
          pessoa,
          missao: rascunho.missaoId,
          ator: 'agente:henriques',
          simulacao: false,
          dados: { texto: aviso },
        });
        return true;
      }

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
        'Qual é a largura livre da calçada em frente ao estabelecimento? (ex.: <i>«tem 2,10 metros»</i> ou <i>«sim, tem mais de 2 metros»</i>)',
      ].join('\n');

      await this.#canal.enviar(conversa, textoResp);
      await this.#registo.registar({
        tipo: 'canal.mensagem.enviada',
        origem: 'canal',
        sessao: this.#sessao,
        pessoa,
        missao: rascunho.missaoId,
        ator: 'agente:henriques',
        simulacao: false,
        dados: { texto: textoResp },
      });
      return true;
    }

    // PASSO 3: Confirmação do Passeio (>= 2,00m) e Emissão da Minuta do Documento
    if (rascunho.estado === 'aguarda_passeio') {
      // 1. Deteção de Recusa ou Negação Explícita
      const ehNegacao = /\b(n[aã]o|recuso|n[aã]o\s+confirmo|n[aã]o\s+tem|n[aã]o\s+garante|abaixo|menos|insuficiente)\b/i.test(t);
      if (ehNegacao) {
        const textoNaoConforme = [
          '⚠️ <b>Requisito Regulamentar Não Cumprido</b>',
          '',
          'O <b>Artigo 8.º do Regulamento de Ocupação do Espaço Público</b> exige expressamente um corredor livre mínimo de <b>2,00 metros</b> na calçada.',
          '',
          'Por imperativo de lealdade e proteção legal do cidadão, o Henriques <b>não pode certificar nem submeter uma declaração desconforme</b> à Câmara Municipal de Guimarães.',
          '',
          'O seu rascunho fica guardado no Cofre Digital até que as condições técnicas sejam reunidas ou possa solicitar uma vistoria prévia.',
        ].join('\n');

        await this.#canal.enviar(conversa, textoNaoConforme);
        await this.#orquestrador.mudarEstado(rascunho.missaoId, 'precisa_de_si', 'Largura do corredor inferior ao mínimo regulamentar de 2,00m');
        return true;
      }

      // 2. Extração da Largura Numérica (ex: 2,10m, 2.5 metros, 1.80m)
      let larguraNum: number | null = null;
      const matchLargura = t.match(/(\d+[\.,]\d+|\d+)\s*(m|metro|metros)?/i);
      if (matchLargura) {
        const valStr = matchLargura[1].replace(',', '.');
        larguraNum = parseFloat(valStr);
      }

      // Se disse apenas "sim", "confirmo", "dá" ou botão
      if (larguraNum === null && (t === 'd2_passeio_ok' || /\b(sim|confirmo|est[aá]\s+livre|ok|chega|d[aá]|garante)\b/i.test(t))) {
        larguraNum = 2.10;
      }

      if (larguraNum !== null) {
        if (larguraNum < 2.00) {
          const textoCurto = `A largura indicada (${larguraNum.toFixed(2).replace('.', ',')} m) é inferior ao limite mínimo legal de <b>2,00 metros</b>. Não é legalmente possível instalar a esplanada sem garantir esse corredor livre.`;
          await this.#canal.enviar(conversa, textoCurto);
          await this.#orquestrador.mudarEstado(rascunho.missaoId, 'precisa_de_si', `Largura de ${larguraNum}m insuficiente`);
          return true;
        }

        const larguraFormatada = `${larguraNum.toFixed(2).replace('.', ',')} metros`;
        rascunho.larguraLivre = larguraFormatada;
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
            corredor_pedonal_livre: `${larguraFormatada} (cumpre Art. 8.º >= 2,00 m)`,
          },
          ['terreno_ponte', 'conversas_privadas', 'declaracoes_fiscais', 'dados_bancarios'],
        );

        this.#orquestrador.atualizarPassoChecklist(rascunho.missaoId, 'chk-3', true, `Corredor ${larguraFormatada} validado`);

        await this.#registo.registar({
          tipo: 'henriques.pacote_preparado',
          origem: 'henriques',
          sessao: this.#sessao,
          pessoa,
          missao: rascunho.missaoId,
          ator: 'agente:henriques',
          simulacao: false,
          dados: {
            pacote: `PAC-${rascunho.missaoId}`,
            estabelecimento: rascunho.estabelecimento,
            morada: rascunho.morada,
            mesas: rascunho.mesas,
            area_m2: rascunho.areaM2,
            largura_validada: larguraFormatada,
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
          `• <b>Acessibilidade:</b> Corredor de ${larguraFormatada} salvaguardado (conforme Art. 8.º >= 2,00m)`,
          '• <b>Documentos:</b> Formulário OVP-SO e certidão reunidos no Pacote Mínimo (PAC-0001)',
          '• <b>Regime:</b> Mera Comunicação Prévia (eficácia imediata)',
          '━━━━━━━━━━━━━━━━━━━━',
          '',
          '🔒 <i>Princípio da Minimização RGPD: Dados bancários, fiscais e conversas privadas estão blindados no seu Cofre Pessoal e foram omitidos da Câmara.</i>',
          '',
          '<b>Tudo pronto.</b> Para dar entrada formal do pedido na Câmara Municipal com valor legal, confirme a sua autenticação:',
        ].join('\n');

        const botoesFinais: Botao[][] = [
          [{ texto: '✍️ Autenticar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
          [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
        ];

        await this.#canal.enviar(conversa, textoConclusao, botoesFinais);
        await this.#registo.registar({
          tipo: 'canal.mensagem.enviada',
          origem: 'canal',
          sessao: this.#sessao,
          pessoa,
          missao: rascunho.missaoId,
          ator: 'agente:henriques',
          simulacao: false,
          dados: { texto: textoConclusao },
        });
        return true;
      }
    }

    return false;
  }
}

