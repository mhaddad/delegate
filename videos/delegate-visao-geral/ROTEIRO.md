# Delegate — vídeo de visão geral (3:30)

> Estado: proposta para validação · 22/10/2026
> Público: o júri que avalia a submissão na TAIKAI (o vídeo de demonstração até 3 minutos da [lista de submissão](../../specs/19-plano-do-hackathon.md)). Não é para o pitch ao vivo: o [Anexo C](../../specs/anexos/C-guiao-da-demonstracao.md) diz que os vídeos de 3 minutos são para a TAIKAI.
> Bases: [descrição da TAIKAI](../../reference-docs/taikai-descricao-projeto.md), [Anexo C · guião do pitch](../../specs/anexos/C-guiao-da-demonstracao.md), o deck do pitch, as [especificações](../../specs/README.md) e o [design system](../../design-system/README.md).

---

## 1. Objetivo

Em três minutos, quem vê tem de sair a saber três coisas:

1. **O que é o Delegate:** um representante digital, o Henriques, que trabalha para a pessoa. Responde com a fonte à vista, trata do pedido com mandato e entrega à Câmara o caso pronto.
2. **Que funciona:** o vídeo mostra o protótipo real (o Painel ao vivo e a Consola da Câmara) a tratar o caso da esplanada de ponta a ponta.
3. **Porque é sério e tem futuro:** as três peças por baixo (Cofre, TypeSafe Jev e Porta Agêntica), o impacto para a Câmara com pressupostos à vista, e o caminho para o piloto e para o Ave.

### Como cobre os critérios do júri

| Critério | Peso | Onde aparece no vídeo |
|---|:---:|---|
| Impacto e relevância | 30% | Cenas 2 (números da Câmara) e 10 (horas libertadas, minutos por pedido) |
| Viabilidade técnica | 25% | Cenas 4 a 6 (protótipo real a funcionar) e 7 a 9 (Cofre, Jev, Porta) |
| Inovação e originalidade | 25% | Cena 3 (representa a pessoa), cena 8 (decide por escolhas fechadas), cena 9 (integração invertida) |
| Apresentação e continuidade | 20% | Cena 11 (piloto, Ave, código aberto, quem paga) |

## 2. O que mudou desde os vídeos anteriores

Este vídeo é feito de raiz e reflete o estado atual do projeto. Não reaproveita a série de três vídeos.

| Antes (série de 3 vídeos) | Agora |
|---|---|
| Afonso | **Henriques** ([ADR-023](../../specs/21-registo-de-decisoes.md)) |
| WhatsApp como canal | **Telegram** (o Painel mostra a conversa com aspeto de mensageiro porque o canal é indiferente) |
| «Agentes de IA» genéricos | **TypeSafe Jev**: escolhas tipadas, verificador de números e árvore de decisão registada ([ADR-024](../../specs/21-registo-de-decisoes.md#adr-024)) |
| Integração por capacidades | **Porta Agêntica em MCP e REST** com integração invertida e níveis I0 a I3 ([ADR-020](../../specs/21-registo-de-decisoes.md#adr-020)) |
| Conhecimento genérico | **Base de conhecimento com 224 documentos públicos** e **Registo Canónico com 16 fichas** |
| Impacto qualitativo | **Modelo de custos** ([specs/26](../../specs/26-modelo-de-impacto-e-custos.md)): horas libertadas e minutos por pedido, com hipóteses assinaladas |
| Identidade com Fraunces e anel ciano | **Design system**: Manrope, símbolo da porta com maçaneta, Palco e Bastidores, ilustração do Henriques |
| Ecrãs desenhados para o vídeo | **Capturas reais** do Painel ao vivo e da Consola da Câmara v2 |

## 3. Direção visual

- **Design system do projeto:** fonte Manrope, a única; fundo **Palco** `#F4EFE6` para o mundo da Inês e **Bastidores** `#0F1B2D` para a tecnologia. A cor indica sempre um estado: verde quando o Henriques age ou algo fica resolvido, dourado para o Cofre e as autorizações, terracota para alertas e abstenções.
- **Personagens:** o **Henriques** com a ilustração oficial (`design-system/ilustracoes/henriques-avatar.svg`). A **Inês** aparece como silhueta simples, na mesma linguagem gráfica.
- **Marca:** o símbolo da porta com maçaneta abre e fecha o vídeo. A porta pode servir de transição: abre-se para entrar nos bastidores.
- **Dois tipos de imagem:**
  - **Motion graphics** nas cenas de contexto e de conceito (1–3 e 7–11), em HTML/SVG com o motor próprio, sem Hyperframes.
  - **Capturas reais** do produto nas cenas de demonstração (4–6): o **Painel** a reproduzir uma sessão gravada do fluxo da esplanada, e a **Consola da Câmara v2**, com o cursor a percorrer o caso. Cada captura entra num enquadramento de ecrã, com um zoom suave para os pormenores (resposta com fonte, árvore de decisão, itens do Cofre).
- **Honestidade à vista:**
  - No Painel fica visível o aviso «Reprodução de uma sessão gravada. Não é ao vivo».
  - A Chave Móvel Digital, o processo e a Consola mostram a etiqueta **«Simulação»**.
  - Os números de impacto levam a legenda «hipóteses que o piloto mede».
- **Marca da Câmara e aspeto do Painel:** a equipa tem autorização para usar o logótipo da Câmara (aparece na Consola v2), e o aspeto de WhatsApp do Painel pode aparecer no vídeo. Continua a não se mostrar o logótipo do WhatsApp nem números de avaliação do protótipo.

## 4. Storyboard

| # | Tempo | Cena | O que se vê | Texto no ecrã |
|---|---|---|---|---|
| 1 | 0:00–0:13 | **A Inês** | Fundo Palco. A silhueta da Inês à porta do restaurante Casa Joaquim. Três perguntas surgem uma a uma em cartões: *Que licença?* · *Que documentos?* · *Quanto custa?* Por trás, chips desfocados: «Regulamento de Ocupação do Espaço Público», «RTTL 2025», «Licenciamento Zero», «Formulário OVP-SO», «Balcão Único». | as três perguntas |
| 2 | 0:13–0:28 | **Guimarães** | Três números grandes, em verde, contam até ao valor: **22.425** atendimentos presenciais · **41.473** chamadas · **25.107** emails. No fim, uma frase destacada. | `Guimarães · fevereiro a novembro de 2025` · fonte no rodapé · `A Câmara já tem um atendedor virtual. O que falta?` |
| 3 | 0:28–0:45 | **O Henriques** | A porta do símbolo abre-se e dela surge o retrato do Henriques. Logótipo Delegate. Três cartões em Bastidores, com ícones: **Responde com a fonte à vista** · **Trata do pedido por si** (mandato e Cofre) · **A Câmara recebe o caso pronto**. | `Delegate` · `Um representante digital para cada pessoa e cada negócio` |
| 4 | 0:45–1:05 | **Demo 1 · pergunta e resposta** (captura real) | Painel em ecrã inteiro, com o aviso de reprodução. À esquerda, a conversa: «Quero pôr uma esplanada à porta do meu café. O que preciso?». À direita, a árvore de decisão do Jev desenha-se ramo a ramo. Chega a resposta: zoom nos documentos (formulário OVP-SO, certidão permanente, seguro) e na **fonte** («Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães, Artigo 8.º e Anexo I · consultado a 18/10/2026»). | chips de viabilidade, por baixo: `224 documentos públicos` · `16 fichas de serviço` · `7 operações na Porta` |
| 5 | 1:05–1:25 | **Demo 2 · delegar** (captura real) | No Painel, a Inês pede ao Henriques que trate do pedido: surge o **mandato D2**. «Casa Joaquim», «4 mesas e 20 cadeiras», o corredor de 2,00 m do Artigo 8.º, «Sim»: os itens entram no **Cofre** (só metadados) e forma-se o pacote mínimo **PAC-0001**. Depois, «Autenticar com Chave Móvel Digital (Simulação)»: **mandato D3**, chamada à Porta e processo **OEP/2026/0001 (Simulação)**. | `Mandato D2 · preparar` → `Mandato D3 · agir com confirmação` · `Simulação` |
| 6 | 1:25–1:40 | **A Câmara decide** (captura real) | Transição para a **Consola da Câmara v2**. Pedido **#DG-2048 · Esplanada aberta**: resumo, «3 dados necessários · 0 mensagens partilhadas», «Acesso limitado». O cursor desce até «Decisão e resolução» e passa por «Aprovar pedido». Corte rápido para «Missões delegadas», onde a missão avança no percurso. | `Simulação` (já na Consola) · `A decisão é humana.` |
| 7 | 1:40–1:57 | **Por baixo · Cofre** | A porta abre-se para Bastidores e aparece uma agenda de três peças (`1 Cofre · 2 Jev · 3 Porta`). O Cofre aparece como um cofre dourado, com três camadas: **dados** (NIF, morada, o restaurante Casa Joaquim), **documentos** (certidão, seguro, planta) e **intenções** (a esplanada, a casa no terreno do avô). Dele sai um envelope com o **pacote mínimo**; o resto fica fechado. No fim, o telemóvel da Inês vibra com uma mensagem do Henriques, sem ela perguntar: *«Inês, o letreiro “Casa Joaquim” na fachada não precisa de licença nem de comunicação à Câmara. A lei já o permite, desde que cumpra os critérios municipais.»*, com a fonte por baixo. | `Cofre Digital Pessoal · AES-256-GCM · chave por pessoa` · `Fonte: Lei n.º 97/88, art. 1.º, n.º 3, al. b), na redação do DL 48/2011` |
| 8 | 1:52–2:15 | **Por baixo · TypeSafe Jev: a árvore de decisão** | A árvore de decisão na horizontal, como no Painel: sete colunas (**Mensagem → Triagem → Natureza → Mandato → Porta · MCP → Consentimento → Resposta**), cada uma com as suas opções fechadas. O caminho escolhido acende coluna a coluna, com a confiança de cada escolha; as alternativas ficam apagadas. Na coluna **Mandato** destacam-se os níveis **D0 informar → D4 pagar**. Um número sem fonte tenta passar e é **travado** pelo verificador, a terracota. Cada passo ganha um selo. | `Não é um chatbot: decide por escolhas fechadas` · `Verificador: número sem fonte não sai` · `Eventos selados SHA-256` | `Escolhas definidas em código · o modelo só redige` · `Verificador: número sem fonte não sai` · `Eventos selados SHA-256` |
| 9 | 2:10–2:22 | **Por baixo · Porta Agêntica** | À esquerda, quem usa a Porta: **Henriques**, atendedor da Câmara, bancos e contabilistas, outros agentes. Ao centro, a Porta (o símbolo). À direita, os serviços da Câmara, cada um a subir de nível: **I0 orientação → I1 assistido → I2 leitura → I3 ação**. | `MCP + REST · contrato aberto` · `A Câmara não abre os seus sistemas` |
| 10 | 2:22–2:41 | **Impacto** | Fundo Bastidores. Número principal: **2.756 a 3.345 h** libertadas em 10 meses (cenário 1 em cada 5 contactos). Dois cartões: **69 → 27 min** de trabalho da Câmara por pedido de esplanada; **2h50 → 15 min** do tempo da Inês. | `Capacidade libertada, não cortes` · `Volumes reais (CMG, fev.–nov. 2025). Taxa de resolução e tempos são hipóteses que o piloto mede.` |
| 10b | 2:47–3:10 | **Intenções do Concelho** (captura real) | Dos Cofres de muitas pessoas saem pontos dourados que se juntam, anónimos, num só painel. Entra a vista **Intenções do Concelho** da Consola v2: as garantias (só com consentimento, grupos com menos de 10 pessoas não publicados, nenhum dado individual sai do Cofre), os indicadores, o mapa por freguesia e tema, as **motivações** e os **desejos para a cidade**. | `Dados sintéticos` (já na Consola) · `Decisões estratégicas e políticas públicas` · `Medir o efeito de cada medida` |
| 11 | 3:10–3:30 | **Continuidade e fecho** | Três passos em linha: **Piloto de 5 meses** (Câmara e Juntas de Freguesia) → **Medir o que é hipótese** → **Os 8 municípios do Ave**. Selos: `Código aberto · EUPL-1.2` e `O munícipe nunca paga`. Fecho em Bastidores: símbolo, Henriques e slogan. | `Diga o que precisa. O Henriques trata do resto.` · `Delegate · Hack4Guimarães 2035 · Desafio 3.4` |

## 5. Narração

**Voz:** Sofia, ElevenLabs, em **português de Portugal**, com o modelo `eleven_multilingual_v2` (verificado em pt-PT para esta voz; o `eleven_v3` puxa para pt-BR). A narração inteira é gerada numa **única gravação contínua**, para a voz soar igual do princípio ao fim. Tem 533 palavras e 3:13 de fala; com as pausas e o cartão final, o vídeo dura 3:28. A versão de 23/10/2026 reforça os três diferenciais (a árvore de decisão do TypeSafe Jev, os mandatos D0–D4 e as Intenções do Concelho) e por isso passa dos 3:00.

| # | Tempo | Texto |
|---|---|---|
| 1 | 0:00–0:13 | A Inês herdou do avô um restaurante em Guimarães e quer pôr uma esplanada à porta. Que licença? Que documentos? Quanto custa? A resposta existe, mas está espalhada por regulamentos, taxas e formulários. |
| 2 | 0:13–0:28 | Em dez meses de 2025, o Balcão Único de Guimarães fez mais de vinte e dois mil atendimentos presenciais e atendeu mais de quarenta e um mil chamadas. A Câmara já tem um atendedor virtual. O que falta? |
| 3 | 0:28–0:45 | Falta alguém do lado da pessoa. O Delegate dá a cada munícipe um representante digital: o Henriques. Um nome que, aqui, dispensa apresentações. Responde com a fonte à vista, trata do pedido por si e entrega à Câmara o caso pronto. |
| 4 | 0:45–1:05 | E funciona: este é o protótipo, construído de raiz no hackathon. A Inês escreve no Telegram. O Henriques responde em linguagem simples, com os documentos de que precisa, e mostra a fonte: o regulamento municipal, o artigo e a data de consulta. |
| 5 | 1:05–1:25 | Depois, a Inês delega. Com um mandato de nível dois, o Henriques prepara o pedido: regista o restaurante e as mesas, confirma o corredor de dois metros para peões e guarda tudo no Cofre dela, cifrado. Ela confirma com a Chave Móvel Digital, aqui simulada, e o processo nasce na Câmara. |
| 6 | 1:25–1:40 | A técnica da Câmara recebe o caso preparado, com as fontes e só os dados necessários. A decisão continua a ser humana. |
| 7 | 1:40–1:57 | Por baixo, há três peças. O Cofre Digital Pessoal: dados, documentos e intenções da Inês, cifrados e controlados por ela. Cada missão leva só o mínimo necessário. Com essa memória, o Henriques pode antecipar-se: avisa-a de que o letreiro do restaurante não precisa de pedido à Câmara. |
| 8 | 1:52–2:15 | O TypeSafe Jev é o que faz do Henriques mais do que um chatbot. Cada mensagem percorre uma árvore de decisão definida em código: que serviço é, se responde, se abstém ou encaminha, com que mandato, de só informar até pagar uma taxa, e se precisa do consentimento da pessoa. O modelo só escolhe entre opções fechadas e redige. Um verificador trava qualquer número sem fonte, e cada passo fica selado. |
| 9 | 2:10–2:22 | E a Porta Agêntica, que inverte a integração: a Câmara não abre os seus sistemas, implementa um contrato aberto, serviço a serviço. A mesma porta serve outros agentes, com as mesmas regras. |
| 10 | 2:22–2:41 | Se um em cada cinco contactos for resolvido pelo Henriques, a Câmara liberta perto de três mil horas em dez meses, e um pedido de esplanada passa de sessenta e nove para vinte e sete minutos de trabalho. São hipóteses que o piloto vai medir. |
| 10b | 2:47–3:10 | E a Câmara passa a ver o que a cidade quer fazer. Com consentimento, as intenções guardadas nos Cofres juntam-se, anónimas, nas Intenções do Concelho. Com elas, a Câmara pode tomar decisões estratégicas, criar políticas públicas ao encontro do que os munícipes querem e medir se uma medida está a ter efeito no que as pessoas perguntam, desejam e planeiam. |
| 11 | 2:41–3:00 | Começa com um piloto de cinco meses, com a Câmara e as Juntas de Freguesia, e depois os municípios do Ave. Código aberto, e o munícipe nunca paga. Onde nasceu Portugal, pode nascer uma nova relação entre as pessoas e a Câmara. Diga o que precisa. O Henriques trata do resto. |

### Fontes de cada afirmação

| Afirmação | Fonte |
|---|---|
| 22.425 atendimentos, 41.473 chamadas, 25.107 emails (28.308 registos × 88,7%), fev.–nov. 2025 | Relatórios de atividades da CMG, via [specs/01 §3](../../specs/01-contexto-e-problema.md) e [dossiê](../../reference-docs/Camara_Municipal_de_Guimaraes_Servicos_e_Indicadores_2025.md) |
| A Câmara já tem um atendedor virtual | Portal municipal, [specs/00](../../specs/00-sumario-executivo.md) |
| Documentos, fonte com artigo e data, corredor ≥ 2,00 m (Art. 8.º), pacote PAC-0001, processo OEP/2026/0001 | Sessão real gravada a 22/10/2026 no núcleo (`captura/sessao-esplanada.json`, eventos 292–334) |
| Mandatos D2 (preparar) e D3 (agir com confirmação); CMD e processo simulados | [specs/22](../../specs/22-glossario.md), [Anexo C §4–5](../../specs/anexos/C-guiao-da-demonstracao.md) |
| 224 documentos, 16 fichas, 7 operações da Porta | [descrição da TAIKAI](../../reference-docs/taikai-descricao-projeto.md) |
| Cofre com três camadas, AES-256-GCM, pacote mínimo; aviso do letreiro (Lei n.º 97/88, art. 1.º, n.º 3, al. b), na redação do DL 48/2011) | [Anexo C §3](../../specs/anexos/C-guiao-da-demonstracao.md), [specs/14](../../specs/14-governacao-privacidade-seguranca.md) |
| Escolhas tipadas, verificador, eventos selados | [ADR-024](../../specs/21-registo-de-decisoes.md#adr-024), [strategy/07](../../specs/strategy/07-contrato-de-eventos.md) |
| Integração invertida, MCP + REST, I0–I3 | [specs/24](../../specs/24-processos-canonicos-e-integracao.md), [ADR-020](../../specs/21-registo-de-decisoes.md#adr-020) |
| 2.756–3.345 h (s = 20%), 69 → 27 min, 2h50 → 15 min | [specs/26 §4–5](../../specs/26-modelo-de-impacto-e-custos.md): os volumes são reais, a taxa e os tempos são hipóteses |
| Piloto de 5 meses, Ave, EUPL-1.2, o munícipe nunca paga | [specs/16](../../specs/16-modelo-de-negocio.md), [descrição da TAIKAI](../../reference-docs/taikai-descricao-projeto.md) |

## 6. Som

- **Música original (Eleven Music)**, com secções alinhadas às cenas:
  - **Abertura (1–2):** calma e um pouco suspensa, com piano e cordas leves; uma pergunta em aberto.
  - **Revelação do Henriques (3):** a melodia abre-se, quente e confiante, com um toque de guitarra portuguesa.
  - **Demonstração (4–6):** pulsação leve e moderna que acompanha o ritmo da conversa.
  - **Bastidores (7–9):** arpejos precisos e uma textura eletrónica limpa.
  - **Impacto e fecho (10–11):** crescendo e resolução luminosa no slogan.
- **Efeitos:** os da série, reaproveitados (notificações, envio de mensagem, «ding» do Cofre, carimbo, mergulho na porta, blips de decisão, bloqueio do verificador), mais um clique de rato para a Consola.
- **Mistura:** a música baixa sob a voz e sobe nas pausas.

## 7. Produção (depois da validação)

1. **Narração:** gravação única da Sofia no `eleven_multilingual_v2`, transcrição de verificação e linha de tempo por palavra (as ferramentas da série, adaptadas).
2. **Captura do Painel:** sessão real gravada a 22/10/2026, às 14h24, a partir do fluxo de eventos do núcleo (`captura/sessao-esplanada.json`). A primeira pergunta foi «O que preciso para ter uma esplanada à porta do meu café?», porque a frase do cartão («Quero pôr…») cai num atalho do núcleo que salta o TypeSafe Jev ([principal.ts:753](../../prototipo/apps/api/src/nucleo/principal.ts#L753)). A sessão é reproduzida no Painel, com o aviso «Reprodução» visível, e filmada com o Chrome headless.
3. **Captura da Consola v2:** filmar `reference-docs/delegate-consola-camara-v2.html` com o Chrome headless, conduzindo cursor e cliques por script (pedido #DG-2048 e Missões delegadas).
4. **Motion graphics:** cenas 1–3 e 7–11 no motor próprio, com os tokens, a fonte e as ilustrações do design system.
5. **Música, efeitos, mistura e render** a 1920×1080 e 30 fps, como na série.

## 8. Decisões tomadas (22/10/2026)

1. **Público e uso:** o vídeo é para a submissão na TAIKAI.
2. **Logótipo da Câmara:** a equipa tem autorização; a Consola v2 é filmada tal como está.
3. **Aspeto de WhatsApp no Painel:** pode aparecer; a narração diz que o canal é o Telegram.
4. **Intenções do Concelho:** a vista mantém-se como está.
5. **Aviso proativo do letreiro:** entra na cena 7, sem a etiqueta «Exemplo ilustrativo». Como não faz parte do fluxo da demo, aparece em motion graphics (não numa captura do produto) e a narração diz que o Henriques *pode* antecipar-se.
6. **Nomes:** **Delegate** é a solução, **Henriques** é o Representante Digital Pessoal e **Hack4Guimarães 2035** é o hackathon onde o projeto é apresentado. O cartão final diz `Delegate · Hack4Guimarães 2035 · Desafio 3.4`.
7. **Sessão gravada no Painel:** a demonstração vem de uma sessão gravada, com o aviso de reprodução visível.
