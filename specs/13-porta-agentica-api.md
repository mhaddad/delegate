# 13 · Porta Agêntica (API e MCP)

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Propósito

A Porta Agêntica torna a Câmara **legível e segura para qualquer agente de IA**, com as mesmas regras para todos: o Afonso, o atendedor virtual da Câmara, o assistente de um contabilista ou o assistente pessoal de um munícipe.

Expõe o **Registo Canónico** (leitura pública) e **capacidades** (ações limitadas, com mandato). Não dá acesso geral a bases de dados, sessões de funcionários nem credenciais permanentes.

## 2. Interfaces

| Interface | Para quem | R0 |
|---|---|---|
| **MCP** (Model Context Protocol) | Agentes de IA que suportam MCP | S: leitura |
| **REST + OpenAPI** | Integrações convencionais | C: leitura |

A especificação é pública e licenciada em EUPL ([ADR-005](21-registo-de-decisoes.md#adr-005)).

## 3. Ferramentas MCP

| Ferramenta | Tipo | Mandato | Descrição | R0 |
|---|---|---|---|---|
| `procurar_servicos` | leitura | não | Procura serviços por texto livre; devolve id, título oficial, título simples, competência e pontuação | S |
| `obter_servico` | leitura | não | Devolve o registo completo de um serviço, com fontes e versão | S |
| `listar_eventos_de_vida` | leitura | não | Devolve eventos de vida e os serviços que os compõem | C |
| `verificar_mandato` | leitura | sim | Indica se um mandato é válido para um âmbito e nível | C |
| `criar_rascunho_ocupacao` | ação | D2+ | Cria um rascunho de comunicação prévia de esplanada (simulado em R0) | C |
| `consultar_estado_processo` | leitura | D1+ | Estado de um processo (R1, se houver interface autorizada) | W |

### 3.1 `procurar_servicos`

Entrada:

```json
{"consulta": "esplanada no passeio", "limite": 3}
```

Saída:

```json
{
  "resultados": [
    {
      "id": "ocupacao-espaco-publico-esplanada",
      "titulo_oficial": "Ocupação de Espaço Público",
      "titulo_simples": "Pôr uma esplanada à porta do estabelecimento",
      "competencia": "camara",
      "versao": "2026-10-20.1",
      "estado": "revisto",
      "pontuacao": 0.91
    }
  ],
  "aviso": "Conteúdo curado de fontes públicas. Não validado pela Câmara Municipal de Guimarães."
}
```

### 3.2 `obter_servico`

Entrada: `{"id": "ocupacao-espaco-publico-esplanada"}`. Saída: o registo completo de [11](11-modelo-de-dados.md#servico).

### 3.3 `criar_rascunho_ocupacao`

Entrada:

```json
{
  "mandato": "M-2026-0412",
  "localizacao": "Rua […], Guimarães",
  "area_m2": 12,
  "numero_mesas": 6,
  "periodo": {"inicio": "2027-05-01", "fim": "2027-09-30"},
  "atividade": "restauração"
}
```

Saída:

```json
{
  "rascunho": "RASC-0021",
  "versao_regulamento": "reg-oep-art8@2026-10-20.1",
  "simulacao": true,
  "proximo_passo": "Rever e confirmar com Chave Móvel Digital no canal oficial"
}
```

## 4. Regras de acesso

| Regra | Descrição |
|---|---|
| Leitura do catálogo | Pública, com limite de pedidos por cliente |
| Ações | Exigem mandato válido para o âmbito e nível, e cliente certificado (R3) |
| Identificação do cliente | Cada cliente tem um id; em R0 basta uma chave de demonstração |
| Auditoria | Toda a chamada gera um evento ([11](11-modelo-de-dados.md#8-evento-de-auditoria)) |
| Conteúdo | Respostas incluem sempre `versao`, `estado` e `aviso` |

## 5. Erros

| Código | Significado | O que o agente deve fazer |
|---|---|---|
| `SERVICO_NAO_ENCONTRADO` | Id inexistente | Usar `procurar_servicos` |
| `MANDATO_EM_FALTA` | Ação sem mandato | Pedir mandato ao cliente |
| `MANDATO_INSUFICIENTE` | Nível ou âmbito insuficiente | Pedir mandato adequado |
| `MANDATO_REVOGADO` | Mandato revogado ou expirado | Parar e informar o cliente |
| `FORA_DE_COMPETENCIA` | Serviço de outra entidade | Encaminhar para a entidade indicada |
| `LIMITE_EXCEDIDO` | Demasiados pedidos | Esperar e repetir |

## 6. Demonstração no pitch

1. Abrir um cliente MCP de uso geral, configurado com o endereço da Porta.
2. Pedir: «Que preciso para pôr uma esplanada em Guimarães? Usa a Porta da Câmara.»
3. Mostrar as chamadas `procurar_servicos` e `obter_servico`, e a resposta com a mesma fonte do Afonso.
4. Mostrar as duas chamadas no trilho de auditoria.

Mensagem: **o Afonso é o primeiro cliente da Porta, não o único.** O atendedor virtual da Câmara também pode ser.

## 7. Evolução

| Release | Evolução |
|---|---|
| R1 | Capacidades de leitura de estado com autenticação; especificação publicada |
| R2 | Capacidades de ação de baixo risco; recibos oficiais |
| R3 | Registo e certificação de agentes de terceiros; preço por operação ([16](16-modelo-de-negocio.md)) |
| R4 | Federação com outras entidades; credenciais EUDI |
