/* VÍDEO 1 — O problema */
(function () {
  const { CUT, cue, shake, burst, motes, P, L, W, B, S, O, D, ease, clamp, rng, H, q, qa, ines, ICON, scene, win, onFrame, stage, TL } = F;
  const TOTAL = TL.total;

  // cortes entre cenas
  CUT.s2 = B("2").start - 0.4;
  CUT.s3 = B("3").start - 0.6;
  CUT.s4 = B("4").start - 0.7;
  CUT.s5 = B("5").start - 0.5;
  CUT.s6 = B("6").start - 0.5;
  CUT.s7 = B("7").start - 0.6;
  CUT.s8 = B("8").start - 0.9;
  const tNoite = W("6", "a", 1) - 0.4; // "À noite"
  window.VIG = [[0, 0.35], [CUT.s4, 0.5], [tNoite, 0.75], [CUT.s8, 0.7], [TOTAL, 0.85]];

  // ambiente: a luz arrefece ao longo do dia
  stage.insertAdjacentHTML("beforeend", `<div id="mood" style="position:absolute;inset:0;z-index:39;pointer-events:none;mix-blend-mode:multiply;background:#5A6F99;opacity:0"></div>`);
  const mood = document.getElementById("mood");
  onFrame((t) => {
    const k = [[0, 0], [CUT.s3, 0.08], [CUT.s5, 0.2], [tNoite, 0.42], [CUT.s7, 0.42], [CUT.s8, 0.3], [TOTAL, 0.35]];
    let v = 0; for (let i = 0; i < k.length - 1; i++) if (t >= k[i][0] && t <= k[i + 1][0]) v = L(k[i][1], k[i + 1][1], (t - k[i][0]) / (k[i + 1][0] - k[i][0]));
    mood.style.opacity = v;
  });

  const card = (txt, w = 420) => `<div class="qc" style="position:absolute;width:${w}px;padding:22px 26px 22px 70px;border-radius:18px;background:#fff;box-shadow:0 16px 40px rgba(15,27,51,.18);font-family:Fraunces;font-style:italic;font-size:34px;line-height:1.15;color:#0F1B33">
      <div style="position:absolute;left:18px;top:50%;margin-top:-20px;width:40px;height:40px;border-radius:50%;background:#9AA3B2;color:#fff;font:700 26px Inter;display:flex;align-items:center;justify-content:center">?</div>${txt}</div>`;
  const ini = (x, y, k, opts = {}) => `<g transform="translate(${x} ${y}) scale(${k})"><g class="ini">${ines(opts)}</g></g>`;

  // fachada do restaurante (caixa 1920×1080)
  const azulejo = (x, y, n) => [...Array(n)].map((_, i) => `<g transform="translate(${x + i * 40} ${y})"><rect width="40" height="40" fill="#F4F1EA" stroke="#C9D3E6"/><circle cx="20" cy="20" r="9" fill="none" stroke="#2E5AA8" stroke-width="3"/><path d="M20 4 V11 M20 29 V36 M4 20 H11 M29 20 H36" stroke="#2E5AA8" stroke-width="3"/></g>`).join("");
  const fachada = `
    <rect width="1920" height="1080" fill="#EEE6D8"/>
    <rect x="0" y="0" width="1920" height="120" fill="#D8CCB7"/>
    <rect x="260" y="120" width="1400" height="720" fill="#E9DFCF"/>
    ${azulejo(260, 780, 35)}
    <rect x="240" y="820" width="1440" height="40" fill="#B9AF9E"/>
    <rect x="0" y="860" width="1920" height="220" fill="#CFC6B6"/>
    ${[...Array(12)].map((_, i) => `<path d="M${i * 170} 860 L${i * 170 - 80} 1080" stroke="#BDB3A2" stroke-width="3"/>`).join("")}
    <rect x="520" y="230" width="880" height="96" rx="8" fill="#0F1B33"/>
    <text x="960" y="298" text-anchor="middle" font-family="Fraunces" font-size="62" font-weight="600" fill="#F2EEE6" letter-spacing="6">CASA JOAQUIM</text>
    <text x="960" y="372" text-anchor="middle" font-family="Inter" font-size="24" fill="#7C6A55" letter-spacing="8">RESTAURANTE · DESDE 1968</text>
    <g><rect x="420" y="420" width="560" height="360" fill="#6E8BA8"/><rect x="420" y="420" width="560" height="360" fill="none" stroke="#5A4630" stroke-width="14"/><path d="M700 420 V780" stroke="#5A4630" stroke-width="10"/>
      <g opacity=".55"><rect x="460" y="610" width="200" height="12" fill="#F2EEE6"/><rect x="740" y="610" width="200" height="12" fill="#F2EEE6"/><circle cx="560" cy="560" r="26" fill="#F7E4C2"/><circle cx="840" cy="560" r="26" fill="#F7E4C2"/></g></g>
    <g><rect x="1080" y="420" width="300" height="400" fill="#7A5C3E"/><rect x="1080" y="420" width="300" height="400" fill="none" stroke="#5A4630" stroke-width="14"/><circle cx="1350" cy="630" r="10" fill="#E8B44A"/></g>
    <clipPath id="v1cs1"><rect x="413" y="413" width="574" height="374"/></clipPath><clipPath id="v1cs2"><rect x="1073" y="413" width="314" height="414"/></clipPath>
    <g class="shutters">
      <g clip-path="url(#v1cs1)"><g class="sh1"><rect x="413" y="413" width="574" height="374" fill="#9AA3B2"/>${[...Array(18)].map((_, i) => `<path d="M413 ${425 + i * 20} H987" stroke="#7E8796" stroke-width="3"/>`).join("")}</g></g>
      <g clip-path="url(#v1cs2)"><g class="sh2"><rect x="1073" y="413" width="314" height="414" fill="#9AA3B2"/>${[...Array(20)].map((_, i) => `<path d="M1073 ${425 + i * 20} H1387" stroke="#7E8796" stroke-width="3"/>`).join("")}</g></g>
    </g>
    <rect x="405" y="398" width="590" height="22" fill="#7E8796"/><rect x="1065" y="398" width="330" height="22" fill="#7E8796"/>
    <path d="M1500 180 V330" stroke="#3A3A3A" stroke-width="4"/><path d="M1470 330 h60 l-12 40 h-36z" fill="#3A3A3A"/><circle cx="1500" cy="372" r="10" fill="#F7D98A" class="lamp"/>`;

  // ===================================================================
  // CENA 1 — a manhã no restaurante do avô
  // ===================================================================
  scene({
    id: "c1", start: 0, end: CUT.s2 + 0.8, fi: 0, fo: 0,
    build(el) {
      cue("persiana", 0.5, 0.8); cue("campainha", 2.3, 0.6); cue("panelas", W("1", "ha") + 0.4, 0.5);
      motes({ seed: 1, a: 0, b: CUT.s2 + 0.8, n: 40, area: [0, 100, 1920, 800] });
      el.innerHTML = `
        <div class="ext abs" style="width:1920px;height:1080px"><svg width="1920" height="1080" viewBox="0 0 1920 1080">${fachada}${ini(1120, 470, 0.72)}</svg></div>
        <div class="int abs" style="width:1920px;height:1080px">
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#E7DCC8"/>
            <rect y="760" width="1920" height="320" fill="#B58E6A"/>${[...Array(10)].map((_, i) => `<path d="M0 ${790 + i * 30} H1920" stroke="#A47F5D" stroke-width="2"/>`).join("")}
            ${azulejo(0, 640, 48)}
            <g class="foto"><rect x="300" y="200" width="300" height="240" fill="#6B4F2A"/><rect x="316" y="216" width="268" height="208" fill="#E6D3AE"/>
              <path d="M316 360 Q420 330 584 350 V424 H316Z" fill="#CDB689"/><g fill="#5A4630"><circle cx="440" cy="300" r="18"/><path d="M416 290 Q440 268 464 290 Z"/><path d="M418 322 Q440 314 462 322 L470 404 L410 404 Z"/></g>
              <text x="450" y="480" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="26" fill="#7A6648">avô Joaquim</text></g>
            <g><rect x="700" y="250" width="380" height="18" fill="#7B6A4E"/>${[0, 1, 2, 3].map((i) => `<g transform="translate(${740 + i * 88} 268)"><path d="M0 0 h60 v40 q-30 18 -60 0z" fill="#8E96A6"/><path d="M60 10 h20" stroke="#8E96A6" stroke-width="6"/></g>`).join("")}</g>
            <g class="win"><rect x="1240" y="170" width="520" height="420" fill="#BFD0A2"/>
              <path d="M1240 430 Q1400 380 1520 410 T1760 400 V590 H1240Z" fill="#9FB57E"/>
              ${[...Array(26)].map((_, i) => `<path d="M${1255 + i * 19} 590 q${(i % 3) - 1} -40 ${(i % 5) - 2} -${50 + (i % 4) * 14}" stroke="#7E9A5E" stroke-width="5" fill="none"/>`).join("")}
              <rect x="1240" y="170" width="520" height="420" fill="none" stroke="#5A4630" stroke-width="18"/><path d="M1500 170 V590 M1240 380 H1760" stroke="#5A4630" stroke-width="10"/></g>
            <rect x="0" y="690" width="1920" height="70" fill="#7A5C3E"/>
            ${ini(820, 300, 0.88)}
          </svg>
          <div class="lbl abs mono" style="left:1300px;top:610px;padding:8px 16px;border-radius:999px;background:rgba(15,27,51,.75);color:#F2EEE6;font-size:22px">o terreno nas traseiras</div>
        </div>
        <div class="gmr abs serif" style="left:110px;top:900px;font-size:44px;font-weight:600;color:#0F1B33">Guimarães</div>`;
      return { ext: q(el, ".ext"), int: q(el, ".int"), sh1: q(el, ".sh1"), sh2: q(el, ".sh2"), win: q(el, ".win"), foto: q(el, ".foto"), lbl: q(el, ".lbl"), gmr: q(el, ".gmr") };
    },
    update(t, c) {
      const up = P(t, 0.4, 1.6, ease.io);
      S(c.sh1, { y: -380 * up }); S(c.sh2, { y: -420 * P(t, 0.8, 1.6, ease.io) });
      const tin = W("1", "ha") + 0.6;
      const toInt = P(t, tin, 1.0, ease.io);
      S(c.ext, { s: L(1, 1.6, toInt), o: 1 - toInt }); c.ext.style.transformOrigin = "1230px 620px";
      O(c.int, toInt);
      const tf = W("1", "avo");
      c.foto.style.filter = `drop-shadow(0 0 ${30 * win(t, tf - 0.2, tf + 2.0, 0.3, 0.6)}px rgba(232,180,74,.9))`;
      const tw = W("1", "traseiras") - 0.2;
      const z = P(t, tw, 1.6, ease.io);
      c.int.style.transformOrigin = "1500px 380px"; S(c.int, { s: L(1, 1.5, z), o: toInt });
      S(c.lbl, { y: L(14, 0, P(t, tw + 0.8, 0.5)), o: P(t, tw + 0.8, 0.4, ease.lin) });
      S(c.gmr, { y: L(16, 0, P(t, 1.2, 0.8)), o: P(t, 1.2, 0.6, ease.lin) * (1 - P(t, tin, 0.5, ease.lin)) });
    },
  });

  // ===================================================================
  // CENA 2 — dois planos
  // ===================================================================
  scene({
    id: "c2", start: CUT.s2, end: CUT.s3 + 0.8, fi: 0.8, fo: 0, z: 2,
    build(el) {
      cue("shimmer", W("2", "casa") - 0.1, 0.35); cue("shimmer", W("2", "esplanada") - 0.1, 0.35);
      el.style.background = "#F2EEE6";
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <line x1="960" y1="140" x2="960" y2="940" stroke="#D8CCB7" stroke-width="3" stroke-dasharray="10 10"/>
          <g transform="translate(0 40)">
            <path d="M120 700 Q400 640 860 690 V900 H120Z" fill="#D7DDBF"/>
            <path class="plot" d="M260 720 L740 720 L820 870 L180 870 Z" fill="none" stroke="#8A7A55" stroke-width="4" stroke-dasharray="12 10"/>
            <g fill="none" stroke="#D9623B" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
              <path class="hw" pathLength="1" d="M330 820 V600 M670 820 V600 M330 600 H670 M330 820 H670"/>
              <path class="hr" pathLength="1" d="M300 610 L500 480 L700 610"/>
              <path class="hd" pathLength="1" d="M470 820 V720 H530 V820 M370 650 H430 V700 H370Z M570 650 H630 V700 H570Z"/>
            </g>
          </g>
          <g transform="translate(960 40)">
            <rect x="120" y="360" width="700" height="380" fill="#E9DFCF"/><rect x="120" y="360" width="700" height="60" fill="#0F1B33"/>
            <text x="470" y="402" text-anchor="middle" font-family="Fraunces" font-size="34" font-weight="600" fill="#F2EEE6" letter-spacing="4">CASA JOAQUIM</text>
            <rect x="170" y="460" width="300" height="220" fill="#6E8BA8" stroke="#5A4630" stroke-width="10"/><rect x="560" y="460" width="190" height="280" fill="#7A5C3E" stroke="#5A4630" stroke-width="10"/>
            <rect x="60" y="740" width="820" height="160" fill="#CFC6B6"/>
            ${[0, 1, 2].map((i) => `<g class="tb" transform="translate(${190 + i * 230} 790)"><g><path d="M-70 -110 Q0 -150 70 -110 Z" fill="${["#D9623B", "#E8B44A", "#3FA6A0"][i]}"/><path d="M0 -110 V30" stroke="#5A4630" stroke-width="5"/><ellipse cx="0" cy="30" rx="56" ry="12" fill="#F7F1E4" stroke="#B9AF9E" stroke-width="3"/><path d="M-36 30 V70 M36 30 V70" stroke="#5A4630" stroke-width="5"/><rect x="-82" y="20" width="22" height="50" rx="5" fill="#B94E2C"/><rect x="60" y="20" width="22" height="50" rx="5" fill="#B94E2C"/></g></g>`).join("")}
          </g>
        </svg>
        <div class="h1 abs label-sm" style="left:120px;top:150px;color:#D9623B;font-size:24px">Plano 1 · Casa</div>
        <div class="m2 abs serif" style="left:700px;top:330px;font-size:64px;font-weight:650;color:#D9623B">0 m²</div>
        <div class="h2 abs label-sm" style="left:1080px;top:150px;color:#D9623B;font-size:24px">Plano 2 · Esplanada</div>`;
      return { hw: q(el, ".hw"), hr: q(el, ".hr"), hd: q(el, ".hd"), m2: q(el, ".m2"), h1: q(el, ".h1"), h2: q(el, ".h2"), tb: qa(el, ".tb > g") };
    },
    update(t, c) {
      const tc = W("2", "construir") - 0.2, te = W("2", "esplanada") - 0.3;
      S(c.h1, { o: P(t, tc - 0.3, 0.5, ease.lin) }); S(c.h2, { o: P(t, te - 0.3, 0.5, ease.lin) });
      D(c.hw, P(t, tc, 1.2, ease.io)); D(c.hr, P(t, tc + 1.0, 0.8, ease.io)); D(c.hd, P(t, tc + 1.6, 0.8, ease.io));
      const n = P(t, W("2", "cento") - 0.1, 1.4, ease.out); c.m2.textContent = `${Math.round(150 * n)} m²`; O(c.m2, P(t, W("2", "cento") - 0.2, 0.3, ease.lin));
      c.tb.forEach((g, i) => { const p = P(t, te + i * 0.3, 0.6, ease.back); S(g, { y: L(-40, 0, p), s: p, o: Math.min(1, p * 2) }); });
    },
  });

  // ===================================================================
  // CENA 3 — a porta da autorização
  // ===================================================================
  scene({
    id: "c3", start: CUT.s3, end: CUT.s4 + 0.8, fi: 0.8, fo: 0, z: 3,
    build(el) {
      const tCom = W("3", "como");
      cue("porta", tCom - 0.1, 0.9); shake(tCom, 6, 0.5);
      el.style.background = "#E4DCCD";
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <rect y="880" width="1920" height="200" fill="#CFC6B6"/>
          <g transform="translate(300 0)"><g class="door">
            <rect x="660" y="160" width="600" height="720" rx="12" fill="#5A4630"/>
            <rect x="690" y="190" width="260" height="660" rx="6" fill="#7A5C3E"/><rect x="970" y="190" width="260" height="660" rx="6" fill="#7A5C3E"/>
            ${[0, 1, 2].map((i) => `<rect x="720" y="${230 + i * 210}" width="200" height="170" rx="6" fill="none" stroke="#5A4630" stroke-width="6"/><rect x="1000" y="${230 + i * 210}" width="200" height="170" rx="6" fill="none" stroke="#5A4630" stroke-width="6"/>`).join("")}
            <g class="handle"><rect x="918" y="500" width="24" height="90" rx="10" fill="#E8B44A"/><rect x="978" y="500" width="24" height="90" rx="10" fill="#E8B44A"/></g>
            <g transform="translate(960 640)"><circle r="26" fill="#3A2A1C"/><path d="M-6 -2 h12 l4 28 h-20z" fill="#0F0A06"/></g>
          </g></g>
          <g class="seal" transform="translate(1260 330)"><g><circle r="120" fill="#B94E2C"/><circle r="100" fill="none" stroke="#F2EEE6" stroke-width="3" stroke-dasharray="6 6"/>
            <text y="-12" text-anchor="middle" font-family="Inter" font-weight="800" font-size="24" fill="#F2EEE6" letter-spacing="3">AUTORIZAÇÃO</text>
            <text y="24" text-anchor="middle" font-family="Inter" font-weight="700" font-size="22" fill="#F2EEE6" letter-spacing="3">DA CÂMARA</text></g></g>
          ${ini(620, 400, 0.95, {})}
          <text class="km" x="1260" y="760" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="120" fill="#E8B44A">?</text>
        </svg>
        <div class="t1 abs serif" style="left:110px;top:120px;font-size:56px;font-weight:600">Precisa de autorização.</div>
        <div class="t2 abs serif" style="left:110px;top:200px;font-size:56px;font-weight:600;color:#B94E2C">Mas como?</div>`;
      return { seal: q(el, ".seal > g"), handle: q(el, ".handle"), km: q(el, ".km"), t1: q(el, ".t1"), t2: q(el, ".t2"), ini: q(el, ".ini"), worry: q(el, ".worry"), mouthN: q(el, ".mouth-n") };
    },
    update(t, c) {
      const ta = W("3", "autorizacao") - 0.2, tc = W("3", "como") - 0.1;
      const sp = P(t, ta, 0.6, ease.back); S(c.seal, { s: L(2, 1, sp), r: L(-20, -6, sp), o: Math.min(1, sp * 2) });
      O(c.t1, P(t, ta, 0.5, ease.lin)); S(c.t2, { y: L(14, 0, P(t, tc, 0.4)), o: P(t, tc, 0.4, ease.lin) });
      const wk = P(t, CUT.s3 + 0.3, 2.4, ease.out);
      c.ini.setAttribute("transform", `translate(${L(-120, 0, wk)} 0)`);
      const rattle = t > tc && t < tc + 0.7 ? Math.sin(t * 60) * 8 * (1 - (t - tc) / 0.7) : 0;
      c.handle.style.transform = `rotate(${rattle}deg)`;
      const kp = P(t, tc + 0.4, 0.5, ease.back); S(c.km, { s: kp, o: kp > 0 ? 1 : 0 });
      const wr = P(t, tc, 0.4, ease.lin); O(c.worry, wr); O(c.mouthN, 1 - wr);
    },
  });

  // ===================================================================
  // CENA 4 — a casa: o novo PDM e o primeiro labirinto
  // ===================================================================
  const COLS = 14, ROWS = 7, CELL = 116, OX = 148, OY = 160;
  function maze(seed) {
    const r = rng(seed), walls = [];
    for (let y = 0; y < ROWS; y++) { walls.push([]); for (let x = 0; x < COLS; x++) walls[y].push({ n: 1, e: 1, s: 1, w: 1 }); }
    const seen = new Set(["0,3"]), st = [[0, 3]], dirs = [["n", 0, -1, "s"], ["e", 1, 0, "w"], ["s", 0, 1, "n"], ["w", -1, 0, "e"]];
    while (st.length) {
      const [x, y] = st[st.length - 1];
      const o = dirs.filter(([, dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS && !seen.has(nx + "," + ny); });
      if (!o.length) { st.pop(); continue; }
      const [d, dx, dy, od] = o[Math.floor(r() * o.length)];
      walls[y][x][d] = 0; walls[y + dy][x + dx][od] = 0; seen.add(x + dx + "," + (y + dy)); st.push([x + dx, y + dy]);
    }
    let p = "";
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const w = walls[y][x], x0 = OX + x * CELL, y0 = OY + y * CELL;
      if (w.n) p += `M${x0} ${y0}H${x0 + CELL}`; if (w.w && !(x === 0 && y === 3)) p += `M${x0} ${y0}V${y0 + CELL}`;
      if (y === ROWS - 1 && w.s) p += `M${x0} ${y0 + CELL}H${x0 + CELL}`; if (x === COLS - 1 && w.e) p += `M${x0 + CELL} ${y0}V${y0 + CELL}`;
    }
    return p;
  }
  function labirinto({ id, bloco, cartoes, seed, manchete }) {
    return {
      build(el) {
        cartoes.forEach(([w]) => cue("papel", W(bloco, w) - 0.15, 0.55));
        if (manchete) cue("jornal", W(bloco, "camara") - 0.2, 0.7);
        cue("tensao", B(bloco).start + 1.5, 0.45);
        el.style.background = "#E9E3D8";
        el.innerHTML = `
          <svg class="mz abs" width="1920" height="1080" viewBox="0 0 1920 1080">
            <path class="walls" pathLength="1" d="${maze(seed)}" stroke="#9AA3B2" stroke-width="14" stroke-linecap="round" fill="none"/>
          </svg>
          ${manchete ? `<div class="man card" style="left:520px;top:60px;width:880px;padding:22px 30px 26px;border-radius:16px">
            <div style="display:flex;justify-content:space-between;border-bottom:2px solid #0F1B33;padding-bottom:8px;margin-bottom:12px"><span class="serif" style="font-size:24px;font-weight:700">Notícias de Guimarães</span><span class="mono" style="font-size:15px;color:#7C8597">URBANISMO</span></div>
            <div class="serif" style="font-size:46px;line-height:1.08;font-weight:650">Câmara aprova proposta de revisão do <span style="background:linear-gradient(transparent 62%,rgba(217,98,59,.35) 62%)">Plano Diretor Municipal</span></div></div>` : ""}
          ${cartoes.map(([, txt, x, y, r]) => `<div class="cw" style="position:absolute;left:${x}px;top:${y}px" data-r="${r}">${card(txt)}</div>`).join("")}
          <div class="tag abs label-sm" style="left:150px;top:96px;color:#5C6578;font-size:22px">${id}</div>`;
        return { walls: q(el, ".walls"), man: q(el, ".man"), cw: qa(el, ".cw") };
      },
      update(t, c) {
        const t0 = B(bloco).start;
        if (c.man) { const m = P(t, W(bloco, "camara") - 0.3, 0.7, ease.back); S(c.man, { y: L(-260, 0, m), o: t > W(bloco, "camara") - 0.3 ? 1 - P(t, W(bloco, cartoes[0][0]) + 2.2, 0.5, ease.lin) : 0 }); }
        D(c.walls, P(t, W(bloco, cartoes[cartoes.length - 1][0]) + 0.3, 1.6, ease.io));
        c.cw.forEach((w, i) => {
          const tp = W(bloco, cartoes[i][0]) - 0.15, p = P(t, tp, 0.55, ease.back);
          const r = +w.dataset.r;
          S(w, { y: L(-300, 0, P(t, tp, 0.45, ease.in)), r: r * p, s: L(1.1, 1, p), o: t > tp ? 1 : 0 });
        });
      },
    };
  }
  const L4 = labirinto({
    id: "Situação 1 · A casa", bloco: "4", seed: 21, manchete: true,
    cartoes: [["sera", "Ainda posso construir?", 150, 330, -4], ["precisa", "Pedido de informação prévia?", 1300, 360, 5], ["plantas", "Que plantas?", 260, 760, 3], ["servico", "A que serviço?", 1260, 780, -5]],
  });
  scene({ id: "c4", start: CUT.s4, end: CUT.s5 + 0.8, fi: 0.8, fo: 0, z: 4, build: L4.build, update: L4.update });

  // ===================================================================
  // CENA 5 — a esplanada: o segundo labirinto e o verão a passar
  // ===================================================================
  const L5 = labirinto({
    id: "Situação 2 · A esplanada", bloco: "5", seed: 33,
    cartoes: [["licenca", "Licença ou comunicação prévia?", 180, 300, 4], ["quantas", "Quantas mesas?", 1320, 330, -4], ["taxa", "Que taxa?", 240, 760, -3]],
  });
  scene({
    id: "c5", start: CUT.s5, end: CUT.s6 + 0.8, fi: 0.8, fo: 0, z: 5,
    build(el) {
      const c = L5.build(el);
      cue("blip", W("5", "verao") - 0.1, 0.4);
      el.insertAdjacentHTML("beforeend", `
        <div class="cal card" style="left:1340px;top:700px;width:260px;text-align:center;overflow:hidden">
          <div style="background:#D9623B;color:#fff;font-weight:700;letter-spacing:.14em;font-size:20px;padding:8px">ESPLANADA</div>
          <div class="mes serif" style="font-size:72px;font-weight:650;line-height:1.2;padding:8px 0">ABR</div>
          <div class="mono" style="font-size:16px;color:#7C8597;padding-bottom:12px">mesas por montar</div>
        </div>`);
      c.cal = q(el, ".cal"); c.mes = q(el, ".mes");
      return c;
    },
    update(t, c) {
      L5.update(t, c);
      const tv = W("5", "verao") - 0.4;
      S(c.cal, { y: L(30, 0, P(t, tv - 0.6, 0.5)), o: P(t, tv - 0.6, 0.5, ease.lin) });
      const m = ["ABR", "MAI", "JUN", "JUL", "AGO", "SET"][Math.min(5, Math.floor(P(t, tv, 1.8, ease.lin) * 5.99))];
      if (c.mes.textContent !== m) c.mes.textContent = m;
    },
  });

  // ===================================================================
  // CENA 6 — o restaurante não para; a noite
  // ===================================================================
  const MONT = [
    ["fornecedores", "Fornecedores", `<svg viewBox="0 0 64 64" width="90" height="90"><rect x="4" y="20" width="36" height="26" rx="3" fill="#D9623B"/><path d="M40 28 h12 l8 9 v9 h-20z" fill="#B94E2C"/><circle cx="16" cy="50" r="6" fill="#0F1B33"/><circle cx="50" cy="50" r="6" fill="#0F1B33"/></svg>`],
    ["equipa", "Equipa", `<svg viewBox="0 0 64 64" width="90" height="90"><circle cx="22" cy="20" r="9" fill="#0F1B33"/><circle cx="44" cy="22" r="8" fill="#5C6578"/><path d="M8 54 q14 -26 28 0z" fill="#0F1B33"/><path d="M32 54 q12 -22 24 0z" fill="#5C6578"/></svg>`],
    ["clientes", "Clientes", `<svg viewBox="0 0 64 64" width="90" height="90"><ellipse cx="32" cy="40" rx="26" ry="8" fill="#E8B44A"/><path d="M14 38 q18 -24 36 0" fill="#F2EEE6" stroke="#B9AF9E" stroke-width="3"/><path d="M8 20 h8 M48 18 h8" stroke="#0F1B33" stroke-width="4" stroke-linecap="round"/></svg>`],
    ["contas", "Contas", `<svg viewBox="0 0 64 64" width="90" height="90"><rect x="14" y="6" width="30" height="40" fill="#fff" stroke="#0F1B33" stroke-width="3"/><rect x="22" y="14" width="30" height="44" fill="#fff" stroke="#0F1B33" stroke-width="3"/><path d="M28 26 h18 M28 34 h18 M28 42 h12" stroke="#0F1B33" stroke-width="3"/><text x="44" y="54" font-size="12" font-weight="800" fill="#D9623B">€</text></svg>`],
  ];
  const TABS = ["PDM_regulamento.pdf", "Ocupação espaço público", "Taxas 2026", "Pedido de informação prévia", "Formulário (2).pdf", "Contactos", "Licenciamento?", "Planta.pdf"];
  scene({
    id: "c6", start: CUT.s6, end: CUT.s7 + 0.8, fi: 0.8, fo: 0, z: 6,
    build(el) {
      MONT.forEach(([w], i) => cue(i === 3 ? "talao" : i === 0 ? "campainha" : "pin", W("6", w) - 0.1, 0.55));
      cue("noite", tNoite, 0.6); cue("portatil", W("6", "computador") - 0.2, 0.55);
      cue("blip", W("6", "separadores"), 0.3); cue("suspiro", W("6", "espera") + 0.5, 0.8);
      el.style.background = "#E9E3D8";
      el.innerHTML = `
        <div class="day abs" style="width:1920px;height:1080px">
          <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">${ini(860, 330, 0.95)}</svg>
          ${MONT.map(([, lbl, ico], i) => `<div class="mt card" style="left:${[220, 1300, 240, 1320][i]}px;top:${[180, 200, 640, 650][i]}px;width:360px;padding:26px;display:flex;gap:20px;align-items:center">${ico}<div class="serif" style="font-size:38px;font-weight:600">${lbl}</div></div>`).join("")}
        </div>
        <div class="night abs" style="width:1920px;height:1080px;background:#101A30">
          <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
            <defs><radialGradient id="v1lamp" cx="50%" cy="0%" r="70%"><stop offset="0" stop-color="#F7D98A" stop-opacity=".55"/><stop offset="1" stop-color="#F7D98A" stop-opacity="0"/></radialGradient></defs>
            <path d="M960 0 V120" stroke="#2A3552" stroke-width="4"/><path d="M920 120 h80 l-14 40 h-52z" fill="#2A3552"/>
            <path d="M600 160 L1320 160 L1700 1080 L220 1080 Z" fill="url(#v1lamp)"/>
            <rect y="760" width="1920" height="40" fill="#3A2A1C"/><rect y="800" width="1920" height="280" fill="#241A12"/>
            <g transform="translate(560 330) scale(1.1)"><g class="nines">${ines()}</g></g>
          </svg>
          <div class="lap abs" style="left:900px;top:330px;width:760px;height:440px;border-radius:18px 18px 4px 4px;background:#1B2236;border:12px solid #2A3552;box-shadow:0 0 120px rgba(160,190,255,.35);overflow:hidden">
            <div style="display:flex;flex-wrap:wrap;gap:6px;padding:10px;background:#252F4A">${TABS.map((tb) => `<div class="tab mono" style="padding:6px 10px;border-radius:8px 8px 2px 2px;background:#3A4E7A;color:#DDE6F7;font-size:14px;white-space:nowrap">${tb}</div>`).join("")}</div>
            <div class="doc" style="margin:18px;padding:18px;border-radius:8px;background:#F2EEE6;color:#0F1B33">
              <div style="font-weight:700;font-size:22px">Regulamento · Capítulo III · Artigo 14.º</div>
              ${[...Array(7)].map((_, i) => `<div style="height:10px;margin-top:12px;border-radius:4px;background:#D7D0C2;width:${92 - (i % 3) * 12}%"></div>`).join("")}
              <div class="mono" style="margin-top:14px;font-size:15px;color:#7C8597">página 87 de 312</div>
            </div>
          </div>
          <div class="ph card" style="left:1500px;top:640px;width:260px;padding:18px 20px;background:#16264A;color:#fff;border:1px solid #3A4E7A">
            <div class="mono" style="font-size:16px;color:#8FA3C4">CHAMADA</div><div style="font-size:26px;font-weight:700">Em espera…</div><div class="mono" style="font-size:22px;color:#E8B44A">18:47</div>
          </div>
        </div>`;
      return { day: q(el, ".day"), mt: qa(el, ".mt"), night: q(el, ".night"), lap: q(el, ".lap"), tabs: qa(el, ".tab"), doc: q(el, ".doc"), ph: q(el, ".ph"), dini: q(el, ".day .ini"), nworry: q(el, ".nines .worry"), nmouth: q(el, ".nines .mouth-n") };
    },
    update(t, c) {
      c.mt.forEach((m, i) => { const p = P(t, W("6", MONT[i][0]) - 0.2, 0.45, ease.back); S(m, { s: L(0.4, 1, p), r: [-4, 3, 5, -3][i] * p, o: Math.min(1, p * 2) }); });
      // a Inês é puxada para todos os lados
      const pull = win(t, W("6", "fornecedores"), tNoite, 0.2, 0.3);
      c.dini.setAttribute("transform", `translate(${Math.sin(t * 7) * 14 * pull} ${Math.abs(Math.sin(t * 9)) * -8 * pull})`);
      const nt = P(t, tNoite, 0.9, ease.io); O(c.night, nt); O(c.day, 1 - nt);
      S(c.lap, { y: L(30, 0, P(t, W("6", "computador") - 0.5, 0.6)), o: P(t, W("6", "computador") - 0.5, 0.5, ease.lin) });
      c.tabs.forEach((tb, i) => O(tb, P(t, W("6", "separadores") - 0.3 + i * 0.12, 0.2, ease.lin)));
      O(c.doc, P(t, W("6", "regulamentos") - 0.2, 0.4, ease.lin));
      S(c.ph, { x: L(40, 0, P(t, W("6", "chamadas") - 0.2, 0.5)), o: P(t, W("6", "chamadas") - 0.2, 0.4, ease.lin) });
      O(c.nworry, 1); O(c.nmouth, 0);
    },
  });

  // ===================================================================
  // CENA 7 — contratar alguém só para perceber o caminho?
  // ===================================================================
  const BC = [["arquiteto", "Arquiteto", "projetos · licenciamento"], ["engenheiro", "Engenheiro", "estruturas · especialidades"], ["consultor", "Consultor", "processos · regulamentos"]];
  const FALTA = [["tempo", "tempo", `<svg viewBox="0 0 48 48" width="70" height="70"><circle cx="24" cy="26" r="17" fill="none" stroke="#F2EEE6" stroke-width="4"/><path d="M24 26 V15 M24 26 l8 5" stroke="#F2EEE6" stroke-width="4" stroke-linecap="round"/></svg>`], ["normas", "normas", `<svg viewBox="0 0 48 48" width="70" height="70"><path d="M8 10 h14 q2 0 2 2 v28 q0 -2 -2 -2 h-14z M40 10 h-14 q-2 0 -2 2 v28 q0 -2 2 -2 h14z" fill="none" stroke="#F2EEE6" stroke-width="4" stroke-linejoin="round"/></svg>`], ["leis", "leis e processos", `<svg viewBox="0 0 48 48" width="70" height="70"><text x="24" y="38" text-anchor="middle" font-family="Fraunces" font-size="40" font-weight="700" fill="#F2EEE6">§</text></svg>`]];
  scene({
    id: "c7", start: CUT.s7, end: CUT.s8 + 0.8, fi: 0.8, fo: 0, z: 7,
    build(el) {
      BC.forEach(([w]) => cue("cartoes", W("7", w) - 0.1, 0.7));
      FALTA.forEach(([w]) => cue("bump", W("7", w), 0.5));
      el.style.background = "#1A1410";
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs><radialGradient id="v1lamp2" cx="50%" cy="10%" r="75%"><stop offset="0" stop-color="#F7D98A" stop-opacity=".35"/><stop offset="1" stop-color="#F7D98A" stop-opacity="0"/></radialGradient></defs>
          <rect width="1920" height="1080" fill="#5A4630"/>${[...Array(14)].map((_, i) => `<path d="M0 ${i * 80} H1920" stroke="#4E3C28" stroke-width="3"/>`).join("")}
          <rect width="1920" height="1080" fill="url(#v1lamp2)"/>
        </svg>
        ${BC.map(([, n, s], i) => `<div class="bc" style="position:absolute;left:${300 + i * 470}px;top:${300 + (i % 2) * 40}px;width:400px;height:230px;border-radius:10px;background:#FBF8F2;box-shadow:0 20px 40px rgba(0,0,0,.4);padding:30px 32px">
            <div class="mono" style="font-size:16px;color:#7C8597;letter-spacing:.1em">CARTÃO DE VISITA</div>
            <div class="serif" style="font-size:46px;font-weight:650;margin-top:10px">${n}</div>
            <div style="font-size:20px;color:#5C6578;margin-top:6px">${s}</div>
            <div class="orc" style="position:absolute;right:-18px;top:-18px;padding:8px 14px;border-radius:999px;background:#E8B44A;color:#0F1B33;font-weight:800;font-size:20px">€ orçamento?</div>
          </div>`).join("")}
        <div class="pg abs serif" style="left:0;width:1920px;top:640px;text-align:center;font-size:58px;font-weight:600;color:#F2EEE6">Pagar só para perceber o caminho?</div>
        <div class="abs" style="left:0;width:1920px;top:800px;display:flex;justify-content:center;gap:110px">
          ${FALTA.map(([, n, ico]) => `<div class="fa" style="position:relative;text-align:center;color:#F2EEE6;font-size:26px">${ico}<div style="margin-top:8px">${n}</div><div class="x" style="position:absolute;left:50%;top:6px;width:110px;height:6px;margin-left:-55px;background:#E5484D;border-radius:3px;transform:rotate(-35deg)"></div></div>`).join("")}
        </div>`;
      return { bc: qa(el, ".bc"), orc: qa(el, ".orc"), pg: q(el, ".pg"), fa: qa(el, ".fa"), x: qa(el, ".x") };
    },
    update(t, c) {
      c.bc.forEach((b, i) => { const tp = W("7", BC[i][0]) - 0.15, p = P(t, tp, 0.5, ease.out); S(b, { y: L(-200, 0, p), r: L(-25, [-5, 2, 6][i], p), o: t > tp ? 1 : 0 }); });
      c.orc.forEach((o, i) => { const p = P(t, W("7", "so") + i * 0.2, 0.4, ease.back); S(o, { s: p, o: p > 0 ? 1 : 0 }); });
      S(c.pg, { y: L(16, 0, P(t, W("7", "caminho") - 0.2, 0.5)), o: P(t, W("7", "caminho") - 0.2, 0.5, ease.lin) });
      c.fa.forEach((f, i) => { const tp = W("7", FALTA[i][0]) - 0.15; O(f, P(t, tp, 0.3, ease.lin)); c.x[i].style.transform = `rotate(-35deg) scaleX(${P(t, tp + 0.25, 0.3, ease.out)})`; });
    },
  });

  // ===================================================================
  // CENA 8 — Guimarães à noite: e se bastasse dizer o que precisa?
  // ===================================================================
  const R8 = rng(8);
  const BLD = [];
  let bx = 0;
  while (bx < 1920) { const w = 90 + R8() * 150, h = 180 + R8() * 300; BLD.push([bx, w, h]); bx += w + 6; }
  const WINS = [];
  BLD.forEach(([x, w, h]) => { for (let yy = 1080 - h + 30; yy < 1040; yy += 46) for (let xx = x + 14; xx < x + w - 24; xx += 34) if (R8() < 0.42) WINS.push([xx, yy, R8() < 0.35]); });
  scene({
    id: "c8", start: CUT.s8, end: TOTAL + 0.1, fi: 0.9, fo: 0, z: 8,
    build(el) {
      cue("shimmer", W("8", "regras") - 0.1, 0.35);
      cue("final", W("8", "e", 1) - 0.1, 0.5);
      el.style.background = "#0B1222";
      el.innerHTML = `
        <svg class="city abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <circle cx="1560" cy="200" r="60" fill="#E9E3D2" opacity=".9"/>
          <g transform="translate(-260 210)" fill="#16203A"><rect x="1400" y="540" width="220" height="56"/><rect x="1392" y="510" width="34" height="86"/><rect x="1594" y="510" width="34" height="86"/><rect x="1484" y="458" width="54" height="138"/></g>
          ${BLD.map(([x, w, h]) => `<rect x="${x}" y="${1080 - h}" width="${w}" height="${h}" fill="#141C33"/>`).join("")}
          ${WINS.map(([x, y, qm], i) => `<g class="w" data-i="${i}"><rect x="${x}" y="${y}" width="20" height="26" fill="#F7D98A"/>${qm ? `<text x="${x + 10}" y="${y + 21}" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="20" fill="#B94E2C">?</text>` : ""}</g>`).join("")}
        </svg>
        <div class="sh abs" style="left:0;width:1920px;top:180px;display:flex;justify-content:center;align-items:center;gap:18px;color:#B8C4DA;font-size:30px"><span style="width:52px;height:52px">${ICON.shield("#B8C4DA")}</span>regras necessárias</div>
        <div class="q1 abs serif" style="left:0;width:1920px;top:400px;text-align:center;font-size:84px;font-weight:600;color:#F2EEE6">E se bastasse dizer<br><span style="color:#E8B44A;font-style:italic">o que precisa?</span></div>
        <div class="sig abs mono" style="left:0;width:1920px;top:640px;text-align:center;font-size:24px;letter-spacing:.2em;color:#8FA3C4">DELEGATE · 1/3</div>`;
      return { city: q(el, ".city"), w: qa(el, ".w"), sh: q(el, ".sh"), q1: q(el, ".q1"), sig: q(el, ".sig") };
    },
    update(t, c) {
      O(c.sh, win(t, W("8", "regras") - 0.2, W("8", "mas") + 0.4, 0.4, 0.4));
      const tz = W("8", "mas") - 0.2;
      c.city.style.transformOrigin = "960px 1080px";
      S(c.city, { s: L(1.25, 1, P(t, CUT.s8, 6, ease.out)) });
      c.w.forEach((w, i) => O(w, P(t, tz + (i % 40) * 0.05, 0.3, ease.lin) * (0.8 + 0.2 * Math.sin(t * 2 + i))));
      const qp = P(t, W("8", "e", 1) - 0.1, 0.9, ease.out);
      S(c.q1, { y: L(20, 0, qp), o: qp });
      O(c.sig, P(t, B("8").end + 0.8, 0.6, ease.lin));
    },
  });
})();
