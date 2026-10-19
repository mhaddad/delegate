/* Liga o motor à página: seek global, pré-visualização (?t=, ?play) e selo "cenário demonstrativo". */
(function () {
  const { seek, onFrame, O, win, stage } = F;
  const badge = document.getElementById("badge");
  const vig = document.getElementById("vig"), grain = document.getElementById("grain");
  window.CUES = F.CUES;
  onFrame((t) => {
    const o = win(t, F.CUT.s05 + 0.3, F.CUT.s11, 0.6, 0.6); badge.style.display = o > 0 ? "block" : "none"; O(badge, o);
    // vinheta: mais fechada na memória e no labirinto, mais aberta na demo
    const C = F.CUT, V = [[0, 0.55], [C.s02, 0.55], [C.s02 + 1, 0.85], [C.s03, 0.85], [C.s03 + 1, 0.35], [C.s05, 0.35], [C.s05 + 1, 0.2], [C.s11, 0.2], [C.s11 + 1, 0.35], [C.s14, 0.35], [C.s14 + 1, 0.6], [180, 0.6]];
    let v = 0.4; for (let i = 0; i < V.length - 1; i++) if (t >= V[i][0] && t <= V[i + 1][0]) v = F.L(V[i][1], V[i + 1][1], (t - V[i][0]) / (V[i + 1][0] - V[i][0] || 1));
    vig.style.opacity = v;
    // grão de filme (posição pseudo-aleatória por quadro)
    const f = Math.round(t * 30), gx = (f * 97) % 64, gy = (f * 57) % 64;
    grain.style.transform = `translate(${-gx}px,${-gy}px)`;
    // fade final a negro
    stage.style.filter = t > 179.3 ? `brightness(${1 - F.P(t, 179.3, 0.7, F.ease.lin)})` : "";
  });

  window.seekTo = (t) => { seek(t); return true; };
  window.ready = document.fonts.ready.then(() => true);

  const fit = () => { const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `scale(${s})`; };
  const params = new URLSearchParams(location.search);
  if (!params.has("render")) { addEventListener("resize", fit); fit(); }
  let t = parseFloat(params.get("t") || "0");
  seek(t);
  if (params.has("play")) {
    const a = new Audio("../audio/mix.wav"); a.currentTime = t;
    document.body.addEventListener("click", () => { a.paused ? a.play() : a.pause(); });
    const loop = () => { seek(a.currentTime); document.getElementById("scrub").textContent = a.currentTime.toFixed(2); requestAnimationFrame(loop); };
    loop();
  }
})();
