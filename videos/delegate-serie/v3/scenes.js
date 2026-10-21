/* VÍDEO 3 — Por trás da magia: conceitos e arquitetura */
(function () {
  const { CUT, cue, shake, burst, rings, motes, P, L, W, B, S, O, D, ease, clamp, rng, H, q, qa, ines, henriques, henriquesRingSVG, ICON, scene, win, onFrame, stage, TL } = F;
  const TOTAL = TL.total;
  const CAP = ["1", "2", "3", "4", "5", "6", "7"];
  CAP.forEach((k) => (CUT["c" + k] = B(k).start - 2.4));
  CUT.c8 = B("8").start - 1.0;
  CUT.fim = W("8", "delegate") - 0.5;
  window.VIG = [[0, 0.3], [TOTAL, 0.3]];
  window.BADGE = [-1, -1];
  const BG = "background:#0F1B33;background-image:linear-gradient(rgba(63,208,201,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(63,208,201,.07) 1px,transparent 1px);background-size:60px 60px";
  const box = (cls, x, y, w, h, title, sub = "", cor = "#3FD0C9", extra = "") => `<div class="${cls} dark-card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;padding:14px 20px;border-color:${cor}88;${extra}"><div class="label-sm" style="color:${cor};font-size:17px">${title}</div>${sub ? `<div style="font-size:19px;color:#B8C4DA;margin-top:4px;line-height:1.3">${sub}</div>` : ""}</div>`;
  const pill = (cls, txt, cor = "#3FD0C9", bg = "rgba(63,208,201,.12)") => `<div class="${cls}" style="display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;border:1.5px solid ${cor};background:${bg};color:#E7EEF8;font-size:20px;white-space:nowrap">${txt}</div>`;
  const pop = (el, t, a, d = 0.5, dy = 20) => { const p = P(t, a, d, ease.back); S(el, { y: L(dy, 0, Math.min(1, p)), s: L(0.85, 1, Math.min(1, p)), o: Math.min(1, p * 2) }); };

  // ===================================================================
  // CAMADA FIXA — agenda, cartões de capítulo e frase-chave
  // ===================================================================
  const TIT = ["Representante Digital Pessoal", "Cofre Digital Pessoal", "Agentes de IA orquestrados", "Autonomia responsável", "Arquitetura técnica", "Consola Municipal", "Gestão e otimização"];
  const CURTO = ["Representante", "Cofre", "Agentes", "Autonomia", "Arquitetura", "Consola", "Gestão"];
  const FRASE = ["Um representante por munícipe. Uma missão, qualquer canal.", "A memória do Henriques pertence à Inês.", "Especialistas que trabalham em equipa, com fontes oficiais.", "Rápido quando pode. Humano quando deve.", "Acesso mínimo. Tudo registado.", "Os técnicos recebem casos prontos a decidir.", "Cada missão ensina a Câmara a melhorar."];
  const FRASE_T = [W("1", "missoes"), W("2", "pertence"), W("3", "fontes"), W("4", "segundos"), W("5", "registo"), W("6", "decisao"), W("7", "simplificar")];
  scene({
    id: "ag", start: CUT.c1 - 0.2, end: CUT.c8 + 0.6, fi: 0, fo: 0.5, z: 20, kb: 0,
    build(el) {
      CAP.forEach((k) => cue("capitulo", CUT["c" + k] + 0.6, 0.8));
      el.innerHTML = `
        <div class="bar abs" style="left:0;top:0;width:1920px;height:64px;background:rgba(10,19,38,.85);border-bottom:1px solid #22355F;display:flex;align-items:center;justify-content:center;gap:10px">
          ${CURTO.map((c, i) => `<div class="chp" style="display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;font-size:18px;color:#5E7096"><b class="mono" style="font-size:16px">${i + 1}</b>${c}</div>`).join("")}
        </div>
        ${TIT.map((tt, i) => `<div class="cc abs" style="left:0;top:0;width:1920px;height:1080px;display:flex;align-items:center;justify-content:center;flex-direction:column;background:rgba(15,27,51,.92)">
            <div class="mono" style="font-size:30px;color:#3FD0C9;letter-spacing:.3em">CAPÍTULO ${i + 1}</div>
            <div class="serif" style="font-size:96px;font-weight:600;color:#fff;margin-top:10px">${tt}</div></div>`).join("")}
        ${FRASE.map((f) => `<div class="fr abs" style="left:0;width:1920px;top:986px;text-align:center"><span class="serif" style="display:inline-block;padding:12px 30px;border-radius:14px;background:rgba(10,19,38,.88);border:1px solid #22355F;font-size:36px;font-weight:600;color:#fff;font-style:italic">${f}</span></div>`).join("")}`;
      return { chp: qa(el, ".chp"), cc: qa(el, ".cc"), fr: qa(el, ".fr"), bar: q(el, ".bar") };
    },
    update(t, c) {
      O(c.bar, P(t, CUT.c1 + 0.8, 0.5, ease.lin));
      let cur = -1; CAP.forEach((k, i) => { if (t >= CUT["c" + k] + 0.4) cur = i; });
      c.chp.forEach((ch, i) => { ch.style.background = i === cur ? "rgba(63,208,201,.18)" : "transparent"; ch.style.color = i === cur ? "#7AF0E8" : i < cur ? "#B8C4DA" : "#5E7096"; ch.style.border = i === cur ? "1.5px solid #3FD0C9" : "1.5px solid transparent"; });
      c.cc.forEach((cc, i) => { const a = CUT["c" + CAP[i]]; const o = win(t, a, a + 2.3, 0.35, 0.45); O(cc, o); S(q(cc, ".serif"), { s: L(0.9, 1, P(t, a, 0.6)) }); });
      c.fr.forEach((f, i) => { const a = FRASE_T[i], b = i < 6 ? CUT["c" + CAP[i + 1]] : CUT.c8; const o = win(t, a, b, 0.5, 0.4); S(f, { y: L(16, 0, P(t, a, 0.5)), o }); });
    },
  });

  // ===================================================================
  // ABERTURA — as mensagens afundam abaixo da superfície
  // ===================================================================
  const MSGS = [["me", "Posso construir no terreno atrás do restaurante?"], ["af", "Para verificar, preciso de 📍 📄 🗺️"], ["af", "Boa notícia 🎉 a casa é possível."], ["me", "E posso ter uma esplanada à porta?"], ["af", "Basta uma mera comunicação prévia ✓"], ["af", "⏰ A época da esplanada termina em 30 dias."]];
  scene({
    id: "s0", start: 0, end: CUT.c1 + 0.6, fi: 0, fo: 0,
    build(el) {
      cue("mergulho", W("0", "vamos") - 0.2, 0.8); cue("revelacao", W("0", "delegate") - 0.6, 0.6);
      burst({ seed: 301, t0: W("0", "delegate") - 0.1, x: 960, y: 640, n: 80, speed: 600, life: 1.6, colors: ["#3FD0C9", "#7AF0E8", "#fff"], size: [2, 4] });
      el.innerHTML = `
        <div class="wd abs" style="width:1920px;height:2160px">
          <div class="abs" style="width:1920px;height:1080px;background:#F2EEE6"></div>
          <div class="abs" style="top:1080px;width:1920px;height:1080px;${BG}"></div>
          <div class="abs" style="top:1078px;width:1920px;height:4px;background:#3FD0C9;box-shadow:0 0 24px #3FD0C9"></div>
          <div class="msgs abs" style="left:560px;top:160px;width:800px;display:flex;flex-direction:column;gap:18px">${MSGS.map(([k, t]) => `<div class="bubble ${k} mm" style="font-size:28px;max-width:80%">${t}</div>`).join("")}</div>
          <div class="abs mono" style="left:40px;top:1030px;font-size:17px;letter-spacing:.12em;color:#8E8A80">O QUE A INÊS VÊ</div>
          <div class="abs mono" style="left:40px;top:1098px;font-size:17px;letter-spacing:.12em;color:#5E7096">O QUE ACONTECE POR BAIXO</div>
          <div class="t1 abs serif" style="left:0;width:1920px;top:1480px;text-align:center;font-size:120px;font-weight:600;color:#fff">Por trás da <span style="color:#3FD0C9;font-style:italic">magia</span></div>
          <div class="t2 abs" style="left:0;width:1920px;top:1660px;text-align:center;font-size:32px;color:#B8C4DA">Delegate · conceitos e arquitetura</div>
          <div class="ag abs" style="left:0;width:1920px;top:1760px;display:flex;justify-content:center;gap:14px">${CURTO.map((c, i) => `<div class="ai" style="padding:10px 18px;border-radius:12px;border:1.5px solid #3A4E7A;color:#B8C4DA;font-size:22px"><b class="mono" style="color:#3FD0C9">${i + 1}</b> ${c}</div>`).join("")}</div>
        </div>
        <div class="tx abs" style="left:0;width:1920px;top:700px;text-align:center;font-size:40px;color:#0F1B33"></div>`;
      return { wd: q(el, ".wd"), mm: qa(el, ".mm"), t1: q(el, ".t1"), t2: q(el, ".t2"), ai: qa(el, ".ai") };
    },
    update(t, c) {
      c.mm.forEach((m, i) => { const p = P(t, 0.4 + i * 0.35, 0.5, ease.back); m.style.transformOrigin = m.classList.contains("me") ? "100% 100%" : "0% 100%"; S(m, { s: L(0.8, 1, p), o: Math.min(1, p * 2) }); });
      const dive = P(t, W("0", "vamos") - 0.3, 1.8, ease.io);
      c.wd.style.transform = `translateY(${-L(0, 1080, dive)}px)`;
      pop(c.t1, t, W("0", "superficie") - 0.2, 0.8);
      O(c.t2, P(t, W("0", "superficie") + 0.6, 0.6, ease.lin));
      c.ai.forEach((a, i) => pop(a, t, W("0", "superficie") + 1.0 + i * 0.18, 0.45));
    },
  });

  // ===================================================================
  // 1 — REPRESENTANTE DIGITAL PESSOAL
  // ===================================================================
  const CANAIS = [["whatsapp", "💬", "WhatsApp"], ["portal", "🖥️", "Portal"], ["esse-eme-esse", "✉️", "SMS"], ["voz", "🎙️", "Voz"], ["balcao", "🏛️", "Balcão"]];
  scene({
    id: "s1", start: CUT.c1, end: CUT.c2 + 0.8, fi: 0.6, fo: 0, z: 2,
    build(el) {
      cue("shimmer", W("1", "henriques") - 0.2, 0.6); cue("enviar", W("1", "recebe") - 0.1, 0.5); cue("porta_dados", W("1", "transforma-os"), 0.7);
      CANAIS.forEach(([w]) => cue("blip", W("1", w), 0.45));
      rings({ t0: W("1", "henriques") - 0.1, x: 960, y: 290, n: 2, r1: 260, life: 1.2 });
      el.style.cssText += BG;
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <g class="ring">${henriques(92)}</g>
          ${CANAIS.map((_, i) => `<path class="cl" pathLength="1" d="M1480 ${470 + i * 92} C1360 ${470 + i * 92} 1300 690 1190 690" stroke="#3FD0C9" stroke-width="3" fill="none"/>`).join("")}
          <path class="tr" pathLength="1" d="M640 690 H760" stroke="#E8B44A" stroke-width="4" stroke-dasharray="1 1"/>
        </svg>
        <div class="nm abs serif" style="left:0;width:1920px;top:400px;text-align:center;font-size:44px;font-weight:600;color:#fff">Henriques <span style="color:#8FA3C4;font-size:30px;font-weight:400">· Representante Digital Pessoal</span></div>
        <div class="one abs" style="left:1100px;top:200px">${pill("", "1 por munícipe")}</div>
        <div class="met abs" style="left:0;width:1920px;top:470px;text-align:center">${pill("", "💼 funcionário particular para assuntos públicos", "#E8B44A", "rgba(232,180,74,.12)")}</div>
        <div class="fra abs bubble me" style="left:200px;top:640px;font-size:26px;max-width:440px">E posso ter uma esplanada à porta?</div>
        <div class="mis dark-card" style="left:740px;top:545px;width:470px;height:300px;padding:20px 24px;border-color:#E8B44A">
          <div class="label-sm" style="color:#E8B44A">Missão #2214</div>
          <div style="font-size:28px;font-weight:700;color:#fff;margin:4px 0 10px;white-space:nowrap">Esplanada · Casa Joaquim</div>
          ${[["objetivo", "ocupar o passeio com 6 mesas"], ["contexto", "restaurante no Cofre"], ["urgência", "antes do verão"], ["estado", "em curso"]].map(([k, v]) => `<div class="mr mono" style="font-size:18px;color:#B8C4DA;line-height:1.6"><span style="color:#5E7096;display:inline-block;width:110px">${k}</span>${v}</div>`).join("")}
        </div>
        ${CANAIS.map(([, ico, n], i) => `<div class="ch abs" style="left:1490px;top:${446 + i * 92}px">${pill("", `${ico} ${n}`)}</div>`).join("")}`;
      return { ring: q(el, ".ring"), nm: q(el, ".nm"), one: q(el, ".one"), met: q(el, ".met"), fra: q(el, ".fra"), mis: q(el, ".mis"), mr: qa(el, ".mr"), ch: qa(el, ".ch"), cl: qa(el, ".cl"), tr: q(el, ".tr") };
    },
    update(t, c) {
      const ra = P(t, W("1", "cada") - 0.3, 0.7, ease.back); S(c.ring, { x: 960, y: 290, s: ra * (1 + 0.03 * Math.sin(t * 3)), o: ra > 0 ? 1 : 0 });
      pop(c.nm, t, W("1", "representante") - 0.1); pop(c.one, t, W("1", "cada"), 0.5); pop(c.met, t, W("1", "funcionario") - 0.1);
      const tr = W("1", "recebe") - 0.2; pop(c.fra, t, tr);
      const tm = W("1", "transforma-os") - 0.1;
      D(c.tr, P(t, tm, 0.5, ease.io));
      const mp = P(t, tm + 0.3, 0.6, ease.back); S(c.mis, { s: L(0.6, 1, mp), o: Math.min(1, mp * 2) });
      c.mr.forEach((r, i) => O(r, P(t, tm + 0.7 + i * 0.35, 0.3, ease.lin)));
      c.ch.forEach((ch, i) => pop(ch, t, W("1", CANAIS[i][0]) - 0.15, 0.4));
      c.cl.forEach((l, i) => D(l, P(t, W("1", CANAIS[i][0]), 0.6, ease.io)));
    },
  });

  // ===================================================================
  // 2 — COFRE DIGITAL PESSOAL: a memória do Henriques
  // ===================================================================
  const VC = [860, 590];
  const hex = (r, cx = VC[0], cy = VC[1]) => [...Array(6).keys()].map((k) => { const a = ((-90 + 60 * k) * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const NOS = [["restaurante", "🍽️ Restaurante", -150, 1], ["terreno", "📍 Terreno", -90, 0], ["planta", "🗺️ Planta 1987", -30, 0], ["pedidos", "🏡 Pedidos anteriores", 30, 0], ["preferencias", "⚙️ Preferências", 150, 0], [null, "☀️ Esplanada · 6 mesas", 90, 1]];
  const NP = NOS.map(([, , a]) => [VC[0] + 215 * Math.cos((a * Math.PI) / 180), VC[1] + 200 * Math.sin((a * Math.PI) / 180)]);
  scene({
    id: "s2", start: CUT.c2, end: CUT.c3 + 0.8, fi: 0.6, fo: 0, z: 3,
    build(el) {
      cue("cofre", W("2", "cofre") - 0.1, 0.7);
      NOS.forEach(([w], i) => w && cue("ouro", W("2", w) - 0.1, 0.4));
      cue("fecho", W("2", "cifrado"), 0.6); cue("blip", W("2", "origem"), 0.4); cue("blip", W("2", "finalidade"), 0.4); cue("blip", W("2", "validade"), 0.4);
      cue("negado", W("2", "nunca") + 0.2, 0.5); cue("porta_dados", W("2", "pacote") - 0.1, 0.8);
      el.style.cssText += BG;
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <circle cx="${VC[0]}" cy="${VC[1]}" r="380" fill="url(#gGold)" class="gl"/>
          <path class="mem" pathLength="1" d="M300 270 C520 260 700 280 ${VC[0]} ${VC[1] - 300}" stroke="#E8B44A" stroke-width="4" fill="none" stroke-dasharray="1 1"/>
          <polygon class="hx" pathLength="1" points="${hex(310).map((p) => p.join(",")).join(" ")}" fill="rgba(232,180,74,.06)" stroke="#E8B44A" stroke-width="4"/>
          ${NP.map(([x, y]) => `<line class="ln" pathLength="1" x1="${VC[0]}" y1="${VC[1]}" x2="${x}" y2="${y}" stroke="#E8B44A" stroke-width="2" opacity=".5"/>`).join("")}
          <g class="af">${henriques(56)}</g>
          <g class="lk" transform="translate(${VC[0]} ${VC[1] - 310})"><g><rect x="-30" y="-6" width="60" height="46" rx="9" fill="#E8B44A"/><path d="M-18 -6 V-24 A18 18 0 0 1 18 -24 V-6" stroke="#E8B44A" stroke-width="8" fill="none"/></g></g>
          <path class="no" d="M1210 820 L1480 820" stroke="#E5484D" stroke-width="5" stroke-dasharray="12 10"/><path class="no2" d="M1320 790 L1380 850 M1380 790 L1320 850" stroke="#E5484D" stroke-width="8" stroke-linecap="round"/>
        </svg>
        <div class="mlab abs mono" style="left:430px;top:220px;font-size:20px;color:#E8B44A;letter-spacing:.1em">memória</div>
        <div class="cen abs" style="left:${VC[0]}px;top:${VC[1]}px"><div style="transform:translate(-50%,-50%);padding:14px 22px;border-radius:14px;background:#D9623B;color:#fff;font-family:Fraunces;font-size:30px;font-weight:650">Inês</div></div>
        ${NOS.map(([, n], i) => `<div class="nd abs" style="left:${NP[i][0]}px;top:${NP[i][1]}px"><div class="ni" style="padding:9px 14px;border-radius:12px;background:#16264A;border:2px solid rgba(232,180,74,.65);color:#F3E3BC;font-size:20px;white-space:nowrap">${n}</div><div class="nl mono" style="position:absolute;left:50%;top:26px;transform:translateX(-50%);font-size:14px;color:#E5484D;white-space:nowrap">🔒 não partilhado</div></div>`).join("")}
        <div class="key abs mono" style="left:${VC[0] + 50}px;top:${VC[1] - 360}px;padding:6px 14px;border-radius:999px;background:#E8B44A;color:#0F1B33;font-size:18px;font-weight:800">🔑 pertence à Inês · cifrado</div>
        <div class="fic dark-card" style="left:1300px;top:150px;width:540px;height:400px;padding:20px 24px;border-color:#E8B44A">
          <div class="label-sm" style="color:#E8B44A">Ficha de um item</div>
          <div style="font-size:26px;font-weight:700;color:#fff;margin:6px 0 10px">🗺️ Planta do terreno (1987)</div>
          ${[["origem", "enviada pela Inês · 14/10"], ["finalidade", "pedidos de urbanismo"], ["validade", "até revogar"], ["permissão", "usar com autorização"]].map(([k, v]) => `<div class="fr2 mono" style="font-size:19px;color:#B8C4DA;line-height:1.7"><span style="color:#5E7096;display:inline-block;width:130px">${k}</span>${v}</div>`).join("")}
          <div style="display:flex;gap:10px;margin-top:16px">${["ver", "corrigir", "apagar"].map((b) => `<div class="fb" style="flex:1;padding:10px;border-radius:10px;text-align:center;border:1.5px solid #3A4E7A;color:#B8C4DA;font-size:19px;font-weight:650">${b}</div>`).join("")}</div>
        </div>
        <div class="cam abs" style="left:1500px;top:770px;width:300px;padding:16px;border-radius:14px;border:1.5px solid #3A4E7A;color:#8FA3C4;text-align:center;font-size:22px">🏛️ Câmara</div>
        <div class="pk dark-card" style="left:0;top:0;width:340px;padding:16px 20px;border-color:#E8B44A">
          <div class="label-sm" style="color:#E8B44A;font-size:15px">Pacote mínimo · missão #2214</div>
          ${["🍽️ Restaurante", "🔢 6 mesas · abr–out", "📷 Foto do passeio"].map((x) => `<div style="font-size:19px;color:#F3E3BC;margin-top:6px">✓ ${x}</div>`).join("")}
          <div class="mono" style="font-size:15px;color:#8FA3C4;margin-top:8px">prazo: 30 dias · finalidade: esplanada</div>
        </div>`;
      return { af: q(el, ".af"), mem: q(el, ".mem"), mlab: q(el, ".mlab"), hx: q(el, ".hx"), ln: qa(el, ".ln"), cen: q(el, ".cen > div"), nd: qa(el, ".nd"), lk: q(el, ".lk > g"), key: q(el, ".key"), fic: q(el, ".fic"), fr2: qa(el, ".fr2"), fb: qa(el, ".fb"), cam: q(el, ".cam"), no: q(el, ".no"), no2: q(el, ".no2"), pk: q(el, ".pk"), gl: q(el, ".gl") };
    },
    update(t, c) {
      const t0 = B("2").start;
      S(c.af, { x: 300, y: 270, s: P(t, t0 - 0.2, 0.6, ease.back) });
      D(c.mem, P(t, W("2", "memoria", 2) - 0.6, 0.8, ease.io)); O(c.mlab, P(t, W("2", "memoria", 2) - 0.2, 0.4, ease.lin));
      D(c.hx, P(t, W("2", "cofre") - 0.2, 1.0, ease.io)); O(c.gl, P(t, W("2", "cofre"), 1, ease.lin) * (0.7 + 0.3 * Math.sin(t * 2)));
      c.cen.style.transform = `translate(-50%,-50%) scale(${P(t, W("2", "cofre") + 0.3, 0.5, ease.back)})`;
      const tn = (i) => (NOS[i][0] ? W("2", NOS[i][0]) - 0.15 : W("2", "preferencias") + 0.5);
      c.ln.forEach((l, i) => D(l, P(t, tn(i), 0.5, ease.io)));
      const share = P(t, W("2", "pacote") - 0.2, 0.4, ease.lin);
      c.nd.forEach((n, i) => {
        const ni = q(n, ".ni"), p = P(t, tn(i), 0.45, ease.back);
        ni.style.transform = `translate(-50%,-50%) scale(${p})`; O(ni, Math.min(1, p * 2) * (NOS[i][3] ? 1 : L(1, 0.45, share)));
        O(q(n, ".nl"), NOS[i][3] ? 0 : share);
        if (NOS[i][3]) ni.style.borderColor = share > 0.5 ? "#E8B44A" : "rgba(232,180,74,.65)";
      });
      const lk = P(t, W("2", "cifrado") - 0.2, 0.5, ease.back); S(c.lk, { s: lk, o: lk > 0 ? 1 : 0 });
      pop(c.key, t, W("2", "pertence") - 0.1, 0.45);
      const fp = P(t, W("2", "cada") - 0.3, 0.6, ease.out); S(c.fic, { x: L(40, 0, fp), o: fp * (1 - P(t, W("2", "nunca") - 0.3, 0.4, ease.lin) * 0.6) });
      c.fr2.forEach((r, i) => O(r, P(t, W("2", ["origem", "finalidade", "validade", "quiser"][i]) - 0.1, 0.3, ease.lin)));
      c.fb.forEach((b, i) => { const ta = W("2", ["ver", "corrigir", "apagar"][i]); const on = win(t, ta - 0.1, ta + 0.6, 0.1, 0.3); b.style.background = `rgba(63,208,201,${0.3 * on})`; b.style.color = on > 0.5 ? "#fff" : "#B8C4DA"; });
      const tc = W("2", "nunca") - 0.2;
      O(c.cam, P(t, tc, 0.4, ease.lin)); O(c.no, P(t, tc + 0.2, 0.3, ease.lin)); const nx = P(t, tc + 0.5, 0.35, ease.back); S(c.no2, { s: nx, o: nx > 0 ? 1 : 0 });
      const pp = P(t, W("2", "pacote") - 0.1, 1.0, ease.io);
      S(c.pk, { x: L(VC[0] - 170, 1480, pp), y: L(VC[1] - 60, 560, pp), s: L(0.5, 1, Math.min(1, pp * 2)), o: pp > 0 ? 1 : 0 });
    },
  });

  // ===================================================================
  // 3 — AGENTES DE IA ORQUESTRADOS
  // ===================================================================
  const AG = [["entende", "Entendimento de missão", "🧭"], ["escolhe", "Guardião de contexto", "🔐"], ["encontra", "Navegador de regras", "📚"], ["prepara", "Construtor de jornada", "🧩"], ["supervisor", "Supervisor de risco", "🛡️"]];
  const AX = [230, 600, 960, 1320, 1690];
  scene({
    id: "s3", start: CUT.c3, end: CUT.c4 + 0.8, fi: 0.6, fo: 0, z: 4,
    build(el) {
      cue("porta_dados", W("3", "orquestrador") - 0.1, 0.7);
      AG.forEach(([w]) => cue("blip", W("3", w) - 0.1, 0.6));
      cue("shimmer", W("3", "supervisor") - 0.1, 0.5);
      el.style.cssText += BG;
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <path class="mi" pathLength="1" d="M520 300 H760" stroke="#E8B44A" stroke-width="4" fill="none"/>
          ${AX.map((x, i) => `<path class="al" id="al${i}" pathLength="1" d="M960 360 C960 430 ${x} 410 ${x} 520" stroke="#3FD0C9" stroke-width="3" fill="none"/>`).join("")}
          <path class="sv" pathLength="1" d="M${AX[4]} 560 C${AX[4]} 470 ${AX[0] + 90} 470 ${AX[0] + 90} 520" stroke="#E8B44A" stroke-width="3" fill="none" stroke-dasharray="1 1"/>
          <g class="pls">${AX.map(() => `<circle r="9" fill="#7AF0E8"/>`).join("")}</g>
        </svg>
        <div class="mis dark-card" style="left:120px;top:240px;width:400px;height:120px;padding:16px 22px;border-color:#E8B44A"><div class="label-sm" style="color:#E8B44A">Missão #2214</div><div style="font-size:28px;font-weight:700;color:#fff">Esplanada · Casa Joaquim</div></div>
        ${box("orq", 760, 250, 400, 110, "Orquestrador", "divide a missão em tarefas")}
        ${AG.map(([, n, ico], i) => `<div class="ag dark-card" style="left:${AX[i] - 165}px;top:520px;width:330px;height:110px;padding:16px 20px;display:flex;align-items:center;gap:14px${i === 4 ? ";border-color:#E8B44A" : ""}"><div style="font-size:40px">${ico}</div><div style="font-size:23px;font-weight:700;color:#fff;line-height:1.2">${n}</div></div>`).join("")}
        <div class="pp abs" style="left:${AX[0] - 165}px;top:660px;width:330px">${pill("", "“esplanada · 6 mesas · verão”")}</div>
        <div class="pp abs" style="left:${AX[1] - 165}px;top:660px;width:330px">${pill("", "🔐 3 itens do Cofre", "#E8B44A", "rgba(232,180,74,.12)")}</div>
        <div class="pp card" style="left:${AX[2] - 175}px;top:660px;width:350px;padding:16px 18px;background:#F2EEE6;color:#0F1B33">
          <div style="font-weight:800;font-size:18px">Regulamento de Ocupação do Espaço Público</div>
          <div style="font-size:16px;margin-top:6px"><b style="background:rgba(91,191,122,.3);padding:1px 4px">art. 8.º</b> mera comunicação prévia</div>
          <div style="font-size:16px"><b style="background:rgba(91,191,122,.3);padding:1px 4px">Anexo I</b> corredor de peões ≥ 2 m</div>
          <div class="mono" style="font-size:14px;color:#5C6578;margin-top:6px">fonte oficial · versão em vigor ✓</div></div>
        <div class="pp card" style="left:${AX[3] - 165}px;top:660px;width:330px;padding:16px 18px;background:#F2EEE6;color:#0F1B33;font-size:17px;line-height:1.6">
          <div style="font-weight:800">Jornada</div>✓ dados do restaurante<br>✓ esboço com corredor<br>✓ rascunho da comunicação<br>→ confirmar com a Inês</div>
        <div class="pp abs" style="left:${AX[4] - 165}px;top:660px;width:330px;color:#E8B44A;font-size:19px;line-height:1.5">sem fonte válida ou com exceção?<br><b style="color:#fff">→ segue para uma pessoa</b></div>`;
      return { mi: q(el, ".mi"), mis: q(el, ".mis"), orq: q(el, ".orq"), al: qa(el, ".al"), ag: qa(el, ".ag"), pp: qa(el, ".pp"), sv: q(el, ".sv"), pl: qa(el, ".pls circle") };
    },
    update(t, c) {
      pop(c.mis, t, W("3", "esplanada") - 0.3, 0.5);
      D(c.mi, P(t, W("3", "orquestrador") - 0.4, 0.5, ease.io));
      pop(c.orq, t, W("3", "orquestrador") - 0.2, 0.5);
      const ta = W("3", "agentes", 2) - 0.2;
      c.al.forEach((l, i) => D(l, P(t, ta + i * 0.15, 0.6, ease.io)));
      c.ag.forEach((a, i) => {
        pop(a, t, ta + 0.2 + i * 0.15, 0.5);
        const tw = W("3", AG[i][0]) - 0.15;
        const lit = i === 4 ? P(t, tw, 0.3, ease.lin) : win(t, tw, tw + 2.6, 0.2, 0.5);
        a.style.boxShadow = lit > 0 ? `0 0 ${46 * lit}px ${i === 4 ? "rgba(232,180,74," : "rgba(63,208,201,"}${0.55 * lit})` : "none";
        a.style.background = lit > 0.3 ? "#1B3A5E" : "rgba(22,38,74,.92)";
      });
      c.pp.forEach((p, i) => pop(p, t, W("3", AG[i][0]) + 0.1, 0.5));
      D(c.sv, P(t, W("3", "verifica") - 0.2, 1.0, ease.io));
      c.pl.forEach((d, i) => { const tw = W("3", AG[i][0]) - 0.6; const p = (t - tw) / 0.5; if (p < 0 || p > 1) { d.style.opacity = 0; return; } const path = c.al[i], pt = path.getPointAtLength(path.getTotalLength() * ease.io(p)); d.setAttribute("cx", pt.x); d.setAttribute("cy", pt.y); d.style.opacity = 1; });
    },
  });

  // ===================================================================
  // 4 — AUTONOMIA RESPONSÁVEL
  // ===================================================================
  const FAIXAS = [["#5BBF7A", "Responde já", "agentes, com fonte e regras", 200], ["#E8B44A", "Confirma o munícipe", "Chave Móvel Digital", 470], ["#E5484D", "Decide uma pessoa", "técnico competente da Câmara", 690]];
  scene({
    id: "s4", start: CUT.c4, end: CUT.c5 + 0.8, fi: 0.6, fo: 0, z: 5,
    build(el) {
      cue("enviar", W("4", "documentos") - 0.2, 0.4); cue("enviar", W("4", "fase") - 0.2, 0.4); cue("enviar", W("4", "termina") - 0.2, 0.4);
      cue("cronometro", W("4", "segundos") - 0.8, 0.8); cue("receber", W("4", "segundos") + 0.3, 0.6);
      cue("pin", W("4", "submeter") - 0.1, 0.6); cue("carimbo", W("4", "humano") - 0.3, 0.6);
      el.style.cssText += BG;
      el.innerHTML = `
        ${FAIXAS.map(([cor, n, s, y]) => `<div class="fx abs" style="left:100px;top:${y}px;width:1720px;height:${y === 200 ? 240 : 190}px;border-radius:20px;border:2px solid ${cor};background:${cor}14">
            <div style="position:absolute;left:28px;top:24px;display:flex;align-items:center;gap:14px"><div style="width:26px;height:26px;border-radius:50%;background:${cor};box-shadow:0 0 18px ${cor}"></div><div class="serif" style="font-size:40px;font-weight:600;color:#fff">${n}</div></div>
            <div style="position:absolute;left:68px;top:80px;font-size:21px;color:#B8C4DA">${s}</div></div>`).join("")}
        <div class="q abs" style="left:520px;top:226px;display:flex;flex-direction:column;gap:10px">
          ${[["documentos", "Que documentos são precisos?"], ["fase", "Em que fase está o meu pedido?"], ["termina", "Quando termina o prazo?"]].map(([, x]) => `<div class="qq bubble me" style="font-size:21px;max-width:none;padding:9px 16px">${x}</div>`).join("")}
        </div>
        <div class="ans abs bubble af" style="left:960px;top:248px;width:560px;max-width:none;font-size:21px">O seu pedido está <b>em apreciação</b> desde 3/10. Próximo passo: parecer técnico.<div><span class="chip"><i>${ICON.clip()}</i>Fonte: Urbanismo Digital</span></div></div>
        <div class="sw abs" style="left:1560px;top:250px;width:200px;text-align:center"><div class="swn serif" style="font-size:80px;font-weight:700;color:#5BBF7A">0 s</div><div class="mono" style="font-size:16px;color:#B8C4DA">tempo de resposta</div></div>
        <div class="am abs" style="left:520px;top:540px;display:flex;gap:16px;align-items:center">${pill("", "📤 Submeter um pedido", "#E8B44A", "rgba(232,180,74,.12)")}<span style="color:#B8C4DA;font-size:24px">→</span>${pill("", "🔑 confirma com a CMD", "#E8B44A", "rgba(232,180,74,.12)")}</div>
        <div class="rd abs" style="left:520px;top:760px;display:flex;gap:16px">${["Licenciar", "Deferir", "Avaliar exceções"].map((x) => pill("rr", "⚖️ " + x, "#E5484D", "rgba(229,72,77,.12)")).join("")}</div>
        <div class="hm abs" style="left:1460px;top:720px;width:330px;text-align:center"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="40" r="22" fill="#C98E6A"/><path d="M38 34 Q36 14 60 14 Q84 14 82 34 Q70 26 60 28 Q48 28 38 34Z" fill="#2E2A2A"/><path d="M24 116 Q24 72 60 70 Q96 72 96 116Z" fill="#5B6B8C"/></svg><div style="font-size:20px;color:#fff;font-weight:650">decisão humana</div></div>
        <div class="tok abs" style="left:0;top:0">${pill("", "☀️ Missão · Esplanada", "#7AF0E8", "#0F1B33")}</div>`;
      return { fx: qa(el, ".fx"), qq: qa(el, ".qq"), ans: q(el, ".ans"), sw: q(el, ".sw"), swn: q(el, ".swn"), am: q(el, ".am"), rr: qa(el, ".rr"), hm: q(el, ".hm"), tok: q(el, ".tok") };
    },
    update(t, c) {
      c.fx.forEach((f, i) => pop(f, t, [W("4", "nem") - 0.3, W("4", "submeter") - 0.6, W("4", "decidir") - 0.5][i], 0.5));
      c.qq.forEach((qq, i) => pop(qq, t, W("4", ["documentos", "fase", "termina"][i]) - 0.2, 0.45));
      const ts = W("4", "segundos");
      const sw = P(t, ts - 0.8, 1.1, ease.lin); O(c.sw, P(t, ts - 0.9, 0.3, ease.lin)); c.swn.textContent = `${Math.min(3, Math.floor(sw * 3.99))} s`;
      pop(c.ans, t, ts + 0.3, 0.5);
      pop(c.am, t, W("4", "submeter") - 0.1, 0.5);
      c.rr.forEach((r, i) => pop(r, t, W("4", ["licenciar", "licenciar", "avaliar"][i]) + (i === 1 ? 0.4 : -0.1), 0.45));
      pop(c.hm, t, W("4", "humano") - 0.4, 0.5);
      // a missão da esplanada atravessa as três faixas
      const k1 = P(t, W("4", "submeter") - 0.5, 0.9, ease.io), k2 = P(t, W("4", "decidir") - 0.4, 0.9, ease.io);
      const y = L(L(390, 620, k1), 840, k2);
      S(c.tok, { x: 1460, y: y - 30, o: P(t, W("4", "segundos") + 1.2, 0.4, ease.lin) });
    },
  });

  // ===================================================================
  // 5 — ARQUITETURA TÉCNICA
  // ===================================================================
  scene({
    id: "s5", start: CUT.c5, end: CUT.c6 + 0.8, fi: 0.6, fo: 0, z: 6,
    build(el) {
      ["motor", "agentes", "capacidades", "sistemas", "trilho"].forEach((w) => cue("porta_dados", W("5", w) - 0.1, 0.55));
      cue("negado", W("5", "geral") + 0.1, 0.7); shake(W("5", "geral") + 0.2, 4, 0.35);
      ["finalidade", "prazo", "registo"].forEach((w) => cue("blip", W("5", w), 0.45));
      el.style.cssText += BG;
      el.innerHTML = `
        <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <g stroke="#3FD0C9" stroke-width="3" fill="none" opacity=".8">
            <path class="k k0" pathLength="1" d="M290 450 H372"/><path class="k k1" pathLength="1" d="M430 456 V560"/>
            <path class="k k2" pathLength="1" d="M490 400 H600"/><path class="k k3" pathLength="1" d="M920 400 H1000"/><path class="k k4" pathLength="1" d="M1160 280 V340"/>
            <path class="k k5" pathLength="1" d="M1320 400 H1400"/><path class="k k6" pathLength="1" d="M1610 470 V600"/><path class="k k7" pathLength="1" d="M1610 660 V720"/>
            <path class="k k8" pathLength="1" d="M1320 380 C1360 330 1380 230 1440 220"/>
          </g>
          <path class="bad" d="M1760 470 C1840 560 1860 700 1800 760" stroke="#E5484D" stroke-width="3" fill="none" stroke-dasharray="10 8"/>
          <g class="badx" transform="translate(1830 610)"><g><circle r="22" fill="#E5484D"/><path d="M-9 -9 L9 9 M9 -9 L-9 9" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g></g>
          <g class="af">${henriques(46)}</g>
          <polygon class="cf" points="${hex(52, 430, 620).map((p) => p.join(",")).join(" ")}" fill="rgba(232,180,74,.12)" stroke="#E8B44A" stroke-width="3"/>
        </svg>
        <div class="b cn abs" style="left:90px;top:300px;display:flex;flex-direction:column;gap:10px">${["💬 WhatsApp", "🖥️ Portal", "✉️ SMS", "🎙️ Voz", "🏛️ Balcão"].map((x) => pill("", x)).join("")}<div class="label-sm" style="color:#5E7096;font-size:14px;margin-top:4px">canais</div></div>
        <div class="b cfl abs mono" style="left:370px;top:690px;width:120px;text-align:center;font-size:16px;color:#E8B44A">Cofre</div>
        ${box("b mo", 600, 340, 320, 120, "Motor de política", "consentimento · risco · autoridade")}
        ${box("b kn", 1000, 160, 320, 120, "Conhecimento público", "versionado · com fonte", "#E8B44A")}
        ${box("b or", 1000, 340, 320, 120, "Orquestrador", "missões e tarefas")}
        ${box("b eq", 1440, 160, 360, 120, "Equipa municipal", "validação · exceção · decisão", "#5BBF7A")}
        <div class="b ags dark-card" style="left:1400px;top:340px;width:420px;height:130px;padding:14px 18px"><div class="label-sm" style="color:#3FD0C9;font-size:17px">Agentes especializados</div><div style="display:flex;gap:8px;margin-top:10px;font-size:34px">🧭 🔐 📚 🧩 🛡️</div></div>
        <div class="b in abs" style="left:600px;top:600px;width:1220px;height:60px;border-radius:14px;border:1.5px dashed #3FD0C9;background:#16264A;display:flex;align-items:center;gap:14px;padding:0 20px">
          <div class="label-sm" style="color:#3FD0C9;font-size:16px;margin-right:10px">Camada de integração · capacidades mínimas</div>
          ${["consultar_regulamento()", "calcular_taxa()", "criar_rascunho()"].map((x) => `<div class="mono" style="padding:4px 10px;border-radius:8px;border:1.5px solid #3FD0C9;color:#BFEDEA;font-size:16px">${x}</div>`).join("")}
        </div>
        <div class="b gt abs" style="left:1100px;top:546px;display:flex;gap:10px">${["finalidade", "prazo", "registo"].map((x) => pill("g", x + " ✓", "#5BBF7A", "rgba(91,191,122,.14)")).join("")}</div>
        <div class="b sy abs" style="left:600px;top:720px;width:1220px;display:flex;gap:14px">${["Urbanismo Digital", "SIG · plantas", "Taxas e pagamentos", "Espaço público"].map((x) => `<div style="flex:1;padding:16px;border-radius:14px;background:#F2EEE6;color:#0F1B33;font-weight:700;font-size:21px;text-align:center">${x}</div>`).join("")}</div>
        <div class="b syl abs label-sm" style="left:600px;top:800px;color:#5E7096;font-size:14px">sistemas municipais · fonte de cada ato</div>
        <div class="b au abs" style="left:90px;top:860px;width:1730px;height:64px;border-radius:14px;background:#0A1326;border:1px solid #3A4E7A;display:flex;align-items:center;gap:20px;padding:0 22px">
          <div class="label-sm" style="color:#E8B44A;font-size:16px">Auditoria e prova</div><div class="mono" style="font-size:17px;color:#9FB3D6">14:02:11 calcular_taxa() · missão #2214 · finalidade ✓ autorização ✓ · registado</div></div>
        <div class="bdb abs mono" style="left:1700px;top:770px;font-size:16px;color:#FF8A8D;text-align:right;width:200px">acesso geral<br>à base de dados</div>`;
      return { b: qa(el, ".b"), k: qa(el, ".k"), af: q(el, ".af"), cf: q(el, ".cf"), g: qa(el, ".g"), bad: q(el, ".bad"), badx: q(el, ".badx > g"), bdb: q(el, ".bdb") };
    },
    update(t, c) {
      const t5 = B("5").start;
      const TB = { cn: t5 - 0.6, cfl: t5 - 0.2, mo: W("5", "motor") - 0.2, kn: W("5", "risco"), or: W("5", "autoridade"), eq: W("5", "sistemas"), ags: W("5", "agentes") - 0.2, in: W("5", "capacidades") - 0.2, gt: W("5", "finalidade") - 0.3, sy: W("5", "sistemas") - 0.2, syl: W("5", "fonte"), au: W("5", "trilho") - 0.3 };
      c.b.forEach((b) => { const k = Object.keys(TB).find((key) => b.classList.contains(key)); if (k) pop(b, t, TB[k], 0.5); });
      S(c.af, { x: 430, y: 400, s: P(t, t5 - 0.6, 0.5, ease.back) }); O(c.cf, P(t, t5 - 0.2, 0.4, ease.lin));
      const KT = [t5 - 0.3, t5, TB.mo + 0.2, TB.or, TB.kn + 0.3, TB.ags + 0.2, TB.in + 0.2, TB.sy + 0.2, TB.eq + 0.3];
      c.k.forEach((k, i) => D(k, P(t, KT[i], 0.5, ease.io)));
      c.g.forEach((g, i) => pop(g, t, W("5", ["finalidade", "prazo", "registo"][i]) - 0.1, 0.4));
      const tg = W("5", "geral") - 0.2; O(c.bad, P(t, tg, 0.3, ease.lin)); const bx = P(t, tg + 0.4, 0.35, ease.back); S(c.badx, { s: bx, o: bx > 0 ? 1 : 0 }); O(c.bdb, P(t, tg + 0.2, 0.3, ease.lin));
    },
  });

  // ===================================================================
  // 6 — CONSOLA MUNICIPAL (simulação)
  // ===================================================================
  const FILA = [["#2214", "Esplanada · Casa Joaquim", "precisa de decisão", "#E5484D", 1], ["#2209", "Estado de pedido · Azurém", "resolvido automaticamente", "#5BBF7A"], ["#2207", "Documentos para obras", "resolvido automaticamente", "#5BBF7A"], ["#2203", "Ocorrência na via pública", "encaminhado", "#3FD0C9"], ["#2198", "Licença de ruído", "a aguardar munícipe", "#E8B44A"], ["#2195", "Certidão de localização", "resolvido automaticamente", "#5BBF7A"]];
  const CASO = [["motivo", "Motivo do encaminhamento", "ocupação contígua à fachada · confirmar largura"], ["resumo", "Resumo", "6 mesas, abril a outubro, corredor ≥ 2 m"], ["fontes", "Fontes", "Regulamento OEP · art. 8.º e Anexo I (em vigor)"], ["dados", "Dados mínimos", "3 itens partilhados pela munícipe"], ["proposta", "Proposta de ação", "aceitar a comunicação prévia"]];
  const BOT = [["aprova", "Aprovar", "#5BBF7A"], ["corrige", "Corrigir", "#3A4E7A"], ["pede", "Pedir elemento", "#3A4E7A"], ["escala", "Escalar", "#3A4E7A"]];
  scene({
    id: "s6", start: CUT.c6, end: CUT.c7 + 0.8, fi: 0.6, fo: 0, z: 7,
    build(el) {
      CASO.forEach(([w]) => cue("blip", W("6", w) - 0.1, 0.4));
      BOT.forEach(([w]) => cue("blip", W("6", w) - 0.05, 0.35));
      cue("clique", W("6", "decisao") - 0.1, 0.9); cue("carimbo", W("6", "decisao") + 0.2, 0.8); shake(W("6", "decisao") + 0.25, 5, 0.35);
      el.style.cssText += BG;
      el.innerHTML = `
        <div class="mon abs" style="left:90px;top:100px;width:1740px;height:860px;border-radius:20px;background:#0A1326;border:10px solid #2A3552;overflow:hidden">
          <div style="height:64px;background:#16264A;display:flex;align-items:center;justify-content:space-between;padding:0 28px">
            <div style="font-weight:700;font-size:24px;color:#fff">Consola Municipal <span style="color:#8FA3C4;font-weight:500">· Ocupação do Espaço Público</span></div>
            <div class="mono" style="font-size:16px;color:#E8B44A;padding:6px 12px;border:1px solid #E8B44A;border-radius:999px">SIMULAÇÃO · DADOS DEMONSTRATIVOS</div>
          </div>
          <div style="display:flex;height:786px">
            <div style="width:500px;border-right:1px solid #1B2D55;padding:20px">
              <div class="label-sm" style="color:#5E7096;font-size:15px;margin-bottom:12px">Fila de casos</div>
              ${FILA.map(([id, n, st, cor, sel]) => `<div class="fl" style="padding:14px 16px;border-radius:12px;margin-bottom:10px;background:${sel ? "#1B3A5E" : "#101C36"};border:1.5px solid ${sel ? "#3FD0C9" : "#1B2D55"}"><div style="display:flex;justify-content:space-between"><span class="mono" style="font-size:15px;color:#8FA3C4">${id}</span><span style="font-size:14px;color:${cor};font-weight:700">● ${st}</span></div><div style="font-size:20px;color:#fff;font-weight:600;margin-top:4px">${n}</div></div>`).join("")}
            </div>
            <div style="flex:1;padding:24px 30px;position:relative">
              <div class="serif" style="font-size:36px;font-weight:600;color:#fff">Esplanada · Casa Joaquim <span class="mono" style="font-size:18px;color:#8FA3C4">#2214</span></div>
              <div style="display:flex;gap:10px;margin:10px 0 16px">${pill("", "risco: baixo", "#5BBF7A", "rgba(91,191,122,.14)")}${pill("", "prazo: 20 dias", "#E8B44A", "rgba(232,180,74,.12)")}</div>
              ${CASO.map(([, k, v]) => `<div class="cr" style="display:flex;gap:16px;padding:12px 0;border-bottom:1px solid #1B2D55;font-size:21px"><span style="width:280px;flex:none;color:#8FA3C4">${k}</span><span style="color:#E7EEF8">${v}</span></div>`).join("")}
              <div style="display:flex;gap:14px;margin-top:26px">${BOT.map(([, n, cor]) => `<div class="bt" style="padding:14px 26px;border-radius:12px;background:${cor === "#5BBF7A" ? "#5BBF7A" : "transparent"};border:1.5px solid ${cor === "#5BBF7A" ? "#5BBF7A" : "#3A4E7A"};color:${cor === "#5BBF7A" ? "#0F1B33" : "#B8C4DA"};font-weight:750;font-size:21px">${n}</div>`).join("")}<div class="bt" style="padding:14px 26px;border-radius:12px;border:1.5px solid #3A4E7A;color:#B8C4DA;font-weight:750;font-size:21px">Atribuir</div></div>
              <div class="stp" style="position:absolute;right:40px;bottom:40px;padding:12px 24px;border:5px solid #5BBF7A;color:#5BBF7A;border-radius:14px;font-weight:900;font-size:28px;letter-spacing:.12em;text-align:center;line-height:1.15">DECISÃO HUMANA<br><span style="font-size:18px;letter-spacing:.2em">REGISTADA</span></div>
            </div>
            <div style="width:330px;border-left:1px solid #1B2D55;padding:20px">
              <div class="label-sm" style="color:#5E7096;font-size:15px;margin-bottom:12px">Histórico</div>
              ${["10:41 · missão criada pelo Henriques", "10:41 · pacote mínimo recebido", "10:42 · regras verificadas (fonte)", "10:43 · munícipe confirmou (CMD)", "10:43 · encaminhado: confirmar largura"].map((h) => `<div class="mono" style="font-size:15px;color:#9FB3D6;padding:8px 0;border-bottom:1px solid #1B2D55">${h}</div>`).join("")}
              <div class="hn mono" style="font-size:15px;color:#5BBF7A;padding:8px 0">11:05 · aprovado por técnica competente</div>
            </div>
          </div>
        </div>
        <svg class="cur abs" width="40" height="50" viewBox="0 0 40 50"><path d="M4 2 L4 38 L14 28 L22 46 L29 43 L21 25 L35 25 Z" fill="#fff" stroke="#0F1B33" stroke-width="3" stroke-linejoin="round"/></svg>`;
      return { mon: q(el, ".mon"), cr: qa(el, ".cr"), bt: qa(el, ".bt"), stp: q(el, ".stp"), hn: q(el, ".hn"), cur: q(el, ".cur"), fl: qa(el, ".fl") };
    },
    update(t, c) {
      const t6 = B("6").start;
      c.fl.forEach((f, i) => pop(f, t, t6 + 0.2 + i * 0.12, 0.4, 10));
      c.cr.forEach((r, i) => { const p = P(t, W("6", CASO[i][0]) - 0.15, 0.4); S(r, { x: L(-20, 0, p), o: p }); });
      c.bt.forEach((b, i) => { if (i > 3) return; const ta = W("6", BOT[i][0]) - 0.1; const on = win(t, ta, ta + 0.6, 0.1, 0.3); b.style.boxShadow = on > 0 ? `0 0 ${24 * on}px rgba(122,240,232,.7)` : "none"; });
      // cursor: percorre o caso e clica em Aprovar
      const td = W("6", "decisao") - 0.1;
      const m1 = P(t, W("6", "motivo") - 0.4, 3.8, ease.io), m2 = P(t, W("6", "aprova") - 0.3, 0.8, ease.io);
      const x = L(L(1600, 1100, m1), 700, m2), y = L(L(900, 640, m1), 735, m2);
      const click = t > td && t < td + 0.2 ? 0.85 : 1;
      S(c.cur, { x, y, s: click, o: P(t, W("6", "motivo") - 0.5, 0.3, ease.lin) });
      if (t > td) { c.bt[0].style.transform = t < td + 0.2 ? "scale(.94)" : "none"; c.bt[0].textContent = "Aprovado ✓"; } else c.bt[0].textContent = "Aprovar";
      const sp = P(t, td + 0.2, 0.35, ease.out); S(c.stp, { s: L(2, 1, sp), r: -6, o: sp });
      O(c.hn, P(t, td + 0.5, 0.3, ease.lin));
    },
  });

  // ===================================================================
  // 7 — GESTÃO E OTIMIZAÇÃO (painel com dados demonstrativos)
  // ===================================================================
  const DUV = [["Horário permitido da esplanada", 0.92], ["Que documentos levar", 0.74], ["Valor da taxa", 0.61], ["Estado do meu pedido", 0.47], ["Prazo de resposta", 0.33]];
  const FLUXO = ["Pedido", "Verificação", "Medição no local", "Decisão", "Comunicação"];
  scene({
    id: "s7", start: CUT.c7, end: CUT.c8 + 0.8, fi: 0.6, fo: 0, z: 8,
    build(el) {
      cue("blip", W("7", "duvidas") - 0.1, 0.5); cue("negado", W("7", "encravam") - 0.2, 0.5); cue("sucesso", W("7", "simplificar"), 0.6);
      el.style.cssText += BG;
      el.innerHTML = `
        <div class="abs" style="left:90px;top:100px;width:1740px;display:flex;justify-content:space-between;align-items:center">
          <div class="serif" style="font-size:44px;font-weight:600;color:#fff">Painel de gestão · Espaço público</div>
          <div class="mono" style="font-size:16px;color:#E8B44A;padding:6px 12px;border:1px solid #E8B44A;border-radius:999px">SIMULAÇÃO · DADOS DEMONSTRATIVOS</div>
        </div>
        <div class="abs" style="left:90px;top:190px;width:1740px;display:flex;gap:20px">
          ${[["Pedidos completos à primeira", "87%", "#5BBF7A"], ["Contactos repetidos por processo", "−38%", "#3FD0C9"], ["Tempo médio de triagem", "4 h", "#E8B44A"], ["Missões resolvidas sem espera", "61%", "#7AF0E8"]].map(([k, v, cor]) => `<div class="kp dark-card" style="position:relative;flex:1;height:150px;padding:20px 24px"><div style="font-size:19px;color:#B8C4DA">${k}</div><div class="serif" style="font-size:60px;font-weight:700;color:${cor};margin-top:6px">${v}</div></div>`).join("")}
        </div>
        <div class="dv dark-card" style="left:90px;top:370px;width:820px;height:560px;padding:22px 26px">
          <div class="label-sm" style="color:#3FD0C9;font-size:17px">Dúvidas mais frequentes · esplanadas</div>
          ${DUV.map(([n, v]) => `<div style="margin-top:22px"><div style="font-size:20px;color:#E7EEF8">${n}</div><div style="height:22px;border-radius:6px;background:#16264A;margin-top:6px"><div class="db" style="height:22px;border-radius:6px;background:#3FD0C9;width:${v * 100}%;transform-origin:0 50%"></div></div></div>`).join("")}
        </div>
        <div class="gf dark-card" style="left:950px;top:370px;width:880px;height:560px;padding:22px 26px">
          <div class="label-sm" style="color:#3FD0C9;font-size:17px">Onde o processo encrava</div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:60px">${FLUXO.map((f, i) => `<div class="st" style="flex:1;padding:18px 8px;border-radius:12px;text-align:center;font-size:19px;font-weight:700;color:#fff;background:#16264A;border:2px solid #3A4E7A">${f}<div class="mono" style="font-size:15px;color:#8FA3C4;margin-top:6px">${["1 d", "1 d", "9 d", "2 d", "1 d"][i]}</div></div>${i < 4 ? '<div style="color:#5E7096;font-size:22px">→</div>' : ""}`).join("")}</div>
          <div class="sg card" style="left:180px;top:300px;width:600px;padding:20px 24px;background:#F2EEE6;color:#0F1B33">
            <div class="label-sm" style="color:#1F7A3E;font-size:15px">Sugestão</div>
            <div style="font-size:23px;font-weight:700;margin-top:6px">Aceitar a medição do passeio feita pelo munícipe, com foto, nas esplanadas junto à fachada.</div>
            <div class="mono" style="font-size:15px;color:#5C6578;margin-top:8px">impacto estimado: −6 dias · decisão da Câmara</div>
          </div>
        </div>`;
      return { kp: qa(el, ".kp"), dv: q(el, ".dv"), db: qa(el, ".db"), gf: q(el, ".gf"), st: qa(el, ".st"), sg: q(el, ".sg") };
    },
    update(t, c) {
      const t7 = B("7").start;
      c.kp.forEach((k, i) => pop(k, t, t7 + 0.3 + i * 0.2, 0.5));
      pop(c.dv, t, W("7", "duvidas") - 0.4, 0.5);
      c.db.forEach((b, i) => { b.style.transform = `scaleX(${P(t, W("7", "duvidas") + i * 0.12, 0.8, ease.out)})`; });
      pop(c.gf, t, W("7", "pontos") - 0.4, 0.5);
      const red = P(t, W("7", "encravam") - 0.2, 0.4, ease.lin);
      c.st[2].style.borderColor = red > 0.5 ? "#E5484D" : "#3A4E7A"; c.st[2].style.background = `rgba(229,72,77,${0.25 * red})`;
      c.st[2].style.boxShadow = red > 0 ? `0 0 ${30 * red * (0.7 + 0.3 * Math.sin(t * 6))}px rgba(229,72,77,.6)` : "none";
      pop(c.sg, t, W("7", "simplificar") - 0.1, 0.5);
    },
  });

  // ===================================================================
  // 8 — FECHO: rede federada e slogan
  // ===================================================================
  const PT = [[42.15, -8.2], [42.08, -8.48], [42.03, -8.65], [41.87, -8.87], [41.69, -8.84], [41.38, -8.76], [41.15, -8.67], [40.98, -8.65], [40.64, -8.75], [40.15, -8.87], [39.6, -9.07], [39.36, -9.4], [38.78, -9.5], [38.69, -9.42], [38.68, -9.2], [38.48, -8.9], [38.41, -9.21], [37.95, -8.87], [37.5, -8.8], [37.02, -8.99], [37.1, -8.67], [37.0, -7.93], [37.19, -7.42], [37.6, -7.5], [38.2, -7.1], [38.88, -7.05], [39.4, -7.38], [39.66, -7.53], [39.8, -6.98], [40.17, -7.0], [40.73, -6.9], [41.0, -6.8], [41.5, -6.27], [41.67, -6.45], [41.95, -6.55], [41.97, -6.8], [41.95, -7.2], [41.9, -7.45], [41.82, -7.9], [41.87, -8.0], [41.95, -8.15]];
  const K = 150, PX = (lo) => 380 + (lo + 9.6) * K, PY = (la) => 90 + (42.25 - la) * K * 1.3;
  const poly = PT.map(([la, lo]) => [PX(lo), PY(la)]);
  const GMR = [PX(-8.3), PY(41.44)];
  const inPoly = (x, y) => { let r = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) r = !r; } return r; };
  const R8 = rng(88), VAULTS = []; while (VAULTS.length < 80) { const x = 380 + R8() * 520, y = 80 + R8() * 960; if (inPoly(x, y)) VAULTS.push([x, y]); }
  const CIT = [[41.15, -8.61], [41.55, -8.42], [41.69, -8.83], [41.3, -7.74], [41.81, -6.76], [40.64, -7.91], [40.2, -8.41], [39.23, -8.68], [38.72, -9.14], [38.57, -7.91], [37.02, -7.93]].map(([la, lo]) => [PX(lo), PY(la)]);
  const near = ([x, y]) => CIT.reduce((b, c) => (Math.hypot(c[0] - x, c[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? c : b));
  scene({
    id: "s8", start: CUT.c8, end: TOTAL + 0.1, fi: 0.8, fo: 0, z: 9,
    build(el) {
      cue("shimmer", W("8", "comecamos") - 0.1, 0.5); cue("negado", W("8", "central") - 0.1, 0.4); cue("final", CUT.fim + 0.3, 1.0);
      rings({ t0: CUT.fim + 0.6, x: 960, y: 380, n: 3, r1: 700, life: 1.6 });
      burst({ seed: 801, t0: CUT.fim + 0.7, x: 960, y: 380, n: 100, speed: 650, life: 2.0, colors: ["#3FD0C9", "#7AF0E8", "#E8B44A", "#fff"], size: [2, 5] });
      motes({ seed: 802, a: CUT.fim + 0.5, b: TOTAL + 1, n: 50, color: "122,240,232", area: [0, 200, 1920, 900] });
      el.style.cssText += BG;
      el.innerHTML = `
        <svg class="mp abs" width="1920" height="1080" viewBox="0 0 1920 1080">
          <polygon points="${poly.map((p) => p.join(",")).join(" ")}" fill="#16264A" stroke="#3FD0C9" stroke-width="2.5" stroke-linejoin="round"/>
          <g class="vl">${VAULTS.map((v) => { const c = near(v); return `<line x1="${v[0]}" y1="${v[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#3FD0C9" stroke-width="1" opacity=".4"/>`; }).join("")}</g>
          <g class="vd">${VAULTS.map((v) => `<rect x="${v[0] - 4}" y="${v[1] - 4}" width="8" height="8" rx="2" fill="#E8B44A"/>`).join("")}</g>
          ${CIT.map((c) => `<circle cx="${c[0]}" cy="${c[1]}" r="8" fill="#0F1B33" stroke="#3FD0C9" stroke-width="3"/>`).join("")}
          <circle class="gm" cx="${GMR[0]}" cy="${GMR[1]}" r="12" fill="#D9623B" stroke="#fff" stroke-width="3"/><text x="${GMR[0] + 20}" y="${GMR[1] + 7}" font-size="22" font-weight="700" fill="#fff" font-family="Inter">Guimarães</text>
        </svg>
        <div class="tx abs" style="left:1000px;top:280px;width:880px">
          <div class="l1 serif" style="font-size:54px;font-weight:600;color:#fff">Simplicidade <span style="color:#D9623B">para o munícipe.</span></div>
          <div class="l2 serif" style="font-size:54px;font-weight:600;color:#fff;margin-top:10px">Rigor <span style="color:#3FD0C9">para a Administração.</span></div>
          <div class="l3" style="margin-top:44px;display:flex;align-items:center;gap:20px"><svg width="80" height="90" viewBox="0 0 90 100"><ellipse cx="45" cy="16" rx="38" ry="12" fill="none" stroke="#8FA3C4" stroke-width="4"/><path d="M7 16 V82 A38 12 0 0 0 83 82 V16 M7 49 A38 12 0 0 0 83 49" fill="none" stroke="#8FA3C4" stroke-width="4"/><path class="sk" pathLength="1" d="M0 96 L90 4" stroke="#E5484D" stroke-width="8" stroke-linecap="round"/></svg><div style="font-size:30px;color:#fff;font-weight:650">Rede federada<br><span style="color:#B8C4DA;font-weight:400;font-size:24px">sem base de dados central</span></div></div>
        </div>
        <div class="end abs" style="width:1920px;height:1080px;${BG}">
          <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080"><g class="er">${henriques(70)}</g>
            <text class="el serif" x="960" y="610" text-anchor="middle" font-size="160" font-weight="600" fill="#fff" letter-spacing="-3">Delegate</text><circle class="ed" cx="1290" cy="598" r="13" fill="#3FD0C9"/></svg>
          <div class="es abs serif" style="left:160px;width:1600px;top:700px;text-align:center;font-size:50px;font-style:italic;color:#F2EEE6;line-height:1.25">A magia que a Inês vê é <span style="color:#3FD0C9">a burocracia que ela não precisa de perceber.</span></div>
          <div class="eh abs mono" style="left:0;width:1920px;top:960px;text-align:center;font-size:24px;letter-spacing:.2em;color:#8FA3C4">DELEGATE · 3/3 · HACK4GUIMARÃES</div>
        </div>`;
      return { mp: q(el, ".mp"), vd: qa(el, ".vd rect"), vl: q(el, ".vl"), l1: q(el, ".l1"), l2: q(el, ".l2"), l3: q(el, ".l3"), sk: q(el, ".sk"), end: q(el, ".end"), er: q(el, ".er"), el: q(el, ".el"), ed: q(el, ".ed"), es: q(el, ".es"), eh: q(el, ".eh"), gm: q(el, ".gm") };
    },
    update(t, c) {
      const t8 = B("8").start;
      pop(c.l1, t, t8 - 0.1, 0.5); pop(c.l2, t, W("8", "rigor") - 0.1, 0.5);
      const tg = W("8", "comecamos") - 0.2;
      c.gm.setAttribute("r", 12 + 6 * Math.abs(Math.sin(t * 3)) * P(t, tg, 0.3, ease.lin));
      c.vd.forEach((v, i) => O(v, P(t, W("8", "rede") - 0.4 + (i % 30) * 0.02, 0.3, ease.lin)));
      O(c.vl, P(t, W("8", "rede"), 0.6, ease.lin));
      pop(c.l3, t, W("8", "federada") - 0.2, 0.5); D(c.sk, P(t, W("8", "central") - 0.1, 0.4, ease.out));
      const te = CUT.fim;
      O(c.end, P(t, te, 0.7, ease.io));
      const r = P(t, te + 0.4, 0.7, ease.back); S(c.er, { x: 960, y: 380, s: r * (1 + 0.03 * Math.sin(t * 3)), o: r > 0 ? 1 : 0 });
      S(c.el, { y: L(20, 0, P(t, te + 0.5, 0.7)), o: P(t, te + 0.5, 0.6, ease.lin) });
      const d = P(t, te + 1.0, 0.4, ease.back); S(c.ed, { s: d, o: d > 0 ? 1 : 0 });
      S(c.es, { y: L(16, 0, P(t, W("8", "magia") - 0.2, 0.7)), o: P(t, W("8", "magia") - 0.2, 0.6, ease.lin) });
      O(c.eh, P(t, B("8").end + 1.2, 0.6, ease.lin));
    },
  });
})();
