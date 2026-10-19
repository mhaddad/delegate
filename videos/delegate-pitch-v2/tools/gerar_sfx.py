"""Gera os efeitos sonoros na ElevenLabs (sound generation). Saída: audio/sfx/<nome>.mp3"""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "audio", "sfx")

SFX = {
    "foto": ("old photograph gently dropped onto a wooden table, soft paper tap", 1.0),
    "pin": ("soft map pin drop, gentle bubbly pop, user interface", 0.6),
    "jornal": ("newspaper page quickly flipped and slapped down", 0.8),
    "tensao": ("dark low cinematic drone with a ticking clock, tension", 6.0),
    "papel": ("paper documents flutter and land, quick", 0.7),
    "bump": ("soft dull bump, frustrated, cartoonish thud", 0.4),
    "baque": ("heavy stone block dropping with a deep low thud", 1.2),
    "riser": ("short cinematic riser swelling upward, airy, building anticipation", 2.0),
    "revelacao": ("bright cinematic logo reveal hit with sparkling shimmer tail, uplifting", 3.0),
    "shimmer": ("magical soft sparkle shimmer, airy chimes", 1.5),
    "teclado": ("soft smartphone touchscreen keyboard typing taps", 3.0),
    "enviar": ("modern chat message sent swoosh, short and clean", 0.5),
    "receber": ("gentle warm phone notification chime, two soft notes", 0.8),
    "mergulho": ("deep smooth cinematic whoosh moving downward, airy", 1.4),
    "subida": ("soft airy whoosh rising upward", 1.1),
    "cofre": ("heavy metal vault lock mechanism clicking open", 1.0),
    "fecho": ("metal vault door closing with a solid secure clunk", 1.0),
    "blip": ("soft digital data blip, clean user interface", 0.3),
    "negado": ("short low digital error buzz, access denied", 0.6),
    "vibrar": ("smartphone vibrating briefly on a wooden table", 0.8),
    "sucesso": ("pleasant uplifting success chime, three rising notes", 1.3),
    "carimbo": ("rubber stamp thump on paper, firm", 0.6),
    "celebrar": ("soft celebratory confetti burst with sparkles, joyful", 1.8),
    "faisca": ("magical electric sparkle sweeping fast from left to right", 1.6),
    "final": ("warm cinematic final hit with long shimmering tail", 3.5),
}


def load_key():
    with open(os.path.join(ROOT, ".env")) as f:
        for line in f:
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip()


def main():
    key = load_key()
    os.makedirs(OUT, exist_ok=True)
    only = set(sys.argv[1:])
    for nome, (txt, dur) in SFX.items():
        path = os.path.join(OUT, f"{nome}.mp3")
        if (only and nome not in only) or (not only and os.path.exists(path)):
            continue
        body = {"text": txt, "duration_seconds": max(0.5, dur), "prompt_influence": 0.6}
        req = urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128",
                                     data=json.dumps(body).encode(), headers={"xi-api-key": key, "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                open(path, "wb").write(r.read())
            print("ok", nome)
        except urllib.error.HTTPError as e:
            print("ERRO", nome, e.code, e.read()[:200])


if __name__ == "__main__":
    main()
