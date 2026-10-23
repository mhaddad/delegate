// Filma a Consola da Câmara v2: o pedido #DG-2048 (esplanada), a aprovação com fundamentação
// e a passagem para Missões delegadas. Saída: captura/consola.webm + captura/consola-marcas.json
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CAP = path.join(ROOT, "captura");
const URL_ = "file://" + path.resolve(ROOT, "../../reference-docs/delegate-consola-camara-v2.html");
const espera = (s) => new Promise((r) => setTimeout(r, s * 1000));

const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const p = await b.newPage();
await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await p.goto(URL_, { waitUntil: "networkidle0" });
// cursor visível (o headless não desenha o do sistema)
await p.evaluate(() => {
  const c = document.createElement("div");
  c.id = "cursor-video";
  c.innerHTML = `<svg width="34" height="42" viewBox="0 0 34 42"><path d="M3 2 L3 32 L11 25 L17 39 L23 36 L17 23 L29 23 Z" fill="#fff" stroke="#1D2430" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  Object.assign(c.style, { position: "fixed", left: "0", top: "0", zIndex: 99999, pointerEvents: "none", transform: "translate(1500px,900px)", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.35))" });
  document.body.append(c);
  addEventListener("mousemove", (e) => { c.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)`; }, true);
  addEventListener("mousedown", () => { c.style.scale = "0.85"; }, true);
  addEventListener("mouseup", () => { c.style.scale = "1"; }, true);
});
await espera(1);

const marcas = [];
let t0 = 0;
const marca = (nome) => marcas.push({ t: +((Date.now() - t0) / 1000).toFixed(2), nome });
const centro = async (sel) => { const r = await p.$eval(sel, (e) => { const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }); return r; };
const ir = async (x, y, s = 1) => p.mouse.move(x, y, { steps: Math.round(s * 30) });
const rolar = async (dy, s = 1) => { const n = Math.round(s * 30); for (let i = 0; i < n; i++) { await p.evaluate((d) => scrollBy(0, d), dy / n); await espera(1 / 30); } };

await p.mouse.move(1500, 900);
const rec = await p.screencast({ path: path.join(CAP, "consola.webm") });
t0 = Date.now();
marca("inicio");
await espera(1.0);
// percorre o resumo e os dados incluídos no pedido
let [x, y] = await centro("#detalhe-assunto"); await ir(x - 120, y, 1.0); marca("resumo");
await espera(0.5);
[x, y] = await centro("#detalhe-dados"); await ir(x + 200, y, 0.9); marca("dados");
await espera(0.6);
await rolar(330, 1.0); marca("decisao-visivel");
[x, y] = await centro('[data-decisao="aprovar"]'); await ir(x, y, 0.8);
await espera(0.3);
await p.mouse.down(); await espera(0.12); await p.mouse.up();
marca("aprovar");
await espera(0.6);
await rolar(220, 0.6);
await p.type("#nota", "Conforme o Art. 8.º: contígua à fachada, corredor livre de 2,10 m.", { delay: 28 }); marca("nota");
await espera(0.4);
[x, y] = await centro("#confirmar"); await ir(x, y, 0.6);
await p.mouse.down(); await espera(0.12); await p.mouse.up();
marca("confirmado");
await espera(1.6);
await rolar(-550, 0.8);
await espera(0.8);
[x, y] = await centro('[data-vista="missoes"]'); await ir(x, y, 0.9);
await p.mouse.down(); await espera(0.12); await p.mouse.up();
await p.evaluate(() => document.querySelector('[data-vista="missoes"]').click()); marca("missoes");
await espera(0.4);
await ir(1250, 620, 1.0);
await espera(2.5);
marca("fim");
await rec.stop();
await b.close();
fs.writeFileSync(path.join(CAP, "consola-marcas.json"), JSON.stringify(marcas, null, 1));
console.log(marcas.map((m) => `${m.t} ${m.nome}`).join("\n"));
