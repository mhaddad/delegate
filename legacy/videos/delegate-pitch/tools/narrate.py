"""Gera a narração fala a fala (ElevenLabs, com timestamps por carácter) a partir do SCRIPT.md.

Saída: audio/vo/line-NN.mp3 e audio/vo/line-NN.words.json ([{text,start,end}] em segundos, relativos à fala).
Uso: python3 -I tools/narrate.py [NN ...]   (sem argumentos gera todas as falas que ainda não existem)
"""
import base64, json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from el_common import post, PROJECT

VOICE = "MTAejQCmgXMzsj4Dgq5O"  # Sofia — Melodic and Expressive (pt, european)
MODEL = "eleven_multilingual_v2"
SETTINGS = {"stability": 0.5, "similarity_boost": 0.8, "style": 0.2, "use_speaker_boost": True, "speed": 0.92}
OUT = PROJECT / "audio" / "vo"


def lines():
    text = (PROJECT / "SCRIPT.md").read_text()
    return [l.strip() for l in re.findall(r"(?m)^    (\S.*)$", text)]


def words_from_alignment(al):
    chars, starts, ends = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    words, cur, s = [], "", None
    for c, a, b in zip(chars, starts, ends):
        if c.isspace():
            if cur:
                words.append({"text": cur, "start": round(s, 3), "end": round(prev_end, 3)})
            cur, s = "", None
            continue
        if s is None:
            s = a
        cur += c
        prev_end = b
    if cur:
        words.append({"text": cur, "start": round(s, 3), "end": round(prev_end, 3)})
    return words


def main():
    all_lines = lines()
    want = [int(a) for a in sys.argv[1:]] or range(1, len(all_lines) + 1)
    OUT.mkdir(parents=True, exist_ok=True)
    for n in want:
        mp3 = OUT / f"line-{n:02d}.mp3"
        if mp3.exists() and not sys.argv[1:]:
            continue
        body = {"text": all_lines[n - 1], "model_id": MODEL, "voice_settings": SETTINGS}
        if n > 1:
            body["previous_text"] = all_lines[n - 2]
        if n < len(all_lines):
            body["next_text"] = all_lines[n]
        res = json.loads(post(f"/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128", body))
        mp3.write_bytes(base64.b64decode(res["audio_base64"]))
        al = res.get("normalized_alignment") or res["alignment"]
        (OUT / f"line-{n:02d}.words.json").write_text(json.dumps(words_from_alignment(al), ensure_ascii=False, indent=1))
        print(f"line {n:02d} ok")


if __name__ == "__main__":
    main()
