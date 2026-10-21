# AGENTS.md — contrato de eventos

**Dona: pessoa B (Infra).** Este pacote é a espinha dorsal do protótipo: o mesmo registo alimenta o Observatório, a Consola e a auditoria. Parte de [`../../AGENTS.md`](../../AGENTS.md).

> **Stack:** TypeScript, Zod v4 para o esquema, resumos SHA-256 encadeados, PostgreSQL para o registo só de acréscimo. Ver a [secção Stack](../../AGENTS.md#stack). O que está abaixo é o contrato, e não muda por decisão de ferramenta.

---

## A regra de ouro

> **O registo de eventos é a auditoria e o spectacle.** O que aparece no Observatório aconteceu. Se um evento não existiu, nada acende.

Isto não é preferência estética: é o que separa um sistema a demonstrar de um vídeo encenado, e um júri técnico nota a diferença.

## O que está congelado

1. **O envelope.** `id`, `ts`, `tipo`, `origem`, `sessao`, `missao`, `pessoa`, `ator`, `simulacao`, `dados`, `hash_anterior`, `hash`. Nenhum campo novo sem este ficheiro e sem o esquema concordarem.
2. **A forma do `tipo`:** `dominio.entidade.acao`, em minúsculas, com pontos. Passado a imutável.
3. **A cadeia de selos.** Cada evento aponta para o anterior e leva o seu próprio resumo. É o que torna a auditoria verificável e é o que o painel de auditoria mostra — quando houver.
4. **Nenhum evento apagado ou alterado.** Só de acréscimo. Corrigir é emitir outro evento.

## As regras de privacidade

Não são sugestões. São o que permite dizer ao júri que o operador não lê os dados da pessoa.

| Regra | Porquê |
|---|---|
| `pessoa` é sempre um **pseudónimo**. Nunca nome, telefone, identificador do canal ou endereço. | O pseudónimo liga eventos à mesma sessão sem dizer quem é. |
| **Nunca conteúdo do Cofre em claro** nos `dados`, em nenhum evento. | O conteúdo está cifrado; só metadados circulam. |
| Texto de conversa **só** em eventos `canal.*`. | Os restantes descrevem o que o sistema fez, não o que a pessoa disse. |
| `simulacao: true` sempre que venha de um sistema ou ato simulado. | Para o Observatório poder etiquetar, e para a auditoria registar a diferença. |
| Dados pessoais de terceiros **nunca** entram. | Um pedido sobre o vizinho é recusa, não resposta. |

## A auditoria dentro de `dados`

O modelo de dados pede que o evento de auditoria leve **mandato, fontes, resultado e versão**. O envelope é congelado e já tem eventos gravados com selo, pelo que acrescentar campos seria re-selar tudo o que existe. Decisão de 18/10/2026: esses quatro viajam **dentro de `dados`**, e o esquema obriga a que estejam lá.

O esquema recusa um evento da Porta sem eles — não é um aviso, é um erro:

| Tipo de evento | Obrigatório em `dados` |
|---|---|
| `porta.capacidade.chamada` | `mandato`, `fontes`, `resultado` |
| qualquer `porta.*` | `mandato`, `fontes` |

`resultado` leva `ok` e, quando falhou, o código de erro. `fontes` leva a lista de fontes com versão, no formato `fonte@versão` que é o mesmo que a Porta devolve ao cliente.

## Ao acrescentar um evento

1. Tipo em `dominio.entidade.acao`, nomeado pelo **facto** que ocorreu, não pelo ecrã que o mostra. `henriques.resposta.abstencao`, não `verificador.ficou.vermelho`.
2. Entrada no catálogo com a origem válida e a prioridade — M para a demonstração, S para depois.
3. **Legenda em português no ficheiro de legendas**, escrita por quem tem o conteúdo. Sem legenda, o evento não aparece no Observatório em modo narrativo.
4. `dados` com o mínimo necessário. Se duvidas de um campo, deixa-o de fora.
5. Teste no componente emissor que falha se o evento não sair.

## O que está livre

Como os `dados` de cada tipo se estruturam, o texto das legendas (é conteúdo, não contrato), a ordem de substituição no catálogo e o formato do relatório de auditoria.

## Como se prova que está feito

- O esquema valida um evento real, e falha se um campo obrigatório faltar.
- Um evento novo emite-se num teste e aparece no fluxo do Observatório.
- A cadeia de selos verifica-se sobre a sessão completa: os testes percorrem-na e falham se um elo estiver quebrado.
- Nenhum evento do R0 leva conteúdo do Cofre em claro: há um teste que percorre a sessão e o confirma.