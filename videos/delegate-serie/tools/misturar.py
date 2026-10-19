"""Mistura final de um vídeo: voz + banda sonora original (automação e ducking) + efeitos sonoros.

Uso: python3 tools/misturar.py v1|v2|v3
Entradas: <v>/audio/voz.wav, musica.mp3, cues.json (de `node tools/render.mjs <v> --cues`), timeline.json; audio/sfx/*.mp3
Saída: <v>/audio/mix.wav (-16 LUFS)
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SFX_DB = -9.0  # nível geral dos efeitos face à voz


def gain_expr(points):
    """Expressão ffmpeg para um envelope linear em dB definido por (t, dB)."""
    expr = f"{10 ** (points[-1][1] / 20):.5f}"
    for (t0, d0), (t1, d1) in reversed(list(zip(points, points[1:]))):
        g0, g1 = 10 ** (d0 / 20), 10 ** (d1 / 20)
        seg = f"({g0:.5f}+({g1:.5f}-{g0:.5f})*(t-{t0:.3f})/{max(t1 - t0, 0.001):.3f})"
        expr = f"if(lt(t,{t1:.3f}),{seg},{expr})"
    return expr


# automação da música (dB) por vídeo, em função dos blocos da narração
def envelope(v, tl, total):
    s = lambda i: tl[i]["start"]
    if v == "v1":  # melancólico: a música respira nas pausas e fica quase só no fim
        return [(0, -3), (s("3") - 1, -4), (s("6"), -4), (s("8") - 0.5, -6), (total, -6)]
    if v == "v2":  # alegre: sobe no final emocionante
        return [(0, -3), (s("8") - 1.0, -3), (s("8") + 1.5, 1), (total, 1)]
    return [(0, -4), (s("1") - 1, -4), (s("8") - 1, -2), (s("8") + 1, 1), (total, 1)]


def main():
    v = sys.argv[1]
    A = lambda *p: os.path.join(ROOT, v, "audio", *p)
    SFXDIR = os.path.join(ROOT, "audio", "sfx")
    tlj = json.load(open(A("timeline.json")))
    TOTAL = tlj["total"]
    tl = {b["id"]: b for b in tlj["blocos"]}
    cues = json.load(open(A("cues.json")))
    env = envelope(v, tl, TOTAL)
    inputs = ["-i", A("voz.wav"), "-i", A("musica.mp3")]
    f = [
        "[0:a]aresample=48000,asplit=2[vsc][vout]",
        f"[1:a]aresample=48000,volume='{gain_expr(env)}':eval=frame,apad,atrim=0:{TOTAL},afade=t=out:st={TOTAL - 2.5}:d=2.5[mus]",
        # ducking moderado: a música respira por baixo da voz sem desaparecer
        "[mus][vsc]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=500:makeup=1[duck]",
    ]
    labels = []
    for i, c in enumerate(cues):
        path = os.path.join(SFXDIR, f"{c['name']}.mp3")
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
    print(f"ok: {v}/audio/mix.wav ({len(labels)} efeitos)")


if __name__ == "__main__":
    main()
