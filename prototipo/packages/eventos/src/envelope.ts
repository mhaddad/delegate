/**
 * O envelope de evento — a espinha dorsal do protótipo.
 *
 * O mesmo registo alimenta o Observatório, a Consola e a auditoria. Tudo o que
 * está aqui é congelado: ver o AGENTS.md deste pacote antes de mexer.
 *
 * Regras de privacidade que o esquema impõe:
 *  - `pessoa` é um pseudónimo, nunca um identificador de canal;
 *  - `dados` nunca leva conteúdo do Cofre em claro;
 *  - texto de conversa só aparece em eventos `canal.*`.
 */
import { z } from 'zod';

/** As origens possíveis. Cada evento pertence exactamente a uma. */
export const ORIGENS = [
  'canal',
  'henriques',
  'orquestrador',
  'politica',
  'cofre',
  'mandatos',
  'porta',
  'su',
  'tesouraria',
  'consola',
  'proatividade',
  'intencoes',
  'avaliacao',
] as const;

/**
 * Tipo do evento em minúsculas, com dois ou mais segmentos: `canal.mensagem.recebida`,
 * `politica.decisao`, `su.processo.estado.alterado`.
 *
 * O documento descreve o formato como `dominio.entidade.acao`, mas o catálogo
 * usa dois segmentos onde a terceira parte não acrescenta nada e quatro onde a
 * hierarquia é mais fina. O esquema acomoda o que o catálogo faz.
 */
export const TipoEvento = z
  .string()
  .regex(/^[a-z_]+(\.[a-z_]+)+$/, 'o tipo tem de ter dois ou mais segmentos minúsculos');

export const Origem = z.enum(ORIGENS);

/**
 * Quem age. O documento admite um sufixo que identifica o passo — como
 * `agente:navegador-regras` —, que é o que dá sentido ao nó no grafo.
 */
export const Ator = z
  .string()
  .regex(
    /^(pessoa|tecnica|agente|sistema)(:[a-z-]+)?$/,
    'o ator e um de pessoa, tecnica, agente, sistema, com sufixo opcional',
  );

/** Pseudónimo derivado, nunca o identificador de canal em claro. */
export const Pessoa = z
  .string()
  .regex(/^[a-z]+[-_][0-9a-z_]+$/, 'o pseudónimo tem de ser nome-sufixo')
  .nullable();

/** Os campos do envelope, sem as regras que dependem uns dos outros. */
const Base = z.object({
  /** Versão do contrato. Só muda numa alteração incompatível. */
  v: z.literal(1),
  id: z.string().min(1),
  ts: z.string(),
  tipo: TipoEvento,
  origem: Origem,
  sessao: z.string().min(1),
  missao: z.string().nullable(),
  pessoa: Pessoa.nullable(),
  ator: Ator,
  simulacao: z.boolean(),
  dados: z.record(z.string(), z.unknown()),
  /** Hash do evento anterior. O primeiro da sessão é nulo. */
  hash_anterior: z.string().nullable(),
  /** SHA-256 do envelope sem este campo. O selo. */
  hash: z.string(),
});

export const Envelope = Base.superRefine((evento, ctx) => {
    // O documento de modelo de dados pede que o evento de auditoria leve
    // mandato, fontes e resultado. O envelope é congelado e já tem eventos
    // gravados — por isso viajam dentro de `dados`, e o esquema obriga a que
    // estejam lá. Sem esta refine, seriam um aviso; com ela, um erro.
    const auditoria = evento.tipo === 'porta.capacidade.chamada';
    const acesso = evento.tipo.startsWith('porta.');

    const exigir = (campo: string) => {
      if (evento.dados[campo] === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['dados', campo],
          message: `um evento ${evento.tipo} tem de trazer dados.${campo} — é o que a auditoria exige`,
        });
      }
    };

    if (acesso) {
      exigir('mandato');
      exigir('fontes');
    }
    if (auditoria) exigir('resultado');
  });

export type Envelope = z.infer<typeof Envelope>;
export type Evento = Envelope;

/**
 * O que um componente pede ao registar, antes de o selo ser posto.
 *
 * Sai da base, e não do envelope já refinado: o Zod não deixa tornar parcial
 * um esquema que tem regras cruzadas entre campos.
 */
export const Pedido = Base.partial({
  v: true,
  simulacao: true,
  id: true,
  ts: true,
  hash_anterior: true,
  hash: true,
});
export type Pedido = z.infer<typeof Pedido>;
export type EventoSemIdOuSelo = Pedido;

/** O que o Postgres devolve, com o número de sequência. */
export type EventoGuardado = Envelope & { seq: number };