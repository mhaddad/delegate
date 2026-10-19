/* ATO III — cenas 5 a 10: plano contínuo acima/abaixo da Linha de Superfície */
(function () {
  const { CUT, cue, shake, burst, rings, motes, P, L, W, S, O, D, type, ease, clamp, H, q, qa, ines, afonso, afonsoRingSVG, ICON, scene, win } = F;

  const T0 = CUT.s05;
  const TOP = 60, BOT = 1000; // y do mundo no topo do ecrã
  const CAM = [ // [início, fim, de, para]
    [W("06", "do") - 0.8, W("06", "do") + 0.5, TOP, BOT],
    [W("08", "minutos") - 0.6, W("08", "minutos") + 0.5, BOT, TOP],
    [W("09", "onde") - 0.9, W("09", "onde") + 0.3, TOP, BOT],
    [W("10", "dias") - 0.5, W("10", "dias") + 0.6, BOT, TOP],
  ];
  function camY(t) {
    let y = TOP;
    for (const [a, b, f, to] of CAM) { if (t >= b) y = to; else if (t > a) { y = L(f, to, ease.io((t - a) / (b - a))); break; } else break; }
    return y;
  }

  // ---------- tempos-chave ----------
  const tType0 = W("05a", "escreve") - 0.1, tType1 = W("05a", "amigo") + 0.6, tSend = tType1 + 0.35;
  const tM2 = tSend + 1.3;
  const tM3 = W("08", "afonso");
  const tTap = W("08", "ines"), tPin0 = W("08", "confirma"), tOk = W("08", "digital") + 0.2;
  const tM4 = W("10", "ines") - 0.1;

  // ---------- mensagens ----------
  const MSG = [
    { t: tSend, cls: "me", html: `Afonso, com o novo PDM ainda posso construir uma casa de 150 m² no terreno do meu avô?<div class="meta">10:14<span class="ticks">✓✓</span></div>` },
    { t: tM2, cls: "af", typing: 0.9, html: `Olá, Inês! Já tenho o terreno de Ponte no seu Cofre. Vou verificar e volto a falar consigo.<div class="meta">10:14</div>` },
    { t: tM3, cls: "af", typing: 0.8, html: `Inês, a análise preliminar é <b>favorável</b>: com o novo PDM, o seu terreno permite habitação e os 150 m² cabem nos limites.<br><br>Para ter certeza formal, preparei o <b>Pedido de Informação Prévia</b>.
        <div><span class="chip"><i style="background:#E8EEF6">${ICON.clip("#0F1B33")}</i>Fonte: PDM de Guimarães · versão em vigor</span></div>
        <div class="btn-chat">Rever e confirmar</div><div class="meta">10:17</div>` },
    { t: tM4, cls: "af", typing: 0.9, html: `<b>Boa notícia, Inês:</b> a Câmara emitiu informação prévia favorável. Pode avançar com o projeto.
        <div><span class="chip c0" style="background:#E3F5E8;color:#1F7A3E"><i>${ICON.check()}</i>Informação prévia favorável</span></div>
        <div><span class="chip c1"><i>${ICON.clip()}</i>Fonte</span><span class="chip c2"><i>${ICON.doc()}</i>Recibo</span><span class="chip c3"><i>${ICON.arrow()}</i>Próximos passos</span></div>
        <div class="meta">11:02</div>` },
  ];
  const INPUT_TXT = "Afonso, com o novo PDM ainda posso construir uma casa de 150 m² no terreno do meu avô?";

  // ===================================================================
  // camada de cima: a Inês e o telemóvel
  // ===================================================================
  const topHTML = `
    <div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:#F2EEE6"></div>
    <svg class="abs" width="1920" height="1080" viewBox="0 0 1920 1080">
      <circle cx="560" cy="620" r="380" fill="#D9623B" opacity=".08"/>
      <circle cx="560" cy="620" r="250" fill="#D9623B" opacity=".06"/>
      <g class="table"><ellipse cx="760" cy="760" rx="95" ry="18" fill="#C9B79A"/><rect x="752" y="760" width="16" height="230" fill="#B6A383"/><ellipse cx="760" cy="992" rx="60" ry="10" fill="#B6A383"/></g>
      <g transform="translate(400 375) scale(1.25)">
        <g class="ines-a">${ines()}</g>
        <g class="ines-b">${ines({ smile: true })}</g>
      </g>
      <g class="sphone"><rect x="-15" y="-26" width="30" height="52" rx="6" fill="#101524"/><rect x="-11" y="-21" width="22" height="40" rx="3" fill="#7AF0E8" opacity=".55"/></g>
      <g class="cup"><path d="M-18 -16 H18 L14 18 Q0 24 -14 18 Z" fill="#F7F1E4" stroke="#B94E2C" stroke-width="3"/><path d="M18 -8 Q30 -6 26 6 Q22 12 15 10" stroke="#B94E2C" stroke-width="3" fill="none"/>
        <path class="steam" d="M-6 -24 Q-12 -36 -4 -46 M6 -24 Q0 -36 8 -48" stroke="#B9A88A" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <g class="spark">${[0, 1, 2, 3, 4].map((i) => `<path d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3Z" fill="#E8B44A" transform="translate(${[380, 690, 330, 720, 560][i]} ${[420, 380, 560, 540, 330][i]})"/>`).join("")}</g>
    </svg>
    <div class="cal card" style="left:150px;top:200px;width:210px;text-align:center;overflow:hidden">
      <div style="background:#D9623B;color:#fff;font-weight:700;letter-spacing:.14em;font-size:20px;padding:8px">OUTUBRO</div>
      <div class="cal-d serif" style="font-size:96px;font-weight:650;line-height:1.1;padding:6px 0 10px">14</div>
    </div>
    <div class="yes abs serif" style="left:120px;top:150px;font-size:100px;font-weight:650;color:#D9623B;white-space:nowrap">Pode avançar.</div>
    <div class="phone" style="left:1180px;top:120px">
      <div class="screen">
        <div class="head">
          ${afonsoRingSVG(64)}
          <div><div class="name">Afonso</div><div class="status">online</div></div>
        </div>
        <div class="feed"><div class="feed-in">
          ${MSG.map((m, i) => `${m.typing ? `<div class="typing ty${i}"><b></b><b></b><b></b></div>` : ""}<div class="bubble ${m.cls} m${i}">${m.html}</div>`).join("")}
        </div></div>
        <div class="input"><span class="itxt"></span><span class="ph">Mensagem</span><div class="send"></div></div>
        <div class="cmd abs" style="left:0;top:0;width:412px;height:852px;background:#fff;z-index:5;padding:150px 34px 0">
          <div style="display:flex;align-items:center;gap:10px;color:#1F7A3E;font-weight:700;font-size:18px"><span style="width:22px;height:22px">${ICON.lock("#1F7A3E")}</span>Ambiente seguro</div>
          <div style="margin-top:34px;width:84px;height:84px;border-radius:22px;background:#0F1B33;padding:20px">${ICON.key("#E8B44A")}</div>
          <div class="serif" style="font-size:36px;font-weight:650;margin-top:22px;line-height:1.1">Chave Móvel Digital</div>
          <div style="font-size:20px;color:#5C6578;margin-top:14px;line-height:1.35">Confirmar a submissão do Pedido de Informação Prévia à Câmara Municipal de Guimarães</div>
          <div class="pins" style="display:flex;gap:16px;margin-top:40px">${[0, 1, 2, 3].map(() => `<div class="pin" style="width:52px;height:64px;border-radius:12px;border:2px solid #CDD3DE;display:flex;align-items:center;justify-content:center"><div style="width:16px;height:16px;border-radius:50%;background:#0F1B33"></div></div>`).join("")}</div>
          <div class="okb" style="margin-top:44px;display:flex;align-items:center;gap:16px"><div style="width:58px;height:58px">${ICON.check()}</div><div><div style="font-weight:700;font-size:22px">Pedido submetido</div><div class="mono" style="font-size:16px;color:#5C6578">Recibo n.º 2026/PIP/04471</div></div></div>
        </div>
      </div>
    </div>`;

  // ===================================================================
  // camada de baixo — 1: Cofre Digital Pessoal
  // ===================================================================
  const VC = [700, 560]; // centro do cofre
  const hex = (r) => [...Array(6).keys()].map((k) => { const a = ((-90 + 60 * k) * Math.PI) / 180; return [VC[0] + r * Math.cos(a), VC[1] + r * Math.sin(a)]; });
  const NODES = [
    { k: "loc", txt: "localização do terreno", a: -150, sel: 1 },
    { k: "pre", txt: "pretensão: moradia 150 m²", a: -30, sel: 1 },
    { k: "pla", txt: "planta selecionada", a: 90, sel: 1 },
    { k: "fot", txt: "fotografia do avô", a: -90, sel: 0 },
    { k: "out", txt: "outros imóveis", a: 150, sel: 0 },
    { k: "con", txt: "conversas anteriores", a: 30, sel: 0 },
  ].map((n) => ({ ...n, x: VC[0] + 205 * Math.cos((n.a * Math.PI) / 180), y: VC[1] + 205 * Math.sin((n.a * Math.PI) / 180) }));
  const SLOT = (i) => [1335, 560 + i * 62];
  const vaultHTML = `
    <div class="serif abs" style="left:110px;top:56px;font-size:62px;font-weight:600;color:#E8B44A">Cofre Digital Pessoal</div>
    <div class="mono abs" style="left:112px;top:142px;font-size:22px;color:#B8C4DA;letter-spacing:.04em">cifrado · controlado pela Inês · nada sai sem autorização</div>
    <svg class="abs" width="1920" height="1000" viewBox="0 0 1920 1000">
      <circle class="vglow" cx="${VC[0]}" cy="${VC[1]}" r="420" fill="url(#gGold)"/>
      <polygon class="vhex" pathLength="1" points="${hex(330).map((p) => p.join(",")).join(" ")}" fill="rgba(232,180,74,.06)" stroke="#E8B44A" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="${hex(300).map((p) => p.join(",")).join(" ")}" fill="none" stroke="#E8B44A" stroke-width="1.5" opacity=".35" stroke-dasharray="4 8"/>
      ${NODES.map((n) => `<line class="ved" pathLength="1" x1="${VC[0]}" y1="${VC[1]}" x2="${n.x}" y2="${n.y}" stroke="#E8B44A" stroke-width="2" opacity=".55"/>`).join("")}
      <path class="beam" pathLength="1" d="M1240 150 C1100 150 900 120 ${VC[0]} 210" stroke="#3FD0C9" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="vlock" transform="translate(${VC[0]} ${VC[1] - 330})">
        <g class="shackle"><path d="M-20 -6 V-26 A20 20 0 0 1 20 -26 V-6" stroke="#E8B44A" stroke-width="8" fill="none"/></g>
        <rect x="-32" y="-8" width="64" height="50" rx="10" fill="#E8B44A"/><circle cy="14" r="7" fill="#0F1B33"/>
      </g>
      <g class="afv" transform="translate(1240 150)"><g class="afvi">${afonso(44)}</g></g>
    </svg>
    <div class="mono abs vkey" style="left:${VC[0] + 50}px;top:${VC[1] - 380}px;padding:6px 14px;border-radius:999px;background:#E8B44A;color:#0F1B33;font-size:18px;font-weight:700">chave: Inês</div>
    <div class="vnode abs" style="left:${VC[0]}px;top:${VC[1]}px"><div class="ni mono" style="transform:translate(-50%,-50%);padding:14px 22px;border-radius:14px;background:#E8B44A;color:#0F1B33;font-size:23px;font-weight:700;white-space:nowrap">Terreno em Ponte</div></div>
    ${NODES.map((n) => `<div class="vn abs" data-k="${n.k}" style="left:${n.x}px;top:${n.y}px"><div class="ni mono" style="padding:10px 16px;border-radius:12px;background:#16264A;border:2px solid rgba(232,180,74,.6);color:#F3E3BC;font-size:19px;white-space:nowrap">${n.txt}</div><div class="np mono" style="position:absolute;left:50%;top:30px;transform:translateX(-50%);white-space:nowrap;font-size:15px;color:#E5484D;letter-spacing:.06em;font-weight:700">🔒 NÃO PARTILHADO</div></div>`).join("")}
    <div class="pack dark-card" style="left:1290px;top:300px;width:520px;height:560px;padding:28px 30px;border-color:rgba(232,180,74,.55)">
      <div class="label-sm" style="color:#E8B44A">Pacote mínimo de missão</div>
      <div class="mono" style="margin-top:20px;font-size:19px;line-height:1.75;color:#C9D4E8">
        <div><span style="color:#8FA3C4">missão</span>     viabilidade urbanística</div>
        <div><span style="color:#8FA3C4">finalidade</span> análise preliminar</div>
        <div><span style="color:#8FA3C4">validade</span>   30 dias</div>
      </div>
      <div class="label-sm" style="color:#8FA3C4;margin-top:22px;font-size:15px">Partilhado</div>
    </div>
    ${NODES.filter((n) => n.sel).map((n, i) => `<div class="fly abs" data-i="${i}" style="left:0;top:0"><div class="mono" style="padding:9px 16px;border-radius:12px;background:#E8B44A;color:#0F1B33;font-size:19px;font-weight:700;white-space:nowrap">✓ ${n.txt}</div></div>`).join("")}`;

  // ===================================================================
  // camada de baixo — 2: agentes de IA e sistemas da Câmara
  // ===================================================================
  const AX = [300, 680, 1060, 1440];
  const archHTML = `
    <svg class="abs" width="1920" height="1000" viewBox="0 0 1920 1000">
      <g stroke="#3FD0C9" stroke-width="3" fill="none" opacity=".75">
        <path class="cn c-af" pathLength="1" d="M190 105 H380"/>
        <path class="cn c-pk" pathLength="1" d="M330 260 H380"/>
        <path class="cn c-mo" pathLength="1" d="M680 150 V220"/>
        ${[0, 1, 2].map((i) => `<path class="cn c-ag" id="ca${i}" pathLength="1" d="M680 300 V340 H${AX[i]} V380"/>`).join("")}
        <path class="cn c-ag3" id="ca3" pathLength="1" d="M900 300 V340 H${AX[3]} V545" stroke-dasharray="none"/>
        ${[0, 1, 2].map((i) => `<path class="cn c-gt" id="cg${i}" pathLength="1" d="M${AX[i]} 470 V545"/>`).join("")}
        ${[0, 1, 2, 3].map((i) => `<path class="cn c-sy" id="cs${i}" pathLength="1" d="M${AX[i]} 605 V660"/>`).join("")}
      </g>
      <path class="sup-l" pathLength="1" d="M1610 160 V520 H${AX[0]}" stroke="#E8B44A" stroke-width="3" fill="none" stroke-dasharray="1 1"/>
      <g class="pulses">${[...Array(8).keys()].map((i) => `<circle class="pl" r="9" fill="#7AF0E8"/>`).join("")}</g>
      <g class="afa" transform="translate(150 105)"><g>${afonso(40)}</g></g>
    </svg>
    <div class="ab abs" style="left:110px;top:150px;width:80px;text-align:center;color:#8FA3C4;font-size:18px">Afonso</div>
    <div class="ab pk abs mono" style="left:60px;top:226px;width:270px;height:68px;border-radius:14px;background:#E8B44A;color:#0F1B33;font-size:19px;font-weight:700;display:flex;align-items:center;justify-content:center">pacote mínimo</div>
    <div class="ab mo dark-card" style="left:380px;top:58px;width:600px;height:92px;padding:16px 26px"><div class="label-sm" style="color:#3FD0C9">Motor de política</div><div style="font-size:21px;color:#B8C4DA;margin-top:4px">consentimento · risco · autoridade</div></div>
    <div class="ab or dark-card" style="left:380px;top:220px;width:600px;height:80px;padding:0 26px;display:flex;align-items:center"><div class="label-sm" style="color:#3FD0C9">Orquestrador de missões</div></div>
    <div class="ab sup dark-card" style="left:1420px;top:46px;width:390px;height:114px;padding:16px 22px;display:flex;gap:16px;align-items:center;border-color:rgba(232,180,74,.6)">
      <div style="width:58px;height:58px;flex:none">${ICON.shield("#E8B44A")}</div>
      <div><div style="font-size:25px;font-weight:700;color:#fff">Supervisor de risco</div><div style="font-size:18px;color:#B8C4DA">nenhum agente sai do âmbito</div></div>
    </div>
    <div class="ab abs" style="left:1420px;top:172px;display:flex;gap:10px">
      ${["finalidade", "autorização", "registo"].map((k, i) => `<div class="ck ck${i} mono" style="padding:6px 12px;border-radius:999px;background:rgba(91,191,122,.16);border:1.5px solid #5BBF7A;color:#BFF0CF;font-size:17px">${k} ✓</div>`).join("")}
    </div>
    ${["Navegador de regras", "Analista territorial", "Construtor de jornada"].map((n, i) => `
      <div class="ab ag dark-card" data-i="${i}" style="left:${AX[i] - 170}px;top:380px;width:340px;height:90px;display:flex;align-items:center;gap:14px;padding:0 20px">
        <div style="width:46px;height:46px;border-radius:50%;border:3px solid #3FD0C9;display:flex;align-items:center;justify-content:center;flex:none;font-family:Mono;font-weight:700;color:#3FD0C9;font-size:18px">IA</div>
        <div style="font-size:24px;font-weight:650;color:#fff">${n}</div>
      </div>`).join("")}
    <div class="ab bar abs" style="left:120px;top:545px;width:1690px;height:60px;border-radius:14px;background:#16264A;border:1.5px dashed rgba(63,208,201,.5)"></div>
    <div class="ab abs label-sm" style="left:140px;top:610px;color:#5E7096;font-size:14px">camada de integração · capacidades mínimas</div>
    ${["consultar_pdm()", "consultar_sig()", "criar_rascunho_pip()", "ler_processos_terceiros()"].map((c, i) => `
      <div class="ab gate abs" data-i="${i}" style="left:${AX[i] - 150}px;top:553px;width:300px;height:44px;border-radius:10px;background:#0F1B33;border:2px solid #3FD0C9;color:#BFEDEA;font-family:Mono;font-size:18px;display:flex;align-items:center;justify-content:center;gap:8px">${c}</div>`).join("")}
    <div class="ab sys dark-card" data-i="0" style="left:${AX[0] - 170}px;top:660px;width:340px;height:170px;padding:16px 20px;background:#F2EEE6;color:#0F1B33;border:none">
      <div style="font-weight:750;font-size:20px">PDM de Guimarães</div>
      <div class="mono" style="font-size:14px;color:#5C6578">versão em vigor · fonte oficial</div>
      <div style="margin-top:10px;display:flex;flex-direction:column;gap:7px">
        <div style="height:9px;width:90%;background:#D7D0C2;border-radius:4px"></div>
        <div class="hl" style="font-size:17px;font-weight:700;padding:3px 8px;border-radius:6px;background:rgba(91,191,122,.0)">Espaço habitacional ✓</div>
        <div style="height:9px;width:75%;background:#D7D0C2;border-radius:4px"></div>
      </div>
    </div>
    <div class="ab sys dark-card" data-i="1" style="left:${AX[1] - 170}px;top:660px;width:340px;height:170px;padding:16px 20px;background:#F2EEE6;color:#0F1B33;border:none">
      <div style="font-weight:750;font-size:20px">SIG · plantas municipais</div>
      <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px;font-size:17px">
        ${["REN", "RAN", "Domínio hídrico"].map((l, k) => `<div class="ly ly${k}" style="display:flex;justify-content:space-between;padding:3px 10px;border-radius:8px;background:#E6E0D3"><span>${l}</span><b class="lyk" style="color:#1F7A3E">livre ✓</b></div>`).join("")}
      </div>
    </div>
    <div class="ab sys dark-card" data-i="2" style="left:${AX[2] - 170}px;top:660px;width:340px;height:170px;padding:16px 20px;background:#F2EEE6;color:#0F1B33;border:none">
      <div style="font-weight:750;font-size:20px">Urbanismo Digital</div>
      <div class="mono" style="font-size:14px;color:#5C6578">Pedido de Informação Prévia · rascunho</div>
      <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:7px">
        ${["local", "pretensão", "planta", "requerente"].map((f, k) => `<div class="ff ff${k}" style="font-size:15px;padding:5px 8px;border-radius:7px;border:1.5px solid #CFC7B6"><span style="color:#5C6578">${f}</span> <b style="color:#1F7A3E">✓</b></div>`).join("")}
      </div>
    </div>
    <div class="ab sys dark-card" data-i="3" style="left:${AX[3] - 170}px;top:660px;width:340px;height:170px;padding:16px 20px;background:#16264A;border:2px solid #3A4E7A;color:#8FA3C4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">
      <div style="width:44px;height:44px">${ICON.lock("#5E7096")}</div>
      <div style="font-weight:700;font-size:20px">Processos de terceiros</div>
    </div>
    <div class="blk abs" style="left:${AX[3] - 190}px;top:500px;width:380px;text-align:center"><div style="display:inline-block;padding:8px 16px;border-radius:10px;background:#E5484D;color:#fff;font-weight:800;font-size:19px;letter-spacing:.06em">BLOQUEADO · fora do âmbito</div></div>
    <div class="ab audit abs" style="left:120px;top:858px;width:1690px;height:128px;border-radius:14px;background:#0A1326;border:1px solid #22355F;padding:12px 22px;overflow:hidden">
      <div class="label-sm" style="color:#5E7096;font-size:14px">Auditoria · missão #4471</div>
      <div class="alog mono" style="font-size:18px;line-height:1.55;color:#9FB3D6;margin-top:4px"></div>
    </div>`;
  const AUDIT = [
    { t: W("07", "le") + 0.6, s: "10:14:31  consultar_pdm()            finalidade ✓  autorização ✓  ok" },
    { t: W("07", "cruza") + 0.5, s: "10:14:33  consultar_sig()            finalidade ✓  autorização ✓  ok" },
    { t: W("07", "prepara") + 0.4, s: "10:14:36  criar_rascunho_pip()       finalidade ✓  autorização ✓  ok" },
    { t: W("07", "passa") + 0.3, s: "10:14:37  ler_processos_terceiros()  fora do âmbito            ✕ BLOQUEADO", red: 1 },
    { t: W("07", "registo") + 0.1, s: "10:14:38  missão #4471 · 4 eventos registados e assinados" },
  ];

  // ===================================================================
  // camada de baixo — 3: Câmara Municipal e a arquiteta Marta
  // ===================================================================
  const camaraHTML = `
    <svg class="bld abs" width="1920" height="1000" viewBox="0 0 1920 1000">
      <g fill="#22355F" stroke="#3FD0C9" stroke-width="2.5">
        <path d="M560 330 L960 170 L1360 330 Z" fill="#16264A"/>
        <rect x="580" y="330" width="760" height="40"/>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${620 + i * 132}" y="370" width="40" height="300" fill="#1B2D55"/>`).join("")}
        <rect x="560" y="670" width="800" height="30"/><rect x="530" y="700" width="860" height="30"/>
        <rect x="905" y="560" width="110" height="110" fill="#0F1B33"/>
        <circle cx="960" cy="260" r="34" fill="#0F1B33"/>
      </g>
      ${[0, 1, 2, 3, 4].map((i) => `<rect class="win${i}" x="${675 + i * 132}" y="420" width="62" height="90" rx="4" fill="#E8B44A" opacity=".75"/>`).join("")}
      <text x="960" y="800" text-anchor="middle" class="serif" font-size="44" font-weight="600" fill="#fff">Câmara Municipal</text>
    </svg>
    <div class="office abs" style="left:0;top:0;width:1920px;height:1000px">
      <svg class="abs" width="1920" height="1000" viewBox="0 0 1920 1000">
        <rect x="0" y="806" width="1920" height="194" fill="#0B1428"/>
        <rect x="0" y="790" width="1920" height="22" fill="#3A4E7A"/>
        <g transform="translate(40 420) scale(1.6)">
          <rect x="40" y="250" width="160" height="18" rx="6" fill="#2A3552"/><rect x="40" y="110" width="20" height="150" rx="8" fill="#2A3552"/><rect x="110" y="268" width="10" height="110" fill="#2A3552"/>
          <path d="M90 250 H200 V280 H90Z" fill="#33405F"/><path d="M190 255 L205 360" stroke="#33405F" stroke-width="28" stroke-linecap="round"/><ellipse cx="214" cy="364" rx="22" ry="9" fill="#1C2338"/>
          <path d="M70 262 L150 262 L156 150 Q120 132 92 140 Z" fill="#5B6B8C"/>
          <rect x="114" y="112" width="20" height="30" fill="#B07A58"/>
          <circle cx="128" cy="92" r="32" fill="#C98E6A"/>
          <path d="M96 96 Q92 56 128 56 Q160 58 160 80 Q140 74 122 78 Q112 92 108 112 Q98 108 96 96Z" fill="#2E2A2A"/>
          <circle cx="150" cy="92" r="9" stroke="#0F1B33" stroke-width="3" fill="none"/><path d="M141 92 H128" stroke="#0F1B33" stroke-width="3"/>
          <g class="marm"><path d="M132 160 L168 214 L232 212" stroke="#4E5D7D" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="236" cy="212" r="10" fill="#C98E6A"/></g>
        </g>
        <rect x="1160" y="770" width="80" height="22" fill="#2A3552"/><rect x="1185" y="745" width="30" height="30" fill="#2A3552"/>
      </svg>
      <div class="abs" style="left:110px;top:330px;width:330px;text-align:center">
        <div class="serif mname" style="font-size:38px;font-weight:600;color:#fff">Arq.ª Marta</div>
        <div class="mname2" style="font-size:20px;color:#8FA3C4">técnica de urbanismo</div>
      </div>
      <div class="mon abs" style="left:640px;top:40px;width:1160px;height:705px;border-radius:22px;background:#0A1326;border:10px solid #2A3552;overflow:hidden">
        <div style="height:66px;background:#16264A;display:flex;align-items:center;justify-content:space-between;padding:0 28px">
          <div style="font-weight:700;font-size:23px;color:#fff">Consola Municipal <span style="color:#8FA3C4;font-weight:500">· Urbanismo</span></div>
          <div class="mono" style="font-size:18px;color:#3FD0C9">Caso #4471</div>
        </div>
        <div style="display:flex;gap:26px;padding:24px 28px">
          <div style="flex:1;position:relative">
            <div class="scan abs" style="left:-12px;width:calc(100% + 24px);height:46px;border-radius:8px;background:rgba(63,208,201,.14);border:1.5px solid rgba(63,208,201,.5)"></div>
            <div class="serif" style="font-size:34px;font-weight:600;color:#fff;margin-bottom:14px">Pedido de Informação Prévia</div>
            ${[
              ["Requerente", "autenticada · Chave Móvel Digital ✓"],
              ["Pretensão", "moradia unifamiliar · 150 m²"],
              ["Local", "Ponte, Guimarães"],
              ["Análise preliminar", "sem condicionantes ✓"],
              ["Fontes", "PDM (em vigor) · Ordenamento · Condicionantes"],
              ["Dados partilhados", "3 itens · mínimo necessário"],
            ].map(([k, v], i) => `<div class="row row${i}" style="display:flex;gap:14px;padding:8px 0;border-bottom:1px solid #1B2D55;font-size:21px"><span style="width:210px;flex:none;color:#8FA3C4">${k}</span><span style="color:#E7EEF8">${v}</span></div>`).join("")}
            <div class="prop" style="margin-top:16px;padding:12px 16px;border-radius:12px;background:rgba(91,191,122,.14);border:1.5px solid #5BBF7A;color:#CFF5DA;font-size:20px"><b>Proposta:</b> informação prévia favorável → decisor competente</div>
          </div>
          <div style="width:330px;flex:none">
            <svg width="330" height="300" viewBox="0 0 330 300" style="border-radius:12px;background:#E9E4D6">
              <path d="M0 210 Q90 170 170 190 T330 160 V300 H0Z" fill="#CFD8B0"/><path d="M40 0 L120 300 M250 0 L210 300" stroke="#C9B48E" stroke-width="5"/>
              <path d="M110 120 L230 110 L250 220 L120 235Z" fill="rgba(217,98,59,.18)" stroke="#D9623B" stroke-width="4" stroke-dasharray="10 7"/>
              <rect x="150" y="145" width="62" height="52" fill="#D9623B" opacity=".75"/>
            </svg>
            <div style="display:flex;gap:10px;margin-top:22px">
              <div style="flex:1;padding:12px 0;text-align:center;border-radius:10px;border:1.5px solid #3A4E7A;color:#8FA3C4;font-size:17px">Pedir elemento</div>
              <div style="flex:1;padding:12px 0;text-align:center;border-radius:10px;border:1.5px solid #3A4E7A;color:#8FA3C4;font-size:17px">Corrigir</div>
            </div>
            <div class="vbtn" style="margin-top:12px;padding:16px 0;text-align:center;border-radius:12px;background:#3FD0C9;color:#0F1B33;font-weight:800;font-size:22px">Validar</div>
          </div>
        </div>
        <div class="stamp" style="position:absolute;right:40px;bottom:30px;padding:10px 22px;border:5px solid #5BBF7A;color:#5BBF7A;border-radius:14px;font-weight:900;font-size:26px;letter-spacing:.12em;text-align:center;line-height:1.15">DECISÃO HUMANA<br><span style="font-size:18px;letter-spacing:.2em">REGISTADA</span></div>
      </div>
      <div class="malog abs mono" style="left:640px;top:820px;width:1160px;padding:14px 22px;border-radius:12px;background:#0A1326;border:1px solid #22355F;font-size:19px;color:#9FB3D6">
        <span style="color:#5E7096">AUDITORIA</span>&nbsp;&nbsp;10:52:08&nbsp;&nbsp;caso #4471 validado por técnica competente · fundamento: PDM (em vigor) ✓
      </div>
    </div>`;

  // ===================================================================
  scene({
    id: "s05", start: T0, end: CUT.s11 + 0.7, fi: 0.5, fo: 0, z: 5,
    build(el) {
      // ---------- som ----------
      cue("teclado", tType0, 0.45); cue("enviar", tSend, 0.7); cue("receber", tM2, 0.7);
      CAM.forEach(([a], i) => cue(i % 2 ? "subida" : "mergulho", a, 0.8));
      const t6 = W("06", "do");
      cue("cofre", W("06", "abre") + 0.35, 0.8);
      const selT = [W("06", "terreno"), W("06", "pretensao"), W("06", "planta")];
      NODES.filter((n) => n.sel).forEach((n, i) => {
        cue("blip", selT[i] - 0.1, 0.7);
        burst({ seed: 60 + i, t0: selT[i] - 0.05, x: n.x, y: 80 + n.y, n: 34, speed: 260, life: 0.9, colors: ["#E8B44A", "#FFE3A3"], size: [2, 4] });
      });
      cue("fecho", W("06", "cofre", 2) - 0.1, 0.8); shake(W("06", "cofre", 2), 5, 0.4);
      [W("07", "le"), W("07", "cruza"), W("07", "prepara")].forEach((ta) => { cue("blip", ta - 0.3, 0.6); cue("blip", ta + 0.4, 0.45); });
      cue("negado", W("07", "passa") - 0.05, 0.8); shake(W("07", "passa"), 5, 0.35);
      cue("shimmer", W("07", "supervisor") - 0.1, 0.35);
      [W("07", "finalidade"), W("07", "autorizacao"), W("07", "registo")].forEach((ta) => cue("blip", ta - 0.05, 0.55));
      cue("vibrar", tM3 - 0.75, 0.7); cue("receber", tM3, 0.75);
      cue("pin", tTap - 0.1, 0.6);
      [0, 1, 2, 3].forEach((i) => cue("blip", tPin0 + 0.2 + i * 0.22, 0.4));
      cue("sucesso", tOk, 0.8);
      cue("sucesso", W("09", "valida") + 0.2, 0.6);
      cue("carimbo", W("09", "tudo") - 0.05, 0.8); shake(W("09", "tudo"), 7, 0.4);
      cue("vibrar", tM4 - 0.9, 0.6); cue("receber", tM4, 0.7);
      // ---------- "pode avançar": celebração ----------
      const tp = W("10", "pode");
      cue("celebrar", tp - 0.05, 1.0);
      const CONF = ["#D9623B", "#E8B44A", "#3FD0C9", "#5BBF7A", "#F2EEE6", "#0F1B33"];
      burst({ seed: 71, t0: tp, x: 420, y: 170, n: 150, speed: 950, life: 3.2, grav: 900, colors: CONF, size: [5, 10], shape: "rect", spread: [-Math.PI * 0.95, -Math.PI * 0.05] });
      burst({ seed: 72, t0: tp + 0.15, x: 1400, y: 380, n: 110, speed: 850, life: 3.0, grav: 900, colors: CONF, size: [5, 10], shape: "rect", spread: [-Math.PI * 0.95, -Math.PI * 0.05] });
      el.innerHTML = `
        <div class="world abs" style="width:1920px;height:2160px">
          <div class="top abs" style="width:1920px;height:1080px">${topHTML}</div>
          <div class="bot abs" style="top:1080px;width:1920px;height:1080px;background:#0F1B33">
            <svg class="abs" width="1920" height="1080" style="opacity:.18"><defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0 H0 V60" fill="none" stroke="#3FD0C9" stroke-width=".6"/></pattern></defs><rect width="1920" height="1080" fill="url(#grid)"/></svg>
            <div class="L-vault abs" style="width:1920px;height:1000px">${vaultHTML}</div>
            <div class="L-arch abs" style="width:1920px;height:1000px">${archHTML}</div>
            <div class="L-cam abs" style="width:1920px;height:1000px">${camaraHTML}</div>
          </div>
          <svg class="ov abs" width="1920" height="2160" viewBox="0 0 1920 2160">
            <g class="threads">${[0, 1, 2, 3, 4].map((i) => `<path d="M${1330 + i * 35} 1010 V1190" stroke="#3FD0C9" stroke-width="3" stroke-dasharray="10 14" opacity=".8"/>`).join("")}</g>
            <line x1="0" y1="1080" x2="1920" y2="1080" stroke="#3FD0C9" stroke-width="3"/>
            <line x1="0" y1="1080" x2="1920" y2="1080" stroke="#3FD0C9" stroke-width="12" opacity=".18"/>
            <g class="env"><rect x="-34" y="-24" width="68" height="48" rx="6" fill="#F2EEE6" stroke="#E8B44A" stroke-width="3"/><path d="M-34 -22 L0 6 L34 -22" stroke="#E8B44A" stroke-width="3" fill="none"/><circle r="40" fill="url(#gGlow)"/></g>
          </svg>
          <div class="mono abs" style="left:40px;top:1036px;font-size:17px;letter-spacing:.12em;color:#8E8A80">O QUE A INÊS VÊ</div>
          <div class="mono abs" style="left:40px;top:1098px;font-size:17px;letter-spacing:.12em;color:#5E7096">O QUE ACONTECE NA CÂMARA</div>
        </div>`;
      const r = el;
      return {
        armL: q(r, ".ines-b .arm-l"), armR: q(r, ".ines-b .arm-r"), phone: q(r, ".phone"),
        world: q(r, ".world"), inesA: q(r, ".ines-a"), inesB: q(r, ".ines-b"), sphone: q(r, ".sphone"), cup: q(r, ".cup"), steam: q(r, ".steam"), spark: qa(r, ".spark path"),
        cal: q(r, ".cal"), calD: q(r, ".cal-d"), yes: q(r, ".yes"),
        msgs: MSG.map((m, i) => q(r, ".m" + i)), typ: MSG.map((m, i) => q(r, ".ty" + i)), feed: q(r, ".feed-in"), itxt: q(r, ".itxt"), ph: q(r, ".ph"), status: q(r, ".status"),
        chips: [0, 1, 2, 3].map((k) => q(r, ".m3 .c" + k)), btn: q(r, ".m2 .btn-chat"),
        cmd: q(r, ".cmd"), pins: qa(r, ".cmd .pin > div"), okb: q(r, ".okb"),
        threads: q(r, ".threads"), env: q(r, ".env"),
        // cofre
        Lv: q(r, ".L-vault"), vhex: q(r, ".vhex"), ved: qa(r, ".ved"), beam: q(r, ".beam"), shackle: q(r, ".shackle"), vkey: q(r, ".vkey"), vglow: q(r, ".vglow"),
        vnode: q(r, ".vnode .ni"), vn: qa(r, ".vn"), fly: qa(r, ".fly"), pack: q(r, ".pack"), afv: q(r, ".afvi"),
        // arquitetura
        La: q(r, ".L-arch"), ab: qa(r, ".L-arch .ab"), cn: qa(r, ".L-arch .cn"), ag: qa(r, ".L-arch .ag"), gate: qa(r, ".L-arch .gate"), sys: qa(r, ".L-arch .sys"),
        sup: q(r, ".L-arch .sup"), supl: q(r, ".L-arch .sup-l"), ck: qa(r, ".L-arch .ck"), blk: q(r, ".L-arch .blk"), alog: q(r, ".L-arch .alog"), pl: qa(r, ".L-arch .pl"),
        hl: q(r, ".L-arch .hl"), ly: qa(r, ".L-arch .ly"), ff: qa(r, ".L-arch .ff"), afa: q(r, ".L-arch .afa > g"),
        paths: Object.fromEntries(["ca0", "ca1", "ca2", "ca3", "cg0", "cg1", "cg2", "cs0", "cs1", "cs2", "cs3"].map((k) => [k, q(r, "#" + k)])),
        // câmara
        Lc: q(r, ".L-cam"), bld: q(r, ".bld"), office: q(r, ".office"), rows: qa(r, ".row"), scan: q(r, ".scan"), prop: q(r, ".prop"), vbtn: q(r, ".vbtn"), stamp: q(r, ".stamp"),
        malog: q(r, ".malog"), marm: q(r, ".marm"), mon: q(r, ".mon"),
      };
    },
    update(t, c) {
      // ---------- câmara ----------
      c.world.style.transform = `translateY(${-camY(t)}px)`;
      const working = win(t, W("06", "do") - 0.6, W("08", "minutos"), 0.5, 0.6) + win(t, W("09", "onde") - 0.9, W("10", "dias"), 0.5, 0.6);
      O(c.threads, clamp(working));
      c.threads.style.strokeDashoffset = String(-t * 60);
      qa(c.threads, "path").forEach((p) => (p.style.strokeDashoffset = String(-t * 60)));

      // ---------- Inês ----------
      const happy = P(t, W("10", "pode") - 0.1, 0.4, ease.lin);
      O(c.inesA, 1 - happy); O(c.inesB, happy);
      // salta de braços no ar
      const tp = W("10", "pode");
      const up = P(t, tp - 0.05, 0.35, ease.back) * (1 - P(t, tp + 1.9, 0.6, ease.io));
      c.armL.style.transform = `rotate(${150 * up}deg)`;
      c.armR.style.transform = `rotate(${-150 * up}deg)`;
      const jt = (t - tp) / 0.55;
      const jump = jt > 0 && jt < 2 ? Math.abs(Math.sin(Math.PI * Math.min(jt, 2) / 1)) * (jt < 1 ? 34 : 14) : 0;
      c.inesB.setAttribute("transform", `translate(0 ${-jump})`);
      c.inesA.setAttribute("transform", `translate(0 ${-jump})`);
      // brilho do telemóvel quando chega uma mensagem
      const glow = Math.max(0, ...[tM2, tM3, tM4].map((tm) => (t >= tm - 0.1 && t < tm + 0.9 ? 1 - (t - tm + 0.1) / 1.0 : 0)));
      c.phone.style.boxShadow = `0 40px 80px rgba(15,27,51,.25), 0 0 ${90 * glow}px rgba(63,208,201,${0.75 * glow})`;
      const tPut = W("05b", "e") - 0.1;
      const put = P(t, tPut, 0.8, ease.io);
      S(c.sphone, { x: L(588, 740, put), y: L(770, 742, put) - Math.sin(put * Math.PI) * 40, r: L(-12, 80, put) });
      const cupIn = P(t, tPut + 0.6, 0.5, ease.out);
      const toTable = P(t, W("10", "pode") - 0.45, 0.4, ease.io);
      S(c.cup, { x: L(590, 712, toTable), y: L(768, 734, toTable) - Math.sin(toTable * Math.PI) * 30, s: L(0.6, 1, cupIn), o: cupIn });
      c.steam.style.transform = `translateY(${Math.sin(t * 2) * 3}px)`; O(c.steam, 0.5 + 0.4 * Math.sin(t * 1.7));
      c.spark.forEach((s, i) => { const p = P(t, W("10", "pode") + i * 0.08, 0.5, ease.back); const f = 1 - P(t, W("10", "pode") + 1.6 + i * 0.1, 0.6, ease.lin); S(s, { s: p * (0.8 + 0.2 * Math.sin(t * 6 + i)), o: Math.min(p, f) }); });
      // calendário (dias depois)
      const cal = win(t, W("10", "dias") - 0.6, W("10", "pode") - 0.2, 0.3, 0.3);
      S(c.cal, { y: L(30, 0, P(t, W("10", "dias") - 0.6, 0.4)), o: cal });
      const d = Math.round(L(14, 28, P(t, W("10", "dias") - 0.2, 1.6, ease.io)));
      if (c.calD.textContent !== String(d)) c.calD.textContent = d;
      const yes = P(t, W("10", "pode"), 0.5, ease.back);
      S(c.yes, { y: L(30, 0, yes), s: L(0.6, 1, yes) * (1 + 0.025 * Math.sin((t - tp) * 5) * (t > tp + 0.5 ? 1 : 0)), r: L(-6, 0, yes), o: Math.min(1, yes * 1.5) });

      // ---------- chat ----------
      const typing = t >= tType0 && t < tSend;
      const typed = INPUT_TXT.slice(0, Math.round(INPUT_TXT.length * P(t, tType0, tType1 - tType0, ease.lin)));
      const shown = t >= tSend ? "" : typed.length > 30 ? "…" + typed.slice(-30) : typed;
      if (c.itxt.textContent !== shown) c.itxt.textContent = shown;
      O(c.ph, typing && t > tType0 ? 0 : 1);
      c.itxt.style.display = typing ? "block" : "none";
      let shift = 0, afTyping = false;
      MSG.forEach((m, i) => {
        const b = c.msgs[i], ty = c.typ[i];
        const tyOn = m.typing && t >= m.t - m.typing && t < m.t;
        if (ty) { ty.style.display = tyOn ? "flex" : "none"; if (tyOn) { afTyping = true; qa(ty, "b").forEach((d, k) => (d.style.transform = `translateY(${Math.sin(t * 10 - k * 0.8) * -4}px)`)); } }
        const vis = t >= m.t;
        b.style.display = vis ? "block" : "none";
        if (vis) {
          const p = P(t, m.t, 0.45, ease.out);
          b.style.transformOrigin = m.cls === "me" ? "100% 100%" : "0% 100%";
          S(b, { s: L(0.85, 1, p), o: Math.min(1, p * 2) });
          if (p < 1) shift += (b.offsetHeight + 14) * (1 - p);
        }
      });
      c.feed.style.transform = `translateY(${shift}px)`;
      c.status.textContent = afTyping ? "a escrever…" : "online";
      c.status.style.color = afTyping ? "#1FA7B5" : "#6B7488";
      // chips da mensagem final
      const ct = [W("10", "pode"), W("10", "fonte"), W("10", "recibo"), W("10", "proximos")];
      c.chips.forEach((ch, i) => { if (!ch) return; const p = P(t, ct[i] - 0.1, 0.4, ease.back); ch.style.display = "inline-flex"; S(ch, { s: i === 0 ? 1 : L(0.6, 1, p), o: i === 0 ? 1 : Math.min(1, p * 2) }); });
      // botão "Rever e confirmar" e Chave Móvel Digital
      if (c.btn) { const pr = t > tTap - 0.15 && t < tTap + 0.25; c.btn.style.background = pr ? "#3FD0C9" : "#E3F7F6"; c.btn.style.color = pr ? "#0F1B33" : "#0E7C77"; }
      const cm = P(t, tTap + 0.2, 0.45, ease.out);
      const cmOut = P(t, W("09", "onde") + 2, 0.4, ease.lin);
      S(c.cmd, { y: L(860, 0, cm), o: cm > 0 && cmOut < 1 ? 1 : 0 });
      c.pins.forEach((p, i) => O(p, t > tPin0 + 0.2 + i * 0.22 ? 1 : 0));
      const ok = P(t, tOk, 0.4, ease.back); S(c.okb, { s: L(0.7, 1, ok), o: ok });
      // envelope desce pela linha
      const e1 = P(t, tOk + 0.3, 1.3, ease.io), e2 = P(t, W("09", "onde") + 0.35, 0.6, ease.in);
      const ex = L(1400, 960, e1), ey = L(820, 1500, e1) + e2 * 290;
      S(c.env, { x: ex, y: ey, s: L(1, 0.4, e2), o: e1 > 0 && e2 < 1 ? 1 : 0 });

      // =================== COFRE ===================
      const vOn = win(t, W("06", "do") - 0.6, W("07", "em") + 0.8, 0.4, 0.6);
      O(c.Lv, vOn);
      if (vOn > 0) {
        const t6 = W("06", "do");
        D(c.vhex, P(t, t6 + 0.2, 1.2, ease.io));
        O(c.vglow, P(t, t6 + 0.6, 1, ease.lin) * (0.7 + 0.3 * Math.sin(t * 2)));
        c.ved.forEach((e, i) => D(e, P(t, t6 + 1.0 + i * 0.1, 0.6, ease.io)));
        c.vnode.style.transform = `translate(-50%,-50%) scale(${P(t, t6 + 0.8, 0.5, ease.back)})`; O(c.vnode, P(t, t6 + 0.8, 0.3, ease.lin));
        const tAbre = W("06", "abre"), tCtrl = W("06", "controlado"), tRet = W("06", "retira"), tMais = W("06", "mais");
        S(c.afv, { s: P(t, tAbre - 0.6, 0.5, ease.back), o: P(t, tAbre - 0.6, 0.3, ease.lin) });
        D(c.beam, P(t, tAbre - 0.1, 0.7, ease.io) * (1 - P(t, tMais + 0.4, 0.5, ease.lin)));
        const open = P(t, tAbre + 0.4, 0.4, ease.back) * (1 - P(t, W("06", "cofre", 2) - 0.1, 0.4, ease.io));
        S(c.shackle, { y: -14 * open, r: 0 });
        S(c.vkey, { x: L(-20, 0, P(t, tCtrl, 0.5)), o: P(t, tCtrl, 0.4, ease.lin) });
        const selT = [W("06", "terreno"), W("06", "pretensao"), W("06", "planta")];
        let si = 0;
        NODES.forEach((n, i) => {
          const wrap = c.vn[i], inner = q(wrap, ".ni"), lock = q(wrap, ".np");
          const pop = P(t, t6 + 1.1 + i * 0.12, 0.5, ease.back);
          inner.style.transform = `translate(-50%,-50%) scale(${pop})`; O(inner, Math.min(1, pop * 2));
          if (n.sel) {
            const st = selT[si];
            const lit = P(t, st - 0.1, 0.3, ease.lin);
            inner.style.borderColor = lit > 0.5 ? "#E8B44A" : "rgba(232,180,74,.6)";
            inner.style.background = lit > 0.5 ? "#3A3420" : "#16264A";
            // cópia voa para o pacote
            const fl = c.fly[si], fp = P(t, st + 0.05, 0.75, ease.io), [sx, sy] = SLOT(si);
            S(fl, { x: L(n.x - 140, sx, fp), y: L(n.y - 22, sy, fp), s: L(0.9, 1, fp), o: t > st ? 1 : 0 });
            si++;
            O(lock, 0);
          } else {
            const pr = P(t, tMais - 0.1, 0.4, ease.lin);
            O(lock, pr);
            inner.style.opacity = String(Math.min(1, pop * 2) * L(1, 0.45, pr));
          }
        });
        S(c.pack, { x: L(40, 0, P(t, tRet - 0.3, 0.6)), o: P(t, tRet - 0.3, 0.5, ease.lin) });
      }

      // =================== ARQUITETURA ===================
      const aOn = win(t, W("07", "em") - 0.1, W("08", "minutos") + 0.6, 0.5, 0.3);
      O(c.La, aOn);
      if (aOn > 0) {
        const t7 = W("07", "em");
        const order = [t7 + 0.2, t7 + 0.3, t7 + 0.5, t7 + 0.9, t7 + 1.2];
        // aparecer dos blocos por ordem de leitura
        const tAg = W("07", "agentes");
        c.ab.forEach((b) => {
          let ts = t7 + 0.2;
          if (b.classList.contains("mo")) ts = t7 + 0.5;
          if (b.classList.contains("or")) ts = t7 + 0.9;
          if (b.classList.contains("ag")) ts = tAg + 0.25 * +b.dataset.i;
          if (b.classList.contains("bar") || b.classList.contains("gate") || b.classList.contains("label-sm")) ts = tAg + 1.0 + 0.1 * (+b.dataset.i || 0);
          if (b.classList.contains("sys")) ts = tAg + 1.5 + 0.12 * +b.dataset.i;
          if (b.classList.contains("audit")) ts = tAg + 2.0;
          if (b.classList.contains("sup")) ts = tAg + 2.2;
          if (b.querySelector && b.querySelector(".ck")) ts = 0;
          const p = P(t, ts, 0.5, ease.back);
          if (ts) S(b, { y: L(24, 0, p), o: Math.min(1, p * 2) * (b.classList.contains("sup") ? L(0.45, 1, P(t, W("07", "supervisor") - 0.1, 0.3, ease.lin)) : 1) });
        });
        S(c.afa, { s: P(t, t7 + 0.2, 0.5, ease.back) });
        // ligações
        c.cn.forEach((p) => {
          let ts = t7 + 0.4;
          if (p.classList.contains("c-mo")) ts = t7 + 0.8;
          if (p.classList.contains("c-ag")) ts = tAg;
          if (p.classList.contains("c-ag3")) ts = W("07", "nenhum") - 0.2;
          if (p.classList.contains("c-gt") || p.classList.contains("c-sy")) ts = tAg + 1.2;
          D(p, P(t, ts, 0.6, ease.io));
          if (p.classList.contains("c-ag3")) { p.style.stroke = "#E5484D"; p.style.strokeDasharray = "1 1"; }
        });
        // agentes acendem quando são nomeados
        const agT = [W("07", "le"), W("07", "cruza"), W("07", "prepara")];
        c.ag.forEach((a, i) => {
          const lit = win(t, agT[i] - 0.4, agT[i] + 2.6, 0.2, 0.5);
          a.style.borderColor = `rgba(63,208,201,${0.35 + 0.65 * lit})`;
          a.style.boxShadow = lit > 0 ? `0 0 ${40 * lit}px rgba(63,208,201,${0.5 * lit})` : "none";
          a.style.background = lit > 0.3 ? "#1B3A5E" : "rgba(22,38,74,.92)";
        });
        // portas de integração
        c.gate.forEach((g, i) => {
          if (i < 3) {
            const fl = win(t, agT[i] + 0.4, agT[i] + 1.4, 0.1, 0.4);
            g.style.background = fl > 0 ? `rgba(91,191,122,${0.35 * fl})` : "#0F1B33";
            g.style.borderColor = fl > 0.3 ? "#5BBF7A" : "#3FD0C9";
          } else {
            const bl = P(t, W("07", "passa") - 0.1, 0.2, ease.lin);
            g.style.background = bl > 0 ? `rgba(229,72,77,${0.35 * bl})` : "#0F1B33";
            g.style.borderColor = bl > 0.5 ? "#E5484D" : "#3FD0C9";
            g.style.color = bl > 0.5 ? "#FFD2D3" : "#BFEDEA";
            g.style.transform = bl > 0 && bl < 1 ? `translateX(${Math.sin(t * 70) * 5}px)` : "none";
          }
        });
        const bk = P(t, W("07", "passa"), 0.4, ease.back);
        S(c.blk, { s: L(0.6, 1, bk), o: Math.min(1, bk * 2) });
        // sistemas: animações internas
        const hlp = P(t, W("07", "versao") - 0.2, 0.4, ease.lin);
        c.hl.style.background = `rgba(91,191,122,${0.3 * hlp})`; O(c.hl, L(0.25, 1, hlp));
        c.ly.forEach((l, k) => { const p = P(t, W("07", "plantas") + k * 0.45, 0.3, ease.lin); l.style.background = p > 0.5 ? "rgba(91,191,122,.25)" : "#E6E0D3"; O(q(l, ".lyk"), p); });
        c.ff.forEach((f, k) => { const p = P(t, W("07", "prepara") + k * 0.25, 0.3, ease.lin); f.style.borderColor = p > 0.5 ? "#5BBF7A" : "#CFC7B6"; O(q(f, "b"), p); });
        // supervisor
        const sp = P(t, W("07", "supervisor") - 0.1, 0.4, ease.lin);
        c.sup.style.boxShadow = sp > 0 ? `0 0 ${50 * sp}px rgba(232,180,74,${0.45 * sp})` : "none";
        D(c.supl, P(t, W("07", "supervisor") + 0.1, 0.9, ease.io));
        O(c.supl, 0.8);
        const ckT = [W("07", "finalidade"), W("07", "autorizacao"), W("07", "registo")];
        c.ck.forEach((k, i) => { const p = P(t, ckT[i] - 0.1, 0.4, ease.back); S(k, { s: L(0.5, 1, p), o: Math.min(1, p * 2) }); });
        // impulsos de dados
        const runs = [
          ["ca0", agT[0] - 0.3], ["cg0", agT[0] + 0.2], ["cs0", agT[0] + 0.6],
          ["ca1", agT[1] - 0.3], ["cg1", agT[1] + 0.2], ["cs1", agT[1] + 0.6],
          ["ca2", agT[2] - 0.3], ["cg2", agT[2] + 0.2], ["cs2", agT[2] + 0.6],
          ["ca3", W("07", "nenhum") + 0.1],
        ];
        let used = 0;
        for (const [k, ts] of runs) {
          const p = (t - ts) / 0.55;
          if (p < 0 || p > 1 || used >= c.pl.length) continue;
          const path = c.paths[k], len = path.getTotalLength(), pt = path.getPointAtLength(len * ease.io(p));
          const dot = c.pl[used++];
          dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y); dot.style.opacity = 1; dot.setAttribute("fill", k === "ca3" ? "#FF8A8D" : "#7AF0E8");
        }
        for (let i = used; i < c.pl.length; i++) c.pl[i].style.opacity = 0;
        // registo de auditoria
        const lines = AUDIT.filter((a) => t >= a.t).slice(-3);
        const html = lines.map((a) => `<div style="${a.red ? "color:#FF8A8D" : ""}">${a.s.replace(/ /g, "&nbsp;")}</div>`).join("");
        if (c.alog._h !== html) { c.alog.innerHTML = html; c.alog._h = html; }
      }

      // =================== CÂMARA ===================
      const cOn = win(t, W("09", "onde") - 0.9, W("10", "dias") + 0.6, 0.4, 0.4);
      O(c.Lc, cOn);
      if (cOn > 0) {
        const t9 = W("09", "onde"), tMarta = W("09", "arquiteta");
        const zin = P(t, tMarta - 0.9, 0.9, ease.in);
        c.bld.style.transformOrigin = "1072px 465px";
        S(c.bld, { s: L(1, 7, zin), o: 1 - P(t, tMarta - 0.6, 0.3, ease.lin) });
        qa(c.bld, "[class^=win]").forEach((w, i) => (w.style.opacity = String(0.55 + 0.35 * Math.sin(t * 3 + i))));
        O(c.office, P(t, tMarta - 0.3, 0.45, ease.lin));
        const rowT = [W("09", "recebe"), W("09", "recebe") + 0.25, W("09", "caso"), W("09", "completo"), W("09", "fontes"), W("09", "dados")];
        c.rows.forEach((r, i) => { const p = P(t, rowT[i] - 0.1, 0.4); S(r, { x: L(-20, 0, p), o: p }); });
        const scan = P(t, W("09", "analisa") - 0.1, 1.0, ease.io);
        c.scan.style.top = `${L(56, 56 + 46 * 5, scan)}px`;
        O(c.scan, win(t, W("09", "analisa") - 0.1, W("09", "valida") + 0.1, 0.2, 0.3));
        const press = win(t, W("09", "valida") - 0.05, W("09", "valida") + 0.25, 0.05, 0.1);
        const okv = P(t, W("09", "valida") + 0.2, 0.3, ease.lin);
        c.vbtn.style.transform = `scale(${1 - 0.06 * press})`;
        c.vbtn.style.background = okv > 0.5 ? "#5BBF7A" : "#3FD0C9";
        c.vbtn.textContent = okv > 0.5 ? "Validado ✓" : "Validar";
        S(c.prop, { y: L(14, 0, P(t, W("09", "propoe") - 0.1, 0.4)), o: P(t, W("09", "propoe") - 0.1, 0.4, ease.lin) });
        const stp = P(t, W("09", "tudo") - 0.05, 0.35, ease.out);
        S(c.stamp, { s: L(2, 1, stp), r: -6, o: stp });
        S(c.malog, { y: L(20, 0, P(t, W("09", "registado") - 0.2, 0.4)), o: P(t, W("09", "registado") - 0.2, 0.4, ease.lin) });
        // braço da Marta aponta para o ecrã durante a análise
        const pt = win(t, W("09", "analisa") - 0.2, W("09", "valida") + 0.6, 0.3, 0.4);
        c.marm.style.transformOrigin = "0% 0%";
        c.marm.style.transform = `rotate(${-14 * pt}deg)`;
      }
    },
  });
})();
