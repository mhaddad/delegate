# 09 · Roteiro da demo

> Estado: proposta para discussão · Atualizado: 18/10/2026 · [Estratégia](README.md)
> Substitui a secção 2 de [Anexo C · Guião da demonstração](../anexos/C-guiao-da-demonstracao.md). A estrutura do pitch desse anexo mantém-se.
> **Para o pitch de 26/10 (4 + 1 minutos), manda o [Anexo C](../anexos/C-guiao-da-demonstracao.md), revisto a 22/10:** a demo passa a ser feita por um membro do júri no Telegram, com o Painel ao vivo projetado. As secções 5 e 6 deste documento continuam a valer como montagem técnica.

## 1. Montagem

| Elemento | Quem | Onde |
|---|---|---|
| **Observatório** (ecrã projetado durante toda a demo) | Portátil A | Projetor |
| **Telegram da Inês** | Apresentador 1 («Inês») | Telemóvel na mão; a conversa aparece no Palco do Observatório |
| **Consola** | Apresentador 2 («Marta, técnica») | Tablet ou portátil B, não projetado |
| **Agente externo MCP** | Apresentador 1 | Portátil A, separador próprio |

**Um só ecrã projetado.** O júri acompanha tudo no Observatório: a conversa no Palco, os bastidores no grafo e a decisão da Consola a chegar.

Dois membros da equipa fazem de Inês e de Marta. Isto torna visível que há duas pessoas e uma decisão humana.

## 2. Versão de 2 minutos (núcleo)

| Tempo | Ação | O júri vê no Observatório | O que se diz |
|---|---|---|---|
| 0:00 | Inês: «Quero pôr uma esplanada à porta do meu restaurante, o que preciso?» | Bolha no Palco; Entendimento acende; Porta consultada; Verificador ✓; cartão de fonte | «Uma pergunta real. Resposta simples, com a fonte oficial e a data.» |
| 0:25 | Inês: «Quanto vou pagar?» | Verificador a terracota: «Sem fonte, não inventa» | «Quando não há fonte, o Henriques diz que não sabe.» |
| 0:40 | Inês: «Trate disso.» → `Guardar no Cofre` → `Conceder D3` | Missão criada; item cifrado no Cofre; mandato carimbado | «A Inês decide o que se guarda e quanto delega. Nem nós lemos o Cofre.» |
| 1:00 | Mini App: aprova pacote mínimo, confirma CMD (Simulação) | Chave libertada 10 min; política «permitir»; Porta → Serviços Urbanos; processo OEP/2026/0001 | «Só sai o mínimo, só para esta missão. O processo nasce no sistema da Câmara.» |
| 1:25 | Marta, na Consola: «Aceitar» | Impulso Consola → Serviços Urbanos → Tesouraria → Henriques → Palco | «A decisão é humana. A Inês recebe a resposta no telemóvel.» |
| 1:45 | — | Mapa de Intenções +1; cadeia de auditoria | «A Câmara passa a ver o que a cidade quer fazer. E tudo fica auditado.» |

## 3. Versão de 4 minutos (completa)

Acrescenta à versão de 2 minutos:

| Momento | Ação | Mensagem |
|---|---|---|
| Antes da aceitação | Marta: «Pedir elemento: largura da fachada» → Inês recebe e responde «8 metros» → caso volta à fila | «O pedido chega completo; quando falta algo, o ciclo fecha-se em segundos.» |
| Depois da aceitação | Inês: `/dados` | «A Inês vê quem acedeu aos dados e para quê.» |
| Porta | Agente externo: «Que preciso para pôr uma esplanada em Guimarães? Usa a Porta da Câmara.» → nó «Agente externo» acende | «O Henriques é o primeiro cliente da Porta, não o único. O assistente da Câmara também a pode usar.» |
| Proatividade | Marta: «Simular evento: votação da revisão do PDM» → alerta no Telegram | «Avisos só sobre o que a Inês autorizou.» |
| Avaliação | Painel com os números da execução de congelamento | «Medimos: {MET-Q1} procedimento certo, 100% com fonte, zero valores inventados.» |

## 4. Momento do júri

No fim da demo ou nas perguntas:

> «Querem experimentar? Leiam este código e façam ao Henriques uma pergunta real sobre um serviço da Câmara.»

- Código QR → `/start visitante` (D0, só informação, limite de 10 mensagens).
- A pergunta aparece ao vivo no Observatório.
- Se o serviço não estiver no catálogo, o Henriques abstém-se e diz onde confirmar. **Também é uma boa resposta**: dizê-lo.

Fazer só se a avaliação de congelamento cumprir as metas. Decisão a 22/10 às 18h00.

## 5. Checklist antes de subir ao palco

- [ ] «Repor demo» executado; sessão nova criada
- [ ] Observatório em modo narrativo, velocidade 1×, em ecrã inteiro
- [ ] Telegram da Inês com a persona `ines-demo`; notificações de outras apps silenciadas
- [ ] Consola aberta na fila, utilizador «Técnica · Serviços Urbanos»
- [ ] Agente externo MCP aberto e testado
- [ ] Rede do local testada; hotspot pronto; versão local a correr em paralelo
- [ ] Vídeo de plano B no ambiente de trabalho
- [ ] Carregadores e adaptador de vídeo

## 6. Planos B

| Nível | Situação | Ação |
|---|---|---|
| A | Tudo a funcionar | Demo ao vivo, alojada |
| B | Rede do local falha | Núcleo, Porta e web em local no portátil A; bot por *long polling* via hotspot |
| C | Fornecedor de IA falha | **Repetição** da sessão gravada no Observatório, anunciada: «Esta é a gravação de ontem; o sistema está em baixo por…» |
| D | Portátil ou projetor falha | Vídeo gravado a 23/10 no computador da organização |

Nunca apresentar uma repetição como se fosse ao vivo.
