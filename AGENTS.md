# AGENTS.md — Delegate · Hack4Guimarães 2035

Contrato técnico do projeto. Máquina primeiro, pessoas depois.
Desafio 3.4: *Falar com a Câmara sem burocracia* (Tecnologias Inteligentes).
Mentoria: Filipe Novais (DTx), CCG/ZGDV.

---

## 1. Base documental (fonte de verdade)

A base do projeto é a documentação em `specs/`. Este ficheiro orienta; manda quem sabe.

| Camada | Onde | Governa |
|---|---|---|
| **Especificações** | `specs/00`–`specs/23` + `specs/anexos/A–C` ([índice](specs/README.md)) | Produto: visão, requisitos, modelo de dados, avaliação, negócio |
| **Estratégia R0** | `specs/strategy/` ([README](specs/strategy/README.md) + 01–11) | Construção do protótipo: arquitetura da demo, Telegram, Observatório, Porta, Consola, contrato de eventos, plano e roteiro |

**Precedência:** onde divergirem, para o R0 vence a estratégia — é a revisão de 18/10: o Telegram substitui o chat web (ADR-013) e entram o Observatório e os sistemas simulados (ADR-014 a 019). As alterações a propagar nas especificações estão listadas em [strategy/10 · §3](specs/strategy/10-riscos-decisoes-e-impacto.md). Para tudo o resto, valem as especificações.

**Plano de construção do protótipo:** [strategy/11 · Plano do protótipo](specs/strategy/11-plano-do-prototipo.md) — é o documento contra o qual as três pessoas trabalham.

**Calendário:** R0 constrói-se de 19 a 23/10/2026 · submissão interna 23/10 às 15h00 (bloqueio na TAIKAI às 17h30) · pitch presencial 26/10 às 14h30 · vencedores 28/10 às 16h00.

---

## 2. Hierarquia de AGENTS.md

O contrato é hierárquico: cada pasta tem as suas regras, que **partem deste ficheiro e o substituem quando são mais específicas**. Ao trabalhar numa pasta, lê o `AGENTS.md` dela; para saber quem manda, começa pelo topo.

```
AGENTS.md                              este ficheiro — base documental e regras que não mudam
├── specs/AGENTS.md                     convenções de edição das especificações
└── prototipo/AGENTS.md                o protótipo R0: comandos, as três pessoas, definição de pronto
    ├── packages/eventos/AGENTS.md     o contrato de eventos — a espinha dorsal
    ├── apps/api/AGENTS.md             API: dois processos, três portas, uma base por serviço
    │   ├── src/nucleo/AGENTS.md        Pessoa A · Afonso, bot, Cofre, mandatos
    │   └── src/porta/AGENTS.md         Pessoa B · Porta Agêntica e sistemas simulados
    ├── apps/web/AGENTS.md              Pessoa C · Observatório e Consola
    ├── registo/AGENTS.md               curadoria das fontes — o ficheiro mais fussa do projeto
    └── avaliacao/AGENTS.md             conjunto de avaliação e métricas
```

| Pessoa | Território | Entrega que responde |
|---|---|---|
| **A · Afonso** | `apps/api/src/nucleo/` | Responder com fonte e a abstração que a prova; Cofre e mandatos |
| **B · Infra** | `packages/eventos/`, `apps/api/src/porta/` | Eventos, Porta, sistemas simulados — a fronteira que o Observatório mostra |
| **C · Ecrãs e conteúdo** | `apps/web/`, `registo/`, `avaliacao/` | O que se vê no palco e a prova de qualidade |

---

## 3. O produto numa frase

**«Diga o que precisa. O Afonso trata do resto.»** Cada pessoa e negócio tem um representante digital leal (o Afonso) que responde com a fonte oficial à vista e trata da Câmara por si, com mandato verificável; a Câmara recebe casos preparados e vê, agregado, o que a cidade quer fazer.

O «bom resultado» do desafio: *pergunta real → resposta correta, em linguagem simples, com a fonte à vista*. Sem fonte válida, o Afonso **abstém-se** — nunca inventa.

---

## 4. Arquitetura em uma página

**Dois processos** — o runtime é o mesmo, a fronteira é o que se vê no Observatório:

| Processo | Serve |
|---|---|
| **núcleo** | o canal (Telegram), o Afonso, o Cofre, os mandatos, e o fluxo de eventos |
| **porta** | a Porta Agêntica, o Registo Canónico, os Serviços Urbanos, a Tesouraria |

O núcleo chama a Porta **pela rede como cliente MCP**, nunca em memória: é o critério de inovação (o Afonso é o primeiro cliente da Porta, não o dono) e o Observatório mostra-o como um salto real.

As portas, a linguagem e as bibliotecas **estão por decidir** — ver [plano do protótipo §1](specs/strategy/11-plano-do-prototipo.md).

Detalhe em [strategy/02](specs/strategy/02-arquitetura-da-demo.md) e [strategy/11](specs/strategy/11-plano-do-prototipo.md).

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

O que de útil tinham está já escrito noutro sítio: o algoritmo do roteador determinístico está descrito em [plano do protótipo §5](specs/strategy/11-plano-do-prototipo.md), e os dados que produziram estão em `data/`.

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