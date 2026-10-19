# 03 · Canal Telegram

> Estado: proposta para discussão · Atualizado: 18/10/2026 · [Estratégia](README.md)

## 1. Papel do canal

O Telegram é o **canal de demonstração**. A arquitetura trata-o como um adaptador: no piloto, o mesmo núcleo fala por WhatsApp, portal ou SMS. O canal é a campainha; o Cofre e a missão vivem no núcleo.

## 2. Identidade na demo

| Situação | Como funciona |
|---|---|
| Apresentador (Inês) | O telemóvel do apresentador fica associado à persona «Inês» com `/start ines-demo` (ligação profunda). Dados fictícios pré-carregados |
| Júri (momento do júri) | Código QR com `/start visitante`. Persona anónima, nível D0 (só informação), sem Cofre, com limite de mensagens |
| Equipa (testes) | Personas `rita-demo` e `albano-demo` para as outras jornadas |

Nenhum dado real. A primeira mensagem diz-o.

## 3. Comandos

| Comando | Faz |
|---|---|
| `/start` | Apresentação: «Sou o Afonso, um assistente de inteligência artificial que trabalha para si…»; ligação para a Carta de Lealdade; aviso de demonstração |
| `/cofre` | Lista os itens do Cofre (título, finalidade, validade) com botão «Apagar» |
| `/mandatos` | Lista os mandatos ativos com botão «Revogar» |
| `/missoes` | Lista as missões e os seus estados |
| `/dados` | «Quem viu os meus dados»: acessos às missões (quem, quando, para quê) |
| `/pessoa` | Pede um atendimento humano; cria um caso na Consola |
| `/carta` | Mostra a Carta de Lealdade |

## 4. Botões inline (decisões da pessoa)

| Momento | Botões | Evento |
|---|---|---|
| Sugestão de guardar | `Guardar no Cofre` · `Agora não` | `cofre.item.guardado` / `cofre.item.recusado` |
| Pedido de mandato | `Ver mandato` · `Conceder D3` · `Só preparar (D2)` · `Recusar` | `mandato.concedido` / `mandato.recusado` |
| Rascunho pronto | `Rever e confirmar` (abre a Mini App) | `missao.estado.alterado` |
| Alerta proativo | `Ver fonte` · `Desligar este alerta` | `proatividade.alerta.desligado` |
| Qualquer resposta | `Falar com uma pessoa` | `consola.caso.criado` |

Os botões tornam as decisões visíveis e evitam ambiguidade de texto livre durante a demo.

## 5. Mini App «Vista segura»

Página web aberta dentro do Telegram, para os passos sensíveis (RF-CON-07):

1. **Pacote mínimo:** o que sai do Cofre, para quem, para quê e até quando, e o que **não** sai.
2. **Mandato:** cartão com âmbito, entidade, nível, validade e «Revogar».
3. **Confirmação:** botão «Confirmar com Chave Móvel Digital», com a etiqueta **Simulação**.

Se a Mini App falhar, os mesmos passos fazem-se com botões inline (ordem de corte em [08](08-plano-de-execucao.md)).

## 6. Formato das mensagens

- HTML do Telegram: negrito para a resposta curta, lista numerada para os passos.
- A fonte numa linha própria: `📄 Fonte: <a href="…">Regulamento de Ocupação do Espaço Público, art. 8.º</a> · consultado em 20/10/2026`.
- Mensagens até cerca de 900 caracteres; o resto vai para «Ver detalhe».
- Formato completo em [15](../15-ux-conteudo-e-tom.md#formato).

## 7. Tipos de entrada

| Entrada | R0 | Tratamento |
|---|---|---|
| Texto | M | Fluxo normal |
| Fotografia | M (fotografia do passeio) | Cofre, com consentimento; nunca enviada ao modelo de IA sem necessidade |
| Mensagem de voz | C | Transcrição → texto; transcrição visível na conversa |
| Localização | C | Só se a ficha do serviço a pedir |

## 8. Mensagens iniciadas pelo Afonso

O Afonso só escreve sem ser chamado em três casos: resposta da Câmara a uma missão, alerta autorizado, ou pedido de elemento. Cada mensagem diz porquê («Recebe este aviso porque o autorizou em 21/10»).

## 9. Limites e cuidados

| Tema | Cuidado |
|---|---|
| Rede no local | *Long polling* a partir do portátil como plano B; hotspot do telemóvel |
| Limites do Telegram | Poucas mensagens por segundo; agrupar mensagens; não enviar rajadas |
| Latência | Ação «a escrever…» enquanto o núcleo processa; meta p95 ≤ 8 s |
| Momento do júri | Persona `visitante` com limite de 10 mensagens e só D0; respostas fora do catálogo levam à abstenção |
| Privacidade | Sem cifra ponta a ponta com bots: sem dados reais |
