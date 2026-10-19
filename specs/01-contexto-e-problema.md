# 01 · Contexto e problema

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Declaração do problema

> **Para resolver uma necessidade simples junto da Câmara, a pessoa tem de descobrir sozinha que procedimento se aplica, que documentos entregar, em que canal e com que regras. A informação existe, mas está dispersa por vários portais e escrita em linguagem técnica.**

O processo administrativo é necessário: protege o interesse público, aplica regras e deixa prova. O erro é fazer do cidadão o gestor dessa complexidade.

```text
Hoje
necessidade → a pessoa descobre o serviço → a pessoa aprende a burocracia → a Câmara trata o processo

Com o Delegate
necessidade → o representante entende o contexto → orquestra Câmara e Freguesias → resultado útil, com fonte e recibo
```

## 2. Quem sente o problema

| Quem | Como o sente |
|---|---|
| Pequenos negócios (restauração, comércio) | Licenças, ocupação do espaço público, publicidade e horários consomem tempo que não têm. Pagam a terceiros só para perceber o caminho. |
| Proprietários e famílias | Obras, terrenos, PDM, certidões, número de porta. Termos como «destaque», «dominialidade» ou «compropriedade» não dizem nada a quem não é técnico. |
| Administradores de condomínio | Inspeções e reinspeções de ascensores, obras em partes comuns, vários prédios em simultâneo. |
| Pessoas com baixa literacia digital | Dependem do balcão, do telefone ou de familiares. |
| Técnicos municipais | Recebem pedidos incompletos, respondem às mesmas perguntas e explicam estados de processo por telefone. |

## 3. Evidência em Guimarães

Fonte: [dossiê da Câmara](../reference-docs/Camara_Municipal_de_Guimaraes_Servicos_e_Indicadores_2025.md), compilado a partir dos relatórios de atividades oficiais. Janela de **fevereiro a novembro de 2025 (10 meses)**. ✅

### 3.1 Volumes de atendimento

| Indicador | Total 10 meses | Unidade |
|---|---:|---|
| Atendimentos presenciais no Balcão Único (BUA) | 22.425 | atendimentos, não pessoas únicas |
| Chamadas atendidas (Telefonistas + BUA) | 41.473 | chamadas, não assuntos únicos |
| Registos de correspondência | 28.308 | registos, 88,7% por email |
| Processos registados e tratados no Urbanismo Digital | 7.141 | registos na plataforma |
| Formulários online validados | 2.844 | formulários |
| Pedidos de certidões no BUA | 1.640 | pedidos |
| Atendimentos em Espaços Cidadão das Juntas | 4.661 | atendimentos |

Tempo médio de atendimento presencial: entre **20min31s e 28min24s** conforme o período. O tempo médio de espera desceu de 7min12s para 4min13s ao longo de 2025.

### 3.2 Procedimentos com volume conhecido (Gabinete de Serviços Urbanos)

| Procedimento | Total 10 meses | Natureza |
|---|---:|---|
| Inspeção ou reinspeção de ascensores | 751 | pedidos |
| Licenças de ruído, fogo e obras | 655 | licenças |
| Ocupação de espaço público para obras | 407 | licenças |
| Recintos improvisados e itinerantes | 197 | licenças |
| Publicidade | 183 | licenças |

Outros sinais (setembro a novembro de 2025): **1.029 consultas de processos de urbanismo** no Arquivo Municipal (82,4% dos documentos consultados) e **77 denúncias** de vegetação não limpa em solo urbano.

### 3.3 Regras de uso destes números

Estas regras são obrigatórias no pitch, no protótipo e em qualquer material:

1. Não somar indicadores diferentes. Não há «X pedidos totais».
2. Não apresentar a janela de 10 meses como «ano de 2025».
3. Não transformar atendimentos ou chamadas em pessoas únicas.
4. Não ordenar estes números como ranking dos serviços mais procurados. Esse ranking **não existe publicamente**.
5. Indicar sempre período, unidade e fonte.

<a id="o-que-ja-existe"></a>
## 4. O que já existe

### 4.1 Canais da Câmara

| Canal | Função | Limite para o Delegate |
|---|---|---|
| Portal e catálogo de Serviços | Informação por área | Conteúdo disperso |
| [Diretório de Serviços](https://diretorio.cm-guimaraes.pt/) | Requisitos, documentos, taxas e canais por serviço | Cada ficha tem de ser confirmada |
| [Formulários online](https://www.cm-guimaraes.pt/servicos-online/formularios) | Portas de entrada de procedimentos | Muitos exigem autenticação |
| Serviços Online e área reservada | Submissão e acompanhamento, com CMD | Sem API pública conhecida |
| Urbanismo Digital | Pedir, consultar e pagar procedimentos urbanísticos | Sem API pública conhecida |
| Balcão Único (BUA) e Balcão Virtual | Atendimento presencial e online | — |
| **[Atendimento online com IA](https://www.cm-guimaraes.pt/pages/1781)** | Responde a dúvidas, passa para operador humano, permite videochamada e agendamento | Sem métricas públicas de cobertura, precisão ou resolução |
| Espaços Cidadão nas Juntas | Atendimento de proximidade, também de serviços nacionais | Competências distintas das da Câmara |
| WebSIG e PDM | Informação geográfica e planos | Não substitui consulta vinculativa |

### 4.2 O que isto significa para o Delegate

O município **já tem assistência conversacional**. O Delegate não pode apresentar-se como «o chatbot que faltava». Tem de demonstrar o que o dossiê identifica como lacunas verificáveis (secção 12.1-E):

| Lacuna | Resposta do Delegate |
|---|---|
| Cobertura e precisão não medidas publicamente | Avaliação com perguntas reais e resultados publicados ([12](12-ia-e-avaliacao.md)) |
| Respostas sem fonte e versão visíveis | Fonte, data de consulta e versão em cada resposta |
| Orientação para o procedimento certo | Identificação do procedimento e missão com passos |
| Continuidade entre canais e no tempo | Missão e Cofre persistentes, alertas autorizados |
| Agir em nome da pessoa | Mandato Digital por níveis |
| Integração com outros agentes | Porta Agêntica aberta, que pode servir o próprio atendedor |
| Dados para gestão | Consola, painéis de fricção e Mapa de Intenções |

### 4.3 Lacunas de informação pública

Não foi identificado publicamente ([dossiê, secção 11](../reference-docs/Camara_Municipal_de_Guimaraes_Servicos_e_Indicadores_2025.md)):

- ranking dos 10 ou 20 procedimentos mais pedidos;
- motivos das chamadas e dos emails;
- tempo médio de decisão por licença;
- percentagem de pedidos incompletos à primeira;
- eficácia do atendedor virtual atual;
- dados abertos estruturados (a página de dados abertos indicava «Brevemente disponível»).

Estas lacunas são as perguntas do piloto ([18](18-metricas-e-okr.md)) e do pedido de dados à Câmara ([17](17-go-to-market-e-roadmap.md)).

## 5. Porquê agora

| Sinal | Implicação |
|---|---|
| ✅ O Hack4Guimarães 2035 tem um desafio dedicado: «Falar com a Câmara sem Burocracia» | Procura explícita do Município |
| ✅ Guimarães candidata-se a Cidade Europeia da Inovação | Um projeto pioneiro de serviço público reforça a candidatura |
| ✅ Guimarães é Capital Verde Europeia 2026 | Ligação às missões verdes |
| ✅ Cada Estado-Membro tem de disponibilizar uma carteira europeia de identidade digital até 24/12/2026 | A identidade fica resolvida; o Delegate foca-se em intenções, provas e mandatos |
| ✅ Agentes de IA generalistas começam a agir em nome de pessoas; o Reino Unido prepara testes em serviços públicos a partir de 2027 | A interface conversacional torna-se commodity; o valor está na porta governada |
| ⚠️ Novo regime do Código dos Contratos Públicos desde 01/10/2026, com ajuste direto de serviços até 75.000 € | Piloto contratável rapidamente (confirmar no Diário da República) |
| ✅ A proposta de 2.ª revisão do PDM foi aprovada pela Câmara a 14/09/2026 e segue para a Assembleia Municipal | Caso proativo real e oportuno |

## 6. Hipótese central

> 🧪 **Se** a pessoa puder dizer o que precisa e receber o procedimento certo, com fonte, passos e acompanhamento, **então** haverá menos contactos repetidos, mais pedidos completos à primeira e menos tempo até ao ato, **sem** perda de rigor nem de controlo humano.

Esta hipótese é testada em duas etapas: no protótipo, pela qualidade das respostas medida no conjunto de avaliação; no piloto, pelos indicadores operacionais contra uma linha de base ([18](18-metricas-e-okr.md)).
