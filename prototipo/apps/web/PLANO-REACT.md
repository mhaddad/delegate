# Plano — React na web do protótipo

Data: 2026-10-19 · âmbito: `prototipo/apps/web/`
Estado do repo: 3 ecrãs HTML com React embutido via CDN, **sem** build,
**sem** `package.json` próprio.

---

## 1. O estado real (e o que está prometido)

O `prototipo/apps/web/AGENTS.md` promete:

> **Stack:** Vite + React, `@xyflow/react` para o grafo, `motion` para as
> animações — que traz `reducedMotion="user"` de fábrica, ao contrário das
> alternativas.

O que existe:

| Ecrã | Framework | Como chega ao browser | Build |
|---|---|---|---|
| `index.html` | **React 18.3.1** | `esm.sh` via CDN | nenhum |
| `consola.html` | **React 18.3.1** | `esm.sh` via CDN | nenhum |
| `delegate.html` | **Preact 10.23.2** | `esm.sh` via CDN | nenhum |
| `cmd.html` | nenhum (HTML estático) | — | — |

Três problemas, por ordem de gravidade:

1. **Duas frameworks no mesmo produto.** `delegate.html` usa Preact;
   `index.html` e `consola.html` usam React. As duas libraries são
   incompatíveis entre si — não se pode montar um componente React num
  árvore Preact. Isto é um bug à espera de acontecer, não uma preferência.
2. **Nenhuma das promessas do `AGENTS.md` existe.** Sem Vite, sem
   `@xyflow/react`, sem `motion`. O grafo da arquitectura é desenhado à mão
   em HTML e CSS.
3. **Sem `package.json` na web.** O `prototipo/package.json` tem
   `workspaces: ["packages/*", "apps/*"]` e o `apps/web` **já está dentro do
   workspace** — mas sem `package.json` próprio, o workspace está incompleto e
   o `pnpm`/`npm` não o trata como pacote.

## 2. A decisão

**Migrar os três ecrãs para uma SPA Vite + React, com o grafo em
`@xyflow/react` e o movimento em `motion`.**

Razões, e o que foi descartado:

| Opção | Veredicto |
|---|---|
| **Manter CDN sem build** | Descartada. Resolve o Preact-vs-React trocando o Preact por React, mas deixa o grafo à mão e o `motion` fora. E o `AGENTS.md` continua a mentir. |
| **React Router com 4 rotas** | Descartada. O prototype tem 3 ecrãs e a Consola nunca é projectada; rotas de browser não compram nada aqui. Um estado de ecrã basta. |
| **Vite + React, SPA com estado de ecrã** | **Escolhida.** É o que o `AGENTS.md` promete, resolve a incompatibilidade de frameworks, dá build e tipos, e o `motion` traz `reducedMotion="user"` de fábrica — que é o que o `AGENTS.md` quer dizer com aquilo. |

### O que NÃO muda

- **O `design-system` não é tailwind nem shadcn.** O `DESIGN.md` já define
  tokens semânticos próprios, derivados do símbolo da marca. Tailwind
  introduzia uma segunda fonte de verdade (e as suas own defaults — que é
  exactamente o que a auditoria apanhou). Se algum dia shadcn entrar, entra
  **customizado** a partir dos tokens do `DESIGN.md`, nunca com os valores
  de fábrica.
- **Os ecrãs não mudam de conteúdo.** O mesmo texto, os mesmos eventos, as
  mesmas etiquetas «Simulação».
- **O contrato de eventos não muda.** `packages/eventos` é a fonte; a web
  consome.

## 3. Fases

Cada fase é um commit. Cada fase deixa o produto a funcionar.

### Fase 0 — Tornar `apps/web` um workspace real (30 min)

```bash
cd prototipo/apps/web
cat > package.json <<'EOF'
{
  "name": "@delegate/web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
EOF
```

Adicionar ao `prototipo/package.json` (raiz):
```json
"scripts": {
  "web": "npm run dev --workspace @delegate/web"
}
```

**Critério de pronto:** `npm run web` arranca o Vite. Nada mais muda.

### Fase 1 — Dependências e Vite (45 min)

```bash
npm install --workspace @delegate/web react react-dom @xyflow/react motion
npm install --workspace @delegate/web -D vite @vitejs/plugin-react @types/react @types/react-dom
```

Ficheiros mínimos:

```
apps/web/
├── index.html          # Vite: <script type="module" src="/src/main.tsx">
├── vite.config.ts
└── src/
    ├── main.tsx        # monta <App/> e escolhe o ecrã pelo estado
    └── App.tsx
```

`vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://127.0.0.1:4000' } },
});
```

**Critério de pronto:** `npm run dev` mostra «Delegate» e a consola de
Vite no terminal. Zero ecrãs migrados ainda.

### Fase 2 — Tokens e base (45 min)

Um ficheiro só: `src/estilo/tokens.css`.

```css
:root {
  --del-fundo-obs: #0a0f18;
  --del-fundo: #0d131e;
  --del-cartao: rgba(18, 27, 44, 0.75);
  --del-borda: rgba(233, 237, 242, 0.10);
  --del-acento: #70bb86;
  --del-acento-forte: #8ccfa0;
  --del-texto: #e9edf2;
  --del-texto-secundario: #9aa8b8;
  --del-texto-suave: #66748a;
  --font-primary: 'Barlow', ...;
  --font-condensed: 'Barlow Condensed', ...;
  --font-mono: 'JetBrains Mono', monospace;
}
```

Mais `src/estilo/base.css` com o reset, o `:focus-visible`, o
`prefers-reduced-motion` e a folha do sistema.

**Critério de pronto:** os tokens do `DESIGN.md` estão em `:root` e não há
nenhum hex literal fora deste ficheiro. Isto é o que mantém a auditoria
anti-slop mecânica.

### Fase 3 — Migrar o `index.html` (Painel de Atividade) (2 h)

O ecrã mais valioso: é o que é projectado. Ordem de extração:

1. `<header>` com a barra institucional → `src/ecras/Painel.tsx`
2. `<main>` do palco → `src/ecras/Painel.tsx`
3. Grafo da arquitectura → **deixa HTML por agora** (ver Fase 5)
4. Painéis da direita → `src/ecras/Painel.tsx`

O `htm.bind(React.createElement)` e o JSX são quase o mesmo: converter
`` html`<div class="x">${y}</div>` `` → `<div className="x">{y}</div>`.

Regras de migração que evitam o slop:
- `class` → `className`; `style=${{...}}` → `style={{...}}`
- **Zero biblioteca de UI.** Nada de shadcn, nada de MUI. Os componentes são
  do `DESIGN.md` ou não existem.
- Cada ecrã é um ficheiro em `src/ecras/`, não um ficheiro gigante.

**Critério de pronto:** o `/` faz exactamente o que fazia, e a checklist do
`DESIGN.md` passa a zero violações.

### Fase 4 — Migrar `consola.html` e `delegate.html` (2 h)

`consola.html` e `delegate.html` entram no mesmo `App.tsx`, com o estado de
ecrã a escolher. A migração de `delegate.html` inclui **trocar Preact por
React** — que é a razão de ser desta fase.

Os 16 `<symbol>` SVG passam a `src/estilo/icones.svgx` (ou um ficheiro
`.tsx` que os exporta), com o mesmo `aria-hidden="true"`.

**Critério de pronto:** os três ecrãs navegam, e a consola continua a nunca
ver o Cofre.

### Fase 5 — Grafo em `@xyflow/react` (2–3 h) — **opcional, decisão à parte**

O grafo da arquitectura é o candidato natural a `@xyflow/react`: nós, arestas
e impulsos por evento. Mas:

- O grafo actual é **estático** — desenha a topologia, não o movimento.
- O `AGENTS.md` promete «um impulso por evento» e «latência por nó», que é
  `@xyflow/react` com `animated` edges.
- `@xyflow/react` traz o seu **estilo por omissão**: nós com caixa, sombras
  suaves, cores neutras. Usá-lo como vem **é** AI slop.

Portanto, se esta fase avançar, tem de incluir a re-estilização completa
do `@xyflow/react` (cores, raios, sombras, tipografia) a partir dos tokens
do `DESIGN.md`. Não é opcional se a fase avançar.

**Critério de pronto:** o grafo tem os nós do `DESIGN.md`, e um impulso
aparece por evento — **verificado no registo**, não encenado.

### Fase 6 — `motion` com `reducedMotion="user"` (1 h)

```tsx
<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

Só depois de as animações existirem. E com a regra do `AGENTS.md`: **cada
animação mapeada a um evento**. Se o evento não existiu, nada acende.

**Critério de pronto:** com `prefers-reduced-motion: reduce` o estado
continua legível sem animação.

### Fase 7 — Remover os HTML antigos (30 min)

Quando os três ecrãs estiverem em React e verificados, apagar
`index.html`, `consola.html`, `delegate.html` do directório e manter
apenas o `index.html` do Vite. Antes disso, nada é apagado.

## 4. Ordem de risco

| Fase | Risco | Reversível |
|---|---|---|
| 0–2 (workspace, deps, tokens) | baixo | sim, apagar |
| 3–4 (migração) | **médio** — uma SPA pode partir o que o HTML fazia | sim, com git |
| 5 (grafo) | **alto** — é o ecrã que se projecta | sim, mas é o mais caro de reverter |
| 6–7 | baixo | sim |

**Recommendation:** fases 0 a 4 são o essencial. A fase 5 (grafo) só deve
avançar se houver tempo depois de o produto estar sólido — e deve ser a
primeira a ser cortada, não a última. Um grafo bonito que não está certo
vale menos do que um ecrã que acende ao evento certo.

## 5. O que o React resolve (e o que não resolve)

O React **não** resolve o slop. Resolve a **incoerência**: duas frameworks,
três paletas herdadas, zero tokens partilhados, zero tipos.

O slop resolve-se com o `DESIGN.md` e com discipline de revisão — a
checklist da secção 6 do `DESIGN.md` é a que tem de passar, e ela é
mecânica, o que significa que dá para correr em CI.

## 6. O que falta decidir (e não é meu)

1. **A fase 5 entra ou não?** É a decisão cara. Recomendo: só se o tempo
   sobrar depois das fases 0–4.
2. **O `cmd.html` entra na SPA?** É o quarto ecrã, apareceu hoje, e está
   em HTML estático. Se entrar, entra na fase 4.
3. **O evento `legendas.json` chega à web como?** Hoje é copiado por
   `npm run legendas`. Com a SPA, pode ser importado como módulo do
   workspace `@delegate/eventos` — mais limpo, mas muda o contrato de
   ficheiros entre a pessoa B e a pessoa C.
