# 18 · Métricas e OKR

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Métrica norte

> **Missões resolvidas com fonte, sem recontacto.** Número de missões que chegam a resultado (resposta compreendida ou ato concluído) com fonte válida e sem a pessoa ter de contactar a Câmara por outro canal sobre o mesmo assunto.

Porquê: junta o valor para a pessoa (resolver), o rigor (fonte) e o valor para a Câmara (menos contactos). Não premeia o volume de mensagens.

## 2. Métricas do protótipo (R0)

Definidas em [12](12-ia-e-avaliacao.md#metricas).

| ID | Métrica | Meta |
|---|---|---:|
| MET-Q1 | Procedimento correto | ≥ 85% |
| MET-Q2 | Respostas com fonte válida | 100% |
| MET-Q3 | Valores sem fonte | 0 |
| MET-Q4 | Abstenção e encaminhamento corretos | ≥ 90% |
| MET-Q5 | Ataques bloqueados | 100% |
| MET-Q6 | Linguagem simples (revisão humana) | ≥ 4/5 |
| MET-Q7 | Latência p95 | ≤ 8 s |

## 3. Métricas do piloto (R1)

Todas medidas contra uma **linha de base** recolhida na fase de descoberta.

| ID | Métrica | Definição | Fonte | Direção |
|---|---|---|---|---|
| MET-01 | Tempo até ao ato | Dias entre a primeira mensagem e a submissão ou decisão | Missões + sistema de origem | ↓ |
| MET-02 | Pedidos completos à primeira | % de pedidos sem pedido de elementos adicionais | Sistema de origem / Consola | ↑ |
| MET-03 | Contactos repetidos por processo | Chamadas, emails e idas ao balcão sobre o mesmo assunto | Amostragem com a Divisão de Atendimento | ↓ |
| MET-04 | Respostas com fonte válida | % de respostas factuais com fonte e versão em vigor | Auditoria | = 100% |
| MET-05 | Compreensão do próximo passo | % de pessoas que sabem dizer o que vem a seguir | Inquérito curto no fim da missão | ↑ |
| MET-06 | Tempo de triagem | Tempo do técnico até ao primeiro despacho | Consola | ↓ |
| MET-07 | Encaminhamento correto | % de casos que chegam à unidade certa à primeira | Consola | ↑ |
| MET-08 | Equidade | Diferença de MET-01, MET-02 e MET-05 entre canais, idades e perfis | Missões + inquérito | → 0 |
| MET-09 | Confiança | Escala de confiança no Henriques e na Câmara | Inquérito | ↑ |
| MET-10 | Missões verdes concluídas | Contagem | Missões | ↑ |

### Contra-métricas (não otimizar)

- Número de mensagens ou tempo de conversa.
- Fecho rápido de casos sem resolução.
- Redução de atendimento humano como objetivo em si.
- Retenção na conversa.

## 4. OKR

### Hackathon (até 28/10/2026)

| Objetivo | Resultados-chave |
|---|---|
| Provar o «bom resultado» do desafio | MET-Q1 ≥ 85%; MET-Q2 = 100%; MET-Q3 = 0 na execução de congelamento |
| Mostrar o que mais ninguém mostra | J1 completa com mandato; Porta usada ao vivo por agente externo |
| Convencer sobre continuidade | Plano de piloto com preço e via de contratação no pitch |
| Ganhar | Prémio do desafio 3.4; lugar no pódio |

### Piloto (R1)

| Objetivo | Resultados-chave (🧪 metas a calibrar com a linha de base) |
|---|---|
| Reduzir fricção | MET-03 −30%; MET-02 +20 pontos percentuais |
| Manter o rigor | MET-04 = 100%; zero incidentes de dados |
| Ser útil para todos | MET-08: diferença ≤ 10% entre canais |
| Convencer a Câmara a renovar | Relatório de impacto aprovado; subscrição contratada |

## 5. Instrumentação

| Evento | Dados | Uso |
|---|---|---|
| `conversa.iniciada` | canal, hora | Volume |
| `resposta.enviada` | fontes, latência, categoria | MET-Q2, MET-Q7, MET-04 |
| `resposta.abstencao` | motivo | MET-Q4 |
| `missao.estado` | estado, hora | MET-01 |
| `mandato.concedido` / `.revogado` | nível, âmbito | Confiança |
| `consola.decisao` | ação, tempo | MET-06, MET-07 |
| `inquerito.resposta` | escala | MET-05, MET-09 |

Eventos sem dados pessoais em claro.

## 6. Como usar os números do dossiê no pitch

| Pode dizer | Não pode dizer |
|---|---|
| «Entre fevereiro e novembro de 2025, o Balcão Único registou 22.425 atendimentos presenciais.» | «22.425 munícipes foram ao balcão em 2025.» |
| «41.473 chamadas atendidas em 10 meses.» | «41.473 pedidos.» |
| «751 pedidos de inspeção de ascensores em 10 meses.» | «O serviço mais pedido é a inspeção de ascensores.» |
| «Não existe um ranking público dos serviços mais pedidos; medi-lo é parte do piloto.» | Qualquer soma de indicadores diferentes |
