# 02 · Hackathon

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Fonte: [`reference-docs/hack4guimaraes-2035.md`](../reference-docs/hack4guimaraes-2035.md) (extraído da TAIKAI a 18/10/2026)

## 1. O evento

| | |
|---|---|
| Nome | Hack4Guimarães 2035, no Mês da Economia de Guimarães 2026 |
| Pergunta de fundo | Como transformar Guimarães numa economia positiva até 2035? |
| Organização | Município de Guimarães, com apoio do Laboratório da Paisagem |
| Plataforma | [TAIKAI](https://taikai.network/cmguimaraes/hackathons/hack4guimaraes2035) |
| Formato | Híbrido: CIAJG (09h30–17h30) ou remoto |
| Equipa | 1 a 5 elementos, maiores de 18 anos |
| Prémios | 20.000 € no total |

## 2. Desafio escolhido

> **Proposta:** desafio **3.4 «Falar com a Câmara sem Burocracia»**, área Tecnologias Inteligentes. Decisão em [ADR-001](21-registo-de-decisoes.md#adr-001).

| Elemento | Enunciado oficial | Como o Delegate responde |
|---|---|---|
| Problema | Saber que licença é precisa, que documentos entregar ou o estado de um processo obriga muitas vezes a ir ao balcão; a informação existe mas está dispersa e em linguagem difícil | Registo Canónico de Serviços, linguagem simples, procedimento certo |
| Pergunta | Como tornar os serviços municipais mais acessíveis e compreensíveis? | Representante que pergunta só o essencial e acompanha a missão |
| Por onde começar | Assistente conversacional é o caminho óbvio, mas não o único; toda a informação de partida é pública | Assistente + missões + mandato + Porta Agêntica + Consola, tudo sobre fontes públicas |
| **Bom resultado** | **Alguém faz uma pergunta real sobre um serviço municipal e obtém uma resposta correta, em linguagem simples, com a fonte à vista** | **Critério de aceitação n.º 1 do protótipo** ([HU-01](08-historias-de-utilizador.md)), medido no [conjunto de avaliação](anexos/B-conjunto-de-avaliacao.md) |
| Mentoria | Filipe Novais (DTx), CCG/ZGDV | Ver perguntas em [19](19-plano-do-hackathon.md#mentoria) |

### Porquê este desafio

- Encaixa por completo no produto. Os outros quatro desafios (aeroespacial, incêndios, materiais, têxteis) não têm relação com o Delegate.
- O prémio do desafio (1.000 €) acumula com a classificação geral (7.500 € / 4.500 € / 3.000 €).
- Risco a gerir: é o desafio com o «caminho óbvio» mais concorrido (o chatbot). A diferenciação tem de ser visível em segundos ([03](03-visao-e-estrategia.md#posicionamento)).

## 3. Critérios de avaliação e como os respondemos

| Critério | Peso | O que o júri pergunta | Prova que vamos mostrar | Onde está |
|---|---:|---|---|---|
| Inovação e originalidade | 25% | Abordagem nova, distinta de soluções óbvias ou existentes? | Mandato por níveis; Cofre de intenções; Porta Agêntica em MCP que serve qualquer agente, incluindo o atendedor da Câmara; Mapa de Intenções; Carta de Lealdade | [03](03-visao-e-estrategia.md), [13](13-porta-agentica-api.md) |
| Viabilidade técnica | 25% | Funciona? Há algo real? | Protótipo a correr com fontes públicas reais; painel de avaliação com resultados medidos; agente externo a usar a Porta ao vivo; código aberto | [10](10-arquitetura.md), [12](12-ia-e-avaliacao.md) |
| **Impacto e relevância** | **30%** | Responde ao desafio e a Guimarães? Impacto no território, empresas e pessoas? | Números do dossiê com fonte; jornadas com volume real (ascensores, obras, esplanadas); inclusão via Juntas; ligação a Cidade Europeia da Inovação e Capital Verde | [01](01-contexto-e-problema.md), [05](05-jornadas.md) |
| Apresentação e continuidade | 20% | Clareza? Caminho credível depois do hackathon? | História da Inês; demo de 3 minutos; plano de piloto contratável; modelo de negócio; roteiro | [16](16-modelo-de-negocio.md), [17](17-go-to-market-e-roadmap.md), [anexo C](anexos/C-guiao-da-demonstracao.md) |

> Impacto (30%) + apresentação (20%) = metade da nota. O ensaio do pitch é trabalho de produto, não um extra.

## 4. Calendário

Horas de Lisboa. A hora muda para inverno a 25/10.

| Data | Etapa | Observação |
|---|---|---|
| até 19/10, 09h30 | Fecho das inscrições | Todos os elementos inscritos e na mesma equipa |
| **19/10, 09h30** | Arranque, apresentação de desafios e mentores | Criar o projeto na TAIKAI **no primeiro dia** |
| 19–23/10 | Semana de trabalho com mentoria | CIAJG ou remoto |
| **23/10, 17h30** | **Prazo final de submissão** | Depois disto o projeto fica bloqueado. Meta interna: **15h00** |
| **26/10, 14h30** | **Pitch final presencial** (obrigatório) | Duração do pitch: [a confirmar com a organização] |
| 26–27/10 | Avaliação pelo júri | Sem votação pública |
| **28/10, 16h00** | Anúncio dos vencedores (presença obrigatória) | Encerramento do Mês da Economia |

## 5. Regras com impacto direto no projeto

| Regra | Implicação | Ação |
|---|---|---|
| O projeto tem de ser **criado de raiz** durante o hackathon; a organização pode verificar o histórico dos repositórios | Nenhum código, nem curadoria de dados do protótipo, antes de 19/10, 09h30 | Repositório criado no dia 19. Primeiro commit depois do arranque ([R-01](20-riscos-e-pressupostos.md)) |
| Não se pode trazer um projeto já começado | Os vídeos, o deck e o blueprint são materiais de conceito anteriores | Perguntar à organização no dia 19 se podem ser usados e declarar a sua origem |
| Ferramentas, APIs e open source permitidos, desde que identificados | Declarar modelos de IA, bibliotecas e serviços | Secção «Créditos e ferramentas» no README do repositório e na submissão |
| Uso de IA permitido e encorajado, desde que identificado | Idem | Idem |
| Um projeto por equipa, ligado a um desafio | Escolher 3.4 na submissão | — |
| Submissão mínima: descrição, problema e solução | Opcional: protótipo, apresentação, vídeo, demo, repositório | Submeter tudo: ver checklist em [19](19-plano-do-hackathon.md#submissao) |
| Direitos sobre todo o material submetido | Música, voz e imagens dos vídeos têm de ter licença | Confirmar licenças ElevenLabs e fontes |
| A propriedade intelectual fica com a equipa | Compatível com núcleo em código aberto | Licença EUPL no repositório ([ADR-005](21-registo-de-decisoes.md#adr-005)) |
| Dados de empresas ou parceiros podem ter condições próprias | No protótipo usamos só informação pública | [ADR-006](21-registo-de-decisoes.md#adr-006) |

## 6. Mentores relevantes

| Mentor | Para quê |
|---|---|
| **Filipe Novais (DTx)**, mentor do desafio 3.4 | Fontes canónicas, perguntas reais de munícipes, relação com o atendedor existente |
| CCG/ZGDV, também mentor do desafio | Dados e integração |
| Pedro Guimarães (CCG/ZGDV, Engenharia de Dados) | Registo Canónico, recolha e versionamento de fontes |
| leeandroleite (CEiiA, IA e agentes) | Arquitetura de agentes, Porta Agêntica, avaliação |
| Miguel Amador (Complear, conformidade) | Regulamento de IA, RGPD, Mandato Digital |
| Helder Vasconcelos (TAIKAI, criação de empresas) | Modelo de negócio e continuidade |

## 7. Mensagem para o júri

> Em Guimarães, a informação já existe e já há um assistente. O que falta é alguém que trabalhe para a pessoa: que encontre o procedimento certo, mostre a fonte, diga quando não sabe, trate do pedido com autorização e o acompanhe até ao fim. Construímos esse representante, e a porta aberta por onde qualquer agente de IA pode tratar da Câmara com regras.
