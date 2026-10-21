# 11 · Ajustes após a mentoria (19/10/2026)

> Estado: proposta para discussão · Atualizado: 19/10/2026 · [Estratégia](README.md)
> Mentoria com Henrique Macedo (VP de Engenharia, LayerX).

## 1. Recomendações e resposta

| Recomendação | Leitura | Documento | Decisão |
|---|---|---|---|
| **Inverter a responsabilidade de integração:** o Delegate tem os processos canónicos e publica contratos de API; a Câmara implementa; o Delegate orquestra | Reduz o atrito de adoção, elimina o acesso a sistemas internos e permite implantar serviço a serviço. Torna os fornecedores de software autárquico num canal | [24](../24-processos-canonicos-e-integracao.md) | [ADR-020](../21-registo-de-decisoes.md#adr-020) |
| **Base de conhecimento do site, leis e regulamentos para D0** | Põe o Henriques ao nível do atendedor atual e dos concorrentes. A diferença passa a estar no que vem por cima | [25](../25-base-de-conhecimento.md) | [ADR-021](../21-registo-de-decisoes.md#adr-021) |
| **Mostrar redução de custos e tempo para a Câmara** | Reforça o critério de impacto (30%) e cria interesse real. Revelou que o preço tem de ser indexado ao valor | [26](../26-modelo-de-impacto-e-custos.md) | [ADR-022](../21-registo-de-decisoes.md#adr-022) |

## 2. O que muda na semana

### 2.1 Por frente de trabalho

| Frente | Acrescenta | Sai ou reduz |
|---|---|---|
| **F1 · Henriques** | Política de resposta em camadas (processo canónico → ficha → regulamento/lei → página → abstenção) | — |
| **F3 · Porta e sistemas** | **Contrato de Capacidades v0.1 em OpenAPI** para Ocupação do Espaço Público e Tesouraria; os sistemas simulados implementam o contrato; **testes de conformidade** a correr contra eles; nível de integração por serviço no catálogo | «Sabor legado» XML da Tesouraria passa a «não fazer» (o contrato normaliza) |
| **F4 · Interface** | **Calculadora de impacto** na Consola; etiqueta I0–I3 por serviço no Observatório e na Consola; relatório de conformidade na página da Porta | Mapa geográfico (fica pelas barras) |
| **F5 · Conteúdo** | **Pipeline de ingestão da base de conhecimento** (com F1); perguntas Q-43 a Q-54; textos da calculadora | Registo curado fica em 10 serviços (não 15) |

### 2.2 Plano dia a dia (alterações a [08](08-plano-de-execucao.md))

| Dia | Alteração |
|---|---|
| Seg 19/10 | F5 + F1: lista de fontes e ingestão das fichas do Diretório e dos formulários (meio dia). F3: esqueleto do contrato OpenAPI antes de codificar os sistemas simulados (o contrato vem primeiro) |
| Ter 20/10 | F5: regulamentos municipais e 3 diplomas nacionais; relatório de cobertura. F1: política em camadas. Primeira execução com MET-Q8 |
| Qua 21/10 | F3: testes de conformidade (gerados a partir do contrato) a passar contra a implementação de referência |
| Qui 22/10 | F4: calculadora de impacto com valores do [26](../26-modelo-de-impacto-e-custos.md); F5: valida os textos e os avisos |

### 2.3 Ordem de corte atualizada

Entram na lista, por esta ordem (cortar primeiro os de cima):

1. Testes de conformidade completos → um relatório de exemplo gerado manualmente
2. Etiquetas I0–I3 no Observatório → só na Consola
3. Calculadora interativa → tabela fixa com os três cenários

**Passam a «nunca cortar»:**

- base de conhecimento com fonte (D0);
- contrato OpenAPI publicado e implementado pelos sistemas simulados.

## 3. O que muda na demo ([09](09-roteiro-da-demo.md))

| Momento | Novo | Mensagem |
|---|---|---|
| Logo após a primeira pergunta | Segunda pergunta sobre um serviço fora do catálogo (ex.: acampamento ocasional), respondida pela base de conhecimento com a ficha como fonte | «O Henriques responde ao que o site da Câmara e a lei dizem, sempre com a fonte.» |
| Quando o processo nasce nos Serviços Urbanos | O nó mostra «Contrato de Capacidades v0.1 · conforme ✓» | «A Câmara não abre os seus sistemas. Implementa um contrato público, serviço a serviço. Este sistema simulado é a implementação de referência.» |
| Antes da continuidade | Calculadora de impacto, cenário central | «Se um em cada cinco contactos for resolvido pelo Henriques, a Câmara liberta mais de 3 mil horas em 10 meses. Os pressupostos estão aqui, e o piloto mede-os.» |

Na versão de 2 minutos, entra só a frase do contrato; a calculadora vai para o bloco «Impacto» do pitch.

## 4. O que muda no pitch

| Bloco | Ajuste |
|---|---|
| Diferença | «Respondemos ao que o site diz, como os outros. Por cima disso, o Henriques age por si, com mandato, e a Câmara integra serviço a serviço com um contrato aberto.» |
| Impacto | Calculadora: horas libertadas e valor, com pressupostos visíveis. «Capacidade libertada, não cortes.» |
| Continuidade | «Implantação serviço a serviço: começa sem integração (I0) e sobe até à ação (I3) quando a Câmara estiver pronta. Os fornecedores de software implementam o contrato uma vez para vários municípios.» |

## 5. Perguntas para a próxima mentoria

1. Que forma de autenticação entre sistemas a Câmara tende a aceitar (OAuth 2.0 *client credentials*, mTLS, VPN)?
2. Os fornecedores de software autárquico implementariam um contrato aberto? Que incentivo precisam?
3. O preço indexado à poupança é defensável numa compra pública? Por missão concluída ou subscrição?
4. Que custo horário carregado é razoável usar no cenário central?
