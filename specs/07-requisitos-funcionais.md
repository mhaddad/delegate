# 07 · Requisitos funcionais

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Prioridade MoSCoW refere-se a R0. Coluna «Rel.» indica a primeira release em que o requisito é obrigatório.

## Módulos

| Código | Módulo |
|---|---|
| CON | Conversa e canais |
| REG | Registo Canónico de Serviços |
| RES | Respostas com fonte |
| MIS | Missões |
| COF | Cofre Digital Pessoal |
| MAN | Mandato Digital |
| POL | Motor de política |
| AUD | Auditoria e prova |
| PRO | Proatividade |
| CNS | Consola Municipal |
| MAP | Mapa de Intenções e painéis |
| POR | Porta Agêntica |
| AVA | Avaliação de qualidade |

---

## CON · Conversa e canais

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-CON-01 | O munícipe conversa com o Henriques num chat web em linguagem natural, em PT-PT. | M | R0 |
| RF-CON-02 | O Henriques apresenta-se como assistente de IA na primeira mensagem de cada conversa e indica como falar com uma pessoa. | M | R0 |
| RF-CON-03 | O chat mostra, ao lado da conversa, o painel da missão ativa e do Cofre. | M | R0 |
| RF-CON-04 | O mesmo Henriques está disponível no WhatsApp (sandbox em R0; WhatsApp Business em R1). | C | R1 |
| RF-CON-05 | O munícipe pode enviar mensagens de voz, que são transcritas e tratadas como texto. | C | R1 |
| RF-CON-06 | A missão mantém-se entre canais (WhatsApp, portal, SMS, telefone, balcão) sem repetir a história. | W | R1 |
| RF-CON-07 | Passos sensíveis (autenticação, anexos, confirmação de atos) abrem numa vista web segura, fora do WhatsApp. | W | R1 |
| RF-CON-08 | O munícipe pode pedir uma pessoa a qualquer momento; o caso passa para a Consola com o contexto mínimo. | S | R0 (simulado) |

## REG · Registo Canónico de Serviços

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-REG-01 | Cada serviço é um registo estruturado segundo o esquema de [11](11-modelo-de-dados.md#servico). | M | R0 |
| RF-REG-02 | Cada registo guarda as fontes com URL, título, data de consulta e impressão digital (hash) do conteúdo. | M | R0 |
| RF-REG-03 | Cada registo tem versão e estado (`rascunho`, `revisto`, `validado`). Em R0 nenhum registo está `validado` pela Câmara. | M | R0 |
| RF-REG-04 | O registo distingue serviços da Câmara, de entidades municipais e da Administração Central. | M | R0 |
| RF-REG-05 | Um processo deteta alterações nas páginas de origem (hash diferente) e marca o registo para revisão. | C | R1 |
| RF-REG-06 | Os donos funcionais validam e versionam o conteúdo numa interface própria. | W | R1 |

## RES · Respostas com fonte

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-RES-01 | Cada resposta factual cita pelo menos uma fonte do Registo Canónico, com título, ligação e data de consulta. | M | R0 |
| RF-RES-02 | O Henriques identifica o procedimento aplicável e indica o seu nome oficial e o nome em linguagem simples. | M | R0 |
| RF-RES-03 | Quando não existe fonte válida, o Henriques diz que não consegue confirmar, explica onde se confirma e oferece passar a uma pessoa. | M | R0 |
| RF-RES-04 | O Henriques nunca indica taxas, prazos ou requisitos que não constem de uma fonte. Taxas sem valor na fonte aparecem como «calculada pela Câmara». | M | R0 |
| RF-RES-05 | Pedidos fora da competência da Câmara são encaminhados para a entidade certa (ex.: Espaço Cidadão). | M | R0 |
| RF-RES-06 | Pedidos de juízo técnico ou decisão (viabilidade, deferimento) são recusados com explicação do caminho formal. | M | R0 |
| RF-RES-07 | O Henriques pergunta só os dados que a ficha do serviço exige para avançar. | S | R0 |
| RF-RES-08 | As respostas seguem o formato de [15](15-ux-conteudo-e-tom.md#formato): resposta curta, passos, limites, fonte, próxima ação. | M | R0 |

## MIS · Missões

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-MIS-01 | Um pedido que exige ação gera um Contrato de Missão com objetivo, critério de sucesso, nível de delegação, dados partilhados, dados não partilhados, entidades, fonte e prazo. | M | R0 |
| RF-MIS-02 | A missão tem estados: `entendido` → `a verificar` → `preparado` → `submetido` → `respondido`, mais `precisa de si` e `com técnico`. | M | R0 |
| RF-MIS-03 | O munícipe vê a missão num cartão legível e pode cancelá-la. | M | R0 |
| RF-MIS-04 | A missão gera uma checklist de documentos e passos a partir do registo do serviço. | M | R0 |
| RF-MIS-05 | A missão produz um rascunho de pedido para revisão. Em R0 a submissão e o recibo são simulados e marcados como tal. | M | R0 |
| RF-MIS-06 | Missões compõem eventos de vida. | W | R2 |

## COF · Cofre Digital Pessoal

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-COF-01 | O Henriques sugere guardar um item e só o guarda depois de o munícipe aceitar. | M | R0 |
| RF-COF-02 | Cada item guarda origem, finalidade, sensibilidade, validade, conservação e permissões. | M | R0 |
| RF-COF-03 | O munícipe vê, corrige e apaga itens, e desliga alertas. | M | R0 |
| RF-COF-04 | O Cofre está organizado em três camadas: identidade (referências), provas e intenções/missões. | S | R0 |
| RF-COF-05 | Para cada missão sai apenas um pacote mínimo, visível antes de ser partilhado. | M | R0 |
| RF-COF-06 | O conteúdo do Cofre é cifrado com chave controlada pela pessoa; o operador não o consegue ler. | S | R0 (demonstração) · R1 |
| RF-COF-07 | Provas recebidas (ex.: «PIP favorável») são guardadas como credenciais verificáveis. | W | R2 |
| RF-COF-08 | A camada de identidade liga-se à EUDI Wallet e à app gov.pt. | W | R3 |

## MAN · Mandato Digital

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-MAN-01 | O munícipe concede um mandato com âmbito, entidade, nível (D0–D4), validade e possibilidade de revogação. | M | R0 |
| RF-MAN-02 | O mandato é apresentado num cartão legível antes de ser aceite. | M | R0 |
| RF-MAN-03 | O munícipe revoga o mandato a qualquer momento; as ações pendentes param. | M | R0 |
| RF-MAN-04 | O mandato é assinado com Chave Móvel Digital. | W | R1 |
| RF-MAN-05 | Um mandato pode ser concedido a um representante humano (familiar, Junta, contabilista). | W | R1 |
| RF-MAN-06 | D4 (agir dentro de regras pré-autorizadas) não está disponível antes de R2. | — | R2 |

## POL · Motor de política

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-POL-01 | Antes de cada ação, o motor verifica mandato, consentimento, risco e competência, e bloqueia ou pede confirmação. | M | R0 |
| RF-POL-02 | Conteúdo recuperado de páginas ou documentos não pode alterar políticas nem invocar ferramentas. | M | R0 |
| RF-POL-03 | As regras do motor são declarativas e versionadas. | S | R0 |

## AUD · Auditoria e prova

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-AUD-01 | Cada ação relevante gera um evento de auditoria imutável: quem, o quê, quando, mandato, fonte, versão, resultado. | S | R0 |
| RF-AUD-02 | O munícipe vê o painel «Quem viu os meus dados». | S | R0 |
| RF-AUD-03 | A Câmara exporta o trilho de auditoria de uma missão. | W | R1 |

## PRO · Proatividade

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-PRO-01 | O munícipe autoriza alertas por tema (ex.: revisão do PDM para um terreno). | S | R0 |
| RF-PRO-02 | Um alerta autorizado é enviado com ligação oficial; em R0 é disparado manualmente na demo. | S | R0 |
| RF-PRO-03 | Alertas de prazos de missões (ex.: fim da época da esplanada). | C | R1 |
| RF-PRO-04 | Alertas de oportunidades (apoios, missões verdes). | W | R2 |

## CNS · Consola Municipal

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-CNS-01 | O técnico vê uma fila de casos com motivo, resumo, fontes, dados mínimos, proposta, risco e prazo. | S | R0 |
| RF-CNS-02 | O técnico aprova, corrige, pede elemento, atribui ou escala. | S | R0 |
| RF-CNS-03 | Cada decisão gera prova com identidade funcional, momento e fundamento. | S | R0 |
| RF-CNS-04 | Painéis de fricção: dúvidas frequentes, pedidos incompletos, pontos de bloqueio. | C | R1 |

## MAP · Mapa de Intenções

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-MAP-01 | A Câmara vê intenções agregadas por tema e freguesia, apenas de quem consentiu. Em R0 com dados sintéticos marcados. | C | R0 |
| RF-MAP-02 | Nenhum grupo com menos de 10 pessoas é mostrado; os valores levam ruído estatístico. | W | R1 |

## POR · Porta Agêntica

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-POR-01 | A Porta expõe o catálogo de serviços em MCP e em REST (leitura). | S | R0 |
| RF-POR-02 | A Porta expõe a ficha completa de um serviço, com fontes e versão. | S | R0 |
| RF-POR-03 | A Porta expõe `criar_rascunho_ocupacao` com verificação de mandato (simulada em R0). | C | R0 |
| RF-POR-04 | Agentes de terceiros registam-se, são certificados e usam a Porta com o mandato do cliente. | W | R3 |
| RF-POR-05 | Cada chamada à Porta gera um evento de auditoria. | S | R0 |

## AVA · Avaliação de qualidade

| ID | Requisito | MoSCoW | Rel. |
|---|---|---|---|
| RF-AVA-01 | Existe um conjunto de avaliação com pergunta, procedimento esperado, comportamento esperado e fonte esperada ([anexo B](anexos/B-conjunto-de-avaliacao.md)). | M | R0 |
| RF-AVA-02 | Um executor corre o conjunto contra o Henriques e calcula as métricas de [12](12-ia-e-avaliacao.md#metricas). | M | R0 |
| RF-AVA-03 | Um painel mostra os resultados da última execução, por métrica e por pergunta. | M | R0 |
| RF-AVA-04 | O conjunto inclui casos adversariais (injeção de instruções, dados de terceiros). | M | R0 |
| RF-AVA-05 | A avaliação corre automaticamente a cada alteração do Registo Canónico. | W | R1 |

---

## Rastreabilidade

| Requisito | Histórias | Jornadas | Critério do júri |
|---|---|---|---|
| RF-RES-01..04 | HU-01, HU-02, HU-03 | J1–J7 | Viabilidade, Impacto |
| RF-RES-05..06 | HU-04, HU-05 | J2, J7 | Viabilidade |
| RF-MIS, RF-COF, RF-MAN | HU-06..HU-10 | J1, J2 | Inovação |
| RF-PRO | HU-11 | J2 | Inovação |
| RF-CNS | HU-12 | J8 | Impacto |
| RF-POR | HU-13 | — | Inovação, Viabilidade |
| RF-AVA | HU-14 | — | Viabilidade |
| RF-MAP | HU-15 | — | Impacto, Inovação |
| RF-AUD | HU-16 | J1 | Inovação |
