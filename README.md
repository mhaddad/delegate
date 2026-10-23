<p align="center">
  <img src="images/thumb-video-delegate.png" alt="Delegate. Hack4Guimarães 2035, desafio 3.4. Diga o que precisa. O Henriques trata do resto. O Henriques, o representante digital, à porta de uma muralha com a inscrição «Guimarães»." width="100%">
</p>

# Delegate

**Diga o que precisa. O Henriques trata do resto.**

O Delegate dá a cada pessoa e a cada empresa de Guimarães um representante digital, o **Henriques**. O Henriques responde a perguntas sobre serviços municipais com a fonte oficial à vista e trata dos pedidos em nome da pessoa, sempre com a sua autorização explícita. Do lado da Câmara, os técnicos recebem casos já preparados para decisão.

Projeto do **Hack4Guimarães 2035**, desafio **3.4 · Falar com a Câmara sem Burocracia** (Tecnologias Inteligentes).

<p>
  <a href="https://mhaddad.github.io/delegate/"><strong>Página do projeto</strong></a> ·
  <a href="https://t.me/afonso_cm_bot"><strong>Henriques no Telegram</strong></a> ·
  <a href="https://delegate-bay.vercel.app/#painel"><strong>Painel do Delegate</strong></a> ·
  <a href="https://delegate-bay.vercel.app/#consola"><strong>Consola da Câmara</strong></a>
</p>

---

## Ficha do projeto

| | |
|---|---|
| **Nome** | Delegate |
| **Proposta** | Um representante digital para cada munícipe tratar dos seus assuntos com a Câmara |
| **Evento** | [Hack4Guimarães 2035](https://taikai.network/cmguimaraes/hackathons/hack4guimaraes2035), promovido pelo Município de Guimarães no Mês da Economia 2026 |
| **Desafio** | 3.4 · Falar com a Câmara sem Burocracia |
| **Área** | Tecnologias Inteligentes |
| **Mentoria** | Filipe Novais (DTx), CCG/ZGDV |
| **Equipa** | Paulo Ribeiro, Matheus Haddad e Daiana Haddad ([ver equipa](#equipa)) |
| **Estado** | Protótipo funcional, construído de raiz de 19 a 23 de outubro de 2026 |
| **Página do projeto** | <https://mhaddad.github.io/delegate/> |
| **Produção provisória** | Painel: <https://delegate-bay.vercel.app/#painel> · Consola: <https://delegate-bay.vercel.app/#consola> |
| **Canal do munícipe** | Telegram, [@afonso_cm_bot](https://t.me/afonso_cm_bot) |
| **Tecnologia** | TypeScript (Node.js 22), Model Context Protocol, PostgreSQL, Telegram Bot API, OpenRouter |
| **Licença** | [EUPL-1.2](prototipo/LICENSE), código aberto e reutilizável por qualquer município |

---

## Experimentar

O protótipo está a funcionar. A demonstração tem três faces, que se veem ao mesmo tempo:

| Onde | O que se vê |
|---|---|
| **[Henriques no Telegram](https://t.me/afonso_cm_bot)** | A conversa do munícipe. Pergunte, por exemplo, o que é preciso para abrir uma esplanada. O bot chama-se `@afonso_cm_bot` por razões técnicas; quem responde é o Henriques. |
| **[Painel do Delegate](https://delegate-bay.vercel.app/#painel)** | Os bastidores em tempo real: a conversa, a árvore de decisão, o Cofre Digital Pessoal e cada chamada à Porta Agêntica Municipal. |
| **[Consola da Câmara](https://delegate-bay.vercel.app/#consola)** | O lado dos técnicos municipais: casos já preparados, com fontes e dados verificados, prontos para decisão. |

O alojamento na Vercel é o **ambiente de produção provisório** do Delegate durante o hackathon.

> **Simulação.** A autenticação com Chave Móvel Digital, os sistemas internos da Câmara e o número de processo são simulados e estão assinalados como «Simulação» na interface. O protótipo não usa dados pessoais reais.

---

## O desafio

> **3.4 · Falar com a Câmara sem Burocracia.** Saber que licença é precisa, que documentos entregar ou o estado de um processo obriga muitas vezes a ir ao balcão; a informação existe, mas está dispersa e em linguagem difícil. *Como tornar os serviços municipais mais acessíveis e compreensíveis?*
>
> **Bom resultado:** alguém faz uma pergunta real sobre um serviço municipal e obtém uma resposta correta, em linguagem simples, com a fonte à vista.

O Delegate cumpre esse critério e vai além da resposta: encaminha para o procedimento certo, acompanha o pedido ao longo do tempo e age em nome da pessoa quando ela o autoriza. **Sem fonte válida, o Henriques abstém-se e encaminha. Nunca inventa.**

---

## O problema

Para resolver uma necessidade junto da Câmara, o munícipe tem de descobrir sozinho que procedimento se aplica, que documentos entregar, em que canal, com que regras e a que custo. A informação está repartida pelo portal, pelo diretório de serviços, por formulários, regulamentos e tabelas de taxas, e está escrita em linguagem técnica.

| Indicador | Valor |
|---|---|
| Atendimentos presenciais no Balcão Único | **22.425**, com duração média entre 20 min 31 s e 28 min 24 s |
| Chamadas atendidas | **41.473** |
| Registos de correspondência | **28.308**, dos quais 88,7% por email |
| Processos registados no Urbanismo Digital | **7.141** |
| Pedidos de inspeção ou reinspeção de ascensores | **751** |
| Licenças de ocupação do espaço público para obras | **407** |

*Fonte: relatórios de atividades da Câmara Municipal de Guimarães, fevereiro a novembro de 2025.* Não há dados públicos sobre a parte destes contactos que é apenas informativa ou que poderia ser evitada. Medi-la é um dos objetivos do piloto.

O Município já tem um atendedor virtual com IA, e o Delegate não o substitui. Acrescenta o que um assistente de perguntas e respostas não faz sozinho.

---

## A solução

| Componente | O que faz |
|---|---|
| **Henriques, o representante digital** | Recebe pedidos em linguagem natural, identifica o procedimento aplicável e responde em linguagem simples. Cita sempre a fonte oficial: documento, artigo e data de consulta. |
| **Mandato digital** | A autorização que a pessoa dá ao representante, em níveis que vão de informar (D0) a agir dentro de regras definidas (D4). Pode ser revogada a qualquer momento. Sem mandato, nenhuma ação é executada. |
| **Missão** | Cada pedido passa a ser um processo acompanhado, com objetivo, passos, documentos, prazos e estado. |
| **Cofre Digital Pessoal** | Os dados e documentos da pessoa ficam cifrados e sob o seu controlo. Em cada pedido, a Câmara recebe apenas os dados estritamente necessários. |
| **Porta Agêntica Municipal** | Um contrato aberto que define como agentes autorizados tratam serviços municipais. Pode ser usado pelo Henriques, pelo atendedor da Câmara ou por outros agentes, sempre com as mesmas regras, mandato e registo de auditoria. |
| **Consola Municipal** | Os técnicos recebem os casos já preparados, com fontes e dados verificados, e concentram-se na decisão. |

### O que traz de novo

- **Representa a pessoa.** Não é mais um canal de informação da Câmara: guarda o contexto que a pessoa autoriza, acompanha os pedidos e age com mandato.
- **Decide por escolhas fechadas, não por texto livre.** Cada mensagem passa por escolhas definidas em código: que serviço se aplica, se responde, se abstém, se encaminha ou se recusa, e que mandato é necessário. Um verificador bloqueia qualquer número que não conste da fonte oficial, e cada decisão fica registada e visível.
- **Inverte a integração.** A Câmara não tem de abrir os seus sistemas internos. Implementa um contrato público, serviço a serviço, em quatro níveis: de I0 (orientação, sem integração nenhuma) a I3 (ação de ponta a ponta). Um fornecedor de software autárquico que implemente o contrato pode servir vários municípios.
- **Pode ser auditado.** Cada passo gera um evento selado (SHA-256), que mostra o que o representante fez e com que fundamento.

---

## O que está construído

- O **Henriques funciona no Telegram**, com respostas geradas em tempo real.
- **Base de conhecimento com 224 documentos públicos do Município:** portal, diretório de serviços, 98 procedimentos, formulários, regulamentos, taxas e urbanismo. Consultados a 19/10/2026, cada um guarda o endereço de origem e uma impressão digital SHA-256.
- **Registo Canónico com 16 fichas de serviços municipais**, curadas a partir de fontes oficiais: esplanadas, licença especial de ruído, inspeção de ascensores, número de porta, pedido de informação prévia, entre outras.
- **Fluxo completo da comunicação prévia de esplanada:** pergunta, resposta com fonte, mandato, recolha de dados para o Cofre, autenticação e criação do processo na Câmara.
- **Porta Agêntica com sete operações:** procurar serviços, consultar um serviço, criar um rascunho, submeter uma comunicação prévia, consultar o estado de um processo, responder a um pedido de elementos e obter uma referência de pagamento.
- **Cofre Digital Pessoal** cifrado com AES-256-GCM e **mandatos por níveis**.
- **Consola Municipal** e **painel de observação em tempo real**.
- **Testes automatizados** do registo, da Porta, do motor de decisão, da base de conhecimento e dos fluxos.
- **Conjunto de avaliação com 42 perguntas** em cinco categorias: serviços do catálogo, perguntas sem fonte, pedidos fora da competência municipal, pedidos de juízo técnico, e tentativas de manipulação ou de acesso a dados de terceiros. As perguntas foram escritas pela equipa, por isso não apresentamos o resultado como medida de precisão. A precisão em uso real mede-se no piloto.

---

## Impacto

| Para quem | O que muda |
|---|---|
| **Munícipes** | Menos deslocações, chamadas e repetição de informação, com acompanhamento do pedido do princípio ao fim. |
| **Empresas** | Menos tempo e menos custo para perceber o caminho até abrir, licenciar ou construir. |
| **Câmara** | Pedidos mais completos à primeira, técnicos concentrados na decisão e dados concretos sobre onde o serviço tem fricção. |
| **Cidade** | Um serviço público pioneiro, alinhado com a candidatura de Guimarães a Cidade Europeia da Inovação. |

### Estimativa para a Câmara (hipótese a medir no piloto)

Modelo de custeio por atividades. Os volumes são os dos relatórios de atividades da Câmara (fevereiro a novembro de 2025). A parte dos contactos resolvida pelo representante, os 4 minutos por chamada, os 8 minutos por email e o tempo poupado na instrução são **hipóteses**.

- Se o representante resolver **um em cada cinco** atendimentos presenciais, chamadas e emails, a Câmara liberta entre **2.756 e 3.345 horas de trabalho** em 10 meses.
- Se 30% dos processos de urbanismo e de serviços urbanos chegarem como casos preparados, poupando 10 minutos cada, somam-se cerca de **467 horas**.
- No total, **3.223 a 3.812 horas** em 10 meses, o equivalente a **2,4 a 2,9 pessoas a tempo inteiro**. É capacidade libertada para instruir, decidir e apoiar quem precisa, não redução de pessoal.
- **Exemplo por processo:** numa comunicação prévia de esplanada, o trabalho da Câmara passa de cerca de 69 para 27 minutos (menos 60%). Para o munícipe, de cerca de 2 h 50 min para cerca de 15 minutos.

---

## Continuidade

- **Implantação gradual.** O Delegate pode começar sem integração nenhuma (nível I0, orientação com fonte) e subir serviço a serviço até à ação de ponta a ponta (I3), ao ritmo da Câmara.
- **Piloto.** Propomos um piloto de cinco meses com a Câmara Municipal e as Juntas de Freguesia, para medir o que hoje é hipótese: a parte de contactos informativos, os tempos por tarefa, os pedidos incompletos e o tempo de instrução.
- **Replicação.** Muitos procedimentos decorrem de lei nacional (Licenciamento Zero, RJUE, CPA) e são iguais nos 308 municípios portugueses. Só muda a parte municipal: regulamentos, taxas e serviços responsáveis. O passo seguinte são os municípios da Comunidade Intermunicipal do Ave.
- **Modelo de negócio.** O munícipe nunca paga. A Câmara paga uma subscrição, cujo preço deve ficar abaixo da poupança medida no piloto. Os agentes de terceiros que usem a Porta pagam pela utilização.
- **Código aberto.** Publicado sob licença EUPL-1.2, para que qualquer município o possa reutilizar sem depender de um fornecedor.
- **Próximos passos:** canal WhatsApp, autenticação real com Chave Móvel Digital, avisos proativos a partir do Cofre e uma visão agregada e anónima do que a cidade pretende fazer.

---

## Critérios de avaliação

Onde encontrar, neste repositório, a resposta a cada critério do júri:

| Critério | Peso | Onde se vê |
|---|---|---|
| **Inovação e originalidade** | 25% | Representante do lado da pessoa, mandato por níveis, Porta Agêntica com integração invertida ([O que traz de novo](#o-que-traz-de-novo)) |
| **Viabilidade técnica** | 25% | Protótipo a funcionar no Telegram, Painel e Consola em produção provisória, testes automatizados e conjunto de avaliação ([O que está construído](#o-que-está-construído), [`prototipo/`](prototipo/)) |
| **Impacto e relevância** | 30% | Dados da procura de atendimento em Guimarães e estimativa de horas libertadas ([O problema](#o-problema), [Impacto](#impacto)) |
| **Apresentação e continuidade** | 20% | Piloto, implantação gradual, replicação e modelo de negócio ([Continuidade](#continuidade)) |

---

## Equipa

Três percursos diferentes para o mesmo problema: engenharia de agentes e segurança, gestão de empresas e produto, administração e ligação à cidade. O Delegate precisava das três coisas: um agente em que se possa confiar, um serviço que se sustente e uma proposta que faça sentido para quem vive em Guimarães.

<table>
  <tr>
    <td width="33%" valign="top" align="center">
      <img src="site/assets/equipa/paulo.jpg" alt="Paulo Ribeiro" width="160"><br>
      <strong>Paulo Ribeiro</strong><br>
      <sub>IA e segurança</sub>
    </td>
    <td width="33%" valign="top" align="center">
      <img src="site/assets/equipa/matheus.jpg" alt="Matheus Haddad" width="160"><br>
      <strong>Matheus Haddad</strong><br>
      <sub>Gestão e produto</sub>
    </td>
    <td width="33%" valign="top" align="center">
      <img src="site/assets/equipa/daiana.jpg" alt="Daiana Haddad" width="160"><br>
      <strong>Daiana Haddad</strong><br>
      <sub>Administração e cidade</sub>
    </td>
  </tr>
</table>

**Paulo Ribeiro** · *IA e segurança.* Engenheiro de software que passou a analista de segurança da informação e investigador, natural de Guimarães. Tem construído pipelines de dados, quadros de avaliação e ferramentas inteligentes onde se cruzam a inteligência artificial, a segurança e a conformidade regulamentar. Está a fazer o doutoramento sobre o uso de LLM para automatizar a engenharia de segurança e de conformidade. O que hoje mais o motiva é desenhar, orquestrar e pôr à prova sistemas multiagente perante problemas reais.

**Matheus Haddad** · *Gestão e produto.* Empresário e cofundador de empresas de tecnologia, consultoria e educação. Começou pela Webgoal, uma das primeiras empresas de desenvolvimento ágil de software no Brasil e hoje uma holding; seguiram-se o Granatum, o Ateliê de Software, a Orgganica e a Escola Lumiar Poços de Caldas. Licenciado em Ciência da Computação, mestre em Inteligência Artificial e com MBA em Gestão Empresarial, gere empresas desde 2008 com uma aposta: organizações transparentes, autónomas e centradas nas pessoas dão melhores resultados.

**Daiana Haddad** · *Administração e cidade.* Empreendedora, licenciada em Ciência da Computação pela Unifenas, com especialização em Design Gráfico 3D. Junta a formação técnica a um olhar visual e à experiência de gestão: tem apoiado a administração das empresas do grupo Webgoal, um trabalho que pede visão de conjunto sem perder o detalhe. Em Guimarães, desenvolve projetos culturais no âmbito da Capital Verde Europeia, em contacto direto com as instituições e as pessoas da cidade. É essa ligação ao terreno que traz à equipa.

---

## Estrutura do repositório

| Pasta | Conteúdo |
|---|---|
| [`prototipo/`](prototipo/README.md) | O protótipo: núcleo (Henriques, Telegram, Cofre, mandatos), Porta Agêntica, Registo Canónico, avaliação e testes |
| [`site/`](site/) | A página do projeto, publicada em <https://mhaddad.github.io/delegate/> |
| [`docs/clients/`](docs/clients/README.md) | Documentação pública do Delegate: problema e solução, funcionalidades, diferenciais, impacto (Markdown e PDF) |
| [`specs/`](specs/README.md) | Especificações do produto: contexto, requisitos, arquitetura, IA e avaliação, negócio, registo de decisões |
| [`specs/strategy/`](specs/strategy/README.md) | Estratégia de construção do protótipo para a semana do hackathon |
| [`design-system/`](design-system/README.md) | Logótipo, cores e tipografia do Delegate |
| [`reference-docs/`](reference-docs/) | Documentos de referência: dossiê de serviços e indicadores da Câmara, regras do hackathon, painel e consola |
| [`documentos_demonstracao/`](documentos_demonstracao/) | Documentos fictícios usados na demonstração do fluxo da esplanada |
| [`videos/`](videos/) | Roteiros e código-fonte dos vídeos de conceito e de pitch |

## Executar localmente

Requer Node.js 22 ou superior. As instruções completas, os comandos e as dependências estão em [`prototipo/README.md`](prototipo/README.md).

```bash
cd prototipo
npm install
npm run nucleo
```

---

## Origem dos materiais e ferramentas

O código do protótipo foi criado a partir do arranque, a 19/10/2026.

**Serviços e bibliotecas de terceiros:**

- **OpenRouter**, para o modelo `typesafe/jev-router` (TypeSafe Jev), usado nas decisões e na ordenação de resultados, e para a redação de respostas e os embeddings.
- **Cloudflare**, para converter em Markdown as páginas públicas do Município durante a ingestão da base de conhecimento.
- **Telegram Bot API**, através da biblioteca grammY.
- **Model Context Protocol**, SDK oficial em TypeScript.
- **Bibliotecas:** Node.js, TypeScript, PostgreSQL (embedded-postgres), Zod, Vitest e tsx.
- **Fonte Manrope**, com licença SIL Open Font License.
- **Vercel**, para o ambiente de produção provisório, e **GitHub Pages**, para a página do projeto.

Documentação e materiais produzidos com apoio de IA (Claude, Anthropic). Narração, música e efeitos dos vídeos gerados com ElevenLabs.

Todo o conteúdo municipal usado é público e vem do portal da Câmara Municipal de Guimarães e da legislação publicada.

## Licença

[EUPL-1.2](prototipo/LICENSE), escolhida para que a Câmara e qualquer outro município possam reutilizar o código sem depender de um fornecedor.
