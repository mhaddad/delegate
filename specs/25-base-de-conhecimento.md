# 25 · Base de conhecimento (nível D0)

> Estado: proposta recomendada pela mentoria (19/10/2026) · Atualizado: 19/10/2026 · [Índice](README.md)
> Decisão: [ADR-021](21-registo-de-decisoes.md#adr-021). Complementa [12 · IA e avaliação](12-ia-e-avaliacao.md).

## 1. Porquê

O Registo Canónico curado cobre 10 a 15 serviços. Isso deixa o Afonso a abster-se em quase tudo o resto, ao passo que o atendedor atual da Câmara e as outras equipas do desafio respondem a perguntas gerais.

A mentoria recomendou uma **base de conhecimento ampla**, construída a partir do site da Câmara e das leis e regulamentos em vigor, para dar ao Afonso capacidade de resposta básica no nível **D0 (informar)**. Isto põe-nos ao nível do que já existe. A diferença passa a estar no que vem por cima: fonte verificada, missões, mandato, integração e medição.

## 2. Duas camadas de conhecimento

| Camada | Cobertura | Estrutura | Uso |
|---|---|---|---|
| **Base de conhecimento** | Ampla: portal, Diretório, Formulários, regulamentos, leis | Texto segmentado com metadados e citação | Respostas D0 |
| **Processos Canónicos** ([24](24-processos-canonicos-e-integracao.md)) | Estreita: serviços curados | Estruturada (entradas, passos, capacidades) | Respostas de alta precisão e missões D1–D3 |

### Política de resposta

| Ordem | Fonte encontrada | O Afonso |
|---|---|---|
| 1 | Processo canónico do serviço | Responde e oferece tratar da missão |
| 2 | Ficha oficial (Diretório ou Formulário) | Responde com a ficha como fonte; orienta para o canal oficial (I0) |
| 3 | Regulamento ou lei | Explica citando o artigo; avisa que não substitui a apreciação da Câmara |
| 4 | Página geral do portal | Responde de forma informativa com a ligação |
| — | Nada pertinente, ou fontes contraditórias | Abstém-se; diz onde confirmar; regista uma lacuna de conteúdo |

O cartão de fonte mostra o tipo («Ficha oficial», «Regulamento, art. 8.º», «Página do portal») e a data de consulta. Valores (taxas, prazos, medidas) só aparecem se estiverem no excerto citado, como antes.

## 3. Fontes

### 3.1 Guimarães

| Fonte | Conteúdo | Prioridade |
|---|---|---|
| [Diretório de Serviços](https://diretorio.cm-guimaraes.pt/) | Fichas: requisitos, documentos, taxas, canais | M |
| [Formulários](https://www.cm-guimaraes.pt/servicos-online/formularios) | Títulos e instruções de procedimentos | M |
| [Catálogo de Serviços](https://www.cm-guimaraes.pt/como-podemos-ajudar/servicos) | Organização temática | M |
| Regulamentos municipais em vigor (PDF no portal) | Normas locais, incluindo o de Ocupação do Espaço Público e Publicidade | M |
| [Urbanismo Digital](https://www.cm-guimaraes.pt/municipio/camara-municipal/servicos/urbanismo/urbanismo-digital) e FAQ | Submissão urbanística | S |
| [Revisão do PDM](https://pdm.guimaraes.pt/) | Estado da revisão, documentos | S |
| Páginas de contactos, horários e atendimento | Canais | S |

### 3.2 Legislação nacional (versões consolidadas no Diário da República)

| Diploma | Porquê | Prioridade |
|---|---|---|
| Licenciamento Zero (Decreto-Lei n.º 48/2011, versão consolidada) | Esplanadas, restauração, publicidade | M |
| Regime Jurídico da Urbanização e Edificação (Decreto-Lei n.º 555/99, versão consolidada, incluindo a revisão de 2026) | Obras, PIP, licenciamento | S |
| Código do Procedimento Administrativo (Decreto-Lei n.º 4/2015) | Direitos no procedimento, prazos gerais | S |
| Regime geral das taxas das autarquias locais | Perguntas sobre taxas | C |

⚠️ Confirmar a versão em vigor de cada diploma no dia da ingestão e registar a data.

### 3.3 Exclusões

- Páginas com dados pessoais (atas com nomes, listas de requerentes).
- Notícias e agenda, salvo se forem precisas para um alerta autorizado.
- Conteúdo de outras entidades (Vimágua, VITRUS, CASFIG): só ligações de encaminhamento.

## 4. Ingestão

```text
lista de fontes (semente) → recolha respeitando robots.txt e com limite de pedidos
  → cópia bruta guardada (HTML/PDF) com data e hash
  → extração de texto (PDF → texto; tabelas preservadas quando possível)
  → segmentação: fichas por secção; leis e regulamentos por artigo
  → metadados por segmento: url, título, tipo, entidade, artigo, consultado_em, hash, versão
  → índice híbrido (palavras-chave + embeddings)
  → relatório de cobertura (fontes, segmentos, erros)
```

| Regra | Porquê |
|---|---|
| Guardar cópia e hash de cada documento | Prova do que foi citado e deteção de alterações |
| Segmentar leis por artigo | Citações precisas («art. 8.º») |
| Reprocessar a pedido e comparar hashes | Fontes desatualizadas são o principal risco |
| Não indexar documentos com dados pessoais | RGPD |
| Respeitar termos de utilização do portal | Confirmar com a mentoria ou a organização |

Em R0, a ingestão é **código escrito durante o hackathon** e executada nessa semana (regra «criado de raiz»).

## 5. Metas para o protótipo

| Meta | Valor |
|---|---|
| Fichas do Diretório e formulários ingeridos | Todas as acessíveis publicamente |
| Regulamentos municipais | ≥ 10, começando pelos das jornadas |
| Diplomas nacionais | 3 (Licenciamento Zero, RJUE, CPA) |
| Perguntas da categoria «base de conhecimento» respondidas com fonte válida | ≥ 70% (MET-Q8) |
| Valores sem fonte | 0 (mantém-se MET-Q3) |

## 6. Avaliação

O [conjunto de avaliação](anexos/B-conjunto-de-avaliacao.md) ganha uma categoria **«base de conhecimento»** com perguntas sobre serviços fora do catálogo curado.

| ID | Métrica | Meta R0 |
|---|---|---:|
| MET-Q8 | Cobertura D0: perguntas da base de conhecimento respondidas com fonte válida e pertinente | ≥ 70% |
| MET-Q9 | Precisão D0: respostas da base de conhecimento sem erro factual (revisão humana) | ≥ 90% |

## 7. Riscos

| Risco | Mitigação |
|---|---|
| Páginas desatualizadas ou contraditórias | Data de consulta visível; preferir ficha a página geral; abster-se perante contradição |
| PDF difíceis de extrair | Começar pelos regulamentos das jornadas; verificar amostras |
| Citar lei como se fosse aconselhamento jurídico | Frase-modelo: «Isto é o que diz o artigo X. A apreciação do seu caso é da Câmara.» |
| Volume de ingestão roubar tempo ao resto | Uma pessoa, meio dia no dia 19 e meio dia no dia 20; o resto em segundo plano |
| Termos de utilização do portal | Confirmar no dia 19; usar só conteúdo público e citar sempre |
