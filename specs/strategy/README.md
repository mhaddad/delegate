# Estratégia de implementação do protótipo (R0)

> Estado: proposta para discussão da equipa · Atualizado: 18/10/2026 · [Especificações](../README.md)

Esta pasta transforma a proposta da equipa para a semana do hackathon numa estratégia de implementação. Parte das cinco ideias discutidas (Telegram, interface de bastidores, Porta Agêntica, Consola, sistemas simulados), mantém-nas e acrescenta o que falta para que a demo seja **real, legível e segura** perante o júri.

## A estratégia numa frase

> **Um só fluxo de eventos, visível de ponta a ponta.** A Inês fala com o Afonso no Telegram; cada passo da plataforma emite um evento; o Observatório desenha esses eventos ao vivo; a Consola fecha o ciclo com uma decisão humana que volta ao telemóvel da Inês.

## O que mantemos, melhoramos e acrescentamos

| Ideia da equipa | Veredicto | Melhoria principal |
|---|---|---|
| Afonso como bot do Telegram | ✅ Manter | Botões de consentimento e mandato, Mini App como «vista segura», adaptador de canal para dizer «no piloto é o WhatsApp» |
| Interface web dos bastidores | ✅ Manter, é a peça central | **Observatório orientado a eventos reais**, não a animações encenadas; modo narrativo e modo técnico; repetição e reposição da demo |
| Porta Agêntica | ✅ Manter | O Afonso usa a Porta por MCP **como qualquer terceiro**; os sistemas simulados só são acessíveis através da Porta |
| Consola da Câmara | ✅ Manter | A decisão do técnico volta ao Telegram ao vivo; a Consola vê casos e pacotes mínimos, nunca o Cofre |
| Simulação de sistemas da Câmara | ✅ Manter | Dois sistemas com papéis claros: Serviços Urbanos (processo) e Tesouraria (referência de pagamento); uma missão atravessa os dois |
| — | ➕ Acrescentar | **Contrato de eventos** comum a todos os componentes |
| — | ➕ Acrescentar | **Registo Canónico e avaliação** continuam obrigatórios: são o critério do desafio |
| — | ➕ Acrescentar | **Esqueleto de ponta a ponta no dia 1**, antes de qualquer componente ficar bonito |
| — | ➕ Acrescentar | **Momento do júri:** um elemento do júri faz a sua própria pergunta ao Afonso |

## Documentos

| # | Documento | Conteúdo |
|---|---|---|
| 01 | [Análise da proposta](01-analise-da-proposta.md) | Pontos fortes, riscos e melhorias de cada ideia |
| 02 | [Arquitetura da demo](02-arquitetura-da-demo.md) | Componentes, implementáveis, fluxos, decisões técnicas |
| 03 | [Canal Telegram](03-canal-telegram.md) | Desenho do bot, botões, Mini App, identidade de demo |
| 04 | [Observatório](04-observatorio.md) | A interface dos bastidores: layout, painéis, animações, modos |
| 05 | [Porta e sistemas simulados](05-porta-e-sistemas-simulados.md) | Capacidades, sistemas simulados, dados fictícios |
| 06 | [Consola e Mapa de Intenções](06-consola-e-mapa.md) | Fila, caso, decisão, ciclo de volta, painéis |
| 07 | [Contrato de eventos](07-contrato-de-eventos.md) | Envelope, catálogo de eventos, regras de privacidade |
| 08 | [Plano de execução](08-plano-de-execucao.md) | Frentes de trabalho, dia a dia, ordem de corte |
| 09 | [Roteiro da demo](09-roteiro-da-demo.md) | Coreografia da demo, versões de 2 e 4 minutos, plano B |
| 10 | [Riscos, decisões e impacto nas especificações](10-riscos-decisoes-e-impacto.md) | Novos riscos, ADR-013 a ADR-019, alterações a propagar |
| 11 | [Ajustes após a mentoria](11-ajustes-pos-mentoria.md) | Integração invertida, base de conhecimento, calculadora de impacto: o que muda na semana e na demo |

## Três regras que não mudam

1. **O critério do desafio vem primeiro:** uma pergunta real recebe uma resposta correta, em linguagem simples, com a fonte à vista. O Observatório explica; o Registo Canónico e a avaliação provam.
2. **Nada é encenado sem o dizer.** O Observatório desenha eventos reais. O que é simulado (sistemas da Câmara, Chave Móvel Digital, taxas) aparece marcado como «Simulação».
3. **Construído de raiz a partir de 19/10, às 09h30** ([R-01](../20-riscos-e-pressupostos.md)).
