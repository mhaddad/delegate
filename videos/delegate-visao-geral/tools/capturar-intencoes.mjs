// Filma a vista «Intenções do Concelho» da Consola v2: garantias e indicadores, mapa por freguesia e tema,
// motivações e desejos para a cidade. Saída: captura/intencoes.webm + captura/intencoes-marcas.json
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
await p.evaluate(() => document.querySelector('[data-vista="intencoes"]').click());
// cursor visível (o headless não desenha o do sistema)
await p.evaluate(() => {
  const c = document.createElement("div");
  c.innerHTML = `<svg width="34" height="42" viewBox="0 0 34 42"><path d="M3 2 L3 32 L11 25 L17 39 L23 36 L17 23 L29 23 Z" fill="#fff" stroke="#1D2430" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  Object.assign(c.style, { position: "fixed", left: "0", top: "0", zIndex: 99999, pointerEvents: "none", transform: "translate(1500px,900px)", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.35))" });
  document.body.append(c);
  addEventListener("mousemove", (e) => { c.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)`; }, true);
});
await espera(1.2);

const marcas = [];
let t0 = 0;
const marca = (nome) => marcas.push({ t: +((Date.now() - t0) / 1000).toFixed(2), nome });
const ir = async (x, y, s = 1) => p.mouse.move(x, y, { steps: Math.round(s * 30) });
const rolar = async (dy, s = 1) => { const n = Math.round(s * 30); for (let i = 0; i < n; i++) { await p.evaluate((d) => scrollBy(0, d), dy / n); await espera(1 / 30); } };

await p.mouse.move(1500, 900);
const rec = await p.screencast({ path: path.join(CAP, "intencoes.webm") });
t0 = Date.now();
marca("inicio");
await espera(0.8);
await ir(980, 234, 0.9); marca("garantias");
await espera(0.6);
await ir(1110, 560, 0.9); marca("destaques");
await espera(1.2);
await rolar(560, 1.2); marca("mapa");
await ir(930, 262, 0.8);
await espera(2.0);
await rolar(459, 1.2); marca("motivacoes");
await ir(1400, 400, 1.0);
await espera(3.5);
marca("fim");
await rec.stop();
await b.close();
fs.writeFileSync(path.join(CAP, "intencoes-marcas.json"), JSON.stringify(marcas, null, 1));
console.log(marcas.map((m) => `${m.t} ${m.nome}`).join("\n"));
