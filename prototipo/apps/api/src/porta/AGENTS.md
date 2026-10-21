# AGENTS.md — Porta Agêntica

**Dona: pessoa B (Infra).** A Porta e os sistemas simulados que estão atrás dela. Parte de [`../../../../AGENTS.md`](../../../../AGENTS.md).

> **Stack:** TypeScript, com o SDK **v2** do MCP — `@modelcontextprotocol/server`, nunca `@modelcontextprotocol/sdk`, que é a linha congelada. Ver [ADR-020](../../../../specs/21-registo-de-decisoes.md#adr-020) e [specs/24](../../../../specs/24-processos-canonicos-e-integracao.md). O contrato de capacidades e os esquemas abertos, abaixo, governam a integração.

---

## A ideia

> **O Afonso é cliente da Porta, não dono dela.**
> **Inversão de integração:** O Delegate detém a orquestração e os processos canónicos; a Câmara ou os seus fornecedores de software implementam os contratos abertos da Porta (MCP + REST).

A infraestrutura serve qualquer agente municipal ou terceiro autorizado. O Afonso comunica por protocolo de rede padronizado. Os Serviços Urbanos simulados em `src/su/` servem como **implementação de referência** do contrato municipal.

## Congelado

**Os sistemas simulados só se alcançam pela Porta.** Nenhum agente tem credenciais diretas dos Serviços Urbanos ou da Tesouraria. Se uma rota contornar a Porta, está errada.

**Toda a capacidade tem dono, finalidade, mandato mínimo, efeito e recibo.** Uma capacidade sem mandato declarado não entra.

**Ação sem mandato devolve `MANDATO_EM_FALTA`; ação sem confirmação devolve `CONFIRMACAO_EM_FALTA`.** São as garantias que provam que a Porta protege os atos municipais.

**O Registo Canónico é lido de `registo/` e responde sempre com a versão.** A Porta não inventa conteúdo nem completa registos incompletos.

**Cada chamada gera eventos `porta.*`** — o Observatório audita em tempo real o que entrou na Porta, com o nome da ferramenta e selo.

## Capacidades

| Ferramenta | Tipo | Mandato mínimo |
|---|---|---|
| `procurar_servicos` | leitura | — |
| `obter_servico` | leitura | — |
| `criar_rascunho_ocupacao` | ação | D2 |
| `submeter_comunicacao_previa` | ação | D3 + confirmação |
| `consultar_estado_processo` | leitura | D1 |
| `responder_pedido_elementos` | ação | D3 |
| `obter_referencia_pagamento` | ação | D2 |

## Sistemas simulados

**Serviços Urbanos** é a fonte do ato: o processo e a decisão vivem aqui, não no Delegate. Estados: rascunho, submetido, em apreciação, pedido de elementos, aceite, rejeitado. Regra que a demonstração mostra: corredor de peões de pelo menos 2,00 m.

**Tesouraria** emite referências fictícias. Não há pagamentos — o pagamento fica fora do canal.

## Dados fictícios — regras obrigatórias

| Dado | Regra |
|---|---|
| Moradas | Fictícias ou genéricas |
| Números de processo | Formato plausível, sempre com marca de simulação |
| Taxas | Fictícias, sempre com `valor_ficticio` |
| Freguesias | Nomes reais são permitidos para agregação; contagens sintéticas marcadas |
| Terrenos e PDM | **Nunca** classificação de solo de parcelas reais |

Cada resposta da Porta que venha de um sistema simulado leva `simulacao: true`.

## Livre

- A implementação por trás de cada capacidade.
- O formato dos argumentos, desde que o esquema seja claro e validado.
- A ordem de arranque dos adaptadores.

## Como se prova que está feito

- O núcleo chama a Porta pela rede e recebe o registo com fontes e versão.
- Um cliente externo recebe `MANDATO_EM_FALTA` numa ação sem mandato.
- Todas as chamadas aparecem no fluxo de eventos com origem `porta`.
- Um processo simulado criado pela Porta aparece na fila da Consola.