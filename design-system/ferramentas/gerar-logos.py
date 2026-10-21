"""Gera os SVG do logótipo Delegate (símbolo, lockups, ícone, favicon).

Uso: python gerar-logos.py <Manrope.ttf> <pasta-de-saida>
A palavra «Delegate» é convertida em contornos (Manrope 700, tracking -0,04em),
para que os ficheiros não dependam da fonte instalada.
"""
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FONTE, SAIDA = Path(sys.argv[1]), Path(sys.argv[2])
SAIDA.mkdir(parents=True, exist_ok=True)

# --- Geometria do símbolo (grelha 48) ------------------------------------
PORTA = "M10 40V22a14 14 0 0 1 28 0v18Z"  # arco r14, traço 4, cantos redondos
# Maçaneta: um ponto dourado junto ao lado direito do vão, um pouco abaixo do meio.
MACANETA = (30.5, 26, 2.5)                 # cx, cy, raio
TRACO = 4
# caixa visível do símbolo com o traço: x 8–40, y 6–42 (32 × 36)
SX, SY, SW, SH = 8, 6, 32, 36

CORES = {
    "escuro": {"porta": "#7BCC90", "macaneta": "#E0B65D", "texto": "#FFFEFA"},
    "claro": {"porta": "#1A7040", "macaneta": "#8A6210", "texto": "#1D2430"},
    "mono": {"porta": "currentColor", "macaneta": "currentColor", "texto": "currentColor"},
}
BASTIDORES = "#0F1B2D"


def simbolo(cores, transform="", traco=TRACO, macaneta=MACANETA):
    t = f' transform="{transform}"' if transform else ""
    cx, cy, r = macaneta
    return (
        f'<g{t}>'
        f'<path d="{PORTA}" fill="none" stroke="{cores["porta"]}" stroke-width="{traco}" '
        f'stroke-linecap="round" stroke-linejoin="round"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{cores["macaneta"]}"/>'
        f'</g>'
    )


def svg(viewbox, corpo, titulo, largura=None, altura=None):
    dims = f' width="{largura}" height="{altura}"' if largura else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{dims} '
        f'role="img" aria-label="{titulo}"><title>{titulo}</title>{corpo}</svg>\n'
    )


# --- Palavra «Delegate» em contornos --------------------------------------
fonte = TTFont(FONTE)
instantiateVariableFont(fonte, {"wght": 700}, inplace=True)
UPM = fonte["head"].unitsPerEm
CAP = fonte["OS/2"].sCapHeight
glifos = fonte.getGlyphSet()
ordem = fonte.getGlyphOrder()

blob = hb.Blob.from_file_path(str(FONTE))
hbfont = hb.Font(hb.Face(blob))
hbfont.set_variations({"wght": 700})
buf = hb.Buffer()
buf.add_str("Delegate")
buf.guess_segment_properties()
hb.shape(hbfont, buf, {"kern": True, "liga": True})

TRACKING = -0.04 * UPM


def palavra(tamanho, x0, linha_base):
    """Devolve (path d, caixa) da palavra com corpo `tamanho` e origem (x0, linha_base)."""
    k = tamanho / UPM
    pen = SVGPathPen(glifos, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    caixa = BoundsPen(glifos)
    x = 0
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        nome = ordem[info.codepoint]
        m = (k, 0, 0, -k, x0 + (x + pos.x_offset) * k, linha_base - pos.y_offset * k)
        glifos[nome].draw(TransformPen(pen, m))
        glifos[nome].draw(TransformPen(caixa, m))
        x += pos.x_advance + (TRACKING if i < n - 1 else 0)
    return pen.getCommands(), caixa.bounds


# --- Lockup horizontal -----------------------------------------------------
# O símbolo assenta na linha de base e sobe acima das maiúsculas (1,2 × cap).
F = 100
cap = CAP / UPM * F            # 72
k = 1.2 * cap / SH             # escala do símbolo (2,4)
sym_w = SW * k
espaco = 0.3 * F
d_h, (bx0, by0, bx1, by1) = palavra(F, sym_w + espaco, cap)
largura_h = round(bx1, 2)
sym_topo = cap - SH * k
topo, fundo = min(sym_topo, by0), max(cap, by1)
vb_h = f"0 {topo:.2f} {largura_h} {fundo - topo:.2f}"
t_sym_h = f"translate({-SX * k:.2f} {sym_topo - SY * k:.2f}) scale({k:.4f})"

# --- Lockup vertical -------------------------------------------------------
kv = 4.2
symv_w, symv_h = SW * kv, SH * kv
gap_v = 0.4 * F
d_v0, (vx0, vy0, vx1, vy1) = palavra(F, 0, 0)
larg_txt = vx1 - vx0
larg_v = max(larg_txt, symv_w)
base_v = symv_h + gap_v + cap
d_v, (wx0, wy0, wx1, wy1) = palavra(F, (larg_v - larg_txt) / 2 - vx0, base_v)
t_sym_v = f"translate({(larg_v - symv_w) / 2 - SX * kv:.2f} {-SY * kv:.2f}) scale({kv})"
vb_v = f"0 0 {larg_v:.2f} {wy1:.2f}"

for variante, cores in CORES.items():
    nome_var = {"escuro": "para fundo escuro", "claro": "para fundo claro", "mono": "monocromático"}[variante]
    (SAIDA / f"delegate-simbolo-{variante}.svg").write_text(
        svg("0 0 48 48", simbolo(cores), f"Delegate — símbolo, {nome_var}")
    )
    (SAIDA / f"delegate-logo-horizontal-{variante}.svg").write_text(
        svg(vb_h, simbolo(cores, t_sym_h) + f'<path d="{d_h}" fill="{cores["texto"]}"/>',
            f"Delegate — logótipo horizontal, {nome_var}")
    )
    (SAIDA / f"delegate-logo-vertical-{variante}.svg").write_text(
        svg(vb_v, simbolo(cores, t_sym_v) + f'<path d="{d_v}" fill="{cores["texto"]}"/>',
            f"Delegate — logótipo vertical, {nome_var}")
    )

# --- Ícone de aplicação (avatar do bot, PWA) -------------------------------
# Conteúdo a 80 % para caber no recorte circular do Telegram.
icone = (
    f'<rect width="48" height="48" rx="10.5" fill="{BASTIDORES}"/>'
    + simbolo(CORES["escuro"], "translate(4.8 4.8) scale(.8)", traco=4.5)
)
(SAIDA / "delegate-icone-app.svg").write_text(svg("0 0 48 48", icone, "Delegate"))

# --- Favicon: traço mais grosso e caixa justa, troca de cor com o tema -----
fav = (
    "<style>.p{stroke:#1A7040}.f{fill:#8A6210}"
    "@media (prefers-color-scheme:dark){.p{stroke:#7BCC90}.f{fill:#E0B65D}}</style>"
    f'<path class="p" d="{PORTA}" fill="none" stroke-width="5" '
    'stroke-linecap="round" stroke-linejoin="round"/>'
    f'<circle class="f" cx="30" cy="26" r="3"/>'
)
(SAIDA / "favicon.svg").write_text(svg("4 4 40 40", fav, "Delegate"))

print("horizontal", vb_h, "| vertical", vb_v)
