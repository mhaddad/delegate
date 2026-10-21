# 10 · Arquitetura

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Arquitetura-alvo (R1+)

```mermaid
flowchart LR
  C[Canais<br/>WhatsApp · portal · SMS · voz · balcão] --> R[Representante Digital Pessoal<br/>Henriques]
  R <--> V[Cofre Digital Pessoal<br/>chaves da pessoa]
  R --> P[Motor de política<br/>mandato · consentimento · risco · competência]
  P --> O[Orquestrador de missões]
  O --> A[Agentes especializados]
  A --> G[Porta Agêntica Municipal<br/>registo canónico · capacidades · verificação de mandato]
  T[Agentes certificados de terceiros] --> G
  G --> M[Sistemas municipais<br/>urbanismo · ocupação · taxas]
  O --> K[Consola Municipal<br/>técnicos]
  G --> L[(Auditoria e prova)]
  P --> L
  K --> L
```

### Responsabilidades

| Componente | Responsabilidade | Não faz |
|---|---|---|
| Canais | Receber e entregar mensagens; abrir vistas seguras | Guardar dados do Cofre |
| Representante | Conversar, entender missões, formatar respostas | Aceder diretamente a sistemas |
| Cofre | Guardar itens cifrados; produzir pacotes mínimos | Expor conteúdo ao operador |
| Motor de política | Decidir se uma ação é permitida, pedida a confirmação ou bloqueada | Executar ações |
| Orquestrador | Dividir a missão por agentes, gerir estados | Ignorar o motor de política |
| Agentes especializados | Tarefas delimitadas (ver [12](12-ia-e-avaliacao.md)) | Usar ferramentas fora da sua lista |
| Porta Agêntica | Expor serviços e capacidades com verificação de mandato e auditoria | Dar acesso geral a bases de dados |
| Consola | Apresentar casos a técnicos e registar decisões | Decidir sozinha |
| Auditoria | Registo só de acréscimo de todos os eventos relevantes | Ser editável |

## 2. Arquitetura do protótipo (R0)

Objetivo: o mínimo que demonstra a arquitetura-alvo, construído em 5 dias, com fontes públicas reais.

```mermaid
flowchart TB
  subgraph Web[Aplicação web]
    UI1[Vista Munícipe<br/>chat + missão + cofre]
    UI2[Vista Consola]
    UI3[Vista Gestão<br/>avaliação + mapa]
  end
  subgraph API[Backend]
    CH[Serviço de conversa]
    PE[Motor de política<br/>regras declarativas]
    MI[Missões e mandatos]
    CO[Cofre<br/>cifra no navegador]
    RT[Recuperação de fontes]
    AU[(Auditoria)]
    EV[Executor de avaliação]
  end
  REG[(Registo Canónico<br/>ficheiros YAML/JSON no repositório)]
  MCP[Servidor MCP da Porta]
  LLM[[Fornecedor de modelo de IA]]
  EXT[Agente externo<br/>cliente MCP]

  UI1 --> CH
  UI2 --> MI
  UI3 --> EV
  CH --> PE --> MI
  CH --> RT --> REG
  CH --> LLM
  MI --> CO
  MI --> AU
  EV --> CH
  EXT --> MCP --> REG
  MCP --> AU
```

### 2.1 Stack recomendada

> Decisão final da equipa no dia 1 ([ADR-008](21-registo-de-decisoes.md#adr-008)). Critério: o que a equipa domina melhor.

| Camada | Recomendação | Alternativa |
|---|---|---|
| Interface | Next.js + TypeScript + Tailwind | SvelteKit |
| Backend | Rotas API do Next.js (mesmo repositório) | Python + FastAPI |
| Registo Canónico | Ficheiros YAML no repositório, validados por esquema JSON | SQLite |
| Recuperação | Pesquisa híbrida: palavras-chave (BM25) + embeddings sobre os registos | Só palavras-chave, dado o catálogo pequeno |
| Modelo de IA | Família Claude 5 (modelo maior para conversa e juiz da avaliação, modelo menor para classificação) | Outro fornecedor, por configuração |
| Porta Agêntica | Servidor MCP em TypeScript (SDK oficial) + endpoints REST equivalentes | Python (SDK oficial) |
| Cofre | Cifra no navegador (Web Crypto, AES-GCM) com chave derivada localmente | Cifra no servidor (só para demo) |
| Auditoria | Tabela só de acréscimo (SQLite / Postgres) com encadeamento por hash | Ficheiro JSONL |
| Alojamento | Vercel / Fly.io / Render (região UE) | Máquina local + túnel como plano B |
| WhatsApp (C) | Sandbox de fornecedor de WhatsApp Business | Não fazer em R0 |

Todas as ferramentas e modelos são identificados no README e na submissão (regra do hackathon).

### 2.2 Estrutura do repositório

```text
delegate/
├── README.md                 # o que é, como correr, créditos, licença
├── LICENSE                   # EUPL-1.2
├── registo/                  # Registo Canónico (1 ficheiro por serviço)
│   ├── _schema.json
│   └── ocupacao-espaco-publico-esplanada.yaml
├── avaliacao/
│   ├── conjunto.yaml         # anexo B
│   └── resultados/           # uma pasta por execução
├── app/                      # interface e API
├── porta/                    # servidor MCP + REST
├── politica/                 # regras do motor de política
└── docs/                     # ligação a /specs
```

## 3. Fluxos principais

### 3.1 Pergunta com resposta e fonte (HU-01)

```mermaid
sequenceDiagram
  actor I as Inês
  participant C as Conversa
  participant R as Recuperação
  participant G as Registo
  participant M as Modelo de IA
  participant P as Política
  I->>C: «Quero pôr uma esplanada…»
  C->>M: classificar intenção e competência
  M-->>C: intenção=ocupação/esplanada, competência=Câmara
  C->>R: procurar serviços
  R->>G: pesquisa híbrida
  G-->>R: 1–3 registos + fontes
  R-->>C: excertos com ids de fonte
  C->>M: gerar resposta só com os excertos
  M-->>C: rascunho com citações
  C->>P: verificar (citações válidas? valores sem fonte?)
  P-->>C: aprovado / pedir abstenção
  C-->>I: resposta + fonte + próxima ação
```

### 3.2 Missão com mandato (HU-06 a HU-10)

```mermaid
sequenceDiagram
  actor I as Inês
  participant C as Conversa
  participant MI as Missões
  participant CO as Cofre
  participant P as Política
  participant PT as Porta
  participant A as Auditoria
  I->>C: «Sim, trate disso»
  C->>MI: criar missão (esplanada)
  MI-->>I: cartão da missão + pedido de mandato D3
  I->>MI: aceita mandato
  MI->>A: evento mandato.concedido
  MI->>CO: pedir pacote mínimo
  CO-->>I: mostra o pacote antes de sair
  I->>CO: confirma
  MI->>P: pode chamar criar_rascunho_ocupacao?
  P-->>MI: sim (mandato D3, âmbito correto)
  MI->>PT: criar_rascunho_ocupacao (simulado)
  PT->>A: evento capacidade.chamada
  PT-->>MI: rascunho + versão do regulamento
  MI-->>I: rascunho para rever → confirmar → recibo «Simulação»
```

## 4. Integrações por release

| Sistema | R0 | R1 | R2+ |
|---|---|---|---|
| Diretório de Serviços, Formulários, Regulamentos (páginas públicas) | Leitura manual e curadoria | Monitorização de alterações | Fonte validada pela Câmara |
| Urbanismo Digital | Não | Leitura de estado (se houver interface autorizada) | Rascunhos |
| Serviços Online | Não | Leitura de estado (idem) | Submissão de baixo risco |
| Chave Móvel Digital | Simulada | Autenticação e assinatura | Idem |
| Atendedor virtual atual | Não | Possível consumidor da Porta | Idem |
| WebSIG / PDM | Ligações | Camadas para o gémeo dos ativos | Idem |
| iAP / EUDI Wallet | Não | Não | R3–R4 |

## 5. Decisões de arquitetura relevantes

Ver [21](21-registo-de-decisoes.md): ADR-006 (só dados públicos), ADR-007 (chat web em R0), ADR-008 (stack), ADR-009 (registo em ficheiros versionados), ADR-010 (Porta em MCP).
