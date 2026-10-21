# Canal Telegram — guia de quem vai implementar isto

O Telegram é a parte do protótipo onde a equipa tem menos prática. Este guia existe para que ninguém aprenda no palco. Regra geral: **prefere sempre a biblioteca a descobrir a API à mão.**

Decisões e Adverse estão em [ADR-021](../../../../../docs/21-registo-de-decisoes.md#adr-021).

---

## Antes de começar: o token

1. No Telegram, abre **@BotFather** e manda `/newbot`.
2. **Nome** — o que a pessoa vê. Ex.: `Henriques Câmara`.
3. **Username** — obrigatório, 5 a 32 caracteres, tem de terminar em `bot`, e **não pode mudar depois**. Ex.: `afonso_cm_bot`.
4. Guarda o token num ficheiro `.env`, nunca no código. `.env` está ignorado pelo git.

Testa em cinco segundos, sem escrever código:

```bash
curl "https://api.telegram.org/bot<TOKEN>/getMe"
```

Se responder `{"ok":true,…}` o token está bom. Se não, não progridas.

---

## As sete coisas que o Telegram não te diz

Cada uma destas, esquecida, **não dá erro de compilação** — dá uma anomalia durante a demonstração. A biblioteca trata de todas; é por isso que se usa a biblioteca.

| Coisa | O que acontece se te esqueceres |
|---|---|
| O `offset` só avança **depois** de processar | Sem `offset`, recebes as mesmas mensagens em loop. Com `offset` adiantado, perdes mensagens para sempre se o processo morrer. |
| `409 Conflict` — dois processos com o mesmo token | A demonstração fica muda. **Causa nº1**: o `watch` do desenvolvimento reinicia e o processo antigo não morre a tempo. Resolve-se com um `pkill` antes de arrancar. |
| `429 Too Many Requests` | A mensagem não sai. Resolve-se com espera automática e um limite de 30 s, para nunca congelar o bot a meio do pitch. |
| `timeout` do socket tem de ser maior que o do *polling* | Abortas pedidos legítimos. |
| `drop_pending_updates` no arranque | O portátil acorda de um sono longo e despeja 100 mensagens antigas de uma vez, todas com resposta. O júri vê cinquenta respostas velha a aparecerem. |
| **`bot.catch()` é obrigatório** | Sem ele, o primeiro erro mata o bot. A biblioteca avisa disto na documentação. |
| **Nunca `run()`, só `bot.start()`** | A versão concorrente pode confirmar o `offset` antes de o teu código acabar de processar, e perde até 100 mensagens. |

---

## Duas regras de formato

**HTML, não Markdown.** O MarkdownV2 obriga a escapar `.` e `-`, e em português um ponto final em cada frase. Um ponto esquecido rejeita a mensagem inteira com `Bad Request`. Em HTML, acentos, `«»`, `—`, `º` e `€` passam todos.

**Escapar sempre o texto.** Com `parse_mode: "HTML"`, um `>` que não esteja escapado rejeita a mensagem. Como o bot interpola texto do cidadão, isso mata mensagens.

---

## As «caixinhas» — os momentos de decisão

Regras de desenho, derivadas do que o Telegram recomenda e das guias de usabilidade para serviços públicos:

1. **Duas opções por ecrã, três no máximo.** Mais do que isso deixa de ser uma decisão e passa a um exame.
2. **Cada botão é um verbo concreto, não um tema.** «Guardar no cofre», não «Cofre». Duas a quatro palavras, o verbo à frente.
3. **Um emoji, no máximo, sempre seguido de palavra.** Para baixa literacia, um ícone sem texto é ruído.
4. **A opção recomendada é a primeira e verde.** A acção destrutiva é a última e a vermelho.
5. **Perguntar o que o acto faz, nunca o que a pessoa escolheu.** «Vou enviar o pedido à Câmara. 45 €, em 15 dias. Confirmar?» — a pessoa precisa de saber a consequência.
6. **Voltar e cancelar estão sempre presentes.** Botão inline e o comando `/cancel`.
7. **Nunca repetir a pergunta.** Se a pessoa não percebeu, a pergunta está errada. Manda um exemplo concreto e um botão «Não era isto?».

### Que tipo usar, quando

| Momento | Tipo |
|---|---|
| Entrar já com contexto | Ligação profunda `t.me/…?start=ines-demo` — só para encaminhar, nunca para autenticar |
| Escolha múltipla | Teclado de resposta, com `one_time_keyboard` para desaparecer depois |
| Guardar no cofre | Teclado inline; resposta ao clique **sem** editar a mensagem |
| Acção irreversível | Teclado inline, com a opção destrutiva marcada em vermelho |
| Progresso | Mensagem nova «Passo 2 de 3» — uma mensagem com teclado de resposta não pode ser editada |
| Pedir uma fotografia | **Só em texto.** Não existe botão de «pedir foto»: a pessoa tira a foto e envia |

**Detalhe longo:** o botão não leva o texto — leva só o identificador da mensagem (o limite são 64 bytes). O detalhe é uma mensagem a sério, escondida até alguém carregar no botão.

---

## A ficha de evidência, em tabela

O Telegram ganhou mensagens ricas em 2026, com **tabelas**. A nossa evidência — capítulo, artigo, citação, fonte, data — é literalmente uma tabela, e é o caso de uso para que a funcionalidade foi desenhada. É a única parte onde vale a pena usar.

**Mas não nas «caixinhas».** O Telegram recomenda o teclado clássico para confirmações e fluxos simples, e o limite de 64 bytes é o mesmo nos dois.

Risco a conhecer: não há versão mínima de cliente documentada. Testa no telemóvel antes deides e tem sempre um caminho simples em paralelo.

---

## Indicar que está a pensar

**Não mandes «a escrever…» como mensagem.** O Telegram diz explicitamente que não: usa a acção de «a escrever», que aparece sozinha no chat e desaparece quando a resposta chega. Dura cinco segundos, por isso repetes a cada quatro.

Se o núcleo falhar, mostra uma mensagem de erro — uma falha silenciosa a meio do pitch é pior do que uma mensagem de erro feia.

---

## Desenvolver sem token

O canal fica por trás de uma interface de cinco métodos: **receber actualizações, enviar, editar, responder a um clique, indicar actividade.** Duas implementações: a real, e uma falsa para testes.

É a peça que permite escrever e testar toda a lógica do Henriques — responder, citar a fonte, abstain — **sem token e sem telemóvel**, em milissegundos.

---

## Checklist antes de subir ao palco

- [ ] `pkill` ao processo antigo, depois arrancar — nada de `watch`
- [ ] Token testado com `getMe`
- [ ] Ficheiro `.env` presente e `.env` no `.gitignore`
- [ ] Notificações do telemóvel silenciadas
- [ ] Testado com o hotspot, não só com a rede do local
- [ ] Botão «falar com uma pessoa» responde
- [ ] Fotografia chega e o `file_id` guarda-se sem descarregar