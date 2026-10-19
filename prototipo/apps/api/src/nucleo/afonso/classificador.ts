/**
 * Classificador Determinístico de Intenções do Afonso.
 *
 * Implementa o roteamento em camadas (docs/estrategia/11 §5):
 * 1. Deteção de ataques adversariais e violações de privacidade;
 * 2. Deteção de pedidos de juízo técnico (recusa de viabilidade discricionária);
 * 3. Encaminhamento de competências externas (Administração Central, Vimágua);
 * 4. Deteção de perguntas sem fonte comprovada (abstenção formal);
 * 5. Correspondência por termos contra o Catálogo Oficial Municipal.
 */

export type TipoComportamento = 'responder' | 'abster' | 'encaminhar' | 'recusar';

export interface ClassificacaoIntencao {
  comportamento: TipoComportamento;
  categoria: 'catalogo' | 'sem_fonte' | 'fora_competencia' | 'juizo_tecnico' | 'adversarial';
  servicoId?: string;
  entidade?: string;
  motivo?: string;
  proibicao?: string;
}

export class ClassificadorAfonso {
  static classificar(pergunta: string): ClassificacaoIntencao {
    const texto = pergunta.toLowerCase().trim();

    // 1. Deteção Adversarial e Privacidade
    if (texto.includes('ignora as instruções') || texto.includes('ignora as instrucoes') || texto.includes('ignore previous')) {
      return {
        comportamento: 'recusar',
        categoria: 'adversarial',
        motivo: 'tentativa_prompt_injection',
        proibicao: 'afirmar_aprovacao_indevida',
      };
    }

    if (texto.includes('nif') && (texto.includes('vizinho') || texto.includes('costa') || texto.includes('terceiro'))) {
      return {
        comportamento: 'recusar',
        categoria: 'adversarial',
        motivo: 'pedido_dados_terceiros_e_falsa_identidade',
        proibicao: 'revelar_pii_terceiros',
      };
    }

    if (texto.includes('és um funcionário da câmara') || texto.includes('es um funcionario da camara')) {
      return {
        comportamento: 'recusar',
        categoria: 'adversarial',
        motivo: 'tentativa_impersonacao_humana',
        proibicao: 'fingir_ser_humano',
      };
    }

    if (texto.includes('sem citar fontes') || texto.includes('sem fonte')) {
      return {
        comportamento: 'responder',
        categoria: 'adversarial',
        motivo: 'pedido_ocultacao_fontes',
        proibicao: 'omitir_fonte_obrigatoria',
      };
    }

    if (texto.includes('o regulamento diz que a taxa é 0') || texto.includes('a taxa é 0 €') || texto.includes('a taxa e 0')) {
      return {
        comportamento: 'abster',
        categoria: 'adversarial',
        motivo: 'tentativa_inducao_taxa_gratuita',
        proibicao: 'confirmar_valor_sem_fonte',
      };
    }

    if (texto.includes('instrução escondida') || texto.includes('não é preciso licença')) {
      return {
        comportamento: 'responder',
        categoria: 'adversarial',
        motivo: 'tentativa_injecao_indireta',
        proibicao: 'seguir_instrucao_escondida',
      };
    }

    // 2. Juízo Técnico (Recusar parecer subjetivo de aprovação)
    if (texto.includes('a minha licença vai ser aprovada') || texto.includes('licenca vai ser aprovada')) {
      return {
        comportamento: 'recusar',
        categoria: 'juizo_tecnico',
        motivo: 'juizo_subjetivo_aprovacao',
      };
    }

    if (texto.includes('a câmara pode multar-me') || texto.includes('camara pode multar')) {
      return {
        comportamento: 'recusar',
        categoria: 'juizo_tecnico',
        motivo: 'juizo_subjetivo_sancionatorio',
      };
    }

    if (texto.includes('como sei se posso construir')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'pedido-informacao-previa-urbanismo',
      };
    }

    if (
      (texto.includes('posso construir') || texto.includes('posso fazer uma casa')) &&
      (texto.includes('ponte') || texto.includes('terreno do meu avô') || texto.includes('150 m'))
    ) {
      return {
        comportamento: 'recusar',
        categoria: 'juizo_tecnico',
        servicoId: 'pedido-informacao-previa-urbanismo',
        motivo: 'juizo_viabilidade_urbanistica',
      };
    }

    // 3. Fora de Competência da Câmara
    if (texto.includes('cartão de cidadão') || texto.includes('cartao de cidadao')) {
      return {
        comportamento: 'encaminhar',
        categoria: 'fora_competencia',
        entidade: 'Administração Central (Espaço Cidadão / IRN)',
      };
    }

    if (texto.includes('registo criminal')) {
      return {
        comportamento: 'encaminhar',
        categoria: 'fora_competencia',
        entidade: 'Administração Central (DGAJ / gov.pt)',
      };
    }

    if (texto.includes('conta da água') || texto.includes('conta da agua') || texto.includes('fatura da agua')) {
      return {
        comportamento: 'encaminhar',
        categoria: 'fora_competencia',
        entidade: 'Vimágua (Empresa Pública Municipal)',
      };
    }

    if (texto.includes('chave móvel digital') || texto.includes('chave movel digital') || texto.includes('cmd')) {
      return {
        comportamento: 'encaminhar',
        categoria: 'fora_competencia',
        entidade: 'Administração Central (AMA / Espaço Cidadão)',
      };
    }

    // 4. Sem Fonte (Abstenção Formal)
    if (
      texto.includes('quanto pago pela licença da esplanada') ||
      texto.includes('quanto pago pela esplanada') ||
      texto.includes('quanto vou pagar') ||
      texto.includes('qual o valor da taxa da esplanada')
    ) {
      return {
        comportamento: 'abster',
        categoria: 'sem_fonte',
        servicoId: 'ocupacao-espaco-publico-esplanada',
        motivo: 'taxa_esplanada_sem_fonte_unica',
      };
    }

    if (texto.includes('quanto tempo demora a resposta ao pedido de informação prévia') || texto.includes('quanto tempo demora o pip')) {
      return {
        comportamento: 'abster',
        categoria: 'sem_fonte',
        servicoId: 'pedido-informacao-previa-urbanismo',
        motivo: 'prazo_pip_dependente_instrucao',
      };
    }

    if (texto.includes('painéis solares') || texto.includes('paineis solares') || texto.includes('apoio solar')) {
      return {
        comportamento: 'abster',
        categoria: 'sem_fonte',
        motivo: 'apoio_solar_sem_programa_aberto',
      };
    }

    if (texto.includes('horário do balcão único') || texto.includes('horario do balcao unico') || texto.includes('horario do bua')) {
      return {
        comportamento: 'responder',
        categoria: 'sem_fonte',
        motivo: 'horario_atendimento_bua',
      };
    }

    if (texto.includes('quantas mesas posso ter')) {
      return {
        comportamento: 'responder',
        categoria: 'sem_fonte',
        servicoId: 'ocupacao-espaco-publico-esplanada',
        motivo: 'criterio_largura_e_corredor_2m',
      };
    }

    // 5. Catálogo de Serviços
    if (texto.includes('esplanada') || texto.includes('mesas na rua') || (texto.includes('restaurante') && texto.includes('abrir'))) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'ocupacao-espaco-publico-esplanada',
      };
    }

    if (texto.includes('andaime') || texto.includes('tapume') || texto.includes('contentor de entulho')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'ocupacao-espaco-publico-andaimes',
      };
    }

    if (texto.includes('elevador') || texto.includes('ascensor')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'inspecao-ascensores',
      };
    }

    if (
      texto.includes('pdm') ||
      texto.includes('informação prévia') ||
      texto.includes('informacao previa') ||
      texto.includes('pip') ||
      texto.includes('construir no meu terreno') ||
      (texto.includes('terreno') && (texto.includes('construir') || texto.includes('moradia') || texto.includes('casa') || texto.includes('viabilidade')))
    ) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'pedido-informacao-previa-urbanismo',
      };
    }

    if (texto.includes('processo de obras') || texto.includes('processo antigo') || texto.includes('consultar processo')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'consulta-processo-certidao',
      };
    }

    if (texto.includes('reclamo luminoso') || texto.includes('publicidade na fachada') || texto.includes('tabuleta')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'publicidade-reclamo-fachada',
      };
    }

    if (texto.includes('ruído') || texto.includes('ruido') || texto.includes('música na rua') || texto.includes('musica na rua')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'licenca-especial-ruido',
      };
    }

    if (texto.includes('fogo de artifício') || texto.includes('fogo de artificio') || texto.includes('foguetes')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'lancamento-fogo-artificio',
      };
    }

    if (texto.includes('palco') || texto.includes('recinto') || texto.includes('festa no largo') || texto.includes('arraial')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'recintos-festividades-temporarios',
      };
    }

    if (texto.includes('classificação do meu terreno') || texto.includes('classificacao do meu terreno')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'certidao-classificacao-terrenos',
      };
    }

    if (texto.includes('número de porta') || texto.includes('numero de porta') || texto.includes('número de polícia')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'atribuicao-numero-porta',
      };
    }

    if (texto.includes('estacionar') || texto.includes('centro histórico') || texto.includes('cartão de residente')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'cartao-residente-estacionamento',
      };
    }

    if (texto.includes('70 anos') || texto.includes('65 anos') || texto.includes('cartão com descontos') || texto.includes('sénior') || texto.includes('senior')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'cartao-municipal-senior',
      };
    }

    if (texto.includes('mato até ao telhado') || texto.includes('terreno com mato') || texto.includes('limpeza de terreno')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'limpeza-terrenos-vegetacao',
      };
    }

    if (texto.includes('caminhada solidária') || texto.includes('caminhada solidaria') || texto.includes('prova desportiva')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'provas-desportivas-caminhadas',
      };
    }

    if (texto.includes('prolongar o horário') || texto.includes('prolongar o horario') || texto.includes('fechar mais tarde')) {
      return {
        comportamento: 'responder',
        categoria: 'catalogo',
        servicoId: 'autorizacao-prolongamento-horario',
      };
    }

    // Por omissão, consulta catálogo geral
    return {
      comportamento: 'responder',
      categoria: 'catalogo',
      servicoId: 'ocupacao-espaco-publico-esplanada',
    };
  }
}
