# AGENTS.md — Delegate · Hack4Guimarães 2035

Contrato técnico do projeto. Máquina primeiro, pessoas depois.
Desafio 3.4: *Falar com a Câmara sem burocracia* (Tecnologias Inteligentes).
Mentoria: Filipe Novais (DTx), CCG/ZGDV.

---

## 1. Base documental (fonte de verdade)

A base do projeto é a documentação em `specs/`. Este ficheiro orienta; manda quem sabe.

| Camada | Onde | Governa |
|---|---|---|
| **Especificações** | `specs/00`–`specs/26` + `specs/anexos/A–C` ([índice](specs/README.md)) | Produto: visão, requisitos, modelo de dados, avaliação, processos canónicos e inversão de integração (24), base de conhecimento RAG D0 (25), impacto e custos (26) |
| **Estratégia R0** | `specs/strategy/` ([README](specs/strategy/README.md) + 01–11) | Construção do protótipo: arquitetura da demo, Telegram, Observatório, Porta, Consola, contrato de eventos, TypeSafe Jev System One, plano e ajustes pós-mentoria (11) |

**Precedência:** onde divergirem, para o R0 vence a estratégia — é a revisão consolidada com a mentoria (Filipe Novais / DTx e CCG):
1. **Inversão da responsabilidade de integração:** O Delegate detém a orquestração e os processos canónicos; a autarquia implementa contratos de API padronizados (Porta Agêntica MCP + REST).
2. **Base de Conhecimento e RAG D0:** Ingestão do portal e regulamentos municipais (`data/conhecimento/`), com roteamento, re-ranking e verificação de citações via **TypeSafe Jev** (`typesafe/jev-router` no OpenRouter, [ADR-024](specs/21-registo-de-decisoes.md#adr-024)).
3. O Telegram é o canal principal do cidadão e a fronteira entre núcleo e porta é auditada via barramento de eventos SSE.

**Plano de construção do protótipo:** [strategy/11 · Ajustes pós-mentoria](specs/strategy/11-ajustes-pos-mentoria.md) e [strategy/08 · Plano de execução](specs/strategy/08-plano-de-execucao.md).

**Calendário:** R0 constrói-se de 19 a 23/10/2026 · submissão interna 23/10 às 15h00 (bloqueio na TAIKAI às 17h30) · pitch presencial 26/10 às 14h30 · vencedores 28/10 às 16h00.

---

## 2. Hierarquia de AGENTS.md

O contrato é hierárquico: cada pasta tem as suas regras, que **partem deste ficheiro e o substituem quando são mais específicas**. Ao trabalhar numa pasta, lê o `AGENTS.md` dela; para saber quem manda, começa pelo topo.

```
AGENTS.md                              este ficheiro — base documental e regras que não mudam
├── specs/AGENTS.md                     convenções de edição das especificações
├── legacy/                            código e dados de fases anteriores arquivados
└── prototipo/AGENTS.md                o protótipo R0: comandos, as três pessoas, definição de pronto
    ├── packages/eventos/AGENTS.md     o contrato de eventos — a espinha dorsal
    ├── apps/api/AGENTS.md             API: dois processos, portas independentes, base por serviço
    │   ├── src/nucleo/AGENTS.md        Pessoa A · Henriques, bot, Cofre, mandatos, TypeSafe Jev e RAG D0
    │   └── src/porta/AGENTS.md         Pessoa B · Porta Agêntica (MCP), contratos municipais e sistemas simulados
    ├── apps/web/AGENTS.md              Pessoa C · Observatório e Consola
    ├── registo/AGENTS.md               curadoria das fontes canónicas municipais
    └── avaliacao/AGENTS.md             conjunto de avaliação oficial (42 perguntas, 100% calibrado)
```

| Pessoa | Território | Entrega que responde |
|---|---|---|
| **A · Henriques** | `apps/api/src/nucleo/` | Henriques, Telegram, Cofre Digital (AES-256-GCM), mandatos D0-D4, TypeSafe Jev System One e Base de Conhecimento RAG D0 |
| **B · Infra** | `packages/eventos/`, `apps/api/src/porta/` | Contratos de API da Porta (MCP + REST), eventos selados, sistemas simulados |
| **C · Ecrãs e conteúdo** | `apps/web/`, `registo/`, `avaliacao/` | Observatório, Consola Municipal, Registo Canónico e conjunto de avaliação |

---

## 3. O produto numa frase

**«Diga o que precisa. O Henriques trata do resto.»** Cada pessoa e negócio tem um representante digital leal (o Henriques) que responde com a fonte oficial à vista e trata da Câmara por si, com mandato verificável; a Câmara recebe casos preparados e vê, agregado, o que a cidade quer fazer.

O «bom resultado» do desafio: *pergunta real → resposta correta, em linguagem simples, com a fonte à vista*. Sem fonte válida, o Henriques **abstém-se** — nunca inventa.

---

## 4. Arquitetura em uma página

**Dois processos** — o runtime é o mesmo, a fronteira é o que se vê no Observatório:

| Processo | Serve |
|---|---|
| **núcleo** | o canal (Telegram), o Henriques, o Cofre, os mandatos, e o fluxo de eventos |
| **porta** | a Porta Agêntica, o Registo Canónico, os Serviços Urbanos, a Tesouraria |

O núcleo chama a Porta **pela rede como cliente MCP**, nunca em memória: é o critério de inovação (o Henriques é o primeiro cliente da Porta, não o dono) e o Observatório mostra-o como um salto real.

A stack está consolidada em TypeScript (Node 22+): núcleo na porta `4000` (Fastify + grammY + TypeSafe Jev System One + RAG D0) e Porta Agêntica na porta `4001` (`@modelcontextprotocol/server` v2).

Detalhe em [strategy/02](specs/strategy/02-arquitetura-da-demo.md) e [strategy/11](specs/strategy/11-ajustes-pos-mentoria.md).

### Regras de ouro

1. **O critério do desafio vem primeiro:** pergunta real, resposta correta e simples, fonte à vista. Prova-se com o Registo Canónico e o conjunto de avaliação (42 perguntas; metas em [specs/18](specs/18-metricas-e-okr.md)).
2. **Evidência obrigatória em todo o número:** fonte, versão e data de consulta. Sem fonte única e válida → abstenção formal.
3. **Nada é encenado sem o dizer:** o que é simulado (sistemas da Câmara, CMD, taxas) leva etiqueta «Simulação».

---

## 5. Estrutura do repositório

```
specs/             # Especificações (00–23, anexos/) + strategy/ — a base do projeto
reference-docs/    # hack4guimaraes-2035.md (regras do evento) + HACKATHON.md (manual
                   #   operacional, catálogo de serviços e onde se ganham os pontos)
videos/            # Projectos de vídeo do pitch (ferramentas próprias, fora do protótipo)
prototipo/         # O protótipo R0 — o código, o registo e a avaliação
  data/              # Corpus municipal — a chave de verificação da curadoria
    procedures.json    # 98 blocos em 28 áreas (imutável)
    gold_set.json      # 30 perguntas reais anotadas à mão
    fees/              # RTTL 2025: PDF+txt e cache estruturada (rttl_cache.json)
```

`data/` fica: a curadoria do Registo Canónico verifica o que curou contra estes ficheiros, e sem eles perde-se a forma de confirmar que um valor não foi inventado.

---

## 6. Código da fase anterior

O protótipo Python (`src/guim/`), as explorações em JavaScript (`legacy/`) e o scraper do corpus (`scripts/`) foram removidos a 18/10/2026, para que a stack do protótipo novo seja decidida sem código a puxar para o lado. **Continuam no histórico do git**, se alguma coisa for preciso recuperar.

O que de útil tinham está já escrito noutro sítio: o algoritmo do motor de decisão com salvaguardas e contingência calibrada está descrito em [ajustes pós-mentoria](specs/strategy/11-ajustes-pos-mentoria.md), e os dados que produziram estão em `data/`.

---

## 7. Limites (Boundaries)

- **Sempre:** evidência com fonte, versão e data em todo o número; abstenção sem fonte; pt-PT em mensagens e código; eventos do contrato em cada passo; etiqueta «Simulação» no simulado.
- **Perguntar:** dependências externas não planeadas; alterar dados brutos em `data/`; tornar o repositório público (critério de saída do R0 — decisão do utilizador); alterar decisões dos documentos sem ADR novo.
- **Nunca:** inventar custos, prazos ou requisitos legais; apresentar simulado como real; re-submeter PDFs a parsing sem consultar `data/fees/rttl_cache.json`; force push.

---

## 8. Como Trabalhar (Working Principles)

**Pensa antes de codar.** Enuncia a interpretação escolhida; se há uma via mais simples, propõe-a antes de implementar. Se algo não estiver claro, pára e pergunta.

**Simplicidade primeiro.** O mínimo que resolve o problema. Sem abstrações especulativas nem flexibilidade não solicitada.

**Mudanças cirúrgicas.** Toca apenas no que é necessário. Código morto alheio: menciona, nunca apagues sem autorização.

**Execução orientada a objetivos.** Cada passo validado pelo comando correspondente que prova o seu funcionamento.