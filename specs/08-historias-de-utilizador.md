# 08 · Histórias de utilizador

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Formato: «Como [persona], quero [ação], para [benefício]». Critérios de aceitação em Dado / Quando / Então.
> Estimativa em pontos relativos (1, 2, 3, 5, 8). Âmbito: R0, salvo indicação.

## Épicos

| Épico | Nome | Histórias | Prioridade |
|---|---|---|---|
| EP-01 | Responder com fonte | HU-01..HU-05 | M |
| EP-02 | Tratar da esplanada | HU-06..HU-10 | M |
| EP-03 | Avisar com autorização | HU-11 | S |
| EP-04 | Lado da Câmara | HU-12, HU-15 | S / C |
| EP-05 | Porta Agêntica | HU-13 | S |
| EP-06 | Qualidade medida | HU-14 | M |
| EP-07 | Confiança e prova | HU-16 | S |
| EP-08 | Base técnica | HU-17, HU-18 | M |

---

## EP-01 · Responder com fonte

### HU-01 · Pergunta real com resposta correta e fonte à vista (critério do desafio)

**Como** Inês (P1), **quero** perguntar em linguagem simples o que preciso para pôr uma esplanada, **para** saber o que fazer sem ler regulamentos.

- **Dado** que o serviço de ocupação do espaço público com esplanada está no Registo Canónico
- **Quando** a Inês escreve «Quero pôr uma esplanada à porta do meu restaurante, o que preciso?»
- **Então** o Afonso identifica o procedimento, responde em linguagem simples em menos de 8 segundos
- **E** mostra a fonte com título, ligação e data de consulta
- **E** a resposta não contém nenhum valor (taxa, prazo, medida) que não esteja na fonte.

Requisitos: RF-RES-01, RF-RES-02, RF-RES-04, RF-RES-08 · Pontos: 5

### HU-02 · Pergunta sobre outro serviço do catálogo

**Como** Rita (P3), **quero** saber o que fazer quando um ascensor chumba na inspeção, **para** pedir a reinspeção certa.

- **Dado** que o formulário «Inspeção ou Reinspeção de Ascensores» está no registo
- **Quando** a Rita pergunta «O elevador chumbou na inspeção, e agora?»
- **Então** o Afonso distingue reinspeção de inspeção periódica e indica o procedimento certo, com fonte.

Requisitos: RF-RES-01, RF-RES-02 · Pontos: 2

### HU-03 · Abstenção quando não há fonte

**Como** munícipe, **quero** que o Afonso me diga quando não sabe, **para** não agir com informação errada.

- **Dado** que a taxa da esplanada não consta de nenhuma fonte no registo
- **Quando** a Inês pergunta «Quanto vou pagar?»
- **Então** o Afonso diz que a taxa é calculada pela Câmara, que não a consegue confirmar, e indica onde se confirma
- **E** oferece passar a uma pessoa.

Requisitos: RF-RES-03, RF-RES-04 · Pontos: 2

### HU-04 · Encaminhamento fora de competência

**Como** Sr. Albano (P2), **quero** saber onde renovo o Cartão de Cidadão, **para** não ir ao sítio errado.

- **Quando** pergunta «Como renovo o Cartão de Cidadão?»
- **Então** o Afonso explica que é um serviço da Administração Central, indica o Espaço Cidadão e a fonte nacional
- **E** não descreve procedimentos que não estão no registo.

Requisitos: RF-RES-05, RF-REG-04 · Pontos: 2

### HU-05 · Recusa de juízo de viabilidade

**Como** Inês, **quero** perceber se posso construir no terreno, **para** decidir o próximo passo.

- **Quando** pergunta «Posso construir uma casa de 150 m² no terreno do meu avô?»
- **Então** o Afonso não afirma que pode ou não pode
- **E** explica o PDM em vigor e a revisão em curso, com fonte
- **E** explica o pedido de informação prévia e quando é preciso um técnico habilitado.

Requisitos: RF-RES-06 · Pontos: 3

---

## EP-02 · Tratar da esplanada

### HU-06 · Missão criada a partir da conversa

**Como** Inês, **quero** que o meu pedido se transforme numa missão visível, **para** saber em que ponto está.

- **Quando** a Inês diz «Sim, trate disso»
- **Então** aparece um cartão de missão com objetivo, dados partilhados, dados não partilhados, fonte, prazo e estado `entendido`.

Requisitos: RF-MIS-01..03 · Pontos: 3

### HU-07 · Perguntas mínimas

- **Dado** uma missão de esplanada em `a verificar`
- **Quando** o Afonso precisa de dados
- **Então** pede apenas número de mesas, meses e fotografia do passeio, e nada mais.

Requisitos: RF-RES-07 · Pontos: 2

### HU-08 · Guardar no Cofre com autorização

**Como** Inês, **quero** decidir o que o Afonso guarda, **para** controlar os meus dados.

- **Quando** o Afonso sugere guardar a esplanada no Cofre
- **Então** só guarda se a Inês aceitar
- **E** o item mostra origem, finalidade, validade e permissões
- **E** a Inês consegue apagá-lo.

Requisitos: RF-COF-01..03 · Pontos: 3

### HU-09 · Conceder e revogar mandato

**Como** Inês, **quero** autorizar o Afonso a preparar e submeter com a minha confirmação, **para** não ter de tratar eu.

- **Quando** aceita o mandato
- **Então** vê um cartão com âmbito «ocupação do espaço público», entidade, nível D3, validade e botão de revogação
- **Quando** revoga
- **Então** a missão passa a `precisa de si` e nenhuma ação é executada.

Requisitos: RF-MAN-01..03, RF-POL-01 · Pontos: 3

### HU-10 · Rascunho, pacote mínimo e recibo

- **Dado** uma missão `preparado`
- **Quando** a Inês revê o rascunho
- **Então** vê exatamente o pacote mínimo que seria partilhado
- **Quando** confirma
- **Então** a missão passa a `submetido` e recebe um recibo marcado «Simulação».

Requisitos: RF-MIS-04..05, RF-COF-05 · Pontos: 5

---

## EP-03 · Avisar com autorização

### HU-11 · Alerta da revisão do PDM

- **Dado** que a Inês autorizou alertas sobre o PDM para o terreno em Ponte
- **Quando** a demo dispara o evento «votação na Assembleia Municipal»
- **Então** a Inês recebe uma mensagem com a ligação oficial e a indicação de que recebe o alerta porque o autorizou.

Requisitos: RF-PRO-01..02 · Pontos: 3

## EP-04 · Lado da Câmara

### HU-12 · Caso preparado na Consola

**Como** Marta (P5), **quero** receber um caso com tudo o que preciso, **para** decidir sem pedir mais elementos.

- **Quando** abre o caso
- **Então** vê motivo, resumo, fontes, dados mínimos, proposta, risco e prazo
- **Quando** aprova ou pede um elemento
- **Então** é registada a decisão com identidade funcional e fundamento, e o munícipe é informado.

Requisitos: RF-CNS-01..03 · Pontos: 5

### HU-15 · Mapa de Intenções

- **Quando** o Dr. Paulo (P6) abre o mapa
- **Então** vê intenções agregadas por tema e freguesia, com a etiqueta «Dados sintéticos».

Requisitos: RF-MAP-01 · Pontos: 3 · Prioridade C

## EP-05 · Porta Agêntica

### HU-13 · Agente externo usa a Porta

**Como** agente de terceiros (P7), **quero** consultar o catálogo e a ficha de um serviço por MCP, **para** responder ao meu cliente com a mesma fonte oficial.

- **Dado** um cliente MCP configurado com o endereço da Porta
- **Quando** o agente chama `procurar_servicos("esplanada")` e `obter_servico(id)`
- **Então** recebe o registo com fontes e versão
- **E** a chamada aparece no trilho de auditoria.

Requisitos: RF-POR-01, RF-POR-02, RF-POR-05 · Pontos: 5

## EP-06 · Qualidade medida

### HU-14 · Painel de avaliação

**Como** equipa e como júri, **queremos** ver a qualidade medida, **para** confiar no Afonso.

- **Dado** o conjunto de avaliação com ≥ 40 perguntas
- **Quando** o executor corre
- **Então** o painel mostra: procedimento correto, respostas com fonte, abstenção correta, encaminhamento correto, valores inventados, bloqueio de ataques
- **E** permite abrir cada pergunta com a resposta obtida.

Requisitos: RF-AVA-01..04 · Pontos: 5

## EP-07 · Confiança e prova

### HU-16 · Quem viu os meus dados

- **Quando** a Inês abre o painel
- **Então** vê cada acesso ao pacote da missão (quem, quando, para quê).

Requisitos: RF-AUD-01..02 · Pontos: 2

## EP-08 · Base técnica

### HU-17 · Registo Canónico com 10 a 15 serviços

- **Dado** o [anexo A](anexos/A-catalogo-servicos-prototipo.md)
- **Quando** a curadoria termina
- **Então** existem 10 a 15 registos com fontes, data de consulta, hash e estado `revisto`.

Requisitos: RF-REG-01..04 · Pontos: 8

### HU-18 · Repositório e publicação

- **Então** o repositório público tem README, licença EUPL, créditos de ferramentas e modelos de IA, instruções para correr, e a demo está acessível por URL.

Pontos: 2

---

<a id="resumo-de-esforco"></a>
## Resumo de esforço (R0)

| Épico | Pontos |
|---|---:|
| EP-01 | 14 |
| EP-02 | 16 |
| EP-03 | 3 |
| EP-04 | 8 |
| EP-05 | 5 |
| EP-06 | 5 |
| EP-07 | 2 |
| EP-08 | 10 |
| **Total** | **63** |

Com uma equipa de 4 a 5 pessoas e 5 dias, a ordem de corte, se faltar tempo, é: HU-15 → HU-11 → HU-16 → HU-13 → HU-12. As histórias de EP-01, EP-02 (exceto HU-07), EP-06 e EP-08 não se cortam.
