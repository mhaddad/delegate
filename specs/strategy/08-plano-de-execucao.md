# 08 · Plano de execução

> Estado: proposta para discussão · Atualizado: 18/10/2026 · [Estratégia](README.md)
> Substitui o plano dia a dia de [19 · Plano do hackathon](../19-plano-do-hackathon.md#5-plano-dia-a-dia). Mantêm-se as regras de ouro, a checklist de submissão e a mentoria desse documento.

## 1. Estratégia de construção: esqueleto primeiro

**No fim do dia 1, uma mensagem no Telegram tem de atravessar todos os componentes**, mesmo com respostas fixas e ecrãs feios:

```text
Telegram → núcleo → evento → Porta (procurar_servicos) → evento → resposta fixa com fonte
       → Observatório mostra a lista de eventos → um caso fictício aparece na Consola
```

A partir daí, cada dia engrossa o fio sem o partir. O risco maior desta proposta é ter cinco componentes bonitos que só se ligam na quinta-feira.

## 2. Frentes de trabalho

| Frente | Âmbito | Pessoa |
|---|---|---|
| **F1 · Afonso e orquestração** | Classificação, redator, verificador, abstenção, máquina de estados da missão, motor de política | [nome] |
| **F2 · Canal, Cofre e Mandatos** | Bot Telegram, botões, comandos, Mini App, Cofre (cifra e serviço de chaves), mandatos | [nome] |
| **F3 · Porta, sistemas e eventos** | Monorepositório, contrato de eventos, base de dados, SSE, servidor MCP, sistemas simulados, auditoria, alojamento | [nome] |
| **F4 · Observatório e Consola** | Interface web: Observatório, Consola, Mapa de Intenções, página da Porta | [nome] |
| **F5 · Conteúdo, avaliação e pitch** | Registo Canónico, conjunto de avaliação, legendas, textos do Afonso, ligação ao mentor, submissão, pitch | [nome] |

**Com 4 pessoas:** F2 divide-se entre F1 (mandatos) e F3 (bot e Cofre). **Com 3 pessoas:** F1+F2, F3+F4 (Consola simplificada), F5.

F4 é a frente mais carregada. A partir do dia 3, F2 ajuda na Consola.

## 3. Pontos de integração

| Hora | Ritual |
|---|---|
| 09h45 | Alinhamento (15 min) |
| **12h30** | **Fio completo:** alguém envia a mensagem de teste no Telegram e todos veem o resultado |
| **17h00** | **Fio completo + demo interna** do que entrou nesse dia |

Regra: nada se integra depois das 17h00 sem passar no fio completo.

## 4. Plano dia a dia

### Segunda, 19/10 · Esqueleto de ponta a ponta

| Frente | Entregas |
|---|---|
| Todos | 09h30 arranque; confirmar desafio 3.4; projeto na TAIKAI; conversa com o mentor |
| F3 | Monorepositório; **contrato de eventos v1 até às 12h00**; Postgres; SSE; servidor MCP com `procurar_servicos` sobre 3 serviços; Serviços Urbanos simulado com `POST /processos` |
| F2 | Bot com `/start` e eco; adaptador de canal a emitir `canal.*` |
| F1 | Classificação de intenção ligada ao modelo; chamada MCP à Porta; resposta fixa com fonte |
| F4 | Observatório v0: lista de eventos ao vivo; Consola v0: lista de casos |
| F5 | 5 serviços M no Registo Canónico; legendas v0; perguntas para o mentor |

**Pronto às 17h00:** fio completo a funcionar, alojado.

### Terça, 20/10 · Responder com fonte e ver por dentro

| Frente | Entregas |
|---|---|
| F1 | Redator só com excertos; verificador (citações e números); abstenção; encaminhamento fora de competência |
| F2 | Cofre com cifra e serviço de chaves; botões «Guardar» e «Conceder mandato»; `/cofre`, `/mandatos` |
| F3 | `obter_servico`, `criar_rascunho_ocupacao`; estados do processo simulado; auditoria com encadeamento por hash |
| F4 | Observatório v1: Palco, grafo, legendas, painéis Missão e Cofre; fila com ritmo |
| F5 | 12 serviços; conjunto de avaliação v1 (≥ 30) e executor; primeira execução |

**Pronto às 17h00:** HU-01 cumprida no Telegram, com o Observatório a animar.

### Quarta, 21/10 · Missão e ciclo com a Câmara

| Frente | Entregas |
|---|---|
| F1 | Máquina de estados da missão; política (permitir, confirmar, bloquear); resumo e proposta para a Consola |
| F2 | Mini App (pacote mínimo, mandato, confirmação CMD simulada, token); `/dados`; ajuda F4 na Consola à tarde |
| F3 | `submeter_comunicacao_previa`, `responder_pedido_elementos`, `consultar_estado_processo`; Tesouraria simulada e `obter_referencia_pagamento` |
| F4 | Consola: fila, detalhe, decisão; ciclo Consola → Telegram; painel Mandatos e Auditoria |
| F5 | Conjunto v2 (≥ 42, com adversariais); correções de conteúdo; textos finais do Afonso |

**Pronto às 17h00:** J1 completa, com pedido de elemento e aceitação a voltarem ao Telegram.

### Quinta, 22/10 · Cidade, polimento e congelamento

| Frente | Entregas |
|---|---|
| F1 | Correções guiadas pela avaliação; alerta do PDM |
| F2 | Persona `visitante` e código QR para o momento do júri; limites |
| F3 | Repetição de sessões; «Repor demo»; agente externo MCP configurado; plano B local |
| F4 | Mapa de Intenções (barras) com +1 ao vivo; painel Procura e fricção; acabamentos visuais |
| F5 | Ensaio da coreografia ×2 ([09](09-roteiro-da-demo.md)); teste com 2–3 pessoas de fora |
| Todos | **18h00 congelamento** e execução de avaliação (números do pitch) |

### Sexta, 23/10 · Estabilizar e submeter

| Hora | Atividade |
|---|---|
| 09h30 | Só correções |
| 11h00 | Gravar a demo completa (ao vivo + repetição) para o vídeo de plano B |
| 13h00 | Execução final da avaliação |
| **15h00** | **Submissão na TAIKAI** |
| Tarde | Ensaio do pitch; README do repositório; créditos |

### 24 a 26/10 · Pitch

Ensaios cronometrados a 24 e 25/10 (a hora muda a 25/10). Pitch a 26/10, às 14h30, presencial.

## 5. Ordem de corte

Se faltar tempo, cortar por esta ordem (do primeiro ao último):

1. Agenda municipal simulada → botão «Simular evento» na Consola
2. «Sabor legado» XML da Tesouraria
3. Ecrã de sistema legado
4. Mapa geográfico → ficar pelas barras
5. Mensagens de voz
6. Modo técnico completo do Observatório
7. Tesouraria (a aceitação termina sem referência)
8. Mini App → botões inline
9. Repetição de sessões → ficar pelo vídeo gravado

**Nunca cortar:**

- respostas com fonte e avaliação;
- Telegram → Observatório ao vivo;
- Afonso como cliente MCP da Porta;
- ciclo de decisão Consola → Telegram;
- etiquetas «Simulação».

## 6. Definição de pronto

Uma funcionalidade só está pronta quando:

- [ ] cumpre os critérios de aceitação da história ([08 · Histórias](../08-historias-de-utilizador.md));
- [ ] **emite os eventos do contrato e aparece no Observatório**;
- [ ] funciona na versão alojada e na versão local;
- [ ] passa no fio completo das 17h00;
- [ ] não provoca regressões na avaliação;
- [ ] mostra «Simulação» onde se aplica.
