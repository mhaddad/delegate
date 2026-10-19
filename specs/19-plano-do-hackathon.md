# 19 · Plano do hackathon

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Objetivo

Submeter até **23/10 às 15h00** (prazo oficial 17h30) um protótipo funcional que cumpra os critérios de saída de [06](06-ambito-e-releases.md#criterios-de-saida), e apresentar o pitch a **26/10 às 14h30**.

## 2. Regras de ouro

1. **Nada de código nem de curadoria de dados antes de 19/10 às 09h30.** O repositório é criado no arranque ([R-01](20-riscos-e-pressupostos.md)).
2. **O desafio responde-se primeiro.** HU-01 e o conjunto de avaliação vêm antes de qualquer funcionalidade «uau».
3. **Tudo o que é simulado diz «Simulação».**
4. **Congelamento de funcionalidades a 22/10 às 18h00.** Depois disso só correções, conteúdo e demo.
5. **Cortar cedo.** Ordem de corte em [08](08-historias-de-utilizador.md#resumo-de-esforco).

<a id="papeis"></a>
## 3. Papéis

Equipa de 1 a 5 elementos. Com menos pessoas, acumular papéis pela ordem da tabela.

| Papel | Responsabilidades | Pessoa |
|---|---|---|
| **Produto e pitch** | Prioridades, ligação ao mentor e à organização, pitch, submissão TAIKAI | [nome] |
| **IA e backend** | Conversa, recuperação, verificador, motor de política, missões | [nome] |
| **Interface e UX** | Vistas Munícipe, Consola e Gestão; identidade visual; acessibilidade | [nome] |
| **Conteúdo e avaliação** | Registo Canónico (anexo A), conjunto de avaliação (anexo B), revisão de linguagem | [nome] |
| **Porta e infraestrutura** | Servidor MCP/REST, auditoria, alojamento, vídeo de plano B | [nome] |

### RACI

| Entregável | Produto | IA/backend | Interface | Conteúdo | Porta/infra |
|---|---|---|---|---|---|
| Registo Canónico | C | C | I | **R/A** | I |
| Afonso com fonte (HU-01..05) | A | **R** | C | C | I |
| Missão, Cofre, Mandato (HU-06..10) | A | **R** | **R** | I | I |
| Conjunto e painel de avaliação | A | R | R | **R** | I |
| Consola (HU-12) | A | C | **R** | I | I |
| Porta MCP (HU-13) | A | C | I | I | **R** |
| Alojamento e plano B | I | C | I | I | **R/A** |
| Submissão TAIKAI | **R/A** | C | C | C | C |
| Pitch e demo | **R/A** | C | C | C | R |

R = executa · A = aprova · C = consultado · I = informado

## 4. Antes do arranque (até 19/10, 09h30)

- [ ] Todos inscritos na TAIKAI e na mesma equipa.
- [ ] Ler 00, 02, 06 e este documento.
- [ ] Escolher a stack ([ADR-008](21-registo-de-decisoes.md#adr-008)) e preparar contas (alojamento, fornecedor de IA, repositório) **sem criar código**.
- [ ] Preparar as perguntas para o mentor (secção 7).
- [ ] Preparar a pergunta para a organização sobre materiais de conceito anteriores.

## 5. Plano dia a dia

### Segunda, 19/10 — Arranque e esqueleto

| Hora | Atividade | Responsável | Saída |
|---|---|---|---|
| 09h30 | Arranque oficial: desafios e mentores | Todos | Confirmar 3.4 ([ADR-001](21-registo-de-decisoes.md#adr-001)) |
| 10h30 | Criar projeto na TAIKAI e convidar a equipa | Produto | Projeto criado |
| 10h30 | Criar repositório público (EUPL), primeiro commit | Porta/infra | Repositório |
| 11h00 | Conversa com o mentor Filipe Novais (DTx) | Produto + Conteúdo | Respostas às 3 perguntas |
| 11h00 | Pergunta à organização sobre materiais anteriores | Produto | Resposta registada |
| 11h30 | Esqueleto da app, chat a responder, ligação ao modelo | IA/backend + Interface | Chat «olá mundo» alojado |
| 11h30 | Curadoria dos primeiros 5 serviços (M do anexo A) | Conteúdo | 5 registos YAML |
| 17h00 | Demo interna | Todos | — |

**Pronto no fim do dia:** chat alojado responde; 5 registos com fontes; esquema validado.

### Terça, 20/10 — Responder com fonte

| Atividade | Responsável | Saída |
|---|---|---|
| Recuperação + redator + verificador com citações | IA/backend | HU-01..03 |
| Formato de resposta e cartão de fonte | Interface | HU-01 visível |
| Registos 6 a 12 | Conteúdo | 12 registos |
| Conjunto de avaliação v1 (≥ 30) e executor | Conteúdo + IA/backend | Primeira execução |
| Servidor MCP com `procurar_servicos` e `obter_servico` | Porta/infra | HU-13 base |

**Pronto no fim do dia:** HU-01 cumprida; primeira execução da avaliação.

### Quarta, 21/10 — Missão, Cofre, Mandato

| Atividade | Responsável | Saída |
|---|---|---|
| Missões, estados, checklist, rascunho simulado | IA/backend | HU-06, HU-07, HU-10 |
| Cofre e Mandato (cartões, consentimento, revogação) | Interface + IA/backend | HU-08, HU-09 |
| Encaminhamento e recusa (fora de competência, juízo técnico) | IA/backend | HU-04, HU-05 |
| Conjunto v2 (≥ 42) com adversariais | Conteúdo | — |
| Auditoria e painel «Quem viu» | Porta/infra | HU-16 |
| Painel de avaliação | Interface | HU-14 |

**Pronto no fim do dia:** J1 de ponta a ponta.

### Quinta, 22/10 — Câmara, proatividade, congelamento

| Atividade | Responsável | Saída |
|---|---|---|
| Consola com caso preparado | Interface | HU-12 |
| Alerta do PDM | IA/backend | HU-11 |
| Mapa de Intenções sintético (se houver tempo) | Interface | HU-15 |
| Correções guiadas pela avaliação | IA/backend + Conteúdo | Metas atingidas |
| Teste com 2–3 pessoas de fora da equipa | Produto | MET-Q6 |
| **18h00: congelamento e execução de avaliação** | Todos | Números do pitch |

### Sexta, 23/10 — Submissão

| Hora | Atividade | Responsável |
|---|---|---|
| 09h30 | Correções finais, README, créditos | Todos |
| 11h00 | Gravar vídeo de demonstração (plano B) | Porta/infra + Produto |
| 13h00 | Execução final da avaliação | Conteúdo |
| **15h00** | **Submissão na TAIKAI** (checklist na secção 6) | Produto |
| 17h30 | Prazo oficial: projeto bloqueado | — |

### Sábado e domingo, 24–25/10 — Pitch

- Deck final (reutilizar o deck interno, com os números da avaliação).
- Três ensaios cronometrados, com perguntas difíceis ([anexo C](anexos/C-guiao-da-demonstracao.md)).
- Atenção: a hora muda a 25/10.

### Segunda, 26/10 — Pitch, 14h30, presencial

- Chegar às 13h30; testar portátil, rede e projetor; ter o vídeo local e a versão local da app.

### Quarta, 28/10 — Resultados, 16h00, presencial

<a id="submissao"></a>
## 6. Checklist de submissão (TAIKAI)

- [ ] Desafio selecionado: **Falar com a Câmara sem Burocracia**
- [ ] Descrição do projeto (texto curto do [00](00-sumario-executivo.md))
- [ ] Problema que resolve
- [ ] Solução proposta
- [ ] Ligação para a demo alojada
- [ ] Ligação para o repositório público (EUPL)
- [ ] Vídeo de demonstração (até 3 minutos)
- [ ] Apresentação em PDF
- [ ] Créditos: modelos de IA, bibliotecas, APIs, fontes, música e voz dos vídeos
- [ ] Declaração de origem de materiais de conceito anteriores, se a organização o pedir
- [ ] Todos os elementos da equipa associados ao projeto

<a id="mentoria"></a>
## 7. Mentoria

**Perguntas para o mentor do desafio (Filipe Novais, DTx), no dia 19:**

1. Que perguntas reais os munícipes mais fazem ao balcão e ao atendedor virtual atual? Podemos ter 20 exemplos anonimizados para o conjunto de avaliação?
2. Que fontes a Câmara considera canónicas (Diretório, Formulários, regulamentos) e quem as poderia validar?
3. Que limitações conhecidas tem o atendedor virtual atual que um projeto deveria complementar?

**Mentoria transversal:**

| Tema | Mentor | Quando |
|---|---|---|
| Arquitetura de agentes e Porta MCP | leeandroleite (CEiiA) | 20/10 |
| Conformidade (IA, RGPD, mandato) | Miguel Amador (Complear) | 21/10 |
| Dados e Registo Canónico | Pedro Guimarães (CCG/ZGDV) | 20/10 |
| Modelo de negócio e continuidade | Helder Vasconcelos (TAIKAI) | 22/10 |

## 8. Rituais

| Ritual | Hora | Duração |
|---|---|---|
| Alinhamento diário | 09h45 | 15 min |
| Ponto de situação | 13h30 | 10 min |
| Demo interna | 17h00 | 20 min |

Quadro de tarefas com as colunas: A fazer · Em curso · Em revisão · Feito. Cada cartão referencia uma HU.

## 9. Definição de pronto (por história)

- [ ] Critérios de aceitação de [08](08-historias-de-utilizador.md) verificados.
- [ ] A funcionar na versão alojada, não só localmente.
- [ ] Avaliação corrida sem regressões.
- [ ] Simulações marcadas.
- [ ] Sem segredos no repositório.
