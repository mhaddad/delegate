/* ATO I — cenas 1 a 4 */
(function () {
  const { CUT, cue, shake, burst, rings, motes, P, L, W, B, S, O, D, type, ease, clamp, rng, H, q, qa, ines, henriques, ICON, scene, win } = F;

  // ===================================================================
  // CENA 1 + início da 2 — o terreno do avô, o novo PDM
  // ===================================================================
  const castle = (fill) => `
    <g fill="${fill}">
      <rect x="1400" y="540" width="220" height="56"/>
      <rect x="1392" y="510" width="34" height="86"/><rect x="1594" y="510" width="34" height="86"/>
      <rect x="1484" y="458" width="54" height="138"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${1404 + i * 44}" y="530" width="14" height="12"/>`).join("")}
      ${[0, 1, 2].map((i) => `<rect x="${1486 + i * 19}" y="446" width="12" height="14"/>`).join("")}
      <rect x="1394" y="500" width="10" height="12"/><rect x="1414" y="500" width="10" height="12"/>
      <rect x="1596" y="500" width="10" height="12"/><rect x="1616" y="500" width="10" height="12"/>
    </g>`;
  const tree = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="0" width="8" height="40" fill="#7B6A4E"/><circle cx="0" cy="-10" r="30" fill="${c}"/></g>`;

  function landscapeSVG(id, sunset = false) {
    const sky1 = sunset ? "#F3B27A" : "#F6E6CF", sky2 = sunset ? "#F7DCC0" : "#F2EEE6";
    return `
    <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs><linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient></defs>
      <rect width="1920" height="1080" fill="url(#${id}sky)"/>
      <circle class="sun" cx="${sunset ? 1180 : 1450}" cy="${sunset ? 560 : 290}" r="${sunset ? 120 : 86}" fill="${sunset ? "#F08A4B" : "#F6CB8F"}" opacity=".9"/>
      <path d="M0 640 Q300 520 620 590 T1200 560 T1920 540 V1080 H0Z" fill="${sunset ? "#C79A86" : "#C9D3B4"}"/>
      ${castle(sunset ? "#9C7468" : "#93A58A")}
      <path d="M0 720 Q380 630 820 690 T1920 660 V1080 H0Z" fill="${sunset ? "#B7876F" : "#A9BC8C"}"/>
      ${tree(240, 650, 1, sunset ? "#8E6A58" : "#8EA673")}${tree(300, 668, 0.8, sunset ? "#8E6A58" : "#8EA673")}${tree(1700, 640, 1.1, sunset ? "#8E6A58" : "#8EA673")}${tree(1620, 662, 0.7, sunset ? "#8E6A58" : "#8EA673")}
      <path d="M0 790 Q520 740 980 770 T1920 760 V1080 H0Z" fill="${sunset ? "#D2A57F" : "#BFCB95"}"/>
      <path class="plot" d="M640 830 L1300 830 L1430 1010 L520 1010 Z" fill="${sunset ? "#DBB38E" : "#C9D4A0"}" stroke="#8A7A55" stroke-width="4" stroke-dasharray="14 12"/>
      ${[[640, 830], [1300, 830], [1430, 1010], [520, 1010]].map(([x, y]) => `<rect x="${x - 5}" y="${y - 22}" width="10" height="26" rx="2" fill="#7B6A4E"/>`).join("")}
    </svg>`;
  }

  scene({
    id: "s01", start: 0, end: CUT.s02 + 0.9, fi: 0, fo: 0,
    build(el) {
      el.style.background = "#F2EEE6";
      el.innerHTML = `
        <div class="land abs" style="width:1920px;height:1080px">${landscapeSVG("l1")}</div>
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <path class="house" pathLength="1" d="M770 856 L1170 856 L1236 966 L704 966 Z" fill="rgba(217,98,59,.12)" stroke="#D9623B" stroke-width="6" stroke-dasharray="1 1" stroke-linejoin="round"/>
          <g class="pin"><path d="M0 0 C-30 -40 -34 -60 -34 -76 A34 34 0 1 1 34 -76 C34 -60 30 -40 0 0Z" fill="#D9623B"/><circle cy="-76" r="13" fill="#F2EEE6"/></g>
          <g class="ines-g">${ines({ photo: true })}</g>
          <text class="qmark serif" x="0" y="0" font-size="260" font-weight="700" fill="#D9623B" text-anchor="middle">?</text>
        </svg>
        <div class="pinlabel card" style="left:1010px;top:700px;padding:14px 22px;border-radius:16px">
          <div class="mono" style="font-size:16px;color:#7C8597;letter-spacing:.08em">TERRENO</div>
          <div style="font-size:30px;font-weight:650">Ponte, Guimarães</div>
        </div>
        <div class="m2 abs serif" style="left:0;top:0;font-size:64px;font-weight:650;color:#D9623B;text-shadow:0 2px 0 #F2EEE6">0 m²</div>
        <div class="photo abs" style="left:680px;top:280px;width:560px;height:440px;background:#F7F1E4;padding:20px 20px 60px;box-shadow:0 30px 60px rgba(0,0,0,.25)">
          <svg width="520" height="360" viewBox="0 0 520 360" style="display:block">
            <rect width="520" height="360" fill="#E6D3AE"/>
            <path d="M0 210 Q140 160 280 190 T520 170 V360 H0Z" fill="#CDB689"/>
            <g fill="#A88E62"><rect x="390" y="150" width="70" height="20"/><rect x="418" y="128" width="18" height="42"/><rect x="386" y="140" width="12" height="30"/><rect x="452" y="140" width="12" height="30"/></g>
            <path d="M0 260 Q260 230 520 250 V360 H0Z" fill="#BFA477"/>
            <g fill="#5A4630">
              <circle cx="190" cy="168" r="17"/><path d="M168 158 Q190 138 212 158 Z"/><rect x="164" y="154" width="52" height="7" rx="3"/>
              <path d="M170 188 Q190 180 210 188 L218 270 L162 270 Z"/>
              <rect x="166" y="268" width="14" height="52"/><rect x="200" y="268" width="14" height="52"/>
              <path d="M214 200 L262 128" stroke="#5A4630" stroke-width="7" stroke-linecap="round"/>
              <path d="M252 122 L276 132 L262 146 Z"/>
            </g>
            <rect width="520" height="360" fill="#6B4F2A" opacity=".12"/>
          </svg>
          <div class="serif" style="font-style:italic;font-size:24px;color:#7A6648;margin-top:12px;text-align:center">o avô, no terreno</div>
        </div>
        <div class="headline card" style="left:530px;top:60px;width:860px;padding:26px 34px 30px;border-radius:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0F1B33;padding-bottom:10px;margin-bottom:14px">
            <span class="serif" style="font-size:26px;font-weight:700">Notícias de Guimarães</span>
            <span class="mono" style="font-size:15px;color:#7C8597">URBANISMO</span>
          </div>
          <div class="serif" style="font-size:50px;line-height:1.08;font-weight:650">Guimarães aprova novo <span style="background:linear-gradient(transparent 62%,rgba(217,98,59,.35) 62%)">Plano Diretor Municipal</span></div>
        </div>
        <div class="thought abs" style="left:420px;top:330px">
          <div class="card serif" style="position:relative;padding:22px 32px;border-radius:40px;font-size:42px;font-style:italic;white-space:nowrap">Ainda posso construir?</div>
          <div class="card" style="left:70px;top:104px;width:26px;height:26px;border-radius:50%"></div>
          <div class="card" style="left:96px;top:140px;width:14px;height:14px;border-radius:50%"></div>
        </div>`;
      // som e ambiente
      cue("foto", 1.25, 0.8);
      cue("pin", W("01", "ponte") + 0.25, 0.7);
      cue("shimmer", W("01", "cento"), 0.45);
      cue("jornal", W("02", "mas") - 0.05, 0.8);
      cue("tensao", W("02", "pergunta") - 0.3, 0.55);
      motes({ seed: 3, a: 0, b: CUT.s02 + 0.9, n: 45, area: [0, 120, 1920, 900] });
      return {
        worry: q(el, ".ines-g .worry"), mouthN: q(el, ".ines-g .mouth-n"),
        photo: q(el, ".photo"), land: q(el, ".land"), ines: q(el, ".ines-g"), legL: q(el, ".leg-l"), legR: q(el, ".leg-r"),
        pin: q(el, ".pin"), pinlabel: q(el, ".pinlabel"), house: q(el, ".house"), m2: q(el, ".m2"),
        headline: q(el, ".headline"), qmark: q(el, ".qmark"), thought: q(el, ".thought"),
      };
    },
    update(t, c, el) {
      // o novo PDM tira a cor ao mundo da Inês
      const m = P(t, W("02", "mas"), 2.2, ease.io);
      el.style.filter = m > 0 ? `saturate(${L(1, 0.5, m)}) brightness(${L(1, 0.93, m)})` : "";
      const wr = P(t, W("02", "pergunta") - 0.2, 0.4, ease.lin);
      O(c.worry, wr); O(c.mouthN, 1 - wr);
      const tAvo = W("01", "avo"), tPonte = W("01", "ponte"), tConstr = W("01", "construir"), tCento = W("01", "cento");
      // fotografia cai e depois "abre-se" na paisagem
      const drop = P(t, 0.1, 1.4, ease.out);
      const open = P(t, tAvo + 0.1, 1.3, ease.io);
      S(c.photo, { y: L(-760, 0, drop), r: L(-14, -3, drop) * (1 - open), s: L(1, 3.4, open), o: 1 - P(t, tAvo + 0.5, 0.8, ease.lin) });
      O(c.land, P(t, tAvo + 0.1, 1.0, ease.lin));
      // Inês entra a caminhar
      const wk = P(t, tAvo + 0.6, 2.8, ease.lin);
      const walking = wk > 0 && wk < 1;
      const x = L(-240, 330, ease.out(wk));
      const bob = walking ? Math.abs(Math.sin(t * 9)) * -6 : 0;
      S(c.ines, { x, y: 480 + bob, s: 0.98, o: 1 });
      const sw = walking ? Math.sin(t * 9) * 14 * (1 - wk) : 0;
      c.legL.style.transformOrigin = "50% 0%"; c.legR.style.transformOrigin = "50% 0%";
      S(c.legL, { r: sw }); S(c.legR, { r: -sw });
      // pin
      const pp = P(t, tPonte - 0.2, 0.7, ease.back);
      S(c.pin, { x: 960, y: L(-200, 905, P(t, tPonte - 0.2, 0.55, ease.in)), s: L(0.6, 1, pp), o: t > tPonte - 0.2 ? 1 - P(t, W("02", "pergunta") - 0.3, 0.3, ease.lin) : 0 });
      S(c.pinlabel, { x: L(-30, 0, P(t, tPonte + 0.3, 0.6)), o: P(t, tPonte + 0.3, 0.5, ease.lin) * (1 - P(t, tConstr - 0.4, 0.4, ease.lin)) });
      // contorno da casa
      D(c.house, P(t, tConstr, 1.4, ease.io));
      const grey = P(t, W("02", "e") + 0.0, 0.6, ease.lin);
      c.house.style.stroke = grey > 0 ? `rgb(${L(217, 154, grey)},${L(98, 163, grey)},${L(59, 178, grey)})` : "#D9623B";
      c.house.style.fill = `rgba(217,98,59,${0.12 * (1 - grey)})`;
      const shake = t > W("02", "e") && t < W("02", "e") + 0.8 ? Math.sin(t * 70) * 6 * (1 - (t - W("02", "e")) / 0.8) : 0;
      c.house.style.transform = `translateX(${shake}px)`;
      O(c.house, t >= tConstr ? 1 : 0);
      const pulse = t > tCento + 1.5 && t < W("02", "e") ? 0.5 + 0.5 * Math.sin((t - tCento) * 6) : 1;
      c.house.style.strokeWidth = 6 + (1 - pulse) * 3;
      // contador 150 m²
      const cnt = P(t, tCento - 0.1, 1.3, ease.out);
      c.m2.textContent = `${Math.round(150 * cnt)} m²`;
      S(c.m2, { x: 1215, y: 760 + L(20, 0, P(t, tCento - 0.2, 0.5)), o: P(t, tCento - 0.2, 0.4, ease.lin) * (1 - grey * 0.6) });
      // manchete
      const hl = P(t, W("02", "mas") - 0.1, 0.8, ease.back);
      S(c.headline, { y: L(-300, 0, hl), o: t > W("02", "mas") - 0.1 ? 1 : 0 });
      // ponto de interrogação
      const qm = P(t, W("02", "pergunta"), 0.6, ease.back);
      S(c.qmark, { x: 970, y: 700 + Math.sin(t * 2.4) * 6, s: qm, o: qm > 0 ? 1 : 0 });
      // pensamento
      const th = P(t, W("02", "ainda") - 0.3, 0.6, ease.back);
      S(c.thought, { s: th, o: Math.min(1, th * 2) });
    },
  });

  // ===================================================================
  // CENA 2 — o labirinto da burocracia
  // ===================================================================
  const COLS = 15, ROWS = 8, CELL = 112, OX = 120, OY = 92;
  function makeMaze(seed) {
    const r = rng(seed);
    const walls = []; // walls[y][x] = {n,e,s,w}
    for (let y = 0; y < ROWS; y++) { walls.push([]); for (let x = 0; x < COLS; x++) walls[y].push({ n: 1, e: 1, s: 1, w: 1 }); }
    const seen = new Set(); const stack = [[0, 4]]; seen.add("0,4");
    const dirs = [["n", 0, -1, "s"], ["e", 1, 0, "w"], ["s", 0, 1, "n"], ["w", -1, 0, "e"]];
    while (stack.length) {
      const [x, y] = stack[stack.length - 1];
      const opts = dirs.filter(([, dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS && !seen.has(nx + "," + ny); });
      if (!opts.length) { stack.pop(); continue; }
      const [d, dx, dy, od] = opts[Math.floor(r() * opts.length)];
      walls[y][x][d] = 0; walls[y + dy][x + dx][od] = 0; seen.add(x + dx + "," + (y + dy)); stack.push([x + dx, y + dy]);
    }
    walls[4][0].w = 0;
    return walls;
  }
  function bfs(walls, from, to) {
    const key = (p) => p[0] + "," + p[1];
    const prev = new Map([[key(from), null]]); const qq = [from];
    const dirs = [["n", 0, -1], ["e", 1, 0], ["s", 0, 1], ["w", -1, 0]];
    while (qq.length) {
      const c = qq.shift(); if (key(c) === key(to)) break;
      for (const [d, dx, dy] of dirs) {
        if (walls[c[1]][c[0]][d]) continue;
        const n = [c[0] + dx, c[1] + dy]; if (n[0] < 0 || n[1] < 0 || n[0] >= COLS || n[1] >= ROWS) continue;
        if (!prev.has(key(n))) { prev.set(key(n), c); qq.push(n); }
      }
    }
    const path = []; let c = to; while (c) { path.unshift(c); c = prev.get(key(c)); } return path;
  }
  const maze = makeMaze(7);
  // becos sem saída, ordenados por distância à entrada
  const dead = [];
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const w = maze[y][x]; if (w.n + w.e + w.s + w.w === 3 && !(x === 0 && y === 4)) dead.push([x, y]); }
  const distTo = (p) => bfs(maze, [0, 4], p).length;
  dead.sort((a, b) => distTo(a) - distTo(b));
  const targets = [dead.find((d) => distTo(d) > 7 && distTo(d) < 13), dead.find((d) => distTo(d) > 16 && distTo(d) < 24), dead.filter((d) => distTo(d) > 22).sort((a, b) => b[0] - a[0])[0]].filter(Boolean);
  let route = [[0, 4]]; const stops = [];
  let cur = [0, 4];
  for (const tg of targets) { const p = bfs(maze, cur, tg); route = route.concat(p.slice(1)); stops.push(route.length - 1); cur = tg; }
  const cellC = ([x, y]) => [OX + x * CELL + CELL / 2, OY + y * CELL + CELL / 2];

  let wallPath = "";
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const w = maze[y][x], x0 = OX + x * CELL, y0 = OY + y * CELL;
    if (w.n) wallPath += `M${x0} ${y0}H${x0 + CELL}`;
    if (w.w) wallPath += `M${x0} ${y0}V${y0 + CELL}`;
    if (y === ROWS - 1 && w.s) wallPath += `M${x0} ${y0 + CELL}H${x0 + CELL}`;
    if (x === COLS - 1 && w.e) wallPath += `M${x0 + CELL} ${y0}V${y0 + CELL}`;
  }

  const mzCards = [
    { w: ["02", "regulamentos"], x: 1250, y: 120, r: 4, html: `<div style="display:flex;gap:16px;align-items:center"><div style="width:46px;height:56px">${ICON.doc("#0F1B33")}</div><div><div style="font-weight:700;font-size:26px">Regulamento do PDM</div><div class="mono" style="font-size:17px;color:#7C8597">PDF · 312 páginas</div></div></div>` },
    { w: ["02", "plantas"], x: 120, y: 760, r: -5, html: `<div style="font-weight:700;font-size:24px;margin-bottom:8px">Planta de Ordenamento</div><svg width="250" height="110"><rect width="250" height="110" fill="#EDE6D6"/><path d="M0 70 Q60 40 120 60 T250 40 V110 H0Z" fill="#E9C9A0"/><path d="M40 0 L90 110 M160 0 L130 110" stroke="#C9A27A" stroke-width="3"/><rect x="100" y="20" width="60" height="40" fill="#D7B8D6"/></svg>` },
    { w: ["02", "condicionantes"], x: 1370, y: 700, r: 5, html: `<div style="font-weight:700;font-size:24px;margin-bottom:8px">Planta de Condicionantes</div><svg width="250" height="110"><rect width="250" height="110" fill="#E8EEE6"/><path d="M0 50 Q80 20 150 60 T250 50" stroke="#6FA8DC" stroke-width="8" fill="none"/><path d="M30 80 h80 v30 h-80z" fill="#A9D18E" opacity=".8"/><path d="M150 10 l60 0 l20 40 l-70 10z" fill="#F4B183" opacity=".8"/></svg>` },
    { w: ["02", "balcoes"], x: 860, y: 46, r: -3, html: `<div style="text-align:center;padding:4px 18px"><div class="mono" style="font-size:16px;color:#7C8597">SENHA</div><div class="serif" style="font-size:64px;font-weight:700;line-height:1">A047</div><div class="mono" style="font-size:15px;color:#7C8597">aguarde a sua vez</div></div>` },
    { w: ["02", "telefonemas"], x: 300, y: 70, r: 3, html: `<div style="display:flex;gap:14px;align-items:center"><svg width="44" height="44" viewBox="0 0 24 24"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2" fill="#0F1B33"/></svg><div><div style="font-weight:700;font-size:24px">Em espera…</div><div class="mono" style="font-size:17px;color:#7C8597">a sua chamada é importante · 12:47</div></div></div>` },
  ];

  // instantes em que a Inês bate nos becos (mesma conta do update da cena 2)
  const MZ_T0 = CUT.s02 + 0.7, MZ_T1 = B("02").end - 0.2, MZ_PAUSE = 0.45;
  const MZ_PER = (MZ_T1 - MZ_T0 - MZ_PAUSE * stops.length) / (route.length - 1);
  const BUMPS = stops.map((si, i) => MZ_T0 + si * MZ_PER + i * MZ_PAUSE);
  BUMPS.forEach((tb) => { cue("bump", tb, 0.9); shake(tb, 9, 0.4); });
  mzCards.forEach((m) => cue("papel", W(...m.w) - 0.15, 0.55));

  scene({
    id: "s02", start: CUT.s02, end: CUT.s03 + 0.9, fi: 0.8, fo: 0, z: 2,
    build(el) {
      el.style.background = "#ECE6DA";
      el.innerHTML = `
        <svg class="mz abs" width="1920" height="1080" viewBox="0 0 1920 1080" style="transform-origin:0 0">
          <rect x="${OX - 30}" y="${OY - 30}" width="${COLS * CELL + 60}" height="${ROWS * CELL + 60}" rx="24" fill="#F4EFE6"/>
          <path d="${wallPath}" stroke="#9AA3B2" stroke-width="13" stroke-linecap="round" fill="none"/>
          <path class="trail" fill="none" stroke="#D9623B" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round" opacity=".55"/>
          <g class="xs"></g>
          <g class="tok"><circle r="30" fill="#D9623B" stroke="#fff" stroke-width="6"/><circle cy="-6" r="9" fill="#F2EEE6"/><path d="M-13 14 Q0 -2 13 14" fill="#F2EEE6"/></g>
        </svg>
        ${mzCards.map((c, i) => `<div class="mzc card" data-i="${i}" style="left:${c.x}px;top:${c.y}px;padding:18px 22px">${c.html}</div>`).join("")}
        <div class="tabs abs" style="left:430px;top:1004px;display:flex;gap:12px">
          ${["PDM_regulamento.pdf", "Planta (3).pdf", "Requerimento_v2.docx", "Taxas 2026", "Contactos"].map((tb) => `<div class="tab card mono" style="position:relative;padding:10px 16px;border-radius:12px 12px 4px 4px;font-size:21px;white-space:nowrap">${tb} <span style="color:#9AA3B2">✕</span></div>`).join("")}
        </div>
        <div class="dipl card" style="left:1420px;top:380px;width:400px;padding:26px 28px;text-align:center;border:3px double #C9A86A">
          <svg width="90" height="60" viewBox="0 0 90 60"><path d="M45 4 L88 22 L45 40 L2 22Z" fill="#0F1B33"/><path d="M22 30 V46 Q45 58 68 46 V30" fill="#0F1B33"/><path d="M80 25 V48" stroke="#E8B44A" stroke-width="3"/></svg>
          <div class="mono" style="font-size:15px;color:#7C8597;letter-spacing:.1em;margin-top:6px">DIPLOMA</div>
          <div class="serif" style="font-size:36px;font-weight:650;line-height:1.1">Especialista em urbanismo<span style="color:#D9623B">?</span></div>
        </div>`;
      const xs = q(el, ".xs");
      stops.forEach((si) => {
        const [cx, cy] = cellC(route[si]);
        xs.insertAdjacentHTML("beforeend", `<g class="x" transform="translate(${cx} ${cy})"><g><circle r="34" fill="#E5484D" opacity=".18"/><path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke="#E5484D" stroke-width="6" stroke-linecap="round"/></g></g>`);
      });
      return { mz: q(el, ".mz"), tok: q(el, ".tok"), trail: q(el, ".trail"), xs: qa(el, ".x > g"), cards: qa(el, ".mzc"), tabs: qa(el, ".tab"), dipl: q(el, ".dipl") };
    },
    update(t, c, el) {
      const red = Math.max(0, ...BUMPS.map((tb) => (t >= tb && t < tb + 0.7 ? 1 - (t - tb) / 0.7 : 0)));
      el.style.boxShadow = red > 0 ? `inset 0 0 ${260 * red}px rgba(229,72,77,${0.55 * red})` : "none";
      // percurso com paragens nos becos
      const t0 = MZ_T0, t1 = MZ_T1;
      const n = route.length - 1;
      // tempo por célula, com uma pausa de 0.45 s em cada beco
      const pause = MZ_PAUSE, per = MZ_PER;
      let tt = t - t0, idx = 0, frac = 0, bumped = -1;
      for (let i = 0; i < n; i++) {
        if (tt <= 0) break;
        if (tt < per) { idx = i; frac = ease.sine(tt / per); tt = -1; break; }
        tt -= per; idx = i + 1; frac = 0;
        const si = stops.indexOf(i + 1);
        if (si >= 0) { if (tt < pause) { bumped = si; tt = -1; break; } tt -= pause; }
      }
      if (tt > 0) { idx = n; frac = 0; }
      const a = cellC(route[Math.min(idx, n)]), b = cellC(route[Math.min(idx + 1, n)]);
      let px = L(a[0], b[0], frac), py = L(a[1], b[1], frac);
      if (t < t0) [px, py] = [OX - 50, cellC([0, 4])[1]];
      const shake = bumped >= 0 ? Math.sin(t * 60) * 7 : 0;
      c.tok.setAttribute("transform", `translate(${px + shake} ${py})`);
      // rasto
      const pts = route.slice(0, Math.min(idx, n) + 1).map(cellC);
      if (t >= t0) pts.push([px, py]);
      c.trail.setAttribute("d", pts.length ? "M" + pts.map((p) => p.join(" ")).join("L") : "");
      // X nos becos já visitados
      c.xs.forEach((x, i) => {
        let reached = 0; let acc = t0;
        for (let k = 0; k < stops[i]; k++) { acc += per; if (stops.indexOf(k + 1) >= 0 && k + 1 < stops[i]) acc += pause; }
        reached = P(t, acc, 0.35, ease.back);
        S(x, { s: reached, o: reached > 0 ? 1 : 0 });
      });
      // câmara: começa perto da Inês e afasta-se
      const zoom = P(t, W("02", "para") - 0.2, 1.8, ease.io);
      const s = L(1.65, 0.93, zoom);
      const fx = L(px, OX + (COLS * CELL) / 2, zoom), fy = L(py, OY + (ROWS * CELL) / 2, zoom);
      c.mz.style.transform = `translate(${960 - s * fx}px, ${L(540, 520, zoom) - s * fy}px) scale(${s})`;
      // cartões
      mzCards.forEach((m, i) => {
        const tp = W(...m.w) - 0.15;
        const p = P(t, tp, 0.55, ease.back);
        S(c.cards[i], { y: L(40, 0, p), r: m.r * p, s: L(0.6, 1, p), o: Math.min(1, p * 2) });
      });
      c.tabs.forEach((tb, i) => { const p = P(t, W("02", "telefonemas") + 0.3 + i * 0.18, 0.4, ease.back); S(tb, { y: L(60, 0, p), o: Math.min(1, p * 2) }); });
      const dp = P(t, W("02", "especialista") - 0.1, 0.6, ease.back);
      S(c.dipl, { s: L(0.5, 1, dp), r: L(-12, -4, dp), o: Math.min(1, dp * 2) });
    },
  });

  // ===================================================================
  // CENA 3 + 4a — modelo atual → modelo Delegate
  // ===================================================================
  const BOX_X = [150, 590, 1030, 1470], BOX_Y = 330, BOX_W = 300, BOX_H = 150;
  const OLD = ["Necessidade", "Cidadão descobre o serviço", "Cidadão aprende a burocracia", "Câmara trata o processo"];
  const NEW = ["Necessidade", "Henriques entende o contexto", "Henriques orquestra a Câmara", "Cidadão recebe o resultado"];

  scene({
    id: "s03", start: CUT.s03, end: W("04", "delegate") + 0.5, fi: 0.8, fo: 0, z: 3,
    build(el) {
      el.style.background = "#F2EEE6";
      el.innerHTML = `
        <div class="ttl abs label-sm" style="left:150px;top:250px;color:#5C6578">Modelo atual</div>
        <div class="ttl2 abs label-sm" style="left:150px;top:250px;color:#1FA7B5">Modelo Delegate</div>
        ${BOX_X.map((x, i) => `
          <div class="bx" style="position:absolute;left:${x}px;top:${BOX_Y}px;width:${BOX_W}px;height:${BOX_H}px;border-radius:20px;background:#fff;border:3px solid #0F1B33;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 24px;font-size:29px;font-weight:650;line-height:1.2"><span>${OLD[i]}</span></div>`).join("")}
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          ${[0, 1, 2].map((i) => `<path class="ar" pathLength="1" d="M${BOX_X[i] + BOX_W + 16} 405 H${BOX_X[i + 1] - 22}" stroke="#0F1B33" stroke-width="5" fill="none" stroke-linecap="round"/><path class="ah" d="M${BOX_X[i + 1] - 34} 393 L${BOX_X[i + 1] - 18} 405 L${BOX_X[i + 1] - 34} 417" stroke="#0F1B33" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("")}
          <g class="brk"><path d="M600 300 V284 H1320 V300" stroke="#D9623B" stroke-width="5" fill="none"/></g>
          <g class="ines3">${ines()}</g>
          <g class="blk"><rect x="-150" y="-60" width="300" height="120" rx="10" fill="#8E96A6"/><rect x="-150" y="-60" width="300" height="120" rx="10" fill="none" stroke="#6E7686" stroke-width="4"/><path d="M-120 -20 h70 M-30 10 h90 M-110 30 h40" stroke="#7A8292" stroke-width="5" stroke-linecap="round"/><text y="12" text-anchor="middle" font-size="30" font-weight="700" fill="#fff" letter-spacing="2">COMPLEXIDADE</text></g>
          <g class="ring3">${henriques(46)}</g>
        </svg>
        <div class="brklbl abs label-sm" style="left:860px;top:240px;width:200px;text-align:center;color:#D9623B">peso no cidadão</div>
        <div class="leg1 abs" style="left:1500px;top:510px;display:flex;align-items:center;gap:12px;font-size:24px;font-weight:600;color:#3A4560"><span style="width:40px;height:40px">${ICON.shield("#0F1B33")}</span>interesse público</div>
        <div class="leg2 abs" style="left:1520px;top:575px;padding:6px 18px;border:4px solid #B94E2C;color:#B94E2C;border-radius:10px;font-size:26px;font-weight:800;letter-spacing:.16em">PROVA</div>
        <div class="tx1 abs serif" style="left:0;width:1920px;top:880px;text-align:center;font-size:58px;font-weight:600">A burocracia é necessária.</div>
        <div class="tx2 abs serif" style="left:0;width:1920px;top:880px;text-align:center;font-size:58px;font-weight:600">O erro é pô-la nas <span style="color:#D9623B">mãos do cidadão</span>.</div>
        <div class="tx3 abs serif" style="left:0;width:1920px;top:880px;text-align:center;font-size:58px;font-weight:600">E se fosse <span style="color:#1FA7B5;font-style:italic">ao contrário</span>?</div>`;
      cue("carimbo", W("03", "prova") - 0.05, 0.7);
      cue("baque", W("03", "carrega") + 0.15, 1.0);
      shake(W("03", "carrega") + 0.2, 16, 0.7);
      cue("subida", W("04", "se") - 0.1, 0.6);
      cue("riser", W("04", "delegate") - 1.9, 0.8);
      return {
        bx: qa(el, ".bx"), ar: qa(el, ".ar"), ah: qa(el, ".ah"), brk: q(el, ".brk"), brklbl: q(el, ".brklbl"), ines: q(el, ".ines3"), blk: q(el, ".blk"),
        leg1: q(el, ".leg1"), leg2: q(el, ".leg2"), tx1: q(el, ".tx1"), tx2: q(el, ".tx2"), tx3: q(el, ".tx3"), ttl: q(el, ".ttl"), ttl2: q(el, ".ttl2"), ring: q(el, ".ring3"),
      };
    },
    update(t, c) {
      const t0 = CUT.s03 + 0.2, tFlip = W("04", "se") - 0.05;
      // flip para o modelo Delegate
      const f1 = P(t, tFlip, 0.3, ease.in), f2 = P(t, tFlip + 0.3, 0.35, ease.out);
      const flipped = t >= tFlip + 0.3;
      c.bx.forEach((b, i) => {
        const p = P(t, t0 + i * 0.35, 0.5, ease.back);
        const sy = flipped ? f2 : 1 - f1;
        S(b, { y: L(30, 0, p), s: 1, sy: (i === 0 ? 1 : sy) * L(0.7, 1, p), o: Math.min(1, p * 2) });
        const lbl = flipped ? NEW[i] : OLD[i];
        const sp = b.firstElementChild; if (sp.textContent !== lbl) sp.textContent = lbl;
        const heavy = P(t, W("03", "problema"), 0.5, ease.lin) * (i === 1 || i === 2 ? 1 : 0);
        if (flipped && (i === 1 || i === 2)) { b.style.background = "#0F1B33"; b.style.color = "#3FD0C9"; b.style.borderColor = "#3FD0C9"; }
        else if (flipped && i === 3) { b.style.background = "#fff"; b.style.borderColor = "#5BBF7A"; b.style.color = "#0F1B33"; }
        else { b.style.background = heavy ? `rgba(217,98,59,${0.14 * heavy})` : "#fff"; b.style.borderColor = heavy > 0.5 ? "#D9623B" : "#0F1B33"; b.style.color = "#0F1B33"; }
      });
      c.ar.forEach((a, i) => { D(a, P(t, t0 + 0.3 + i * 0.35, 0.4, ease.io)); a.style.stroke = flipped ? "#1FA7B5" : "#0F1B33"; });
      c.ah.forEach((a, i) => { O(a, P(t, t0 + 0.6 + i * 0.35, 0.2, ease.lin)); a.style.stroke = flipped ? "#1FA7B5" : "#0F1B33"; });
      O(c.ttl, P(t, t0, 0.5, ease.lin) * (1 - f1)); O(c.ttl2, f2);
      // legitimidade
      S(c.leg1, { x: L(-20, 0, P(t, W("03", "protege"), 0.5)), o: P(t, W("03", "protege"), 0.4, ease.lin) * (1 - f1) });
      const st = P(t, W("03", "prova") - 0.05, 0.4, ease.back);
      S(c.leg2, { s: L(2.2, 1, st), r: -8, o: Math.min(1, st * 3) * (1 - f1) });
      // peso no cidadão
      const pb = P(t, W("03", "problema"), 0.5, ease.out);
      S(c.brk, { o: pb * (1 - f1) }); S(c.brklbl, { o: pb * (1 - f1) });
      // Inês e o bloco
      const ip = P(t, W("03", "problema") + 0.2, 0.6, ease.out);
      const tCarr = W("03", "carrega");
      const fall = P(t, tCarr - 0.25, 0.45, ease.in);
      const hit = t > tCarr + 0.2 ? Math.max(0, 1 - (t - tCarr - 0.2) / 0.35) : 0;
      const squash = t > tCarr + 0.2 && !flipped ? 0.9 + 0.1 * (1 - Math.min(1, (t - tCarr - 0.2) * 3)) * 0 : 1;
      const lift = P(t, tFlip - 0.2, 0.6, ease.io);
      const inesH = 0.44 * 500;
      const sq = L(1, 0.88, P(t, tCarr + 0.18, 0.12, ease.out)) * (1 - lift) + lift;
      c.ines.style.transformOrigin = "50% 100%";
      S(c.ines, { x: 960 - 100, y: 870 - 500 + L(30, 0, ip), s: 0.44, sy: 0.44 * sq, o: ip });
      const by = L(-200, 870 - inesH * sq - 60, fall);
      S(c.blk, { x: 960, y: by - lift * 420 + (hit ? Math.sin(t * 50) * 3 * hit : 0), s: 1 - lift * 0.8, o: fall > 0 ? 1 - lift : 0 });
      // anel do Henriques substitui o bloco
      const rp = P(t, tFlip + 0.2, 0.6, ease.back);
      S(c.ring, { x: 960, y: L(560, 640, rp), s: rp, o: rp > 0 ? 1 : 0 });
      // textos
      O(c.tx1, P(t, CUT.s03 + 0.6, 0.6, ease.lin) * (1 - P(t, W("03", "hoje") - 0.4, 0.3, ease.lin)));
      O(c.tx2, P(t, W("03", "hoje") - 0.1, 0.5, ease.lin) * (1 - P(t, W("04", "e") - 0.3, 0.3, ease.lin)));
      O(c.tx3, P(t, W("04", "e"), 0.4, ease.lin));
    },
  });

  // ===================================================================
  // CENA 4 — Delegate + Henriques
  // ===================================================================
  scene({
    id: "s04", start: W("04", "delegate") - 0.3, end: CUT.s05 + 0.6, fi: 0, fo: 0, z: 4,
    build(el) {
      el.style.background = "transparent";
      el.innerHTML = `
        <div class="wipe abs" style="width:1920px;height:1080px;background:#0F1B33"></div>
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <g class="cst" opacity="0">${castle("#3FD0C9").replace('<g fill="#3FD0C9">', '<g fill="#3FD0C9" transform="translate(960 900) scale(2.4) translate(-1510 -520)">')}</g>
          <g class="logo">
            <text class="lg serif" x="960" y="560" text-anchor="middle" font-size="210" font-weight="600" fill="none" stroke="#3FD0C9" stroke-width="2.5" pathLength="1" letter-spacing="-4">Delegate</text>
            <circle class="dot" cx="1342" cy="545" r="15" fill="#3FD0C9"/>
          </g>
          <g class="ring4">${henriques(130)}</g>
          <line class="surf" x1="0" y1="560" x2="1920" y2="560" stroke="#3FD0C9" stroke-width="3" pathLength="1"/>
        </svg>
        <div class="sub abs" style="left:0;width:1920px;top:650px;text-align:center;font-size:38px;color:#B8C4DA">Um representante digital pessoal para cada munícipe</div>
        <div class="afn abs serif" style="left:0;width:1920px;top:740px;text-align:center;font-size:76px;font-weight:600;color:#fff">Henriques</div>
        <div class="afn2 abs" style="left:0;width:1920px;top:840px;text-align:center;font-size:30px;color:#8FA3C4">o representante digital dos munícipes de Guimarães</div>
        <div class="top abs" style="left:0;top:0;width:1920px;height:560px;background:#F2EEE6;transform-origin:50% 100%"></div>`;
      const t0r = W("04", "delegate") - 0.3, tAfr = W("04", "em", 1) - 0.1;
      cue("revelacao", t0r + 1.0, 1.0);
      burst({ seed: 41, t0: t0r + 1.25, x: 960, y: 500, n: 140, speed: 900, life: 1.8, colors: ["#3FD0C9", "#7AF0E8", "#FFFFFF", "#E8B44A"], size: [2, 6] });
      rings({ t0: t0r + 1.2, x: 960, y: 500, n: 2, r1: 900, life: 1.4 });
      shake(t0r + 1.25, 6, 0.5);
      cue("shimmer", tAfr + 0.7, 0.8);
      rings({ t0: tAfr + 0.9, x: 960, y: 560, n: 3, r1: 520, life: 1.3 });
      burst({ seed: 42, t0: tAfr + 0.95, x: 960, y: 560, n: 60, speed: 500, life: 1.4, colors: ["#3FD0C9", "#7AF0E8"], size: [2, 4] });
      return { wipe: q(el, ".wipe"), lg: q(el, ".lg"), dot: q(el, ".dot"), logo: q(el, ".logo"), ring: q(el, ".ring4"), sub: q(el, ".sub"), afn: q(el, ".afn"), afn2: q(el, ".afn2"), cst: q(el, ".cst"), surf: q(el, ".surf"), top: q(el, ".top") };
    },
    update(t, c, el) {
      const t0 = W("04", "delegate") - 0.3;
      const wp = P(t, t0, 0.7, ease.io);
      el.style.clipPath = wp < 1 ? `circle(${L(0, 1150, wp)}px at 960px 640px)` : "none";
      // logótipo desenhado
      const dr = P(t, t0 + 0.3, 1.2, ease.io);
      c.lg.style.strokeDasharray = "1 1"; c.lg.style.strokeDashoffset = String(1 - dr);
      c.lg.style.fill = `rgba(255,255,255,${P(t, t0 + 1.2, 0.6, ease.lin)})`;
      const dp = P(t, t0 + 1.5, 0.5, ease.back); S(c.dot, { s: dp, o: dp > 0 ? 1 : 0 });
      // sobe e encolhe quando aparece o Henriques
      const tAf = W("04", "em", 1) - 0.1;
      const up = P(t, tAf, 0.9, ease.io);
      S(c.logo, { y: L(0, -380, up), s: L(1, 0.42, up), o: 1 - P(t, CUT.s05 - 1.5, 0.5, ease.lin) });
      c.logo.style.transformOrigin = "960px 560px"; c.logo.style.transformBox = "view-box";
      S(c.sub, { y: L(20, 0, P(t, W("04", "cada"), 0.6)), o: P(t, W("04", "cada"), 0.5, ease.lin) * (1 - up) });
      const rg = P(t, tAf + 0.4, 0.9, ease.back);
      const breathe = 1 + 0.03 * Math.sin(t * 3);
      S(c.ring, { x: 960, y: 560, s: rg * breathe, o: rg > 0 ? 1 : 0 });
      S(c.afn, { y: L(20, 0, P(t, W("04", "henriques"), 0.5)), o: P(t, W("04", "henriques") - 0.1, 0.4, ease.lin) });
      S(c.afn2, { o: P(t, W("04", "henriques") + 0.6, 0.6, ease.lin) * (1 - P(t, CUT.s05 - 1.3, 0.4, ease.lin)) });
      // castelo (D. Afonso Henriques)
      O(c.cst, 0.13 * P(t, W("04", "um", 2), 1.0, ease.lin));
      // linha de superfície e mundo de cima
      D(c.surf, P(t, CUT.s05 - 1.4, 0.8, ease.io));
      const tp = P(t, CUT.s05 - 0.6, 0.9, ease.io);
      c.top.style.transform = `scaleY(${tp})`;
      O(c.afn, Math.min(+c.afn.style.opacity, 1 - P(t, CUT.s05 - 1.2, 0.4, ease.lin)));
    },
  });
})();
