/**
 * Processador de Cenários Simulados da Demonstração
 *
 * Encapsula a lógica de negócio dos fluxos demonstrativos do piloto:
 * - Confirmação e submissão formal vinculativa com Chave Móvel Digital (CMD);
 * - Georreferenciação de terreno (Google Maps / SIG) e rascunho de PIP de Urbanismo;
 * - Instrução de Caderneta Predial (PDF) com cifra AES-256-GCM no Cofre Digital;
 * - Validação técnica de corredor pedonal livre em esplanadas (>= 2,00m).
 */
import type { Registo } from '../eventos/registo.ts';
import type { GestorMandatos } from '../mandatos/mandatos.ts';
import type { CofreDigital } from '../cofre/cofre.ts';
import type { MotorPolitica } from '../politica/politica.ts';
import type { ServicoChavesCofre } from '../cofre/servico-chaves.ts';
import type { ClientePortaMcp } from '../afonso/cliente-porta.ts';
import type { OrquestradorMissoes } from '../orquestrador/missao.ts';
import type { CanalTelegram, MensagemCanal } from '../canal.ts';
import type { DadosConfirmacaoCmd } from '../eventos/servidor.ts';

export type { DadosConfirmacaoCmd };

export interface DependenciasCenarios {
  mandatos: GestorMandatos;
  cofre: CofreDigital;
  politica: MotorPolitica;
  servicoChaves: ServicoChavesCofre;
  clientePorta: ClientePortaMcp;
  orquestrador: OrquestradorMissoes;
  registo: Registo;
  canal: CanalTelegram;
  obterChat: (pessoa: string) => string | null;
  sessao: string;
}

function escapar(texto: string): string {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export class ProcessadorCenarios {
  readonly #mandatos: GestorMandatos;
  readonly #cofre: CofreDigital;
  readonly #politica: MotorPolitica;
  readonly #servicoChaves: ServicoChavesCofre;
  readonly #clientePorta: ClientePortaMcp;
  readonly #orquestrador: OrquestradorMissoes;
  readonly #registo: Registo;
  readonly #canal: CanalTelegram;
  readonly #obterChat: (pessoa: string) => string | null;
  readonly #sessao: string;

  constructor(deps: DependenciasCenarios) {
    this.#mandatos = deps.mandatos;
    this.#cofre = deps.cofre;
    this.#politica = deps.politica;
    this.#servicoChaves = deps.servicoChaves;
    this.#clientePorta = deps.clientePorta;
    this.#orquestrador = deps.orquestrador;
    this.#registo = deps.registo;
    this.#canal = deps.canal;
    this.#obterChat = deps.obterChat;
    this.#sessao = deps.sessao;
  }

  async processarConfirmacaoCmd(dadosCmd: DadosConfirmacaoCmd): Promise<void> {
    const pessoa = dadosCmd.pessoa || 'ines_guimaraes';
    const processo = dadosCmd.processo || 'OEP/2026/0001';
    const servico = dadosCmd.servico || (processo.startsWith('PIP') ? 'pedido-informacao-previa-urbanismo' : 'ocupacao-espaco-publico-esplanada');
    const tokenCmd = dadosCmd.token_cmd;
    const chat = this.#obterChat(pessoa);

    const isPip = processo.startsWith('PIP') || servico.includes('pdm') || servico.includes('urbanismo');
    const missaoId = isPip ? 'MIS-0002' : 'MIS-0001';
    const pacoteId = isPip ? 'PAC-0002' : 'PAC-0001';

    // 1. Conceder Mandato D3 formal com base na assinatura CMD
    const mandato = await this.#mandatos.concederMandato(pessoa, missaoId, {
      ambito: isPip ? 'urbanismo-informacao-previa' : 'ocupacao-espaco-publico',
      objeto: isPip ? 'Terreno em Silvares (Guimarães)' : 'Casa Joaquim (Largo da Oliveira)',
      nivel: 'D3',
      validadeDias: 180,
    });

    // 2. Aprovar pacote mínimo no cofre
    await this.#cofre.aprovarPacoteMinimo(pessoa, missaoId, pacoteId).catch(() => {});

    // 3. Avaliar política de autorização
    const decisaoPol = await this.#politica.avaliarAcao({
      pessoa,
      missao: missaoId,
      acao: 'submeter_comunicacao_previa',
      ambito: isPip ? 'urbanismo-informacao-previa' : 'ocupacao-espaco-publico',
      nivelRequerido: 'D3',
      temConfirmacao: true,
    });

    if (decisaoPol.resultado === 'bloquear') {
      if (chat) await this.#canal.enviar(chat, `Submissão bloqueada pelas regras de política: ${decisaoPol.motivo}`);
      return;
    }

    // 4. Libertar chave criptográfica pelo tempo da submissão
    await this.#servicoChaves.libertarChave(pessoa, missaoId, mandato.id, 10 * 60 * 1000);

    // 5. Submeter via Porta Agêntica (MCP)
    await this.#clientePorta.chamarFerramenta('submeter_comunicacao_previa', {
      processo,
      mandato: mandato.id,
      token_confirmacao: tokenCmd,
    }).catch((e) => console.warn('Aviso submeter MCP:', e));

    // 6. Atualizar máquina de estados da missão
    if (!this.#orquestrador.obter(missaoId)) {
      await this.#orquestrador.criarMissao({
        pessoa,
        servico,
        servicoTitulo: isPip ? 'Pedido de Informação Prévia (PIP) — Viabilidade PDM' : 'Ocupação do Espaço Público — Esplanada Aberta',
        objetivo: isPip ? 'Obter parecer prévio vinculativo de viabilidade urbanística ao abrigo do Art. 14.º do RJUE' : 'Submeter Mera Comunicação Prévia',
        mandato: mandato.id,
        passosIniciais: ['Instrução do pedido', 'Submissão formal com CMD'],
      });
    }
    await this.#orquestrador.mudarEstado(missaoId, 'submetido', `Submetido com mandato D3 e Chave Móvel Digital (${tokenCmd})`);

    // 7. Criar caso na Consola Municipal
    await this.#registo.registar({
      tipo: 'consola.caso.criado',
      origem: 'consola',
      sessao: this.#sessao,
      pessoa,
      missao: missaoId,
      ator: 'sistema',
      simulacao: true,
      dados: {
        caso: isPip ? 'CASO-0002' : 'CASO-0001',
        processo,
        servico,
        risco: isPip ? 'medio' : 'baixo',
        token_cmd: tokenCmd,
      },
    });

    // 8. Notificar cidadão no Telegram
    if (chat) {
      if (isPip) {
        await this.#canal.enviar(
          chat,
          [
            '✅ <b>Pedido de Informação Prévia (PIP) Submetido!</b>',
            '',
            'A sua assinatura digital com <b>Chave Móvel Digital</b> foi validada com sucesso.',
            `Token de Assinatura: <code>${tokenCmd}</code>`,
            `Nível de Representação: <b>Mandato D3</b> (${mandato.id})`,
            '',
            `<b>Processo Municipal:</b> <code>${processo}</code> (Simulação)`,
            '<b>Estado:</b> Em apreciação técnica pela Divisão de Gestão Urbanística.',
            '',
            'O técnico municipal irá analisar o enquadramento no PDM de Guimarães.',
          ].join('\n'),
        );
      } else {
        await this.#canal.enviar(
          chat,
          [
            '✅ <b>Comunicação Prévia Submetida com Sucesso!</b>',
            '',
            'A sua assinatura digital com <b>Chave Móvel Digital</b> foi validada com sucesso.',
            `Token de Assinatura: <code>${tokenCmd}</code>`,
            `Nível de Representação: <b>Mandato D3</b> (${mandato.id})`,
            '',
            `<b>Processo Municipal:</b> <code>${processo}</code> (Simulação)`,
            '<b>Estado:</b> Em apreciação técnica pelo Gabinete de Serviços Urbanos.',
            '',
            'Avisarei assim que a técnica validar o processo na Consola Municipal.',
          ].join('\n'),
        );
      }
    }
  }

  async executarSubmissaoAtiva(pessoa: string): Promise<void> {
    const missaoAtiva = this.#orquestrador.obterAtiva(pessoa);
    const isPip = missaoAtiva?.servico?.includes('urbanismo');
    await this.processarConfirmacaoCmd({
      pessoa,
      servico: isPip ? 'pedido-informacao-previa-urbanismo' : 'ocupacao-espaco-publico-esplanada',
      processo: isPip ? 'PIP/2026/0002' : 'OEP/2026/0001',
      token_cmd: 'CMD-TOKEN-' + Math.floor(100000 + Math.random() * 900000),
      nif: '234567890',
      nome: 'Maria Lurdes Gonçalves',
    });
  }

  async processarLocalizacaoTerreno(m: MensagemCanal): Promise<void> {
    const missaoAtiva = this.#orquestrador.obterAtiva(m.pessoa);
    const missaoId = missaoAtiva?.servico.includes('urbanismo') ? missaoAtiva.id : 'MIS-0002';

    if (!missaoAtiva || !missaoAtiva.servico.includes('urbanismo')) {
      const mandato = await this.#mandatos.concederMandato(m.pessoa, missaoId, {
        ambito: 'urbanismo-informacao-previa',
        objeto: 'Viabilidade Construtiva PDM (Silvares, Guimarães)',
        nivel: 'D2',
        validadeDias: 180,
      });
      await this.#orquestrador.criarMissao({
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
    }

    await this.#cofre.guardarItem(m.pessoa, missaoId, {
      camada: 'provas',
      tipo: 'geolocalizacao_terreno',
      titulo: 'Localização Georreferenciada do Terreno',
      origem: 'google_maps',
      finalidade: 'Instrução do Pedido de Informação Prévia (Art. 14.º RJUE)',
      dados: {
        freguesia: 'Silvares',
        concelho: 'Guimarães',
        coordenadas: '41.4425, -8.2918',
        link_maps: 'https://maps.google.com/?q=41.4425,-8.2918',
        classificacao_solo_pdm: 'Solo Urbano · Espaço Residencial Nível 2',
        indice_ocupacao: 0.60,
        cercea_maxima: 3,
      },
    });

    await this.#clientePorta.criarRascunhoPip({
      mandato: 'MAN-D2-002',
      localizacao: 'Rua de Silvares, Silvares, Guimarães',
      coordenadas: '41.4425, -8.2918',
      pretensao: 'Construção de Moradia Unifamiliar',
      documentos: ['localizacao_georreferenciada.json'],
    }).catch((e) => console.warn('Aviso rascunho pip:', e));

    this.#orquestrador.atualizarPassoChecklist(missaoId, 'chk-2', true, 'Silvares (41.4425, -8.2918)');

    await this.#canal.enviar(
      m.conversa,
      [
        '📍 <b>Localização do terreno registada com sucesso!</b>',
        '',
        '• <b>Freguesia:</b> Silvares, Guimarães',
        '• <b>Coordenadas:</b> <code>41.4425, -8.2918</code>',
        '• <b>Cofre Digital:</b> Cifrado AES-256-GCM na camada <i>provas</i>.',
        '',
        '🏛️ <b>Enquadramento Preliminar no PDM de Guimarães:</b>',
        '• Classificação: <b>Solo Urbano — Espaço Residencial Nível 2</b>',
        '• Índice de Utilização: Máximo 0.60 (Art. 45.º do Regulamento do PDM)',
        '• Cércea Máxima: 3 pisos',
        '• Reserva Agrícola (RAN): Não abrangido · Reserva Ecológica (REN): Não abrangido',
        '',
        '<i>Nota de Transparência: O Afonso não emite parecer técnico vinculativo; este resumo provém do cruzamento do geoportal com o regulamento oficial (Aviso n.º 23214/2020).</i>',
        '',
        '<b>Próximo passo:</b> Anexe a Caderneta Predial (PDF) para concluir o pacote instrutório ou avance para a assinatura digital com Chave Móvel Digital.',
        '',
        `Para assinar no ecrã oficial da CMD, aceda a: <code>http://localhost:4000/cmd?processo=PIP/2026/0002&amp;servico=pdm&amp;pessoa=${m.pessoa}</code>`,
        'Ou diga simplesmente aqui no chat: <i>«Autorizo a submissão com Chave Móvel Digital»</i>.',
      ].join('\n'),
      [
        [{ texto: '📑 Simular Envio: Caderneta Predial (PDF)', dados: 'anexar_caderneta_predial' }],
        [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
        [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
      ],
    );
  }

  async processarDocumentoPdf(m: MensagemCanal): Promise<void> {
    const missaoAtiva = this.#orquestrador.obterAtiva(m.pessoa);
    const missaoId = missaoAtiva?.servico.includes('urbanismo') ? missaoAtiva.id : 'MIS-0002';
    const nomeDoc = m.documento?.nome ?? 'caderneta_predial_silvares.pdf';

    await this.#cofre.guardarItem(m.pessoa, missaoId, {
      camada: 'provas',
      tipo: 'caderneta_predial',
      titulo: 'Caderneta Predial Rústica / Urbana',
      origem: 'upload_telegram',
      finalidade: 'Comprovação da legitimidade e titularidade para PIP (Art. 14.º RJUE)',
      dados: {
        ficheiro: nomeDoc,
        artigo_matricial: 'Artigo 1420 - Silvares',
        hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    });

    await this.#cofre.prepararPacoteMinimo(
      m.pessoa,
      missaoId,
      'Câmara Municipal de Guimarães — Divisão de Gestão Urbanística',
      'Pedido de Informação Prévia (Art. 14.º RJUE)',
      {
        localizacao: 'Rua de Silvares, Silvares, Guimarães',
        coordenadas: '41.4425, -8.2918',
        artigo_matricial: 'Artigo 1420',
        area_pretendida_m2: 220,
        uso: 'Habitação Unifamiliar',
        documentos_validados: [nomeDoc],
      },
      ['declaracoes_irs', 'outros_imoveis', 'dados_bancarios', 'conversas_privadas'],
    );

    this.#orquestrador.atualizarPassoChecklist(missaoId, 'chk-3', true, nomeDoc);
    await this.#orquestrador.mudarEstado(missaoId, 'preparado', 'Localização e caderneta predial reunidas no pacote mínimo');

    await this.#canal.enviar(
      m.conversa,
      [
        '📑 <b>Caderneta Predial recebida e auditada!</b>',
        '',
        `• Ficheiro: <code>${escapar(nomeDoc)}</code>`,
        '• Resumo criptográfico SHA-256 verificado e apenso ao seu Cofre Digital.',
        '',
        '🔒 <b>Princípio da Minimização de Dados (RGPD):</b>',
        'Pacote instrutório <code>PAC-0002</code> preparado sob <b>Mandato D2</b>. Apenas saem a localização e a titularidade estritamente necessárias. A sua situação fiscal e dados bancários <b>permanecem inacessíveis</b>.',
        '',
        'O rascunho está <b>completo e pronto para submissão formal</b> à Divisão de Gestão Urbanística.',
        'Para avançar, assine o pedido através da <b>Chave Móvel Digital</b>:',
        '',
        `Para assinar no ecrã oficial da CMD, aceda a: <code>http://localhost:4000/cmd?processo=PIP/2026/0002&amp;servico=pdm&amp;pessoa=${m.pessoa}</code>`,
        'Ou diga simplesmente aqui no chat: <i>«Autorizo a submissão com Chave Móvel Digital»</i>.',
      ].join('\n'),
      [
        [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
        [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
      ],
    );
  }

  async processarValidacaoCalcada(m: MensagemCanal): Promise<void> {
    await this.#orquestrador.mudarEstado('MIS-0001', 'preparado', 'Medição validada com corredor pedonal livre (2,10 m >= 2,00 m)');

    await this.#cofre.prepararPacoteMinimo(
      m.pessoa,
      'MIS-0001',
      'Câmara Municipal de Guimarães',
      'Mera Comunicação Prévia de Esplanada',
      {
        localizacao: 'Largo da Oliveira, 12, Guimarães',
        area_m2: 10,
        numero_mesas: 4,
        periodo: 'Anual (2026)',
        fotografia_passeio: 'fotografia_calcada_largura_livre_2_10m.jpg',
        corredor_pedonal_livre: '2,10 metros',
      },
      ['terreno_ponte', 'conversas_privadas', 'declaracoes_fiscais', 'dados_bancarios'],
    );

    await this.#canal.enviar(
      m.conversa,
      [
        'Recebi a validação da calçada! ✅',
        '',
        'Corredor pedonal livre aferido: <b>2,10 metros</b> (cumpre a exigência regulamentar do Art. 8.º de pelo menos 2,00 m).',
        '',
        '<b>Proteção de Dados e Minimização (RGPD):</b>',
        'Pacote mínimo <code>PAC-0001</code> preparado sob <b>Mandato D2</b>. Apenas saem as dimensões estritamente necessárias. <b>Não são partilhados</b> património, dados bancários ou preferências.',
        '',
        'O pedido está <b>pronto para submissão formal</b> com a sua confirmação via Chave Móvel Digital.',
        '',
        `Para assinar no ecrã oficial da CMD, aceda a: <code>http://localhost:4000/cmd?processo=OEP/2026/0001&amp;servico=esplanada&amp;pessoa=${m.pessoa}</code>`,
        'Ou diga simplesmente aqui no chat: <i>«Autorizo a submissão com Chave Móvel Digital»</i>.',
      ].join('\n'),
      [
        [{ texto: '✍️ Assinar com Chave Móvel Digital (Simulação)', dados: 'assinar_com_chave_movel_digital' }],
        [{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }],
      ],
    );
  }
}
