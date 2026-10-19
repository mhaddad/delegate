// Renderiza o filme quadro a quadro com o Chrome headless e codifica com o ffmpeg.
// Uso:
//   node tools/render.mjs                 → renders/delegate-pitch-v2.mp4 (filme inteiro)
//   node tools/render.mjs --stills 1,5,9  → renders/stills/t001.00.png ... (fotogramas de teste)
//   node tools/render.mjs --from 60 --to 70 --out renders/teste.mp4
import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const FPS = 30, TOTAL = 180;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// servidor estático (evita restrições de file://)
const MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".wav": "audio/wav", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const URL_ = `http://127.0.0.1:${server.address().port}/video/index.html?render`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--force-color-profile=srgb", "--hide-scrollbars", "--disable-lcd-text", "--font-render-hinting=none"] });
async function newPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await page.goto(URL_, { waitUntil: "load" });
  await page.evaluate(() => window.ready);
  if (errs.length) { console.error("Erros na página:\n" + errs.join("\n")); }
  return page;
}

if (args.includes("--cues")) {
  const page = await newPage();
  const cues = await page.evaluate(() => window.CUES);
  fs.writeFileSync(path.join(ROOT, "audio", "cues.json"), JSON.stringify(cues, null, 1));
  console.log(`${cues.length} cues → audio/cues.json`);
  await browser.close(); server.close(); process.exit(0);
}

if (args.includes("--stills")) {
  const times = arg("--stills").split(",").map(Number);
  const dir = path.join(ROOT, "renders", "stills"); fs.mkdirSync(dir, { recursive: true });
  const page = await newPage();
  for (const t of times) {
    await page.evaluate((t) => window.seekTo(t), t);
    const f = path.join(dir, `t${t.toFixed(2).padStart(6, "0")}.png`);
    await page.screenshot({ path: f, type: "png" });
    console.log(f);
  }
  await browser.close(); server.close(); process.exit(0);
}

const from = parseFloat(arg("--from", "0")), to = parseFloat(arg("--to", String(TOTAL)));
const out = path.join(ROOT, arg("--out", "renders/delegate-pitch-v2.mp4"));
const workers = parseInt(arg("--workers", String(Math.max(2, Math.min(6, os.cpus().length - 2)))), 10);
const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
const tmp = path.join(ROOT, "renders", ".parts"); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });

const per = Math.ceil((f1 - f0) / workers);
let done = 0; const totalFrames = f1 - f0; const tStart = Date.now();
async function work(k) {
  const a = f0 + k * per, b = Math.min(f1, a + per);
  if (a >= b) return null;
  const page = await newPage();
  const part = path.join(tmp, `p${String(k).padStart(2, "0")}.mp4`);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", part], { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = a; f < b; f++) {
    await page.evaluate((t) => window.seekTo(t), f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95, optimizeForSpeed: true });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    done++;
    if (done % 150 === 0) {
      const el = (Date.now() - tStart) / 1000;
      console.log(`${done}/${totalFrames} quadros · ${(done / el).toFixed(1)} q/s · faltam ~${Math.round((totalFrames - done) / (done / el))} s`);
    }
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await page.close();
  return part;
}
const parts = (await Promise.all([...Array(workers).keys()].map(work))).filter(Boolean);
await browser.close(); server.close();

const list = path.join(tmp, "list.txt");
fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n"));
const video = path.join(tmp, "video.mp4");
await new Promise((r, j) => spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", video], { stdio: "inherit" }).on("close", (c) => (c ? j(c) : r())));
// junta o áudio (mesmo intervalo)
fs.mkdirSync(path.dirname(out), { recursive: true });
await new Promise((r, j) => spawn("ffmpeg", ["-y", "-loglevel", "error", "-i", video, "-ss", String(from), "-i", path.join(ROOT, "audio", "mix.wav"),
  "-filter_complex", `[1:a]apad,atrim=0:${to - from}[a]`, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "-shortest", out], { stdio: "inherit" }).on("close", (c) => (c ? j(c) : r())));
console.log(`ok: ${out} (${((Date.now() - tStart) / 1000).toFixed(0)} s)`);
