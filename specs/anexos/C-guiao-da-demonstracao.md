# Anexo C · Guião da demonstração e do pitch

> Estado: versão para ensaio · Atualizado: 22/10/2026 · [Índice](../README.md)
> Pitch a 26/10, a partir das 14h30, no CIAJG: **4 minutos de pitch e 1 minuto de perguntas do júri**.
> Deck: [Delegate · Pitch Hack4Guimarães](https://claude.ai/artifact/2W74BBe2xR4oFToBAQUT7q) (o texto falado está nas notas de cada slide). Cartão do jurado: [`reference-docs/pitch-cartao-jurado.html`](../../reference-docs/pitch-cartao-jurado.html).
> A montagem técnica da demo continua em [strategy/09](../strategy/09-roteiro-da-demo.md); este anexo manda no pitch.

## 1. A ideia do pitch

Slides no início e no fim, demo ao vivo no meio. A demo prova que o Henriques funciona; os três slides «Por baixo» que se seguem explicam o que a sala acabou de ver e o que não se vê à primeira: o **Cofre Digital Pessoal**, o **TypeSafe Jev** e a **Porta Agêntica**. Os slides do fim garantem que o impacto (30%) e a continuidade (20%) são ditos mesmo que a demo se alongue.

O momento forte é um **membro do júri a falar com o Henriques no Telegram**, num telemóvel nosso, enquanto a sala vê a conversa e os bastidores no Painel ao vivo ([`reference-docs/delegate-panel.html`](../../reference-docs/delegate-panel.html)). O jurado segue um cartão: a pergunta é nossa, as respostas são do sistema, em tempo real.

O pitch não mostra números de avaliação: o protótipo não corre em produção e o conjunto de perguntas foi escrito pela equipa. A qualidade defende-se pelo método (decisões tipadas, verificador, abstenção) e mede-se no piloto.

## 2. Papéis

| Pessoa | Papel | Onde está |
|---|---|---|
| **Matheus** | Apresenta e narra do princípio ao fim. Nunca toca no portátil | Ao centro, de frente para o júri |
| **Paulo** | Comanda os ecrãs: avança os slides, muda para o Painel e volta, aciona os planos B | Portátil A, ligado ao projetor |
| **Daiana** | Leva o telemóvel ao jurado, entrega o cartão e acompanha-o passo a passo, em voz baixa | Junto à mesa do júri desde o início |

Escolha do jurado: o que estiver mais ao centro da mesa ou, se for possível identificá-lo, o representante da Câmara. Daiana pergunta antes: «Posso pedir-lhe que experimente o Henriques?»

## 3. Guião cronometrado (4:00)

| Tempo | Slide / ecrã | Matheus diz | Paulo / Daiana |
|---|---|---|---|
| 0:00–0:05 | Capa | «Boa tarde. Somos o Delegate.» | Paulo avança logo |
| 0:05–0:22 | O problema | «A Inês herdou do avô um restaurante no centro de Guimarães e quer pôr uma esplanada à porta. Que licença? Que documentos? Quanto custa? A resposta existe, mas está espalhada por regulamentos, tabelas de taxas, formulários e balcões.» | — |
| 0:22–0:40 | Guimarães | «E não é só a Inês. Em dez meses de 2025, o Balcão Único de Guimarães fez mais de vinte e dois mil atendimentos presenciais e atendeu mais de quarenta e um mil chamadas. A Câmara já tem um atendedor com IA. O que falta?» | — |
| 0:40–1:00 | A solução | «Falta alguém do lado da pessoa. O Delegate dá a cada munícipe um representante digital: o Henriques. Um nome que, aqui, dispensa apresentações. Responde com a fonte à vista, trata do pedido por si e entrega à Câmara o caso pronto, para um técnico decidir.» | Daiana desbloqueia o telemóvel e entrega-o com o cartão |
| 1:00–1:05 | Ao vivo | «Mas não acreditem em nós. Peço-lhe que faça a pergunta da Inês ao Henriques.» | Paulo muda para o Painel quando o jurado começa a escrever |
| 1:05–2:10 | **Painel** | Narração curta da demo (secção 4) | Daiana guia o jurado pelo cartão |
| 2:10–2:32 | Por baixo · Cofre | «O que viram é a superfície. Por baixo, há três peças. Primeiro, o Cofre Digital Pessoal: os dados, documentos, desejos e intenções da Inês, cifrados e controlados por ela. Com essa memória, o Henriques antecipa-se: sabe que ela tem um restaurante e avisa-a de que o letreiro na fachada não precisa de pedido à Câmara. A lei já o permite.» | Paulo volta aos slides; Daiana recolhe o telemóvel |
| 2:32–2:50 | Por baixo · Jev | «Segundo, a forma como o Henriques entende. Não deixamos um modelo de linguagem adivinhar. Com o TypeSafe Jev, cada mensagem passa por escolhas tipadas, definidas em código: que serviço, se responde, se abstém, encaminha ou recusa, que mandato. Cada ramo fica registado: é a árvore que viram no Painel.» | — |
| 2:50–3:10 | Por baixo · Porta | «Terceiro, a Porta Agêntica. Invertemos a integração: a Câmara não abre os seus sistemas, implementa um contrato aberto, em MCP e REST, serviço a serviço. Começa só com o que está no site e sobe até à ação. E a mesma porta serve o atendedor da Câmara, bancos ou contabilistas, com as mesmas regras.» | — |
| 3:10–3:30 | Impacto | «O que vale isto para Guimarães? Se um em cada cinco contactos for resolvido pelo Henriques, a Câmara liberta perto de três mil horas em dez meses, e um pedido de esplanada passa de sessenta e nove para vinte e sete minutos de trabalho. São horas para decidir, não cortes, e o piloto mede estas hipóteses.» | — |
| 3:30–3:46 | Continuidade | «Começa com um piloto de cinco meses, com a Câmara e as Juntas de Freguesia, que mede o que hoje é hipótese. Depois, o mesmo contrato para os oito municípios do Ave. Código aberto, e o munícipe nunca paga.» | — |
| 3:46–4:00 | Fecho | (abrandar) «Onde nasceu Portugal, pode nascer uma nova relação entre as pessoas e a Câmara. Diga o que precisa. O Henriques trata do resto. Obrigado.» | O slide com o código QR fica no ecrã durante as perguntas |

O texto é apertado para 4:00: cerca de 420 palavras fora da demo, mais 65 segundos de demo. A margem está na demo: se derrapar, corta-se lá (secção 4), nunca nos slides «Por baixo» nem nos do fim. Se os ensaios passarem de 4:00, a primeira frase a sair é «E não é só a Inês» (o slide fala por si).

### Fontes dos slides «Por baixo»

| Slide | Afirmação | Fonte |
|---|---|---|
| Cofre | Três camadas (identidade, provas, intenções), cifra AES-256-GCM, pacote mínimo por missão | `nucleo/cofre/`, [specs/14](../14-governacao-privacidade-seguranca.md) |
| Cofre | O letreiro com o nome do estabelecimento, em bem privado, dispensa licença e mera comunicação prévia, mesmo visível da via pública, dentro dos critérios municipais | Lei n.º 97/88, art. 1.º, n.º 3, al. b), e n.º 5, na redação do DL 48/2011 (texto da [CNE, versão de 2012](https://www.cne.pt/sites/default/files/dl/legis_lei_97_88_versao2012.pdf)). **Exemplo ilustrativo**: o aviso proativo não está no fluxo da demo |
| Jev | Escolhas fechadas por critérios em código (foco, serviço, comportamento, mandato, ferramenta MCP); verificador de números; contingência local | `nucleo/typesafe/criterios.ts`, `motor-decisao.ts`, [ADR-024](../21-registo-de-decisoes.md#adr-024) |
| Porta | Integração invertida, contrato aberto MCP + REST, níveis I0–I3 | [specs/24](../24-processos-canonicos-e-integracao.md), [ADR-020](../21-registo-de-decisoes.md#adr-020) |

Desde o ADR-024 a confiança do Jev é **declarada pelo modelo, não calibrada**. Não dizer «probabilidades calibradas».

## 4. A demo com o jurado (1:05–2:10)

O cliente é o bot alojado no portátil A; o núcleo, a Porta e o Painel correm em local. A narração é curta de propósito: o Cofre, o Jev e a Porta são explicados nos slides seguintes.

| # | O jurado faz (cartão) | O Painel mostra | Matheus diz |
|---|---|---|---|
| 1 | Escreve: «Quero pôr uma esplanada à porta do meu café. O que preciso?» | Mensagem na conversa; árvore de decisão do TypeSafe Jev | «O que escrever aparece aqui. À esquerda, a conversa, com o aspeto do WhatsApp porque o canal é indiferente: hoje é Telegram. À direita, a árvore de decisão. Já lá vamos.» |
| 2 | — (lê a resposta) | Resposta com fonte; verificação ✓; selo SHA-256 | «Mera comunicação prévia, corredor de dois metros, documentos, e a fonte, com artigo e data. A taxa não é inventada: diz como se calcula.» |
| 3 | Toca «🚀 Ajuda-me a tratar» | Mandato D2; missão MIS-0001 | «Agora a Inês delega: mandato D2, preparar, não submeter.» |
| 4 | Toca «📍 Exemplo: Casa Joaquim», escreve «4 mesas» e depois «Sim» | Itens a entrar no Cofre (metadados, nunca o conteúdo); pacote mínimo PAC-0001 | «Cada dado vai para o Cofre dela, cifrado.» |
| 5 | Toca «✍️ Autenticar com Chave Móvel Digital (Simulação)» | Mandato D3; chamada à Porta; processo OEP/2026/0001 (Simulação) | «Confirma com a Chave Móvel Digital, aqui simulada, e o processo nasce na Câmara.» |

**Tempo:** cada julgamento do Jev demora 4 a 7 segundos (limite de 10 s, [ADR-024](../21-registo-de-decisoes.md#adr-024)). Cronometrar a demo inteira nos ensaios; se passar de 65 segundos, retirar o passo 5 do cartão e dizê-lo em vez de o mostrar.

**Regra de corte:** se aos 2:00 o jurado ainda não chegou ao passo 5, Matheus diz «e daqui segue para a Chave Móvel Digital e para a Câmara», agradece ao jurado e Paulo avança para «Por baixo · Cofre».

**Se o jurado escrever outra coisa:** deixa-se responder. Se o Henriques responder com fonte, ótimo; se se abstiver, diz-se: «Sem fonte, não inventa. Também é uma boa resposta.» Depois Daiana retoma o cartão.

**Morada:** o jurado deve tocar no exemplo «Casa Joaquim». Uma morada escrita à mão que não seja do concelho é recusada pelo Henriques (validação geográfica), o que custa tempo.

## 5. Perguntas do júri (1 minuto)

Respostas de 15 a 20 segundos. Responde Matheus; Paulo só entra nas técnicas, se Matheus lhe passar a palavra.

| Pergunta | Resposta |
|---|---|
| A Câmara já tem um assistente com IA. Porquê isto? | «O atendedor responde. O Henriques responde com a fonte, diz quando não sabe, lembra-se do que a pessoa quer e trata do pedido por si, com mandato. E a nossa Porta pode servir o próprio atendedor da Câmara, com as mesmas fontes e regras.» |
| E se a IA errar? | «O modelo não decide sozinho: cada passo é uma escolha fechada, definida em código, e um verificador bloqueia qualquer número que não esteja na fonte. Sem fonte, abstém-se. Quem decide o pedido é um técnico.» |
| Como sabem que funciona bem? | «Ainda não sabemos com dados reais, e não fingimos que sim. Testámos com perguntas escritas pela equipa; a precisão em produção mede-se no piloto, que é para isso que serve.» |
| O aviso do letreiro já funciona? | «Não. É um exemplo do que o Cofre permite, com fonte real: a Lei 97/88. Na demo viram o Cofre a guardar os dados do pedido; a proatividade é o passo seguinte.» |
| De onde vêm as horas libertadas? | «Os volumes são dos relatórios de atividades da Câmara, de fevereiro a novembro de 2025. A taxa de resolução e os tempos por tarefa são hipóteses, escritas no repositório, que o piloto vai medir.» |
| O que é real e o que é simulado? | «Real: o Henriques, a base de conhecimento do portal e dos regulamentos, o Jev, o verificador, o Cofre cifrado, os mandatos, a Porta MCP e o registo selado. Simulado, e assinalado: a Chave Móvel Digital, os sistemas internos da Câmara e o número de processo.» |
| E os dados pessoais? | «No protótipo não há dados reais. O Cofre é cifrado com AES-256-GCM, com chave por pessoa, e só sai o pacote mínimo de cada missão. No piloto: avaliação de impacto, alojamento na UE.» |
| Porquê Telegram e não WhatsApp? | «O Telegram deixou-nos pôr um bot a funcionar esta semana. O núcleo não depende do canal; o WhatsApp é um passo do piloto.» |
| Isto substitui funcionários? | «Não. Os técnicos recebem casos preparados e decidem. Contamos horas libertadas, não postos de trabalho.» |
| Quem paga? | «O munícipe nunca paga. A Câmara paga a infraestrutura; quem usa a Porta para fazer negócio, como bancos ou contabilistas, paga a passagem, e parte volta à Câmara.» |
| Construíram isto esta semana? | «Sim. O código foi criado a partir de 19/10; o histórico do repositório mostra-o. Antes, recolhemos o corpus público e escrevemos as especificações.» |

## 6. Antes de subir ao palco

### 23/10 (sexta), até às 15h00

- [ ] Confirmar a redação em vigor do art. 1.º da Lei n.º 97/88 na versão consolidada do Diário da República (slide «Cofre»).
- [ ] Gravar o vídeo de plano B (secção 7) e copiar para o ambiente de trabalho do portátil A e para uma pen.
- [ ] Gravar uma sessão completa no Painel (tecla **G**) e guardar o JSON junto ao vídeo.
- [ ] Exportar o deck em PDF e PPTX (cópia offline).
- [ ] Gerar o código QR do bot alojado na nuvem e pô-lo no slide «Fecho».

### 24 e 25/10: ensaios

- [ ] Três ensaios cronometrados com a pessoa que fizer de jurado a ler o cartão pela primeira vez.
- [ ] Ensaiar com o OpenRouter desligado (sem chave no `.env`): confirmar que o fluxo da esplanada chega ao fim com o texto de contingência.
- [ ] Ensaiar o corte das 2:00 e o plano C (reprodução no Painel).

### 26/10, 30 minutos antes

- [ ] `npm run demo:repor`; núcleo e Porta a correr; Painel aberto em ecrã inteiro, limpo com **L**, ritmo 1×.
- [ ] Telemóvel da demo: `/start` feito, modo «não incomodar», só a conversa do bot aberta, letra grande, bateria acima de 80%, teclado em português.
- [ ] Cartão do jurado impresso (dois exemplares).
- [ ] Portátil A com o deck no slide «Capa» noutro ecrã virtual; trocar entre deck e Painel com um gesto, testado.
- [ ] Rede do CIAJG testada; hotspot 4G de outro telemóvel pronto para o portátil A.
- [ ] Vídeo de plano B no ambiente de trabalho; pen com vídeo e PDF do deck.
- [ ] Carregadores e adaptador HDMI/USB-C.

## 7. Planos B

| Nível | Situação | Ação | O que se diz |
|---|---|---|---|
| A | Tudo a funcionar | Demo ao vivo com o jurado | — |
| B | Rede do CIAJG falha | Paulo passa o portátil A para o hotspot; o bot retoma por *long polling* | Nada; segue-se |
| C | Bot ou núcleo não respondem em 10 s | Paulo carrega **O** no Painel e abre a gravação de 23/10. Daiana recolhe o telemóvel | «O sistema não está a responder aqui; esta é a gravação de ontem, do mesmo fluxo.» |
| D | Portátil ou projetor falham | Vídeo de plano B no computador da organização, a partir da pen | «Mostramos a gravação da demo.» |

**Nunca apresentar uma gravação como se fosse ao vivo.** O Painel anuncia a reprodução no ecrã; Matheus di-lo também.

**Vídeo de plano B (gravar a 23/10):** captura do ecrã do Painel durante o fluxo completo da secção 4, com Daiana ao telemóvel, cerca de 65 segundos, sem som. Não usar os vídeos de 3 minutos de `videos/`: são para a TAIKAI, não cabem no pitch.

## 8. Ensaios

| Ensaio | Data | Tempo total | Tempo da demo | Observações |
|---|---|---|---|---|
| 1 | 24/10 | | | |
| 2 | 25/10 | | | |
| 3 | 26/10 manhã | | | |
