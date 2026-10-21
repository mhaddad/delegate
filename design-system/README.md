# Design system · Delegate

Logótipo, cores e tipografia do Delegate, prontos a usar nas interfaces do sistema (Telegram, Observatório, Consola Municipal, documentos e pitch).

Parte de [`reference-docs/estudo-identidade-visual.html`](../reference-docs/estudo-identidade-visual.html) (paleta, tipografia e forma) e do símbolo de referência escolhido (arco verde com ponto dourado). A referência visual completa está em [`index.html`](index.html): abre-se diretamente no browser.

```
design-system/
├── index.html        referência visual: logótipo, construção, cores, tipografia
├── tokens.css        variáveis CSS (inclui @font-face da Manrope local)
├── tokens.json       os mesmos tokens no formato W3C Design Tokens
├── logo/             todos os SVG do logótipo
├── fontes/           Manrope variável (woff2) + licença OFL
└── ferramentas/      gerador dos SVG (Python)
```

---

## 1. O símbolo

**Uma porta com maçaneta.** O arco verde é a porta para a Câmara; o ponto dourado, junto ao lado direito, é a maçaneta: a porta está ao alcance da mão. Quem tem a chave é a pessoa: o Henriques só abre a porta com mandato. O símbolo junta as duas ideias do produto, a passagem sem burocracia e a autorização explícita.

### Construção (grelha 48 × 48)

| Elemento | Geometria |
|---|---|
| Porta | `M10 40V22a14 14 0 0 1 28 0v18Z` · traço 4 · pontas e juntas redondas |
| Maçaneta | círculo `cx 30,5 · cy 26 · r 2,5` |
| Caixa visível | 32 × 36, de x 8 a 40 e de y 6 a 42 (centrada na grelha) |

- A maçaneta fica a 2,5 unidades da face interior direita da porta (x 36) e um pouco abaixo do meio do vão (y 26), onde estaria numa porta real.
- O raio 2,5 é menor que o ponto da imagem de referência (3,5): dentro da porta, um ponto maior parece um olho e deixa de ler-se como maçaneta.
- Arco de raio 14 e traço 4 reproduzem as proporções medidas na imagem de referência (traço ≈ 12 % da largura).
- A maçaneta fica sempre dentro da porta: a versão do estudo, com o ponto fora do arco, fica descontinuada.

### Ficheiros

| Ficheiro | Uso |
|---|---|
| `logo/delegate-simbolo-escuro.svg` | **Versão principal.** Sobre Bastidores e fundos escuros (consola, Observatório) |
| `logo/delegate-simbolo-claro.svg` | Sobre Palco, Branco e fundos claros (documentos, web clara) |
| `logo/delegate-simbolo-mono.svg` | Uma cor só, em `currentColor`: herda a cor do texto quando embutido inline |
| `logo/delegate-logo-horizontal-{escuro,claro,mono}.svg` | Símbolo + palavra, lado a lado: cabeçalhos, navegação, rodapés |
| `logo/delegate-logo-vertical-{escuro,claro,mono}.svg` | Símbolo sobre a palavra: ecrãs de abertura, capas, slides |
| `logo/delegate-icone-app.svg` | Ícone de aplicação sobre Bastidores; serve de avatar do bot no Telegram (o conteúdo cabe no recorte circular) |
| `logo/favicon.svg` | Favicon com traço 5 e maçaneta de raio 3, para legibilidade a 16 px; troca de cores com `prefers-color-scheme` |

A palavra «Delegate» está **convertida em contornos** (Manrope 700, tracking −0,04 em): os ficheiros não dependem da fonte instalada.

### Cores do logótipo

| Fundo | Porta | Maçaneta | Palavra |
|---|---|---|---|
| Escuro (Bastidores `#0F1B2D`) | Verde marca `#7BCC90` | Dourado marca `#E0B65D` | Branco `#FFFEFA` |
| Claro (Palco `#F4EFE6`, Branco) | Verde `#1A7040` | Dourado `#8A6210` | Tinta `#1D2430` |
| Monocromático | `currentColor` | `currentColor` | `currentColor` |

O verde e o dourado da marca foram medidos na imagem de referência (`#7BCC90`, `#E0B65D`, sobre `#121B2C`). Sobre fundo claro, a versão clara usa os tons escuros do estudo, porque o verde marca só tem 1,68:1 sobre Palco.

### Uso

```html
<!-- como imagem -->
<img src="/design-system/logo/delegate-logo-horizontal-claro.svg" alt="Delegate" height="32">

<!-- inline, a herdar cor (versão mono) -->
<span style="color: var(--dlg-verde)"><!-- conteúdo de delegate-simbolo-mono.svg --></span>

<!-- favicon -->
<link rel="icon" href="/design-system/logo/favicon.svg" type="image/svg+xml">
```

> A versão `mono` só herda a cor quando o SVG é embutido no HTML. Dentro de `<img>`, `currentColor` resolve para preto.

### Regras

- **Área de proteção:** à volta do logótipo, pelo menos a largura do vão da porta (24 unidades da grelha; ⅔ da altura do símbolo).
- **Tamanho mínimo:** símbolo a 16 px só com `favicon.svg`; os restantes a partir de 24 px. Logótipo horizontal a partir de 20 px de altura.
- **Não fazer:** mudar as cores fora das três variantes; mover a maçaneta para fora da porta ou para o lado esquerdo; rodar, esticar ou aplicar sombra, contorno ou gradiente; recompor a palavra com outra fonte; usar a versão escura sobre fundo claro (ou o inverso).

---

## 2. Cores

**Calma no ambiente. Cor com significado.** Uma base neutra e institucional; verde, dourado e terracota entram para indicar estados, nunca como decoração.

### Neutros

| Nome | Hex | Token | Papel |
|---|---|---|---|
| Palco | `#F4EFE6` | `--dlg-palco` | Superfícies |
| Branco | `#FFFEFA` | `--dlg-branco` | Cartões, campos |
| Tinta | `#1D2430` | `--dlg-tinta` | Texto |
| Cinza | `#647080` | `--dlg-cinza` | Texto secundário |
| Linha | `#E6E2DA` | `--dlg-linha` | Bordas, divisórias |
| Bastidores | `#0F1B2D` | `--dlg-bastidores` | Tecnologia, consola, fundo da marca |
| Bastidores texto | `#C3CCD8` | `--dlg-bastidores-texto` | Texto secundário sobre Bastidores |

### Estados

| Nome | Forte | Suave | Significado |
|---|---|---|---|
| Ação concluída | `#1A7040` `--dlg-verde` | `#DCEFE2` `--dlg-verde-suave` | Henriques, ação feita, fonte verificada |
| Autorização | `#8A6210` `--dlg-dourado` | `#F6EDCF` `--dlg-dourado-suave` | Cofre, mandato, à espera de confirmação |
| Atenção | `#B4492A` `--dlg-terracota` | `#F6E2DC` `--dlg-terracota-suave` | Alertas, abstenção, erro |
| Ciano (reserva) | `#167A76` `--dlg-ciano` | `#D9EFEC` `--dlg-ciano-suave` | Definido no estudo, ainda sem papel atribuído |

### Marca

| Nome | Hex | Token | Papel |
|---|---|---|---|
| Verde marca | `#7BCC90` | `--dlg-marca-verde` | Porta do símbolo; acento sobre Bastidores |
| Dourado marca | `#E0B65D` | `--dlg-marca-dourado` | Maçaneta do símbolo; autorização sobre Bastidores |

No produto, usar os **papéis semânticos** (`--dlg-fundo`, `--dlg-texto`, `--dlg-acao`, `--dlg-autorizacao`, `--dlg-atencao`…) em vez dos nomes de cor.

### Contraste (WCAG 2.2, calculado)

| Texto | Fundo | Rácio | Resultado |
|---|---|---|---|
| Tinta | Palco | 13,61:1 | Passa AA |
| Tinta | Branco | 15,45:1 | Passa AA |
| Verde | Palco | 5,34:1 | Passa AA |
| Verde | Verde suave | 5,09:1 | Passa AA |
| Branco | Verde (botão) | 6,06:1 | Passa AA |
| Dourado | Palco | 4,78:1 | Passa AA |
| Dourado | Dourado suave | 4,68:1 | Passa AA |
| Terracota | Palco | 4,67:1 | Passa AA |
| Branco | Bastidores | 17,13:1 | Passa AA |
| Bastidores texto | Bastidores | 10,66:1 | Passa AA |
| Verde marca | Bastidores | 8,96:1 | Passa AA |
| Dourado marca | Bastidores | 9,07:1 | Passa AA |
| **Cinza** | **Palco** | **4,40:1** | **Falha AA** em texto normal: usar sobre Branco (4,99:1) ou só em texto ≥ 24 px / 19 px forte |
| **Terracota** | **Terracota suave** | **4,29:1** | **Falha AA** em texto normal: em alertas, texto em Tinta e terracota só no ícone e na borda |
| **Ciano** | **Palco** | **4,49:1** | **Falha AA** em texto normal (o rácio não se arredonda) |

Estes três pares vêm do estudo tal como estão. Corrigi-los pede escurecer o tom; fica para decisão de quem tem a marca.

---

## 3. Tipografia

**Uma fonte em toda a experiência: Manrope.** Títulos, conversas, formulários e dados usam a mesma família; a hierarquia faz-se com peso e tamanho, sem misturar outras famílias.

A fonte está em `fontes/Manrope-wght.woff2` (variável, pesos 200–800, licença SIL OFL 1.1) e é carregada por `tokens.css`. Fica local de propósito: o protótipo corre sem rede.

| Estilo | Tamanho | Peso | Linha | Tracking | Uso |
|---|---|---|---|---|---|
| Display | `clamp(3rem, 7vw, 6.5rem)` | 700 | 0,98 | −0,045 em | Abertura, slides |
| Título | 2,4 rem | 700 | 1,1 | −0,045 em | Títulos de secção |
| Destaque | 3 rem (48 px) | 700 | 1,05 | −0,05 em | Frases de marca |
| Interface | 25 px | 500 | 1,35 | −0,03 em | Mensagens em destaque |
| Lead | 19 px | 400 | 1,55 | 0 | Introduções |
| Corpo | 16 px | 400 | 1,55 | 0 | Texto corrido |
| Pequeno | 13 px | 400 | 1,5 | 0 | Notas, metadados |
| Etiqueta | 12 px | 700 | 1,4 | +0,12 em | Maiúsculas, até três palavras |

- Peso médio (500) para mensagens e texto corrido; peso forte (700) para hierarquia e ações.
- Palavra do logótipo: Manrope 700, tracking −0,04 em (já em contornos nos SVG).

---

## 4. Forma

| Token | Valor | Uso |
|---|---|---|
| `--dlg-raio-pequeno` | 10 px | Botões, navegação, campos |
| `--dlg-raio-medio` | 14 px | Cartões pequenos, amostras |
| `--dlg-raio-grande` | 18 px | Painéis |
| `--dlg-raio-palco` | 24 px | Blocos de marca |
| `--dlg-raio-pilula` | 99 px | Etiquetas de estado |
| `--dlg-sombra` | `0 22px 60px #17203318` | Elevação de painéis |

---

## 5. Relação com `prototipo/apps/web/DESIGN.md`

O [`DESIGN.md`](../prototipo/apps/web/DESIGN.md) do Observatório e da Consola foi escrito antes deste design system e usa outra base: Barlow, verde `#70BB86`, raios até 4 px. Este design system **não o altera**. Alinhar os ecrãs com estes tokens é uma decisão da pessoa C (dona de `apps/web/`).

---

## 6. Regenerar os SVG

Os SVG são gerados por [`ferramentas/gerar-logos.py`](ferramentas/gerar-logos.py), que fixa a geometria e converte a palavra em contornos. Para alterar o logótipo, muda-se o script, não os SVG à mão.

```bash
python3 -m venv .venv && .venv/bin/pip install fonttools uharfbuzz
curl -L -o Manrope.ttf "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf"
.venv/bin/python design-system/ferramentas/gerar-logos.py Manrope.ttf design-system/logo
```
