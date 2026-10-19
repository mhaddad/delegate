# AGENTS.md — Registo Canónico

**Dona: pessoa C, revisto por A e B.** As fichas dos serviços, com a fonte que sustenta cada afirmação. Parte de [`../AGENTS.md`](../AGENTS.md).

---

## O que é

Uma ficha por serviço, no esquema do [modelo de dados §2](../../specs/11-modelo-de-dados.md), validada por esquema. É a fonte de verdade de tudo o que o Afonso diz: sem registo, não há resposta.

> As fichas são YAML, validadas por esquema Zod v4. Ver a [secção Stack](../AGENTS.md#stack). O esquema em si é anterior à escolha de ferramenta.

## Congelado

**Cada campo aponta para um identificador de fonte.** Condições, documentos, prazos e taxas referenciam uma entrada de `fontes[]` que carrega identificador, endereço, data de consulta e hash. Um valor sem fonte é `null` — não é um valor estimado.

**Os requisitos copiam-se literalmente.** Escreve-se o que a fonte diz, não como nos conviria descrever.

**Nunca inferir uma taxa ou um documento pelo nome do formulário.** O nome diz o que o serviço é, não quanto custa nem o que é exigido.

**O estado por omissão é `revisto`.** Só a Câmara pode pôr `validado`, e isso é do piloto, não do R0.

## Curadoria por serviço

1. Abrir a fonte oficial e guardar o endereço exato.
2. Guardar a data da consulta e o hash do conteúdo.
3. Copiar os requisitos e as condições **tal como estão**.
4. Extrair documentos e prazos com a fonte ao lado.
5. Taxa: só com a fonte que a dá. Se a fonte não der, fica `null` e o Afonso abstém-se — que é a resposta certa, não uma falha.

## O `data/` como chave de verificação

`data/procedures.json` traz 98 blocos de prosa municipal verbatim, com prazos e modelos de requerimento. `data/fees/rttl_cache.json` traz 491 taxas com citação literal e número de linha na RTTL.

Use-os para **confirmar** o que curou e para cruzamento quando a fonte oficial não trouxer o número. Nunca para preencher por inferência.

## Ordem

Cinco serviços, nesta ordem:

1. **Esplanada à porta** — âncora da demonstração. Não existe no corpus: tem de vir da fonte oficial.
2. **Andaime ou tapume** — também ausente do corpus; taxa citável.
3. **Inspeção de elevador** — taxa limpa e citável.
4. **Terreno e PDM** — sem taxa; o valor está em explicar.
5. **Consultar um processo** — procedimento simples, sem custo.

Os cinco primeiros dias de registo até às 12h30 de segunda, com revisão de A e B. Este caminho é crítico: a classificação, as fontes das respostas e a avaliação dependem dele.

## Como se prova que está feito

O comando de validação do registo falha se uma ficha não passar no esquema ou se um campo tiver valor sem fonte. Sai limpo quando está pronto.