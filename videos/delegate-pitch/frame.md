---
name: Delegate — Palco e Bastidores
colors:
  palco-bg: "#F4EFE6"        # creme pergaminho — o mundo da Inês
  palco-ink: "#1D2430"       # tinta do palco (texto principal sobre creme)
  palco-muted: "#6B6F78"     # texto secundário sobre creme
  bastidores-bg: "#0F1B2D"   # azul-noite — Câmara e tecnologia
  bastidores-panel: "#16263D" # painéis e nós sobre azul-noite
  bastidores-line: "#8C9099" # granito — traço técnico, burocracia
  bastidores-ink: "#E8EDF3"  # texto sobre azul-noite
  verde: "#2FBF71"           # Delegate / Henriques / agentes / resolução
  terracota: "#D9653B"       # condicionantes, alertas, a dor, cadeados
typography:
  display:
    family: "Fraunces"
    weights: [400, 600]
    use: frases-chave, títulos, tagline (sentence case, tracking -0.02em)
  sans:
    family: "Hanken Grotesk"
    weights: [400, 500, 700]
    use: UI do chat, rótulos, legendas
  mono:
    family: "JetBrains Mono"
    weights: [400, 700]
    use: bastidores — capacidades, versões, registos de auditoria
  sizes:
    headline: 96px
    title: 64px
    body: 32px
    ui: 28px
    label: 20px
spacing:
  safe-margin: 96px
  caption-keepout-bottom: 180px
components:
  chat-bubble: "radius 28px; Inês = palco-ink sobre branco #FFFFFF; Henriques = bastidores-bg com texto bastidores-ink"
  node: "círculo 1.5px verde, fill bastidores-panel, ícone + rótulo mono"
  box: "retângulo radius 10px, borda 1.5px bastidores-line, fill bastidores-panel"
  surface-line: "linha horizontal 2px verde a 50% de opacidade, com brilho suave apenas nesta linha"
---

# Delegate — Palco e Bastidores

## Overview

Dois mundos num só ecrã. **Palco**: o mundo calmo e quente da munícipe, em creme, com ilustração flat de traço fino e uma conversa simples. **Bastidores**: a Câmara e a tecnologia em azul-noite, com diagramas técnicos de traço granito e agentes verdes. A **linha de superfície** separa os dois mundos e é o fio visual do vídeo.

## The Frame

- 1920×1080, margem de segurança de 96px. As legendas ocupam os últimos 180px, por isso o conteúdo principal fica acima dessa zona.
- Um único foco por cena. O verde só aparece onde o Henriques ou a resolução atuam. A terracota só aparece onde há dor, condicionante ou cadeado.

## Composition Rules

- Ilustração em line art de 2–3px com tinta `palco-ink` sobre creme. Sem gradientes realistas e sem rostos com detalhe.
- Os diagramas dos bastidores usam linhas de 1.5px em granito. Os pulsos de luz que percorrem as linhas são verdes.
- Mono só nos bastidores.

## Do's / Don'ts

- Usar a serifada para a frase que deve ficar na memória de cada cena.
- Não usar sombras pesadas, glow genérico nem estética "neon IA".
- Não usar o logótipo nem o verde do WhatsApp, nem logótipos oficiais da Câmara.
- Não fazer um "slideshow" de cartões soltos: a linha de superfície e os nós persistem entre cenas.
