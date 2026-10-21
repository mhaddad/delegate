/* Motor mínimo de animação determinística: tudo é função pura do tempo t (segundos). */
(function () {
  const TL = window.TIMELINE;
  const FPS = 30;

  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const ease = {
    lin: (x) => x,
    out: (x) => 1 - (1 - x) ** 3,
    in: (x) => x * x * x,
    io: (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2),
    sine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
    expo: (x) => (x === 1 ? 1 : 1 - 2 ** (-10 * x)),
    back: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; },
    elastic: (x) => (x === 0 || x === 1 ? x : 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
  };
  // progresso [0..1] de um intervalo que começa em a e dura d
  const P = (t, a, d, e = ease.out) => e(clamp((t - a) / d));
  const L = (a, b, x) => a + (b - a) * x;
  // janela: sobe em [a, a+fi], desce em [b-fo, b]
  const win = (t, a, b, fi = 0.4, fo = 0.4) => Math.min(fi ? clamp((t - a) / fi) : t >= a ? 1 : 0, fo ? clamp((b - t) / fo) : t <= b ? 1 : 0);

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9-]/g, "");
  const B = (id) => TL.blocos.find((b) => b.id === id);
  // instante em que a palavra é dita (n-ésima ocorrência no bloco)
  function W(bid, word, nth = 1) {
    let c = 0;
    for (const w of B(bid).words) if (norm(w.w) === norm(word) && ++c === nth) return w.t;
    throw new Error(`palavra não encontrada: ${bid} "${word}"`);
  }

  // cortes entre cenas: cada vídeo preenche F.CUT nos seus ficheiros de cenas
  const CUT = {};

  // transformações
  function S(el, o = {}) {
    if (!el) return;
    const { x = 0, y = 0, s = 1, r = 0 } = o;
    const sx = o.sx ?? s, sy = o.sy ?? s;
    el.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${sx},${sy})`;
    if (o.o !== undefined) {
      el.style.opacity = o.o;
      el.style.visibility = o.o <= 0.001 ? "hidden" : "visible";
    }
  }
  const O = (el, o) => { if (el) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? "hidden" : "visible"; } };
  // desenho progressivo de traços (requer pathLength="1")
  function D(el, p) { if (!el) return; el.style.strokeDasharray = "1 1"; el.style.strokeDashoffset = String(1 - p); }
  const type = (el, txt, p) => { const n = Math.round(txt.length * clamp(p)); if (el._n !== n) { el.textContent = txt.slice(0, n); el._n = n; } };

  // RNG determinístico
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  // construção de DOM
  function H(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  const q = (root, sel) => root.querySelector(sel);
  const qa = (root, sel) => [...root.querySelectorAll(sel)];

  // ---------- personagens ----------
  // Inês: figura editorial (sem rosto detalhado). Caixa 200×520, pés em y≈500.
  function ines({ photo = false, smile = false } = {}) {
    return `
    <g class="ines">
      <g class="leg-l"><rect x="76" y="330" width="22" height="160" rx="11" fill="#2B3550"/><ellipse cx="84" cy="494" rx="20" ry="9" fill="#1C2338"/></g>
      <g class="leg-r"><rect x="102" y="330" width="22" height="160" rx="11" fill="#2B3550"/><ellipse cx="116" cy="494" rx="20" ry="9" fill="#1C2338"/></g>
      <path d="M64 150 Q100 132 136 150 L160 354 Q100 368 40 354 Z" fill="#D9623B"/>
      <path d="M100 150 L100 360" stroke="#B94E2C" stroke-width="3"/>
      <g class="arm-l" style="transform-origin:72% 3%"><path d="M68 158 Q48 232 52 312" stroke="#C4552F" stroke-width="22" stroke-linecap="round" fill="none"/><circle cx="52" cy="318" r="11" fill="#E2A47E"/></g>
      <g class="arm-r" style="transform-origin:28% 3%"><path d="M132 158 Q152 232 148 312" stroke="#C4552F" stroke-width="22" stroke-linecap="round" fill="none"/><circle cx="148" cy="318" r="11" fill="#E2A47E"/>
        ${photo ? `<g class="hand-photo"><rect x="140" y="296" width="44" height="34" rx="2" fill="#F7F1E4" stroke="#CDBB98" stroke-width="2" transform="rotate(-10 162 313)"/><rect x="145" y="301" width="34" height="22" fill="#B9A276" transform="rotate(-10 162 313)"/></g>` : ""}
      </g>
      <rect x="90" y="116" width="20" height="32" fill="#D9966F"/>
      <path d="M62 96 Q60 40 100 38 Q140 40 138 96 Q142 132 128 144 L72 144 Q58 132 62 96Z" fill="#3A2420"/>
      <circle cx="100" cy="92" r="34" fill="#E2A47E"/>
      <path d="M66 88 Q70 52 100 52 Q132 52 134 86 Q118 70 96 70 Q78 72 66 88Z" fill="#3A2420"/>
      <circle cx="100" cy="36" r="16" fill="#3A2420"/>
      <circle cx="88" cy="91" r="3.6" fill="#5A3428"/><circle cx="112" cy="91" r="3.6" fill="#5A3428"/>
      <path class="mouth-n" d="M92 106 Q100 109 108 106" stroke="#8E4A33" stroke-width="3" fill="none" stroke-linecap="round" opacity="${smile ? 0 : 1}"/>
      <path class="mouth-h" d="M87 103 Q100 116 113 103" stroke="#8E4A33" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${smile ? 1 : 0}"/>
      <g class="worry" opacity="0"><path d="M81 82 L94 79 M106 79 L119 82" stroke="#3A2420" stroke-width="3.2" stroke-linecap="round"/><path d="M92 109 Q100 103 108 109" stroke="#8E4A33" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <path d="M76 142 Q100 160 124 142 L124 154 Q100 172 76 154Z" fill="#E8B44A"/>
    </g>`;
  }

  // Henriques: anel de luz ciano com "H" ao centro
  function henriques(r = 80, id = "") {
    return `
    <g class="henriques" ${id ? `id="${id}"` : ""}>
      <circle class="af-glow" r="${r * 1.25}" fill="url(#gGlow)"/>
      <circle class="af-ring" r="${r}" fill="none" stroke="url(#gRing)" stroke-width="${Math.max(3, r * 0.12)}"/>
      <circle r="${r * 0.78}" fill="#0F1B33"/>
      <text class="serif" y="${r * 0.36}" text-anchor="middle" font-size="${r * 1.05}" font-weight="600" fill="#3FD0C9">H</text>
    </g>`;
  }
  // gradientes partilhados (cada SVG que use o Henriques inclui isto)
  const DEFS = `
    <defs>
      <radialGradient id="gGlow"><stop offset="0" stop-color="#3FD0C9" stop-opacity=".45"/><stop offset="1" stop-color="#3FD0C9" stop-opacity="0"/></radialGradient>
      <linearGradient id="gRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7AF0E8"/><stop offset="1" stop-color="#1FA7B5"/></linearGradient>
      <radialGradient id="gGold"><stop offset="0" stop-color="#E8B44A" stop-opacity=".35"/><stop offset="1" stop-color="#E8B44A" stop-opacity="0"/></radialGradient>
      <filter id="fBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>`;
  const henriquesRingSVG = (size) =>
    `<svg width="${size}" height="${size}" viewBox="-60 -60 120 120">${henriques(40)}</svg>`;

  // ---------- ícones simples ----------
  const ICON = {
    check: (c = "#5BBF7A") => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="11" fill="${c}"/><path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    doc: (c = "#0F1B33") => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M6 2h8l5 5v15H6z" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v5h5M9 12h7M9 16h7" stroke="${c}" stroke-width="2" fill="none"/></svg>`,
    clip: (c = "#0F1B33") => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M8 12.5l6.5-6.5a3 3 0 0 1 4.2 4.2l-8.4 8.4a5 5 0 0 1-7-7L11 4" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    arrow: (c = "#0F1B33") => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M4 12h15M13 6l6 6-6 6" stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    lock: (c = "#E8B44A") => `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="4" y="10" width="16" height="12" rx="3" fill="${c}"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="${c}" stroke-width="2.4" fill="none"/></svg>`,
    shield: (c = "#3FD0C9") => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" fill="none" stroke="${c}" stroke-width="2"/><path d="M8 12l3 3 5-6" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`,
    key: (c = "#0F1B33") => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="8" cy="12" r="5" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M13 12h9M18 12v4M21 12v3" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  };

  // ---------- som: cues declarados pelas cenas (exportados para a mistura) ----------
  const CUES = [];
  const cue = (name, t, gain = 1) => CUES.push({ name, t: +t.toFixed(3), gain });

  // ---------- tremores de câmara ----------
  const SHAKES = [];
  const shake = (t, amp = 8, dur = 0.45) => SHAKES.push({ t, amp, dur });
  function shakeAt(t) {
    let x = 0, y = 0;
    for (const k of SHAKES) {
      const p = (t - k.t) / k.dur; if (p < 0 || p > 1) continue;
      const a = k.amp * (1 - p) ** 2;
      x += a * Math.sin(t * 83 + k.t); y += a * Math.cos(t * 71 + k.t * 3);
    }
    return [x, y];
  }

  // ---------- partículas (canvas por cima das cenas) ----------
  const FX = [];
  const fx = (fn) => FX.push(fn);
  // explosão radial determinística
  function burst({ seed, t0, x, y, n = 60, speed = 520, life = 1.4, colors = ["#3FD0C9"], size = [3, 7], grav = 0, spin = false, shape = "dot", spread = [0, Math.PI * 2] }) {
    const R = rng(seed);
    const ps = [...Array(n)].map(() => {
      const a = spread[0] + R() * (spread[1] - spread[0]), v = speed * (0.35 + R() * 0.65);
      return { vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: colors[Math.floor(R() * colors.length)], s: size[0] + R() * (size[1] - size[0]), l: life * (0.6 + R() * 0.4), r0: R() * 6.28, rs: (R() - 0.5) * 14 };
    });
    fx((t, g) => {
      const dt = t - t0; if (dt < 0 || dt > life) return;
      for (const p of ps) {
        if (dt > p.l) continue;
        const k = 1 - dt / p.l, drag = (1 - Math.exp(-2.2 * dt)) / 2.2;
        const px = x + p.vx * drag, py = y + p.vy * drag + 0.5 * grav * dt * dt;
        g.globalAlpha = Math.min(1, k * 1.6);
        g.fillStyle = p.c;
        if (shape === "rect") { g.save(); g.translate(px, py); g.rotate(p.r0 + p.rs * dt); g.scaleY?.(1); g.fillRect(-p.s, -p.s * 0.45, p.s * 2, p.s * 0.9 * Math.abs(Math.cos(p.r0 + dt * 9))); g.restore(); }
        else { g.beginPath(); g.arc(px, py, p.s * (0.5 + 0.5 * k), 0, 6.283); g.fill(); }
      }
      g.globalAlpha = 1;
    });
  }
  // ondas de choque
  function rings({ t0, x, y, n = 3, gap = 0.18, r1 = 420, life = 1.1, color = "63,208,201", w = 4 }) {
    fx((t, g) => {
      for (let i = 0; i < n; i++) {
        const dt = t - t0 - i * gap; if (dt < 0 || dt > life) continue;
        const p = ease.out(dt / life);
        g.strokeStyle = `rgba(${color},${(1 - p) * 0.8})`; g.lineWidth = w * (1 - p) + 0.5;
        g.beginPath(); g.arc(x, y, 30 + r1 * p, 0, 6.283); g.stroke();
      }
    });
  }
  // pó a flutuar na luz
  function motes({ seed, a, b, n = 40, color = "255,236,200", area = [0, 0, 1920, 1080] }) {
    const R = rng(seed);
    const ps = [...Array(n)].map(() => ({ x: area[0] + R() * area[2], y: area[1] + R() * area[3], r: 1.5 + R() * 3.5, sp: 8 + R() * 22, ph: R() * 6.28, al: 0.25 + R() * 0.45 }));
    fx((t, g) => {
      if (t < a || t > b) return;
      const fade = Math.min(1, (t - a) / 0.8, (b - t) / 0.8);
      for (const p of ps) {
        const x = p.x + Math.sin(t * 0.4 + p.ph) * 30, y = p.y - ((t * p.sp) % 200) + Math.cos(t * 0.3 + p.ph) * 10;
        const tw = 0.6 + 0.4 * Math.sin(t * 2 + p.ph);
        g.fillStyle = `rgba(${color},${p.al * tw * fade})`; g.beginPath(); g.arc(x, y, p.r, 0, 6.283); g.fill();
      }
    });
  }

  // ---------- gestão de cenas ----------
  const stage = document.getElementById("stage");
  // definições globais (fora de cenas com display:none, senão os gradientes não renderizam)
  stage.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute">${DEFS}</svg>`);
  const scenes = [];
  function scene({ id, start, end, fi = 0.5, fo = 0.5, build, update, z = 1, kb = 0.035 }) {
    const el = H(`<div class="scene" id="${id}" style="z-index:${z}"></div>`);
    stage.appendChild(el);
    const ctx = build(el) || {};
    scenes.push({ id, start, end, fi, fo, el, ctx, update, kb });
  }
  const hooks = [];
  // camadas de ambiente por cima das cenas
  stage.insertAdjacentHTML("beforeend", `
    <canvas id="fx" width="1920" height="1080" style="position:absolute;inset:0;z-index:40;pointer-events:none"></canvas>
    <div id="vig" style="position:absolute;inset:0;z-index:41;pointer-events:none;background:radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(20,10,0,.75) 100%)"></div>
    <div id="grain" style="position:absolute;inset:-64px;z-index:42;pointer-events:none;background:url(../shared/grain.png);mix-blend-mode:overlay;opacity:.07"></div>`);
  const fxg = document.getElementById("fx").getContext("2d");
  const onFrame = (fn) => hooks.push(fn);

  function seek(t) {
    for (const sc of scenes) {
      const vis = t >= sc.start && t <= sc.end;
      if (!vis) { if (sc._vis !== false) { sc.el.style.display = "none"; sc._vis = false; } continue; }
      if (sc._vis !== true) { sc.el.style.display = "block"; sc._vis = true; }
      sc.el.style.opacity = win(t, sc.start, sc.end, sc.fi, sc.fo);
      // zoom lento contínuo + tremor
      const k = 1 + sc.kb * ease.sine(clamp((t - sc.start) / (sc.end - sc.start)));
      const [sx, sy] = shakeAt(t);
      sc.el.style.transform = `translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) scale(${k.toFixed(5)})`;
      sc.update(t, sc.ctx, sc.el);
    }
    // partículas
    fxg.clearRect(0, 0, 1920, 1080);
    for (const fn of FX) fn(t, fxg);
    for (const fn of hooks) fn(t);
  }

  window.F = { TL, FPS, CUT, CUES, cue, shake, fx, burst, rings, motes, clamp, ease, P, L, win, W, B, S, O, D, type, rng, H, q, qa, ines, henriques, henriquesRingSVG, DEFS, ICON, scene, onFrame, seek, stage };
})();
