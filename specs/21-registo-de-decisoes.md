# 21 · Registo de decisões (ADR)

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Estados: **Proposta** (a decidir pela equipa) · **Aceite** · **Substituída**. Formato: contexto → decisão → consequências.

| ADR | Título | Estado |
|---|---|---|
| [001](#adr-001) | Concorrer ao desafio 3.4 | Proposta |
| [002](#adr-002) | Esplanada como caso âncora; PDM como alerta | Aceite |
| [003](#adr-003) | Terminologia oficial | Aceite |
| [004](#adr-004) | Operador independente e Cofre com chaves da pessoa | Proposta |
| [005](#adr-005) | Núcleo e especificação da Porta em EUPL | Proposta |
| [006](#adr-006) | Só informação pública no protótipo | Aceite |
| [007](#adr-007) | Chat web em R0; WhatsApp opcional | Proposta |
| [008](#adr-008) | Stack do protótipo | Proposta |
| [009](#adr-009) | Registo Canónico em ficheiros versionados | Proposta |
| [010](#adr-010) | Porta Agêntica em MCP e REST | Proposta |
| [011](#adr-011) | Complementar o atendedor virtual existente | Proposta |
| [012](#adr-012) | Avaliação como funcionalidade do produto | Proposta |
| [013–019](strategy/10-riscos-decisoes-e-impacto.md#adr-013) | Decisões da estratégia de implementação (Telegram, Observatório, eventos…) | Proposta |
| [020](#adr-020) | Integração invertida: processos canónicos e contratos de capacidades | Proposta (mentoria) |
| [021](#adr-021) | Base de conhecimento ampla para D0 | Proposta (mentoria) |
| [022](#adr-022) | Modelo de impacto com custeio por atividades e preço indexado ao valor | Proposta (mentoria) |

---

<a id="adr-001"></a>
## ADR-001 · Concorrer ao desafio 3.4

- **Contexto:** o hackathon tem cinco desafios; cada equipa escolhe um. O 3.4 «Falar com a Câmara sem Burocracia» descreve exatamente o problema do Delegate. Os outros não têm relação.
- **Decisão:** submeter no desafio 3.4.
- **Consequências:** concorremos ao prémio do desafio (1.000 €) e à classificação geral. Enfrentamos equipas com o «caminho óbvio» (chatbot), por isso a diferenciação tem de ser imediata ([R-02](20-riscos-e-pressupostos.md)). O enquadramento económico (empresas, Cidade Europeia da Inovação) serve o critério de impacto.

<a id="adr-002"></a>
## ADR-002 · Esplanada como caso âncora; PDM como alerta

- **Contexto:** a viabilidade urbanística feita por IA é o ponto juridicamente mais sensível e pode gerar desconfiança nos técnicos. A esplanada tem regra verificada (mera comunicação prévia, art. 8.º e Anexo I) e é de baixo risco.
- **Decisão:** J1 (esplanada) é a transação demonstrada; J2 (PDM) é proativa e informativa, sem juízo de viabilidade.
- **Consequências:** o pitch v2 (centrado na casa) tem de ser revisto.

<a id="adr-003"></a>
## ADR-003 · Terminologia oficial

- **Contexto:** materiais anteriores usavam RDE, Representante Digital Embarcado, Cofre de Contexto Pessoal.
- **Decisão:** usar **Representante Digital Pessoal** e **Cofre Digital Pessoal**; evitar «procurador digital» (remete para o Ministério Público); «embarcado» e a metáfora do Forward Deployed Engineer só internamente.
- **Consequências:** [glossário](22-glossario.md) obrigatório.

<a id="adr-004"></a>
## ADR-004 · Operador independente e Cofre com chaves da pessoa

- **Contexto:** se o Afonso pertencer à Câmara, perde-se o argumento de lealdade. Se o operador ler o Cofre, a palavra «cofre» é enganadora.
- **Decisão (proposta):** o Delegate é um operador independente com contrato municipal; o Afonso é a marca local; o Cofre é cifrado com chave controlada pela pessoa.
- **Consequências:** papéis RGPD do Cofre exigem análise própria; em R0 demonstra-se a cifra no navegador.

<a id="adr-005"></a>
## ADR-005 · Núcleo e especificação da Porta em EUPL

- **Contexto:** compras públicas valorizam ausência de dependência; o hackathon deixa a PI às equipas.
- **Decisão (proposta):** repositório e especificação da Porta em EUPL-1.2.
- **Consequências:** monetização pela operação, conectores, certificação e curadoria ([16](16-modelo-de-negocio.md)).

<a id="adr-006"></a>
## ADR-006 · Só informação pública no protótipo

- **Contexto:** regras do hackathon, RGPD e ausência de acordos com a Câmara.
- **Decisão:** R0 usa apenas informação pública; personagens e dados de demonstração; integrações e recibos simulados e marcados.
- **Consequências:** nenhuma funcionalidade de consulta autenticada de processos em R0.

<a id="adr-007"></a>
## ADR-007 · Chat web em R0; WhatsApp opcional

- **Contexto:** o WhatsApp Business exige verificação e aprovação; a demo precisa de fiabilidade.
- **Decisão (proposta):** interface web com aparência de mensagens, sem a marca WhatsApp; sandbox de WhatsApp só se sobrar tempo.
- **Consequências:** no pitch, dizer «no piloto, o mesmo Afonso fala por WhatsApp».

<a id="adr-008"></a>
## ADR-008 · Stack do protótipo

- **Contexto:** 5 dias; equipa com competências a confirmar.
- **Decisão (proposta):** Next.js + TypeScript; servidor MCP em TypeScript; registo em YAML; família Claude 5 como modelo; alojamento na UE. Alternativa: Python + FastAPI. Decidir no dia 19 pelo que a equipa domina.
- **Consequências:** todos os componentes identificados na submissão.

<a id="adr-009"></a>
## ADR-009 · Registo Canónico em ficheiros versionados

- **Contexto:** versionamento e auditabilidade com custo zero.
- **Decisão (proposta):** um ficheiro YAML por serviço no repositório; a versão é a data + sequência; o histórico é o do git.
- **Consequências:** em R1 passa para base de dados com interface de validação.

<a id="adr-010"></a>
## ADR-010 · Porta Agêntica em MCP e REST

- **Contexto:** o MCP é um padrão aberto suportado por vários clientes de IA; demonstrável ao vivo.
- **Decisão (proposta):** MCP como interface principal para agentes; REST/OpenAPI equivalente para integrações.
- **Consequências:** o mesmo serviço alimenta o Afonso e agentes externos.

<a id="adr-011"></a>
## ADR-011 · Complementar o atendedor virtual existente

- **Contexto:** a Câmara já anuncia um atendedor online com IA ([01](01-contexto-e-problema.md#o-que-ja-existe)).
- **Decisão (proposta):** posicionar o Delegate como camada que torna o atendimento mensurável, citável e capaz de agir; a Porta pode servir o atendedor atual.
- **Consequências:** nenhuma comparação depreciativa no pitch; foco em lacunas verificáveis.

<a id="adr-012"></a>
## ADR-012 · Avaliação como funcionalidade do produto

- **Contexto:** o critério de viabilidade técnica pede «algo real»; o atendedor existente não publica métricas.
- **Decisão (proposta):** o conjunto de avaliação e o painel são parte do produto e aparecem no pitch.
- **Consequências:** esforço de curadoria de perguntas desde o dia 20.

<a id="adr-020"></a>
## ADR-020 · Integração invertida: processos canónicos e contratos de capacidades

- **Contexto:** construir conectores para os sistemas internos de cada Câmara é lento, exige acesso privilegiado e não se replica. Recomendação da mentoria (19/10/2026).
- **Decisão (proposta):** o Delegate modela processos canónicos a partir das fontes públicas e publica contratos de API (OpenAPI) por capacidade; a Câmara, ou o seu fornecedor de software, implementa-os; o Delegate orquestra. Níveis de integração I0 a I3 por serviço ([24](24-processos-canonicos-e-integracao.md)).
- **Consequências:** implantação serviço a serviço; o Delegate não acede a sistemas internos; os sistemas simulados do hackathon passam a implementação de referência com testes de conformidade; a receita de implementação diminui e os fornecedores de software tornam-se canal ([16](16-modelo-de-negocio.md#revisao-mentoria)).

<a id="adr-021"></a>
## ADR-021 · Base de conhecimento ampla para D0

- **Contexto:** o Registo Canónico curado cobre 10–15 serviços; o atendedor atual e as outras equipas respondem a perguntas gerais. Recomendação da mentoria.
- **Decisão (proposta):** ingerir o site da Câmara, o Diretório, os formulários, os regulamentos municipais e diplomas nacionais numa base de conhecimento com citações, para respostas D0; os processos canónicos continuam a servir as missões ([25](25-base-de-conhecimento.md)).
- **Consequências:** política de resposta em camadas; nova categoria no conjunto de avaliação (MET-Q8, MET-Q9); meio dia a dia e meio de trabalho de ingestão.

<a id="adr-022"></a>
## ADR-022 · Modelo de impacto com custeio por atividades e preço indexado ao valor

- **Contexto:** o critério de impacto vale 30%; a Câmara precisa de ver custo atual × custo com o Delegate. Recomendação da mentoria.
- **Decisão (proposta):** modelo de custeio por atividades com pressupostos visíveis, calculadora na Consola e plano de medição no piloto ([26](26-modelo-de-impacto-e-custos.md)). O preço passa a ser indexado à poupança medida.
- **Consequências:** a hipótese de subscrição de 116 mil €/ano não se paga só com poupança interna no cenário central; rever preços e contar o valor para munícipes e economia em separado.
