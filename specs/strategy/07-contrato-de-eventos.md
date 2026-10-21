# 07 · Contrato de eventos

> Estado: proposta para discussão · Atualizado: 18/10/2026 · [Estratégia](README.md)
> **Primeiro artefacto a fechar no dia 19.** Todos os componentes emitem e leem eventos neste formato.

## 1. Porque é central

- **Liga tudo sem acoplamento:** o Observatório e a Consola não precisam de conhecer o código do núcleo nem da Porta.
- **É a auditoria:** o mesmo registo, só de acréscimo e encadeado por hash, alimenta o painel de auditoria e «Quem viu os meus dados».
- **Permite repetição:** uma sessão gravada é uma lista de eventos.
- **Garante honestidade:** o que aparece no ecrã aconteceu.

## 2. Envelope

```json
{
  "id": "ev_01JBX…",
  "ts": "2026-10-21T10:02:11.482Z",
  "tipo": "porta.servico.obtido",
  "origem": "porta",
  "sessao": "demo-2026-10-21-1100",
  "missao": "MIS-0007",
  "pessoa": "p_ines_demo",
  "ator": "agente:navegador-regras",
  "simulacao": false,
  "dados": { "servico": "ocupacao-espaco-publico-esplanada", "versao": "2026-10-20.1" },
  "hash_anterior": "sha256:9f2c…",
  "hash": "sha256:1ab7…"
}
```

| Campo | Regra |
|---|---|
| `tipo` | `dominio.entidade.acao`, do catálogo abaixo |
| `origem` | `canal`, `henriques`, `orquestrador`, `politica`, `cofre`, `mandatos`, `porta`, `su`, `tesouraria`, `consola`, `proatividade`, `intencoes`, `avaliacao` |
| `pessoa` | Pseudónimo; nunca nome, telefone ou id do Telegram |
| `simulacao` | `true` quando o evento vem de um sistema ou ato simulado |
| `dados` | **Nunca** conteúdo do Cofre em claro nem dados pessoais. Textos de conversa só em eventos `canal.*` |
| `hash` | SHA-256 do envelope sem `hash`, encadeado com `hash_anterior` |

## 3. Transporte

| Elemento | Escolha |
|---|---|
| Persistência | Tabela `eventos` só de acréscimo (Postgres) |
| Difusão | `LISTEN/NOTIFY` → endpoint SSE `/eventos/stream?sessao=…` |
| Esquema | Tipos TypeScript + validação (Zod) no pacote `packages/eventos` |
| Versão | Campo `v` no envelope a partir da primeira alteração incompatível |

<a id="4-catalogo"></a>
## 4. Catálogo

### Canal

| Tipo | Dados | Legenda (modo narrativo) |
|---|---|---|
| `canal.mensagem.recebida` | `texto`, `tipo_entrada` | — (bolha no Palco) |
| `canal.mensagem.enviada` | `texto`, `fontes[]`, `botoes[]` | — (bolha no Palco) |
| `canal.botao.carregado` | `botao` | «A Inês decidiu: {botao}.» |

### Henriques e orquestração

| Tipo | Dados | Legenda |
|---|---|---|
| `henriques.intencao.classificada` | `intencao`, `competencia`, `categoria`, `confianca` | «O Henriques percebeu o pedido: {intencao}.» |
| `henriques.resposta.redigida` | `fontes[]`, `latencia_ms` | «Escreveu a resposta só com as fontes encontradas.» |
| `henriques.resposta.verificada` | `citacoes_ok`, `numeros_sem_fonte` | «Verificou que cada afirmação tem fonte.» |
| `henriques.resposta.abstencao` | `motivo` | «Sem fonte, não inventa.» |
| `missao.criada` | `servico`, `objetivo` | «O pedido virou uma missão.» |
| `missao.estado.alterado` | `de`, `para` | «A missão passou a {para}.» |
| `missao.checklist.gerada` | `passos` | «Preparou os passos a partir da ficha oficial.» |

### Cofre e mandatos

| Tipo | Dados | Legenda |
|---|---|---|
| `cofre.item.proposto` | `camada`, `titulo`, `finalidade` | «Sugeriu guardar. A decisão é da Inês.» |
| `cofre.item.guardado` | `item`, `camada`, `finalidade`, `validade`, `cifra` (excerto do texto cifrado) | «Guardado e cifrado. Nem nós conseguimos ler.» |
| `cofre.item.apagado` | `item` | «Apagado a pedido da Inês.» |
| `cofre.chave.libertada` | `missao`, `expira_em` | «O Cofre abre só para esta missão, durante 10 minutos.» |
| `cofre.chave.recolhida` | `missao` | «A chave voltou a fechar.» |
| `cofre.pacote.preparado` | `campos[]`, `nao_partilha[]` | «Separou só o mínimo necessário.» |
| `cofre.pacote.aprovado` | `pacote` | «A Inês aprovou o que sai do Cofre.» |
| `mandato.proposto` / `.concedido` / `.revogado` | `mandato`, `nivel`, `ambito`, `validade` | «Mandato {nivel} para {ambito}.» |

### Política

| Tipo | Dados | Legenda |
|---|---|---|
| `politica.decisao` | `acao`, `resultado` (`permitir` / `confirmar` / `bloquear`), `regra` | «A política {resultado}: {regra}.» |

### Porta e sistemas

| Tipo | Dados | Legenda |
|---|---|---|
| `porta.servicos.procurados` | `cliente`, `consulta`, `resultados` | «Procurou na Porta da Câmara.» |
| `porta.servico.obtido` | `cliente`, `servico`, `versao` | «Foi buscar a ficha oficial, versão {versao}.» |
| `porta.capacidade.chamada` | `cliente`, `capacidade`, `mandato`, `resultado` | «Usou a capacidade {capacidade}, com mandato.» |
| `porta.acesso.recusado` | `cliente`, `codigo` | «A Porta recusou: {codigo}.» |
| `su.processo.criado` | `processo` | «O sistema da Câmara registou o processo {processo}.» |
| `su.processo.estado.alterado` | `processo`, `de`, `para` | «Processo {processo}: {para}.» |
| `tesouraria.referencia.emitida` | `processo`, `valor_ficticio` | «A Tesouraria emitiu a referência.» |

### Consola, proatividade, intenções, auditoria, avaliação

| Tipo | Dados | Legenda |
|---|---|---|
| `consola.caso.criado` | `caso`, `motivo` | «O caso chegou à Câmara, já preparado.» |
| `consola.caso.aberto` | `caso`, `ator` | «A técnica abriu o caso.» |
| `consola.caso.decidido` | `caso`, `acao`, `fundamento` | «A decisão é humana: {acao}.» |
| `proatividade.alerta.enviado` | `tema`, `autorizado_em` | «Aviso enviado porque a Inês o autorizou.» |
| `intencoes.agregado.atualizado` | `tema`, `freguesia`, `contagem` | «A cidade ganhou mais uma intenção: {tema}.» |
| `auditoria.integridade.verificada` | `ate_evento`, `ok` | «Cadeia de auditoria íntegra.» |
| `avaliacao.execucao.concluida` | `metricas` | «Avaliação: {MET-Q1} procedimento certo.» |

## 5. Regras

1. Um evento por facto. Nada de eventos «resumo» para enfeitar.
2. Nenhum componente apaga ou altera eventos.
3. Eventos de sistemas simulados levam `simulacao: true`, e o Observatório mostra a etiqueta.
4. Os testes de cada componente verificam os eventos emitidos (contrato como teste).
5. As legendas vivem num ficheiro de textos (`packages/eventos/legendas.pt-PT.json`), da responsabilidade da pessoa de conteúdo.
