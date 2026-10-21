# 12 · IA e avaliação

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Princípios

1. **O modelo não é a fonte.** Toda a afirmação factual vem de um excerto do Registo Canónico com id de fonte.
2. **Abster-se é um resultado correto.** Melhor «não consigo confirmar» do que uma resposta eloquente sem fonte.
3. **Ações só por ferramentas tipadas**, autorizadas pelo motor de política.
4. **Conteúdo recuperado é dado, nunca instrução.**
5. **Qualidade medida, não percebida.** Nenhuma alteração entra sem correr o conjunto de avaliação.

## 2. Agentes

Em R0 os agentes podem ser funções de um único serviço com instruções separadas. A separação de papéis mantém-se mesmo que a implementação seja simples.

| Agente | Entrada | Saída | Ferramentas | R0 |
|---|---|---|---|---|
| Entendimento de missão | Mensagem + contexto da conversa | Intenção, competência, urgência, categoria | — | M |
| Guardião de contexto | Missão + Cofre | Lista de itens autorizados e necessários | `ler_cofre` (só metadados) | S |
| Navegador de regras | Intenção | 1–3 serviços + excertos com ids de fonte | `procurar_servicos`, `obter_servico` | M |
| Redator de resposta | Excertos + pergunta | Resposta no formato de [15](15-ux-conteudo-e-tom.md#formato) com citações | — | M |
| Verificador | Resposta + excertos | Aprovado / pedir abstenção / corrigir | — | M |
| Construtor de jornada | Serviço + dados | Checklist e rascunho | `criar_rascunho_ocupacao` | M |
| Agente proativo | Alertas autorizados + eventos | Mensagens de alerta | `enviar_alerta` | S |
| Supervisor de risco | Ação proposta | Permitir / pedir confirmação / bloquear | Motor de política | M |

## 3. Recuperação de fontes

- **Unidade de indexação:** cada campo de cada registo (condições, documentos, canais, taxas), com o id de fonte associado.
- **Pesquisa híbrida:** palavras-chave + embeddings; sinónimos do registo (`sinonimos`) entram na pesquisa.
- **Limiar de confiança:** se o melhor resultado ficar abaixo do limiar calibrado no conjunto de avaliação, o Henriques pede um esclarecimento ou abstém-se.
- **Catálogo pequeno em R0 (10–15 serviços):** permite passar a lista de títulos ao modelo para classificação direta, com a pesquisa como confirmação.

## 4. Salvaguardas

| Risco | Salvaguarda | Teste |
|---|---|---|
| Valor inventado (taxa, prazo, medida) | O verificador rejeita números que não aparecem nos excertos | Q-adversariais e Q-sem-fonte |
| Citação falsa | Citações só por id de fonte existente; o texto da fonte é mostrado a partir do registo, não gerado | Verificação automática |
| Injeção de instruções na mensagem ou no conteúdo recuperado | Instruções do sistema separadas; conteúdo recuperado entre delimitadores e marcado como dados; ferramentas só pelo motor de política | Q-adversariais |
| Juízo técnico ou decisão | Categoria `juizo_tecnico` força o modelo de resposta de recusa com caminho formal | Q-juízo |
| Dados de terceiros | Pedidos sobre outras pessoas recusados | Q-privacidade |
| Fora de competência | Categoria `fora_competencia` encaminha para a entidade certa | Q-fora |
| Tom inadequado | Instruções de voz ([15](15-ux-conteudo-e-tom.md)) e amostragem manual | Revisão humana |

## 5. Transparência (Regulamento Europeu de IA)

- O Henriques identifica-se como IA (art. 50.º, aplicável desde 02/08/2026).
- A interface indica o fornecedor e o modelo usados (também exigido pelas regras do hackathon).
- O Delegate não toma decisões com efeito jurídico. A classificação de risco do sistema deve ser avaliada em R1 com a equipa jurídica da Câmara.

<a id="metricas"></a>
## 6. Plano de avaliação

### 6.1 Conjunto de avaliação

Definido no [anexo B](anexos/B-conjunto-de-avaliacao.md).

| Categoria | Mínimo R0 | Objetivo |
|---|---:|---|
| Catálogo (perguntas sobre serviços do registo) | 25 | Procedimento correto, fonte, sem valores inventados |
| Sem fonte (pergunta válida sem dado no registo) | 5 | Abstenção correta |
| Fora de competência | 4 | Encaminhamento correto |
| Juízo técnico | 3 | Recusa com caminho formal |
| Adversarial e privacidade | 5 | Bloqueio |
| **Total** | **42** | — |

Pedir ao mentor do desafio perguntas reais de munícipes, anonimizadas, para substituir ou completar as perguntas escritas pela equipa.

### 6.2 Métricas

| ID | Métrica | Como se calcula | Meta R0 |
|---|---|---|---:|
| MET-Q1 | Procedimento correto | Perguntas de catálogo com `servico_esperado` identificado ÷ total de catálogo | ≥ 85% |
| MET-Q2 | Respostas com fonte válida | Respostas factuais com ≥ 1 citação existente e pertinente ÷ respostas factuais | 100% |
| MET-Q3 | Valores sem fonte | Contagem de números (€, dias, metros) não presentes nos excertos | 0 |
| MET-Q4 | Abstenção e encaminhamento corretos | Perguntas `abster` / `encaminhar` / `recusar` com o comportamento certo ÷ total dessas | ≥ 90% |
| MET-Q5 | Ataques bloqueados | Perguntas adversariais sem violação ÷ total adversariais | 100% |
| MET-Q6 | Linguagem simples | Amostra revista por 2 pessoas de fora da equipa, escala 1–5 | ≥ 4 |
| MET-Q7 | Latência p95 | Medida pelo executor | ≤ 8 s |

### 6.3 Método

1. O executor envia cada pergunta ao Henriques e guarda a resposta completa, as fontes citadas e a latência.
2. MET-Q1, Q2, Q3, Q5 e Q7 são calculadas automaticamente (correspondência de ids e verificação de números).
3. MET-Q4 usa um modelo juiz com critérios escritos, e **todas as discordâncias são revistas por uma pessoa**.
4. MET-Q6 é revista por pessoas.
5. Cada execução fica guardada em `avaliacao/resultados/<data-hora>/` com a versão do registo e do código.
6. O painel mostra a última execução e a evolução entre execuções.

### 6.4 Calendário de avaliação no hackathon

| Dia | Marco |
|---|---|
| 20/10 | Conjunto v1 (≥ 30 perguntas); primeira execução |
| 21/10 | Conjunto v2 (≥ 42); correções |
| 22/10 | Execução de congelamento às 18h00; números que vão para o pitch |
| 23/10 | Execução final antes da submissão |

### 6.5 Regra de comunicação

Os números do pitch são os da execução de congelamento, com data, número de perguntas e ressalva: «avaliado pela equipa, sobre perguntas escritas pela equipa [e N perguntas fornecidas pelo mentor]». Não se apresentam como precisão em produção.
