"""Monta a linha de tempo da voz de um vídeo a partir da gravação contínua (take).

Uso: python3 tools/montar.py v1|v2|v3
Lê <v>/audio/take.json e <v>/montagem.json (tempo, pausas antes de cada bloco, início, fim).
Saída: <v>/audio/voz.wav, <v>/audio/timeline.json e <v>/audio/timeline.js
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    v = sys.argv[1]
    A = lambda *p: os.path.join(ROOT, v, "audio", *p)
    take = json.load(open(A("take.json")))
    cfg = json.load(open(os.path.join(ROOT, v, "montagem.json")))
    tempo = cfg["tempo"]
    bl = take["blocos"]
    al = take["alignment"]; full = take["text"]
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    # cortes a meio do silêncio entre blocos
    cuts = [0.0] + [(bl[i]["t1"] + bl[i + 1]["t0"]) / 2 for i in range(len(bl) - 1)] + [take["duration"]]
    t = cfg["inicio"]
    blocos, inputs, filtros = [], [], []
    for i, b in enumerate(bl):
        if i > 0:
            if b["id"] in cfg.get("fixar", {}):
                fx = cfg["fixar"][b["id"]]
                assert fx - t >= 0.4, f"bloco {b['id']} não cabe antes de {fx}s (fim do anterior: {t:.2f}s)"
                t = fx
            else:
                t += cfg["pausas"].get(b["id"], cfg["padrao"])
        a, z = cuts[i], cuts[i + 1]
        lead = (b["t0"] - a) / tempo  # silêncio antes da fala dentro do segmento
        seg_start = t - lead
        # palavras
        words, cur, ws = [], "", None
        for k in range(b["c0"], b["c1"] + 1):
            c = full[k] if k < len(full) else " "
            if c.isspace() or k == b["c1"]:
                if cur:
                    words.append({"w": cur, "t": round(seg_start + (ws - a) / tempo, 3), "e": round(seg_start + (we - a) / tempo, 3)})
                cur, ws = "", None
                continue
            if ws is None: ws = st[k]
            cur += c; we = en[k]
        end = seg_start + (b["t1"] - a) / tempo
        blocos.append({"id": b["id"], "start": round(t, 3), "end": round(end, 3), "words": words})
        inputs += ["-i", A("take.mp3")]
        ms = max(0, int(round(seg_start * 1000)))
        filtros.append(f"[{i}:a]atrim={a:.3f}:{z:.3f},asetpts=PTS-STARTPTS,atempo={tempo},afade=t=in:d=0.04,afade=t=out:st={(z - a) / tempo - 0.06:.3f}:d=0.06,aresample=48000,adelay={ms}|{ms},apad[s{i}]")
        t = end
    total = cfg.get("total") or round(t + cfg["fim"], 2)
    assert total - t >= 2.0, f"a voz acaba tarde demais ({t:.2f}s para um total de {total}s)"
    n = len(bl)
    mix = ";".join(filtros) + ";" + "".join(f"[s{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0,atrim=0:{total},pan=stereo|c0=c0|c1=c0[out]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", mix, "-map", "[out]", "-ar", "48000", A("voz.wav")], check=True)
    tl = {"total": total, "blocos": blocos}
    json.dump(tl, open(A("timeline.json"), "w"), ensure_ascii=False, indent=1)
    open(A("timeline.js"), "w").write("window.TIMELINE = " + json.dumps(tl, ensure_ascii=False) + ";\n")
    for b in blocos:
        print(f"  {b['id']}: {b['start']:7.2f} → {b['end']:7.2f}   {' '.join(w['w'] for w in b['words'][:5])}…")
    print(f"ok: {v} · duração total {total:.1f}s ({int(total // 60)}:{total % 60:04.1f})")


if __name__ == "__main__":
    main()
