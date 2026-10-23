/* Delegate — vídeo de visão geral (3:00) · design system: Manrope, Palco/Bastidores, porta com maçaneta */
(function () {
  const { CUT, cue, shake, burst, rings, motes, P, L, W, B, S, O, D, ease, clamp, rng, H, q, qa, ICON, scene, win, onFrame, stage, TL } = F;
  const TOTAL = TL.total;
  const C = { palco: "#F4EFE6", branco: "#FFFEFA", tinta: "#1D2430", cinza: "#647080", linha: "#E6E2DA", bast: "#0F1B2D", bast2: "#15243B", bast3: "#2C3D57", btxt: "#C3CCD8", verde: "#1A7040", verdeS: "#DCEFE2", dourado: "#8A6210", douradoS: "#F6EDCF", terra: "#B4492A", terraS: "#F6E2DC", mverde: "#7BCC90", mdourado: "#E0B65D" };
  const IMG = "../shared/";

  CUT.s2 = B("2").start - 0.6;
  CUT.s3 = B("3").start - 0.6;
  CUT.demo = B("4").start - 1.2;
  CUT.consola = B("6").start - 0.8;
  CUT.s7 = B("7").start - 0.5;
  CUT.s8 = B("8").start - 0.6;
  CUT.s9 = B("9").start - 0.5;
  CUT.s10 = B("10").start - 0.6;
  CUT.s10b = B("10b").start - 0.6;
  CUT.int = W("10b", "intencoes", 2) - 0.5;
  CUT.s11 = B("11").start - 0.6;
  CUT.fecho = W("11", "onde") - 0.4;
  window.VIG = [[0, 0.15], [TOTAL, 0.15]];
  window.BADGE = [-1, -1];
  document.getElementById("grain").style.opacity = ".035";

  // símbolo: porta com maçaneta (grelha 48×48, design-system/README.md)
  const porta = (cor = C.mverde, mac = C.mdourado, cls = "") =>
    `<g class="${cls}"><path class="arco" pathLength="1" d="M10 40V22a14 14 0 0 1 28 0v18Z" fill="none" stroke="${cor}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle class="mac" cx="30.5" cy="26" r="2.5" fill="${mac}"/></g>`;
  const pop = (el, t, a, d = 0.5, dy = 24) => { const p = P(t, a, d, ease.back); S(el, { y: L(dy, 0, Math.min(1, p)), s: L(0.9, 1, Math.min(1, p)), o: Math.min(1, p * 2) }); };
  const fade = (el, t, a, d = 0.5, dy = 18) => { const p = P(t, a, d, ease.out); S(el, { y: L(dy, 0, p), o: p }); };
  const conta = (el, t, a, d, alvo, fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")) => { const n = Math.round(alvo * P(t, a, d, ease.out)); const s = fmt(n); if (el.textContent !== s) el.textContent = s; };

  // vídeos (capturas reais): posicionados ao fotograma, com espera pelo «seeked»
  window.__pend = [];
  function vid(el, tempo) {
    const t = Math.max(0, Math.min(tempo, (el.duration || 1e6) - 0.04));
    if (Math.abs(el.currentTime - t) > 0.002) {
      // espera pelo «seeked»; se não chegar em 1,5 s, pede de novo e segue
      window.__pend.push(new Promise((r) => {
        const fim = () => { clearTimeout(lim); r(); };
        el.addEventListener("seeked", fim, { once: true });
        const lim = setTimeout(() => { el.removeEventListener("seeked", fim); el.currentTime = t + 0.0005; setTimeout(r, 600); }, 1500);
      }));
      el.currentTime = t;
    }
  }
  const mapa = (t, pts) => { if (t <= pts[0][0]) return pts[0][1]; for (let i = 0; i < pts.length - 1; i++) { const [a, va] = pts[i], [b, vb] = pts[i + 1]; if (t <= b) return L(va, vb, (t - a) / (b - a || 1)); } return pts[pts.length - 1][1]; };
  // enquadramento: região da captura (x, y, w, h) a caber na caixa
  const CAIXA = [70, 56, 1780, 968];
  function enquadrar(el, R) {
    const [bx, by, bw, bh] = CAIXA, [x, y, w, h] = R;
    const s = Math.min(bw / w, bh / h);
    el.style.transform = `translate(${bx + (bw - w * s) / 2 - x * s}px, ${by + (bh - h * s) / 2 - y * s}px) scale(${s})`;
  }
  // keys: [t, R] — a partir de t, transição de 0,9 s para a região R
  const regiao = (t, keys) => {
    let R = keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [a, Ra] = keys[i];
      if (t < a) break;
      const k = ease.io(clamp((t - a) / 0.9));
      R = R.map((v, j) => L(v, Ra[j], k));
    }
    return R;
  };
  const legenda = (txt, cor = C.mverde) => `<div class="leg" style="position:absolute;left:${CAIXA[0] + 34}px;bottom:${1080 - CAIXA[1] - CAIXA[3] + 30}px;max-width:1500px;padding:14px 24px;border-radius:14px;background:rgba(15,27,45,.92);border:1px solid ${cor};color:#FFFEFA;font-size:28px;font-weight:700;box-shadow:0 12px 30px rgba(0,0,0,.3)"><span style="color:${cor}">●</span>&nbsp; ${txt}</div>`;

  // a Inês e a fachada do restaurante: os mesmos modelos da série (delegate-serie/v1)
  const ini = (x, y, k, opts = {}) => `<g transform="translate(${x} ${y}) scale(${k})"><g class="ini">${F.ines(opts)}</g></g>`;
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
    <text x="960" y="298" text-anchor="middle" font-family="Manrope" font-size="58" font-weight="800" fill="#F2EEE6" letter-spacing="8">CASA JOAQUIM</text>
    <text x="960" y="372" text-anchor="middle" font-family="Manrope" font-size="24" font-weight="600" fill="#7C6A55" letter-spacing="8">RESTAURANTE · DESDE 1968</text>
    <g><rect x="420" y="420" width="560" height="360" fill="#6E8BA8"/><rect x="420" y="420" width="560" height="360" fill="none" stroke="#5A4630" stroke-width="14"/><path d="M700 420 V780" stroke="#5A4630" stroke-width="10"/>
      <g opacity=".55"><rect x="460" y="610" width="200" height="12" fill="#F2EEE6"/><rect x="740" y="610" width="200" height="12" fill="#F2EEE6"/><circle cx="560" cy="560" r="26" fill="#F7E4C2"/><circle cx="840" cy="560" r="26" fill="#F7E4C2"/></g></g>
    <g><rect x="1080" y="420" width="300" height="400" fill="#7A5C3E"/><rect x="1080" y="420" width="300" height="400" fill="none" stroke="#5A4630" stroke-width="14"/><circle cx="1350" cy="630" r="10" fill="#E8B44A"/></g>
    <clipPath id="vgcs1"><rect x="413" y="413" width="574" height="374"/></clipPath><clipPath id="vgcs2"><rect x="1073" y="413" width="314" height="414"/></clipPath>
    <g clip-path="url(#vgcs1)"><g class="sh1"><rect x="413" y="413" width="574" height="374" fill="#9AA3B2"/>${[...Array(18)].map((_, i) => `<path d="M413 ${425 + i * 20} H987" stroke="#7E8796" stroke-width="3"/>`).join("")}</g></g>
    <g clip-path="url(#vgcs2)"><g class="sh2"><rect x="1073" y="413" width="314" height="414" fill="#9AA3B2"/>${[...Array(20)].map((_, i) => `<path d="M1073 ${425 + i * 20} H1387" stroke="#7E8796" stroke-width="3"/>`).join("")}</g></g>
    <rect x="405" y="398" width="590" height="22" fill="#7E8796"/><rect x="1065" y="398" width="330" height="22" fill="#7E8796"/>
    <path d="M1500 180 V330" stroke="#3A3A3A" stroke-width="4"/><path d="M1470 330 h60 l-12 40 h-36z" fill="#3A3A3A"/><circle cx="1500" cy="372" r="10" fill="#F7D98A"/>`;

  // ===================================================================
  // 1 · A Inês
  // ===================================================================
  const CHIPS = [["Regulamento de Ocupação do Espaço Público", 120, 150, -3], ["Tabela de Taxas (RTTL 2025)", 1250, 150, 2], ["Licenciamento Zero", 1460, 880, -2], ["Formulário OVP-SO", 130, 520, 2], ["Balcão Único", 760, 900, 3], ["Mera comunicação prévia?", 140, 880, -1]];
  scene({
    id: "s1", start: 0, end: CUT.s2 + 0.8, fi: 0, fo: 0,
    build(el) {
      cue("pin", W("1", "que") - 0.1, 0.5); cue("pin", W("1", "que", 2) - 0.1, 0.5); cue("pin", W("1", "quanto") - 0.1, 0.5);
      cue("papel", W("1", "espalhada") - 0.2, 0.6);
      el.style.background = C.palco;
      el.innerHTML = `
        <svg class="abs fach" width="1920" height="1080" viewBox="0 0 1920 1080">${fachada}${ini(1000, 450, 0.76)}</svg>
        <div class="t-eti abs" style="left:128px;top:46px;color:${C.dourado}">Guimarães</div>
        ${CHIPS.map(([t, x, y, r]) => `<div class="chip2 abs" data-r="${r}" style="left:${x}px;top:${y}px"><div class="pil" style="background:${C.branco};border:1px solid #D9D3C7;color:${C.tinta};font-weight:600;font-size:26px">${t}</div></div>`).join("")}
        ${["Que licença?", "Que documentos?", "Quanto custa?"].map((t, i) => `<div class="pq abs" style="left:1430px;top:${440 + i * 130}px"><div class="pil" style="background:${i === 2 ? C.terraS : C.branco};color:${i === 2 ? "#8E3A21" : C.tinta};font-size:40px;font-weight:800;padding:18px 32px;box-shadow:0 18px 40px #17203322">${t}</div></div>`).join("")}`;
      return { fach: q(el, ".fach"), ines: q(el, ".ini"), sh1: q(el, ".sh1"), sh2: q(el, ".sh2"), worry: q(el, ".worry"), boca: q(el, ".mouth-n"), chips: qa(el, ".chip2"), pq: qa(el, ".pq"), eti: q(el, ".t-eti") };
    },
    update(t, c) {
      fade(c.eti, t, 0.3);
      O(c.fach, P(t, 0, 0.5, ease.lin));
      S(c.sh1, { y: -380 * P(t, 0.3, 1.6, ease.io) }); S(c.sh2, { y: -420 * P(t, 0.6, 1.6, ease.io) });
      S(c.ines, { x: L(-160, 0, P(t, 0.8, 1.6, ease.out)), o: P(t, 0.8, 0.6, ease.lin) });
      // a Inês preocupa-se quando chegam as perguntas
      const pr = P(t, W("1", "que") - 0.1, 0.4, ease.lin); c.worry.setAttribute("opacity", pr); c.boca.setAttribute("opacity", 1 - pr);
      const tq = [W("1", "que") - 0.15, W("1", "que", 2) - 0.15, W("1", "quanto") - 0.15];
      c.pq.forEach((p, i) => pop(p, t, tq[i], 0.5));
      const te = W("1", "espalhada") - 0.3;
      c.chips.forEach((ch, i) => { const p = P(t, te + i * 0.12, 0.55, ease.back); S(ch, { y: L(-40, 0, Math.min(1, p)), r: +ch.dataset.r * p, o: Math.min(1, p * 2) * L(1, 0.85, P(t, te + 1.5, 1, ease.lin)) }); ch.style.filter = `blur(${L(0, 1.2, P(t, te + 1.2, 1.2, ease.lin))}px)`; });
    },
  });

  // ===================================================================
  // 2 · Guimarães
  // ===================================================================
  const NUMS = [[22425, "atendimentos presenciais no Balcão Único, de 20 a 28 minutos cada", "vinte"], [41473, "chamadas telefónicas atendidas", "quarenta"], [25107, "registos de correspondência por email", "chamadas"]];
  scene({
    id: "s2", start: CUT.s2, end: CUT.s3 + 0.8, fi: 0.7, fo: 0, z: 2,
    build(el) {
      NUMS.forEach(([, , w]) => cue("blip", W("2", w) - 0.1, 0.5));
      el.style.background = C.palco;
      el.innerHTML = `
        <div class="e1 abs t-eti" style="left:128px;top:128px;color:${C.dourado}">Guimarães · fevereiro a novembro de 2025</div>
        <div class="h1 abs t-tit" style="left:128px;top:178px;width:1500px">A Inês não está sozinha.</div>
        ${NUMS.map(([, l], i) => `<div class="nc cartao" style="left:${128 + i * 568}px;top:380px;width:536px;height:330px;padding:44px">
          <div class="nv num" style="font-size:120px;font-weight:800;letter-spacing:-0.05em;line-height:1;color:${C.verde}">0</div>
          <div style="font-size:30px;line-height:1.35;color:#4A5463;margin-top:20px">${l}</div></div>`).join("")}
        <div class="fr abs" style="left:128px;top:790px;font-size:52px;font-weight:800;letter-spacing:-0.03em">A Câmara já tem um atendedor virtual. <span style="color:${C.verde}">O que falta?</span></div>
        <div class="fo abs" style="left:128px;top:1000px;font-size:22px;color:#56606E">Fonte: relatórios de atividades da Câmara Municipal de Guimarães, fevereiro a novembro de 2025.</div>`;
      return { e1: q(el, ".e1"), h1: q(el, ".h1"), nc: qa(el, ".nc"), nv: qa(el, ".nv"), fr: q(el, ".fr"), fo: q(el, ".fo") };
    },
    update(t, c) {
      fade(c.e1, t, CUT.s2 + 0.4); fade(c.h1, t, CUT.s2 + 0.6, 0.6); fade(c.fo, t, CUT.s2 + 1.2);
      c.nc.forEach((n, i) => { const a = W("2", NUMS[i][2]) - (i === 2 ? -0.6 : 0.4); pop(n, t, a, 0.6); conta(c.nv[i], t, a + 0.1, 1.3, NUMS[i][0]); });
      fade(c.fr, t, W("2", "atendedor") - 0.6, 0.6);
    },
  });

  // ===================================================================
  // 3 · O Henriques
  // ===================================================================
  const PROM = [["Verified", "Responde com a fonte à vista", "Regulamento, artigo e data em cada resposta. Sem fonte, diz que não sabe.", C.mverde, "responde"], ["Key", "Trata do pedido por si", "Com um mandato que a pessoa dá, limita e retira. Os dados ficam no Cofre dela.", C.mdourado, "trata"], ["Link", "A Câmara recebe o caso pronto", "Com as fontes e só os dados necessários. Quem decide é um técnico.", C.mverde, "entrega"]];
  const ico = { Verified: (c) => ICON.check(c), Key: (c) => ICON.key(c), Link: (c) => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>` };
  scene({
    id: "s3", start: CUT.s3, end: CUT.demo + 0.9, fi: 0.8, fo: 0, z: 3,
    build(el) {
      cue("revelacao", W("3", "delegate") - 0.4, 0.7); cue("shimmer", W("3", "henriques") - 0.2, 0.6);
      PROM.forEach((p) => cue("pin", W("3", p[4]) - 0.15, 0.5));
      rings({ t0: W("3", "henriques") - 0.1, x: 960, y: 293, n: 2, r1: 360, life: 1.3, color: "123,204,144" });
      el.style.background = C.bast;
      // pilha centrada no ecrã: foto (163–423), logótipo (453–553), nome (577), cartões (677–917)
      el.innerHTML = `
        <img class="av abs" src="${IMG}henriques-profile-700-sem-fundo.jpeg" style="left:830px;top:163px;width:260px;height:260px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 4px rgba(123,204,144,.45)">
        <div class="lg abs" style="left:0;width:1920px;top:453px;height:100px;display:flex;justify-content:center"><img src="${IMG}delegate-logo-horizontal-escuro.svg" style="height:100px"></div>
        <div class="nm abs" style="left:0;width:1920px;top:577px;text-align:center;font-size:40px;font-weight:700;color:${C.branco}">O Henriques <span style="color:${C.btxt};font-weight:500">· o seu representante digital</span></div>
        ${PROM.map(([k, h, , cor], i) => `<div class="pr cartao-b" style="left:${128 + i * 568}px;top:677px;width:536px;height:240px;padding:28px 40px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
          <div style="width:64px;height:64px">${ico[k](cor)}</div>
          <div style="font-size:38px;line-height:1.2;font-weight:800;color:${C.branco};margin-top:18px;letter-spacing:-0.02em;text-wrap:balance">${h}</div></div>`).join("")}`;
      return { av: q(el, ".av"), lg: q(el, ".lg"), nm: q(el, ".nm"), pr: qa(el, ".pr") };
    },
    update(t, c) {
      // o logótipo aparece sozinho, maior, ao centro; quando chega o Henriques encolhe para o seu lugar
      const tl = W("3", "delegate") - 0.3, th = W("3", "henriques") - 0.4;
      const pl = P(t, tl, 0.7, ease.out), k = P(t, th, 0.8, ease.io);
      S(c.lg, { y: L(37, 0, k), s: L(1.5, 1, k) * L(0.94, 1, pl), o: pl });
      const a = P(t, th + 0.2, 0.7, ease.back); S(c.av, { s: L(0.4, 1, a), o: Math.min(1, a * 2) });
      fade(c.nm, t, th + 0.5, 0.6);
      c.pr.forEach((p, i) => pop(p, t, W("3", PROM[i][4]) - 0.2, 0.5));
    },
  });

  // ===================================================================
  // 4–5 · Demonstração: o Painel ao vivo (captura real reproduzida)
  // ===================================================================
  const FULL = [0, 0, 1920, 1080], CHAT = [12, 430, 452, 640], ARV = [478, 60, 1432, 600], COF = [478, 650, 1432, 420];
  const PAINEL_T = [[CUT.demo, 2.6], [W("4", "escreve") - 0.2, 3.6], [W("4", "telegram"), 4.0], [W("4", "documentos") - 0.4, 9.2], [W("4", "fonte"), 10.4], [B("4").end + 0.6, 11.2],
    [W("5", "delega") - 0.2, 12.8], [W("5", "mandato"), 14.8], [W("5", "regista"), 17.7], [W("5", "mesas"), 19.4], [W("5", "corredor") - 0.2, 21.0], [W("5", "guarda") - 0.3, 21.9],
    [W("5", "cofre"), 23.4], [W("5", "cifrado") + 0.2, 25.4], [W("5", "chave") - 0.4, 26.4], [W("5", "chave") + 0.4, 27.4], [W("5", "processo") - 0.1, 32.2], [CUT.consola + 0.9, 33.6]];
  const PAINEL_R = [[CUT.demo, FULL], [W("4", "escreve") - 0.6, CHAT], [W("4", "telegram") + 0.4, ARV], [W("4", "documentos") - 0.2, CHAT], [W("5", "mandato") - 0.3, CHAT], [W("5", "guarda") - 0.4, COF], [W("5", "confirma") - 0.4, CHAT], [W("5", "processo") + 0.4, FULL]];
  const PAINEL_L = [[W("4", "escreve") - 0.2, "Mensagem real da Inês, no Telegram"], [W("4", "telegram") + 0.5, "Árvore de decisão do TypeSafe Jev · 2,6 s"], [W("4", "documentos") - 0.1, "Resposta em linguagem simples, com os documentos necessários"], [W("4", "fonte") - 0.2, "Fonte: Regulamento de Ocupação do Espaço Público · Art. 8.º e Anexo I · consultado a 18/10/2026", C.mdourado],
    [W("5", "mandato") - 0.2, "Mandato D2 · preparar, sem submeter", C.mdourado], [W("5", "corredor") - 0.2, "Corredor pedonal livre ≥ 2,00 m · Art. 8.º"], [W("5", "guarda") - 0.2, "Cofre Digital Pessoal · itens cifrados (AES-256-GCM)", C.mdourado],
    [W("5", "chave") - 0.5, "Mandato D3 · Chave Móvel Digital (Simulação)", C.mdourado], [W("5", "processo") - 0.2, "Processo OEP/2026/0001 criado pela Porta (Simulação)"]];
  scene({
    id: "demo", start: CUT.demo, end: CUT.consola + 0.8, fi: 0.8, fo: 0, z: 4, kb: 0,
    build(el) {
      cue("enviar", W("4", "telegram"), 0.5); cue("receber", W("4", "documentos") - 0.2, 0.6); cue("blip", W("4", "responde") - 0.1, 0.4);
      cue("pin", W("5", "delega") - 0.1, 0.5); cue("ouro", W("5", "cofre"), 0.5); cue("ouro", W("5", "cifrado"), 0.4); cue("sucesso", W("5", "processo"), 0.6);
      el.style.background = C.bast;
      el.innerHTML = `
        <div class="jan abs" style="left:${CAIXA[0]}px;top:${CAIXA[1]}px;width:${CAIXA[2]}px;height:${CAIXA[3]}px;border-radius:18px;overflow:hidden;background:#0B1424;box-shadow:0 30px 80px rgba(0,0,0,.45)"></div>
        <div class="vw abs" style="left:0;top:0;width:1920px;height:1080px;clip-path:inset(${CAIXA[1]}px ${1920 - CAIXA[0] - CAIXA[2]}px ${1080 - CAIXA[1] - CAIXA[3]}px ${CAIXA[0]}px round 18px)">
          <video class="cap abs" src="media/painel.mp4" muted preload="auto" playsinline style="left:0;top:0;width:1920px;height:1080px;transform-origin:0 0"></video>
        </div>
        <div class="sel abs" style="left:${CAIXA[0] + 24}px;top:${CAIXA[1] + 20}px;padding:9px 18px;border-radius:999px;background:rgba(15,27,45,.9);border:1px solid ${C.mdourado};color:${C.mdourado};font-size:20px;font-weight:800;letter-spacing:.08em">SESSÃO REAL DE 22/10/2026 · REPRODUZIDA NO PAINEL</div>
        ${PAINEL_L.map(([, txt, cor]) => legenda(txt, cor)).join("")}`;
      return { cap: q(el, ".cap"), leg: qa(el, ".leg"), sel: q(el, ".sel") };
    },
    update(t, c) {
      vid(c.cap, mapa(t, PAINEL_T));
      enquadrar(c.cap, regiao(t, PAINEL_R));
      c.leg.forEach((lg, i) => { const a = PAINEL_L[i][0], b = i < PAINEL_L.length - 1 ? PAINEL_L[i + 1][0] : CUT.consola + 0.5; const o = win(t, a, b - 0.1, 0.3, 0.25); S(lg, { y: L(16, 0, P(t, a, 0.35)), o }); });
      fade(c.sel, t, CUT.demo + 0.6);
    },
  });

  // ===================================================================
  // 6 · A Câmara decide (Consola da Câmara v2, captura real)
  // ===================================================================
  const DET = [880, 360, 1010, 720], DEC = [880, 560, 1010, 520];
  const CONS_T = [[CUT.consola, 0.6], [W("6", "recebe") - 0.2, 1.8], [W("6", "fontes"), 3.2], [W("6", "decisao") - 0.6, 6.0], [W("6", "decisao") - 0.58, 10.6], [W("6", "humana") + 0.4, 12.2], [W("6", "humana") + 1.1, 13.2], [W("6", "humana") + 1.12, 17.0], [CUT.s7 + 0.8, 19.6]];
  const CONS_R = [[CUT.consola, FULL], [W("6", "recebe") - 0.3, DET], [W("6", "decisao") - 0.7, DEC], [W("6", "humana") + 1.0, FULL]];
  const CONS_L = [[W("6", "recebe") - 0.2, "Consola Municipal · caso preparado, com acesso limitado"], [W("6", "decisao") - 0.6, "Decisão humana, com fundamentação registada"], [W("6", "humana") + 1.1, "A missão do munícipe atualiza-se: respondida"]];
  scene({
    id: "consola", start: CUT.consola, end: CUT.s7 + 0.8, fi: 0.7, fo: 0, z: 5, kb: 0,
    build(el) {
      cue("clique", W("6", "decisao") - 0.65, 0.8); cue("carimbo", W("6", "humana") + 0.4, 0.6);
      el.style.background = C.bast;
      el.innerHTML = `
        <div class="abs" style="left:${CAIXA[0]}px;top:${CAIXA[1]}px;width:${CAIXA[2]}px;height:${CAIXA[3]}px;border-radius:18px;background:${C.palco};box-shadow:0 30px 80px rgba(0,0,0,.45)"></div>
        <div class="abs" style="left:0;top:0;width:1920px;height:1080px;clip-path:inset(${CAIXA[1]}px ${1920 - CAIXA[0] - CAIXA[2]}px ${1080 - CAIXA[1] - CAIXA[3]}px ${CAIXA[0]}px round 18px)">
          <video class="cap abs" src="media/consola.mp4" muted preload="auto" playsinline style="left:0;top:0;width:1920px;height:1080px;transform-origin:0 0"></video>
        </div>
        ${CONS_L.map(([, txt]) => legenda(txt)).join("")}`;
      return { cap: q(el, ".cap"), leg: qa(el, ".leg") };
    },
    update(t, c) {
      vid(c.cap, mapa(t, CONS_T));
      enquadrar(c.cap, regiao(t, CONS_R));
      c.leg.forEach((lg, i) => { const a = CONS_L[i][0], b = i < CONS_L.length - 1 ? CONS_L[i + 1][0] : CUT.s7 + 0.5; S(lg, { y: L(16, 0, P(t, a, 0.35)), o: win(t, a, b - 0.1, 0.3, 0.25) }); });
    },
  });

  // ===================================================================
  // Agenda dos bastidores (7–9)
  // ===================================================================
  const AG = [["1", "Cofre Digital Pessoal"], ["2", "TypeSafe Jev"], ["3", "Porta Agêntica"]];
  scene({
    id: "agenda", start: CUT.s7 + 0.2, end: CUT.s10 + 0.6, fi: 0.4, fo: 0.5, z: 20, kb: 0,
    build(el) {
      [CUT.s7, CUT.s8, CUT.s9].forEach((tc) => cue("capitulo", tc + 0.3, 0.6));
      el.innerHTML = `<div class="abs" style="left:0;top:44px;width:1920px;display:flex;justify-content:center;gap:16px">
        ${AG.map(([n, t]) => `<div class="ag pil" style="font-size:24px;border:1.5px solid ${C.bast3};color:#56606E;background:rgba(15,27,45,.6)"><span class="num">${n}</span> ${t}</div>`).join("")}</div>
        <div class="pb abs t-eti" style="left:128px;top:54px;color:${C.mdourado}">Por baixo</div>`;
      return { ag: qa(el, ".ag") };
    },
    update(t, c) {
      let cur = 0; [CUT.s7, CUT.s8, CUT.s9].forEach((tc, i) => { if (t >= tc + 0.2) cur = i; });
      c.ag.forEach((a, i) => { a.style.borderColor = i === cur ? C.mverde : C.bast3; a.style.color = i === cur ? C.branco : i < cur ? C.btxt : "#56606E"; a.style.background = i === cur ? "rgba(123,204,144,.16)" : "rgba(15,27,45,.6)"; });
    },
  });

  // ===================================================================
  // 7 · Cofre Digital Pessoal
  // ===================================================================
  const CAM = [["Dados", "NIF · morada · o restaurante Casa Joaquim", "dados"], ["Documentos", "certidão permanente · seguro · planta", "documentos"], ["Intenções", "a esplanada · a casa no terreno do avô", "intencoes"]];
  scene({
    id: "s7", start: CUT.s7, end: CUT.s8 + 0.8, fi: 0.8, fo: 0, z: 6,
    build(el) {
      CAM.forEach((c) => cue("ouro", W("7", c[2]) - 0.1, 0.45));
      cue("fecho", W("7", "cifrados") - 0.1, 0.6); cue("porta_dados", W("7", "minimo") - 0.2, 0.7); cue("vibrar", W("7", "antecipar-se") - 0.4, 0.7); cue("receber", W("7", "antecipar-se") + 0.3, 0.6);
      el.style.background = C.bast;
      el.innerHTML = `
        <div class="tt abs" style="left:128px;top:150px;font-size:64px;font-weight:800;letter-spacing:-0.045em;color:${C.branco}">O Cofre dá memória ao Henriques.</div>
        <div class="cf abs" style="left:128px;top:300px;width:820px;height:600px;border-radius:24px;border:3px solid ${C.mdourado};background:rgba(224,182,93,.07);padding:34px">
          <div style="display:flex;align-items:center;gap:14px;color:${C.mdourado};font-size:28px;font-weight:800"><span style="width:34px;height:34px">${ICON.lock(C.mdourado)}</span>Cofre Digital Pessoal da Inês</div>
          ${CAM.map(([h, p]) => `<div class="cm" style="margin-top:22px;padding:22px 26px;border-radius:14px;background:${C.bast2};border:1px solid ${C.bast3}"><div style="font-size:30px;font-weight:800;color:${C.branco}">${h}</div><div style="font-size:24px;color:${C.btxt};margin-top:6px">${p}</div></div>`).join("")}
          <div class="ae mono" style="margin-top:22px;font-size:22px;color:${C.btxt}">AES-256-GCM · chave por pessoa · só sai o que ela autoriza</div>
        </div>
        <div class="pk cartao" style="left:1000px;top:330px;width:420px;padding:26px 30px;background:${C.douradoS};border-color:#E3D3A4">
          <div class="t-eti" style="font-size:18px;color:${C.dourado}">Pacote mínimo · PAC-0001</div>
          <div style="font-size:24px;margin-top:12px;line-height:1.6;color:${C.tinta}">✓ estabelecimento e morada<br>✓ 4 mesas · ~10 m²<br>✓ corredor livre de 2,10 m</div>
        </div>
        <div class="tl abs" style="left:1060px;top:600px;width:760px">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px"><img src="${IMG}henriques-avatar.svg" style="width:58px;height:58px;border-radius:50%;background:${C.palco}"><div style="font-size:26px;font-weight:800;color:${C.branco}">Henriques <span style="color:${C.btxt};font-weight:500">· sem a Inês perguntar</span></div></div>
          <div style="padding:24px 28px;border-radius:18px 18px 18px 6px;background:${C.branco};color:${C.tinta};font-size:28px;line-height:1.4;font-weight:500">Inês, o letreiro «Casa Joaquim» na fachada do restaurante não precisa de licença nem de comunicação à Câmara. A lei já o permite, desde que cumpra os critérios municipais.</div>
          <div style="font-size:21px;color:${C.btxt};margin-top:10px">📄 Fonte: Lei n.º 97/88, art. 1.º, n.º 3, al. b), na redação do DL 48/2011</div>
        </div>`;
      return { tt: q(el, ".tt"), cf: q(el, ".cf"), cm: qa(el, ".cm"), ae: q(el, ".ae"), pk: q(el, ".pk"), tl: q(el, ".tl") };
    },
    update(t, c) {
      fade(c.tt, t, CUT.s7 + 0.5, 0.6); fade(c.cf, t, W("7", "cofre") - 0.4, 0.6);
      c.cm.forEach((m, i) => pop(m, t, W("7", CAM[i][2]) - 0.2, 0.45));
      fade(c.ae, t, W("7", "cifrados") - 0.2);
      const pk = P(t, W("7", "minimo") - 0.4, 0.9, ease.io); S(c.pk, { x: L(-380, 0, pk), s: L(0.6, 1, pk), o: Math.min(1, pk * 2) });
      O(c.pk, Math.min(+c.pk.style.opacity || 0, 1 - P(t, W("7", "antecipar-se") - 0.8, 0.4, ease.lin) * 0.5));
      pop(c.tl, t, W("7", "antecipar-se") - 0.2, 0.6, 40);
    },
  });

  // ===================================================================
  // 8 · TypeSafe Jev
  // ===================================================================
  // a mesma árvore do Painel ao vivo: sete colunas de opções fechadas; o caminho acende coluna a coluna
  const ARVORE = [
    ["Mensagem", [["Mensagem da Inês", "«O que preciso para ter uma esplanada…»"]], 0, ""],
    ["Triagem", [["Triagem rápida", "Jev System One"]], 0, ""],
    ["Natureza", [["Acolhimento", "saudação, sem RAG nem MCP"], ["Salvaguarda", "recusa por segurança"], ["Fora de competência", "encaminha para quem trata"], ["Reserva técnica", "parecer é dos técnicos"], ["Sem fonte única", "abstenção formal"], ["Serviço canónico", "Esplanada no espaço público"], ["Conhecimento RAG D0", "portal e regulamentos"]], 5, "97%"],
    ["Mandato", [["D0 · Informativo", "sem dados privados"], ["D1 · Consulta", "estado de um processo"], ["D2 · Preparação", "instrução no Cofre"], ["D3 · Submissão", "com Chave Móvel Digital"], ["D4 · Liquidação", "pagamento de taxas"]], 0, "95%"],
    ["Porta · MCP", [["Ler o catálogo", "consultar_catalogo"], ["Verificar regras", "taxa, corredor de 2 m"], ["Preparar rascunho", "PIP ou ocupação"], ["Submeter ou pagar", "ato vinculativo"], ["Sem ferramenta", "nada a pedir à Porta"]], 0, "90%"],
    ["Consentimento", [["Não exige", "nada sai do Cofre"], ["Exige", "expresso: botão ou CMD"]], 0, "95%"],
    ["Resposta", [["Com fonte", "citações verificadas"]], 0, ""],
  ];
  const AX = (i) => 80 + i * 252, AW = 226, AH = 70, AY = (n, k) => 565 - (n * AH + (n - 1) * 10) / 2 + k * (AH + 10);
  scene({
    id: "s8", start: CUT.s8, end: CUT.s9 + 0.8, fi: 0.8, fo: 0, z: 7,
    build(el) {
      // instantes em que cada coluna escolhe
      const TE = [W("8", "cada") - 0.1, W("8", "codigo") - 0.2, W("8", "responde") - 0.1, W("8", "taxa") + 0.1, W("8", "taxa") + 0.6, W("8", "consentimento"), W("8", "redige") - 0.2];
      TE.forEach((t) => cue("blip", t - 0.05, 0.4));
      cue("shimmer", W("8", "arvore") - 0.1, 0.5); cue("ouro", W("8", "mandato") - 0.1, 0.45); cue("ouro", W("8", "pagar") - 0.1, 0.35);
      cue("negado", W("8", "trava") - 0.05, 0.7); shake(W("8", "trava"), 5, 0.35); cue("carimbo", W("8", "selado") - 0.1, 0.5);
      el.style.background = C.bast;
      const no = (i, k, [h, sub], n) => `<div class="no abs" data-c="${i}" data-k="${k}" style="left:${AX(i)}px;top:${AY(n, k)}px;width:${AW}px;height:${AH}px;border-radius:10px;background:#17283F;border:1.5px solid rgba(195,204,216,.18);padding:10px 14px;box-sizing:border-box">
          <div class="nt" style="font-size:19px;font-weight:700;letter-spacing:-0.015em;color:${C.btxt};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${k === ARVORE[i][2] && ARVORE[i][3] ? "padding-right:38px" : ""}">${h}</div>
          <div class="ns" style="font-size:15px;font-weight:500;color:#7D8798;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${sub}</div>
          ${k === ARVORE[i][2] && ARVORE[i][3] ? `<div class="np num" style="position:absolute;right:12px;top:10px;font-size:15px;font-weight:700;color:${C.mverde};opacity:0">${ARVORE[i][3]}</div>` : ""}</div>`;
      // ligações: ténues de cada escolha para todas as opções seguintes; a do caminho em verde
      const cy = (i, k) => AY(ARVORE[i][1].length, k) + AH / 2;
      const curva = (i, k0, k1) => { const x0 = AX(i) + AW, x1 = AX(i + 1), y0 = cy(i, k0), y1 = cy(i + 1, k1), m = (x0 + x1) / 2; return `M${x0} ${y0} C${m} ${y0} ${m} ${y1} ${x1} ${y1}`; };
      let ten = "", cam = "";
      for (let i = 0; i < 6; i++) {
        ARVORE[i + 1][1].forEach((_, k) => { ten += `<path class="tn" data-c="${i}" d="${curva(i, ARVORE[i][2], k)}" stroke="rgba(195,204,216,.14)" stroke-width="1.6" fill="none"/>`; });
        cam += `<path class="cm" pathLength="1" d="${curva(i, ARVORE[i][2], ARVORE[i + 1][2])}" stroke="${C.mverde}" stroke-width="3.5" fill="none" style="filter:drop-shadow(0 0 6px rgba(123,204,144,.6))"/>`;
      }
      el.innerHTML = `
        <div class="tt abs" style="left:80px;top:118px;font-size:58px;font-weight:800;letter-spacing:-0.045em;color:${C.branco}">Não é um chatbot. <span style="color:${C.mverde}">É uma árvore de decisão.</span></div>
        <div class="tg abs" style="left:1290px;top:132px;display:flex;gap:12px"><div class="pil" style="font-size:20px;border:1.5px solid rgba(123,204,144,.5);color:${C.mverde};background:rgba(123,204,144,.08)">TypeSafe Jev · System One</div><div class="pil num" style="font-size:20px;border:1.5px solid ${C.bast3};color:${C.btxt}">Decisão em <b style="color:${C.branco}">2 559 ms</b></div></div>
        ${ARVORE.map(([n], i) => `<div class="ct abs t-eti" data-c="${i}" style="left:${AX(i)}px;width:${AW}px;top:240px;text-align:center;font-size:17px;color:#7D8798">${n}</div>`).join("")}
        <div class="md abs" style="left:${AX(3) - 10}px;top:${AY(5, 0) - 12}px;width:${AW + 20}px;height:${5 * AH + 4 * 10 + 24}px;border-radius:14px;border:2px solid ${C.mdourado};background:rgba(224,182,93,.06)"></div>
        <div class="mdl abs" style="left:${AX(3) - 10}px;width:${AW + 20}px;top:${AY(5, 4) + AH + 22}px;text-align:center"><span class="pil" style="font-size:19px;background:rgba(224,182,93,.15);color:${C.mdourado}">D0 informar → D4 pagar</span></div>
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">${ten}${cam}</svg>
        ${ARVORE.map(([, ops], i) => ops.map((o, k) => no(i, k, o, ops.length)).join("")).join("")}
        ${ARVORE.map((_, i) => `<div class="sl abs mono" style="left:${AX(i)}px;width:${AW}px;top:856px;text-align:center;font-size:16px;color:${C.mdourado}">🔒 selado · SHA-256</div>`).join("")}
        <div class="nb abs" style="left:1520px;top:900px"><div class="pil" style="background:${C.terraS};color:#8E3A21;font-size:28px;border:2px solid ${C.terra}">17,00 € <span style="font-weight:600;font-size:21px">· sem fonte</span></div></div>
        <div class="bl abs" style="left:1520px;top:976px;font-size:23px;font-weight:800;color:#F0A58E">✕ o verificador trava</div>
        <div class="cp abs" style="left:80px;top:910px;width:1380px">
          <div style="font-size:28px;line-height:1.4;color:${C.btxt}"><b style="color:${C.branco}">Um chatbot comum:</b> o modelo entende, decide e escreve tudo de uma vez.</div>
          <div style="font-size:28px;line-height:1.4;color:${C.btxt};margin-top:6px"><b style="color:${C.mverde}">O Henriques:</b> cada passo é uma escolha fechada, definida em código. O modelo só redige.</div>
        </div>`;
      return { tt: q(el, ".tt"), tg: q(el, ".tg"), ct: qa(el, ".ct"), no: qa(el, ".no"), tn: qa(el, ".tn"), cm: qa(el, ".cm"), sl: qa(el, ".sl"), md: q(el, ".md"), mdl: q(el, ".mdl"), nb: q(el, ".nb"), bl: q(el, ".bl"), cp: q(el, ".cp"), TE };
    },
    update(t, c) {
      const TE = c.TE;
      fade(c.tt, t, CUT.s8 + 0.4, 0.6); fade(c.tg, t, W("8", "jev") + 0.2, 0.5);
      // as colunas aparecem com «percorre uma árvore de decisão»
      const ta = W("8", "percorre") - 0.2;
      c.ct.forEach((e, i) => O(e, P(t, i ? ta + i * 0.12 : TE[0] - 0.3, 0.4, ease.lin)));
      c.tn.forEach((e) => O(e, P(t, ta + (+e.dataset.c + 1) * 0.12 + 0.2, 0.5, ease.lin)));
      // flashes: abster-se e encaminhar acendem a terracota por um instante; pagar acende o D4 a dourado
      const flash = { "2-4": [W("8", "abstem") - 0.1, C.terra], "2-2": [W("8", "encaminha") - 0.1, C.terra], "3-4": [W("8", "pagar") - 0.1, C.mdourado], "3-0": [W("8", "informar") - 0.1, C.mdourado] };
      c.no.forEach((e) => {
        const i = +e.dataset.c, k = +e.dataset.k, ch = k === ARVORE[i][2];
        pop(e, t, i ? ta + i * 0.12 + k * 0.03 : TE[0] - 0.3, 0.4, 10);
        const esc = P(t, TE[i], 0.35, ease.lin);
        const f = flash[`${i}-${k}`], fl = f ? win(t, f[0], f[0] + 0.9, 0.12, 0.35) : 0;
        if (ch) {
          e.style.background = `rgba(123,204,144,${0.16 * esc})`; e.style.borderColor = esc > 0.5 ? C.mverde : fl > 0.05 ? f[1] : "rgba(195,204,216,.18)";
          e.querySelector(".nt").style.color = esc > 0.5 ? C.branco : C.btxt; e.querySelector(".ns").style.color = esc > 0.5 ? C.mverde : "#7D8798";
          const np = e.querySelector(".np"); if (np) np.style.opacity = esc;
        } else {
          e.style.borderColor = fl > 0.05 ? f[1] : "rgba(195,204,216,.18)";
          e.style.boxShadow = fl > 0.05 ? `0 0 ${18 * fl}px ${f[1]}` : "none";
          e.style.opacity = Math.min(+e.style.opacity || 0, L(1, 0.3, P(t, TE[i] + 0.2, 0.4, ease.lin) * (1 - fl)));
        }
      });
      c.cm.forEach((e, i) => D(e, P(t, TE[i + 1] - 0.35, 0.35, ease.io)));
      // o mandato: moldura dourada e a escala D0 → D4
      const tm = W("8", "mandato") - 0.2;
      O(c.md, win(t, tm, TE[3] + 1.6, 0.35, 0.6)); fade(c.mdl, t, W("8", "informar") - 0.2, 0.4, 10);
      c.sl.forEach((e, i) => O(e, P(t, W("8", "selado") - 0.5 + i * 0.1, 0.3, ease.lin)));
      fade(c.cp, t, W("8", "opcoes") - 0.3, 0.6);
      const tv = W("8", "trava") - 0.6;
      const nb = P(t, tv, 0.6, ease.out); S(c.nb, { x: L(220, 0, nb) + (t > tv + 0.6 && t < tv + 1.0 ? Math.sin(t * 60) * 6 : 0), o: nb * (1 - P(t, tv + 1.8, 0.5, ease.lin) * 0.6) });
      fade(c.bl, t, tv + 0.6, 0.3, 8);
    },
  });

  // ===================================================================
  // 9 · Porta Agêntica
  // ===================================================================
  const QUEM = ["Henriques", "Atendedor da Câmara", "Bancos e contabilistas", "Outros agentes de IA"];
  const NIV = [["I0", "Orientação", "conteúdo do site, sem integração"], ["I1", "Assistido", "técnico na Consola"], ["I2", "Leitura", "estado do processo"], ["I3", "Ação", "submeter, com mandato"]];
  scene({
    id: "s9", start: CUT.s9, end: CUT.s10 + 0.8, fi: 0.8, fo: 0, z: 8,
    build(el) {
      cue("porta_dados", W("9", "porta") - 0.1, 0.7);
      NIV.forEach((_, i) => cue("blip", W("9", "servico") - 0.4 + i * 0.25, 0.4));
      cue("shimmer", W("9", "agentes") - 0.2, 0.5); cue("blip", Math.max(W("9", "agentes") + 0.45, W("9", "servico") + 0.65), 0.4);
      el.style.background = C.bast;
      el.innerHTML = `
        <div class="tt abs" style="left:128px;top:150px;font-size:64px;font-weight:800;letter-spacing:-0.045em;color:${C.branco}">Invertemos a integração.</div>
        <div class="st abs" style="left:128px;top:240px;font-size:32px;color:${C.btxt}">A Câmara não abre os seus sistemas: implementa um contrato aberto, serviço a serviço.</div>
        <div class="abs" style="left:128px;top:380px;width:500px"><div class="t-eti" style="font-size:20px;color:#7D8798;margin-bottom:14px">Quem usa a Porta</div>
          ${QUEM.map((n, i) => `<div class="qm" style="margin-bottom:14px;padding:18px 24px;border-radius:12px;font-size:28px;font-weight:${i ? 600 : 800};${i ? `background:${C.bast2};color:${C.branco};border:1px solid ${C.bast3}` : `background:${C.verdeS};color:${C.verde}`}">${n}</div>`).join("")}</div>
        <div class="pt abs" style="left:720px;top:420px;width:440px;height:400px;border-radius:24px;background:${C.bast2};border:1px solid ${C.bast3};padding:40px;text-align:center">
          <svg width="120" height="120" viewBox="0 0 48 48">${porta()}</svg>
          <div style="font-size:42px;font-weight:800;color:${C.branco};margin-top:10px">Porta Agêntica</div>
          <div style="font-size:26px;line-height:1.4;color:${C.btxt};margin-top:10px">MCP e REST · contrato aberto · mandato e auditoria em cada chamada</div>
        </div>
        <div class="abs" style="left:1250px;top:380px;width:560px"><div class="t-eti" style="font-size:20px;color:#7D8798;margin-bottom:14px">Cada serviço da Câmara</div>
          ${NIV.map(([n, h, p], i) => `<div class="nv" style="margin-bottom:14px;padding:16px 22px;border-radius:12px;background:${C.bast2};border:1px solid ${C.bast3};font-size:26px;color:${C.branco}"><b class="num" style="color:${C.mverde}">${n}</b> · <b>${h}</b> <span style="color:${C.btxt};font-size:22px">· ${p}</span></div>`).join("")}</div>
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080"><path class="a1" pathLength="1" d="M640 620 H710" stroke="${C.mverde}" stroke-width="5"/><path class="a2" pathLength="1" d="M1170 620 H1240" stroke="${C.mverde}" stroke-width="5"/></svg>`;
      return { tt: q(el, ".tt"), st: q(el, ".st"), qm: qa(el, ".qm"), pt: q(el, ".pt"), nv: qa(el, ".nv"), a1: q(el, ".a1"), a2: q(el, ".a2") };
    },
    update(t, c) {
      fade(c.tt, t, CUT.s9 + 0.4, 0.6); fade(c.st, t, W("9", "camara") - 0.3, 0.6);
      pop(c.pt, t, W("9", "porta") - 0.3, 0.6);
      c.nv.forEach((n, i) => { pop(n, t, W("9", "servico") - 0.5 + i * 0.25, 0.4); n.style.borderColor = t > W("9", "servico") - 0.4 + i * 0.25 ? C.mverde : C.bast3; });
      c.qm.forEach((m, i) => pop(m, t, (i ? W("9", "agentes") - 0.4 + i * 0.15 : W("9", "porta") + 0.2), 0.4));
      // os conectores só depois de as duas colunas estarem completas
      const ta = Math.max(W("9", "agentes") + 0.45, W("9", "servico") + 0.65);
      D(c.a1, P(t, ta, 0.45, ease.io)); D(c.a2, P(t, ta + 0.3, 0.45, ease.io));
    },
  });

  // ===================================================================
  // 10 · Impacto
  // ===================================================================
  scene({
    id: "s10", start: CUT.s10, end: CUT.s10b + 0.8, fi: 0.8, fo: 0, z: 9,
    build(el) {
      cue("shimmer", W("10", "tres") - 0.2, 0.6); cue("pin", W("10", "sessenta") - 0.1, 0.5); cue("pin", W("10", "trabalho"), 0.5);
      el.style.background = C.bast;
      el.innerHTML = `
        <div class="e abs t-eti" style="left:128px;top:128px;color:${C.mdourado}">Impacto para Guimarães</div>
        <div class="tt abs" style="left:128px;top:178px;font-size:72px;font-weight:800;letter-spacing:-0.045em;color:${C.branco}">Capacidade libertada, não cortes.</div>
        <div class="big abs" style="left:128px;top:380px;width:900px">
          <div class="num" style="font-size:108px;font-weight:800;letter-spacing:-0.05em;color:${C.mverde};line-height:1"><span class="h1">0</span> a <span class="h2">0</span> h</div>
          <div style="font-size:32px;line-height:1.4;color:${C.btxt};margin-top:20px">libertadas na Câmara em 10 meses, se 1 em cada 5 contactos for resolvido pelo Henriques</div>
        </div>
        <div class="k1 cartao-b" style="left:1120px;top:380px;width:680px;padding:32px"><div class="num" style="font-size:52px;font-weight:800;color:${C.branco}">de 69 para 27 min</div><div style="font-size:28px;color:${C.btxt};margin-top:8px">de trabalho da Câmara por pedido de esplanada</div></div>
        <div class="k2 cartao-b" style="left:1120px;top:590px;width:680px;padding:32px"><div class="num" style="font-size:52px;font-weight:800;color:${C.branco}">de 2h50 para 15 min</div><div style="font-size:28px;color:${C.btxt};margin-top:8px">do tempo da Inês, entre pesquisa, chamadas e balcão</div></div>
        <div class="fo abs" style="left:128px;top:960px;width:1660px;font-size:24px;color:${C.btxt}">Volumes reais (CMG, fev.–nov. 2025). A taxa de resolução e os tempos por tarefa são hipóteses que o piloto vai medir.</div>`;
      return { e: q(el, ".e"), tt: q(el, ".tt"), big: q(el, ".big"), h1: q(el, ".h1"), h2: q(el, ".h2"), k1: q(el, ".k1"), k2: q(el, ".k2"), fo: q(el, ".fo") };
    },
    update(t, c) {
      fade(c.e, t, CUT.s10 + 0.4); fade(c.tt, t, CUT.s10 + 0.6, 0.6);
      const tb = W("10", "liberta") - 0.3;
      fade(c.big, t, tb, 0.5); conta(c.h1, t, tb + 0.1, 1.5, 2756); conta(c.h2, t, tb + 0.1, 1.5, 3345);
      pop(c.k1, t, W("10", "sessenta") - 0.4, 0.5); pop(c.k2, t, W("10", "trabalho") + 0.1, 0.5);
      fade(c.fo, t, W("10", "hipoteses") - 0.3, 0.6);
    },
  });

  // ===================================================================
  // 10b · Intenções do Concelho: dos Cofres (com consentimento, anónimas) para a Consola
  // ===================================================================
  const COFRES = [...Array(32)].map((_, i) => { const r = rng(1000 + i); return { x: 200 + (i % 8) * 220 + (r() - 0.5) * 60, y: 400 + Math.floor(i / 8) * 150 + (r() - 0.5) * 40, ok: r() > 0.28 }; });
  scene({
    id: "s10b", start: CUT.s10b, end: CUT.int + 0.9, fi: 0.8, fo: 0, z: 10,
    build(el) {
      cue("shimmer", W("10b", "cidade") - 0.2, 0.5); cue("ouro", W("10b", "consentimento") - 0.1, 0.45); cue("porta_dados", W("10b", "juntam-se") - 0.2, 0.6);
      el.style.background = C.bast;
      el.innerHTML = `
        <div class="e abs t-eti" style="left:128px;top:128px;color:${C.mdourado}">Intenções do Concelho</div>
        <div class="tt abs" style="left:128px;top:178px;font-size:72px;font-weight:800;letter-spacing:-0.045em;color:${C.branco}">O que a cidade quer fazer.</div>
        ${COFRES.map((c) => `<div class="cf abs" style="left:${c.x - 40}px;top:${c.y - 40}px;width:80px;height:80px;border-radius:16px;border:2px solid ${C.mdourado};background:rgba(224,182,93,.08);display:flex;align-items:center;justify-content:center"><div style="width:38px;height:38px">${ICON.lock(C.mdourado)}</div><div class="ok abs" style="right:-10px;top:-10px;width:30px;height:30px;opacity:0">${ICON.check(C.mverde)}</div></div>`).join("")}
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">${COFRES.map(() => `<circle class="pt" r="7" fill="${C.mdourado}" opacity="0"/>`).join("")}</svg>
        <div class="ag cartao-b" style="left:560px;top:490px;width:800px;padding:34px 40px;text-align:center;border-color:${C.mverde}">
          <div style="font-size:44px;font-weight:800;color:${C.branco};letter-spacing:-0.03em">Intenções do Concelho</div>
          <div style="font-size:26px;color:${C.btxt};margin-top:10px">agregadas e anónimas · só com consentimento</div>
          <div style="font-size:22px;color:#7D8798;margin-top:8px">grupos com menos de 10 pessoas não são publicados</div>
        </div>`;
      return { e: q(el, ".e"), tt: q(el, ".tt"), cf: qa(el, ".cf"), ok: qa(el, ".ok"), pt: qa(el, ".pt"), ag: q(el, ".ag") };
    },
    update(t, c) {
      fade(c.e, t, CUT.s10b + 0.4); fade(c.tt, t, W("10b", "ver") - 0.3, 0.6);
      const tc = W("10b", "consentimento") - 0.1, tj = W("10b", "juntam-se") - 0.3, tn = W("10b", "anonimas") - 0.2;
      c.cf.forEach((e, i) => {
        pop(e, t, CUT.s10b + 0.5 + i * 0.03, 0.4, 14);
        const ok = COFRES[i].ok;
        O(c.ok[i], ok ? P(t, tc + i * 0.025, 0.3, ease.lin) : 0);
        // sem consentimento: o Cofre fica de fora; com consentimento: esbate-se quando a intenção segue
        const dim = ok ? P(t, tn, 0.6, ease.lin) * 0.75 : P(t, tc + 0.4, 0.4, ease.lin) * 0.8;
        e.style.opacity = Math.min(+e.style.opacity || 0, 1 - dim);
        if (!ok) e.style.filter = `grayscale(${P(t, tc + 0.4, 0.4, ease.lin)})`;
      });
      c.pt.forEach((d, i) => {
        if (!COFRES[i].ok) return;
        const k = P(t, tj + i * 0.035, 1.0, ease.io);
        d.setAttribute("cx", L(COFRES[i].x, 960, k)); d.setAttribute("cy", L(COFRES[i].y, 610, k));
        d.setAttribute("opacity", k > 0 && k < 1 ? 1 : 0);
      });
      pop(c.ag, t, tj + 0.9, 0.6);
      const sai = P(t, CUT.int, 0.6, ease.io); S(c.ag, { s: L(1, 1.25, sai), o: (+c.ag.style.opacity || 0) * (1 - sai) });
    },
  });

  // captura real da vista Intenções do Concelho (Consola v2, dados sintéticos)
  const INT_FULL = [0, 0, 1920, 1080], INT_DEST = [400, 100, 1410, 560], INT_MAPA = [400, 60, 1420, 650], INT_MOT = [400, 230, 1420, 830];
  const INT_T = [[CUT.int, 0.2], [W("10b", "decisoes") - 0.3, 3.0], [W("10b", "politicas"), 5.6], [W("10b", "medir") + 0.2, 9.8], [CUT.s11 + 0.9, 14.3]];
  const INT_R = [[CUT.int, INT_FULL], [W("10b", "decisoes") - 0.5, INT_DEST], [W("10b", "politicas") - 0.5, INT_MAPA], [W("10b", "medir") - 0.1, INT_MOT]];
  const INT_L = [[CUT.int + 0.4, "Intenções do Concelho · agregadas, anónimas e só com consentimento · dados sintéticos", C.mdourado], [W("10b", "decisoes") - 0.4, "Decisões estratégicas: onde a procura cresce e o que as pessoas querem fazer"], [W("10b", "politicas") - 0.3, "Políticas públicas ao encontro do que os munícipes querem, freguesia a freguesia"], [W("10b", "medir") - 0.2, "Medir o efeito de cada medida no que as pessoas perguntam, desejam e planeiam"]];
  scene({
    id: "intencoes", start: CUT.int, end: CUT.s11 + 0.8, fi: 0.7, fo: 0, z: 11, kb: 0,
    build(el) {
      cue("clique", W("10b", "politicas") + 0.3, 0.5);
      el.style.background = C.bast;
      el.innerHTML = `
        <div class="abs" style="left:${CAIXA[0]}px;top:${CAIXA[1]}px;width:${CAIXA[2]}px;height:${CAIXA[3]}px;border-radius:18px;background:${C.palco};box-shadow:0 30px 80px rgba(0,0,0,.45)"></div>
        <div class="abs" style="left:0;top:0;width:1920px;height:1080px;clip-path:inset(${CAIXA[1]}px ${1920 - CAIXA[0] - CAIXA[2]}px ${1080 - CAIXA[1] - CAIXA[3]}px ${CAIXA[0]}px round 18px)">
          <video class="cap abs" src="media/intencoes.mp4" muted preload="auto" playsinline style="left:0;top:0;width:1920px;height:1080px;transform-origin:0 0"></video>
        </div>
        ${INT_L.map(([, txt, cor]) => legenda(txt, cor)).join("")}`;
      return { cap: q(el, ".cap"), leg: qa(el, ".leg") };
    },
    update(t, c) {
      vid(c.cap, mapa(t, INT_T));
      enquadrar(c.cap, regiao(t, INT_R));
      c.leg.forEach((lg, i) => { const a = INT_L[i][0], b = i < INT_L.length - 1 ? INT_L[i + 1][0] : CUT.s11 + 0.5; S(lg, { y: L(16, 0, P(t, a, 0.35)), o: win(t, a, b - 0.1, 0.3, 0.25) }); });
    },
  });

  // ===================================================================
  // 11 · Continuidade e fecho
  // ===================================================================
  const PASS = [["Passo 1", "Piloto de 5 meses", "Com a Câmara e as Juntas de Freguesia de Guimarães.", "piloto"], ["Passo 2", "Medir o que é hipótese", "Contactos evitados, tempos por tarefa e pedidos completos à primeira.", "juntas"], ["Passo 3", "Região do Ave", "O mesmo contrato aberto para os municípios da CIM do Ave.", "ave"]];
  scene({
    id: "s11", start: CUT.s11, end: TOTAL + 0.1, fi: 0.8, fo: 0, z: 12,
    build(el) {
      PASS.forEach((p) => cue("pin", W("11", p[3]) - 0.15, 0.5));
      cue("shimmer", W("11", "codigo") - 0.1, 0.4); cue("final", W("11", "diga") - 0.3, 0.9);
      rings({ t0: W("11", "diga") - 0.4, x: 960, y: 190, n: 3, r1: 520, life: 1.6, color: "123,204,144" });
      motes({ seed: 11, a: CUT.fecho + 0.5, b: TOTAL + 1, n: 40, color: "123,204,144", area: [0, 100, 1920, 900] });
      el.style.background = C.palco;
      el.innerHTML = `
        <div class="cont abs" style="left:0;top:0;width:1920px;height:1080px">
          <div class="e abs t-eti" style="left:128px;top:128px;color:${C.dourado}">Depois do hackathon</div>
          <div class="tt abs t-tit" style="left:128px;top:178px;width:1600px">Começa com um piloto, serviço a serviço.</div>
          ${PASS.map(([n, h, p], i) => `<div class="ps cartao" style="left:${128 + i * 568}px;top:400px;width:536px;height:330px;padding:40px;border-top:6px solid ${C.verde}"><div class="t-eti" style="color:${C.verde}">${n}</div><div style="font-size:42px;font-weight:800;letter-spacing:-0.03em;margin-top:14px">${h}</div><div style="font-size:28px;line-height:1.4;color:#4A5463;margin-top:14px">${p}</div></div>`).join("")}
          <div class="sl abs" style="left:128px;top:800px;display:flex;gap:20px"><div class="pil s1" style="background:${C.verdeS};color:${C.verde};font-size:30px">Código aberto · EUPL-1.2</div><div class="pil s2" style="background:${C.douradoS};color:${C.dourado};font-size:30px">O munícipe nunca paga</div></div>
        </div>
        <div class="fim abs" style="left:0;top:0;width:1920px;height:1080px;background:${C.bast}">
          <div class="lg abs" style="left:0;width:1920px;top:130px;height:120px;display:flex;justify-content:center"><img src="${IMG}delegate-logo-horizontal-escuro.svg" style="height:120px"></div>
          <div class="on abs" style="left:0;width:1920px;top:300px;text-align:center;font-size:34px;color:${C.btxt}">Onde nasceu Portugal, pode nascer uma nova relação entre as pessoas e a Câmara.</div>
          <div class="abs" style="left:0;width:1920px;top:410px;height:300px;display:flex;justify-content:center;align-items:center;gap:60px">
            <img class="av" src="${IMG}henriques-profile-700-sem-fundo.jpeg" style="width:300px;height:300px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 5px rgba(123,204,144,.45)">
            <div class="sg" style="text-align:left;font-size:90px;font-weight:800;line-height:1.08;letter-spacing:-0.045em;color:${C.branco}">Diga o que precisa.<br><span style="color:${C.mverde}">O Henriques trata do resto.</span></div>
          </div>
          <div class="rd abs" style="left:0;width:1920px;top:890px;display:flex;justify-content:center;align-items:center;gap:26px;font-size:26px;color:${C.btxt}"><span>Hack4Guimarães 2035</span><span>·</span><span>Desafio 3.4 · Falar com a Câmara sem burocracia</span></div>
        </div>`;
      return { e: q(el, ".e"), tt: q(el, ".tt"), ps: qa(el, ".ps"), s1: q(el, ".s1"), s2: q(el, ".s2"), fim: q(el, ".fim"), lg: q(el, ".fim .lg"), av: q(el, ".fim .av"), on: q(el, ".on"), sg: q(el, ".sg"), rd: q(el, ".rd") };
    },
    update(t, c) {
      fade(c.e, t, CUT.s11 + 0.4); fade(c.tt, t, CUT.s11 + 0.6, 0.6);
      c.ps.forEach((p, i) => pop(p, t, W("11", PASS[i][3]) - 0.3, 0.5));
      pop(c.s1, t, W("11", "codigo") - 0.2, 0.45); pop(c.s2, t, W("11", "nunca") - 0.3, 0.45);
      O(c.fim, P(t, CUT.fecho, 0.8, ease.io));
      const pl = P(t, CUT.fecho + 0.4, 0.9, ease.out); S(c.lg, { s: L(0.9, 1, pl), o: pl });
      pop(c.av, t, W("11", "diga") - 0.6, 0.6);
      fade(c.on, t, CUT.fecho + 0.5, 0.7);
      const sg = P(t, W("11", "diga") - 0.3, 0.8, ease.out); S(c.sg, { x: L(-24, 0, sg), o: sg });
      fade(c.rd, t, W("11", "resto") + 0.4, 0.7);
    },
  });
})();
