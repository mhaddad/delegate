# 05 · Jornadas

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Visão geral

| ID | Jornada | Persona | Tipo | Release | Porquê |
|---|---|---|---|---|---|
| J1 | Esplanada da Casa Joaquim | P1 | Transação (caso âncora) | **R0** | Baixo risco, regulamento verificado, transação completa |
| J2 | Alerta da revisão do PDM | P1 | Proativa | **R0** | Oportuna; mostra memória e autorização |
| J3 | Inspeção de ascensor | P3 | Informação + missão | **R0** (informação) · R1 (missão) | 751 pedidos em 10 meses |
| J4 | Ocupação da via pública para obras | P3 | Informação + missão | **R0** (informação) · R1 | 407 licenças em 10 meses |
| J5 | Denúncia de vegetação por limpar | P2 | Ocorrência | R0 (informação) · R1 | Inclusão via Junta |
| J6 | Cópia ou consulta de processo | P1, P3 | Encaminhamento | **R0** | Vários canais possíveis (BUA, Arquivo, Urbanismo Digital) |
| J7 | Pedido fora de competência | P2 | Encaminhamento | **R0** | O Henriques sabe o que não é da Câmara |
| J8 | Técnico na Consola | P5 | Interna | **R0** (simulada) · R1 | Mostra o lado da Câmara |

Formato de cada jornada: **gatilho → passos → dados mínimos → nível de delegação → fronteira pública → critério de sucesso**.

---

<a id="j1"></a>
## J1 · Esplanada da Casa Joaquim (caso âncora)

**Hoje:** a Inês não sabe se precisa de licença ou de comunicação prévia, quantas mesas pode ter, que taxa paga nem onde pedir. Pesquisa à noite, liga para a Câmara, adia.

**Com o Delegate:**

| # | Palco (o que a Inês vê) | Bastidores (o que acontece) |
|---|---|---|
| 1 | «Quero pôr uma esplanada à porta do restaurante.» | Entendimento de missão: intenção = ocupação do espaço público com esplanada |
| 2 | O Henriques pergunta número de mesas, meses e pede uma fotografia do passeio | Guardião de contexto: só pede o que a ficha exige |
| 3 | Explicação simples, com fonte: «Uma esplanada aberta, encostada à fachada e que não ultrapasse a largura do restaurante segue a mera comunicação prévia. Tem de deixar um corredor de 2 metros para peões.» | Navegador de regras: Regulamento de Ocupação do Espaço Público e Publicidade, art. 8.º e Anexo I ✅ |
| 4 | «Quer que guarde a esplanada no seu Cofre e prepare o pedido?» → «Sim» | Item no Cofre com finalidade e prazo; Mandato D3 para «ocupação do espaço público» |
| 5 | Checklist e rascunho do pedido para rever | Construtor de jornada; capacidade `criar_rascunho_ocupacao` (simulada em R0) |
| 6 | A Inês confirma com a Chave Móvel Digital | Simulado em R0; real em R1 no canal oficial |
| 7 | «Submetido. Aqui está o recibo. Aviso quando a época estiver a terminar.» | Recibo simulado em R0; alerta autorizado no Cofre |

- **Dados mínimos:** localização, atividade, número de mesas, área, período, fotografia do passeio.
- **Não partilha:** terreno em Ponte, outras conversas, preferências.
- **Fronteira pública:** a avaliação técnica local é da Câmara; a taxa aparece como «calculada pela Câmara» enquanto não houver fonte com valor.
- **Canal formal:** ⚠️ a confirmar na ficha oficial (Balcão do Empreendedor / Serviços Online). O dossiê indica que o BUA e o Espaço Empresa fazem atendimento mediado de meras comunicações prévias de restauração.
- **Sucesso:** a Inês sabe o que fazer em menos de 3 minutos, com a fonte, e tem o pedido pronto a submeter.

---

<a id="j2"></a>
## J2 · Alerta da revisão do PDM (proativa)

| # | Passo |
|---|---|
| 1 | A Inês pergunta: «Posso construir uma casa de 150 m² no terreno do meu avô, em Ponte?» |
| 2 | O Henriques **não emite juízo de viabilidade**. Explica que o PDM em vigor é o de 2015 e que a proposta de 2.ª revisão foi aprovada pela Câmara a 14/09/2026 e segue para a Assembleia Municipal ✅ |
| 3 | Explica o caminho formal: pedido de informação prévia (PIP) no Urbanismo Digital, e quando é preciso um técnico habilitado e para quê |
| 4 | Oferece: «Quer que guarde o terreno e a avise quando a revisão do PDM for votada?» → «Sim» (Mandato D1) |
| 5 | Dias depois: alerta autorizado sobre a votação, com ligação oficial |

- **Fronteira:** viabilidade e decisão pertencem ao serviço competente.
- **Sucesso:** a Inês entende o caminho e recebe o alerta apenas porque o autorizou.

---

<a id="j3"></a>
## J3 · Inspeção de ascensor

| # | Passo |
|---|---|
| 1 | Rita: «O elevador do prédio da Rua X chumbou na inspeção. O que tenho de fazer?» |
| 2 | O Henriques distingue **inspeção periódica**, **reinspeção** e **primeira inspeção**, que são formulários diferentes ✅ |
| 3 | Indica o formulário «Inspeção ou Reinspeção de Ascensores», documentos e canal, com fonte |
| 4 | R1: missão por prédio, com mandato da administração do condomínio e alertas de prazo |

Evidência: 751 pedidos em 10 meses de 2025, dos quais 98 reinspeções ✅.

---

<a id="j4"></a>
## J4 · Ocupação da via pública para obras

| # | Passo |
|---|---|
| 1 | «Vou pôr um andaime na fachada durante três semanas. Preciso de licença?» |
| 2 | O Henriques identifica o procedimento de ocupação de espaço público para obras e explica o que apresentar, com fonte |
| 3 | Se a pergunta envolve taxas ou prazos sem fonte, diz que não consegue confirmar e indica onde se confirma |

Evidência: 407 licenças em 10 meses de 2025 ✅.

---

<a id="j5"></a>
## J5 · Denúncia de vegetação por limpar

| # | Passo |
|---|---|
| 1 | O Sr. Albano, por áudio, através da filha: «O terreno ao lado tem mato até ao telhado.» |
| 2 | O Henriques explica o canal correto, que informação reunir (localização, fotografia se útil) e como acompanhar |
| 3 | R1: ficha de ocorrência para a equipa municipal; a Junta pode agir com mandato |

Evidência: 77 denúncias em solo urbano em setembro–novembro de 2025 ✅.

---

<a id="j6"></a>
## J6 · Cópia ou consulta de processo

O munícipe não sabe se deve ir ao BUA, ao Arquivo Municipal ou ao Urbanismo Digital. O Henriques clarifica a unidade e as opções, com fonte. Evidência: 481 consultas no BUA (10 meses) e 1.029 consultas de processos de urbanismo no Arquivo (set.–nov. 2025) ✅.

---

<a id="j7"></a>
## J7 · Pedido fora de competência

«Como renovo o Cartão de Cidadão?» O Henriques explica que é um serviço da Administração Central, indica o Espaço Cidadão mais próximo e a fonte nacional, e não inventa procedimentos.

---

<a id="j8"></a>
## J8 · Técnico na Consola

| # | Passo |
|---|---|
| 1 | Um caso chega à Consola: motivo do encaminhamento, resumo, fontes usadas, dados mínimos, proposta de ação, risco e prazo |
| 2 | A Marta aprova, corrige, pede um elemento, atribui ou escala |
| 3 | A decisão gera prova com identidade funcional, momento e fundamento |
| 4 | O Henriques traduz o resultado para a pessoa |

Em R0 o caso é simulado e marcado como tal.

---

## 2. Eventos de vida (R1+)

| Evento | Missões que o compõem |
|---|---|
| Abrir um restaurante | Licenciamento ou comunicação de restauração, esplanada, publicidade, horário de funcionamento |
| Construir casa | PIP, licenciamento ou comunicação prévia, ocupação de via pública, número de porta, licença de utilização |
| Organizar uma festa na freguesia | Festividades, licença de ruído, lançamento de fogo, ocupação de espaço público |
| Gerir um condomínio | Inspeções de ascensores, obras em fachadas, ocupação para obras |
