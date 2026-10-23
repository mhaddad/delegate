"""Efeitos sonoros novos da série (ElevenLabs sound generation) → audio/sfx/<nome>.mp3 (só gera os que faltam)."""
import json, os, sys, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SFX = {
    "persiana": ("metal roller shutter of a small shop being lifted in the morning", 2.0),
    "porta": ("heavy wooden door handle rattling, locked, will not open", 1.2),
    "campainha": ("small shop door bell jingle", 0.8),
    "talao": ("receipt printer printing a short ticket", 1.0),
    "panelas": ("busy restaurant kitchen, pans clinking, short", 1.5),
    "noite": ("quiet night ambience inside an empty restaurant, distant street, soft", 4.0),
    "portatil": ("tired slow typing on a laptop keyboard at night", 2.5),
    "suspiro": ("soft tired female sigh", 1.0),
    "cartoes": ("three business cards placed on a wooden counter", 0.8),
    "qr": ("smartphone camera scanning a QR code, short confirmation beep", 0.6),
    "voz": ("smartphone voice message recording start blip and send swoosh", 0.9),
    "obturador": ("smartphone camera shutter click", 0.5),
    "ouro": ("bright golden coin-like chime, magical, short", 0.8),
    "esplanada": ("lively outdoor cafe terrace ambience, cheerful chatter, cups and plates", 5.0),
    "capitulo": ("clean elegant digital chime marking a new chapter, soft and bright", 1.0),
    "cronometro": ("fast stopwatch ticking then a soft ding", 1.2),
    "clique": ("computer mouse click, crisp", 0.3),
    "porta_dados": ("soft digital gate opening sound, futuristic, subtle", 0.6),
}
def key():
    for l in open(os.path.join(ROOT, ".env")):
        if l.startswith("ELEVENLABS_API_KEY="): return l.split("=", 1)[1].strip()
k = key(); out = os.path.join(ROOT, "audio", "sfx")
for nome, (txt, dur) in SFX.items():
    p = os.path.join(out, f"{nome}.mp3")
    if os.path.exists(p): continue
    body = {"text": txt, "duration_seconds": max(0.5, dur), "prompt_influence": 0.6}
    req = urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", data=json.dumps(body).encode(), headers={"xi-api-key": k, "Content-Type": "application/json"})
    try:
        open(p, "wb").write(urllib.request.urlopen(req, timeout=120).read()); print("ok", nome)
    except urllib.error.HTTPError as e:
        print("ERRO", nome, e.code, e.read()[:200])
