# 16 · Modelo de negócio

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Todos os valores são hipóteses 🧪 para testar com a mentoria e com potenciais clientes. Não são referências de mercado.

## 1. Tese

**O munícipe nunca paga. A Câmara paga pela infraestrutura que a deixa pronta para agentes. Quem usa essa infraestrutura para fazer negócio paga pela passagem.**

Analogia: a rede Multibanco. O cliente usa o caixa sem pagar; os bancos pagam à SIBS pela rede.

Nome do modelo: **Porta Agêntica como infraestrutura, Afonso como bem público.**

## 2. Business Model Canvas

| Bloco | Conteúdo |
|---|---|
| **Segmentos de clientes** | Municípios (pagador principal); comunidades intermunicipais; agentes de terceiros (banca, contabilidade, software); munícipes e negócios (utilizadores, não pagam) |
| **Proposta de valor** | Munícipe: representante leal, fonte à vista, missões tratadas. Câmara: pedidos completos, menos contactos repetidos, casos preparados, dados de gestão, prontidão para agentes. Terceiros: acesso governado com mandato |
| **Canais** | Venda direta a municípios; CIM; parceiros de software autárquico; comunidade open source |
| **Relação com clientes** | Equipa de implementação embarcada no município nos primeiros meses; depois subscrição com SLA |
| **Fontes de receita** | Implementação; subscrição; componente por resultado; acesso de agentes; módulos de gestão |
| **Recursos-chave** | Registo Canónico, conectores, motor de política, conjunto de avaliação, equipa de curadoria |
| **Atividades-chave** | Curadoria de conteúdo; desenvolvimento de capacidades; avaliação contínua; certificação de agentes |
| **Parceiros-chave** | Câmara de Guimarães; CIM do Ave; AMA; fornecedores de software autárquico; fornecedor de IA; Juntas |
| **Estrutura de custos** | Pessoas (curadoria e conectores), inferência de IA, mensagens WhatsApp, alojamento, segurança |

## 3. Fontes de receita

| Fonte | Quem paga | Natureza | Quando |
|---|---|---|---|
| Implementação de capacidades (conector, conteúdo, testes) | Município | Pontual, por jornada | Desde o piloto |
| Subscrição (Porta, Consola, Afonso, auditoria, alojamento, SLA) | Município | Recorrente anual | R1–R2 |
| Componente por resultado (missões concluídas) | Município | Variável, com teto | R2 |
| Acesso de agentes terceiros (certificação + operação) | Empresas privadas | Recorrente e por uso | R3 |
| Módulos de gestão (Mapa de Intenções, painéis) | Município / CIM | Complemento | R2–R3 |

## 4. Hipóteses de preço

| Item | Hipótese |
|---|---|
| Piloto em Guimarães (5 meses) | 65.000 € |
| Plataforma base | 48.000 €/ano (escalão ~150 mil habitantes) |
| Capacidade ativa | 6.000 €/ano cada |
| Implementação de nova capacidade | 8.000–15.000 € |
| Adaptação de capacidade já construída | 30–50% da implementação |
| Missão concluída | 0,40 €, com teto anual |
| Certificação de agente terceiro | 3.000–25.000 €/ano |
| Operação de agente terceiro | 0,30 € (consulta) a 3,00 € (submissão preparada); 1,50 € por verificação de credencial |
| Partilha de receita com o município | 20% da receita de agentes em crédito na subscrição |

## 5. Contratos-tipo

### C1 · Piloto em Guimarães — 65.000 €, 5 meses

| Marco | Entrega | % | Valor |
|---|---|---:|---:|
| M1 | Descoberta: jornadas, donos de conteúdo, AIPD inicial | 20% | 13.000 € |
| M2 | Sandbox com conteúdo canónico da esplanada e do PDM | 30% | 19.500 € |
| M3 | Piloto com 100–300 munícipes reais e Consola em uso | 30% | 19.500 € |
| M4 | Relatório de impacto com métricas contra a linha de base | 20% | 13.000 € |

Via: ajuste direto ⚠️ (novo limite de 75.000 € a confirmar) ou parceria para a inovação. O conteúdo canónico é propriedade da Câmara.

### C2 · Subscrição de Guimarães — cerca de 166.000 € no ano 2

| Componente | Cálculo | Valor |
|---|---|---:|
| Plataforma base | — | 48.000 € |
| 10 capacidades ativas | 10 × 6.000 € | 60.000 € |
| 5 novas implementações | ~10.000 € cada | 50.000 € |
| 20.000 missões concluídas | × 0,40 € | 8.000 € |
| **Total** | | **≈ 166.000 €** |

Contrato plurianual por concurso público. Bónus ou penalização ligados a respostas com fonte, pedidos completos à primeira e tempo de triagem.

### C3 · Acordo-quadro CIM do Ave

Catálogo comum; desconto de rede de 30% na plataforma; capacidades já construídas custam só a adaptação.

### C4 · Agente terceiro: contabilidade

Certificação 3.000 €/ano; consulta 0,30 €; submissão preparada 3,00 €. Variante: vender ao fabricante do software de contabilidade.

### C5 · Agente terceiro: banca

Certificação 25.000 €/ano; verificação de credencial «PIP favorável» 1,50 €.

### C6 · Partilha de receita

20% da receita de agentes gerada no concelho volta à Câmara como crédito na subscrição seguinte ⚠️ (validar juridicamente).

### Cláusulas comuns

Conteúdo canónico propriedade da Câmara; reversibilidade (exportação de conteúdo, conectores e auditoria); núcleo EUPL; SLA 99,5%; subcontratante RGPD (art. 28.º); auditoria de segurança anual independente.

## 6. Simulação ilustrativa

| | Ano 1 | Ano 2 | Ano 3 |
|---|---:|---:|---:|
| Piloto em Guimarães | 65.000 € | — | — |
| Subscrição e resultado em Guimarães | — | 116.000 € | 130.000 € |
| Implementações em Guimarães | — | 50.000 € | 30.000 € |
| Outros municípios da CIM do Ave | — | 2 × 45.000 € | 7 × 40.000 € |
| Adaptações nos novos municípios | — | 60.000 € | 100.000 € |
| Agentes terceiros | — | — | 60.000 € |
| **Total** | **65.000 €** | **316.000 €** | **600.000 €** |

**Leitura:** só com municípios é um negócio regional (60 concelhos × 60.000 € ≈ 3,6 M€/ano). A escala vem dos agentes terceiros (efeito de rede) e da Europa (a mesma pergunta em todos os Estados-Membros com carteira digital).

## 7. Custos

| Custo | Ordem de grandeza | Controlo |
|---|---|---|
| Inferência de IA | Cêntimos por missão | Modelos menores para tarefas simples; cache |
| WhatsApp Business | Respostas na janela de 24 h aberta pelo cidadão quase sem custo; mensagens proativas pagas | Teto de alertas; canais alternativos |
| Curadoria e conectores | **Custo principal** | Cobrado na implementação; reutilização |
| Operação e segurança | Fixo por município | Plataforma multi-município |

## 8. Núcleo aberto

Especificação da Porta e núcleo em EUPL. Monetiza-se a operação alojada com SLA, os conectores, a certificação, a curadoria e os módulos. Razões: remove o medo de dependência; facilita a compra pública; torna a Porta candidata a norma; transforma a AMA em parceira.

## 9. Linhas vermelhas

1. O munícipe nunca paga pelo Afonso nem por nenhum nível de serviço.
2. Não há venda de dados, nem agregados. O Mapa de Intenções é só para a Câmara.
3. Não há recomendações pagas.
4. O Afonso funciona igual para todos, independentemente de quem paga.
5. Agentes terceiros só com Mandato Digital válido e no mesmo trilho de auditoria.

<a id="revisao-mentoria"></a>
## 10. Revisão após a mentoria (19/10/2026)

Duas recomendações da mentoria mudam o modelo: a **integração invertida** ([24](24-processos-canonicos-e-integracao.md)) e o **modelo de impacto** ([26](26-modelo-de-impacto-e-custos.md)).

### 10.1 O que muda nas fontes de receita

| Fonte | Antes | Depois |
|---|---|---|
| Implementação de capacidades | Delegate constrói conectores, cobra por jornada | A Câmara implementa o contrato. O Delegate cobra a **modelação e parametrização** do processo canónico e, opcionalmente, **integração assistida** |
| Subscrição | Plataforma + capacidades ativas | Plataforma + **processos canónicos ativos**, com preço indexado à poupança medida |
| Kit de integração | — | Contratos, implementação de referência e testes de conformidade **abertos e gratuitos**, para acelerar a adoção |
| Fornecedores de software autárquico | Parceiros possíveis | **Canal:** implementam o contrato uma vez e servem vários municípios. Selo «implementação conforme» |
| Agentes terceiros | Sem alteração | Sem alteração |

### 10.2 O que muda no preço

O cenário central do modelo de impacto estima uma poupança interna de **64 a 76 mil € em 10 meses** (a 20 €/h, hipótese). A subscrição recorrente de 116 mil €/ano não se paga só com poupança interna nesse cenário.

| Hipótese de preço revista 🧪 | Valor |
|---|---|
| Regra | Preço ≤ 40–50% da poupança interna demonstrada |
| Alternativa | Preço por missão concluída abaixo da poupança por processo (≈ 14 € no exemplo da esplanada): por exemplo 2–4 € por missão |
| Piloto | Mantém-se (65 mil €), com o objetivo explícito de medir a poupança e fixar o preço do ano 2 |

A simulação da secção 6 deve ser refeita depois de a equipa escolher a regra de preço.

### 10.3 Margem

A integração invertida reduz o custo de entrada em cada município: os processos canónicos nacionais são reutilizados e a parametrização local é leve. Um preço mais baixo por município pode manter a margem se a adoção for mais rápida.

## 11. Pressupostos a validar

| Pressuposto | Como validar | Quando |
|---|---|---|
| A Câmara paga por isto | Conversa com a Divisão de Atendimento e o executivo | Novembro 2026 |
| Preço do piloto aceitável | Comparar com contratos públicos semelhantes (Base.gov) | Novembro 2026 |
| É legal cobrar a terceiros | Parecer jurídico | Antes de R3 |
| Contabilistas pagariam | 5 entrevistas | 1.º trimestre 2027 |
| Custo de curadoria por capacidade | Medir no piloto | R1 |
