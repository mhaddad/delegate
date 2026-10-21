/**
 * O catálogo de eventos. Cada tipo existe porque um facto aconteceu e alguém
 * precisa de o ver acontecer — nunca porque um ecrã precisa de se mexer.
 *
 * Prioridade M: entra na demonstração. S: existe no contrato, emite-se depois.
 */

export type Prioridade = 'M' | 'S';

export interface Entrada {
  tipo: string;
  origem: string;
  prioridade: Prioridade;
  /** Para que serve, numa linha. */
  porque: string;
}

export const CATALOGO = [
  // Canal
  { tipo: 'canal.mensagem.recebida', origem: 'canal', prioridade: 'M', porque: 'A pessoa escreveu algo.' },
  { tipo: 'canal.mensagem.enviada', origem: 'canal', prioridade: 'M', porque: 'O Henriques respondeu.' },
  { tipo: 'canal.botao.carregado', origem: 'canal', prioridade: 'M', porque: 'A pessoa decidiu com um botão.' },

  // Henriques
  { tipo: 'henriques.intencao.classificada', origem: 'henriques', prioridade: 'M', porque: 'O pedido foi reduzido a um serviço.' },
  { tipo: 'henriques.resposta.redigida', origem: 'henriques', prioridade: 'M', porque: 'A resposta foi escrita a partir dos excertos.' },
  { tipo: 'henriques.resposta.verificada', origem: 'henriques', prioridade: 'M', porque: 'Cada afirmação foi verificada contra a fonte.' },
  { tipo: 'henriques.resposta.abstencao', origem: 'henriques', prioridade: 'M', porque: 'Não há fonte; o Henriques diz que não sabe.' },

  // Missão
  { tipo: 'missao.criada', origem: 'orquestrador', prioridade: 'M', porque: 'Um pedido passou a missão.' },
  { tipo: 'missao.estado.alterado', origem: 'orquestrador', prioridade: 'M', porque: 'A missão mudou de estado.' },
  { tipo: 'missao.checklist.gerada', origem: 'orquestrador', prioridade: 'M', porque: 'A ficha virou uma lista de passos.' },

  // Cofre
  { tipo: 'cofre.item.proposto', origem: 'cofre', prioridade: 'M', porque: 'O Henriques sugeriu guardar; ainda não é da pessoa.' },
  { tipo: 'cofre.item.guardado', origem: 'cofre', prioridade: 'M', porque: 'A pessoa autorizou; o conteúdo ficou cifrado.' },
  { tipo: 'cofre.item.recusado', origem: 'cofre', prioridade: 'M', porque: 'A pessoa disse que não.' },
  { tipo: 'cofre.item.apagado', origem: 'cofre', prioridade: 'S', porque: 'A pessoa apagou um item.' },
  { tipo: 'cofre.chave.libertada', origem: 'cofre', prioridade: 'M', porque: 'A chave saiu, por prazo, só para esta missão.' },
  { tipo: 'cofre.chave.recolhida', origem: 'cofre', prioridade: 'M', porque: 'O prazo terminou e a chave voltou a fechar.' },
  { tipo: 'cofre.pacote.preparado', origem: 'cofre', prioridade: 'M', porque: 'Selecionado o mínimo necessário.' },
  { tipo: 'cofre.pacote.aprovado', origem: 'cofre', prioridade: 'M', porque: 'A pessoa aprovou o que sai e o que não sai.' },

  // Mandatos
  { tipo: 'mandato.proposto', origem: 'mandatos', prioridade: 'M', porque: 'O Henriques propôs âmbito e nível.' },
  { tipo: 'mandato.concedido', origem: 'mandatos', prioridade: 'M', porque: 'A pessoa concedeu, com nível e validade.' },
  { tipo: 'mandato.recusado', origem: 'mandatos', prioridade: 'M', porque: 'A pessoa não concedeu.' },
  { tipo: 'mandato.revogado', origem: 'mandatos', prioridade: 'S', porque: 'A pessoa retirou a autorização.' },

  // Política
  { tipo: 'politica.decisao', origem: 'politica', prioridade: 'M', porque: 'A política permitiu, confirmou ou bloqueou.' },

  // Porta e sistemas
  { tipo: 'porta.servicos.procurados', origem: 'porta', prioridade: 'M', porque: 'Entrou uma procura no catálogo da Porta.' },
  { tipo: 'porta.servico.obtido', origem: 'porta', prioridade: 'M', porque: 'A ficha oficial saiu da Porta, com versão.' },
  { tipo: 'porta.capacidade.chamada', origem: 'porta', prioridade: 'M', porque: 'Uma capacidade foi exercida, com mandato verificado.' },
  { tipo: 'porta.acesso.recusado', origem: 'porta', prioridade: 'M', porque: 'Faltava mandato; a Porta recusou.' },
  { tipo: 'su.processo.criado', origem: 'su', prioridade: 'M', porque: 'Nasceu um processo nos Serviços Urbanos.' },
  { tipo: 'su.processo.estado.alterado', origem: 'su', prioridade: 'M', porque: 'O processo mudou de estado.' },
  { tipo: 'tesouraria.referencia.emitida', origem: 'tesouraria', prioridade: 'S', porque: 'Saiu uma referência fictícia.' },

  // Consola
  { tipo: 'consola.caso.criado', origem: 'consola', prioridade: 'M', porque: 'Um caso entrou na fila da técnica.' },
  { tipo: 'consola.caso.aberto', origem: 'consola', prioridade: 'M', porque: 'A técnica abriu o caso.' },
  { tipo: 'consola.caso.decidido', origem: 'consola', prioridade: 'M', porque: 'Uma pessoa decidiu, com fundamento.' },

  // Proatividade, intenções, auditoria, avaliação
  { tipo: 'proatividade.alerta.enviado', origem: 'proatividade', prioridade: 'S', porque: 'O Henriques escreveu sem ser chamado, e disse porquê.' },
  { tipo: 'proatividade.alerta.desligado', origem: 'proatividade', prioridade: 'S', porque: 'A pessoa desligou um alerta.' },
  { tipo: 'intencoes.agregado.atualizado', origem: 'intencoes', prioridade: 'S', porque: 'Uma intenção consentida mudou o agregado.' },
  { tipo: 'auditoria.integridade.verificada', origem: 'avaliacao', prioridade: 'S', porque: 'A cadeia de selos foi verificada de ponta a ponta.' },
  { tipo: 'avaliacao.execucao.concluida', origem: 'avaliacao', prioridade: 'M', porque: 'O conjunto de avaliação correu e há métricas.' },
] as const satisfies readonly Entrada[];

const POR_TIPO = new Map<string, Entrada>(CATALOGO.map((e) => [e.tipo, e]));

export function procurarEvento(tipo: string): Entrada | undefined {
  return POR_TIPO.get(tipo);
}

export const TIPOS = CATALOGO.map((e) => e.tipo);

/** Os tipos que a demonstração precisa de ver acontecer. */
export const TIPOS_DA_DEMO = CATALOGO.filter((e) => e.prioridade === 'M').map((e) => e.tipo);

/** As origens que o Observatório desenha no grafo. */
export const NOS_DO_GRAFO = [...new Set(CATALOGO.map((e) => e.origem))];