/**
 * Ponto de entrada de desenvolvimento: liga o canal e imprime o que chega.
 *
 * É o primeiro teste do protótipo — mensagem do telemóvel para cá.
 * Não emite eventos, não toca na base de dados, não chama a Porta. Só prova
 * que o canal funciona.
 *
 *   npm run ouvir
 */
import { criarCanalGrammy, escapar, type CanalGrammy } from './canal.ts';

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

if (!token) {
  console.error(`
✖ Falta o TELEGRAM_BOT_TOKEN.

  1. No Telegram, abre @BotFather e manda /newbot
  2. Escolhe um nome visível e um username que termine em «bot»
  3. Copia o token para delegate/.env, numa linha:

     TELEGRAM_BOT_TOKEN=1234567890:AA...

  Para criar o ficheiro à mão, copia e cola esta linha no terminal
  (substitui o que estiver entre parênteses pelo token que o BotFather te deu):

     echo 'TELEGRAM_BOT_TOKEN=<COLA AQUI O TOKEN>' > delegate/.env

  O .env não vai para o git.
`);
  process.exit(1);
}

const canal: CanalGrammy = criarCanalGrammy(token);
const comFoto = process.argv.includes('--com-foto');

canal._aoReceber(async (m) => {
  const hora = m.quando.slice(11, 19);
  console.log(`\n───── ${hora} ─────`);
  console.log(`pessoa   ${m.pessoa}`);
  console.log(`conversa ${m.conversa}`);
  if (m.texto) console.log(`texto    ${m.texto}`);
  if (m.foto) console.log(`foto     ${comFoto ? m.foto.slice(0, 40) + '…' : '(recebida — corre com --com-foto para ver o identificador)'}`);

  // Uma resposta simples, para se ver que o caminho de volta também funciona.
  if (m.texto && !m.texto.startsWith('/')) {
    await canal.enviar(
      m.conversa,
      `Recebi: <i>${escapar(m.texto)}</i>`,
      [
        [
          { texto: '📸 Enviar uma foto', dados: 'foto' },
          { texto: '🔘 Um botão', dados: 'botao' },
        ],
      ],
    );
  }
});

process.once('SIGINT', () => {
  console.log('\nparado');
  process.exit(0);
});

try {
  await canal.ligar();
} catch (err) {
  // Um token inválido é o erro mais provável, e a diferença entre 401 e 404
  // diz qual dos dois erros foi: token errado, ou token que não existe.
  const e = err as { error_code?: number; description?: string };
  if (e.error_code === 401) {
    console.error(`
✖ O Telegram recusou o token (401 Unauthorized).

  O token está mal copiado, ou já foi revogado.
  No @BotFather, /token gera um novo — e o antigo deixa de funcionar.
`);
  } else if (e.error_code === 404) {
    console.error(`
✖ O Telegram não encontra este bot (404).

  O token tem o formato errado. Copia-o de novo, sem espaços antes ou depois.
`);
  } else {
    console.error('\n✖ Não foi possível ligar ao Telegram:', e.description ?? err, '\n');
  }
  process.exit(1);
}