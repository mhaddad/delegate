# AGENTS.md — Observatório e Consola

**Dona: pessoa C (Ecrãs e conteúdo).** As duas faces que o júri vê. Parte de [`../../AGENTS.md`](../../AGENTS.md).

> **Stack:** Vite + React, `@xyflow/react` para o grafo, `motion` para as animações — que traz `reducedMotion="user"` de fábrica, ao contrário das alternativas. Ver a [secção Stack](../../AGENTS.md#stack). A composição dos ecrãs e as regras de honestidade, abaixo, são anteriores à stack.

---

## O Observatório

Ecrã projetado durante toda a demonstração. A linha de superfície, de cima para baixo:

- **Palco** — a conversa, a replicar-se, com o cartão de fonte a descer quando a resposta é verificada.
- **Grafo da arquitetura** — nós e impulsos. Um impulso por evento. Latência por nó.
- **Painéis à direita** — Missão e Cofre.
- **Fluxo de eventos** — a linha temporal, sempre a correr.

## A regra de ouro

> **Só se desenha o que aconteceu.** Cada animação está mapeada a um evento. Se o evento não existiu, nada acende.

Isto vale para tudo: nós, impulsos, contadores, legendas, cronómetros. Não há animação encenada. Se um dia for preciso repetir uma sessão, a repetição é anunciada como repetição — nunca se apresenta como ao vivo.

## Congelado

**Legibilidade a seis metros.** O layout e os tamanhos estão em [04 · Observatório §2](../../../specs/strategy/04-observatorio.md); são requisito de sala, não preferência.

**Modo narrativo por omissão.** Legendas grandes, só eventos relevantes, ritmo humano com o mínimo de 700 ms por evento em destaque. Botões de pausa e de velocidade.

**Ritmo sem perder a verdade.** Os eventos chegam por fluxo e entram numa fila de apresentação. A pausa congela a apresentação, não a receção. O indicador diz «ao vivo» ou «N eventos em fila» — nunca mostra como vivo o que está em fila.

**Etiqueta «Simulação»** em tudo o que vem de sistemas simulados, sem excepção.

**Legendas em português, vindas do catálogo.** O texto vive em `packages/eventos`. A web não escreve legendas novas.

## A Consola

A demonstradora nunca é projetada — abre num segundo ecrã. Três ecrãs: fila de casos, detalhe e decisão. A decisão regista identidade funcional, momento e fundamento.

**A Consola nunca vê o Cofre.** Vê casos, pacotes mínimos e estados. Dizer isto no pitch é parte do argumento.

## Privacidade nas duas

- **Só eventos reais, sempre.** A web não inventa dados de demonstração para preencher ecrãs. O que não aconteceu, não se vê.
- **A Consola não pede conteúdo do Cofre** em nenhuma chamada, nem depois de o caso estar submetido.
- Resumos gerados por IA aparecem **marcados como tal**. Sugestões aparecem marcadas como sugestões.

## Livre

- Layout, tipografia e cor, dentro da legibilidade.
- A ordem das animações dentro de um mesmo evento.
- Reutilizar componentes entre as duas aplicações — e deve-se, é o que alivia a carga.

## Respeitar preferências do sistema

Com a preferência de reduzir movimento ligada, sem movimento: só mudanças de cor e de texto.

## Como se prova que está feito

- Uma mensagem no canal aparece no Palco em menos de um segundo.
- Cada evento chega uma vez e acende o nó certo; nenhum nó acende sem evento.
- Uma decisão na Consola produz um impulso até ao canal, com o valor etiquetado.
- Do ponto de vista de quem está na sala, a seis metros do ecrã, lê-se tudo.