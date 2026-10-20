"""Trilha original sintetizada (stdlib apenas, determinística) alinhada à grelha de cenas do audio/timing.json.

Saída: audio/music/bgm.wav (mono 22,05 kHz; o ffmpeg converte para estéreo 44,1 kHz com espaço) e audio/music/sfx.wav.
"""
import json, math, struct, wave
from pathlib import Path

P = Path(__file__).resolve().parent.parent
SR = 22050
timing = json.loads((P / "audio/timing.json").read_text())
TOTAL = timing["total"] + 1.0
S = {s["n"]: s for s in timing["scenes"]}
def at(n, local=0.0): return S[n]["start"] + local

N = int(TOTAL * SR)
bgm = [0.0] * N
sfx = [0.0] * N

# deterministic noise
_seed = [12345]
def rnd():
    _seed[0] = (1103515245 * _seed[0] + 12345) & 0x7FFFFFFF
    return _seed[0] / 0x7FFFFFFF * 2 - 1

def hz(note):  # MIDI -> Hz
    return 440.0 * 2 ** ((note - 69) / 12)

def add(buf, t0, samples, gain=1.0):
    i0 = int(t0 * SR)
    for k, v in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            buf[i] += v * gain

def pluck(freq, dur=2.5, bright=0.5, decay=0.996):
    """Karplus-Strong: corda dedilhada (aproximação de guitarra)."""
    period = max(2, int(SR / freq))
    ring = [rnd() * 0.5 for _ in range(period)]
    # suaviza o ataque conforme o brilho
    for _ in range(int((1 - bright) * 3)):
        ring = [(ring[i] + ring[i - 1]) * 0.5 for i in range(period)]
    out = []
    idx = 0
    n = int(dur * SR)
    for k in range(n):
        a = ring[idx]
        b = ring[(idx + 1) % period]
        ring[idx] = decay * 0.5 * (a + b)
        out.append(a)
        idx = (idx + 1) % period
    # fade final curto
    f = min(len(out), int(0.05 * SR))
    for k in range(f):
        out[-1 - k] *= k / f
    return out

def pad(freqs, dur, attack=1.5, release=2.0, detune=0.003, lp=0.08):
    n = int(dur * SR)
    out = [0.0] * n
    y = 0.0
    for k in range(n):
        t = k / SR
        env = min(1.0, t / attack) * min(1.0, max(0.0, (dur - t) / release))
        v = 0.0
        for f in freqs:
            v += math.sin(2 * math.pi * f * t) + 0.6 * math.sin(2 * math.pi * f * (1 + detune) * t + 1.3) \
                 + 0.3 * math.sin(2 * math.pi * f * 2 * (1 - detune) * t)
        v = v / (len(freqs) * 1.9)
        y += lp * (v - y)  # passa-baixo de um polo
        out[k] = y * env
    return out

def kick(gain=1.0):
    n = int(0.35 * SR)
    out = []
    ph = 0.0
    for k in range(n):
        t = k / SR
        f = 45 + 90 * math.exp(-t * 30)
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * math.exp(-t * 9) * gain)
    return out

def tick(gain=1.0, length=0.03, hp=True):
    n = int(length * SR)
    out, prev = [], 0.0
    for k in range(n):
        x = rnd()
        v = x - prev if hp else x
        prev = x
        out.append(v * math.exp(-k / n * 5) * gain)
    return out

def whoosh(dur=1.2, up=True):
    n = int(dur * SR)
    out, y = [], 0.0
    for k in range(n):
        t = k / n
        a = (t if up else 1 - t)
        coef = 0.02 + 0.25 * a
        y += coef * (rnd() - y)
        env = math.sin(math.pi * t) ** 1.5
        out.append(y * env)
    return out

def thud():
    n = int(0.4 * SR)
    out, y = [], 0.0
    for k in range(n):
        t = k / SR
        y += 0.15 * (rnd() - y)
        out.append((math.sin(2 * math.pi * 70 * t) * 0.8 + y * 0.6) * math.exp(-t * 14))
    return out

# ---- harmonia ----
Am = [57, 60, 64]; F = [53, 57, 60]; C = [48, 52, 55]; G = [55, 59, 62]; Dm = [50, 53, 57]; E = [52, 56, 59]
MOTIF = [69, 72, 76]  # o motivo de 3 notas (lá–dó–mi)
BEAT = 60 / 96

def arpeggio(t0, t1, chords, step=BEAT / 2, octave=12, gain=0.18, bright=0.6):
    t, i = t0, 0
    pattern = [0, 1, 2, 1]
    while t < t1 - 0.05:
        ch = chords[int((t - t0) / (step * 8)) % len(chords)]
        note = ch[pattern[i % 4]] + octave
        add(bgm, t, pluck(hz(note), dur=1.6, bright=bright), gain)
        t += step; i += 1

def pads(t0, t1, chords, bar=BEAT * 4, gain=0.22, octave=0):
    t, i = t0, 0
    while t < t1 - 0.2:
        d = min(bar * 2, t1 - t)
        add(bgm, t, pad([hz(n + octave) for n in chords[i % len(chords)]], d + 1.0, attack=1.2, release=1.2), gain)
        t += bar * 2; i += 1

def beat(t0, t1, gain=0.5, hats=True):
    t, i = t0, 0
    while t < t1 - 0.05:
        if i % 4 in (0, 2):
            add(bgm, t, kick(), gain)
        if hats:
            add(bgm, t + BEAT / 2, tick(0.25, 0.02), gain)
        t += BEAT; i += 1

# A — abertura (cenas 1–2): motivo de guitarra + pad
add(bgm, 0.2, pad([hz(n) for n in Am], at(3) - 0.2 + 1.0, attack=2.0, release=1.5), 0.2)
for k, n in enumerate(MOTIF):
    add(bgm, 0.3 + k * 0.42, pluck(hz(n), dur=3.0, bright=0.7), 0.32)
for k, n in enumerate(MOTIF):
    add(bgm, at(1, 4.2) + k * 0.42, pluck(hz(n - 12), dur=3.0, bright=0.6), 0.26)
arpeggio(at(2), at(3), [Am, F], gain=0.12)
add(sfx, at(2, 3.5), thud(), 0.55)  # carimbo "ATUALIZADO"

# B — labirinto e insight (cenas 3–4): drone + tique-taque a acelerar, silêncio na pergunta
b0, b1 = at(3), at(3, 13.4)
add(bgm, b0, pad([hz(45), hz(52)], (at(5) - b0) + 0.5, attack=2.5, release=1.0, lp=0.05), 0.3)
t, step = b0, 0.6
while t < b1:
    add(bgm, t, tick(0.35, 0.025), 1.0)
    t += step
    step = max(0.16, step * 0.965)
for k in range(5):  # clique de carimbos durante a acumulação
    add(sfx, at(3, 2.5 + k * 2.2), thud(), 0.22)
arpeggio(at(4), at(5), [Dm, E], step=BEAT, octave=0, gain=0.09, bright=0.4)

# C — revelação, Afonso, palco (cenas 5–7)
add(sfx, at(5) - 0.6, whoosh(1.2), 0.5)
c0, c1 = at(5, 0.4), at(8)
pads(c0, c1, [C, Am, F, G], gain=0.2)
arpeggio(at(5, 2.2), c1, [C, Am, F, G], gain=0.13, bright=0.75)
beat(at(6), c1, gain=0.42)
for k in range(6):  # ticks dos canais (cena 6)
    add(sfx, at(6, [5.0, 5.67, 6.0, 6.33, 6.6, 6.86][k]), tick(0.6, 0.012, hp=False), 0.5)

# D — bastidores, cofre, pessoas decidem (cenas 8–10): pad técnico + sequência suave
d0, d1 = at(8), at(11)
add(sfx, d0 - 0.4, whoosh(1.0, up=False), 0.4)
pads(d0, d1, [Am, F, C, G], gain=0.2, octave=-12)
t, i = at(8, 1.0), 0
seq = [57, 64, 69, 64, 60, 67, 72, 67]
while t < at(10, 16.6):  # para no momento parado
    add(bgm, t, pluck(hz(seq[i % 8] + 12), dur=0.5, bright=0.3, decay=0.99), 0.07)
    t += BEAT / 2; i += 1
beat(at(8, 1.0), at(10, 9.6), gain=0.3, hats=False)
add(sfx, at(10, 8.55), tick(0.8, 0.02, hp=False), 0.6)  # "Aprovar"

# E — resposta, visão, pedido (cenas 11–13): resolução luminosa
add(sfx, at(11) - 0.4, whoosh(0.9, up=True), 0.35)
e0, e1 = at(11), at(14)
pads(e0, e1, [F, C, G, Am], gain=0.2)
arpeggio(e0 + 0.5, e1, [F, C, G, Am], gain=0.13, bright=0.8)
beat(at(12), e1, gain=0.4)

# F — fecho (cena 14): motivo de guitarra regressa e resolve
f0 = at(14)
add(bgm, f0, pad([hz(n) for n in Am], 5.6, attack=1.0, release=2.0), 0.2)
for k, n in enumerate(MOTIF):
    add(bgm, f0 + 0.5 + k * 0.42, pluck(hz(n), dur=3.0, bright=0.7), 0.3)
add(bgm, at(14, 5.6), pad([hz(n) for n in C] + [hz(67)], TOTAL - at(14, 5.6), attack=0.8, release=4.5), 0.26)
for k, n in enumerate([60, 64, 67, 72]):
    add(bgm, at(14, 5.88) + k * 0.12, pluck(hz(n), dur=5.5, bright=0.7, decay=0.998), 0.24)

def write(path, buf):
    peak = max(1e-9, max(abs(v) for v in buf))
    g = 0.89 / peak
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v * g)) * 32767)) for v in buf))

out = P / "audio/music"
out.mkdir(parents=True, exist_ok=True)
write(out / "bgm-raw.wav", bgm)
write(out / "sfx-raw.wav", sfx)
print("ok", round(TOTAL, 1), "s")
