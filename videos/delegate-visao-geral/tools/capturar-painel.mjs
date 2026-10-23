// Filma o Painel ao vivo a reproduzir a sessão gravada da esplanada (captura/sessao-esplanada.json).
// Saída: captura/painel.webm + captura/painel-marcas.json (instante de cada mensagem, árvore e Cofre).
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CAP = path.join(ROOT, "captura");
const PAINEL = "file://" + path.resolve(ROOT, "../../reference-docs/delegate-panel.html") + "?nucleo=http://127.0.0.1:4999";

const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const p = await b.newPage();
await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await p.goto(PAINEL, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1500));

const marcas = [];
let t0 = 0;
await p.exposeFunction("marca", (tipo, texto) => marcas.push({ t: +((Date.now() - t0) / 1000).toFixed(2), tipo, texto }));
await p.evaluate(() => {
  const obs = (id, tipo) => new MutationObserver((ms) => {
    for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1) window.marca(tipo, (n.innerText || "").replace(/\s+/g, " ").slice(0, 90));
  }).observe(document.getElementById(id), { childList: true, subtree: true });
  obs("wa-conversa", "conversa");
  obs("avaliacao-corpo", "arvore");
  obs("cofres-corpo", "cofre");
});

const rec = await p.screencast({ path: path.join(CAP, "painel.webm") });
t0 = Date.now();
await new Promise((r) => setTimeout(r, 1200));
const inp = await p.$("#ficheiro");
await inp.uploadFile(path.join(CAP, "sessao-esplanada.json"));
marcas.push({ t: +((Date.now() - t0) / 1000).toFixed(2), tipo: "inicio-reproducao" });
await p.evaluate(() => document.querySelector("#ficheiro").dispatchEvent(new Event("change", { bubbles: true })));
await new Promise((r) => setTimeout(r, 36000));
await rec.stop();
await b.close();
fs.writeFileSync(path.join(CAP, "painel-marcas.json"), JSON.stringify(marcas, null, 1));
console.log(`${marcas.length} marcas`);
for (const m of marcas.filter((m) => m.tipo !== "cofre" || /COF|PAC|item|pacote/i.test(m.texto || ""))) console.log(m.t, m.tipo, m.texto || "");
