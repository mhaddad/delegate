# DESIGN.md — Sistema visual do Delegate

Contrato visual da Interface. Precede as preferências estéticas: quando uma
heurística anti-slop conflita com este documento, este documento ganha.
Quando uma referência externa (`.agents/skills/anti-ai-slop-design`,
`specs/15-ux-conteudo-e-tom.md`) conflita com este documento, este documento
ganha também — com excepção do que a Especificação exigir.

Derivado de: `assets/delegate-symbol.png` (o activo oficial da marca) e do
`specs/` do projecto. Não de uma biblioteca de componentes.

---

## 1. As três camadas (o que o ecrã é sobre)

O Delegate não é um dashboard genérico. É **uma fronteira de três momentos**:

```
  01  Cidadão          02  Delegate          03  Câmara
      (origem)             (filtro etradutor)     (destino)
```

O-primitivo estrutural do ecrã é uma **linha de fluxo**: as três camadas estão
lado a lado, ligadas, e o que muda entre elas é o papel, não o formato.

Consequências, e estas são as que interessam:

- As camadas **não** são três cards iguais. A camada 02 é o eixo — mais peso,
  ligeiramente mais larga, sem caixa própria. A 01 e a 03 são as pontas.
- **Não há risca colorida no topo dos cards.** A distinção faz-se por peso
  tipográfico (o número 01/02/03) e por posição, não por uma barra pintada.
- A numeração **é** de ordem real — a chamada atravessa-as por essa ordem.
  Não é decorativa.
- Se o conteúdo mudar de ordem, a numeração muda. Se a numeração mudar sem o
  conteúdo mudar, está errado.

## 2. Tokens

### 2.1 Cor

A paleta vem das cores medidas no símbolo oficial da marca:

| Papel | Valor | Origem |
|---|---|---|
| Fundo | `#0a0f18` | navy escurecido do símbolo (`#121b2c`) |
| Superfície | `rgba(18, 27, 44, 0.75)` | idem, elevado |
| Acento | `#70bb86` | verde Delegate, medido |
| Acento forte | `#8ccfa0` | o mesmo verde, mais claro |
| Acento escuro | `#4f8f63` | o mesmo verde, mais escuro |
| Acento véu | `rgba(112, 187, 134, 0.14)` | o acento, diluído |
| Texto | `#e9edf2` | tinta clara, medida |
| Texto secundário | `#9aa8b8` | derivada |
| Texto suave | `#66748a` | derivada |
| Borda | `rgba(233, 237, 242, 0.10)` | tinta clara diluída |

Estados semânticos, derivados do acento por luminosidade — **não** por outra
paleta:

| Estado | Valor | Significado |
|---|---|---|
| Espera | `#c9a227` | D0–D1 · ainda não actua |
| Aviso | `#d98c3f` | D2 · prepara |
| Activa | `#70bb86` | D3–D4 · mandato activo |
| Erro | `#c25b52` | revogado / falhado |

Regras que não se negociam:

- **Um acento só.** O verde Delegate é o único acento da Interface. Se um
  ecrã introduz um segundo acento, é sinal de que a hierarchy está errada.
- **Sem gradientes.** Zero. Nem em texto, nem em botão, nem em fundo.
- **Sem halos.** Nenhum `box-shadow` do tipo `0 0 Npx <cor>`. A sombra, quando
  existe, é elevação: `0 2px 6px rgba(0,0,0,0.45)`, sempre a mesma direcção.
- **Sem cor como única pista.** Todo o estado tem cor **e** rótulo **e** texto.
- **A cor vive nos tokens.** Nenhum hex literal no markup — só em `:root` e
  nos estados semânticos.

### 2.2 Tipografia

| Papel | Fonte | Tamanho | Peso |
|---|---|---|---|
| Display | Barlow Condensed | 30 px | 700 |
| Título | Barlow | 13.5–20 px | 600–700 |
| Corpo | Barlow | 12–13.5 px | 400 |
| Etiqueta | Barlow | 10.5–11.5 px | 500–600 |
| Código | JetBrains Mono | 10–12 px | 400–600 |

- **Barlow, Barlow Condensed e JetBrains Mono** — a mesma folha nos três
  ecrãs. A Interface tem uma identidade tipográfica, não três.
- **JetBrains Mono é para código**: hashes, payloads, nomes de ferramenta,
  identificadores. **Não** para etiquetas de interface. Uma etiqueta em mono é
  um tell de máquina — o mono como linguagem de UI lê-se como terminal.
- Frases: 60–70 caracteres (`max-inline-size: 66ch`).
- Corpo: `line-height` 1.5–1.6. Título: 1.15–1.3.
- Título grande: `letter-spacing: -0.02em`. Corpo: tracking do typeface.
- Sentence case nos títulos. Uppercase só em etiquetas curtas (≤ 3 palavras).
- Sem travessões (—) no texto corrido.

### 2.3 Espaço e forma

- Raios: **2 px, 3 px, 4 px** e um círculo. Mais do que isto, e os cards
  tornam-se bolhas.
- Uma superfície = **uma** borda **ou** uma sombra, nunca as duas.
- Profundidade de contentor: **no máximo 1**. Um contentor dentro de outro
  dentro de outro é a «cardocalipse».
- Ritmo vertical: o espaçamento entre grupos é maior que o espaçamento
  dentro de um grupo. Sem gaps iguais em série.
- Alvos de toque: **44 × 44 px** (mínimo WCAG 2.2 AA é 24; escolhemos 44
  porque o telemóvel é usado em pé, na rua).
- Medida: `66ch` para texto corrido; tabelas e código em largura cheia.

## 3. Movimento

- **A imobilidade é o estado por omissão.** O movimento explica uma mudança
  de estado, mantém continuidade, ou marca um momento — nunca decora.
- **Cada animação está mapeada a um evento.** Se o evento não existiu, nada
  acende. Esta é a regra do `AGENTS.md` e prevalece sobre qualquer gosto pessoal.
- Nada de fade-up ao scroll, marquee automático, cursor a piscar, ou imagens
  que zoomam ao hover.
- Sem bounce, sem overshoot, sem parallax.
- `prefers-reduced-motion: reduce` remove o movimento e **mantém o feedback de
  estado** — o estado continua legível sem animação.

## 4. Conteúdo

- **Verbo concreto nos botões.** «Abrir processo», «Verificar conformidade» —
  nunca «Continuar» nem «Saber mais».
- **A fonte à vista, sempre.** Fonte, versão e data de consulta. É o critério
  do desafio.
- **Sem placeholders como evidência.** Se não há conteúdo real, diz-se.
- **Sem superlativos de marketing.** Nada de «revolucionário», «simples»,
  «sem esforço».
- **Rótulos honestos.** O que é simulado leva etiqueta «Simulação», sempre.
- No máximo **2 acções por secção**.

## 5. Acessibilidade (não negociável)

- Contraste: **4.5:1** para texto normal, **3:1** para texto grande e para
  componentes não-textuais. As rati **não** se arredondam — 4,499:1 falha.
- Foco visível em todos os interactivos, via `:focus-visible`.
- O texto sobrevive a 200 % de zoom e a 320 px de largura sem scroll
  horizontal.
- HTML semântico: `<table>` real para dados tabulares, `<label>` real para
  campos, `<caption>` quando a tabela tem título.
- O conteúdo **não depende de JavaScript**: se a animação não correr, o texto
  está lá.

## 6. Como saber se um ecrã ficou «IA slop»

Checklist mecânica, a correr contra o DOM renderizado:

| Regra | Como falha |
|---|---|
| Sem gradiente | qualquer `background-image` com `gradient` |
| Sem `transition: all` | `transition-property` inclui `all` |
| Sem emoji | qualquer emoji em `innerText` |
| Sem halo | `box-shadow` casa `0 0 Npx` com cor saturada |
| Sem radius grande | `border-radius` > 16 px |
| Sem mono na UI | `font-family` contém mono fora de `code`/`pre`/hashes |
| Sem nesting | ≤ 1 contentor com borda dentro de outro |
| Sem texto centrado | `text-align: center` em texto > 12 caracteres |
| Sem uppercase longo | texto > 4 caracteres todo em maiúsculas |
| Sem container-centrado | `text-align: center` no `body` |
| Alvos ≥ 44 px | `getBoundingClientRect().height` de cada `button`/`a` |
| Sem overflow | `scrollWidth <= clientWidth` a 320, 390, 768, 1440 |

Cada regra que falha é um tell conhado. A lista **não** é o objectivo — é um
sinal. A defesa durável é o sistema das secções 1 a 5, porque a lista de
proibições apodrece em meses: os tells mudam de era (roxo em 2022, bege em
2025, neobrutalismo em 2026).

## 7. Fontes

- NN/G — [Good Visual Design, Explained](https://www.nngroup.com/articles/good-visual-design/)
- NN/G — [Pairing Typefaces](https://www.nngroup.com/articles/pairing-typefaces/)
- GOV.UK Design System — [Type scale](https://design-system.service.gov.uk/styles/type-scale/), [Spacing](https://design-system.service.gov.uk/styles/spacing/), [Colour](https://design-system.service.gov.uk/styles/colour/)
- Vercel Design — [vercel.com/design](https://vercel.com/design) (a especificação
  anti-slop mais explícita que há)
- Impeccable — [catálogo de slop](https://impeccable.style/slop/) e
  [detector](https://impeccable.style/docs/detector)
- W3C — [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- web.dev — [Font best practices](https://web.dev/articles/font-best-practices)
