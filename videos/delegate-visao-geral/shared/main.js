/* Liga o motor à página: seek global, pré-visualização (?t=, ?play), selo e ambiente.
   Cada vídeo pode definir antes deste ficheiro:
     window.BADGE = [a, b]            → intervalo do selo (texto em #badge)
     window.VIG = [[t, opacidade], …] → vinheta ao longo do tempo
*/
(function () {
  const { seek, onFrame, O, win, stage, L } = F;
  const TOTAL = F.TL.total;
  const badge = document.getElementById("badge");
  const vig = document.getElementById("vig"), grain = document.getElementById("grain");
  window.CUES = F.CUES;
  window.TOTAL = TOTAL;
  onFrame((t) => {
    if (badge) { const [a, b] = window.BADGE || [-1, -1]; const o = win(t, a, b, 0.6, 0.6); badge.style.display = o > 0 ? "block" : "none"; O(badge, o); }
    const V = window.VIG || [[0, 0.35], [TOTAL, 0.35]];
    let v = V[0][1]; for (let i = 0; i < V.length - 1; i++) if (t >= V[i][0] && t <= V[i + 1][0]) v = L(V[i][1], V[i + 1][1], (t - V[i][0]) / (V[i + 1][0] - V[i][0] || 1));
    vig.style.opacity = v;
    const f = Math.round(t * 30), gx = (f * 97) % 64, gy = (f * 57) % 64;
    grain.style.transform = `translate(${-gx}px,${-gy}px)`;
    // fade de entrada e de saída a negro
    const fade = Math.min(F.clamp(t / 0.5), F.clamp((TOTAL - t) / 0.7));
    stage.style.filter = fade < 1 ? `brightness(${fade})` : "";
  });
  window.seekTo = (t) => { seek(t); return true; };
  window.ready = document.fonts.ready.then(() => true);
  const fit = () => { const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `scale(${s})`; };
  const params = new URLSearchParams(location.search);
  if (!params.has("render")) { addEventListener("resize", fit); fit(); }
  const t0 = parseFloat(params.get("t") || "0");
  seek(t0);
  if (params.has("play")) {
    const a = new Audio("audio/mix.wav"); a.currentTime = t0;
    document.body.addEventListener("click", () => { a.paused ? a.play() : a.pause(); });
    const loop = () => { seek(a.currentTime); document.getElementById("scrub").textContent = a.currentTime.toFixed(2); requestAnimationFrame(loop); };
    loop();
  }
})();
