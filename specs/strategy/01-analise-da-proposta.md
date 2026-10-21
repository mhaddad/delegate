# 01 · Análise da proposta da equipa

> Estado: proposta para discussão · Atualizado: 18/10/2026 · [Estratégia](README.md)

## Leitura geral

A proposta acerta no essencial: **a solução é sobretudo arquitetura**, e o júri só a avalia se a vir a funcionar. Por isso, uma interface de bastidores é a melhor decisão da proposta.

Há três riscos de fundo:

1. **Âmbito.** Cinco componentes (bot, bastidores, Porta, Consola, sistemas simulados) mais agentes, Registo Canónico e avaliação, em 5 dias e com até 5 pessoas.
2. **Esquecer o critério do desafio.** O «bom resultado» do desafio 3.4 é uma resposta correta com fonte. A proposta não refere o Registo Canónico nem a avaliação. Sem conteúdo bom, a demo mais bonita mostra um Henriques que erra.
3. **Encenação.** Animações que não correspondem ao que o sistema faz são detetadas por um júri técnico e destroem a nota de viabilidade técnica (25%).

---

## 1. Henriques como bot do Telegram

**Pontos fortes**

- API de bots aberta e gratuita, sem aprovação nem verificação de empresa.
- Suporta tudo o que precisamos: texto, voz, fotografias, **botões inline** e **Mini Apps** (páginas web dentro do Telegram).
- Funciona por *long polling*, sem URL pública: o bot pode correr no portátil se a rede do local falhar.

**Riscos**

| Risco | Mitigação |
|---|---|
| A narrativa e os vídeos dizem «WhatsApp» | Dizer no pitch: «Na demo usamos o Telegram; no piloto, o mesmo Henriques fala por WhatsApp. O canal é um adaptador.» A arquitetura mostra o adaptador de canal |
| O júri não vê o ecrã do telemóvel | O Observatório replica a conversa na faixa «Palco», a partir dos eventos. Basta projetar um ecrã |
| O Telegram não cifra ponta a ponta as conversas com bots | Sem dados reais (ADR-006); aviso no `/start`; o canal é «campainha», o Cofre é que guarda |

**Melhorias**

- **Botões inline** para consentimento e mandato («Guardar no Cofre», «Conceder D3», «Revogar»). Tornam visíveis as decisões da pessoa e são mais fiáveis numa demo do que texto livre.
- **Mini App «Vista segura»** para rever o pacote mínimo e confirmar com Chave Móvel Digital (simulada). Materializa o requisito RF-CON-07: passos sensíveis fora da conversa.
- **Comandos** úteis para a demo: `/dados` («Quem viu os meus dados»), `/cofre`, `/mandatos`, `/pessoa` (falar com uma pessoa).
- **Adaptador de canal:** o núcleo nunca fala diretamente com o Telegram. Assim, um chat web de reserva custa pouco.

Detalhe em [03](03-canal-telegram.md).

---

## 2. Interface web dos bastidores

**Pontos fortes**

- É a peça que transforma uma arquitetura invisível numa demonstração compreensível.
- Liga diretamente aos critérios de inovação e de apresentação.

**Riscos**

| Risco | Mitigação |
|---|---|
| Animações encenadas, desligadas do sistema | **Cada animação nasce de um evento real** do [contrato de eventos](07-contrato-de-eventos.md). O registo de auditoria e o Observatório leem a mesma fonte |
| Eventos rápidos demais para serem lidos (o sistema responde em segundos) | Fila de apresentação: os eventos chegam em tempo real, mas são mostrados a ritmo humano, com legenda. Controlo de velocidade e pausa |
| Demasiada informação no ecrã | Dois modos: **narrativo** para o júri, **técnico** para perguntas. Um só ecrã projetado |
| Falha ao vivo | **Repetição:** cada sessão de eventos fica gravada e pode ser reproduzida; serve também para gravar o vídeo de plano B |

**Melhorias**

- Layout com a **linha de superfície** dos vídeos: em cima a conversa (Palco), em baixo o grafo da arquitetura (Bastidores), à direita Missão, Cofre, Mandatos e Auditoria.
- **Cofre que prova o que promete:** o conteúdo aparece cifrado; só os metadados (finalidade, validade) são legíveis; quando há uma missão autorizada, vê-se a **chave libertada para essa missão, com prazo**, e o evento na auditoria.
- **Botão «Repor demo»** para voltar ao estado inicial antes do pitch.

Detalhe em [04](04-observatorio.md).

---

## 3. Porta Agêntica

**Pontos fortes**

- É o elemento mais original da proposta (inovação, 25%).

**Riscos**

| Risco | Mitigação |
|---|---|
| A Porta ser apenas uma camada interna que ninguém vê | O Henriques usa a Porta **por MCP, através da rede, como qualquer terceiro**. Na demo, um agente externo usa a mesma Porta |
| Agentes chamarem os sistemas simulados diretamente | Os sistemas simulados só são acessíveis através da Porta. Isto demonstra «capacidades limitadas, nunca acesso geral» |

**Melhorias**

- A Porta expõe dois tipos de coisa: o **Registo Canónico** (leitura pública) e as **capacidades** ligadas aos sistemas simulados, sempre com verificação de mandato.
- Cada chamada gera um evento `porta.*`, visível no Observatório.

Detalhe em [05](05-porta-e-sistemas-simulados.md).

---

## 4. Consola da Câmara

**Pontos fortes**

- Mostra o lado da Câmara e a decisão humana, que é um princípio inegociável.
- O painel de intenções responde ao critério de impacto (30%).

**Riscos**

| Risco | Mitigação |
|---|---|
| A Consola parecer um «backoffice» genérico | **Fechar o ciclo ao vivo:** a técnica pede um elemento ou aceita o pedido, e a mensagem chega ao Telegram da Inês segundos depois |
| A Consola ver demais | A Consola mostra casos e pacotes mínimos; **nunca navega no Cofre** nem nos projetos da pessoa. Dizê-lo no pitch |
| O mapa da cidade exigir dados geográficos difíceis de obter | Começar com barras por freguesia; mapa só se houver tempo |

**Melhorias**

- **«Acompanhamento»** de processos com estados e prazos, sem dados pessoais.
- **Painel de fricção ao vivo:** perguntas por tema e abstenções. Cada abstenção vira uma tarefa de curadoria.
- O **Mapa de Intenções** cresce em +1 quando a Inês consente guardar a intenção da esplanada, sobre uma base sintética marcada.

Detalhe em [06](06-consola-e-mapa.md).

---

## 5. Sistemas simulados da Câmara

**Pontos fortes**

- Tornam palpável a integração por capacidades e mostram que o Delegate não substitui sistemas: orquestra-os.

**Riscos**

| Risco | Mitigação |
|---|---|
| Sugerir que a Câmara tem APIs que não sabemos se existem | Marcados «Sistema simulado», com dados fictícios. No pitch: «Isto mostra como se integra; as interfaces reais confirmam-se no piloto» |
| Taxas simuladas confundidas com reais | Valores marcados «fictício (Simulação)» |
| Dois sistemas sem papéis claros | Escolher sistemas que **a mesma missão atravessa** |

**Recomendação**

| Sistema simulado | Papel na demo | Prioridade |
|---|---|---|
| **Serviços Urbanos · Ocupação do Espaço Público** | Recebe a comunicação prévia da esplanada, gera o número de processo, muda de estado quando a técnica decide, pede elementos | M |
| **Tesouraria · Referências de pagamento** | Emite a referência Multibanco fictícia depois da aceitação, com o valor calculado pelo sistema de origem | S |
| Agenda municipal (eventos da Assembleia) | Publica a votação da revisão do PDM que dispara o alerta proativo | C (substituível por um botão na Consola) |

A Tesouraria pode ter um **«sabor legado»** diferente (por exemplo, XML e chave de API) para mostrar que a Porta normaliza sistemas heterogéneos. Isto é opcional.

Detalhe em [05](05-porta-e-sistemas-simulados.md).

---

## 6. O que faltava na proposta

| Falta | Porquê importa | Onde |
|---|---|---|
| Registo Canónico e conjunto de avaliação | São o critério do desafio e a prova de viabilidade | [Anexo A](../anexos/A-catalogo-servicos-prototipo.md), [Anexo B](../anexos/B-conjunto-de-avaliacao.md) |
| Contrato de eventos | Liga Telegram, Porta, sistemas, Consola e Observatório sem acoplamento; é também a auditoria | [07](07-contrato-de-eventos.md) |
| Orquestração determinística | Agentes autónomos em ciclo são lentos e imprevisíveis numa demo. Uma máquina de estados com o modelo de IA em passos delimitados é rápida, fiável e legível | [02](02-arquitetura-da-demo.md) |
| Esqueleto de ponta a ponta no dia 1 | Evita cinco componentes bonitos que não se ligam a 22/10 | [08](08-plano-de-execucao.md) |
| Coreografia da demo | Com quatro ecrãs possíveis, sem guião a demo perde-se | [09](09-roteiro-da-demo.md) |
| Momento do júri | Deixar o júri fazer uma pergunta real é a prova mais forte do «bom resultado» | [09](09-roteiro-da-demo.md) |
