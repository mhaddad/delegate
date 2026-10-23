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
    "vg": {
        "global": ["cinematic underscore for a civic technology product film", "instrumental", "warm", "confident", "modern and clean", "leaves space for a voice-over", "high production value"],
        "neg": NEG + ["sad", "dark", "aggressive", "cheesy corporate ukulele"],
        "secoes": [
            ("Abertura", None, ["calm and slightly suspended", "soft felt piano", "light strings", "an open question", "gentle"]),
            ("O Henriques", "3", ["the melody opens up", "warm and confident", "Portuguese guitar (guitarra portuguesa) gentle motif", "hopeful", "light percussion enters"]),
            ("Demonstração", "4", ["light modern pulse", "plucked strings and soft marimba", "steady rhythm that follows a conversation", "curious", "positive"]),
            ("Bastidores", "7", ["precise piano and synth arpeggios", "clean electronic texture", "intelligent", "building complexity", "focused"]),
            ("Impacto e fecho", "10", ["crescendo", "full warm strings over the arpeggios", "inspiring", "luminous resolution", "proud final chord that rings out"]),
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
