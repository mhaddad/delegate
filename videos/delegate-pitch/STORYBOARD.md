---
format: 1920x1080
fps: 30
duration: 179.9s
message: "Para o munícipe, parece magia: diz o que precisa e o Henriques trata do resto. Por baixo, agentes de IA, um cofre pessoal e técnicos da Câmara garantem o rigor."
arc: Gancho → Desejo → Problema → Insight → Revelação → Palco (a magia) → Bastidores (a arquitetura) → Cofre → Pessoas decidem → Resolução → Visão → Pedido → Fecho (bookend)
audience: júri e participantes do Hack4Guimarães (Câmara, ecossistema local, mentores técnicos e de negócio)
language: pt-PT (narração e todo o texto em ecrã)
status: v2 aprovado · sketches v1 confirmados · build em curso
mode: collaborative
---

# Delegate — Storyboard do vídeo de pitch (Hack4Guimarães) · v2

## Conceito narrativo

**Heroína, guia, vilão:** a **Inês** (fictícia) herdou do avô um terreno em Ponte e quer construir ali a sua casa, mas o PDM foi atualizado. O **Henriques** é o guia e a burocracia é o labirinto. O vídeo abre e fecha na muralha **"Aqui nasceu Portugal"**.

**Recurso visual central: Palco e Bastidores.** O ecrã é cortado por uma **linha de superfície** horizontal que atravessa o vídeo da cena 7 à 11.

- **Acima da linha (o palco):** o mundo da Inês. Fundo creme e quente, uma conversa simples, nada de burocracia. É aqui que tudo "parece magia".
- **Abaixo da linha (os bastidores):** a Câmara e a tecnologia. Fundo azul-noite, diagramas em traço técnico, agentes de IA, sistemas municipais, técnicos. Tudo o que é necessário à Câmara e que a Inês nunca precisa de ver.

A câmara mergulha abaixo da linha para mostrar a arquitetura e volta a subir para a superfície calma. A ideia que o júri deve levar é a de que **o controlo e a burocracia continuam a existir, só deixam de pesar sobre o cidadão**.

**Regras de credibilidade:** não usamos números inventados. O conteúdo da conversa e as condicionantes do PDM são ilustrativos e ficam marcados como tal em letra pequena. A demo mostra o Henriques a dizer o que não sabe. O pedido final é pequeno e concreto.

## Direção visual

| Elemento | Proposta |
|---|---|
| Estilo | Motion graphics 2D. Line art fino para a cidade, UI limpa para o palco e diagramas técnicos ("blueprint") para os bastidores. Sem rostos realistas. |
| Paleta | Palco: creme `#F4EFE6`, terracota `#D9653B`. Bastidores: azul-noite `#0F1B2D`, linhas granito `#8C9099`. Henriques/agentes/resolução: verde Delegate `#2FBF71`. Alertas/condicionantes: terracota. |
| Tipografia | Serifada de display (ex.: *Fraunces*) para frases-chave; sans (ex.: *Inter*) para UI; **mono** (ex.: *JetBrains Mono*) para os bastidores: nomes de capacidades, versões, registos de auditoria. |
| Henriques | Emblema, não rosto: monograma "H" num escudo geométrico (referência discreta a D. Afonso Henriques). Pulsa quando "pensa". |
| Agentes de IA | Pequenos nós circulares verdes, cada um com ícone e nome. Comunicam por pulsos de luz que percorrem as linhas do diagrama. |
| Mensagens | Interface genérica, sem logótipo nem verde da marca WhatsApp. O nome aparece só na narração e num ícone de canal neutro. |
| Música | Motivo curto de guitarra portuguesa na abertura e no fecho. Batida eletrónica leve a partir da revelação. Nos bastidores entra um pad mais "técnico" que se resolve quando a câmara regressa ao palco. |
| Legendas | Legendas pt-PT queimadas no vídeo. |

## Espinha, proibições e momento parado

- **Espinha (spine):** a **linha de superfície**. Nasce na cena 7, divide palco e bastidores nas cenas 7–10, dissolve-se na 11. A muralha "Aqui nasceu Portugal" é o adereço de abertura e fecho (callback da cena 14 para a 1).
- **Direção das transições:** verticais dentro do eixo palco/bastidores (mergulhar = descer, voltar = subir); horizontais (para a esquerda) nas restantes.
- **Proibições:** sem glow "neon IA"; sem marca WhatsApp; sem logótipos oficiais da Câmara; sem números inventados; sem rostos realistas; sem endcard estático. Evitar o *slideshow* (cada cena um cartão novo) e o *screensaver* (movimento que não diz nada).
- **Momento parado:** cena 10, no plano-síntese "Magia para a Inês. / Controlo para a Câmara." Durante cerca de 2 s nada se mexe e a frase assenta.
- **Verdade:** a conversa, as condicionantes do PDM e a resposta do técnico são ilustrativas (rodapé). Os nomes dos serviços municipais são reais e públicos.

---

## Locked

- Texto (SCRIPT.md v2), voz (ElevenLabs · Sofia, pt-PT), layout de todas as cenas (storyboard.html v1, confirmado em 2026-10-14).
- Duração total: 179,9 s. As durações e os tempos de palavra abaixo vêm da voz real (audio/timing.json). Nos Scene lines, os tempos são **locais à cena** (segundos desde o início da cena).

## Changes from v1

- Durações recalculadas a partir da narração real; nenhuma alteração de layout nem de texto.

---

## Frame 1 — Aqui nasceu Portugal

- status: animated
- src: compositions/frames/01-aqui-nasceu.html
- sketch: storyboard.html#frame-01
- duration: 8.6s
- transition_in: fade do preto
- blueprint: compose
- rules: svg-path-draw, waterfall-entry, viewport-change
- focal: a muralha com "AQUI NASCEU PORTUGAL"
- voiceover: "Foi em Guimarães que nasceu Portugal. E é cá que a Inês tem o terreno que herdou do avô."
- vo_cues: Guimarães@1.96 Portugal@2.91 Inês@4.6 terreno@5.21 avô@6.09

Fundo creme. Toda a cena vive num `.world` (viewport-change) mais largo do que o ecrã: à esquerda a muralha e o skyline, à direita o terreno com a oliveira e a Inês.

Scene 1 (0.0–3.2s): a muralha de pedra (bloco #DDD6C9 com juntas granito) já está visível em t=0. As letras "AQUI NASCEU" e depois "PORTUGAL" acendem letra a letra (waterfall-entry por letra, opacity + y 20px, stagger ≤0.05s); "PORTUGAL" completa-se em ~3.0s, no cue "Portugal". O skyline (castelo, torres, telhados) desenha-se por baixo com svg-path-draw entre 0.6 e 3.0s.
Scene 2 (3.2–7.6s): travelling lateral para a direita (viewport-change, ease power2.inOut): a câmara desliza ~900px, passa sobre os telhados e pousa no terreno com a oliveira e a Inês (figura line-art de costas, como no sketch). A Inês fica enquadrada no cue "Inês" (4.6s). O pin terracota + "Ponte, Guimarães" entra com spring pequeno em ~5.2s ("terreno").
Scene 3 (7.6–8.6s): micro-drift residual (o mundo continua a deslizar ~20px), sem exit.

Composição final igual ao sketch: a muralha sai parcialmente de quadro à esquerda e o terreno e a Inês ficam no terço direito. Nada abaixo de y=900.

## Frame 2 — O sonho e a dúvida

- status: animated
- src: compositions/frames/02-sonho-duvida.html
- sketch: storyboard.html#frame-02
- duration: 6.9s
- transition_in: corte
- blueprint: compose
- rules: svg-path-draw, spring-pop-entrance, sine-wave-loop
- focal: o contorno tracejado da casa com o "?" terracota
- voiceover: "Quer construir ali a sua casa. Mas o PDM foi atualizado. Será que ainda pode?"
- vo_cues: construir@0.66 casa@1.61 PDM@2.78 atualizado@3.5 Será@4.72 pode@5.35

Mesmo terreno da cena 1 (chão e oliveira à direita), agora mais perto.

Scene 1 (0.0–1.9s): o contorno da casa desenha-se com traço tracejado (svg-path-draw; o dash de desenho é sólido e depois a casa fica tracejada, ou desenha-se em segmentos), completo no cue "casa" (1.6s).
Scene 2 (2.3–3.9s): a folha "PDM" cai de cima para a posição do sketch (rotação 7°, ease power3.in + pequeno ressalto) no cue "PDM" (2.78s). O carimbo "ATUALIZADO" bate em 3.5s (spring-pop-entrance a partir de scale 1.6 → 1, com um micro-shake da folha).
Scene 3 (3.9–6.9s): a casa começa a tremer (sine-wave-loop de x ±4px, finito) e os 4 traços terracota de vibração aparecem. O "?" terracota nasce dentro da casa no cue "Será" (4.72s) com spring-pop e pulsa suavemente (scale 1↔1.06) até ao fim.

## Frame 3 — O labirinto

- status: animated
- src: compositions/frames/03-labirinto.html
- sketch: storyboard.html#frame-03
- duration: 18.2s
- transition_in: carimbo afunda em papel
- blueprint: overwhelm-surround
- rules: waterfall-entry, spring-pop-entrance, multi-phase-camera
- focal: o "?" terracota dentro do relógio (estado final)
- voiceover: "Para saber, teria de descobrir que planta consultar. Que regras mudaram. Que pedido fazer, e a quem. Um site. Uma planta que não entende. Uma ida à Câmara. E a pergunta de sempre: em que ponto está o meu pedido?"
- vo_cues: planta@2.49 regras@4.52 pedido@6.05 quem@7.4 site@8.63 planta@9.92 entende@10.56 Câmara@12.35 pergunta@13.61 ponto@15.44 pedido@16.12

Variante clutter-shove-to-question do blueprint: a acumulação acontece sob um zoom-out lento, e no fim um push-in empurra a desordem para as bordas e abre o centro para a pergunta. Fundo #E7E3DC.

Scene 1 (0.0–4.0s): o cartão-janela "Planta de ordenamento?" (com tabs e manchas tracejadas/hachuradas da planta) cai em cima, rodado -4°, no cue "planta" (2.5s).
Scene 2 (4.0–8.2s): o cartão "Condicionantes?" entra no cue "regras" (4.5s) e o cartão "PIP? Licença?" + "Processo n.º ———" entra no cue "pedido" (6.05s). Cada entrada é mais rápida do que a anterior.
Scene 3 (8.2–13.2s): a acumulação acelera: aparecem mais 3–4 separadores de browser pequenos ("site", em 8.6s), uma segunda planta mais pequena (9.9s), a senha "A-127" (12.3s, "Câmara") e os círculos de carimbo "CM". A câmara faz zoom-out lento contínuo (multi-phase-camera, scale 1.08 → 1.0) desde 0s.
Scene 4 (13.4–18.2s): no cue "pergunta" (13.6s), push-in: toda a desordem desbota para opacity 0.5 e é empurrada ~60px para as bordas. O relógio terracota (círculo + 4 marcas) desenha-se no centro e o "?" gigante entra com spring no cue "ponto" (15.4s). O ponteiro do relógio (uma linha fina) roda continuamente até ao fim. O estado final é igual ao sketch.

## Frame 4 — O insight

- status: animated
- src: compositions/frames/04-insight.html
- sketch: storyboard.html#frame-04
- duration: 11.4s
- transition_in: morph (papéis viram diagrama)
- blueprint: kinetic-type-beats
- rules: waterfall-entry, spring-pop-entrance
- focal: a frase "Fizemos de cada cidadão / o gestor dessa complexidade."
- voiceover: "Esta burocracia existe por boas razões: protege o território e deixa prova. O problema é outro. Fizemos de cada cidadão o gestor dessa complexidade."
- vo_cues: burocracia@0.78 protege@3.3 prova@4.96 problema@5.98 Fizemos@7.35 cidadão@8.18 gestor@8.89 complexidade@9.63

Fundo creme. Rótulo "MODELO ATUAL" (mono, muted) e as 4 caixas ligadas por setas, como no sketch.

Scene 1 (0.0–3.0s): as 4 caixas entram em cascata da esquerda para a direita (waterfall-entry, a partir de y+30 com rotação residual ±3°, como papéis a assentar), com as setas a desenhar-se entre elas. As caixas 2 e 3 ainda aparecem com traço granito neutro.
Scene 2 (3.0–7.2s): fase de respeito. As caixas ficam estáveis e uma linha fina granito sublinha o diagrama inteiro em "protege" (3.3s). Nada de terracota ainda.
Scene 3 (7.2–11.4s): no cue "Fizemos" (7.35s), a frase serifada sobe de baixo (linha 1). Em "cidadão" (8.18s) as duas palavras "cidadão" das caixas 2 e 3 acendem a terracota e o traço dessas caixas passa a terracota 4px, com spring pequeno. A linha 2 entra em 8.8s e "gestor" fica a terracota com um sublinhado terracota (barra de 6px que cresce em scaleX a partir da esquerda) no cue "gestor" (8.89s).

## Frame 5 — A revelação

- status: animated
- src: compositions/frames/05-revelacao.html
- sketch: storyboard.html#frame-05
- duration: 8.6s
- transition_in: flip 3D do diagrama
- blueprint: logo-assemble-lockup
- rules: spring-pop-entrance, waterfall-entry, svg-path-draw
- focal: o logótipo "Delegate" + ponto verde
- voiceover: "E se fosse ao contrário? Isto é o Delegate: um representante digital ao serviço de cada munícipe."
- vo_cues: contrário@1.17 Isto@2.28 Delegate@3.24 representante@4.52 digital@5.19 munícipe@6.97

Fundo azul-noite. É a viragem de cor do vídeo.

Scene 1 (0.0–2.2s): o fluxo novo "necessidade → Henriques entende → Henriques orquestra → munícipe recebe a resposta" monta-se no topo (y≈210), palavra a palavra, com as duas palavras "Henriques" a verde. Entra no cue "contrário" (1.17s) e fica a 75% de opacidade.
Scene 2 (2.2–4.4s): o wordmark "Delegate" (Fraunces 600, 230px) monta-se letra a letra (cascade de baixo, stagger ≤0.04s) e fica completo no cue "Delegate" (3.24s). O ponto verde faz spring-pop logo a seguir (3.5s). Este é o momento do logótipo.
Scene 3 (4.4–8.6s): "mais um portal" e "mais um chatbot" entram (granito) e são riscados por linhas terracota desenhadas da esquerda para a direita (svg-path-draw), entre 4.5s e 5.6s. "REPRESENTANTE DIGITAL EMBARCADO" (mono, verde, tracking largo) entra em 5.2s ("digital") com reveal de tracking. Lenta respiração de escala no logótipo (1.0 → 1.02) até ao fim.

## Frame 6 — Conheça o Henriques

- status: animated
- src: compositions/frames/06-afonso.html
- sketch: storyboard.html#frame-06
- duration: 12.6s
- transition_in: zoom no logótipo → emblema
- blueprint: constellation-hub
- rules: spring-pop-entrance, svg-path-draw, sine-wave-loop
- focal: o escudo do Henriques com o "H"
- voiceover: "Em Guimarães, chama-se Henriques — um nome com história nesta cidade. Por mensagem, portal, voz ou balcão: a Inês diz o que precisa. O Henriques trata do resto."
- vo_cues: Henriques@1.77 história@3.22 mensagem@5.0 portal@5.67 voz@6.33 balcão@6.86 precisa@8.7 Henriques@9.79 resto@10.73

Fundo azul-noite. Hub = escudo central; satélites = 6 chips de canal na órbita tracejada.

Scene 1 (0.0–2.4s): o escudo desenha o contorno verde (svg-path-draw) e o "H" entra com spring no cue "Henriques" (1.77s). A órbita tracejada desenha-se à volta.
Scene 2 (2.4–4.6s): o escudo "respira" (sine-wave-loop de scale 1↔1.03, finito).
Scene 3 (4.6–7.6s): os chips entram com spring na órbita ao ritmo da voz: "Mensagens" (5.0), "Portal" (5.67), "SMS" (6.0), "Voz" (6.33), "Telefone" (6.6) e "Balcão" (6.86).
Scene 4 (7.6–9.5s): os chips derivam levemente na órbita e "mesma missão · mesmo estado" (mono) entra por baixo do escudo em ~8.0s.
Scene 5 (9.5–12.6s): a tagline "Diga o que precisa. O Henriques trata do resto." (Fraunces 74, com "O Henriques trata do resto." a verde) entra como waterfall de palavras e fica completa no cue "resto" (10.7s). Depois mantém-se ~1.8s, com a órbita a rodar muito devagar.

## Frame 7 — O palco: parece magia

- status: animated
- src: compositions/frames/07-palco.html
- sketch: storyboard.html#frame-07
- duration: 19.8s
- transition_in: emblema → avatar; nasce a linha
- blueprint: device-surface-showcase
- rules: spring-pop-entrance, svg-path-draw, press-release-spring
- focal: o telemóvel com a conversa; no fim, "Parece magia."
- voiceover: "A Inês pergunta como perguntaria a um amigo. O Henriques pede para usar a localização do terreno, consulta o novo PDM e responde: o que mudou, o que é certo, o que depende de um técnico. E deixa o pedido formal pronto. Para a Inês, parece magia."
- vo_cues: pergunta@1.16 amigo@2.57 Henriques@3.71 localização@4.91 consulta@6.49 PDM@7.38 responde@8.27 mudou@9.58 certo@10.5 técnico@12.0 pedido@13.51 pronto@14.27 Inês@15.68 magia@16.77

Variante "cursorless stepwise-flow" do blueprint: o telemóvel é o herói e os ecrãs avançam por um fluxo real, sem cursor. Em cima, até y=760, palco creme; em baixo, faixa azul-noite. O telemóvel fica à esquerda (x 200–800, y 40–740).

Scene 1 (0.0–1.0s): a linha de superfície verde risca o ecrã da esquerda para a direita em y=760 (svg-path-draw ou scaleX de origem esquerda). O telemóvel sobe de baixo para a posição, com o cabeçalho "Henriques" e o avatar-escudo.
Scene 2 (1.0–5.6s): a bolha da Inês (verde-claro #E9F6EE) entra com spring no cue "pergunta" (1.16s): "Henriques, o PDM mudou. Ainda posso construir uma casa de 100 m² no terreno do meu avô?". No cue "localização" (4.9s) entra a bolha do Henriques: "Posso usar a localização do terreno que guardou no seu Cofre?" com o botão verde "Autorizar para esta missão", que leva um press (press-release-spring) em ~5.4s.
Scene 3 (5.6–12.6s): as mensagens anteriores sobem e saem pelo topo do ecrã do telemóvel (scroll interno, nunca mais de 2 mensagens visíveis). A bolha da Inês fica e o cartão azul-noite "Análise preliminar · PDM em vigor ↗" entra em "PDM" (7.4s). As três linhas do cartão acendem nos cues: ● terracota "Mudou: condicionante ambiental / em parte do terreno" (9.58), ● verde "Certo: uso habitacional no resto" (10.5), ○ "Depende de um técnico: / implantação de 100 m²" (12.0). Debaixo da linha de superfície, os pulsos verdes acendem e apagam (opacity 0.25 → 0.8 → 0.4, glow radial suave) sempre que uma linha do cartão aparece, porque algo trabalha no escuro.
Scene 4 (12.6–15.2s): o botão "Rever e submeter" entra no cue "pedido" (13.5s) e leva um press em 14.3s ("pronto"). Uma mini-sequência dentro do telemóvel (0.6s cada) mostra o ecrã "Chave Móvel Digital" (ícone genérico de chave + barra de progresso) e depois o cartão "Recibo · sistema municipal ✓". No fim, volta ao estado do sketch (bolha + cartão + botão).
Scene 5 (15.2–19.8s): "Parece magia." (Fraunces 150) entra à direita, palavra a palavra, e fica completa no cue "magia" (16.77s), com uma única passagem de brilho (faixa clara em gradiente que atravessa a frase da esquerda para a direita, via máscara) sobre a frase. Depois entram a linha muted "o que mudou · o que é certo · o que depende de um técnico" (17.2s) e o rodapé "conteúdo ilustrativo; não representa o PDM em vigor" (17.6s). Held até ao fim; os pulsos verdes continuam lá em baixo.

## Frame 8 — Os bastidores: agentes de IA a trabalhar

- status: animated
- src: compositions/frames/08-bastidores.html
- sketch: storyboard.html#frame-08
- duration: 21.0s
- transition_in: mergulho ↓ pela linha
- blueprint: compose
- rules: svg-path-draw, svg-icon-enrichment, spring-pop-entrance, discrete-text-sequence, viewport-change
- focal: os quatro agentes a acender em sequência; depois os pulsos a descer até aos sistemas
- voiceover: "Por baixo da conversa, trabalha uma equipa de agentes de IA. Um entende a missão. Outro guarda o contexto. Outro lê as regras, com fonte e versão. Outro avalia o risco. Ligam-se aos sistemas da Câmara com acessos limitados a cada tarefa, e cada passo fica registado."
- vo_cues: conversa@1.49 agentes@3.35 IA@3.87 Um@4.69 missão@5.3 Outro@6.31 contexto@7.05 Outro@8.18 regras@8.91 versão@10.37 Outro@11.41 risco@12.22 Ligam-se@13.29 sistemas@13.89 Câmara@14.48 limitados@15.49 registado@18.38

Fundo azul-noite. No topo, a faixa creme (y 0–86) com a mini-bolha da conversa e a linha de superfície verde em y=86. A arquitetura é a do sketch: Henriques·RDE + Cofre → Motor de política → Orquestrador → 4 agentes (+4 secundários à esquerda) → Conhecimento versionado (à direita) → Camada de integração com 3 capacidades mono + etiqueta "finalidade · escopo · prazo" → 3 sistemas → caixa "Auditoria e prova" à esquerda.

Scene 1 (0.0–1.4s): entrada de câmara de mergulho dentro da cena (viewport-change). O `.world` começa deslocado +300px para baixo, como se ainda estivéssemos a descer, e assenta. A faixa creme do topo desliza para a sua posição.
Scene 2 (1.4–4.6s): o esqueleto desenha-se de cima para baixo (svg-path-draw nas ligações): "Henriques · RDE" e "Cofre de Contexto Pessoal" (1.5), "Motor de política…" (2.1), "Orquestrador de missões" (2.6) e os 4 círculos de agente ainda apagados, só com traço granito (3.3, "agentes"). Os 4 agentes secundários aparecem a 60% de opacidade com um stagger rápido em 3.9s ("IA").
Scene 3 (4.6–12.8s): os agentes acendem um a um (anel verde + núcleo verde com spring-pop, e o rótulo a passar a branco) nos cues "Um" 4.69 → Entendimento de missão, "Outro" 6.31 → Guardião de contexto (ao acender, um pulso percorre a ligação até ao Cofre), "Outro" 8.18 → Navegador de regras (a ligação até "Conhecimento versionado / PDM v.2026 · regulamentos" desenha-se e a caixa entra em 8.9s, "regras") e "Outro" 11.41 → Supervisor de risco. Cada agente aceso mantém um núcleo a pulsar suavemente (svg-icon-enrichment: pulsing dot, finito).
Scene 4 (12.8–17.2s): "Ligam-se" (13.3s): a "Camada de integração — capacidades limitadas" desenha-se e as 3 capacidades mono entram em cascata. A etiqueta "finalidade · escopo · prazo" faz spring em "limitados" (15.5s). Os 3 sistemas ("Urbanismo Digital", "Balcão Virtual", "Diretório de Serviços") e o rótulo "SISTEMAS DA CÂMARA" entram no cue "sistemas"/"Câmara" (13.9–14.5s). Pulsos verdes (pontos de 7px) descem pelas ligações, dos agentes até às capacidades e aos sistemas (dash-flow em loop finito).
Scene 5 (12.0–21.0s, em paralelo): a caixa "Auditoria e prova" aparece em 12.0s e as linhas de registo vão sendo escritas uma a uma (discrete-text-sequence), começando em 12.5s, com cerca de uma linha a cada 1.0s. A última linha fecha no cue "registado" (18.4s). Tudo continua vivo até ao fim, com pulsos e núcleos.

## Frame 9 — O Cofre de Contexto Pessoal

- status: animated
- src: compositions/frames/09-cofre.html
- sketch: storyboard.html#frame-09
- duration: 13.2s
- transition_in: zoom no nó Cofre
- blueprint: compose
- rules: coordinate-target-zoom, waterfall-entry, nudge-curve, spring-pop-entrance
- focal: o Pacote da missão a viajar para a Câmara
- voiceover: "O contexto da Inês vive no seu Cofre de Contexto Pessoal, sob o controlo dela. A Câmara recebe apenas o mínimo da missão: o terreno e a pretensão. Nem mais uma linha."
- vo_cues: contexto@0.69 Cofre@2.31 Pessoal@3.23 controlo@4.42 Câmara@5.96 mínimo@7.2 terreno@8.7 pretensão@9.51 Nem@10.71 linha@11.37

Fundo azul-noite. Cofre à esquerda (painel com a árvore mono), pacote creme à direita e caixa "Câmara" na ponta direita.

Scene 1 (0.0–1.2s): coordinate-target-zoom: começa com o painel do Cofre em scale ~0.35, como um nó pequeno à esquerda, e faz zoom/abertura até ao tamanho final.
Scene 2 (1.2–5.6s): o título "Cofre de Contexto Pessoal" e "controlado pela Inês" entram no cue "Cofre" (2.3s). A árvore mono entra linha a linha (waterfall-entry), "Terreno em Ponte" a verde em 2.6s e as 5 linhas seguintes até 4.4s ("controlo"). Os 3 itens com cadeado terracota ("outras conversas", "outros imóveis", "histórico pessoal") entram a 70% de opacidade em 4.8s.
Scene 3 (5.6–10.0s): no cue "Câmara" (5.96s), a caixa "Câmara" faz spring na direita. Em "mínimo" (7.2s), três linhas da árvore (objetivo, planta, e uma linha-fantasma de localização) acendem a verde, e o cartão "Pacote da missão" nasce a partir delas: sai do Cofre e desliza para a posição central-direita (nudge-curve). As linhas do pacote entram nos cues "terreno" (8.7) e "pretensão" (9.5). A pílula "finalidade: PIP · validade: definida" entra em 9.9s, e a seta verde para a Câmara desenha-se.
Scene 4 (10.0–13.2s): os cadeados terracota dão um pequeno "click" (scale 1.15 → 1) no cue "Nem" (10.7s). "Nem mais uma linha." (Fraunces 78) entra palavra a palavra até 11.4s e fica.

## Frame 10 — Pessoas decidem

- status: animated
- src: compositions/frames/10-pessoas-decidem.html
- sketch: storyboard.html#frame-10
- duration: 18.6s
- transition_in: match cut do pacote
- blueprint: compose
- rules: press-release-spring, viewport-change, waterfall-entry, spring-pop-entrance
- focal: o plano-síntese, com "Magia para a Inês." em cima e "Controlo para a Câmara." em baixo
- voiceover: "Quando é preciso juízo técnico, o caso chega a um técnico da Câmara, com fontes, dados mínimos e uma proposta. É ele quem decide. O controlo continua lá; só deixa de pesar sobre a Inês. Magia para a Inês. Controlo para a Câmara."
- vo_cues: técnico@1.54 caso@2.48 técnico@3.26 fontes@4.83 dados@5.53 proposta@6.9 decide@8.55 controlo@9.82 Inês@12.59 Magia@13.39 Controlo@? Câmara@15.78
- hold: deliberate stillness 16.8–18.6s

Duas fases. Na **fase A** (0–9.6s), a câmara está em close na consola: o `.world` em scale ~1.35, focado na consola e no técnico, com a faixa creme fora de quadro em cima. Na **fase B** (9.6–18.6s), a câmara recua (viewport-change) para o enquadramento do sketch: faixa creme 0–430 com a Inês no café, linha de superfície em y=430 e bastidores em baixo.

Scene 1 (0.0–2.6s): a consola entra (o pacote do frame anterior chega como um pequeno cartão creme que se funde no título da consola). O título "Caso PIP · Terreno em Ponte" aparece em 1.5s ("técnico").
Scene 2 (2.6–7.4s): a silhueta do técnico surge à direita em 3.2s ("técnico"). As linhas mono da consola entram nos cues: "motivo…" (2.5), "fontes PDM v.2026 ↗" (4.8), "dados localização · pretensão · planta" (5.5), "proposta viável fora da área condicionada" (6.9).
Scene 3 (7.4–9.6s): os botões "Aprovar", "Pedir elemento" e "Corrigir" entram e "Aprovar" leva um press-release-spring no cue "decide" (8.55s). A linha "registo decisão · técnico · data · fundamento" aparece logo a seguir (8.9s).
Scene 4 (9.6–13.2s): no cue "controlo" (9.8s), a câmara recua (scale 1.35 → 1, ease power2.inOut, ~1.8s) e revela a faixa creme com a Inês no café, tranquila, a olhar para o telemóvel (com a pequena luz verde no ecrã), e a linha de superfície verde entre os dois mundos.
Scene 5 (13.2–16.8s): "Magia para a Inês." (Fraunces, creme-escuro) entra em cima no cue "Magia" (13.39s) e "Controlo para a Câmara." (Fraunces 600, 80px, claro) entra em baixo no cue "Controlo". Ambas entram com waterfall de palavras, curto.
Scene 6 (16.8–18.6s): **momento parado**. Nada se mexe, o frame fica totalmente estático.

## Frame 11 — A resposta

- status: animated
- src: compositions/frames/11-resposta.html
- sketch: storyboard.html#frame-11
- duration: 9.8s
- transition_in: subida ↑; a linha dissolve-se
- blueprint: compose
- rules: svg-path-draw, spring-pop-entrance, press-release-spring
- focal: a notificação do Henriques e o interruptor "ativo"
- voiceover: "Dias depois, chega a resposta. E, se o PDM voltar a mudar, a Inês é a primeira a saber. Porque autorizou."
- vo_cues: depois@0.91 resposta@2.06 PDM@3.97 mudar@4.83 primeira@6.21 saber@6.67 autorizou@7.9

Fundo creme. A linha de superfície pontilhada (opacity 0.2) em y=760 vai-se dissolvendo, o chão aparece em y≈780 e a zona hachurada terracota fica à esquerda.

Scene 1 (0.0–2.4s): a linha de superfície (cheia, verde) desvanece até ficar pontilhada a 0.2 de opacidade. A zona "área condicionada" (hachurado terracota) e o rótulo aparecem. A casa completa desenha-se (svg-path-draw) fora da zona condicionada, com a porta verde a preencher-se no fim (~2.2s). É o callback da casa tracejada da cena 2.
Scene 2 (1.6–3.6s): o cartão de notificação desliza da direita com spring no cue "resposta" (2.06s): emblema do Henriques + "Henriques", "O técnico respondeu ao seu pedido: / a construção é viável fora da área / condicionada." e o link verde "Fundamentos e próximos passos ↗" (entra em 2.8s).
Scene 3 (3.6–9.8s): o cartão do interruptor "🔔 Avisar-me de alterações ao PDM / neste terreno" entra em 4.0s ("PDM"), com o interruptor desligado (cinza). No cue "autorizou" (7.9s) o interruptor liga: a bolinha desliza, a pista passa a verde (press-release-spring) e "ativo" aparece. O rodapé "conteúdo ilustrativo" fica a partir de 3.0s.

## Frame 12 — Visão: do município ao país

- status: animated
- src: compositions/frames/12-visao.html
- sketch: storyboard.html#frame-12
- duration: 13.8s
- transition_in: casa vira ponto no mapa
- blueprint: compose
- rules: multi-phase-camera, svg-path-draw, spring-pop-entrance, waterfall-entry
- focal: a rede verde sem centro a crescer sobre Portugal
- voiceover: "Começamos pela Câmara e pelas Freguesias. Depois, a região. Depois, o país. Uma rede federada, em que ninguém entrega ao Estado a mesma informação duas vezes."
- vo_cues: Câmara@1.25 Freguesias@2.21 Depois@3.56 região@4.41 Depois@5.66 país@6.55 rede@8.06 federada@8.29 ninguém@9.42 informação@11.12 vezes@12.1

Fundo azul-noite. O contorno de Portugal continental (polígono do sketch, refinado para um contorno mais credível, mas sem pormenor cartográfico) ocupa o centro, com os nós verdes e a rede de ligações vizinho a vizinho, sem centro.

Scene 1 (0.0–3.4s): multi-phase-camera em três degraus. Começa muito perto de Guimarães (scale ~3.2, centrada no nó de Guimarães): um ponto verde com anel, o rótulo "Guimarães" e 2–3 micro-nós à volta (as Freguesias) que fazem spring em "Freguesias" (2.2s). "Fase 1 · Câmara / e Freguesias" (verde) entra à esquerda em 1.25s.
Scene 2 (3.4–5.6s): degrau 2, no cue "região" (4.41s). Zoom out para scale ~1.8, a elipse tracejada da região desenha-se, mais 3 nós acendem e as ligações desenham-se. "Fase 2 · Região" entra.
Scene 3 (5.6–7.8s): degrau 3, no cue "país" (6.55s). Zoom out para scale 1.0, o mapa completo fica visível, os restantes nós acendem em cascata ao longo do país e as ligações vizinho a vizinho desenham-se. "Fase 3 · País" entra.
Scene 4 (7.8–13.8s): "Rede federada" (Fraunces 80) entra à direita no cue "rede" (8.06s). "dados mínimos · um só representante" entra em 9.4s e "sem base de dados única" em 11.1s. Os pulsos verdes viajam entre nós vizinhos (dash-flow finito), nunca para um centro.

## Frame 13 — O pedido

- status: animated
- src: compositions/frames/13-pedido.html
- sketch: storyboard.html#frame-13
- duration: 5.2s
- transition_in: foco volta a Guimarães
- blueprint: titlecard-reveal
- rules: svg-path-draw, spring-pop-entrance
- focal: "Piloto assistido em Guimarães"
- voiceover: "O próximo passo é um piloto assistido, aqui, em Guimarães."
- vo_cues: próximo@0.61 passo@0.99 piloto@1.5 assistido@1.9 aqui@2.72 Guimarães@3.53

Fundo azul-noite com o cartão creme ao centro.

Scene 1 (0.0–1.0s): o cartão creme cresce a partir de um ponto verde no centro (scale 0.06 → 1, com o ponto a dissolver-se). Um só movimento contido. "O PRÓXIMO PASSO" (mono, verde) aparece em 0.6s.
Scene 2 (1.0–2.4s): "Piloto assistido em Guimarães" (Fraunces 96) entra com slide-up crossfade em 1.4s ("piloto").
Scene 3 (2.4–5.2s): a linha temporal desenha-se da esquerda para a direita (svg-path-draw, 2.4–3.6s). Os 4 marcos verdes fazem spring em sequência (stagger 0.25s), cada um com o seu rótulo: "1 jornada", "mensagens / + portal", "integração / só de leitura" e "equipa municipal / a validar". Held até ao fim.

## Frame 14 — Fecho

- status: animated
- src: compositions/frames/14-fecho.html
- sketch: storyboard.html#frame-14
- duration: 12.2s
- transition_in: crossfade lento (callback da cena 1)
- blueprint: logo-assemble-lockup
- rules: waterfall-entry, spring-pop-entrance
- focal: o wordmark "Delegate" com a tagline
- voiceover: "Aqui nasceu Portugal. Aqui pode nascer um serviço público que trabalha por cada pessoa. Delegate. Diga o que precisa. O Henriques trata do resto."
- vo_cues: Aqui@0.75 Portugal@1.34 Aqui@2.17 nascer@2.71 serviço@3.15 pessoa@4.95 Delegate@5.88 Diga@6.95 precisa@7.4 Henriques@8.44 resto@9.29

Fundo creme. É o frame final, por isso a última fase pode ter um settle suave.

Scene 1 (0.0–2.0s): a muralha da cena 1 reaparece, com o mesmo bloco de pedra e "AQUI NASCEU PORTUGAL" grande, centrado na metade superior (como na cena 1, scale ~0.75).
Scene 2 (2.0–5.6s): no cue "Aqui" (2.17s), a muralha recua e encolhe até virar a linha pequena de topo "AQUI NASCEU PORTUGAL" (Fraunces 48, granito, tracking largo), na posição do sketch (y≈170). As pedras dissolvem-se.
Scene 3 (5.6–6.9s): o wordmark "Delegate" (Fraunces 600, 140px) monta-se letra a letra no cue "Delegate" (5.88s) e o ponto verde faz spring em 6.3s.
Scene 4 (6.9–9.6s): a tagline "Diga o que precisa." entra no cue "Diga" (6.95s) e "O Henriques trata do resto." no cue "Henriques" (8.44s), ambas em Fraunces 104, centradas (y 380/500, acima do logo, como no sketch).
Scene 5 (9.6–12.2s): "HACK4GUIMARÃES" (sans, muted, tracking largo) entra em 9.6s. Settle final, com uma respiração muito leve até ao fim e sem fade-out (a música resolve por cima).
