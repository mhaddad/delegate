# 00 · Sumário executivo

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## Numa frase

**Diga o que precisa. O Henriques trata do resto.** O Delegate dá a cada pessoa e a cada negócio de Guimarães um representante digital leal que trata da Câmara por si. E dá à Câmara a capacidade de ouvir o que a cidade quer fazer antes de lhe pedirem.

## O problema

A Inês (🎭) herdou do avô o restaurante Casa Joaquim e um terreno em Ponte. Quer pôr uma esplanada e construir uma casa. Sabe que precisa da Câmara, mas não sabe o que pedir, a quem, nem que regras se aplicam. A informação existe, mas está dispersa e em linguagem técnica.

Evidência em Guimarães (fevereiro a novembro de 2025, ✅ relatórios de atividades):

- **22.425** atendimentos presenciais no Balcão Único, com tempo médio de atendimento entre 20 e 28 minutos;
- **41.473** chamadas atendidas;
- **28.308** registos de correspondência, **88,7%** por email.

Não sabemos que parte desta carga é repetitiva ou evitável. Medir isso faz parte do piloto.

A Câmara já tem um **atendedor virtual com IA** (✅ portal municipal). O Delegate não parte do zero: responde a lacunas que um assistente conversacional não resolve sozinho.

## A solução

| Peça | O que faz |
|---|---|
| **Representante Digital Pessoal (Henriques)** | Recebe pedidos em linguagem natural, identifica o procedimento certo, responde com a fonte oficial à vista e acompanha a missão até ao fim. Trabalha para a pessoa, com uma Carta de Lealdade pública. |
| **Mandato Digital** | Autorização verificável, por níveis (D0 informar a D4 agir dentro de regras), revogável a qualquer momento. |
| **Cofre Digital Pessoal** | Memória cifrada da pessoa: identidade (via carteira europeia), provas (credenciais) e intenções. As chaves ficam com a pessoa. |
| **Contrato de Missão** | Cada pedido é uma ficha legível com objetivo, dados partilhados, prazo e estado. |
| **Porta Agêntica Municipal** | Interface aberta (API e MCP) por onde qualquer agente de IA trata de serviços municipais com regras, mandato e auditoria. |
| **Consola e Mapa de Intenções** | Os técnicos recebem casos preparados e decidem. A Câmara vê, agregado e anónimo, o que a cidade quer fazer. |

## Porque é diferente do atendedor que já existe

1. **Fonte e versão à vista em cada resposta.** Quando não há fonte válida, o Henriques diz que não sabe.
2. **Procedimento certo, não só resposta certa.** O pedido torna-se uma missão com passos, documentos e canal competente.
3. **Qualidade medida e publicada.** Um conjunto de perguntas reais avalia a precisão, as fontes e as abstenções.
4. **Age em nome da pessoa**, com mandato verificável e recibo.
5. **Infraestrutura aberta.** A Porta Agêntica pode servir o próprio atendedor da Câmara e agentes de terceiros. Complementa o que existe, não o substitui.

## O que vamos construir no hackathon (R0, 19 a 23 de outubro)

Um protótipo funcional, construído de raiz, que responde ao «bom resultado» do desafio 3.4: *alguém faz uma pergunta real sobre um serviço municipal e obtém uma resposta correta, em linguagem simples, com a fonte à vista*.

- Henriques num chat web (estilo WhatsApp) sobre um **Registo Canónico** de 10 a 15 serviços reais, curados de fontes públicas;
- caso âncora da esplanada de ponta a ponta, com missão, cofre e mandato (submissão simulada);
- alerta proativo da revisão do PDM;
- Consola Municipal com um caso preparado;
- **painel de avaliação** com resultados medidos sobre perguntas reais;
- **Porta Agêntica em MCP** (leitura do catálogo), demonstrada com um agente externo.

Detalhe em [06](06-ambito-e-releases.md) e [19](19-plano-do-hackathon.md).

## Impacto

- **Pessoas:** menos deslocações, chamadas e repetição; a mesma missão em qualquer canal, incluindo as Juntas de Freguesia.
- **Empresas:** menos tempo e custo de contexto para abrir, licenciar e construir. Esplanadas, obras e inspeções de ascensores são procedimentos com volume real (✅ 751 pedidos de inspeção de ascensores e 407 licenças de ocupação para obras em 10 meses de 2025).
- **Câmara:** pedidos mais completos, técnicos focados em decidir e dados para gerir.
- **Cidade:** contributo para a candidatura a Cidade Europeia da Inovação e para a Capital Verde Europeia 2026, através das missões verdes.

## Modelo de negócio

O munícipe nunca paga. A Câmara paga pela infraestrutura que a deixa pronta para agentes. Quem usa essa infraestrutura para fazer negócio (bancos, contabilistas, software) paga pela passagem, e parte volta à Câmara. Núcleo em código aberto (EUPL).

Hipóteses (🧪): piloto de **65 mil €** em 5 meses; subscrição de cerca de **166 mil €** no ano 2 em Guimarães; receita ilustrativa de **600 mil €** no ano 3 com 8 municípios da CIM do Ave e agentes terceiros. Detalhe em [16](16-modelo-de-negocio.md).

## Calendário crítico

| Data | Marco |
|---|---|
| 19/10, 09h30 | Arranque; criar projeto na TAIKAI; falar com o mentor do desafio |
| 23/10, 17h30 | **Submissão final** (projetos bloqueados depois) |
| 26/10, 14h30 | **Pitch presencial** perante o júri |
| 28/10, 16h00 | Anúncio dos vencedores (presença obrigatória) |

## Decisões pedidas à equipa

1. Confirmar o desafio 3.4 ([ADR-001](21-registo-de-decisoes.md#adr-001)).
2. Atribuir papéis ([19](19-plano-do-hackathon.md#papeis)).
3. Validar com a organização o uso de materiais de conceito anteriores ([R-01](20-riscos-e-pressupostos.md)).
