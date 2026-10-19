"""Compõe a banda sonora original no Eleven Music, com secções alinhadas às cenas.

As fronteiras das secções vêm de audio/timeline.json (início dos blocos de narração),
para que cada mudança emocional da música caia no corte de cena certo.
Saída: audio/musica.mp3 (180 s, instrumental) e audio/musica_plano.json
"""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOTAL_MS = 180_000

GLOBAL_POS = [
    "cinematic underscore for a startup pitch film", "instrumental", "emotional", "warm and hopeful",
    "modern orchestral with soft electronic textures", "leaves space for a voice-over", "high production value",
]
GLOBAL_NEG = ["vocals", "singing", "choir words", "rap", "heavy drums", "distorted guitar", "EDM drop", "lo-fi hiss"]

# (nome, bloco onde começa, estilos)
SECCOES = [
    ("Memória do avô", None, ["solo felt piano", "Portuguese guitar (guitarra portuguesa) gentle melody", "nostalgic", "tender", "slow tempo", "intimate"]),
    ("O labirinto", "02", ["tension", "minor key", "low pulsing strings", "ticking clock percussion", "rising unease", "staccato cellos", "frustration builds"]),
    ("O insight", "03", ["suspended", "sparse", "contemplative", "sustained low strings", "thinning out", "near silence at the end, holding breath"]),
    ("Revelação", "04", ["uplifting reveal", "bright major key", "warm string swell", "shimmering synth pads", "sense of wonder", "hopeful build"]),
    ("A conversa", "05a", ["light and playful", "plucked strings and soft marimba", "warm", "intimate", "gentle groove"]),
    ("Por baixo da superfície", "06", ["curious and precise", "pulsing electronic arpeggios", "steady driving rhythm", "technological", "building momentum", "subtle orchestral layers"]),
    ("Confirmação e decisão", "08", ["hopeful", "momentum continues", "warm strings join the electronic pulse", "confident", "anticipation building towards a joyful peak"]),
    ("Pode avançar", "10", ["joyful release", "triumphant but warm", "full strings and piano", "emotional peak", "celebration"]),
    ("Magia e rigor", "11", ["anthemic", "confident", "full orchestral with electronic pulse", "inspiring", "wonder and precision"]),
    ("Visão", "13", ["expansive", "cinematic build", "soaring strings", "inspiring", "big horizon", "Portuguese guitar motif returns"]),
    ("Final", "14", ["resolution", "warm final chord", "Portuguese guitar and piano", "ring out and fade to silence", "proud and emotional"]),
]


def load_key():
    with open(os.path.join(ROOT, ".env")) as f:
        for line in f:
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip()


def main():
    tl = json.load(open(os.path.join(ROOT, "audio", "timeline.json")))
    start = {b["id"]: b["start"] for b in tl["blocos"]}
    # fronteiras: ligeiramente antes da narração (a música anuncia a mudança)
    marks = [0] + [round((start[b] - 0.4) * 1000) for _, b, _ in SECCOES[1:]] + [TOTAL_MS]
    sections = []
    for i, (nome, _, estilos) in enumerate(SECCOES):
        dur = marks[i + 1] - marks[i]
        assert dur >= 3000, f"secção curta demais: {nome} ({dur} ms)"
        sections.append({"section_name": nome, "positive_local_styles": estilos, "negative_local_styles": [], "duration_ms": dur, "lines": []})
    plan = {"positive_global_styles": GLOBAL_POS, "negative_global_styles": GLOBAL_NEG, "sections": sections}
    json.dump(plan, open(os.path.join(ROOT, "audio", "musica_plano.json"), "w"), ensure_ascii=False, indent=1)
    for s in sections:
        print(f"{s['section_name']:<26} {s['duration_ms'] / 1000:6.1f}s")
    if "--dry" in sys.argv:
        return
    body = {"composition_plan": plan, "model_id": "music_v1", "respect_sections_durations": True}
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192",
        data=json.dumps(body).encode(), headers={"xi-api-key": load_key(), "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            data = r.read()
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Erro {e.code}: {e.read()[:500]}")
    out = os.path.join(ROOT, "audio", "musica.mp3")
    open(out, "wb").write(data)
    print("ok:", out, len(data), "bytes")


if __name__ == "__main__":
    main()
