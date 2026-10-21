# 11 · Modelo de dados

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Entidades

```mermaid
erDiagram
  SERVICO ||--o{ FONTE : cita
  SERVICO ||--o{ CAPACIDADE : expoe
  PESSOA ||--o{ MANDATO : concede
  PESSOA ||--o{ ITEM_COFRE : detem
  PESSOA ||--o{ MISSAO : pede
  MISSAO }o--|| SERVICO : aplica
  MISSAO ||--o| MANDATO : usa
  MISSAO ||--o{ PACOTE_MINIMO : produz
  MISSAO ||--o{ CASO_CONSOLA : gera
  EVENTO_AUDITORIA }o--|| MISSAO : refere
  ITEM_COFRE ||--o{ ALERTA : autoriza
```

<a id="servico"></a>
## 2. Serviço (Registo Canónico)

Um ficheiro YAML por serviço, validado por esquema JSON.

```yaml
id: ocupacao-espaco-publico-esplanada
versao: 2026-10-20.1
estado: revisto            # rascunho | revisto | validado (só a Câmara valida)
entidade: Câmara Municipal de Guimarães
competencia: camara        # camara | entidade_municipal | administracao_central
unidade_responsavel: Gabinete de Serviços Urbanos
titulo_oficial: Ocupação de Espaço Público
titulo_simples: Pôr uma esplanada à porta do estabelecimento
sinonimos: [esplanada, mesas na rua, ocupar o passeio]
publico: [empresas]
eventos_de_vida: [abrir-negocio]
tipo_procedimento: mera comunicação prévia
condicoes:
  - texto: Esplanada aberta, contígua à fachada, sem exceder a largura do estabelecimento
    fonte: reg-oep-art8
  - texto: Corredor livre para peões com pelo menos 2,00 m
    fonte: reg-oep-anexo1
documentos: []             # preencher apenas a partir da ficha oficial
taxas:
  descricao: Calculada pela Câmara
  valor: null              # nunca preencher sem fonte
  fonte: null
prazos: []
canais:
  - tipo: online
    descricao: "[a confirmar na ficha oficial]"
    url: null
dados_minimos: [localizacao, atividade, numero_mesas, area, periodo, fotografia_passeio]
nivel_risco: baixo
escalonamento: Dúvidas sobre localização ou dimensões passam para o Gabinete de Serviços Urbanos
limites: Avaliação técnica local é da Câmara
fontes:
  - id: reg-oep-art8
    titulo: Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães, art. 8.º
    url: https://www.cm-guimaraes.pt/cmguimaraes/uploads/document/file/2797/47138.pdf
    consultado_em: 2026-10-20
    hash: sha256:…
  - id: reg-oep-anexo1
    titulo: Idem, Anexo I (alterado em 2020)
    url: https://www.cm-guimaraes.pt/cmguimaraes/uploads/document/file/16470/alteracao_ao_regulamento_de_ocupacao_do_espaco_publico_e_publicidade__no_municipio_de_guimaraes.pdf
    consultado_em: 2026-10-20
    hash: sha256:…
curadoria:
  por: "[nome]"
  em: 2026-10-20
  notas: Canal formal a confirmar com o mentor
```

Regras: `valor` de taxas e `prazos` só se preenchem com fonte; `estado: validado` só em R1, por um dono funcional da Câmara.

## 3. Capacidade

```yaml
id: criar_rascunho_ocupacao
servico: ocupacao-espaco-publico-esplanada
dono: Gabinete de Serviços Urbanos
finalidade: Preparar comunicação prévia de esplanada
entradas: {localizacao: string, area_m2: number, numero_mesas: integer, periodo: {inicio: date, fim: date}, atividade: string}
efeito: cria_rascunho      # consulta | cria_rascunho | submete
mandato_minimo: D2
ambito_mandato: ocupacao-espaco-publico
risco: baixo
recibo: [id_rascunho, versao_regulamento]
simulada: true             # em R0
```

## 4. Mandato

```json
{
  "id": "M-2026-0412",
  "mandante": "pessoa:demo-ines",
  "representante": "delegate:henriques",
  "ambito": "ocupacao-espaco-publico",
  "objeto": "Casa Joaquim",
  "entidade": "Câmara Municipal de Guimarães",
  "nivel": "D3",
  "valido_de": "2026-10-17",
  "valido_ate": "2027-10-16",
  "estado": "ativo",
  "assinatura": {"metodo": "simulada", "em": "2026-10-21T10:02:00Z"},
  "revogado_em": null
}
```

Níveis: `D0` informar · `D1` vigiar · `D2` preparar · `D3` agir com confirmação · `D4` agir dentro de regras (indisponível antes de R2).

## 5. Missão

```json
{
  "id": "MIS-0007",
  "pessoa": "pessoa:demo-ines",
  "servico": "ocupacao-espaco-publico-esplanada",
  "objetivo": "Ocupar o passeio com esplanada aberta, de maio a setembro",
  "sucesso": "Comunicação prévia aceite e recibo emitido",
  "mandato": "M-2026-0412",
  "estado": "preparado",
  "historico_estados": [{"estado": "entendido", "em": "…"}, {"estado": "a verificar", "em": "…"}],
  "partilha": ["localizacao", "atividade", "numero_mesas", "area", "periodo", "fotografia_passeio"],
  "nao_partilha": ["terreno-ponte", "conversas", "preferencias"],
  "checklist": [{"passo": "Indicar número de mesas", "feito": true}],
  "fontes": ["reg-oep-art8", "reg-oep-anexo1"],
  "prazo_dados": "2026-09-30",
  "simulacao": true
}
```

Estados: `entendido` → `a verificar` → `preparado` → `submetido` → `respondido`; transversais: `precisa de si`, `com técnico`, `cancelado`.

## 6. Item do Cofre

```json
{
  "id": "COF-0003",
  "camada": "intencoes",
  "tipo": "ativo",
  "titulo": "Terreno em Ponte",
  "conteudo_cifrado": "base64…",
  "origem": "conversa de 20/10/2026",
  "finalidade": "Acompanhar a revisão do PDM",
  "sensibilidade": "normal",
  "valido_ate": null,
  "conservacao": "até revogação",
  "permissoes": ["alerta-pdm"],
  "criado_com_consentimento": true
}
```

Valores: `camada` ∈ {`identidade`, `provas`, `intencoes`}; `sensibilidade` ∈ {`normal`, `sensivel`}.

## 7. Pacote mínimo

```json
{
  "id": "PAC-0011",
  "missao": "MIS-0007",
  "destinatario": "Câmara Municipal de Guimarães",
  "finalidade": "Comunicação prévia de esplanada",
  "campos": {"localizacao": "…", "numero_mesas": 6, "area_m2": 12, "periodo": "05–09"},
  "expira_em": "2026-09-30",
  "aprovado_pela_pessoa_em": "2026-10-21T10:05:00Z"
}
```

## 8. Evento de auditoria

```json
{
  "id": "EV-000123",
  "em": "2026-10-21T10:05:12Z",
  "ator": "agente:integracao",
  "acao": "capacidade.chamada",
  "alvo": "criar_rascunho_ocupacao",
  "missao": "MIS-0007",
  "mandato": "M-2026-0412",
  "fontes": ["reg-oep-art8@2026-10-20.1"],
  "resultado": "ok",
  "hash_anterior": "sha256:…",
  "hash": "sha256:…"
}
```

Encadeamento por hash: cada evento inclui o hash do anterior. Sem dados pessoais em claro.

## 9. Caso da Consola

```json
{
  "id": "CASO-0004",
  "missao": "MIS-0007",
  "motivo": "Dimensões perto do limite do corredor de peões",
  "resumo": "Esplanada de 6 mesas, maio a setembro, fachada de 8 m",
  "fontes": ["reg-oep-art8", "reg-oep-anexo1"],
  "dados_minimos": "PAC-0011",
  "proposta": "Aceitar com corredor de 2,00 m confirmado na fotografia",
  "risco": "baixo",
  "prazo": "2026-10-28",
  "decisao": null
}
```

## 10. Intenção agregada (Mapa de Intenções)

```json
{"tema": "esplanada", "freguesia": "Oliveira, São Paio e São Sebastião", "contagem": 90, "ruido": true, "sintetico": true, "periodo": "2026-T4"}
```

Regra: grupos com `contagem < 10` não se publicam (R1).

## 11. Pergunta do conjunto de avaliação

```yaml
id: Q-001
pergunta: Quero pôr uma esplanada à porta do meu café. O que preciso?
persona: P1
servico_esperado: ocupacao-espaco-publico-esplanada
comportamento_esperado: responder   # responder | abster | encaminhar | recusar
fontes_esperadas: [reg-oep-art8]
proibido: [valor de taxa]
categoria: catalogo                  # catalogo | fora_competencia | juizo_tecnico | sem_fonte | adversarial
```
