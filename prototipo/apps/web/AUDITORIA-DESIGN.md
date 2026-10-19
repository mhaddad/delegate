# Auditoria de design — `anti-ai-slop-design`

Data: 2026-10-19 · Âmbito: `prototipo/apps/web/*.html` (4 ecrãs)
Modo da skill: **Audit** — relatório de evidência e correções priorizadas. Nenhum
ficheiro foi alterado.

## Método

Renderização real dos quatro ecrãs num browser (Chromium), medição por estilo
computado no DOM, e leitura do código. Cada achado é rotulado conforme a skill:
`code-certain` (verificado no código ou no DOM renderizado), `inferred`.

Contra a regra: **zero media queries nos quatro ficheiros**.

---

## P0 — Overflow horizontal em dois ecrãs a 390 px

**Local:** `consola.html:127` (`.nav-links-menu`), `delegate.html:113` (`.header-nav`)
**Evidência:** `rendered` + `code-certain`

| Ecrã | Overflow a 390px | Elemento culpado |
|---|---:|---|
| `index.html` | 0 px | — |
| `consola.html` | **823 px** | `nav.nav-links-menu`, largura 373 px, `right` 657 px |
| `delegate.html` | **505 px** | `nav.header-nav`, largura 465 px, `right` 768 px |

A causa raiz é única e simples: **nenhum dos quatro ficheiros tem uma única
linha `@media`** (`rg "@media" *.html` → vazio). A navegação é `display:flex`
fixo, sem `flex-wrap`, sem `min-width:0`, sem breakpoint. Em telemóvel a barra
empurra a largura do documento.

Isto não é una questão estética. O `AGENTS.md` do projeto fixa
**legibilidade a seis metros** como requisito de sala, e um ecrã que transborda
na horizontal em telemóvel é um defeito de correção. A skill classifica-o como
falha de entrega, não de gosto.

**Correção mínima:** um breakpoint em `max-width: 640px` que colapsa a
navegação a uma coluna com `flex-wrap: wrap`, mais `min-width: 0` nos contentores
de flex. Reavaliar depois a 390 px com `scrollWidth <= clientWidth`.

---

## P0 — `delegate.html` usa a paleta default do Tailwind

**Local:** `delegate.html:48-58` (tokens), `:51-53` (fundo), `:602` (botão)
**Evidência:** `code-certain`

Os tokens são literais do Tailwind:

```css
--del-indigo:  #6366f1;   /* indigo-500 */
--del-roxo:    #8b5cf6;   /* violet-500 */
--del-violeta: #a855f7;   /* purple-500 */
--del-ciano:   #06b6d4;   /* cyan-500 */
--del-verde:   #10b981;   /* emerald-500 */
--del-ambar:   #f59e0b;   /* amber-500 */
--del-vermelho:#ef4444;   /* red-500 */
```

E o fundo do `body` são três `radial-gradient` (`delegate.html:51-53`) com
exatamente `rgba(99,102,241)`, `rgba(168,85,247)` e `rgba(6,182,212)` — os mesmos
índices, outra vez.

Isto é, literalmente, o anti-padrão que a skill nomeia em
`references/anti-patterns.md`: *"An unchosen purple-to-blue gradient, gradient
headline, aurora blob"* e *"Framework defaults presented as a finished visual
identity."* Os valores não foram escolhidos para o Guimarães — são o que sai
quando se pede «um gradiente roxo».

O mesmo ficheiro usa `#6366f1 → #8b5cf6` no botão principal
(`delegate.html:602`) e um gradiente roxo→índigo no `body`. São 6 gradientes e
4 `backdrop-filter` no total.

**Correção mínima:** manter os nomes de papel (`--del-*`) e substituir os
valores por uma paleta com razão. O projeto já tem uma identidade institucional
forte e verificável — azul-marinho `#08244c` e dourado, como no `index.html`. A
correção não exige redesign: exige escolher a partir do que já existe.

---

## P1 — Emojis a fazer de sistema de ícones

**Local:** `delegate.html` — 15 ocorrências
**Evidência:** `rendered`

⚙️ ⚡ 📊 👩‍💼 👤 📱 🔐 🤝 🛡️ 🌐 🏛️ 📋 💳

Aparecem em `span`s sem classe, na barra lateral, e como prefixo de cada item de
nó (`.item-nome`). O `AGENTS.md` do projeto é categórico: *pt-PT em mensagens e
código*. Um ⚙️ ou 🏛️ é uma imagem com glossótipo próprio e não passa em
instituição autárquica portuguesa — e o emoji dentro de `<span>` sem
`aria-hidden` é lido em voz alta pelo leitor de ecrã como nome próprio.

A skill: *"Emoji or unrelated glyphs standing in for a coherent icon system."*

**Correção mínima:** um conjunto de ícones monocromático e consistente, com
`aria-hidden="true"` no glyph e nome acessível no texto adjacente. Este ecrã tem
um argumento forte a favor (a arquitetura em 3 camadas é literalmente o
produto), o que pede ícones desenhados para ele, não clip-art de sistema
operativo.

**Nota de contexto:** os ecrãs da Câmara (`index.html`, `consola.html`) têm
**zero emojis**. Só o lado do Sistema usa. A inconsistência entre os dois lados
é, ela própria, parte do problema.

---

## P1 — `delegate.html` diverge do sistema dos outros ecrãs

**Evidência:** `rendered`

| | `index` / `consola` | `delegate` |
|---|---|---|
| Fonte | Barlow + Barlow Condensed + JetBrains Mono | **Plus Jakarta Sans** + JetBrains Mono |
| Fundo | branco / cinzento claro | `#07090e` quase preto |
| Raios | 2–3 px | 4–12 px, com `999px` |
| Sombras | 2 | 8, das quais 6 são `glow` |

A fonte é o caso mais claro: `index.html:16` e `consola.html:16` carregam a
mesma folha do Google Fonts (Barlow); `delegate.html:16` carrega outra
(Plus Jakarta Sans). Três ecrãs da mesma produto, duas identidades tipográficas.
Isto não é um problema de gosto por página — é a divisão visual do produto.

`Plus Jakarta Sans` merece nota própria: está em dezenas de produtos SaaS
modernos e é reconhecível como default. A skill: *"One unexamined default font
for every role."*

**Correção mínima:** alinhar `delegate.html` na folha do Barlow já usada pelos
outros dois ecrãs. É uma linha e um link.

---

## P1 — Alvos de toque abaixo do mínimo

**Evidência:** `rendered`

A 390 px, os alvos com menos de 44 px de altura:

- `consola.html` — «Início» 15 px, «Ocorrências» 28 px, filtros de estado 25 px (6 alvos)
- `delegate.html` — «Painel de Atividade» e «Consola Técnica» 34 px
- `index.html` — «Modo Geral» / «Modo Auditoria» 41 px

A skill e o `verification.md` pedem ~44×44 CSS px. «Início» a 15 px é um link de
breadcrumb: numa sala, com um telemóvel na mão, é um alvo real.

**Correção mínima:** `padding` vertical ou `min-height` nos alvos pequenos.
Sem redesenhar nada.

---

## P2 — Sombra de brilho usada como linguagem de estado

**Local:** `delegate.html:142, 389, 442, 518, 615`
**Evidência:** `code-certain`

Cinco `box-shadow` são `0 0 Npx <cor>` — halo, não elevação. Exemplo, linha
442: `box-shadow: 0 0 16px rgba(245, 158, 11, 0.35)`.

A skill: *"Glass, blur, shadow, grain, or texture without a material or layering
reason."* Um halo não comunica agrupamento nem elevation; comunica «isto está
ligado». Se o estado já tem cor, texto ou rótulo — e tem, o mandato D0–D4 é
rotulado — o halo é redundante.

**Correção mínima:** remover os halos que duplicam um estado já sinalizado por
outro meio.

---

## O que está certo (e não deve ser tocado)

Vale dizer, porque uma auditoria que só aponta defeitos não é útil:

- **`index.html` e `consola.html` estão limpos.** Zero gradientes, zero
  `backdrop-filter`, zero emojis, zero `transition: all`, zero animação
  infinita, uma sombra cada. Raios de 2–3 px, coerentes. A paleta é
  institucional e verificada, não default.
- **Sem overflow** no `index.html` em nenhum dos dois viewports.
- **A paleta do `index.html` ésubject-specific** — azul `#08244c`, dourado
  `#fff8e1`, verde muito claro. Não parece chosen por omissão.
- **O conteúdo é real e datado.** «2,10 m ≥ 2,00 m», «RTTL 2025 Art. 42.º»,
  «Reg. n.º 123/2020» — o texto do produto, com fontes à vista. É o oposto do
  que a skill chama de slop de conteúdo.
- **O `index.html` usa JetBrains Mono para código/dados** e Barlow para
  prosa — um sistema de papéis real, não uma fonte para tudo.
- **Sem ACCESSIBILIDADE quebrada:** alvos com nome acessível existem; a regra de
  escrita está cumprida.

O problema está concentrado num ficheiro: **`delegate.html`**, que foi criado
hoje (`54fd98d`) e diverge do sistema dos outros três.

---

## Ordem sugerida

1. Media queries nos quatro ficheiros — corrige o overflow de telemóvel. É o
   único achado que é defeito de entrega.
2. Alinhar a fonte de `delegate.html` em Barlow.
3. Trocar os 7 tokens default do Tailwind por valores escolhidos.
4. Emojis → ícones com `aria-hidden`.
5. Alvos de toque < 44 px.
6. Halos redundantes.

Os passos 1 e 2 são changes pequeños e de baixo risco. O 3 muda o carácter
visual do ecrã e vale uma decisão, não um script.