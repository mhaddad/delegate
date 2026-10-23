# Delegate

**Um representante digital para cada munícipe tratar dos seus assuntos com a Câmara.**

O Delegate dá a cada pessoa e a cada empresa de Guimarães um representante digital, o Henriques. O Henriques responde a perguntas sobre serviços municipais com a fonte oficial à vista e trata dos pedidos em nome da pessoa, sempre com a sua autorização explícita. Do lado da Câmara, os técnicos recebem casos já preparados para decisão. A Câmara passa também a ver, de forma agregada e anónima, o que o concelho pretende fazer.

**Desafio:** 3.4 · Falar com a Câmara sem Burocracia (Tecnologias Inteligentes)

---

## O problema

Para resolver uma necessidade junto da Câmara, o cidadão tem de descobrir por si que procedimento se aplica, que documentos deve entregar, em que canal, com que regras e a que custo. A informação existe, mas está repartida pelo portal, pelo diretório de serviços e por formulários, regulamentos e tabelas de taxas, e está escrita em linguagem técnica.

A procura de atendimento em Guimarães mostra a dimensão do problema. Os dados abaixo vêm dos relatórios de atividades da Câmara Municipal e cobrem fevereiro a novembro de 2025:

- **22.425 atendimentos presenciais** no Balcão Único, com uma duração média entre 20 min 31 s e 28 min 24 s;
- **41.473 chamadas atendidas**;
- **28.308 registos de correspondência**, dos quais 88,7% por email;
- **7.141 processos** registados no Urbanismo Digital;
- **751 pedidos** de inspeção ou reinspeção de ascensores e **407 licenças** de ocupação do espaço público para obras.

Não há dados públicos sobre a parte destes contactos que é apenas informativa ou que poderia ser evitada. Medi-la é um dos objetivos do piloto.

O Município já tem um atendedor virtual com IA, e o Delegate não o substitui. Acrescenta o que um assistente de perguntas e respostas não faz sozinho: responde com a fonte à vista, encaminha para o procedimento certo, acompanha o pedido ao longo do tempo e age em nome da pessoa quando ela o autoriza.

---

## A solução

- **Representante digital (Henriques).** Recebe pedidos em linguagem natural, identifica o procedimento aplicável e responde em linguagem simples. Cita sempre a fonte oficial: documento, artigo e data de consulta. Sem fonte válida, não responde e encaminha a pessoa para quem pode ajudar.
- **Mandato digital.** É a autorização que a pessoa dá ao representante, em níveis que vão de informar (D0) a agir dentro de regras definidas (D4). Pode ser revogada a qualquer momento. Nenhuma ação é executada sem mandato.
- **Missão.** Cada pedido passa a ser um processo acompanhado, com objetivo, passos, documentos, prazos e estado.
- **Cofre Digital Pessoal.** Os dados, os documentos e as intenções da pessoa (abrir uma esplanada, construir uma casa) ficam cifrados e sob o seu controlo. Em cada pedido, a Câmara recebe apenas os dados estritamente necessários.
- **Porta Agêntica Municipal.** É um contrato aberto que define como agentes autorizados tratam serviços municipais. Pode ser usado pelo Henriques, pelo atendedor da Câmara ou por outros agentes, sempre com as mesmas regras, mandato e registo de auditoria.
- **Consola Municipal.** Os técnicos recebem os casos já preparados, com fontes e dados verificados, e concentram-se na decisão.
- **Intenções do Concelho.** É uma vista da Consola onde a Câmara vê o que a cidade quer fazer. As intenções guardadas nos Cofres juntam-se de forma anónima, e só quando a pessoa dá consentimento explícito. Aparecem organizadas por freguesia e por tema, com as motivações, os desejos para a cidade e o horizonte em que as pessoas pretendem avançar. Há quatro salvaguardas:
  - grupos com menos de 10 pessoas não são publicados;
  - os agregados levam ruído estatístico;
  - nenhum dado individual sai do Cofre;
  - os dados só servem a Câmara e não são vendidos.

  Com esta informação, a Câmara pode tomar decisões estratégicas, desenhar políticas públicas ao encontro do que os munícipes querem e medir se uma medida está a ter efeito naquilo que as pessoas perguntam, desejam e planeiam.

---

## O que traz de novo

- **Representa a pessoa.** Não é mais um canal de informação da Câmara: guarda o contexto que a pessoa autoriza, acompanha os pedidos e age com mandato.
- **Decide por escolhas fechadas, não por texto livre.** Cada mensagem passa por escolhas definidas em código: que serviço se aplica, se responde, se abstém, se encaminha ou se recusa, e que mandato é necessário. Um verificador bloqueia qualquer número que não conste da fonte oficial, e cada decisão fica registada e visível.
- **Inverte a integração.** A Câmara não tem de abrir os seus sistemas internos. Implementa um contrato público, serviço a serviço, em quatro níveis: de I0 (orientação, sem integração nenhuma) a I3 (ação de ponta a ponta). Um fornecedor de software autárquico que implemente o contrato pode servir vários municípios.
- **Pode ser auditado.** Cada passo gera um evento selado (SHA-256), que mostra o que o representante fez e com que fundamento.
- **Mostra a procura antes de ela chegar ao balcão.** Hoje, a Câmara só fica a saber o que as pessoas querem fazer quando o pedido entra. Com as Intenções do Concelho, passa a conhecer essa procura com antecedência, por freguesia e por tema, sem saber quem é quem.

---

## O que está construído

O protótipo funciona e foi construído de raiz durante o hackathon, entre 19 e 23 de outubro de 2026.

- O **Henriques funciona no Telegram**, com respostas geradas em tempo real.
- **Base de conhecimento com 224 documentos públicos do Município:** portal, diretório de serviços, 98 procedimentos, formulários, regulamentos, taxas e urbanismo. Foram consultados a 19/10/2026 e cada um guarda o endereço de origem e uma impressão digital SHA-256.
- **Registo Canónico com 16 fichas de serviços municipais**, curadas a partir de fontes oficiais. Inclui, por exemplo, esplanadas, licença especial de ruído, inspeção de ascensores, número de porta e pedido de informação prévia.
- **Fluxo completo da comunicação prévia de esplanada:** pergunta, resposta com fonte, mandato, recolha de dados para o Cofre, autenticação e criação do processo na Câmara.
- **Porta Agêntica com sete operações:** procurar serviços, consultar um serviço, criar um rascunho, submeter uma comunicação prévia, consultar o estado de um processo, responder a um pedido de elementos e obter uma referência de pagamento.
- **Cofre Digital Pessoal** cifrado com AES-256-GCM e **mandatos por níveis**.
- **Consola Municipal** e **painel de observação em tempo real**, que mostra a conversa, a árvore de decisão, o Cofre e as chamadas à Porta.
- **Vista Intenções do Concelho** na Consola. Mostra as salvaguardas de privacidade, os indicadores, o mapa por freguesia e tema, as motivações, os desejos para a cidade e quando as pessoas pretendem avançar. Usa dados sintéticos.
- **Testes automatizados** do registo, da Porta, do motor de decisão, da base de conhecimento e dos fluxos.
- **Conjunto de avaliação** com 42 perguntas em cinco categorias: serviços do catálogo, perguntas sem fonte, pedidos fora da competência municipal, pedidos de juízo técnico, e tentativas de manipulação ou de acesso a dados de terceiros. As perguntas foram escritas pela equipa, por isso não apresentamos o resultado como medida de precisão. A precisão em uso real mede-se no piloto.

**Partes simuladas.** Estão assinaladas como «Simulação» na interface: a autenticação com Chave Móvel Digital, os sistemas internos da Câmara e o número de processo. Os dados da vista Intenções do Concelho são sintéticos e estão marcados como tal. O protótipo não usa dados pessoais reais.

---

## Impacto

- **Munícipes:** menos deslocações, chamadas e repetição de informação, com acompanhamento do pedido do princípio ao fim.
- **Empresas:** menos tempo e menos custo para perceber o caminho até abrir, licenciar ou construir.
- **Câmara:** pedidos mais completos à primeira, técnicos concentrados na decisão e dados concretos sobre onde o serviço tem fricção.
- **Gestão do concelho:** planear com base no que as pessoas querem fazer, antes de os pedidos chegarem, e acompanhar o efeito das políticas públicas no que os munícipes perguntam, desejam e planeiam.
- **Cidade:** um serviço público pioneiro, alinhado com a candidatura de Guimarães a Cidade Europeia da Inovação.

**Estimativa para a Câmara.** Usámos um modelo de custeio por atividades. Os volumes são os dos relatórios de atividades da Câmara (fevereiro a novembro de 2025). As restantes variáveis são **hipóteses, que o piloto vai medir**: a parte dos contactos resolvida pelo representante, 4 minutos por chamada, 8 minutos por email e o tempo poupado na instrução.

- Se o representante resolver **um em cada cinco** atendimentos presenciais, chamadas e emails, a Câmara liberta entre **2.756 e 3.345 horas de trabalho** em 10 meses.
- Se 30% dos processos de urbanismo e de serviços urbanos chegarem como casos preparados, poupando 10 minutos cada, somam-se cerca de **467 horas**.
- No total, são **3.223 a 3.812 horas** em 10 meses, o equivalente a **2,4 a 2,9 pessoas a tempo inteiro**. É capacidade libertada para instruir, decidir e apoiar quem precisa, não redução de pessoal.
- **Exemplo por processo** (hipótese): numa comunicação prévia de esplanada, o trabalho da Câmara passa de cerca de 69 para 27 minutos, menos 60%. Para o munícipe, o tempo gasto passa de cerca de 2 h 50 min para cerca de 15 minutos.

---

## Continuidade

- **Implantação gradual.** O Delegate pode começar sem integração nenhuma (nível I0, orientação com fonte) e subir serviço a serviço até à ação de ponta a ponta (I3), ao ritmo da Câmara.
- **Piloto.** Propomos um piloto de cinco meses com a Câmara Municipal e as Juntas de Freguesia, para medir o que hoje é hipótese: a parte de contactos informativos, os tempos por tarefa, os pedidos incompletos e o tempo de instrução.
- **Replicação.** Muitos procedimentos decorrem de lei nacional (Licenciamento Zero, RJUE, CPA) e são iguais nos 308 municípios portugueses. Só muda a parte municipal: regulamentos, taxas e serviços responsáveis. O passo seguinte são os municípios da Comunidade Intermunicipal do Ave.
- **Modelo de negócio.** O munícipe nunca paga. A Câmara paga uma subscrição, cujo preço deve ficar abaixo da poupança medida no piloto. Os agentes de terceiros que usem a Porta pagam pela utilização.
- **Código aberto.** O código é publicado sob licença EUPL-1.2, para que qualquer município o possa reutilizar sem depender de um fornecedor.
- **Próximos passos:** canal WhatsApp, autenticação real com Chave Móvel Digital, avisos proativos a partir do Cofre e Intenções do Concelho alimentadas por Cofres reais, com consentimento, durante o piloto.

---

## Ferramentas e serviços de terceiros

- **OpenRouter**, para o modelo `typesafe/jev-router` (TypeSafe Jev), usado nas decisões e na ordenação de resultados, e para a redação de respostas e os embeddings.
- **Cloudflare**, para converter em Markdown as páginas públicas do Município durante a ingestão da base de conhecimento.
- **Telegram Bot API**, através da biblioteca grammY.
- **Model Context Protocol**: SDK oficial em TypeScript.
- **Bibliotecas:** Node.js, TypeScript, PostgreSQL (embedded-postgres), Zod, Vitest e tsx.
- **Fonte Manrope**, com licença SIL Open Font License.

Todo o conteúdo municipal usado é público e vem do portal da Câmara Municipal de Guimarães e da legislação publicada.
