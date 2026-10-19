"""Banda sonora original de um vídeo (Eleven Music), com secções alinhadas aos blocos da narração.

Uso: python3 tools/musica.py v1|v2|v3   → <v>/audio/musica.mp3 e <v>/audio/musica_plano.json
"""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEG = ["vocals", "singing", "choir", "rap", "spoken word", "heavy drums", "distorted guitar", "EDM drop", "lo-fi hiss"]

PLANOS = {
    "v1": {
        "global": ["cinematic underscore for a short documentary", "instrumental", "melancholic", "sad", "low and intimate", "leaves space for a voice-over"],
        "neg": NEG + ["upbeat", "happy", "triumphant", "major key celebration"],
        "secoes": [
            ("Manhã no restaurante", None, ["solo felt piano", "soft Portuguese guitar (guitarra portuguesa) motif", "nostalgic", "tender but sad", "slow tempo", "minor key", "sparse"]),
            ("A porta e os labirintos", "3", ["low cello drone", "slow minor piano", "insistent soft low pulse", "unease", "uncertainty", "melancholic", "ticking texture"]),
            ("O dia a dia e a noite", "6", ["restless soft pulse that fades into lonely piano", "tired", "heavy hearted", "night", "very sparse", "melancholic"]),
            ("Pergunta suspensa", "8", ["almost silence", "single sustained piano notes", "unresolved suspended ending", "quiet", "a faint glimmer of hope without resolution", "fade out"]),
        ],
    },
    "v2": {
        "global": ["cinematic underscore for a product story", "instrumental", "joyful", "fun", "warm", "emotional", "leaves space for a voice-over", "high production value"],
        "neg": NEG + ["sad", "dark", "melancholic", "tense"],
        "secoes": [
            ("Primeiro contacto", None, ["light playful pizzicato strings", "marimba", "warm and curious", "bright", "gentle groove", "smile"]),
            ("A casa", "3", ["joyful", "light hand claps", "Portuguese guitar (guitarra portuguesa) counter-melody", "playful", "optimistic", "building momentum"]),
            ("A esplanada e os avisos", "6", ["fun and bouncy", "elegant", "marimba and strings", "sunny", "confident", "light percussion"]),
            ("Final emocionante", "8", ["emotional crescendo", "warm strings and piano", "uplifting", "triumphant but warm", "resolves in a major key", "joyful ending with a final chord"]),
        ],
    },
    "v3": {
        "global": ["cinematic underscore for a technology explainer", "instrumental", "intelligent", "brilliant", "genius", "minimalist", "leaves space for a voice-over", "high production value"],
        "neg": NEG + ["sad", "cheesy corporate ukulele", "aggressive"],
        "secoes": [
            ("Abertura", None, ["mysterious and intelligent", "minimalist piano arpeggios", "soft synth pulse", "sense of discovery", "quiet start"]),
            ("Representante e memória", "1", ["minimalist interlocking piano and synth arpeggios", "repetitive patterns that slowly evolve", "clean electronic pulse", "curious", "layered", "steady tempo"]),
            ("Agentes e autonomia", "3", ["building complexity", "interlocking arpeggios", "strings enter", "bright and precise", "genius energy", "forward momentum"]),
            ("Arquitetura e consola", "5", ["confident", "minimal orchestral with electronic pulse", "brilliant", "engineering precision", "fuller texture"]),
            ("Gestão e final", "7", ["luminous", "inspiring resolution", "soaring strings over arpeggios", "smart and triumphant", "final chord rings out and fades"]),
        ],
    },
}


def key():
    for line in open(os.path.join(ROOT, ".env")):
        if line.startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip()


def main():
    v = sys.argv[1]
    A = lambda *p: os.path.join(ROOT, v, "audio", *p)
    tl = json.load(open(A("timeline.json")))
    start = {b["id"]: b["start"] for b in tl["blocos"]}
    total_ms = int(round(tl["total"] * 1000))
    pl = PLANOS[v]
    marks = [0] + [int(round((start[b] - 0.5) * 1000)) for _, b, _ in pl["secoes"][1:]] + [total_ms]
    sections = []
    for i, (nome, _, est) in enumerate(pl["secoes"]):
        d = marks[i + 1] - marks[i]
        assert 3000 <= d <= 120000, (nome, d)
        sections.append({"section_name": nome, "positive_local_styles": est, "negative_local_styles": [], "duration_ms": d, "lines": []})
        print(f"  {nome:<26} {d / 1000:6.1f}s")
    plan = {"positive_global_styles": pl["global"], "negative_global_styles": pl["neg"], "sections": sections}
    json.dump(plan, open(A("musica_plano.json"), "w"), ensure_ascii=False, indent=1)
    body = {"composition_plan": plan, "model_id": "music_v1", "respect_sections_durations": True}
    req = urllib.request.Request("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", data=json.dumps(body).encode(),
                                 headers={"xi-api-key": key(), "Content-Type": "application/json"})
    try:
        data = urllib.request.urlopen(req, timeout=900).read()
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Erro {e.code}: {e.read()[:400]}")
    open(A("musica.mp3"), "wb").write(data)
    print(f"ok: {v}/audio/musica.mp3")


if __name__ == "__main__":
    main()
