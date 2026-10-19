# Delegate — protótipo R0

Protótipo do **Delegate**, para o desafio «Falar com a Câmara sem burocracia» do
Hack4Guimarães 2035. Um assistente de inteligência artificial que responde com
a fonte oficial à vista e, quando não tem fonte, diz que não sabe.

- **Especificações e plano:** [`../specs/README.md`](../specs/README.md) e
  [`../specs/strategy/11-plano-do-prototipo.md`](../specs/strategy/11-plano-do-prototipo.md)
- **Decisões técnicas:** [`../specs/21-registo-de-decisoes.md`](../specs/21-registo-de-decisoes.md)
- **Contrato para quem escreve código:** [`AGENTS.md`](AGENTS.md)

## Arrancar

Requer Node 22 ou superior.

```bash
npm install
npm run registo:validar     # o Registo Canónico passa o esquema?
npm run nucleo               # PostgreSQL + Telegram + fluxo de eventos + Observatório
```

O Observatório abre-se em <http://localhost:4000>. Para escrever ao bot, é
preciso um token do [@BotFather](https://t.me/BotFather) num ficheiro `.env`
junto ao `package.json` — o ficheiro está no `.gitignore` e nunca é versionado.

| Comando | O que faz |
|---|---|
| `npm run nucleo` | Arranca o núcleo: base de dados, bot e fluxo de eventos |
| `npm run ouvir` | Só o canal do Telegram, sem base de dados |
| `npm run t:testes` | Testes do contrato de eventos, da auditoria e do registo |
| `npm run registo:validar` | Valida as fichas; `-- --estrito` também falha por fontes por curar |
| `npm run provar:postgres` | Prova que o PostgreSQL embutido arranca e que a notificação chega |

## Dependências, e porque cada uma

Cada dependência entra com uma frase a dizer o que resolve. Nenhuma foi
escolhida por costume.

| Dependência | Para quê | Porque esta e não outra |
|---|---|---|
| [`grammY`](https://grammy.dev/) | Bot do Telegram em *long polling* | A alternativa principal, Telegraf, não tem publicação desde fevereiro de 2024. O *long polling* dispensa URL público, e o bot corre no portátil atrás de NAT. |
| [`@modelcontextprotocol/*`](https://github.com/modelcontextprotocol/typescript-sdk) | A Porta Agêntica, em MCP | É o único SDK oficial, e a v2 é a linha estável. O `EventSource` do navegador não serve: o MCP precisa de POST e cabeçalhos. |
| [`embedded-postgres`](https://www.npmjs.com/package/embedded-postgres) e [`pg`](https://node-postgres.com/) | Base de dados | Traz binários PostgreSQL reais por npm, sem `sudo` e sem contentor. `node:sqlite` seria mais leve, mas não tem `LISTEN/NOTIFY` entre ligações, que é o que alimenta o fluxo de eventos. |
| [`zod`](https://zod.dev/) | Esquemas do registo e do evento | Deriva o esquema da Porta e o contrato de eventos do mesmo objecto, sem os manter em paralelo. |
| [`vitest`](https://vitest.dev/) | Testes | Corre os ficheiros TypeScript directamente, sem passo de construção. |
| [`tsx`](https://tsx.is/) | Executar TypeScript | Corre o código directamente, sem compilação no caminho quente. |

## Modelo de IA

Por decidir — ver [ADR-023](../specs/21-registo-de-decisoes.md#adr-023). O Afonso
tem um caminho que não depende de modelo: o roteamento é determinístico e o
verificador são regras em código. Sem chave, responde na mesma; a modelo só
muda a redação.

## Licença

[EUPL-1.2](LICENSE), escolhida para que a Câmara possa reutilizar o código sem
depender de um fornecedor.