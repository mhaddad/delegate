/**
 * @delegate/eventos — o contrato de eventos do Delegate.
 *
 * Regras de uso: ver o AGENTS.md deste pacote. O resumo:
 *  - um evento por facto, nunca para enfeitar um ecrã;
 *  - pseudónimo, nunca identificador de canal;
 *  - conteúdo do Cofre nunca em claro;
 *  - `simulacao` verdadeiro sempre que venha de um sistema ou ato simulado.
 */
export { Envelope, Pedido, Origem, TipoEvento, Ator, Pessoa, ORIGENS } from './envelope.ts';
export type { EventoGuardado, Evento, EventoSemIdOuSelo } from './envelope.ts';
export { calcularHash, selar, verificarCadeia } from './selo.ts';
export type { Verificacao } from './selo.ts';
export { CATALOGO, TIPOS, TIPOS_DA_DEMO, NOS_DO_GRAFO, procurarEvento } from './catalogo.ts';
export type { Entrada, Prioridade } from './catalogo.ts';

// Reexportar não traz o nome para o âmbito local: para o filtrar é preciso
// importá-lo à parte.
import { TIPOS } from './catalogo.ts';
import legendas from './legendas.json' with { type: 'json' };

const LEGENDAS = legendas as Record<string, string>;

/** A legenda de um evento, escrita por quem tem o conteúdo. */
export function legenda(tipo: string): string | undefined {
  return LEGENDAS[tipo];
}

export { LEGENDAS };

/** Eventos sem legenda não aparecem no Observatório em modo narrativo. */
export const TIPOS_SEM_LEGENDA = TIPOS.filter((t) => !legenda(t));