# 10 · Riscos, decisões e impacto nas especificações

> Estado: proposta para discussão · Atualizado: 18/10/2026 · [Estratégia](README.md)

## 1. Novos riscos

Complementam [20 · Riscos](../20-riscos-e-pressupostos.md). P = probabilidade, I = impacto (1 a 3).

| ID | Risco | P | I | Mitigação | Frente |
|---|---|---:|---:|---|---|
| R-30 | Cinco componentes que não se ligam a tempo | 3 | 3 | Esqueleto de ponta a ponta no dia 1; fio completo às 12h30 e 17h00 | Todos |
| R-31 | O Telegram contraria a narrativa «WhatsApp-first» | 2 | 1 | Adaptador de canal; frase no pitch; o diagrama mostra o adaptador | F5 |
| R-32 | Animações percebidas como encenação | 2 | 3 | Observatório só desenha eventos reais; modo técnico mostra o JSON | F4 |
| R-33 | Latência alta com vários passos de IA | 2 | 2 | Máquina de estados; IA só em 3 passos; modelo menor na classificação; «a escrever…» | F1 |
| R-34 | Mini App mais complexa do que o previsto | 2 | 1 | Botões inline como alternativa | F2 |
| R-35 | Rede do local instável | 2 | 3 | *Long polling*; versão local completa; hotspot | F3 |
| R-36 | Pergunta do júri fora do catálogo ou provocadora | 2 | 2 | Persona `visitante` D0; abstenção; decidir a 22/10 com base na avaliação | F5 |
| R-37 | Taxas e processos simulados tomados como reais | 2 | 2 | Etiqueta «Simulação» em todos os ecrãs e mensagens | Todos |
| R-38 | Sistemas simulados sugerirem APIs da Câmara que não sabemos se existem | 2 | 2 | Frase explícita no pitch; ficha «Integrações a confirmar no piloto» | F5 |
| R-39 | Sobrecarga da frente de interface (Observatório + Consola) | 3 | 2 | F2 ajuda a partir do dia 3; componentes partilhados; ordem de corte | F4 |
| R-40 | Esquecer o critério do desafio por causa do espetáculo | 2 | 3 | HU-01 e avaliação são «nunca cortar»; F5 dedicada ao conteúdo | F5 |

## 2. Decisões propostas

Continuam a numeração de [21 · Registo de decisões](../21-registo-de-decisoes.md).

<a id="adr-013"></a>
### ADR-013 · Telegram como canal da demo

- **Contexto:** o WhatsApp Business exige verificação e aprovação; a equipa propõe o Telegram.
- **Decisão:** o Henriques fala por Telegram em R0, através de um adaptador de canal. Substitui o [ADR-007](../21-registo-de-decisoes.md#adr-007).
- **Consequências:** botões inline e Mini App disponíveis; no pitch, «no piloto, WhatsApp»; o chat web passa a reserva.

<a id="adr-014"></a>
### ADR-014 · Observatório orientado a eventos reais

- **Contexto:** a solução é sobretudo arquitetura e tem de ser compreendida pelo júri.
- **Decisão:** uma interface de bastidores que só desenha eventos reais, com modo narrativo, modo técnico, ritmo humano, repetição e reposição.
- **Consequências:** o contrato de eventos torna-se a espinha dorsal.

<a id="adr-015"></a>
### ADR-015 · O registo de eventos é a auditoria

- **Contexto:** precisamos de auditoria e de alimentar o Observatório e a Consola.
- **Decisão:** um único registo de eventos, só de acréscimo e encadeado por hash, serve auditoria, Observatório, Consola e repetição.
- **Consequências:** regras de privacidade nos eventos ([07](07-contrato-de-eventos.md#5-regras)).

<a id="adr-016"></a>
### ADR-016 · Três implementáveis

- **Contexto:** equilibrar fiabilidade da demo e uma fronteira de rede real.
- **Decisão:** `núcleo`, `porta` (com os sistemas simulados) e `web`.
- **Consequências:** o Henriques é cliente MCP da Porta através da rede.

<a id="adr-017"></a>
### ADR-017 · Sistemas simulados só atrás da Porta

- **Contexto:** demonstrar integração por capacidades, não por acesso geral.
- **Decisão:** dois sistemas simulados (Serviços Urbanos e Tesouraria), acessíveis só pela Porta (agentes) e pela Consola (técnicos).
- **Consequências:** etiquetas «Simulação»; dados fictícios.

<a id="adr-018"></a>
### ADR-018 · Orquestração determinística

- **Contexto:** agentes autónomos em ciclo são lentos e imprevisíveis numa demo.
- **Decisão:** máquina de estados explícita; o modelo de IA só em passos delimitados (classificar, redigir, verificar).
- **Consequências:** cada passo é um «agente» no Observatório e um evento no registo.

<a id="adr-019"></a>
### ADR-019 · Cofre com serviço de chaves e libertação por missão

- **Contexto:** mostrar que o operador não lê o Cofre, mas que o Henriques consegue cumprir a missão.
- **Decisão:** conteúdo cifrado por pessoa; um serviço de chaves liberta a chave só com mandato válido e missão ativa, por prazo, com evento de auditoria.
- **Consequências:** em R0 o serviço de chaves é interno (simplificação declarada); em R1 a chave fica do lado da pessoa.

## 3. Impacto nas especificações

Alterações a propagar quando a equipa aprovar esta estratégia:

| Documento | Alteração |
|---|---|
| [06 · Âmbito](../06-ambito-e-releases.md) | MoSCoW: Telegram em vez de chat web (M); Observatório (M); sistemas simulados (Serviços Urbanos M, Tesouraria S); Mini App (S) |
| [07 · Requisitos funcionais](../07-requisitos-funcionais.md) | Novos módulos `OBS` (Observatório) e `SIM` (sistemas simulados); RF-CON-01 passa a Telegram; RF-CON-07 entra em R0 via Mini App; RF-POR-03 passa a M |
| [08 · Histórias](../08-historias-de-utilizador.md) | Novas histórias: Observatório ao vivo, ciclo Consola → Telegram, momento do júri, repetição |
| [10 · Arquitetura](../10-arquitetura.md) | Arquitetura do protótipo passa a ser a de [02](02-arquitetura-da-demo.md) |
| [11 · Modelo de dados](../11-modelo-de-dados.md) | Acrescentar o envelope de eventos e o processo simulado |
| [13 · Porta](../13-porta-agentica-api.md) | Novas ferramentas: `submeter_comunicacao_previa`, `responder_pedido_elementos`, `obter_referencia_pagamento`; erro `CONFIRMACAO_EM_FALTA` |
| [15 · UX](../15-ux-conteudo-e-tom.md) | Vistas: Telegram, Observatório, Consola, Mini App, página da Porta |
| [19 · Plano](../19-plano-do-hackathon.md) | Plano dia a dia substituído por [08](08-plano-de-execucao.md); papéis passam às frentes F1–F5 |
| [21 · Decisões](../21-registo-de-decisoes.md) | ADR-007 marcado «Substituída»; acrescentar ADR-013 a ADR-019 |
| [Anexo C](../anexos/C-guiao-da-demonstracao.md) | Demo substituída por [09](09-roteiro-da-demo.md) |
