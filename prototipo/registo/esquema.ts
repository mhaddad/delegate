/**
 * O esquema do Registo Canónico.
 *
 * Uma ficha por serviço, no formato do modelo de dados. O esquema não é
 * burocracia: é o que garante que nenhum número entra sem a fonte ao lado, e
 * que nenhuma fonte é citada sem existir.
 *
 * A regra que mais importa: **um valor sem fonte é um erro, não um aviso.**
 * Tudo o resto o esquema aceita e o validador conta.
 */
import { z } from 'zod';

export const ESTADO = z.enum(['rascunho', 'revisto', 'validado']);
export const COMPETENCIA = z.enum(['camara', 'entidade_municipal', 'administracao_central']);
export const NIVEL_RISCO = z.enum(['baixo', 'medio', 'alto']);

export const Fonte = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  /** Onde está. Nulo enquanto a curadoria não a trouxer. */
  url: z.string().url().nullable(),
  /** Formato AAAA-MM-DD. */
  consultado_em: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** sha256 do conteúdo consultado. Nulo enquanto não foi conferido. */
  hash: z.string().regex(/^sha256:[0-9a-f]{64}$/).nullable(),
  /** De onde veio: página oficial, tabela de taxas, corpus. */
  natureza: z.enum(['oficial', 'tabela_taxas', 'corpus', 'regulamento']).default('oficial'),
});

export const Condicao = z.object({
  texto: z.string().min(1),
  /** Tem de resolver para um id de `fontes` da mesma ficha. */
  fonte: z.string().min(1),
});

export const Documento = z.object({
  texto: z.string().min(1),
  fonte: z.string().min(1),
});

export const Prazo = z.object({
  texto: z.string().min(1),
  fonte: z.string().min(1),
});

export const Canal = z.object({
  tipo: z.enum(['online', 'presencial', 'email', 'postal', 'telefone']),
  descricao: z.string().min(1),
  url: z.string().url().nullable(),
  fonte: z.string().min(1),
});

export const Taxas = z.object({
  descricao: z.string().min(1),
  /** Nulo quando a fonte não dá um valor único. Nunca estimado. */
  valor: z.number().nonnegative().nullable(),
  fonte: z.string().nullable(),
  /** A unidade, quando o valor não é um total. */
  unidade: z.string().nullable().default(null),
});

export const Curadoria = z.object({
  por: z.string().min(1),
  em: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notas: z.string().default(''),
});

export const Servico = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    versao: z.string().regex(/^\d{4}-\d{2}-\d{2}\.\d+$/),
    estado: ESTADO,
    entidade: z.string().min(1),
    competencia: COMPETENCIA,
    unidade_responsavel: z.string().min(1),
    titulo_oficial: z.string().min(1),
    titulo_simples: z.string().min(1),
    sinonimos: z.array(z.string().min(1)).default([]),
    publico: z.array(z.string().min(1)).default([]),
    eventos_de_vida: z.array(z.string().min(1)).default([]),
    tipo_procedimento: z.string().min(1),
    condicoes: z.array(Condicao).default([]),
    documentos: z.array(Documento).default([]),
    taxas: Taxas,
    prazos: z.array(Prazo).default([]),
    canais: z.array(Canal).default([]),
    dados_minimos: z.array(z.string().min(1)).default([]),
    nivel_risco: NIVEL_RISCO,
    escalonamento: z.string().default(''),
    limites: z.string().default(''),
    fontes: z.array(Fonte).min(1),
    curadoria: Curadoria,
  })
  .superRefine((ficha, ctx) => {
    const ids = new Set(ficha.fontes.map((f) => f.id));

    const resolver = (campo: string, referencia: string) => {
      if (!ids.has(referencia)) {
        ctx.addIssue({
          code: 'custom',
          message: `${campo} aponta para a fonte «${referencia}», que não existe nesta ficha`,
        });
      }
    };

    ficha.condicoes.forEach((c, i) => resolver(`condicoes[${i}].fonte`, c.fonte));
    ficha.documentos.forEach((d, i) => resolver(`documentos[${i}].fonte`, d.fonte));
    ficha.prazos.forEach((p, i) => resolver(`prazos[${i}].fonte`, p.fonte));
    ficha.canais.forEach((c, i) => resolver(`canais[${i}].fonte`, c.fonte));

    // A regra que dá sentido ao projecto: valor sem fonte não entra.
    if (ficha.taxas.valor !== null && !ficha.taxas.fonte) {
      ctx.addIssue({
        code: 'custom',
        path: ['taxas', 'fonte'],
        message: 'a taxa tem valor mas não tem fonte — ou fica nula, ou cita a fonte',
      });
    }
    if (ficha.taxas.fonte) resolver('taxas.fonte', ficha.taxas.fonte);

    // Só a Câmara valida. No R0, ninguém escreve «validado».
    if (ficha.estado === 'validado') {
      ctx.addIssue({
        code: 'custom',
        path: ['estado'],
        message: '«validado» é da Câmara e só no piloto; no R0 o máximo é «revisto»',
      });
    }
  });

export type Servico = z.infer<typeof Servico>;
export type Fonte = z.infer<typeof Fonte>;

export interface Pendencia {
  ficheiro: string;
  servico: string;
  o_que: string;
}

/** O que falta curar. Não impede a ficha de servir, mas tem de ser visível. */
export function pendencias(ficha: Servico, ficheiro: string): Pendencia[] {
  const porCurar: Pendencia[] = [];
  const add = (oQue: string) =>
    porCurar.push({ ficheiro, servico: ficha.id, o_que: oQue });

  for (const fonte of ficha.fontes) {
    if (!fonte.url) add(`fonte «${fonte.id}» sem endereço`);
    if (!fonte.hash) add(`fonte «${fonte.id}» sem hash do conteúdo`);
  }
  if (ficha.estado === 'rascunho') add('ficha ainda em rascunho');
  return porCurar;
}