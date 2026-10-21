# Delegate — Especificações

> **Estado:** versão de trabalho 0.1 · **Última atualização:** 18/10/2026 · **Dono do documento:** [nome]
> **Contexto:** projeto a apresentar no **Hack4Guimarães 2035**, desafio **3.4 «Falar com a Câmara sem Burocracia»** (proposta, a confirmar pela equipa).

O Delegate dá a cada pessoa e a cada negócio de Guimarães um **Representante Digital Pessoal** (em Guimarães, o **Henriques**) que trata da burocracia municipal em seu nome, com mandato, fontes oficiais e decisão humana onde ela é devida. Dá também à Câmara uma **Porta Agêntica** aberta e governada, uma **Consola** para os técnicos e um **Mapa de Intenções** da cidade.

Esta pasta é a fonte de verdade do projeto. Os vídeos, o deck e o blueprint HTML derivam daqui.

---

## Índice

### Parte A — Enquadramento

| # | Documento | Conteúdo | Leitura essencial para |
|---|---|---|---|
| 00 | [Sumário executivo](00-sumario-executivo.md) | O projeto numa página | Todos, mentoria |
| 01 | [Contexto e problema](01-contexto-e-problema.md) | Problema, evidência em Guimarães, o que já existe, porquê agora | Todos |
| 02 | [Hackathon](02-hackathon.md) | Desafio, critérios de avaliação e como os respondemos, calendário, regras | Todos |
| 03 | [Visão e estratégia](03-visao-e-estrategia.md) | Visão, proposta de valor, posicionamento, princípios, Carta de Lealdade, objetivos | Produto, pitch |

### Parte B — Produto

| # | Documento | Conteúdo | Leitura essencial para |
|---|---|---|---|
| 04 | [Utilizadores e personas](04-utilizadores-e-personas.md) | Personas, tarefas a resolver, mapa de stakeholders | Produto, design |
| 05 | [Jornadas](05-jornadas.md) | Jornadas atuais e futuras, caso âncora | Produto, design, conteúdo |
| 06 | [Âmbito e releases](06-ambito-e-releases.md) | O que entra em cada release, MoSCoW do protótipo, fora de âmbito | Todos |
| 07 | [Requisitos funcionais](07-requisitos-funcionais.md) | Requisitos por módulo, com ID, prioridade e release | Desenvolvimento |
| 08 | [Histórias de utilizador](08-historias-de-utilizador.md) | Épicos, histórias e critérios de aceitação | Desenvolvimento, QA |
| 09 | [Requisitos não funcionais](09-requisitos-nao-funcionais.md) | Qualidade, desempenho, acessibilidade, segurança | Desenvolvimento |
| 15 | [UX, conteúdo e tom de voz](15-ux-conteudo-e-tom.md) | Princípios de experiência, formato das respostas, voz do Henriques | Design, conteúdo |

### Parte C — Solução técnica

| # | Documento | Conteúdo | Leitura essencial para |
|---|---|---|---|
| 10 | [Arquitetura](10-arquitetura.md) | Componentes, fluxos, stack do protótipo e arquitetura-alvo | Desenvolvimento |
| 11 | [Modelo de dados](11-modelo-de-dados.md) | Entidades e esquemas: serviço, missão, mandato, cofre, auditoria | Desenvolvimento |
| 12 | [IA e avaliação](12-ia-e-avaliacao.md) | Agentes, recuperação de fontes, salvaguardas, plano de avaliação | Desenvolvimento, conteúdo |
| 13 | [Porta Agêntica (API e MCP)](13-porta-agentica-api.md) | Contrato da interface para agentes | Desenvolvimento |
| 14 | [Governação, privacidade e segurança](14-governacao-privacidade-seguranca.md) | RGPD, Regulamento de IA, CPA, segurança, inclusão | Todos |

### Parte D — Negócio

| # | Documento | Conteúdo | Leitura essencial para |
|---|---|---|---|
| 16 | [Modelo de negócio](16-modelo-de-negocio.md) | Canvas, fontes de receita, preços, contratos, simulação | Negócio, pitch |
| 17 | [Entrada no mercado e roadmap](17-go-to-market-e-roadmap.md) | Contratação pública, fases, parceiros, financiamento | Negócio, pitch |
| 18 | [Métricas e OKR](18-metricas-e-okr.md) | Métrica norte, KPI, contra-métricas, metas do protótipo e do piloto | Todos |

### Parte E — Execução e controlo

| # | Documento | Conteúdo | Leitura essencial para |
|---|---|---|---|
| 19 | [Plano do hackathon](19-plano-do-hackathon.md) | Plano dia a dia, papéis, definição de pronto, submissão, pitch | Todos |
| 20 | [Riscos e pressupostos](20-riscos-e-pressupostos.md) | Registo de riscos, pressupostos a validar, dependências | Todos |
| 21 | [Registo de decisões](21-registo-de-decisoes.md) | Decisões de arquitetura e produto (ADR) | Todos |
| 22 | [Glossário](22-glossario.md) | Termos oficiais do projeto | Todos |
| 23 | [Referências](23-referencias.md) | Fontes e referências internacionais | Todos |

### Parte F — Após a mentoria (19/10/2026)

| # | Documento | Conteúdo | Leitura essencial para |
|---|---|---|---|
| 24 | [Processos canónicos e integração invertida](24-processos-canonicos-e-integracao.md) | Contratos de capacidades que a Câmara implementa; níveis de integração I0–I3 | Desenvolvimento, negócio |
| 25 | [Base de conhecimento](25-base-de-conhecimento.md) | Site, regulamentos e leis para respostas D0 | Conteúdo, desenvolvimento |
| 26 | [Modelo de impacto e custos](26-modelo-de-impacto-e-custos.md) | Custo atual × custo com o Delegate; calculadora; plano de medição | Negócio, pitch |

### Estratégia de implementação

| Pasta | Conteúdo |
|---|---|
| [strategy/](strategy/README.md) | Estratégia do protótipo para a semana do hackathon: Telegram, Observatório, Porta, Consola, sistemas simulados, contrato de eventos, plano de execução e roteiro da demo. **Proposta para discussão da equipa.** |

### Anexos

| Anexo | Conteúdo |
|---|---|
| [A — Catálogo de serviços do protótipo](anexos/A-catalogo-servicos-prototipo.md) | Serviços candidatos ao Registo Canónico, com evidência de procura e prioridade |
| [B — Conjunto de avaliação](anexos/B-conjunto-de-avaliacao.md) | Perguntas de teste com o comportamento esperado |
| [C — Guião da demonstração](anexos/C-guiao-da-demonstracao.md) | Guião passo a passo da demo do pitch |

---

## Como ler

- **Primeira leitura (20 minutos):** 00, 02, 06 e 19.
- **Quem desenvolve:** 06, 07, 08, 09, 10, 11, 12, 13.
- **Quem trata de conteúdo e dados:** 05, 12, 15, anexos A e B.
- **Quem trata de negócio e pitch:** 00, 02, 03, 16, 17, 18, anexo C.

## Convenções

| Prefixo | Significado | Exemplo |
|---|---|---|
| `RF-` | Requisito funcional | `RF-RES-03` |
| `RNF-` | Requisito não funcional | `RNF-SEG-02` |
| `EP-` / `HU-` | Épico / história de utilizador | `HU-05` |
| `J` | Jornada | `J1` |
| `P` | Persona | `P1` |
| `MET-` | Métrica | `MET-04` |
| `R-` | Risco | `R-07` |
| `PR-` | Pressuposto | `PR-03` |
| `ADR-` | Decisão registada | `ADR-001` |

**Releases:** `R0` protótipo do hackathon · `R1` piloto em Guimarães · `R2` escala municipal · `R3` rede intermunicipal e agentes certificados · `R4` federação.

**Prioridade (MoSCoW, para R0):** `M` obrigatório · `S` deveria ter · `C` poderia ter · `W` não terá agora.

**Marcação de factos:**
- ✅ **verificado:** com fonte e data.
- ⚠️ **a confirmar:** plausível, sem confirmação oficial.
- 🧪 **hipótese:** proposta da equipa, a testar.
- 🎭 **ilustrativo:** personagens, números e casos de demonstração.

**Linguagem:** português de Portugal. Termos do [glossário](22-glossario.md) são obrigatórios em todos os materiais.

## Fontes desta especificação

| Fonte | Localização | Uso |
|---|---|---|
| Blueprint da solução | [`reference-docs/delegate-blueprint.html`](../reference-docs/delegate-blueprint.html) | Conceitos, modelo de negócio, referências internacionais |
| Dossiê da Câmara | [`reference-docs/Camara_Municipal_de_Guimaraes_Servicos_e_Indicadores_2025.md`](../reference-docs/Camara_Municipal_de_Guimaraes_Servicos_e_Indicadores_2025.md) | Serviços, canais e indicadores de atividade de 2025 |
| Hackathon | [`reference-docs/hack4guimaraes-2035.md`](../reference-docs/hack4guimaraes-2035.md) | Desafios, critérios, calendário e regras |
| Roteiros dos vídeos | [`videos/`](../videos/) | Narrativa da Inês, factos verificados sobre a esplanada e o PDM |

## Decisões em aberto

As decisões ainda por fechar estão no [registo de decisões](21-registo-de-decisoes.md) com o estado **Proposta**. As mais urgentes, antes de 19/10 às 09h30:

1. Confirmar o desafio 3.4 ([ADR-001](21-registo-de-decisoes.md#adr-001)).
2. Confirmar com a organização se materiais de conceito anteriores (vídeos, blueprint) podem ser usados ([R-01](20-riscos-e-pressupostos.md)).
3. Atribuir papéis na equipa ([plano do hackathon](19-plano-do-hackathon.md#papeis)).

## Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 18/10/2026 | Primeira versão consolidada a partir do blueprint, do dossiê da Câmara e das regras do hackathon |
| 0.2 | 19/10/2026 | Recomendações da mentoria: integração invertida (24), base de conhecimento (25), modelo de impacto (26); ADR-020 a ADR-022 |
