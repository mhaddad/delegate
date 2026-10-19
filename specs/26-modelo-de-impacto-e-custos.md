# 26 · Modelo de impacto e custos para a Câmara

> Estado: proposta recomendada pela mentoria (19/10/2026) · Atualizado: 19/10/2026 · [Índice](README.md)
> Decisão: [ADR-022](21-registo-de-decisoes.md#adr-022). Complementa [18 · Métricas](18-metricas-e-okr.md) e [16 · Modelo de negócio](16-modelo-de-negocio.md).

## 1. Porquê

O critério «Impacto e relevância» vale 30% da nota. A mentoria recomendou mostrar **quanto custa hoje um processo à Câmara e quanto custaria com o Delegate**, para gerar interesse real do poder público na implementação.

Não existem dados públicos de custo por processo. Por isso este documento define:

1. um **modelo de custeio por atividades**, com pressupostos visíveis;
2. um **cenário ilustrativo** calculado com os volumes reais do dossiê e hipóteses marcadas;
3. uma **calculadora** para a demo, onde qualquer pressuposto se ajusta à vista;
4. o **plano de medição** que transforma hipóteses em factos no piloto.

## 2. Princípios

1. **Pressupostos à vista.** Cada número diz de onde vem: ✅ dossiê, 🧪 hipótese, 📏 a medir no piloto.
2. **Capacidade libertada, não cortes.** Horas poupadas são horas para instruir, decidir e apoiar quem precisa. Não se promete redução de pessoal.
3. **Três beneficiários:** a Câmara (horas e retrabalho), o munícipe (tempo e deslocações) e a economia local (dias até abrir, construir, faturar).
4. **Conservador por defeito.** O cenário central usa hipóteses prudentes; os otimistas ficam na calculadora.
5. **Regras de uso dos números do dossiê** ([01](01-contexto-e-problema.md#regras-numeros)): não somar indicadores diferentes, não chamar «anual» à janela de 10 meses, não contar pessoas únicas.

## 3. Modelo de custeio por atividades

```text
Custo atual por processo       = Σ (frequência_i × tempo_i) × custo_hora
Custo com Delegate por processo = Σ (frequência_i' × tempo_i') × custo_hora + custo_Delegate_por_processo
Poupança                       = volume × (custo atual − custo com Delegate)
Horas libertadas               = volume × Σ (frequência_i × tempo_i − frequência_i' × tempo_i')
```

`custo_hora` é o custo horário carregado (remuneração, encargos e custos indiretos). 📏 A obter junto dos recursos humanos da Câmara.

## 4. Exemplo por processo: comunicação prévia de esplanada

Todas as frequências e tempos são hipóteses 🧪, a medir no piloto.

| Atividade da Câmara | Hoje (freq. × min) | Com Delegate (freq. × min) | Porquê muda |
|---|---|---|---|
| Chamada informativa | 1 × 4 = 4 | 0,1 × 4 = 0,4 | Resposta D0 com fonte |
| Atendimento presencial | 0,5 × 24 = 12 | 0,1 × 24 = 2,4 | Orientação e preparação no telemóvel. Os 24 min estão dentro do intervalo do dossiê ✅ (20min31s a 28min24s) |
| Email de esclarecimento | 1 × 8 = 8 | 0,1 × 8 = 0,8 | Idem |
| Instrução técnica | 1 × 30 = 30 | 1 × 20 = 20 | Caso preparado, fontes e dados mínimos |
| Pedido de elementos (retrabalho) | 0,4 × 25 = 10 | 0,15 × 25 = 3,75 | Pedido completo à primeira |
| Notificação ao requerente | 1 × 5 = 5 | 0 | O Afonso notifica |
| **Total** | **69 min** | **27,4 min** | **−42 min (−60%)** |

Com um custo horário hipotético de **20 €/h** 🧪: hoje **23,00 €**, com Delegate **9,12 €**, poupança **13,88 € por processo**. O custo variável do Delegate (IA e mensagens) é de cêntimos por missão 🧪.

**Lado do munícipe (🧪):** pesquisa e chamadas (cerca de 2h), metade das vezes uma ida ao balcão (cerca de 1h30) → cerca de **2h50 hoje**, contra **cerca de 15 min** com o Delegate.

**Lado da economia (📏):** dias ganhos até a esplanada abrir × receita diária da esplanada. Medir com negócios do piloto.

## 5. Cenário para Guimarães (janela de 10 meses de 2025)

### 5.1 Contactos informativos resolvidos em D0

Volumes ✅ do dossiê (fevereiro a novembro de 2025). `s` = parte dos contactos que passam a ser resolvidos pelo Afonso 🧪.

| Canal | Volume ✅ | Tempo por contacto | Horas libertadas com s = 20% |
|---|---:|---|---:|
| Atendimento presencial no BUA | 22.425 | 20min31s a 28min24s ✅ | 1.534 a 2.123 h |
| Chamadas atendidas | 41.473 | 4 min 🧪 | 553 h |
| Correspondência por email | 25.107 | 8 min 🧪 | 670 h |
| **Total** | — | — | **2.756 a 3.345 h** |

| Cenário | s | Horas libertadas (10 meses) |
|---|---:|---:|
| Prudente | 10% | 1.378 a 1.673 h |
| **Central** | **20%** | **2.756 a 3.345 h** |
| Otimista | 30% | 4.135 a 5.018 h |

### 5.2 Instrução com casos preparados

Processos ✅: 7.141 registos no Urbanismo Digital e 2.193 licenças e pedidos nas cinco atividades do Gabinete de Serviços Urbanos (751 + 655 + 407 + 197 + 183). Hipóteses 🧪: 30% passam pelo Delegate; poupança de 10 min por processo.

9.334 × 30% × 10 min ≈ **467 h**

### 5.3 Total e valor

| Cenário central | Horas (10 meses) | A 15 €/h 🧪 | A 20 €/h 🧪 | A 30 €/h 🧪 |
|---|---:|---:|---:|---:|
| Contactos + instrução | 3.223 a 3.812 h | 48 mil a 57 mil € | 64 mil a 76 mil € | 97 mil a 114 mil € |

Equivale a cerca de **2,4 a 2,9 pessoas a tempo inteiro** durante os 10 meses (≈ 1.333 h por pessoa), libertadas para trabalho de maior valor 🧪.

**Não incluído (📏, potencial adicional):** redução de pedidos incompletos noutros serviços, consultas de processos por telefone, deslocações evitadas dos munícipes, valor económico dos dias ganhos.

## 6. Leitura crítica: o preço tem de acompanhar o valor

Com estes pressupostos, a poupança direta da Câmara no cenário central fica entre **64 e 76 mil € em 10 meses a 20 €/h**. A subscrição recorrente que tínhamos estimado para Guimarães no ano 2 é de **116 mil €** ([16](16-modelo-de-negocio.md)).

**Só com custos internos, a subscrição proposta não se paga** no cenário central. Paga-se no cenário otimista ou com custo horário perto de 30 €/h.

Consequências:

1. **Rever a hipótese de preço:** indexar a subscrição à poupança medida (meta: preço ≤ 40–50% da poupança demonstrada) ou cobrar por missão concluída, com o preço por missão abaixo da poupança por processo ([16](16-modelo-de-negocio.md#revisao-mentoria)).
2. **Contar o valor completo no pitch:** Câmara + munícipes + economia local, sempre separados.
3. **O piloto existe para medir:** o relatório de impacto do piloto (marco M4) estabelece o preço do ano 2.

Esta tensão é uma descoberta útil, não um problema a esconder: um júri com pessoas da Câmara vai fazer estas contas.

## 7. Calculadora de impacto (demo)

Separador «Impacto» na Consola Municipal ([strategy/06](strategy/06-consola-e-mapa.md)).

| Entrada | Valor por defeito | Origem |
|---|---|---|
| Volumes por canal e por processo | Do dossiê | ✅ com fonte visível |
| Tempo de atendimento presencial | 24 min (intervalo 20,5–28,4) | ✅ |
| Tempo por chamada / por email | 4 / 8 min | 🧪 |
| Parte resolvida em D0 (`s`) | 20% | 🧪 |
| Parte dos processos pelo Delegate | 30% | 🧪 |
| Minutos poupados por caso preparado | 10 | 🧪 |
| Custo horário carregado | 20 € | 🧪 |
| Custo do Delegate | Subscrição e preço por missão | 🧪 |

| Saída | Forma |
|---|---|
| Horas libertadas | Número grande + equivalente em pessoas a tempo inteiro |
| Valor em euros | Intervalo |
| Comparação por processo | Tabela «hoje × com Delegate» (secção 4) |
| Retorno | Poupança ÷ custo do Delegate |
| Avisos | «Cenário com pressupostos; a medir no piloto» sempre visível |

Botões de cenário: Prudente · Central · Otimista. Na demo, o júri pode mudar um pressuposto e ver o efeito.

## 8. Plano de medição no piloto

| Hipótese | Como medir | Quando |
|---|---|---|
| Tempo por chamada e por email | Amostragem de tempos durante 2 semanas na Divisão de Atendimento | Descoberta |
| Parte dos contactos que são informativos | Classificação de 500 contactos (presencial, telefone, email) | Descoberta |
| Tempo de instrução por processo | Registo de tempos com 3–5 técnicos, antes e depois | Descoberta e piloto |
| Pedidos incompletos à primeira | Eventos de pedido de elementos no sistema de origem | Piloto |
| Custo horário carregado | Recursos humanos da Câmara | Descoberta |
| Tempo do munícipe | Inquérito curto no fim da missão | Piloto |

O resultado entra no relatório de impacto (marco M4 do piloto) e substitui as hipóteses desta página.

## 9. Como dizer no pitch

> «Em 10 meses de 2025, o Balcão Único fez 22.425 atendimentos presenciais, de 20 a 28 minutos cada, e a Câmara atendeu 41.473 chamadas. Se só um em cada cinco destes contactos for resolvido pelo Afonso com a fonte certa, a Câmara liberta mais de 3 mil horas, o equivalente a duas pessoas e meia a tempo inteiro, para trabalho que exige uma pessoa. Os pressupostos estão na calculadora, e o piloto mede-os.»
