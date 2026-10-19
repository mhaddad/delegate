/**
 * O servidor de eventos. Entrega o fluxo ao Observatório por SSE.
 *
 * O canal é unidireccional — o ecrã só recebe. Por isso nada de WebSocket.
 *
 * Cada evento leva `id:` para que, se a ligação cair, o browser diga de onde
 * quer recomeçar. E o browser reconstrói a ligação sozinho se esta parar: sem
 * isso, um erro do lado do servidor deixa o Observatório congelado e não sai
 * ninguém sem perceber porquê.
 */
import { createServer, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import type { Registo } from './registo.ts';

const CABECALHOS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  // Impede proxies de guardarem o fluxo em buffer — o evento fica preso lá.
  'X-Accel-Buffering': 'no',
};

const WEB = new URL('../../../../web/', import.meta.url);

const MIMES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const ESTATICOS: Record<string, { ficheiro: string; tipo: string }> = {
  '/': { ficheiro: 'index.html', tipo: 'text/html; charset=utf-8' },
  '/index.html': { ficheiro: 'index.html', tipo: 'text/html; charset=utf-8' },
  '/consola': { ficheiro: 'consola.html', tipo: 'text/html; charset=utf-8' },
  '/consola.html': { ficheiro: 'consola.html', tipo: 'text/html; charset=utf-8' },
  '/porta': { ficheiro: 'delegate.html', tipo: 'text/html; charset=utf-8' },
  '/porta.html': { ficheiro: 'delegate.html', tipo: 'text/html; charset=utf-8' },
  '/delegate': { ficheiro: 'delegate.html', tipo: 'text/html; charset=utf-8' },
  '/delegate.html': { ficheiro: 'delegate.html', tipo: 'text/html; charset=utf-8' },
  '/intermediario': { ficheiro: 'delegate.html', tipo: 'text/html; charset=utf-8' },
  '/intermediario.html': { ficheiro: 'delegate.html', tipo: 'text/html; charset=utf-8' },
  '/cmd': { ficheiro: 'cmd.html', tipo: 'text/html; charset=utf-8' },
  '/cmd.html': { ficheiro: 'cmd.html', tipo: 'text/html; charset=utf-8' },
  '/autenticacao': { ficheiro: 'cmd.html', tipo: 'text/html; charset=utf-8' },
  '/legendas.json': { ficheiro: 'legendas.json', tipo: 'application/json; charset=utf-8' },
  '/favicon.ico': { ficheiro: 'assets/favicon.png', tipo: 'image/png' },
  '/favicon.png': { ficheiro: 'assets/favicon.png', tipo: 'image/png' },
};

export interface DadosConfirmacaoCmd {
  pessoa: string;
  servico?: string;
  processo?: string;
  token_cmd: string;
  nif?: string;
  nome?: string;
}

/**
 * Serve o Observatório, a Consola, a Chave Móvel Digital e o fluxo de eventos.
 */
export function criarServidorEventos(
  registro: Registo,
  abrirEscuta: () => Promise<pg.Client>,
  aoConfirmarCmd?: (dados: DadosConfirmacaoCmd) => Promise<void>,
) {
  return createServer((req, res) => {
    void (async () => {
      const caminho = req.url?.split('?')[0] ?? '/';

      // 1. Confirmação de Chave Móvel Digital (POST)
      if (caminho === '/cmd/confirmar' && req.method === 'POST') {
        let corpo = '';
        for await (const pedaco of req) corpo += pedaco;
        let dados: DadosConfirmacaoCmd = { pessoa: 'ines_guimaraes', token_cmd: 'CMD-TOKEN-VAL' };
        try {
          dados = JSON.parse(corpo);
        } catch (_) {}
        if (aoConfirmarCmd) {
          try {
            await aoConfirmarCmd(dados);
          } catch (err) {
            console.warn('[CMD] Erro ao processar confirmação:', err);
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: true, token: dados.token_cmd }));
        return;
      }

      // 2. Ficheiros estáticos mapeados
      const estatico = ESTATICOS[caminho];
      if (estatico) {
        try {
          const corpo = await readFile(new URL(estatico.ficheiro, WEB));
          res.writeHead(200, { 'Content-Type': estatico.tipo, 'Cache-Control': 'no-store' });
          res.end(corpo);
          return;
        } catch {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('falta o ficheiro da interface');
          return;
        }
      }

      // 3. Ficheiros sob /assets/
      if (caminho.startsWith('/assets/')) {
        const subcaminho = caminho.replace(/^\/assets\//, '');
        const ext = subcaminho.slice(subcaminho.lastIndexOf('.')).toLowerCase();
        const tipo = MIMES[ext] ?? 'application/octet-stream';
        try {
          const corpo = await readFile(new URL(`assets/${subcaminho}`, WEB));
          res.writeHead(200, { 'Content-Type': tipo, 'Cache-Control': 'public, max-age=3600' });
          res.end(corpo);
          return;
        } catch {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('recurso não encontrado');
          return;
        }
      }

      if (!req.url?.startsWith('/eventos/stream')) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('não encontrado');
        return;
      }

      res.writeHead(200, CABECALHOS);
      res.write('retry: 1000\n\n');

      // O browser diz de onde quer recomeçar, se a ligação caiu a meio, e em
      // que sessão quer o fluxo.
      const pergunta = new URL(req.url, 'http://localhost').searchParams;
      const cru = Number(pergunta.get('desde') ?? '0');
      const desde = Number.isSafeInteger(cru) && cru >= 0 ? cru : 0;
      const sessao = pergunta.get('sessao') ?? undefined;

      // Primeiro o que se perdeu, depois o que chega.
      for (const evento of await registro.desde(desde, 200, sessao)) {
        res.write(`id: ${evento.seq}\ndata: ${JSON.stringify(evento)}\n\n`);
      }

      // Uma ligação só para escutar. Nunca uma do pool de consultas: o pool
      // fecha a ligação e a subscrição vai com ela.
      const escuta = await abrirEscuta();

      // O fecho regista-se ANTES de qualquer espera. Se o browser desligar
      // enquanto esperamos, o evento já passou e nunca mais dispara — e a
      // ligação fica em LISTEN para sempre. Com o watchdog do browser a
      // reconectar, cada queda de rede vazava uma subscrição do Postgres.
      const fechar = () => {
        if (batimento) clearInterval(batimento);
        void escuta.end().catch(() => {});
      };
      let batimento: NodeJS.Timeout | undefined;
      req.on('close', fechar);

      escuta.on('notification', (aviso) => {
        const seq = Number(aviso.payload);
        if (!Number.isFinite(seq)) return;
        void registro
          .porSeq(seq)
          .then((evento) => {
            if (!evento) return;
            if (sessao && evento.sessao !== sessao) return;
            res.write(`id: ${evento.seq}\ndata: ${JSON.stringify(evento)}\n\n`);
          })
          .catch((err: unknown) => console.error('✖ ao entregar o evento:', err));
      });
      await escuta.query('LISTEN eventos');

      // Mantém a ligação viva através de proxies que cortam o silêncio.
      batimento = setInterval(() => res.write(': ping\n\n'), 15000);
    })().catch((err: unknown) => {
      console.error('✖ servidor de eventos:', err);
      res.end();
    });
  });
}