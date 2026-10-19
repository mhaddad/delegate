# AGENTS.md — núcleo

**Dona: pessoa A (Afonso).** Canal, Afonso, orquestrador, política, Cofre e mandatos. Parte de [`../../../../AGENTS.md`](../../../../AGENTS.md).

> **Stack:** TypeScript; `grammY` em *long polling* para o canal; cifra simétrica com serviço de chaves. O modelo de IA está por decidir ([ADR-023](../../../../../docs/21-registo-de-decisoes.md#adr-023)). O que está abaixo é arquitectura e não muda com isso.

---

## O que vive aqui

| Módulo | Responsabilidade |
|---|---|
| `canal/` | Adaptador do canal. Traduz mensagens e botões em eventos, e eventos em mensagens. |
| `afonso/` | Classificação, redação e verificação. O que responde à pessoa. |
| `orquestrador/` | Máquina de estados da missão. |
| `politica/` | Permite, confirmar ou bloquear, por regras declarativas. |
| `cofre/` | Cifra por pessoa e serviço de chaves. |
| `mandatos/` | Níveis D0 a D4, concessão e revogação. |
| `eventos/` | Barramento, registo e fluxo de eventos. |

## Congelado

**O modelo de IA redacta; não decide.** Três passos usam IA — classificar, redigir, verificar — e nada mais. Os outros cinco são código determinístico. Se um passo precisar de mais IA do que isso, é sinal de que a arquitetura está a ser contornada.

**O verificador é uma regra, não um pedido ao modelo.** A resposta é montada a partir dos excertos do registo; qualquer número que não apareça literalmente num excerto é rejeitado e provoca abstenção. É assim que MET-Q3 — zero valores inventados — passa a ser garantido pelo código.

**O roteamento é determinístico primeiro.** A classificação é por correspondência de termos distintivos contra o título e a secção de cada registo, com limiar de força e porta de ambiguidade. O modelo só entra se essa correspondência for fraca ou ambígua — e o caminho sem modelo tem de funcionar, porque é o que garante que o Afonso responde mesmo quando a chave falha ou a rede está mau.

**O Cofre é cifrado e a chave só sai por missão.** Conteúdo cifrado por pessoa; o serviço de chaves só liberta com mandato válido e missão ativa, e por prazo. Todo o ciclo emite eventos, e conteúdo cifrado nunca aparece num deles.

**O Afonso só escreve sem ser chamado em três casos:** resposta da Câmara a uma missão, alerta autorizado, ou pedido de elemento. Cada mensagem diz porquê.

## Livre

- Como o roteamento classifica, dentro dos dois caminhos (determinístico e modelo).
- A redação, desde que os excertos sejam a única entrada e o verificador passe.
- Os textos das mensagens, dentro do tom definido nas especificações.

## Proibido

- Inventar valores. Sem fonte, abstenção.
- Falar de classificação do solo de parcelas reais, ou de decisões com efeito jurídico.
- Guardar algo no Cofre sem botão da pessoa.
- Executar uma ação sem mandato válido.

## Como se prova que está feito

- Responder a uma pergunta do catálogo leva menos de 8 segundos e mostra fonte com data.
- Perguntar o valor da esplanada devolve abstenção com onde confirmar, e não um número.
- O fio completo das 12h30 passa: mensagem no canal → eventos no Observatório → resposta com fonte.
- Os testes passam, incluindo o de zero valores inventados.