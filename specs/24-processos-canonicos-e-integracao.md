# 24 · Processos Canónicos e integração invertida

> Estado: proposta recomendada pela mentoria (19/10/2026) · Atualizado: 19/10/2026 · [Índice](README.md)
> Decisão: [ADR-020](21-registo-de-decisoes.md#adr-020). Complementa [10 · Arquitetura](10-arquitetura.md) e [13 · Porta Agêntica](13-porta-agentica-api.md).

## 1. A ideia

> **O Delegate define como cada procedimento se executa, a partir das leis e regulamentos públicos, e publica contratos de API. A Câmara implementa esses contratos nos seus sistemas. O Delegate orquestra.**

Até aqui, o modelo previa que o Delegate construísse conectores para os sistemas internos de cada Câmara. A mentoria propôs inverter essa responsabilidade:

| | Modelo anterior | Integração invertida |
|---|---|---|
| Quem conhece os sistemas internos | Delegate | Câmara (ou o seu fornecedor de software) |
| Quem escreve a integração | Delegate, caso a caso | Câmara, contra um contrato publicado |
| Acesso do Delegate a sistemas internos | Necessário | Nenhum: só aos endpoints que a Câmara expõe |
| Ritmo de implantação | Projeto de integração por sistema | **Serviço a serviço**, quando a Câmara estiver pronta |
| Replicação noutro município | Novo projeto | O mesmo contrato; o fornecedor que o implementar serve vários municípios |

## 2. Conceitos

### 2.1 Processo Canónico

Modelo executável de um procedimento administrativo, derivado de fontes públicas. Diz **o que** tem de acontecer, não **como** cada sistema o faz.

| Elemento | Exemplo (comunicação prévia de esplanada) |
|---|---|
| Base legal | Licenciamento Zero; Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães, art. 8.º e Anexo I |
| Entradas | Localização, área, n.º de mesas, período, atividade, fotografia |
| Passos | Preparar → confirmar pela pessoa → submeter → apreciar → (pedir elementos) → decidir → emitir referência → notificar |
| Decisões humanas | Apreciação e decisão pelo serviço competente |
| Capacidades usadas | `submeter_comunicacao_previa`, `consultar_estado_processo`, `responder_pedido_elementos`, `obter_referencia_pagamento` |
| Prazos e regras | Os que constam das fontes; nunca inferidos |
| Parametrização municipal | Regulamento local, taxas, unidade responsável, canais |

**Camadas:** muitos procedimentos derivam de lei nacional (Licenciamento Zero, RJUE, CPA) e são iguais nos 308 municípios. O que muda é a **parametrização municipal** (regulamento local, taxas, unidade). Um processo canónico nacional com parâmetros locais é o que torna o Delegate replicável.

| Camada | Quem mantém | Licença |
|---|---|---|
| Modelo nacional do processo | Delegate (validação jurídica) | Aberta (EUPL) |
| Parametrização municipal | Câmara valida; Delegate propõe | Da Câmara |

### 2.2 Contrato de Capacidades

Especificação de API (OpenAPI 3.1) que a Câmara implementa para cada capacidade. É publicada, versionada e acompanhada de um kit de integração.

```yaml
# excerto ilustrativo: contrato-capacidades/ocupacao-espaco-publico/v0.1.yaml
openapi: 3.1.0
info: {title: Delegate · Ocupação do Espaço Público, version: 0.1.0}
paths:
  /processos:
    post:
      operationId: submeter_comunicacao_previa
      summary: Recebe uma comunicação prévia confirmada pela pessoa
      requestBody:
        content:
          application/json:
            schema: {$ref: '#/components/schemas/ComunicacaoPrevia'}
      responses:
        '201': {description: Processo criado, content: {application/json: {schema: {$ref: '#/components/schemas/Processo'}}}}
        '422': {description: Dados insuficientes, com lista de elementos em falta}
  /processos/{numero}:
    get: {operationId: consultar_estado_processo}
  /processos/{numero}/elementos:
    post: {operationId: responder_pedido_elementos}
```

### 2.3 Níveis de integração

Cada serviço tem um nível de integração, independente do nível de delegação da pessoa. Permite começar sem integração nenhuma e subir serviço a serviço.

| Nível | Nome | A Câmara implementa | O Delegate faz | Exemplo |
|---|---|---|---|---|
| **I0** | Orientação | Nada | Responde (D0), prepara o pedido; a pessoa submete no portal oficial com instruções passo a passo | Qualquer serviço da base de conhecimento |
| **I1** | Assistido | Nada técnico; um técnico usa a Consola | Entrega o caso preparado na Consola; o técnico executa no sistema interno e regista o resultado | Primeiro mês do piloto |
| **I2** | Leitura | Endpoints de consulta (estado, pendências) | Acompanha e traduz estados; avisa a pessoa | `consultar_estado_processo` |
| **I3** | Ação | Endpoints de ação (submeter, juntar elementos, referência) | Executa a missão de ponta a ponta, com mandato | `submeter_comunicacao_previa` |

Regra: um mandato D3 só executa ações num serviço de nível I1 ou superior. Em I0, o Afonso prepara e a pessoa submete.

## 3. Kit de integração

O que o Delegate entrega para a Câmara (ou o fornecedor) implementar depressa:

| Componente | Função |
|---|---|
| Contratos OpenAPI por processo | Especificação a implementar |
| **Implementação de referência** | Sistema simulado que cumpre o contrato (os sistemas simulados do hackathon) |
| **Testes de conformidade** | Bateria automática que verifica uma implementação contra o contrato; emite um relatório «conforme / não conforme» |
| Sandbox | Ambiente Delegate de testes, com dados fictícios |
| Guia de segurança | Autenticação entre sistemas (OAuth 2.0 *client credentials* ou mTLS), âmbitos por capacidade, registo de chamadas |
| Exemplos | Pedidos e respostas por cenário |

## 4. Responsabilidades

| Atividade | Delegate | Câmara | Fornecedor de software autárquico |
|---|---|---|---|
| Modelar o processo canónico a partir das fontes | **R** | C (valida) | I |
| Parametrização municipal | R (propõe) | **A** (valida) | I |
| Publicar o contrato de capacidades | **R/A** | C | C |
| Implementar os endpoints | C (apoio) | **A** | **R** (quando é o fornecedor) |
| Testes de conformidade | **R** (kit) | A (aceita o resultado) | R (corre) |
| Orquestração, mandato, Cofre, Afonso | **R/A** | I | — |
| Decisões administrativas | — | **R/A** | — |
| Operação dos endpoints | — | **R/A** | R |

## 5. Implantação serviço a serviço

```text
Serviço entra no catálogo em I0 (base de conhecimento + orientação)
  → processo canónico modelado e parametrização validada
  → I1: técnicos usam a Consola
  → Câmara implementa leitura → testes de conformidade → I2
  → Câmara implementa ação → testes de conformidade → I3
```

Cada passo é independente e reversível. Um serviço pode ficar em I1 para sempre se não compensar integrá-lo.

## 6. Relação com a Porta Agêntica

| Face | Quem a usa | O que é |
|---|---|---|
| **Porta Agêntica** (norte) | Afonso e agentes de terceiros | Interface MCP/REST do Delegate sobre o catálogo e os processos canónicos, com mandato e auditoria |
| **Contrato de Capacidades** (sul) | Delegate, a chamar a Câmara | Endpoints implementados pela Câmara |

A Câmara torna-se «pronta para agentes» implementando o contrato uma vez. Qualquer agente que passe pela Porta beneficia, com as mesmas regras.

## 7. Implicações

| Área | Implicação |
|---|---|
| Hackathon | Os sistemas simulados passam a ser a **implementação de referência** do contrato; mostrar o contrato publicado e os testes de conformidade a passar ([strategy/11](strategy/11-ajustes-pos-mentoria.md)) |
| Negócio | Menos receita de implementação; mais subscrição por processo ativo; os fornecedores de software tornam-se canal ([16](16-modelo-de-negocio.md#revisao-mentoria)) |
| Riscos | A Câmara pode demorar a implementar: os níveis I0 e I1 dão valor desde o primeiro dia |
| Segurança | O Delegate nunca tem credenciais dos sistemas internos; só credenciais para os endpoints do contrato |
| Governação | O processo canónico é uma interpretação das fontes: validação jurídica antes de R1 |
