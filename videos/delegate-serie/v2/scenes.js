/* VÍDEO 2 — A solução, vista pela Inês */
(function () {
  const { CUT, cue, shake, burst, rings, motes, P, L, W, B, S, O, D, ease, clamp, rng, H, q, qa, ines, henriques, henriquesRingSVG, ICON, scene, win, onFrame, stage, TL } = F;
  const TOTAL = TL.total;
  CUT.chat = W("1", "abre") - 0.3;
  CUT.fim = B("8").start - 0.9;
  window.VIG = [[0, 0.3], [TOTAL, 0.3]];
  window.BADGE = [CUT.chat + 1, CUT.fim];

  // ---------------------------------------------------------------- tempos da conversa
  const T = {};
  T.m0 = B("2").start - 0.7;
  T.cmd1 = W("2", "chave") - 0.2; T.ok1 = W("2", "digital") + 0.5; T.m1 = W("2", "partir") + 0.5;
  T.rec = W("3", "manda") - 1.4; T.m2 = W("3", "manda") + 0.3;
  T.m3 = W("3", "henriques") - 0.1; T.m4 = W("3", "essencial") + 0.5; T.m5 = B("3").end + 0.4;
  T.loc = B("3").end + 2.2; T.doc = B("4").start - 0.9; T.foto = W("4", "fotografa") + 0.6;
  T.m7 = W("4", "autorizacao") - 0.6; T.sim = W("4", "guardado") - 0.3;
  T.m8 = W("5", "resposta") - 0.1; T.m9 = W("5", "henriques") - 0.2; T.m10 = W("5", "pergunta") - 0.1; T.m11 = W("5", "explica-lhe") - 0.2;
  T.tap1 = B("5").end + 0.9; T.cmd2 = T.tap1 + 0.25; T.ok2 = T.cmd2 + 1.4; T.sub1 = T.ok2 + 0.9;
  T.dias = B("6").start - 0.7; T.m13 = W("6", "esplanada") - 0.3; T.m14 = W("6", "henriques") + 0.1; T.m15 = W("6", "mesas") + 0.2; T.m16 = W("6", "passeio") + 0.1;
  T.m17 = W("6", "propoe") - 0.1; T.m18 = W("6", "prepara") - 0.1; T.tap2 = B("6").end + 1.6; T.sub2 = T.tap2 + 0.8;
  T.semanas = B("7").start - 0.9; T.m20 = W("7", "avisa") - 0.2; T.m21 = W("7", "quando", 2) - 0.2;

  // ---------------------------------------------------------------- peças do chat
  const wave = (n, seed) => { const r = rng(seed); return `<svg width="${n * 7}" height="34" viewBox="0 0 ${n * 7} 34">${[...Array(n)].map((_, i) => { const h = 6 + r() * 26; return `<rect x="${i * 7}" y="${17 - h / 2}" width="4" height="${h}" rx="2" fill="#5C8A4A"/>`; }).join("")}</svg>`; };
  const mapa = `<svg width="300" height="150" viewBox="0 0 300 150" style="display:block;border-radius:12px"><rect width="300" height="150" fill="#E8EEDC"/><path d="M0 100 Q90 70 170 90 T300 70" stroke="#fff" stroke-width="14" fill="none"/><path d="M120 0 L150 150" stroke="#fff" stroke-width="10"/><rect x="170" y="20" width="80" height="50" fill="#CFE0B8" stroke="#9FB57E" stroke-dasharray="6 4"/><path d="M210 40 C196 22 196 14 196 10 A14 14 0 1 1 224 10 C224 14 224 22 210 40Z" fill="#D9623B"/></svg><div style="font-size:16px;margin-top:6px;color:#5C6578">📍 Localização · terreno</div>`;
  const pdf = `<div style="display:flex;gap:12px;align-items:center;padding:6px 2px"><div style="width:44px;height:54px;border-radius:6px;background:#E5484D;color:#fff;font:800 13px Inter;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px">PDF</div><div><div style="font-weight:650;font-size:18px">Caderneta predial.pdf</div><div style="font-size:15px;color:#7C8597">2 páginas</div></div></div>`;
  const planta = `<svg width="300" height="200" viewBox="0 0 300 200" style="display:block;border-radius:10px"><rect width="300" height="200" fill="#EADBB4"/><rect width="300" height="200" fill="#B08B4F" opacity=".12"/>
      <g stroke="#6B5434" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M40 40 L250 34 L262 160 L48 168 Z"/><path d="M80 60 L150 58 L152 120 L82 122 Z" stroke-dasharray="6 4"/><path d="M40 190 L270 186"/><path d="M60 182 l0 8 M250 178 l0 8"/></g>
      <text x="200" y="80" font-family="Fraunces" font-style="italic" font-size="16" fill="#6B5434">terreno</text><text x="88" y="140" font-family="Fraunces" font-style="italic" font-size="14" fill="#6B5434">J. 1987</text></svg>`;
  const passeio = `<svg width="300" height="190" viewBox="0 0 300 190" style="display:block;border-radius:10px"><rect width="300" height="190" fill="#9FB4C8"/><rect y="0" width="300" height="110" fill="#E9DFCF"/><rect x="40" y="30" width="120" height="70" fill="#6E8BA8" stroke="#5A4630" stroke-width="5"/><rect x="190" y="30" width="60" height="80" fill="#7A5C3E" stroke="#5A4630" stroke-width="5"/><rect y="96" width="300" height="14" fill="#F4F1EA"/><rect y="110" width="300" height="60" fill="#CFC6B6"/><rect y="170" width="300" height="20" fill="#6B7280"/></svg>`;
  const esboco = `<svg width="320" height="210" viewBox="0 0 320 210" style="display:block;border-radius:10px;background:#F7F4EC">
      <rect x="10" y="10" width="300" height="20" fill="#0F1B33"/><text x="160" y="25" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Inter">FACHADA · CASA JOAQUIM</text>
      ${[0, 1, 2].map((i) => [0, 1].map((j) => `<circle cx="${70 + i * 90}" cy="${60 + j * 44}" r="14" fill="#E8B44A" stroke="#B9862C" stroke-width="2"/>`).join("")).join("")}
      <rect x="10" y="135" width="300" height="56" fill="url(#hatch2)" stroke="#3FA6A0" stroke-width="2"/>
      <defs><pattern id="hatch2" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#E3F5F3"/><path d="M0 0 V10" stroke="#3FA6A0" stroke-width="2"/></pattern></defs>
      <path d="M280 138 V188 M272 146 L280 138 L288 146 M272 180 L280 188 L288 180" stroke="#0E7C77" stroke-width="2.5" fill="none"/>
      <text x="150" y="168" text-anchor="middle" font-size="15" font-weight="800" fill="#0E7C77" font-family="Inter">corredor para peões ≥ 2 m</text></svg>`;
  const btns = (a, b) => `<div class="btns" style="display:flex;gap:8px;margin-top:10px"><div class="bt bt1" style="flex:1;padding:10px;border-radius:12px;text-align:center;font-weight:700;background:#E3F7F6;color:#0E7C77;font-size:17px">${a}</div>${b ? `<div class="bt bt2" style="flex:1;padding:10px;border-radius:12px;text-align:center;font-weight:600;background:#F2F4F7;color:#5C6578;font-size:17px">${b}</div>` : ""}</div>`;
  const sys = (txt, cor = "#1F7A3E", bg = "#E3F5E8") => `<div style="font-size:16px;font-weight:650;color:${cor};background:${bg};padding:8px 14px;border-radius:12px;text-align:center">${txt}</div>`;
  const sep = (txt) => `<div style="font-size:15px;font-weight:600;color:#5C6578;background:#FBF8F2;padding:6px 14px;border-radius:10px">${txt}</div>`;

  const MSG = [
    { t: T.m0, k: "af", ty: 0.9, h: `Olá! Sou o <b>Henriques</b> 👋 Trato dos seus assuntos com a Câmara e as Freguesias de Guimarães. Para agir em seu nome, preciso que se identifique uma vez.${btns("Identificar-me (CMD)")}` },
    { t: T.m1, k: "af", ty: 0.5, h: `Obrigado, Inês ✓ Em que posso ajudar?` },
    { t: T.m2, k: "me", h: `<div style="display:flex;align-items:center;gap:10px"><div style="width:34px;height:34px;border-radius:50%;background:#5C8A4A;display:flex;align-items:center;justify-content:center"><div style="width:0;height:0;border-left:12px solid #fff;border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:3px"></div></div>${wave(30, 7)}<span style="font-size:15px;color:#5C6578">0:12</span></div><div style="font-size:16px;font-style:italic;color:#3A4560;margin-top:6px">“Henriques, queria saber se posso construir uma casa no terreno atrás do restaurante. Uns 150 metros quadrados.”</div>` },
    { t: T.m3, k: "af", ty: 0.8, h: `Percebi: <b>moradia de ~150 m²</b> no terreno atrás da Casa Joaquim 🏡<br>Para verificar, preciso de:<br>📍 localização · 📄 caderneta predial · 🗺️ uma planta, se tiver` },
    { t: T.m4, k: "af", ty: 0.5, h: `Já tem projeto, ou é só uma ideia?` },
    { t: T.m5, k: "me", h: `Só uma ideia 🙂` },
    { t: T.loc, k: "me", h: mapa, pad: 8 },
    { t: T.doc, k: "me", h: pdf },
    { t: T.foto, k: "me", h: `${planta}<div style="font-size:16px;margin-top:6px;color:#3A4560">a planta antiga do avô</div>`, pad: 8 },
    { t: T.m7, k: "af", ty: 0.6, h: `Recebido! Quer que guarde estes documentos no seu <b>Cofre</b>, para não ter de os enviar outra vez?${btns("Sim, guardar", "Agora não")}` },
    { t: T.m8, k: "af", ty: 1.0, h: `<b>Boa notícia</b> 🎉 No PDM em vigor o terreno está em espaço habitacional, e a proposta de revisão mantém-no assim. Uma casa de 150 m² cabe nos limites.<div><span class="chip"><i>${ICON.clip()}</i>Fontes: PDM em vigor · proposta de revisão</span></div>` },
    { t: T.m9, k: "af", ty: 0.5, h: `Para ter certeza formal, preparei o <b>Pedido de Informação Prévia</b> para o Urbanismo Digital da Câmara.${btns("Rever e confirmar")}` },
    { t: T.m10, k: "me", h: `Preciso de contratar um arquiteto?` },
    { t: T.m11, k: "af", ty: 0.7, h: `Para este pedido inicial, preparo consigo o que a Câmara pede. Se for preciso um técnico habilitado, já agora ou na fase do projeto, digo-lhe quem e para quê.` },
    { t: T.sub1, k: "sys", h: sys("✓ Pedido submetido · Urbanismo Digital · recibo 2026/PIP/0318") },
    { t: T.dias, k: "sep", h: sep("Dias depois") },
    { t: T.m13, k: "me", h: `E posso ter uma esplanada à porta? ☀️` },
    { t: T.m14, k: "af", ty: 0.6, h: `Já tenho a <b>Casa Joaquim</b> no seu Cofre 🙂 Quantas mesas e em que meses? E consegue enviar uma foto do passeio?` },
    { t: T.m15, k: "me", h: `6 mesas, de abril a outubro` },
    { t: T.m16, k: "me", h: passeio, pad: 8 },
    { t: T.m17, k: "af", ty: 0.6, h: `Como fica junto à fachada e não passa da largura do restaurante, basta uma <b>mera comunicação prévia</b>. Fiz uma proposta que deixa 2 m livres para peões:<div style="margin-top:8px">${esboco}</div>` },
    { t: T.m18, k: "af", ty: 0.4, h: `<div style="line-height:1.6">✅ Mera comunicação prévia<br>✅ Corredor de peões ≥ 2 m<br>✅ Dados do restaurante: já tenho<br>✅ Taxa: calculada pela Câmara</div>Preparei a comunicação. Confirma?${btns("Confirmar")}` },
    { t: T.sub2, k: "sys", h: sys("✓ Comunicação enviada · esplanada de abril a outubro") },
    { t: T.semanas, k: "sep", h: sep("Semanas depois") },
    { t: T.m20, k: "af", h: `⏰ A época da esplanada que declarou termina daqui a 30 dias. Quer que prepare a do próximo ano?${btns("Sim, preparar", "Mais tarde")}` },
    { t: T.m21, k: "af", h: `📣 A revisão do PDM vai a votação na Assembleia Municipal. O seu terreno mantém-se habitacional. Quer que lhe explique o resto?${btns("Explicar")}` },
  ];

  // ---------------------------------------------------------------- cofre
  const COFRE = [
    { t: T.ok1 + 0.2, ico: "🪪", txt: "Identidade verificada (CMD)" },
    { t: T.sim + 0.5, ico: "📍", txt: "Terreno · localização" },
    { t: T.sim + 0.8, ico: "📄", txt: "Caderneta predial" },
    { t: T.sim + 1.1, ico: "🗺️", txt: "Planta do terreno (1987)" },
    { t: T.sim + 1.4, ico: "🍽️", txt: "Restaurante · Casa Joaquim" },
    { t: T.sub1 + 0.3, ico: "🏡", txt: "Pedido de informação prévia" },
    { t: T.sub2 + 0.3, ico: "☀️", txt: "Esplanada · 6 mesas · abr–out" },
    { t: T.m20 - 0.6, ico: "🔔", txt: "Alertas autorizados" },
  ];
  const CX = 280, CY = 385;
  const MAPA = [[140, 590], [140, 190], [420, 190], [140, 300], [420, 300], [140, 480], [420, 480], [420, 590]];
  const mapPos = (i) => MAPA[i];
  const MISS = [
    { nome: "Casa no terreno", t0: T.m3, steps: [T.m3, T.sim + 1.6, T.m9, T.sub1, Infinity] },
    { nome: "Esplanada", t0: T.m14 - 0.2, steps: [T.m14, T.m16 + 0.3, T.m18, T.sub2, Infinity] },
  ];
  const STEPS = ["Entendido", "A verificar", "Preparado", "Submetido", "Respondido"];

  const cmdHTML = (cls) => `<div class="cmd ${cls}" style="position:absolute;left:0;top:0;width:100%;height:100%;background:#fff;z-index:5;padding:170px 40px 0">
      <div style="display:flex;align-items:center;gap:10px;color:#1F7A3E;font-weight:700;font-size:19px"><span style="width:22px;height:22px">${ICON.lock("#1F7A3E")}</span>Ambiente seguro</div>
      <div style="margin-top:34px;width:90px;height:90px;border-radius:22px;background:#0F1B33;padding:22px">${ICON.key("#E8B44A")}</div>
      <div class="serif" style="font-size:40px;font-weight:650;margin-top:22px">Chave Móvel Digital</div>
      <div class="cmdtxt" style="font-size:21px;color:#5C6578;margin-top:12px;line-height:1.35"></div>
      <div style="display:flex;gap:16px;margin-top:40px">${[0, 1, 2, 3].map(() => `<div style="width:58px;height:70px;border-radius:12px;border:2px solid #CDD3DE;display:flex;align-items:center;justify-content:center"><div class="pd" style="width:18px;height:18px;border-radius:50%;background:#0F1B33"></div></div>`).join("")}</div>
      <div class="cok" style="margin-top:44px;display:flex;align-items:center;gap:16px"><div style="width:60px;height:60px">${ICON.check()}</div><div style="font-weight:700;font-size:24px">Confirmado</div></div>
    </div>`;

  // ===================================================================
  // CENA 1 — o cartaz do Henriques
  // ===================================================================
  scene({
    id: "a1", start: 0, end: CUT.chat + 1.0, fi: 0, fo: 0,
    build(el) {
      cue("qr", W("1", "decide") + 0.2, 0.8); cue("shimmer", W("1", "henriques") - 0.3, 0.5);
      motes({ seed: 21, a: 0, b: CUT.chat + 1, n: 40, area: [0, 0, 1920, 900] });
      el.style.background = "#F3E6D0";
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs><linearGradient id="v2sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE8B8"/><stop offset="1" stop-color="#F3E6D0"/></linearGradient></defs>
          <rect width="1920" height="1080" fill="url(#v2sun)"/>
          <rect x="980" y="120" width="820" height="640" fill="#BFD7EA"/><path d="M980 560 Q1300 520 1800 560 V760 H980Z" fill="#D9CDB6"/>
          <rect x="980" y="120" width="820" height="640" fill="none" stroke="#5A4630" stroke-width="22"/><path d="M1390 120 V760" stroke="#5A4630" stroke-width="12"/>
          <polygon points="980,120 1390,120 1200,760 980,760" fill="#FFF6DD" opacity=".35"/>
          <rect y="780" width="1920" height="300" fill="#C9A47C"/>${[...Array(8)].map((_, i) => `<path d="M0 ${810 + i * 34} H1920" stroke="#B8936B" stroke-width="2"/>`).join("")}
          <rect y="740" width="1920" height="50" fill="#7A5C3E"/>
          ${[0, 1, 2].map((i) => `<g transform="translate(${180 + i * 260} 860)"><ellipse rx="90" ry="20" fill="#F7F1E4" stroke="#B9AF9E" stroke-width="3"/><path d="M-60 0 V120 M60 0 V120" stroke="#5A4630" stroke-width="6"/></g>`).join("")}
          <g transform="translate(560 330) scale(1.05)"><g class="ini">${ines({ smile: true })}</g></g>
          <g class="hph" transform="translate(745 640)"><rect x="-22" y="-38" width="44" height="76" rx="8" fill="#101524"/><rect x="-17" y="-31" width="34" height="58" rx="4" fill="#7AF0E8" opacity=".6"/></g>
        </svg>
        <div class="poster abs" style="left:1440px;top:190px;width:300px;height:420px;background:#0F1B33;border-radius:10px;padding:26px;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.25);transform:rotate(2deg)">
          <div style="display:flex;justify-content:center">${henriquesRingSVG(96)}</div>
          <div class="serif" style="font-size:34px;font-weight:650;text-align:center;line-height:1.1;margin-top:8px">Fale com o Henriques</div>
          <div style="font-size:16px;color:#B8C4DA;text-align:center;margin-top:8px">o representante digital dos munícipes de Guimarães</div>
          <div style="margin:16px auto 0;width:120px;height:120px;background:#fff;padding:10px"><svg viewBox="0 0 21 21" width="100" height="100">${(() => { const r = rng(5); let s = ""; for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) { const f = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const on = f ? ((x % 6 === 0 || y % 6 === 0 || (x > 13 && (x - 14) % 6 === 0)) || ((x % 7 > 1 && x % 7 < 5) && (y % 7 > 1 && y % 7 < 5))) : r() < 0.5; if (on) s += `<rect x="${x}" y="${y}" width="1" height="1"/>`; } return s; })()}</svg></div>
        </div>
        <div class="scan abs" style="left:1460px;top:400px;width:260px;height:4px;background:#3FD0C9;box-shadow:0 0 18px #3FD0C9"></div>`;
      return { poster: q(el, ".poster"), scan: q(el, ".scan"), hph: q(el, ".hph") };
    },
    update(t, c) {
      const ts = W("1", "decide") - 0.4;
      const sc = win(t, ts, ts + 1.4, 0.2, 0.3);
      O(c.scan, sc); c.scan.style.top = `${L(330, 560, P(t, ts, 1.4, ease.io))}px`;
      const lift = P(t, W("1", "decide") - 1.0, 0.6, ease.io);
      c.hph.setAttribute("transform", `translate(${L(745, 800, lift)} ${L(640, 520, lift)}) rotate(${L(0, -12, lift)})`);
    },
  });

  // ===================================================================
  // CENA 2 — a conversa (cena longa)
  // ===================================================================
  scene({
    id: "a2", start: CUT.chat, end: CUT.fim + 0.9, fi: 0.8, fo: 0, z: 2, kb: 0.015,
    build(el) {
      // som
      MSG.forEach((m) => { if (m.k === "af") { cue("receber", m.t, 0.55); if (m.ty) cue("blip", m.t - m.ty, 0.25); } else if (m.k === "me") cue("enviar", m.t, 0.5); else if (m.k === "sys") cue("carimbo", m.t, 0.6); });
      cue("voz", T.rec, 0.6); cue("obturador", T.foto - 0.5, 0.8);
      cue("sucesso", T.ok1, 0.6); cue("sucesso", T.ok2, 0.6);
      cue("pin", T.sim - 0.05, 0.6); cue("pin", T.tap1, 0.5); cue("pin", T.tap2, 0.5);
      COFRE.slice(1).forEach((c) => cue("ouro", c.t, 0.45));
      cue("vibrar", T.m20 - 0.7, 0.7); cue("vibrar", T.m21 - 0.7, 0.7);
      cue("celebrar", T.m8 + 0.1, 0.6); cue("shimmer", W("7", "avisa") + 3.2, 0.5);
      burst({ seed: 81, t0: T.m8 + 0.2, x: 950, y: 520, n: 70, speed: 600, life: 2.2, grav: 800, colors: ["#D9623B", "#E8B44A", "#3FD0C9", "#5BBF7A"], size: [4, 8], shape: "rect", spread: [-Math.PI * 0.95, -Math.PI * 0.05] });
      el.style.background = "#F6EBDA";
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <circle cx="330" cy="560" r="300" fill="#E8B44A" opacity=".16"/>
          <rect y="940" width="640" height="140" fill="#E4D2B6"/>
          <g transform="translate(150 360) scale(1.12)"><g class="ini">${ines({ smile: true })}</g></g>
          <g class="apron" transform="translate(150 360) scale(1.12)"><path d="M70 230 H130 L136 350 H64 Z" fill="#F7F1E4" opacity=".95"/><path d="M76 170 Q100 160 124 170 L130 232 H70Z" fill="#F7F1E4" opacity=".95"/></g>
        </svg>
        <div class="phone" style="left:690px;top:40px;width:540px;height:1000px">
          <div class="screen">
            <div class="head">${henriquesRingSVG(64)}<div><div class="name">Henriques</div><div class="status">online</div></div></div>
            <div class="feed"><div class="feed-in">
              ${MSG.map((m, i) => `${m.ty ? `<div class="typing ty${i}"><b></b><b></b><b></b></div>` : ""}<div class="m m${i} ${m.k === "me" || m.k === "af" ? "bubble " + m.k : ""}" style="${m.k === "sys" || m.k === "sep" ? "align-self:center;max-width:94%" : ""}${m.pad ? `;padding:${m.pad}px` : ""}">${m.h}${m.k === "me" ? `<div class="meta"><span class="ticks">✓✓</span></div>` : ""}</div>`).join("")}
            </div></div>
            <div class="input"><span class="ph">Mensagem</span><div class="send"></div></div>
            <div class="rec abs" style="left:14px;right:14px;bottom:18px;height:64px;border-radius:32px;background:#fff;z-index:4;display:flex;align-items:center;gap:12px;padding:0 22px;font-size:19px;color:#E5484D;font-weight:650"><span style="width:12px;height:12px;border-radius:50%;background:#E5484D"></span>A gravar… <span class="rt mono">0:00</span></div>
            ${cmdHTML("cmd1")}${cmdHTML("cmd2")}
          </div>
        </div>
        ${MISS.map((m, i) => `<div class="mis card" style="left:1290px;top:${50 + i * 140}px;width:570px;height:122px;padding:16px 22px">
            <div style="display:flex;justify-content:space-between"><div class="label-sm" style="color:#5C6578;font-size:14px">Missão</div><div class="mst mono" style="font-size:14px;color:#0E7C77"></div></div>
            <div style="font-size:24px;font-weight:700;margin-top:2px">${m.nome}</div>
            <div style="position:relative;height:30px;margin-top:8px">
              <div style="position:absolute;left:10px;right:10px;top:9px;height:4px;background:#E6E0D3;border-radius:2px"></div>
              <div class="mbar" style="position:absolute;left:10px;top:9px;height:4px;background:#3FA6A0;border-radius:2px;width:0"></div>
              ${STEPS.map((s, k) => `<div class="dot" style="position:absolute;left:${10 + k * 127}px;top:3px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#E6E0D3;border:3px solid #fff"></div>`).join("")}
            </div>
          </div>`).join("")}
        <div class="cof dark-card" style="left:1290px;top:340px;width:570px;height:700px;padding:22px 26px;border-color:rgba(232,180,74,.55);overflow:hidden">
          <div style="display:flex;align-items:center;gap:12px"><span style="width:30px;height:30px">${ICON.lock("#E8B44A")}</span><div class="serif" style="font-size:32px;font-weight:600;color:#E8B44A">Cofre Digital Pessoal</div></div>
          <div class="mono" style="font-size:16px;color:#8FA3C4;margin-top:4px">da Inês · cifrado · só ela controla</div>
          <svg class="clines abs" width="570" height="700" style="left:0;top:0">${COFRE.map((_, i) => { const [x, y] = mapPos(i); return `<line class="cl" x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="#E8B44A" stroke-width="2" opacity=".5"/>`; }).join("")}</svg>
          <div class="cme abs" style="left:${CX - 50}px;top:${CY - 50}px;width:100px;height:100px;border-radius:50%;background:#D9623B;color:#fff;display:flex;align-items:center;justify-content:center;font-family:Fraunces;font-size:26px;font-weight:650">Inês</div>
          ${COFRE.map((c, i) => `<div class="ci abs" style="left:0;top:0"><div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;background:#16264A;border:1.5px solid rgba(232,180,74,.6);color:#F3E3BC;font-size:19px;white-space:nowrap"><span>${c.ico}</span>${c.txt}</div><div class="ok mono" style="font-size:13px;color:#5BBF7A;margin:4px 0 0 6px">guardado com a sua autorização</div></div>`).join("")}
        </div>
        <div class="alr abs mono" style="left:1290px;top:1046px;width:570px;text-align:center;font-size:15px;color:#7C6A55"></div>`;
      return {
        ini: q(el, ".ini"), feed: q(el, ".feed-in"), status: q(el, ".status"), rec: q(el, ".rec"), rt: q(el, ".rt"), ph: q(el, ".ph"),
        msgs: MSG.map((_, i) => q(el, ".m" + i)), typ: MSG.map((_, i) => q(el, ".ty" + i)),
        cmd1: q(el, ".cmd1"), cmd2: q(el, ".cmd2"), mis: qa(el, ".mis"), cof: q(el, ".cof"), ci: qa(el, ".ci"), cl: qa(el, ".cl"), cme: q(el, ".cme"), phone: q(el, ".phone"),
      };
    },
    update(t, c) {
      // ---- conversa
      let shift = 0, typing = false;
      MSG.forEach((m, i) => {
        const b = c.msgs[i], ty = c.typ[i];
        const tyOn = m.ty && t >= m.t - m.ty && t < m.t;
        if (ty) { ty.style.display = tyOn ? "flex" : "none"; if (tyOn) { typing = true; qa(ty, "b").forEach((d, k) => (d.style.transform = `translateY(${Math.sin(t * 10 - k * 0.8) * -4}px)`)); } }
        const vis = t >= m.t;
        b.style.display = vis ? "block" : "none";
        if (vis) {
          const p = P(t, m.t, 0.4, ease.out);
          b.style.transformOrigin = m.k === "me" ? "100% 100%" : m.k === "af" ? "0% 100%" : "50% 100%";
          S(b, { s: L(0.86, 1, p), o: Math.min(1, p * 2) });
          if (p < 1) shift += (b.offsetHeight + 14) * (1 - p);
        }
      });
      c.feed.style.transform = `translateY(${shift}px)`;
      c.status.textContent = typing ? "a escrever…" : "online"; c.status.style.color = typing ? "#1FA7B5" : "#6B7488";
      // botões tocados
      const press = (m, cls, tt) => { const bt = q(c.msgs[m], cls); if (!bt) return; const on = t > tt - 0.12; bt.style.background = on ? "#3FD0C9" : ""; bt.style.color = on ? "#0F1B33" : ""; bt.style.transform = t > tt - 0.12 && t < tt + 0.15 ? "scale(.94)" : "none"; };
      press(0, ".bt1", T.cmd1); press(9, ".bt1", T.sim); press(11, ".bt1", T.tap1); press(21, ".bt1", T.tap2);
      // gravação da mensagem de voz
      const rv = t >= T.rec && t < T.m2; c.rec.style.display = rv ? "flex" : "none"; if (rv) c.rt.textContent = `0:${String(Math.min(12, Math.floor((t - T.rec) * 7))).padStart(2, "0")}`;
      // chave móvel digital
      [[c.cmd1, T.cmd1, T.ok1, "Autorizar o Henriques a representá-la junto da Câmara Municipal de Guimarães"], [c.cmd2, T.cmd2, T.ok2, "Confirmar a submissão do Pedido de Informação Prévia no Urbanismo Digital"]].forEach(([el, a, b, txt]) => {
        const op = P(t, a, 0.4, ease.out) * (1 - P(t, b + 0.7, 0.35, ease.in));
        S(el, { y: L(980, 0, op), o: op > 0 ? 1 : 0 });
        q(el, ".cmdtxt").textContent = txt;
        qa(el, ".pd").forEach((d, k) => O(d, t > a + 0.35 + k * ((b - a - 0.5) / 4) ? 1 : 0));
        const ok = P(t, b, 0.35, ease.back); S(q(el, ".cok"), { s: L(0.6, 1, ok), o: ok });
      });
      // a Inês: pequenos gestos
      const bounce = Math.max(0, ...[T.m8, T.sub1, T.sub2].map((tt) => (t > tt && t < tt + 0.6 ? Math.sin(((t - tt) / 0.6) * Math.PI) : 0)));
      c.ini.setAttribute("transform", `translate(0 ${-bounce * 24})`);
      // ---- missões
      c.mis.forEach((el, i) => {
        const m = MISS[i]; const p = P(t, m.t0, 0.5, ease.back); S(el, { x: L(40, 0, p), o: Math.min(1, p * 2) });
        let k = -1; m.steps.forEach((st, j) => { if (t >= st) k = j; });
        qa(el, ".dot").forEach((d, j) => { d.style.background = j <= k ? "#3FA6A0" : "#E6E0D3"; d.style.transform = j === k ? `scale(${1 + 0.25 * Math.max(0, 1 - (t - m.steps[k]) / 0.4)})` : "none"; });
        q(el, ".mbar").style.width = `${Math.max(0, k) * 127}px`;
        q(el, ".mst").textContent = k >= 0 ? STEPS[k] : "";
      });
      // ---- cofre: lista → mapa
      O(c.cof, P(t, T.ok1 - 0.3, 0.5, ease.lin));
      const mp = P(t, W("7", "avisa") + 2.6, 1.4, ease.io);
      c.ci.forEach((el, i) => {
        const it = COFRE[i]; const p = P(t, it.t, 0.5, ease.back);
        const lx = 28, ly = 110 + i * 68;
        const [mx, my] = mapPos(i);
        const x = L(lx, mx - 105, mp), y = L(ly, my - 20, mp);
        el.style.transformOrigin = "0 0"; S(el, { x: x + L(60, 0, Math.min(1, p)), y, s: L(1, 0.74, mp), o: Math.min(1, p * 2) });
        O(q(el, ".ok"), win(t, it.t + 0.2, it.t + 2.4, 0.2, 0.4) * (1 - mp));
        el.style.filter = t > it.t && t < it.t + 0.8 ? `drop-shadow(0 0 ${18 * (1 - (t - it.t) / 0.8)}px #E8B44A)` : "none";
      });
      c.cl.forEach((l, i) => O(l, mp * (t > COFRE[i].t ? 0.6 : 0)));
      S(c.cme, { s: mp, o: mp });
    },
  });

  // ===================================================================
  // CENA 3 — a esplanada cheia e o slogan
  // ===================================================================
  const R3 = rng(31);
  const pessoa = (x, cor, s = 1) => `<g transform="translate(${x} 0) scale(${s})"><circle cx="0" cy="-118" r="16" fill="${["#E2A47E", "#C98E6A", "#8D5A3B"][Math.floor(R3() * 3)]}"/><path d="M-20 -100 Q0 -108 20 -100 L24 -40 H-24Z" fill="${cor}"/></g>`;
  scene({
    id: "a3", start: CUT.fim, end: TOTAL + 0.1, fi: 0.9, fo: 0, z: 3,
    build(el) {
      cue("esplanada", CUT.fim, 0.6); cue("celebrar", W("8", "diga") - 0.2, 0.7); cue("final", W("8", "henriques") - 0.1, 0.7);
      burst({ seed: 91, t0: W("8", "diga") - 0.1, x: 960, y: 300, n: 120, speed: 900, life: 3.4, grav: 820, colors: ["#D9623B", "#E8B44A", "#3FD0C9", "#5BBF7A", "#F2EEE6"], size: [5, 10], shape: "rect", spread: [-Math.PI * 0.95, -Math.PI * 0.05] });
      motes({ seed: 33, a: CUT.fim, b: TOTAL, n: 40, color: "255,224,170", area: [0, 0, 1920, 800] });
      el.style.background = "#F6C98B";
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs><linearGradient id="v2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5B37A"/><stop offset="1" stop-color="#FCE3C0"/></linearGradient></defs>
          <rect width="1920" height="1080" fill="url(#v2sky)"/><circle cx="1650" cy="170" r="90" fill="#FFD9A0"/>
          <g class="obra" transform="translate(330 0)"><path d="M1240 60 V330 M1240 80 H1520 M1500 80 V120" stroke="#E8B44A" stroke-width="10"/><path d="M1240 80 L1300 60" stroke="#E8B44A" stroke-width="6"/>
            <rect x="1120" y="200" width="360" height="200" fill="none" stroke="#B94E2C" stroke-width="7"/><path d="M1100 210 L1300 110 L1500 210" fill="none" stroke="#B94E2C" stroke-width="7"/>
            ${[0, 1, 2, 3].map((i) => `<path d="M${1130 + i * 110} 200 V400" stroke="#C9B48E" stroke-width="5"/>`).join("")}<path d="M1120 300 H1480" stroke="#C9B48E" stroke-width="5"/></g>
          <rect x="200" y="300" width="1100" height="520" fill="#E9DFCF"/><rect x="200" y="300" width="1100" height="80" fill="#0F1B33"/>
          <text x="750" y="356" text-anchor="middle" font-family="Fraunces" font-size="48" font-weight="600" fill="#F2EEE6" letter-spacing="6">CASA JOAQUIM</text>
          <rect x="280" y="430" width="460" height="300" fill="#6E8BA8" stroke="#5A4630" stroke-width="12"/><rect x="900" y="430" width="250" height="390" fill="#7A5C3E" stroke="#5A4630" stroke-width="12"/>
          <rect x="0" y="820" width="1920" height="260" fill="#CFC6B6"/>
          <rect x="0" y="1010" width="1920" height="70" fill="#E3F5F3" opacity=".7"/><text x="1700" y="1052" font-family="Inter" font-size="22" font-weight="700" fill="#0E7C77">corredor livre ≥ 2 m</text>
          ${[0, 1, 2, 3, 4, 5].map((i) => { const x = 180 + (i % 3) * 330 + (i > 2 ? 160 : 0), y = i > 2 ? 980 : 900; return `<g class="mesa" transform="translate(${x} ${y})"><g><path d="M-80 -150 Q0 -195 80 -150Z" fill="${["#D9623B", "#E8B44A", "#3FA6A0"][i % 3]}"/><path d="M0 -150 V0" stroke="#5A4630" stroke-width="5"/>${pessoa(-70, "#3A4E7A", 0.85)}${pessoa(70, "#5BBF7A", 0.85)}<ellipse cx="0" cy="-40" rx="56" ry="12" fill="#F7F1E4" stroke="#B9AF9E" stroke-width="3"/><path d="M-30 -40 V0 M30 -40 V0" stroke="#5A4630" stroke-width="5"/></g></g>`; }).join("")}
          <g transform="translate(1420 520) scale(1.05)"><g class="fin">${ines({ smile: true })}</g></g>
          <g transform="translate(1420 520) scale(1.05)"><ellipse cx="160" cy="300" rx="50" ry="9" fill="#F7F1E4" stroke="#B9AF9E" stroke-width="3"/><circle cx="140" cy="292" r="8" fill="#B94E2C"/><circle cx="170" cy="292" r="8" fill="#E8B44A"/></g>
        </svg>
        <div class="slg abs serif" style="left:0;width:1920px;top:34px;text-align:center;font-size:70px;line-height:1.12;font-weight:600;color:#0F1B33;text-shadow:0 2px 0 rgba(255,255,255,.4)">Diga o que precisa.<br><span style="color:#B94E2C;font-style:italic">O Henriques trata do resto.</span></div>
        <div class="sig abs mono" style="left:0;width:1920px;top:1000px;text-align:center;font-size:22px;letter-spacing:.2em;color:#5A4630">DELEGATE · 2/3</div>`;
      return { mesa: qa(el, ".mesa > g"), slg: q(el, ".slg"), sig: q(el, ".sig"), obra: q(el, ".obra") };
    },
    update(t, c) {
      c.mesa.forEach((m, i) => { const p = P(t, CUT.fim + 0.3 + i * 0.15, 0.5, ease.back); S(m, { y: L(-30, 0, p), s: p, o: Math.min(1, p * 2) }); });
      const sp = P(t, W("8", "diga") - 0.2, 0.7, ease.out); S(c.slg, { y: L(-30, 0, sp), s: L(0.94, 1, sp), o: sp });
      O(c.sig, P(t, B("8").end + 1.2, 0.6, ease.lin));
    },
  });
})();
