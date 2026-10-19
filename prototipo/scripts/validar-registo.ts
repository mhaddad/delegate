/**
 * Valida o Registo Canónico.
 *
 * Sai limpo quando as fichas passam o esquema e nenhum número ficou sem fonte.
 * As fontes por curar não são erro — mas são contadas, para que ninguém diga
 * que a curadoria está feita quando não está.
 *
 *   npm run registo:validar
 *   npm run registo:validar -- --estrito    # também falha por fontes por curar
 */
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { Servico, pendencias, type Pendencia } from '../registo/esquema.ts';

const PASTA = resolve(import.meta.dirname, '../registo');
const estrito = process.argv.includes('--estrito');

interface Problema {
  ficheiro: string;
  mensagem: string;
}

const problemas: Problema[] = [];
const porCurar: Pendencia[] = [];
const fichas: string[] = [];

for (const ficheiro of (await readdir(PASTA)).filter((f) => f.endsWith('.yaml')).sort()) {
  const bruto = await readFile(resolve(PASTA, ficheiro), 'utf-8');
  let dados: unknown;
  try {
    dados = parse(bruto);
  } catch (erro) {
    problemas.push({ ficheiro, mensagem: `YAML inválido: ${(erro as Error).message}` });
    continue;
  }

  const resultado = Servico.safeParse(dados);
  if (!resultado.success) {
    for (const issue of resultado.error.issues) {
      problemas.push({
        ficheiro,
        mensagem: `${issue.path.join('.') || 'ficha'}: ${issue.message}`,
      });
    }
    continue;
  }

  fichas.push(resultado.data.id);
  porCurar.push(...pendencias(resultado.data, ficheiro));
}

console.log(`\n${fichas.length} ficha(s) válidas: ${fichas.join(', ')}\n`);

if (porCurar.length > 0) {
  console.log(`por curar (${porCurar.length}) — a curadoria ainda não está feita:`);
  for (const p of porCurar) console.log(`  · ${p.servico}: ${p.o_que}`);
  console.log('');
}

if (problemas.length > 0) {
  console.error(`✖ ${problemas.length} problema(s):`);
  for (const p of problemas) console.error(`  ${p.ficheiro} → ${p.mensagem}`);
  process.exit(1);
}

if (estrito && porCurar.length > 0) {
  console.error('✖ --estrito: há fontes por curar.');
  process.exit(1);
}

console.log('✓ Registo Oficial válido: nenhum número sem fonte.');
process.exit(0);