# 04 · Utilizadores e personas

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Todas as personas são ilustrativas 🎭. Devem ser validadas com o mentor do desafio e, no piloto, com entrevistas.

## 1. Segmentos

| Segmento | Tipo | Papel no produto |
|---|---|---|
| Munícipes particulares | Utilizador principal | Pedem, autorizam, acompanham |
| Pequenos negócios | Utilizador principal | Pedem, delegam, recebem alertas |
| Representantes humanos (familiares, Juntas, contabilistas) | Utilizador por mandato | Agem em nome de outros |
| Técnicos municipais | Utilizador interno | Validam e decidem na Consola |
| Gestão municipal | Cliente e decisor | Compra, define prioridades, lê os painéis |
| Agentes de terceiros | Utilizador técnico | Usam a Porta Agêntica |

## 2. Personas

### P1 · Inês — dona de restaurante (persona principal)

| | |
|---|---|
| Perfil | 38 anos, dona do restaurante Casa Joaquim, herdado do avô. Tem um terreno em Ponte. |
| Canais | WhatsApp, sobretudo áudio entre serviços. Tem Chave Móvel Digital. |
| Objetivos | Pôr uma esplanada à porta; saber se pode construir uma casa de 150 m² no terreno. |
| Frustrações | Não sabe se precisa de licença ou de comunicação prévia; perde-se em separadores e regulamentos à noite; pensa em pagar a alguém só para lhe explicar o caminho. |
| Tarefa a resolver | «Quando tenho um plano para o meu negócio, quero saber exatamente o que fazer e ter quem trate disso, para não tirar tempo ao restaurante.» |
| Jornadas | [J1](05-jornadas.md#j1), [J2](05-jornadas.md#j2) |
| Nível de delegação típico | D3 para a esplanada, D1 para o terreno |

### P2 · Sr. Albano — reformado em freguesia rural

| | |
|---|---|
| Perfil | 74 anos. Usa o telemóvel para chamadas e áudios no WhatsApp. Baixa literacia digital. |
| Canais | Junta de Freguesia, telefone, a filha. |
| Objetivos | Queixar-se do terreno vizinho com mato; pedir o Cartão Municipal Sénior. |
| Frustrações | Não sabe a quem se dirigir; não gosta de formulários; depende de outros. |
| Tarefa a resolver | «Quando tenho um problema, quero dizê-lo a alguém de confiança e saber que foi tratado.» |
| Jornadas | [J5](05-jornadas.md#j5) |
| Delegação | A filha e o Espaço Cidadão da Junta agem por mandato |

### P3 · Rita — administradora de condomínios

| | |
|---|---|
| Perfil | 45 anos, gere 30 prédios numa empresa de administração de condomínios. |
| Canais | Email, portal, software de gestão. |
| Objetivos | Pedir inspeções e reinspeções de ascensores a tempo; licenças de ocupação para obras nas fachadas. |
| Frustrações | Vários prédios com prazos diferentes; documentação repetida; não sabe distinguir inspeção periódica de reinspeção à primeira. |
| Tarefa a resolver | «Quando tenho obrigações recorrentes em vários prédios, quero que nada me escape e que o pedido saia completo.» |
| Jornadas | [J3](05-jornadas.md#j3), [J4](05-jornadas.md#j4) |
| Interesse especial | Mandatos múltiplos; agente do software de gestão a usar a Porta |

### P4 · Rui — contabilista certificado

| | |
|---|---|
| Perfil | 52 anos, gabinete com 200 clientes PME. |
| Objetivos | Tratar de taxas, renovações e comunicações dos clientes sem deslocações. |
| Tarefa a resolver | «Quando um cliente me pede para tratar da Câmara, quero fazê-lo com autorização clara e sem repetir dados.» |
| Papel | Agente certificado na Porta (release R3) |

### P5 · Marta — técnica do Gabinete de Serviços Urbanos

| | |
|---|---|
| Perfil | 34 anos, arquiteta, instrui processos de ocupação do espaço público e publicidade. |
| Canais internos | Sistemas municipais, email, telefone. |
| Objetivos | Receber pedidos completos; decidir com fundamento; passar menos tempo a explicar estados. |
| Frustrações | Pedidos incompletos; chamadas a perguntar «em que fase está». |
| Tarefa a resolver | «Quando um pedido me chega, quero ter tudo o que preciso para decidir, e só isso.» |
| Jornadas | [J8](05-jornadas.md#j8) |
| Receios | Ser substituída por IA; responsabilidade por erros da IA |

### P6 · Dr. Paulo — chefe de divisão de Atendimento e Apoio ao Munícipe

| | |
|---|---|
| Perfil | Responsável pelo BUA, Balcão Virtual e relação com os Espaços Cidadão. |
| Objetivos | Reduzir contactos repetidos; melhorar a informação; justificar investimento. |
| Precisa de | Métricas, linha de base, segurança jurídica, controlo humano. |
| Papel | Patrocinador do piloto; dono funcional do Registo Canónico |

### P7 · Agente de terceiros

| | |
|---|---|
| Exemplo | O assistente de IA de um software de contabilidade, ou o assistente pessoal da Inês |
| Objetivo | Consultar serviços e preparar pedidos em nome de um cliente |
| Requisitos | Interface documentada, mandato verificável, erros claros, auditoria |
| Papel | Cliente da Porta Agêntica ([13](13-porta-agentica-api.md)) |

## 3. Mapa de stakeholders

| Stakeholder | Interesse | Influência | Estratégia |
|---|---|---|---|
| Júri do hackathon | Inovação, viabilidade, impacto, continuidade | Alta (agora) | Demo real, números com fonte, plano credível |
| Mentor do desafio (DTx, CCG/ZGDV) | Qualidade técnica e aderência ao desafio | Alta | Falar no dia 1; trazer 3 perguntas concretas |
| Executivo municipal e vereação | Modernização, candidatura a Cidade Europeia da Inovação | Muito alta | Impacto e segurança jurídica |
| Divisão de Atendimento (P6) | Eficiência e qualidade | Alta | Parceiro de conteúdo e de métricas |
| Técnicos (P5) | Carga de trabalho, responsabilidade | Média | Consola que poupa trabalho; decisão sempre humana |
| Encarregado de proteção de dados | Conformidade RGPD | Alta (veto) | Minimização e AIPD desde o início |
| Fornecedor do atendedor atual | Continuidade do seu contrato | Média | Posicionar como complemento via Porta |
| Juntas de Freguesia | Proximidade | Média | Representantes humanos com mandato |
| AMA | Interoperabilidade nacional | Média (futuro) | Protocolo aberto, iAP |
| Parceiros privados (contabilidade, banca) | Novos serviços | Baixa (agora) | Parceiro âncora em R3 |

## 4. Anti-personas

Para quem **não** desenhamos o protótipo:

- Profissionais que já dominam o Urbanismo Digital e só querem submeter rapidamente: o ganho é pequeno em R0.
- Quem procura parecer jurídico ou decisão de viabilidade: o Henriques explica e encaminha, não decide.
- Utilizadores de serviços nacionais (Cartão de Cidadão, IRS): o Henriques encaminha para o Espaço Cidadão, mas não trata desses serviços.
