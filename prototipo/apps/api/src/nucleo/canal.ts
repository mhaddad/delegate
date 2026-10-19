/**
 * O canal: a única coisa do protótipo que fala com o Telegram.
 *
 * Por baixo de uma interface de cinco métodos, para que a lógica do Afonso
 * nunca saiba com quem está a falar. É isto que permite escrever e testar as
 * respostas sem token e sem telemóvel.
 *
 * Ver CANAL.md nestedirectório antes de mexer.
 */
import { Bot, GrammyError, HttpError, type Context } from 'grammy';
import { createHmac } from 'node:crypto';

/** Chave dos pseudónimos. Só a sessão a conhece, por isso não é reversível. */
const SEGREDO_DA_SESSAO = process.env.SESSAO ?? 'demo';

/** De onde veio a mensagem. Nunca se adivinha pelo conteúdo. */
export type TipoEntrada = 'texto' | 'comando' | 'foto' | 'documento' | 'botao';

/** Uma actualização recebida do canal, já normalizada. */
export interface MensagemRecebida {
  /** Pseudónimo da pessoa. Nunca o identificador do Telegram. */
  pessoa: string;
  tipo: TipoEntrada;
  /** Texto, se houver. */
  texto: string | null;
  /** Identificador da foto, se houver. Nunca descarregamos bytes. */
  foto: string | null;
  /** Metadados do documento/PDF se houver. */
  documento?: { nome: string; mime?: string; id: string } | null;
  /** Fila onde veio, para onde vai a resposta. */
  conversa: string;
  /** Data em ISO, do próprio Telegram. */
  quando: string;
}

/** Um botão de decisão. */
export interface Botao {
  texto: string;
  /** O que devolve ao Afonso. Tem de caber em 64 bytes. */
  dados?: string;
  ligacao?: string;
}

/** Botões em linhas: a primeira lista é a primeira linha. */
export type Botoes = Botao[][];

export interface Canal {
  /** Liga o canal. Devolve quando deixa de receber. */
  ligar(): Promise<void>;
  /** Envia uma mensagem. */
  enviar(conversa: string, texto: string, botoes?: Botoes): Promise<void>;
  /** Substitui o texto de uma mensagem já enviada. */
  editar(conversa: string, mensagem: number, texto: string, botoes?: Botoes): Promise<void>;
  /** Mostra «a escrever» sem mandar mensagem. */
  aEscrever(conversa: string): Promise<void>;
}

/**
 * O Telegram manda HTML, e um `>` por extenso rejeita a mensagem inteira.
 * Como o Afonso interpola texto que veio da pessoa, isto não é opcional.
 */
export function escapar(texto: string): string {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function paraBotoes(botoes?: Botoes) {
  if (!botoes) return undefined;
  return {
    inline_keyboard: botoes.map((linha) =>
      linha.map((b) =>
        b.ligacao && !b.ligacao.includes('localhost') && !b.ligacao.includes('127.0.0.1')
          ? { text: b.texto, url: b.ligacao }
          : { text: b.texto, callback_data: b.dados ?? b.texto },
      ),
    ),
  };
}

/**
 * O pseudónimo é derivado do identificador do Telegram, e nunca sai o
 * identificador em claro.
 *
 * Codificar o número em base 36 não é pseudonymizar: com o pseudónimo à vista,
 * quem sabe converter recupera o número original. Por isso o derivado passa por
 * um resumo com chave, que não é reversível — e a chave muda de sessão, de modo
 * que o mesmo identificador dá pseudónimos diferentes em réplicas diferentes.
 */
function pseudonimo(id: number | undefined): string {
  if (id === undefined) return 'anonimo-0000';
  const resumo = createHmac('sha256', SEGREDO_DA_SESSAO).update(String(id)).digest('hex');
  return `pessoa-${resumo.slice(0, 10)}`;
}

/** Chamado por cada mensagem ou botão que chega. */
export type AoReceber = (m: MensagemRecebida) => void | Promise<void>;

export interface CanalGrammy extends Canal {
  parar(): Promise<void>;
  _aoReceber(f: AoReceber): void;
}

export function criarCanalGrammy(token: string): CanalGrammy {
  const bot = new Bot(token);

  let aoReceber: AoReceber = () => {};

  const registar = (bot: Bot) => {
    bot.on('message:text', async (ctx) => {
      await aoReceber({
        pessoa: pseudonimo(ctx.from?.id),
        tipo: ctx.message.text.startsWith('/') ? 'comando' : 'texto',
        texto: ctx.message.text,
        foto: null,
        conversa: String(ctx.chat.id),
        quando: new Date(ctx.message.date * 1000).toISOString(),
      });
    });

    bot.on('message:photo', async (ctx) => {
      // A última da lista é a maior. O Telegram não nos dá os bytes, dá-nos
      // referências — e o identificador pode ser reenviado sem limite.
      const maior = ctx.msg.photo?.at(-1);
      await aoReceber({
        pessoa: pseudonimo(ctx.from?.id),
        tipo: 'foto',
        texto: ctx.msg.caption ?? null,
        foto: maior?.file_id ?? null,
        conversa: String(ctx.chat.id),
        quando: new Date(ctx.msg.date * 1000).toISOString(),
      });
    });

    bot.on('message:document', async (ctx) => {
      const doc = ctx.msg.document;
      await aoReceber({
        pessoa: pseudonimo(ctx.from?.id),
        tipo: 'documento',
        texto: ctx.msg.caption ?? doc?.file_name ?? null,
        foto: null,
        documento: doc ? { nome: doc.file_name ?? 'documento.pdf', mime: doc.mime_type, id: doc.file_id } : null,
        conversa: String(ctx.chat.id),
        quando: new Date(ctx.msg.date * 1000).toISOString(),
      });
    });

    // Um clique é uma mensagem. Mas primeiro responde-se ao clique: o Telegram
    // deixa o relógio a correr no botão durante 30 segundos, e em palco isso
    // vê-se. A resposta sai daqui, antes de qualquer lógica, para que uma
    // falha de negócio nunca deixe a interface pendurada.
    bot.on('callback_query:data', async (ctx) => {
      await ctx.answerCallbackQuery().catch(() => {});
      await aoReceber({
        pessoa: pseudonimo(ctx.from?.id),
        tipo: 'botao',
        texto: ctx.callbackQuery.data,
        foto: null,
        conversa: String(ctx.callbackQuery.message?.chat.id ?? ctx.chat?.id ?? 0),
        quando: new Date().toISOString(),
      });
    });
  };
  registar(bot);

  // Sem isto, o primeiro erro mata o bot — e a biblioteca avisa disso.
  bot.catch((err) => {
    const erro = err.error;
    if (erro instanceof GrammyError) {
      if (erro.error_code === 409) {
        // Outro processo vivo com este token. A recuperação é matá-lo e arrancar.
        console.error('⚠ 409 — outro processo está a usar este token. Mata-o e arranca de novo.');
        return;
      }
      console.error('✖ Telegram:', erro.error_code, erro.description);
    } else if (erro instanceof HttpError) {
      console.error('✖ Rede:', erro.error);
    } else {
      console.error('✖ Handler:', err);
    }
  });

  return {
    async ligar() {
      // Descarta o que ficou na fila. Sem isto, acordar o portátil despeja
      // mensagens velhas de uma vez e o júri vê cinquenta respostas do dia anterior.
      await bot.api.deleteWebhook({ drop_pending_updates: true });

      const eu = await bot.api.getMe();
      console.log(`ligado a @${eu.username} — espera mensagens`);

      // start(), nunca run(): a versão concorrente pode perder mensagens.
      await bot.start({
        drop_pending_updates: false,
        onStart: (info) => console.log(`@${info.username} em modo escuta`),
      });
    },

    async enviar(conversa, texto, botoes) {
      const teclado = paraBotoes(botoes);
      await bot.api.sendMessage(conversa, texto, {
        parse_mode: 'HTML',
        ...(teclado ? { reply_markup: teclado } : {}),
      });
    },

    async editar(conversa, mensagem, texto, botoes) {
      const teclado = paraBotoes(botoes);
      await bot.api.editMessageText(conversa, mensagem, texto, {
        parse_mode: 'HTML',
        ...(teclado ? { reply_markup: teclado } : {}),
      });
    },

    async aEscrever(conversa) {
      await bot.api.sendChatAction(Number(conversa), 'typing');
    },

    async parar() {
      await bot.stop();
    },

    /** Só para o ponto de entrada de testes. */
    _aoReceber(f: AoReceber) {
      aoReceber = f;
    },
  };
}

/** Contexto cru, só para o que ainda não cabia na interface. */
export type ContextoTelegram = Context;