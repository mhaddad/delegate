"""Narração de um vídeo numa ÚNICA gravação contínua (voz uniforme do princípio ao fim).

Uso: python3 tools/voz.py v1|v2|v3
- Lê os blocos da secção "## Narração" do roteiro (01-PROBLEMA.md, 02-SOLUCAO.md, 03-TECNOLOGIA.md).
- Gera tudo num só pedido à ElevenLabs (mesma voz, modelo, definições e semente para os três vídeos).
- Guarda <v>/audio/take.mp3 e <v>/audio/take.json (texto, alinhamento por caractere e intervalo de cada bloco).
"""
import base64
import json
import os
import re
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROTEIRO = {"v1": "01-PROBLEMA.md", "v2": "02-SOLUCAO.md", "v3": "03-TECNOLOGIA.md"}
VOICE_ID = "MTAejQCmgXMzsj4Dgq5O"  # Sofia — pt-PT
MODEL = "eleven_multilingual_v2"  # verificado em pt-PT para a Sofia (o eleven_v3 puxava para pt-BR)
SETTINGS = {"stability": 0.5, "similarity_boost": 0.9, "style": 0.3, "use_speaker_boost": True}
SEED = 4242
# grafia para o TTS (o texto oficial continua a ser o do roteiro)
FONETICA = [("PDM", "pê-dê-éme"), ("SMS", "ésse-éme-ésse")]


def blocos(v):
    md = open(os.path.join(ROOT, ROTEIRO[v])).read()
    sec = md.split("## Narração")[1].split("\n## ")[0]
    out = []
    for line in sec.splitlines():
        m = re.match(r"\|\s*(\d+)\s*\|[^|]*\|\s*(.+?)\s*\|\s*$", line)
        if m:
            txt = m.group(2)
            for a, b in FONETICA:
                txt = re.sub(rf"\b{a}\b", b, txt)
            out.append({"id": m.group(1), "text": txt})
    return out


def key():
    for line in open(os.path.join(ROOT, ".env")):
        if line.startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip()


def main():
    v = sys.argv[1]
    bl = blocos(v)
    full = "\n\n".join(b["text"] for b in bl)
    # intervalo de caracteres de cada bloco no texto completo
    pos = 0
    for b in bl:
        b["c0"] = full.index(b["text"], pos); b["c1"] = b["c0"] + len(b["text"]); pos = b["c1"]
    print(f"{v}: {len(bl)} blocos, {len(full)} caracteres, {len(full.split())} palavras")
    body = {"text": full, "model_id": MODEL, "voice_settings": SETTINGS, "seed": SEED}
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers={"xi-api-key": key(), "Content-Type": "application/json"})
    try:
        res = json.load(urllib.request.urlopen(req, timeout=600))
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Erro {e.code}: {e.read()[:400]}")
    out = os.path.join(ROOT, v, "audio")
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, "take.mp3"), "wb").write(base64.b64decode(res["audio_base64"]))
    al = res["alignment"]
    assert "".join(al["characters"]) == full, "o alinhamento não corresponde ao texto enviado"
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(out, "take.mp3")]))
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    for b in bl:
        idx = [i for i in range(b["c0"], b["c1"]) if not full[i].isspace()]
        b["t0"], b["t1"] = st[idx[0]], en[idx[-1]]
        print(f"  {b['id']}: {b['t0']:7.2f} → {b['t1']:7.2f}  ({b['t1'] - b['t0']:.1f}s)")
    json.dump({"text": full, "duration": dur, "alignment": al, "blocos": bl}, open(os.path.join(out, "take.json"), "w"), ensure_ascii=False)
    print(f"ok: {v}/audio/take.mp3 ({dur:.1f}s)")


if __name__ == "__main__":
    main()
