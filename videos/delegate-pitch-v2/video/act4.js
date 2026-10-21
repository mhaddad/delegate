/* ATO IV e V — cenas 11 a 14 */
(function () {
  const { CUT, cue, shake, burst, rings, motes, P, L, W, S, O, D, ease, clamp, rng, H, q, qa, ines, henriques, ICON, scene, win } = F;

  // ===================================================================
  // CENA 11 — magia × rigor
  // ===================================================================
  const R = rng(11);
  const NET = [];
  const kinds = ["#E8B44A", "#3FD0C9", "#3FD0C9", "#3FD0C9", "#F2EEE6", "#5BBF7A"];
  for (let i = 0; i < 34; i++) NET.push({ x: 120 + R() * 940, y: 600 + R() * 330, c: kinds[Math.floor(R() * kinds.length)], r: 6 + R() * 7 });
  const EDGES = [];
  NET.forEach((a, i) => {
    const near = NET.map((b, j) => [Math.hypot(a.x - b.x, a.y - b.y), j]).filter(([d, j]) => j !== i).sort((x, y) => x[0] - y[0]).slice(0, 2);
    near.forEach(([, j]) => { if (!EDGES.some(([p, q2]) => (p === j && q2 === i))) EDGES.push([i, j]); });
  });
  const COUNTERS = [["verificações", 37], ["fontes oficiais", 3], ["autorizações", 5], ["validação humana", 1], ["registos de auditoria", 52]];
  const MINI = [
    ["me", "Posso construir 150 m² no terreno do meu avô?"],
    ["af", "Vou verificar e volto a falar consigo."],
    ["af", "Análise favorável. Confirma o pedido formal?"],
    ["af", "Pode avançar. Aqui tem fonte e recibo."],
  ];

  scene({
    id: "s11", start: CUT.s11, end: CUT.s12 + 0.6, fi: 0.6, fo: 0, z: 6,
    build(el) {
      el.style.background = "#F2EEE6";
      el.innerHTML = `
        <div class="abs" style="top:540px;width:1920px;height:540px;background:#0F1B33"></div>
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <g class="edges">${EDGES.map(([a, b]) => `<line x1="${NET[a].x}" y1="${NET[a].y}" x2="${NET[b].x}" y2="${NET[b].y}" stroke="#3FD0C9" stroke-width="1.6" opacity=".35"/>`).join("")}</g>
          <g class="pulses">${EDGES.map(() => `<circle r="4.5" fill="#7AF0E8"/>`).join("")}</g>
          <g class="nodes">${NET.map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${n.c}"/>`).join("")}</g>
          <line x1="0" y1="540" x2="1920" y2="540" stroke="#3FD0C9" stroke-width="3"/>
          <g class="spk"><circle r="60" fill="url(#gGlow)"/><circle r="9" fill="#fff"/></g>
        </svg>
        <div class="abs" style="left:200px;top:70px;width:620px;display:flex;flex-direction:column;gap:16px">
          ${MINI.map(([k, txt]) => `<div class="mb bubble ${k}" style="font-size:26px;max-width:90%;${k === "me" ? "align-self:flex-end" : ""}">${txt}</div>`).join("")}
        </div>
        <div class="cnt4 abs" style="left:1100px;top:60px;display:flex;align-items:baseline;gap:44px">
          <div class="serif" style="font-size:210px;font-weight:700;color:#D9623B;line-height:1">4</div>
          <div style="font-size:34px;font-weight:600;color:#5C6578">mensagens<br>para a Inês</div>
        </div>
        <div class="tTop abs serif" style="left:1100px;top:380px;font-size:58px;font-weight:600;color:#0F1B33">Simplicidade <span style="color:#D9623B">para o cidadão.</span></div>
        <div class="abs" style="left:1180px;top:590px;width:640px">
          ${COUNTERS.map(([k], i) => `<div class="cr" style="display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;border-bottom:1px solid #22355F"><span style="font-size:24px;color:#B8C4DA">${k}</span><span class="cv mono" style="font-size:32px;font-weight:700;color:${i === 3 ? "#5BBF7A" : "#3FD0C9"}">0</span></div>`).join("")}
        </div>
        <div class="tBot abs serif" style="left:1100px;top:960px;font-size:58px;font-weight:600;color:#fff">Rigor <span style="color:#3FD0C9">para a Administração.</span></div>`;
      const t11 = W("11", "para");
      [0, 1, 2, 3].forEach((i) => cue("pin", t11 - 0.2 + i * 0.32, 0.5));
      cue("shimmer", W("11", "quatro") - 0.1, 0.5);
      const tR = W("11", "para", 2) - 0.3;
      [0, 1, 2, 3, 4].forEach((i) => cue("blip", tR + 0.2 + i * 0.25, 0.4));
      const ts = W("11", "parece") - 0.2;
      cue("faisca", ts, 1.0);
      for (let i = 0; i < 12; i++) {
        const k = i / 11, tt = ts + k * 1.4, x = -80 + 2080 * ease.io(k);
        burst({ seed: 110 + i, t0: tt, x, y: 540, n: 18, speed: 240, life: 1.2, colors: ["#FFFFFF", "#7AF0E8", "#E8B44A"], size: [1.5, 4] });
      }
      return { edges: q(el, ".edges"), mb: qa(el, ".mb"), cnt4: q(el, ".cnt4"), tTop: q(el, ".tTop"), tBot: q(el, ".tBot"), cr: qa(el, ".cr"), cv: qa(el, ".cv"), pl: qa(el, ".pulses circle"), nodes: qa(el, ".nodes circle"), spk: q(el, ".spk") };
    },
    update(t, c) {
      const t11 = W("11", "para");
      c.mb.forEach((m, i) => { const p = P(t, t11 - 0.2 + i * 0.32, 0.45, ease.back); m.style.transformOrigin = i === 0 ? "100% 100%" : "0% 100%"; S(m, { s: L(0.7, 1, p), o: Math.min(1, p * 2) }); });
      const c4 = P(t, W("11", "quatro") - 0.1, 0.5, ease.back); S(c.cnt4, { s: L(0.6, 1, c4), o: Math.min(1, c4 * 2) });
      // rede em time-lapse
      const tR = W("11", "para", 2) - 0.3;
      O(c.edges, P(t, tR - 0.2, 0.8, ease.lin));
      c.nodes.forEach((n, i) => { const p = P(t, tR - 0.6 + i * 0.03, 0.4, ease.back); n.style.transform = `scale(${p * (1 + 0.15 * Math.sin(t * 5 + i))})`; });
      c.pl.forEach((p, i) => {
        const [a, b] = EDGES[i]; const ph = ((t * 1.6 + i * 0.37) % 1);
        const on = t > tR; p.setAttribute("cx", L(NET[a].x, NET[b].x, ph)); p.setAttribute("cy", L(NET[a].y, NET[b].y, ph)); p.style.opacity = on ? 0.9 : 0;
      });
      c.cr.forEach((r, i) => { const p = P(t, tR + i * 0.25, 0.4); S(r, { x: L(30, 0, p), o: p }); });
      c.cv.forEach((v, i) => { const p = P(t, tR + 0.2 + i * 0.25, 1.4, ease.out); const n = String(Math.round(COUNTERS[i][1] * p)); if (v.textContent !== n) v.textContent = n; });
      // faísca na linha
      const sp = P(t, W("11", "parece") - 0.2, 1.4, ease.io);
      S(c.spk, { x: L(-80, 2000, sp), y: 540, o: sp > 0 && sp < 1 ? 1 : 0 });
      S(c.tTop, { y: L(20, 0, P(t, W("11", "simplicidade") - 0.1, 0.5)), o: P(t, W("11", "simplicidade") - 0.1, 0.4, ease.lin) });
      S(c.tBot, { y: L(20, 0, P(t, W("11", "controlo") - 0.1, 0.5)), o: P(t, W("11", "controlo") - 0.1, 0.4, ease.lin) });
    },
  });

  // ===================================================================
  // CENA 12 — o que a Câmara ganha
  // ===================================================================
  const CARD_X = [190, 760, 1330];
  scene({
    id: "s12", start: CUT.s12, end: CUT.s13 + 0.6, fi: 0.5, fo: 0, z: 7,
    build(el) {
      el.style.background = "#0F1B33";
      el.innerHTML = `
        <div class="ttl abs serif" style="left:0;width:1920px;top:70px;text-align:center;font-size:66px;font-weight:600;color:#fff">O que a <span style="color:#3FD0C9">Câmara</span> ganha</div>
        <div class="cd card" style="left:${CARD_X[0]}px;top:210px;width:400px;height:400px;background:#16264A;padding:34px;color:#fff">
          <svg width="332" height="190" viewBox="0 0 332 190">
            <rect x="40" y="0" width="252" height="190" rx="14" fill="#F2EEE6"/>
            ${[0, 1, 2, 3].map((i) => `<rect x="64" y="${22 + i * 40}" width="150" height="22" rx="6" fill="#DCD4C4"/><g class="fc" transform="translate(250 ${33 + i * 40})"><g><circle r="14" fill="#5BBF7A"/><path d="M-6 0 l4 4 8-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`).join("")}
          </svg>
          <div style="font-size:31px;font-weight:700;margin-top:30px;line-height:1.15">Pedidos completos à primeira</div>
        </div>
        <div class="cd card" style="left:${CARD_X[1]}px;top:210px;width:400px;height:400px;background:#16264A;padding:34px;color:#fff">
          <svg width="332" height="190" viewBox="0 0 332 190">
            <rect x="20" y="10" width="100" height="170" rx="18" fill="#F2EEE6"/><rect x="32" y="26" width="76" height="130" rx="6" fill="#3FD0C9" opacity=".3"/>
            ${[0, 1, 2, 3, 4].map((i) => `<rect class="qb" x="150" y="${16 + i * 34}" width="160" height="24" rx="8" fill="#E5484D" opacity=".8"/>`).join("")}
          </svg>
          <div style="font-size:31px;font-weight:700;margin-top:30px;line-height:1.15">Menos contactos repetidos</div>
        </div>
        <div class="cd card" style="left:${CARD_X[2]}px;top:210px;width:400px;height:400px;background:#16264A;padding:34px;color:#fff">
          <svg width="332" height="190" viewBox="0 0 332 190">
            ${[0, 1, 2, 3, 4, 5].map((i) => `<rect class="pp" x="${30 + (i % 2) * 8}" y="${150 - i * 22}" width="90" height="18" rx="3" fill="#B8C4DA"/>`).join("")}
            <g transform="translate(220 0)"><path d="M0 20 V170 M-50 170 H50" stroke="#E8B44A" stroke-width="7" stroke-linecap="round"/><g class="beam2"><path d="M-70 50 H70" stroke="#E8B44A" stroke-width="7" stroke-linecap="round"/><path d="M-70 50 L-90 110 H-50 Z M70 50 L50 110 H90 Z" fill="none" stroke="#E8B44A" stroke-width="4" stroke-linejoin="round"/></g><circle cy="20" r="10" fill="#E8B44A"/></g>
          </svg>
          <div style="font-size:31px;font-weight:700;margin-top:30px;line-height:1.15">Técnicos focados em <span style="color:#E8B44A">decidir</span></div>
        </div>
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          ${[560, 960, 1360].map((x, i) => `<path class="wr" pathLength="1" d="M960 740 C960 790 ${x} 780 ${x} 830" stroke="#3FD0C9" stroke-width="3" fill="none"/>`).join("")}
          <g class="hub">${henriques(42)}</g>
        </svg>
        ${["Balcão Único", "Serviços Online", "Urbanismo Digital"].map((n, i) => `<div class="sy abs" style="left:${[560, 960, 1360][i] - 150}px;top:830px;width:300px;padding:14px 0;text-align:center;border-radius:14px;border:2px solid #3A4E7A;background:#16264A;color:#fff;font-size:25px;font-weight:650">${n}</div>`).join("")}
        <div class="cap abs" style="left:0;width:1920px;top:935px;text-align:center;font-size:34px;color:#B8C4DA">Liga-se ao que <b style="color:#fff">já existe</b>. Não substitui nenhum sistema.</div>`;
      [W("12", "pedidos"), W("12", "menos"), W("12", "tecnicos")].forEach((ta) => cue("pin", ta - 0.15, 0.6));
      cue("shimmer", W("12", "decidir") + 0.5, 0.5);
      return { ttl: q(el, ".ttl"), cd: qa(el, ".cd"), fc: qa(el, ".fc > g"), qb: qa(el, ".qb"), pp: qa(el, ".pp"), beam2: q(el, ".beam2"), wr: qa(el, ".wr"), hub: q(el, ".hub"), sy: qa(el, ".sy"), cap: q(el, ".cap") };
    },
    update(t, c) {
      S(c.ttl, { y: L(20, 0, P(t, CUT.s12 + 0.2, 0.6)), o: P(t, CUT.s12 + 0.2, 0.5, ease.lin) });
      const ct = [W("12", "pedidos"), W("12", "menos"), W("12", "tecnicos")];
      c.cd.forEach((d, i) => { const p = P(t, ct[i] - 0.2, 0.6, ease.back); S(d, { y: L(60, 0, p), o: Math.min(1, p * 2) }); });
      c.fc.forEach((f, i) => { const p = P(t, ct[0] + 0.3 + i * 0.22, 0.35, ease.back); S(f, { s: p, o: p > 0 ? 1 : 0 }); });
      c.qb.forEach((b, i) => { const p = P(t, ct[1] + 0.4 + (4 - i) * 0.2, 0.35, ease.in); S(b, { sx: i === 0 ? 1 : 1 - p, o: i === 0 ? 1 : 1 - p }); b.style.transformOrigin = "0% 50%"; });
      c.pp.forEach((b, i) => { const p = P(t, ct[2] + 0.3 + (5 - i) * 0.12, 0.3, ease.in); S(b, { y: -30 * p, o: 1 - p }); });
      c.beam2.style.transform = `rotate(${Math.sin(t * 2.2) * 6 * (1 - P(t, ct[2] + 1.4, 1, ease.out))}deg)`;
      const tS = W("12", "decidir") + 0.7;
      const hp = P(t, tS - 0.3, 0.5, ease.back);
      S(c.hub, { x: 960, y: 700, s: hp, o: hp > 0 ? 1 : 0 });
      c.wr.forEach((w, i) => D(w, P(t, tS + 0.1 + i * 0.12, 0.6, ease.io)));
      c.sy.forEach((s, i) => { const p = P(t, tS + 0.4 + i * 0.12, 0.45, ease.back); S(s, { y: L(20, 0, p), o: Math.min(1, p * 2) }); });
      O(c.cap, P(t, tS + 0.9, 0.5, ease.lin));
    },
  });

  // ===================================================================
  // CENA 13 — de Guimarães para o país
  // ===================================================================
  // contorno aproximado de Portugal continental (lat, lon)
  const PT = [[42.15, -8.2], [42.08, -8.48], [42.03, -8.65], [41.87, -8.87], [41.69, -8.84], [41.38, -8.76], [41.15, -8.67], [40.98, -8.65], [40.64, -8.75], [40.15, -8.87], [39.6, -9.07], [39.36, -9.4], [38.78, -9.5], [38.69, -9.42], [38.68, -9.2], [38.48, -8.9], [38.41, -9.21], [37.95, -8.87], [37.5, -8.8], [37.02, -8.99], [37.1, -8.67], [37.0, -7.93], [37.19, -7.42], [37.6, -7.5], [38.2, -7.1], [38.88, -7.05], [39.4, -7.38], [39.66, -7.53], [39.8, -6.98], [40.17, -7.0], [40.73, -6.9], [41.0, -6.8], [41.5, -6.27], [41.67, -6.45], [41.95, -6.55], [41.97, -6.8], [41.95, -7.2], [41.9, -7.45], [41.82, -7.9], [41.87, -8.0], [41.95, -8.15]];
  const K = 152, PX = (lon) => 360 + (lon + 9.6) * K, PY = (lat) => 70 + (42.25 - lat) * K * 1.3;
  const ptPoly = PT.map(([la, lo]) => [PX(lo), PY(la)]);
  const GMR = [PX(-8.3), PY(41.44)];
  const CITIES = [[41.15, -8.61], [41.55, -8.42], [41.69, -8.83], [41.3, -7.74], [41.81, -6.76], [40.64, -7.91], [40.2, -8.41], [39.23, -8.68], [38.72, -9.14], [38.57, -7.91], [37.02, -7.93]].map(([la, lo]) => [PX(lo), PY(la)]);
  const inPoly = (x, y, poly) => { let ins = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins; } return ins; };
  const R2 = rng(13); const VAULTS = [];
  while (VAULTS.length < 90) { const x = 360 + R2() * 600, y = 60 + R2() * 980; if (inPoly(x, y, ptPoly)) VAULTS.push([x, y]); }
  const nearestCity = ([x, y]) => CITIES.reduce((b, c) => (Math.hypot(c[0] - x, c[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? c : b));
  // concelho de Guimarães em hexágonos (48 freguesias)
  const BLOB = [[0, -1], [0.55, -0.85], [0.95, -0.35], [0.85, 0.35], [0.45, 0.9], [-0.15, 1], [-0.7, 0.75], [-1, 0.15], [-0.8, -0.5], [-0.4, -0.9]];
  function hexes(r) {
    const out = [], w = Math.sqrt(3) * r, h = 1.5 * r, S0 = 300;
    const poly = BLOB.map(([x, y]) => [x * S0, y * S0 * 0.95]);
    for (let row = -12; row <= 12; row++) for (let col = -12; col <= 12; col++) { const x = col * w + (row % 2 ? w / 2 : 0), y = row * h; if (inPoly(x, y, poly)) out.push([x, y]); }
    return out;
  }
  let HR = 30; for (let r = 60; r > 20; r -= 0.5) { if (hexes(r).length >= 48) { HR = r; break; } }
  const HEX = hexes(HR).slice(0, 48).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const hexPath = (r) => [...Array(6).keys()].map((k) => { const a = ((60 * k - 90) * Math.PI) / 180; return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`; }).join(" ");

  scene({
    id: "s13", start: CUT.s13, end: CUT.s14 + 0.9, fi: 0.5, fo: 0, z: 8,
    build(el) {
      el.style.background = "#0F1B33";
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <g class="ptm">
            <polygon points="${ptPoly.map((p) => p.join(",")).join(" ")}" fill="#16264A" stroke="#3FD0C9" stroke-width="2.5" stroke-linejoin="round"/>
            <circle class="reg" cx="${GMR[0]}" cy="${GMR[1]}" r="120" fill="#3FD0C9" opacity=".18"/>
            <g class="vl">${VAULTS.map((v) => { const c = nearestCity(v); return `<line x1="${v[0]}" y1="${v[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#3FD0C9" stroke-width="1" opacity=".35"/>`; }).join("")}</g>
            <g class="vd">${VAULTS.map((v) => `<rect x="${v[0] - 4}" y="${v[1] - 4}" width="8" height="8" rx="2" fill="#E8B44A"/>`).join("")}</g>
            <g class="ct">${CITIES.map((c) => `<circle cx="${c[0]}" cy="${c[1]}" r="9" fill="#0F1B33" stroke="#3FD0C9" stroke-width="3"/>`).join("")}</g>
            <circle cx="${GMR[0]}" cy="${GMR[1]}" r="10" fill="#D9623B" stroke="#fff" stroke-width="3"/>
            <text x="${GMR[0] + 18}" y="${GMR[1] + 6}" font-size="20" font-weight="700" fill="#fff">Guimarães</text>
          </g>
          <g class="hx" transform="translate(640 540)"><g class="hxi">${HEX.map(([x, y]) => `<polygon class="hc" points="${hexPath(HR - 2)}" transform="translate(${x} ${y})" fill="#16264A" stroke="#3FD0C9" stroke-width="2"/>`).join("")}</g></g>
        </svg>
        <div class="abs" style="left:1150px;top:150px;width:680px">
          <div class="ph ph0"><div class="label-sm" style="color:#3FD0C9">Fase 1 · Guimarães</div><div style="font-size:34px;color:#fff;font-weight:650;margin-top:6px">Piloto com a Câmara e as 48 Freguesias</div>
            <div style="display:flex;gap:10px;margin-top:16px">${["Urbanismo", "Esplanada", "Ocorrência na via pública"].map((j) => `<div class="jr" style="padding:8px 14px;border-radius:999px;border:1.5px solid #3A4E7A;color:#B8C4DA;font-size:20px">${j}</div>`).join("")}</div></div>
          <div class="ph ph1" style="margin-top:46px"><div class="label-sm" style="color:#3FD0C9">Fase 2 · Região</div><div style="font-size:34px;color:#fff;font-weight:650;margin-top:6px">Entidades regionais, o mesmo representante</div></div>
          <div class="ph ph2" style="margin-top:46px"><div class="label-sm" style="color:#3FD0C9">Fase 3 · País</div><div style="font-size:34px;color:#fff;font-weight:650;margin-top:6px">Uma relação simples com o Estado inteiro</div></div>
          <div class="db" style="margin-top:56px;display:flex;align-items:center;gap:24px">
            <svg width="90" height="100" viewBox="0 0 90 100"><ellipse cx="45" cy="16" rx="38" ry="12" fill="none" stroke="#8FA3C4" stroke-width="4"/><path d="M7 16 V82 A38 12 0 0 0 83 82 V16 M7 49 A38 12 0 0 0 83 49" fill="none" stroke="#8FA3C4" stroke-width="4"/><path class="strike" pathLength="1" d="M0 96 L90 4" stroke="#E5484D" stroke-width="8" stroke-linecap="round"/></svg>
            <div><div style="font-size:34px;font-weight:700;color:#fff">Sem base de dados central</div><div style="font-size:23px;color:#B8C4DA;margin-top:6px;line-height:1.35">Rede federada: cada cidadão com o seu cofre,<br>cada entidade recebe só o necessário.</div></div>
          </div>
        </div>`;
      cue("shimmer", W("13", "o") + 0.2, 0.45);
      cue("subida", W("13", "depois") - 0.3, 0.7);
      cue("shimmer", W("13", "pais") - 0.2, 0.6);
      cue("negado", W("13", "central") - 0.1, 0.45);
      return { ptm: q(el, ".ptm"), reg: q(el, ".reg"), vl: q(el, ".vl"), vd: qa(el, ".vd rect"), ct: q(el, ".ct"), hx: q(el, ".hxi"), hc: qa(el, ".hc"), ph: qa(el, ".ph"), jr: qa(el, ".jr"), db: q(el, ".db"), strike: q(el, ".strike") };
    },
    update(t, c) {
      const t13 = W("13", "o");
      // hexágonos acendem
      c.hc.forEach((h, i) => { const p = P(t, t13 + 0.2 + i * 0.045, 0.3, ease.lin); h.style.fill = p > 0.5 ? "rgba(63,208,201,.55)" : "#16264A"; h.style.stroke = p > 0.5 ? "#7AF0E8" : "#3FD0C9"; });
      // zoom-out para Portugal
      const z = P(t, W("13", "depois") - 0.3, 1.2, ease.io);
      const hs = L(1, 0.06, z);
      c.hx.parentNode.setAttribute("transform", `translate(${L(640, GMR[0], z)} ${L(540, GMR[1], z)})`);
      c.hx.setAttribute("transform", `scale(${hs})`); O(c.hx, 1 - P(t, W("13", "depois") + 0.6, 0.4, ease.lin));
      const ms = L(6, 1, z), dx = L(640 - GMR[0], 0, z), dy = L(540 - GMR[1], 0, z);
      c.ptm.setAttribute("transform", `translate(${GMR[0] + dx} ${GMR[1] + dy}) scale(${ms}) translate(${-GMR[0]} ${-GMR[1]})`);
      O(c.ptm, P(t, W("13", "depois") - 0.3, 0.6, ease.lin));
      const rg = P(t, W("13", "regiao") - 0.2, 0.6, ease.out);
      c.reg.setAttribute("r", L(10, 130, rg)); O(c.reg, rg * 0.22);
      const tp = W("13", "pais");
      c.vd.forEach((v, i) => O(v, P(t, tp - 0.3 + (i % 30) * 0.02, 0.3, ease.lin)));
      O(c.vl, P(t, tp + 0.2, 0.6, ease.lin) * 0.9);
      O(c.ct, P(t, tp - 0.2, 0.5, ease.lin));
      // textos laterais
      const phT = [t13 + 0.3, W("13", "regiao") - 0.2, tp - 0.2];
      c.ph.forEach((p, i) => { const a = P(t, phT[i], 0.5); const dim = i < 2 ? L(1, 0.4, P(t, phT[i + 1], 0.4, ease.lin)) : 1; S(p, { x: L(30, 0, a), o: a * dim }); });
      c.jr.forEach((j, i) => { const p = P(t, W("13", "piloto") + i * 0.15, 0.4, ease.back); S(j, { s: L(0.7, 1, p), o: Math.min(1, p * 2) }); });
      const db = P(t, W("13", "sem") - 0.2, 0.5); S(c.db, { y: L(24, 0, db), o: db });
      D(c.strike, P(t, W("13", "central") - 0.1, 0.4, ease.out));
    },
  });

  // ===================================================================
  // CENA 14 — a casa no terreno e o cartão final
  // ===================================================================
  const castle = `<g fill="#9C7468"><rect x="1400" y="540" width="220" height="56"/><rect x="1392" y="510" width="34" height="86"/><rect x="1594" y="510" width="34" height="86"/><rect x="1484" y="458" width="54" height="138"/></g>`;
  scene({
    id: "s14", start: CUT.s14, end: 180.2, fi: 0.8, fo: 0, z: 9,
    build(el) {
      el.style.background = "#F3B27A";
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs><linearGradient id="skyS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EE9F6B"/><stop offset=".6" stop-color="#F7D2AE"/></linearGradient></defs>
          <rect width="1920" height="1080" fill="url(#skyS)"/>
          <circle class="sun" cx="1180" cy="600" r="130" fill="#F08A4B" opacity=".9"/>
          <path d="M0 640 Q300 520 620 590 T1200 560 T1920 540 V1080 H0Z" fill="#C79A86"/>
          ${castle}
          <path d="M0 720 Q380 630 820 690 T1920 660 V1080 H0Z" fill="#B7876F"/>
          <path d="M0 790 Q520 740 980 770 T1920 760 V1080 H0Z" fill="#D2A57F"/>
          <path d="M640 830 L1300 830 L1430 1010 L520 1010 Z" fill="#DBB38E" stroke="#8A6A55" stroke-width="4" stroke-dasharray="14 12"/>
          <path d="M770 856 L1170 856 L1236 966 L704 966 Z" fill="rgba(217,98,59,.22)" stroke="#D9623B" stroke-width="6" stroke-linejoin="round"/>
          <g class="house" fill="none" stroke="#B94E2C" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
            <path class="hw" pathLength="1" d="M790 930 V720 M1150 930 V720 M790 720 H1150"/>
            <path class="hf" d="M790 720 H1150 V930 H790Z" fill="#F2E3D2" stroke="none"/>
            <path class="hr" pathLength="1" d="M760 730 L970 600 L1180 730"/>
            <path class="hd" pathLength="1" d="M935 930 V820 H1005 V930 M830 770 H900 V830 H830Z M1040 770 H1110 V830 H1040Z"/>
          </g>
          <g transform="translate(330 480) scale(.98)"><g>${ines({ photo: true, smile: true })}</g></g>
          <circle class="pglow" cx="490" cy="790" r="44" fill="url(#gGold)"/>
        </svg>
        <div class="end abs" style="width:1920px;height:1080px;background:#0F1B33">
          <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
            <g class="ering">${henriques(70)}</g>
            <text class="elogo serif" x="960" y="640" text-anchor="middle" font-size="170" font-weight="600" fill="#fff" letter-spacing="-3">Delegate</text>
            <circle class="edot" cx="1305" cy="628" r="13" fill="#3FD0C9"/>
          </svg>
          <div class="etag abs serif" style="left:0;width:1920px;top:720px;text-align:center;font-size:52px;font-style:italic;color:#F2EEE6">Diga o que precisa. <span style="color:#3FD0C9">O Henriques trata do resto.</span></div>
          <div class="sweep abs" style="left:0;top:470px;width:420px;height:230px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);mix-blend-mode:overlay"></div>
          <div class="ehack abs mono" style="left:0;width:1920px;top:960px;text-align:center;font-size:24px;letter-spacing:.2em;color:#8FA3C4">HACK4GUIMARÃES · 2026</div>
        </div>`;
      const t0s = CUT.s14 + 0.2, te = W("14", "relacao") + 0.1;
      cue("shimmer", t0s + 0.4, 0.5);
      motes({ seed: 14, a: CUT.s14, b: te + 0.8, n: 50, color: "255,214,170", area: [0, 150, 1920, 850] });
      cue("final", te + 0.35, 1.0);
      rings({ t0: te + 0.7, x: 960, y: 400, n: 3, r1: 700, life: 1.6 });
      burst({ seed: 141, t0: te + 0.75, x: 960, y: 400, n: 90, speed: 600, life: 2.0, colors: ["#3FD0C9", "#7AF0E8", "#E8B44A", "#FFFFFF"], size: [2, 5] });
      motes({ seed: 15, a: te + 0.6, b: 181, n: 50, color: "122,240,232", area: [0, 200, 1920, 900] });
      return { sweep: q(el, ".sweep"), hw: q(el, ".hw"), hf: q(el, ".hf"), hr: q(el, ".hr"), hd: q(el, ".hd"), pglow: q(el, ".pglow"), sun: q(el, ".sun"), end: q(el, ".end"), ering: q(el, ".ering"), elogo: q(el, ".elogo"), edot: q(el, ".edot"), etag: q(el, ".etag"), ehack: q(el, ".ehack") };
    },
    update(t, c) {
      const t0 = CUT.s14 + 0.2;
      D(c.hw, P(t, t0 + 0.4, 1.4, ease.io));
      D(c.hr, P(t, t0 + 1.6, 0.9, ease.io));
      D(c.hd, P(t, t0 + 2.3, 0.9, ease.io));
      O(c.hf, P(t, t0 + 2.6, 0.8, ease.lin));
      const g = P(t, W("14", "portugal") - 0.2, 0.8, ease.lin); S(c.pglow, { s: L(0.5, 1.6, g) * (1 + 0.08 * Math.sin(t * 4)), o: g });
      c.sun.setAttribute("cy", L(600, 640, P(t, t0, 5, ease.lin)));
      // cartão final
      const te = W("14", "relacao") + 0.1;
      O(c.end, P(t, te, 0.8, ease.io));
      const r = P(t, te + 0.4, 0.7, ease.back); S(c.ering, { x: 960, y: 400, s: r * (1 + 0.03 * Math.sin(t * 3)), o: r > 0 ? 1 : 0 });
      S(c.elogo, { y: L(20, 0, P(t, te + 0.5, 0.7)), o: P(t, te + 0.5, 0.6, ease.lin) });
      const d = P(t, te + 1.0, 0.4, ease.back); S(c.edot, { s: d, o: d > 0 ? 1 : 0 });
      S(c.etag, { y: L(16, 0, P(t, te + 1.3, 0.7)), o: P(t, te + 1.3, 0.6, ease.lin) });
      O(c.ehack, P(t, te + 2.0, 0.6, ease.lin));
      O(c.sweep, 0);
    },
  });
})();
