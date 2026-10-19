"""Mistura final: voz + banda sonora original (com automação e ducking) + efeitos sonoros.

Entradas: audio/voz.wav, audio/musica.mp3, audio/sfx/*.mp3, audio/cues.json (exportado da animação
com `node tools/render.mjs --cues`), audio/timeline.json
Saída: audio/mix.wav (-16 LUFS)
"""
import json
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, "audio", *p)
TOTAL = 180.0
SFX_DB = -9.0  # nível geral dos efeitos face à voz


def gain_expr(points):
    """Expressão ffmpeg para um envelope linear em dB definido por (t, dB)."""
    expr = f"{10 ** (points[-1][1] / 20):.5f}"
    for (t0, d0), (t1, d1) in reversed(list(zip(points, points[1:]))):
        g0, g1 = 10 ** (d0 / 20), 10 ** (d1 / 20)
        seg = f"({g0:.5f}+({g1:.5f}-{g0:.5f})*(t-{t0:.3f})/{max(t1 - t0, 0.001):.3f})"
        expr = f"if(lt(t,{t1:.3f}),{seg},{expr})"
    return expr


def main():
    tl = {b["id"]: b for b in json.load(open(A("timeline.json")))["blocos"]}
    cues = json.load(open(A("cues.json")))
    s03, s04, s10, s14 = tl["03"]["start"], tl["04"]["start"], tl["10"]["start"], tl["14"]["start"]
    # automação da música (dB): o insight "suspende a respiração" antes da revelação; sobe no clímax e no fecho
    env = [
        (0, -4), (s03 - 0.5, -4), (s03 + 1.5, -9), (s04 - 1.8, -11), (s04 - 0.6, -16), (s04 + 0.2, -2),
        (s10 - 0.5, -2), (s10 + 3.0, 1), (s10 + 7.5, 0), (s14 - 0.6, 0), (s14 + 0.4, 2), (TOTAL, 2),
    ]
    inputs = ["-i", A("voz.wav"), "-i", A("musica.mp3")]
    f = [
        "[0:a]aresample=48000,asplit=2[vsc][vout]",
        f"[1:a]aresample=48000,volume='{gain_expr(env)}':eval=frame,apad,atrim=0:{TOTAL}[mus]",
        # ducking moderado: a música respira por baixo da voz sem desaparecer
        "[mus][vsc]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=500:makeup=1[duck]",
    ]
    labels = []
    for i, c in enumerate(cues):
        path = A("sfx", f"{c['name']}.mp3")
        if not os.path.exists(path):
            print("aviso: sfx em falta", c["name"]); continue
        k = len(inputs) // 2
        inputs += ["-i", path]
        ms = max(0, int(round(c["t"] * 1000)))
        db = SFX_DB + 20 * __import__("math").log10(max(c["gain"], 0.01))
        f.append(f"[{k}:a]aresample=48000,pan=stereo|c0=c0|c1=c0,volume={db:.2f}dB,adelay={ms}|{ms}[s{i}]")
        labels.append(f"[s{i}]")
    f.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:duration=longest,apad,atrim=0:{TOTAL}[sfx]")
    f.append(f"[duck][vout][sfx]amix=inputs=3:normalize=0:duration=first,atrim=0:{TOTAL},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[out]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(f), "-map", "[out]", "-ar", "48000", "-ac", "2", A("mix.wav")], check=True)
    print(f"ok: audio/mix.wav ({len(labels)} efeitos)")


if __name__ == "__main__":
    main()
