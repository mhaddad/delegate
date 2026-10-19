"""Monta index.html (cenas + transições + áudio) e compositions/captions.html a partir de audio/timing.json."""
import json, re
from pathlib import Path

P = Path(__file__).resolve().parent.parent
T = json.loads((P / "audio/timing.json").read_text())
SC = T["scenes"]
TOTAL = T["total"]
HOLD = 0.9  # a cena que sai fica montada mais 0,9 s por baixo da que entra

# transição de entrada de cada cena (índice = n da cena que entra)
TRANS = {
    1: ("fadein", 0.9),
    2: ("cut", 0.0),
    3: ("cover-up", 0.55),
    4: ("blur-cross", 0.6),
    5: ("flip", 0.7),
    6: ("zoom-through", 0.6, "50% 48%"),
    7: ("blur-cross", 0.5),
    8: ("dive-down", 0.75),
    9: ("zoom-through", 0.6, "71% 14%"),
    10: ("cross", 0.35),
    11: ("rise-up", 0.75),
    12: ("zoom-out", 0.65, "37% 57%"),
    13: ("cross-scale", 0.5),
    14: ("cross", 0.9),
}


def f(x):
    return f"{x:.3f}".rstrip("0").rstrip(".")


def transition_js(n):
    kind, d, *rest = TRANS[n]
    cur, prev, t = f"#slot-{n:02d}", f"#slot-{n-1:02d}", SC[n - 1]["start"]
    o = rest[0] if rest else "50% 50%"
    js = []
    def out(fr, to, ease="power2.inOut"):
        js.append(f'tl.fromTo("{prev}", {fr}, {{...{to}, duration: {d}, ease: "{ease}", immediateRender: false}}, {f(t)});')
    def inn(fr, to, ease="power2.out"):
        js.append(f'tl.fromTo("{cur}", {fr}, {{...{to}, duration: {d}, ease: "{ease}", immediateRender: false}}, {f(t)});')
    if kind == "fadein":
        js.append(f'tl.fromTo("{cur}", {{opacity: 0}}, {{opacity: 1, duration: {d}, ease: "power1.out"}}, 0);')
        return js
    if kind == "cut":
        pass
    elif kind == "cover-up":
        out("{scale: 1, filter: 'brightness(1)'}", "{scale: 0.92, filter: 'brightness(0.55)'}", "power2.in")
        inn("{yPercent: 100}", "{yPercent: 0}", "power3.out")
    elif kind == "blur-cross":
        out("{opacity: 1, filter: 'blur(0px)'}", "{opacity: 0, filter: 'blur(14px)'}")
        inn("{opacity: 0, filter: 'blur(14px)'}", "{opacity: 1, filter: 'blur(0px)'}")
    elif kind == "flip":
        js.append(f'tl.fromTo("{prev}", {{rotationY: 0, opacity: 1}}, {{rotationY: -90, opacity: 0.6, duration: {d/2}, ease: "power2.in", immediateRender: false}}, {f(t)});')
        js.append(f'tl.fromTo("{cur}", {{rotationY: 90}}, {{rotationY: 0, duration: {d/2}, ease: "power2.out", immediateRender: false}}, {f(t + d/2)});')
        js.append(f'tl.fromTo("{cur}", {{opacity: 0}}, {{opacity: 1, duration: 0.01, immediateRender: false}}, {f(t + d/2)});')
    elif kind == "zoom-through":
        js.append(f'tl.set("{prev}", {{transformOrigin: "{o}"}}, {f(t)});')
        out("{scale: 1, opacity: 1, filter: 'blur(0px)'}", "{scale: 2.6, opacity: 0, filter: 'blur(6px)'}", "power3.in")
        inn("{scale: 1.12, opacity: 0}", "{scale: 1, opacity: 1}", "power3.out")
    elif kind == "dive-down":
        out("{yPercent: 0}", "{yPercent: -100}", "power3.inOut")
        inn("{yPercent: 100}", "{yPercent: 0}", "power3.inOut")
    elif kind == "rise-up":
        out("{yPercent: 0}", "{yPercent: 100}", "power3.inOut")
        inn("{yPercent: -100}", "{yPercent: 0}", "power3.inOut")
    elif kind == "zoom-out":
        js.append(f'tl.set("{prev}", {{transformOrigin: "{o}"}}, {f(t)});')
        out("{scale: 1, opacity: 1}", "{scale: 0.12, opacity: 0}", "power3.in")
        inn("{opacity: 0}", "{opacity: 1}", "power1.out")
    elif kind == "cross":
        inn("{opacity: 0}", "{opacity: 1}", "sine.inOut")
    elif kind == "cross-scale":
        inn("{opacity: 0, scale: 1.08}", "{opacity: 1, scale: 1}", "power2.out")
    # a cena que sai desaparece no fim da transição (seek-safe: set no tempo absoluto)
    js.append(f'tl.set("{prev}", {{opacity: 0}}, {f(t + max(d, 0.0) + 0.01)});')
    return js


def index_html():
    slots, audio, js = [], [], []
    for s in SC:
        n = s["n"]
        last = n == len(SC)
        dur = s["duration"] + (0 if last else HOLD)
        slots.append(f'''      <div class="slot" id="slot-{n:02d}" style="z-index:{n}">
        <div class="clip" id="scene-{s['id']}" data-composition-id="{s['id']}" data-composition-src="compositions/frames/{s['id']}.html"
          data-start="{f(s['start'])}" data-duration="{f(dur)}" data-track-index="{1 if n % 2 else 2}" data-width="1920" data-height="1080"></div>
      </div>''')
        audio.append(f'''      <audio id="vo-{n:02d}" src="{s['vo_src']}" data-start="{f(s['start'] + s['vo_offset'])}" data-duration="{f(s['vo_duration'])}" data-track-index="10" data-volume="1"></audio>''')
        js += transition_js(n)
    # fecho: escurece suavemente nos últimos 0,6 s (só a cena final tem exit)
    js.append(f'tl.fromTo("#slot-14", {{opacity: 1}}, {{opacity: 0, duration: 0.6, ease: "power1.in", immediateRender: false}}, {f(TOTAL - 0.6)});')
    js_body = "\n      ".join(js)
    return f'''<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0B0F17; }}
      #root {{ position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #0B0F17; perspective: 2400px; }}
      .slot {{ position: absolute; inset: 0; width: 1920px; height: 1080px; overflow: hidden; transform-style: preserve-3d; backface-visibility: hidden; }}
      .clip {{ position: absolute; inset: 0; }}
      #captions-host {{ z-index: 100; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{f(TOTAL)}" data-width="1920" data-height="1080">
{chr(10).join(slots)}
      <div class="clip" id="captions-host" data-composition-id="captions" data-composition-src="compositions/captions.html"
        data-start="0" data-duration="{f(TOTAL)}" data-track-index="20" data-track-kind="captions" data-width="1920" data-height="1080"></div>
{chr(10).join(audio)}
      <audio id="bgm" src="audio/music/bgm.wav" data-start="0" data-duration="{f(TOTAL)}" data-track-index="11" data-volume="0.55"></audio>
      <audio id="sfx" src="audio/music/sfx.wav" data-start="0" data-duration="{f(TOTAL)}" data-track-index="12" data-volume="0.7"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
      {js_body}
      tl.set({{}}, {{}}, {f(TOTAL)});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''


def caption_groups():
    groups = []
    for s in SC:
        words = [w for w in s["words"] if re.search(r"\w", w["text"])]
        # 1) orações: corta em pontuação ou pausa > 0,35 s
        clauses, cur = [], []
        for i, w in enumerate(words):
            cur.append(w)
            nxt = words[i + 1] if i + 1 < len(words) else None
            gap = (nxt["abs"] - w["abs_end"]) if nxt else 9
            if nxt is None or w["text"][-1] in ".?!:;," or gap > 0.35:
                clauses.append(cur); cur = []
        # 2) junta orações curtas (<3 palavras) à seguinte quando cabem; divide as longas ao meio
        merged = []
        for c in clauses:
            if merged and len(merged[-1]) < 3 and len(merged[-1]) + len(c) <= 8 and merged[-1][-1]["text"][-1] not in ".?!":
                merged[-1] = merged[-1] + c
            else:
                merged.append(c)
        for c in merged:
            text_len = len(" ".join(x["text"] for x in c))
            parts = [c]
            if len(c) > 8 or text_len > 46:
                k = (len(c) + 1) // 2
                parts = [c[:k], c[k:]]
            for part in parts:
                groups.append({"text": " ".join(x["text"] for x in part), "start": part[0]["abs"] - 0.05, "end": part[-1]["abs_end"] + 0.25})
    for a, b in zip(groups, groups[1:]):
        if a["end"] > b["start"] - 0.02:
            a["end"] = b["start"] - 0.02
    return groups


def captions_html():
    groups = caption_groups()
    els = "\n".join(
        f'        <div class="cg" id="cg-{i}"><span>{g["text"]}</span></div>' for i, g in enumerate(groups))
    data = json.dumps([{"s": round(g["start"], 3), "e": round(g["end"], 3)} for g in groups])
    return f'''<!doctype html>
<html lang="pt-PT">
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        @font-face {{ font-family: "Hanken Grotesk"; src: url("assets/fonts/HankenGrotesk-var.woff2") format("woff2"); font-weight: 100 900; }}
        #root {{ position: absolute; inset: 0; width: 1920px; height: 1080px; pointer-events: none; }}
        .cg {{ position: absolute; left: 0; right: 0; bottom: 56px; height: 72px; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; }}
        .cg span {{ font-family: "Hanken Grotesk", sans-serif; font-weight: 500; font-size: 38px; line-height: 1; color: #FFFFFF;
          background: rgba(11, 15, 23, 0.72); padding: 14px 28px 16px; border-radius: 14px; max-width: 1640px; white-space: nowrap; letter-spacing: 0.005em; }}
      </style>
      <div id="root" data-composition-id="captions" data-width="1920" data-height="1080">
{els}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
      <script>
        (function () {{
          const G = {data};
          const tl = gsap.timeline({{ paused: true }});
          G.forEach(function (g, i) {{
            const el = "#cg-" + i;
            tl.set(el, {{ visibility: "visible" }}, g.s);
            tl.fromTo(el, {{ opacity: 0, y: 8 }}, {{ opacity: 1, y: 0, duration: 0.18, ease: "power2.out", immediateRender: false }}, g.s);
            tl.to(el, {{ opacity: 0, duration: 0.12, ease: "power2.in" }}, Math.max(g.s + 0.2, g.e - 0.12));
            tl.set(el, {{ opacity: 0, visibility: "hidden" }}, g.e);
          }});
          tl.set({{}}, {{}}, {f(TOTAL)});
          window.__timelines = window.__timelines || {{}};
          window.__timelines["captions"] = tl;
        }})();
      </script>
    </template>
  </body>
</html>
'''


(P / "index.html").write_text(index_html())
(P / "compositions").mkdir(exist_ok=True)
(P / "compositions/captions.html").write_text(captions_html())
g = caption_groups()
print("index + captions ok;", len(g), "grupos de legenda; maior:", max(len(x["text"]) for x in g), "caracteres")
