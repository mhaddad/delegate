# AGENTS.md — API

Processos do núcleo e da Porta. Parte de [`../../AGENTS.md`](../../AGENTS.md) e do [contrato de eventos](../../packages/eventos/AGENTS.md).

> **Stack:** TypeScript; PostgreSQL embutido com esquemas separados; `LISTEN/NOTIFY` a alimentar o fluxo de eventos, que o navegador consome por SSE. Portas em localhost, acordadas na implementação. Ver a [secção Stack](../../AGENTS.md#stack).

---

## Dois processos

| Processo | Serve |
|---|---|
| **núcleo** | o canal, o Afonso, o Cofre, os mandatos, e o fluxo de eventos |
| **porta** | a Porta Agêntica, o Registo Canónico, os Serviços Urbanos, a Tesouraria |

São dois executáveis no mesmo pacote. A separação é de processo, não de instalação: o núcleo fala com a Porta pela rede como cliente MCP, e o Observatório mostra esse salto como um salto de rede, porque é.

## Congelado

- **A Porta só se acede pelo protocolo da Porta.** O núcleo nunca importa código da Porta nem chama os sistemas simulados em memória.
- **Os sistemas simulados não conhecem o Afonso.** Só recebem o que a Porta lhes passa, depois de verificar mandato.
- **O fluxo de eventos é só de leitura** para a web. A web nunca lê a base de dados.
- **Uma base por serviço lógico.** Separadas de propósito: é o que impede que uma rota simulada sirva de atalho para outra.

## Livre

- Estrutura interna de cada módulo, desde que as fronteiras acima se cumpram.
- Portas, linguagem e bibliotecas.
- Rotas internas dos sistemas simulados.

## Base de dados

Uma base por serviço lógico, sem camada de mapeamento de objetos: as consultas são curtas e legíveis. Numa demonstração de cinco dias, o custo de um mapeador é maior do que o que poupa.

O registo de eventos é só de acréscimo: depois de escrito, nunca é alterado.

## Configuração

Tudo por configuração externa, com valor por omissão para que o protótipo arranque sem segredos. O token do canal nunca vai para o repositório, e há um ficheiro de exemplo com as chaves vazias.

Quando não há token, o canal não arranca e o resto funciona — é assim que se trabalha antes de o token existir.

## Como se prova que está feito

- Um comando só arranca os dois processos e o fluxo de eventos responde.
- Uma chamada do núcleo à Porta aparece no fluxo de eventos com origem `porta`.
- O Observatório e a Consola mostram eventos sem nunca abrir a base de dados.
- Os testes passam, incluindo a verificação da cadeia de selos.