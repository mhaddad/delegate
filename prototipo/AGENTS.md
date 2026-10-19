# AGENTS.md — o protótipo

O código do R0. Parte de [`../AGENTS.md`](../AGENTS.md) e de [o plano do protótipo](../specs/strategy/11-plano-do-prototipo.md).

---

## O que é

Monorepositório com três faces: o **Telegram** por onde o Afonso fala com as pessoas, a **Consola Municipal** do lado da Câmara, e o **Observatório**, que é a demonstração visual da infraestrutura a funcionar.

## Stack

Decidida a 18/10/2026 depois de pesquisa. Registada em [ADR-008](../specs/21-registo-de-decisoes.md#adr-008) e nos [ADR-020 a 023](../specs/21-registo-de-decisoes.md).

| Peça | Escolha | Versão |
|---|---|---|
| Linguagem | TypeScript, uma só | 5.7+ |
| Gestor de pacotes | workspaces do npm | já instalado |
| Porta Agêntica | `@modelcontextprotocol/server` + `/client` | 2.3.x |
| Canal | `grammY`, *long polling* | 1.46.x |
| Base de dados | PostgreSQL embutido (`embedded-postgres`) + `pg` | 18 / 8.23 |
| Interface | Vite + React, `@xyflow/react`, `motion` | 8.3 / 19 / 12.12 / 14.3 |
| Esquemas | Zod | 4.x |
| Testes | Vitest | 2.x |
| Modelo de IA | **por decidir** — [ADR-023](../specs/21-registo-de-decisoes.md#adr-023) | — |

### As quatro armadilhas

Cada uma custou tempo real a alguém, e nenhuma aparece num tutorial.

**1. O pacote de MCP com o nome conhecido está congelado.**
`@modelcontextprotocol/sdk` é a linha **v1**, que só recebe correcções até ao início de 2027. A linha estável desde julho é o `@modelcontextprotocol/server`. **Quase todo o exemplo na internet é v1 e não corre.** Instala-se o v2 e escreve-se o servidor com `createMcpHandler`, não com `StreamableHTTPServerTransport`. E a protecção contra *DNS rebinding* monta-se à mão: sem ela, qualquer página aberta no portátil fala com a Porta como se fosse da mesma origem.

**2. O modelo mais barato é o mais lento.**
O Haiku 5.5 demora 8,75 s até ao primeiro token; o Sonnet 5.5 em esforço `low`, 0,96 s. Com p95 ≤ 8 s, o Haiku consome o orçamento sozinho. E o esforço põe-se a `low` **explicitamente** — o omisso do Sonnet é `high`, que triplica a latência.

**3. `npm i reactflow` dá a versão errada.**
O pacote chama-se `@xyflow/react`. O nome antigo instala a v11, congelada, e o npm não marca nenhuma descontinuação. Escreve-se o nome completo à mão.

**4. O fluxo de eventos morre em silêncio.**
Se o estado HTTP não for 200, ou o tipo não for `text/event-stream`, o `EventSource` do browser dá a conexão por perdida e **não volta a tentar** — o ecrã fica congelado sem qualquer erro visível. Precisa de um `id:` monotónico e `retry:` em cada evento, um buffer de replay no servidor, e um watchdog próprio que reconstrói a ligação se passarem três segundos sem evento. Mais um indicador visível de «último evento há Xs» no ecrã, para se ver antes da audiência.

## Comandos

O protótipo tem de arrancar com um comando só, sem passos manuais.

| Acção | O que tem de fazer |
|---|---|
| Arrancar a demonstração | Sobe PostgreSQL, os dois processos e a web, prontos a abrir |
| Correr os testes | Inclui a verificação da cadeia de selos |
| Validar o registo | Falha se uma ficha não passar no esquema ou tiver valor sem fonte |
| Correr a avaliação | Grava o relatório com métricas e latências |

## Duas regras que não se negociam

**Tudo local.** O protótipo corre no portátil de quem apresenta. Não há alojamento, nem base de dados na cloud, nem dependência de rede para além do Telegram. O plano B de rede passou a ser o plano A.

**A fronteira é o produto.** O núcleo chama a Porta pela rede como cliente MCP, nunca em memória. Se alguém encurtar esse caminho por conveniência, mata a coisa que o júri está a avaliar: a Porta é a porta, e o Afonso é o primeiro cliente, não o dono.

## Regras do repositório

- **Tipagem estrita**, sem escapes silenciosos. Os tipos partilham-se pelo pacote `packages/`, nunca por caminho relativo entre apps.
- **Sem dependências sem motivo escrito.** Cada uma entra com uma frase a dizer o que resolve; a lista vive no README.
- **Português pt-PT** em mensagens, comentários, legendas e interface.
- **Cada passo emite eventos.** Nada acontece sem que o Observatório possa mostrá-lo. Os tipos vivem em `packages/eventos`.
- **Simulado diz-se simulado.** Sistemas da Câmara, chaves móveis e taxas de demonstração levam etiqueta «Simulação» no ecrã e nos eventos.
- **Nada de valores mágicos partilhados.** Estados de processo, níveis de mandato e tipos de evento são definições partilhadas, não cadeias de caracteres repetidas.

## Rituais

| Hora | O quê |
|---|---|
| 09h45 | Alinhamento de 15 minutos: cada pessoa diz o que faz e de que depende |
| **12h30** | **Fio completo** — uma mensagem de teste atravessa o sistema e todos veem no Observatório |
| **17h00** | **Fio completo e demo interna** do que entrou no dia |

Nada se integra depois das 17h00 sem passar no fio completo.

## Definição de pronto

Uma funcionalidade está pronta quando:

- [ ] cumpre os critérios de aceitação da história;
- [ ] emite os eventos do contrato e aparece no Observatório;
- [ ] corre com um comando, sem passos manuais;
- [ ] passa no fio completo das 17h00;
- [ ] não provoca regressos na avaliação;
- [ ] mostra «Simulação» onde se aplica.

## Onde está cada coisa

| Pasta | Dono | O que lá mora |
|---|---|---|
| `packages/eventos/` | B | envelope, esquema, catálogo, legendas |
| `packages/dominio/` | A | missão, mandato, item do Cofre, serviço |
| `apps/api/src/nucleo/` | A | bot, Afonso, orquestrador, política, Cofre, mandatos, eventos |
| `apps/api/src/porta/` | B | Porta Agêntica, Registo Canónico, adaptadores |
| `apps/api/src/su/` | B | Serviços Urbanos (simulado) |
| `apps/api/src/tesouraria/` | B | Tesouraria (simulado) |
| `apps/web/` | C | Observatório e Consola |
| `registo/` | C, revisto por A e B | uma ficha por serviço |
| `avaliacao/` | C | o conjunto de perguntas, o executor, os resultados |
| `demo/` | B | dados semente |