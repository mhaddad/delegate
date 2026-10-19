"""Monta a linha de tempo da voz.

Saída:
  audio/timeline.json  — início/fim de cada bloco + tempos de cada palavra (já com tempo acelerado)
  audio/voz.wav        — voz posicionada na linha de tempo
"""
import json
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = os.path.join(ROOT, "audio", "vo")
TOTAL = 180.0
TEMPO = 1.06  # aceleração ligeira da voz
START = 0.8
FIM_VOZ = 177.6  # a voz termina aqui; o resto é o cartão final

ORDEM = ["01", "02", "03", "04", "05a", "05b", "06", "07", "08", "09", "10", "11", "12", "13", "14"]
# pausa ANTES do bloco
PAUSA = {"04": 0.7, "05a": 0.6, "05b": 1.8, "06": 0.6, "11": 0.6, "14": 0.8}
# as restantes pausas são iguais e calculadas para a voz acabar em FIM_VOZ


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def words(meta, offset):
    al = meta["alignment"]
    chars, starts, ends = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    out, cur, ws = [], "", None
    for c, s, e in zip(chars, starts, ends):
        if c.isspace():
            if cur.startswith("["):
                cur, ws = "", None
                continue
            if cur:
                out.append({"w": cur, "t": round(offset + ws / TEMPO, 3), "e": round(offset + we / TEMPO, 3)})
            cur, ws = "", None
            continue
        if ws is None:
            ws = s
        cur += c
        we = e
    if cur:
        out.append({"w": cur, "t": round(offset + ws / TEMPO, 3), "e": round(offset + we / TEMPO, 3)})
    return out


def main():
    metas = {bid: json.load(open(os.path.join(VO, f"{bid}.json"))) for bid in ORDEM}
    fala = sum(m["duration"] for m in metas.values()) / TEMPO
    livres = [b for b in ORDEM[1:] if b not in PAUSA]
    pausa_padrao = (FIM_VOZ - START - fala - sum(PAUSA.values())) / len(livres)
    print(f"pausa padrão: {pausa_padrao:.2f}s")
    assert pausa_padrao > 0.15, "a voz não cabe: aumente TEMPO ou encurte o texto"
    t = START
    blocos, inputs, filtros = [], [], []
    for i, bid in enumerate(ORDEM):
        meta = json.load(open(os.path.join(VO, f"{bid}.json")))
        if i > 0:
            t += PAUSA.get(bid, pausa_padrao)
        dur = meta["duration"] / TEMPO
        blocos.append({"id": bid, "start": round(t, 3), "end": round(t + dur, 3), "words": words(meta, t)})
        inputs += ["-i", os.path.join(VO, f"{bid}.mp3")]
        ms = int(round(t * 1000))
        filtros.append(f"[{i}:a]atempo={TEMPO},aresample=48000,adelay={ms}|{ms},apad[v{i}]")
        t += dur
    print(f"fim da voz: {t:.2f}s")
    json.dump({"total": TOTAL, "blocos": blocos}, open(os.path.join(ROOT, "audio", "timeline.json"), "w"), ensure_ascii=False, indent=1)

    n = len(ORDEM)
    mix = ";".join(filtros) + ";" + "".join(f"[v{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0,apad,atrim=0:{TOTAL},pan=stereo|c0=c0|c1=c0[out]"
    run(["ffmpeg", "-y", *inputs, "-filter_complex", mix, "-map", "[out]", "-ar", "48000", os.path.join(ROOT, "audio", "voz.wav")])

    print("ok: audio/voz.wav + audio/timeline.json")


if __name__ == "__main__":
    main()
