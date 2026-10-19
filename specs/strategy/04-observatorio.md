# 04 · Observatório (os bastidores ao vivo)

> Estado: proposta para discussão · Atualizado: 18/10/2026 · [Estratégia](README.md)

## 1. Propósito

Mostrar ao júri, num só ecrã projetado, **o que acontece por baixo da linha de superfície** quando a Inês fala com o Afonso. É a peça que torna a arquitetura compreensível.

**Regra de ouro:** o Observatório só desenha eventos reais do [contrato de eventos](07-contrato-de-eventos.md). Não há animações encenadas. Se um evento não existiu, nada acende.

## 2. Layout (1920 × 1080, projetado)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ DELEGATE · Observatório      ● ao vivo  [Narrativo|Técnico] [1×|½×] [⏸] [↺] │
├──────────────────────────────────────────────────────────────────────────────┤
│ PALCO · conversa no Telegram (réplica a partir dos eventos)                  │
│  Inês: Quero pôr uma esplanada…   Afonso: Para uma esplanada aberta… 📄      │
│  ▸ Legenda: «O Afonso identificou o pedido: ocupação do espaço público.»     │
├══════════════════════ linha de superfície ═══════════════════════════════════┤
│ BASTIDORES · grafo da arquitetura                    │ MISSÃO │ COFRE │ ...   │
│                                                      │                        │
│  Telegram → Afonso → Política → Orquestrador         │ Esplanada Casa Joaquim │
│                         ↓                            │ ●entendido ●a verificar│
│        Entendimento · Regras · Redator · Verificador │ ○preparado ○submetido  │
│                         ↓                            │                        │
│                 Porta Agêntica (MCP)                 │ Partilha: localização… │
│              ↙            ↓            ↘             │ Não partilha: terreno… │
│  Serviços Urbanos   Tesouraria    Agente externo     │                        │
│   (Simulação)       (Simulação)                      │                        │
│                         ↓                            │                        │
│                 Consola Municipal                    │                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ Fluxo de eventos: 10:02:11 porta.servico.obtido · 10:02:12 afonso.resposta… │
└──────────────────────────────────────────────────────────────────────────────┘
```

Tipografia legível a 6 metros: mínimo de 20 px; legendas a 28 px. Identidade «Palco e Bastidores» ([15](../15-ux-conteudo-e-tom.md#3-identidade-visual)).

## 3. Painéis

| Painel | Mostra | Eventos que o alimentam |
|---|---|---|
| **Palco** | Réplica da conversa (bolhas), botões carregados pela Inês, cartão de fonte | `canal.*` |
| **Legenda narrativa** | Uma frase em PT-PT por evento relevante | Todos (texto do catálogo) |
| **Grafo** | Nós da arquitetura; impulsos animados nas arestas; latência por nó; etiquetas «Simulação» | Todos, pela `origem` |
| **Missão** | Contrato de Missão; estados em escada; checklist; partilha / não partilha | `missao.*` |
| **Cofre** | Três camadas; itens a entrar com cadeado; conteúdo mostrado **cifrado**; metadados legíveis; cronómetro da chave libertada | `cofre.*` |
| **Mandatos** | Cartão do mandato; nível D0–D4; estado; revogação | `mandato.*` |
| **Auditoria** | Cadeia de eventos selados, com hash curto e ligação ao anterior; verificação de integridade | `auditoria.evento.selado` |
| **Avaliação** | Resultados da última execução (MET-Q1 a Q5) | `avaliacao.execucao.concluida` |
| **Fluxo de eventos** | Linha temporal; em modo técnico abre o JSON | Todos |

## 4. Modos

| Modo | Para quê | Diferenças |
|---|---|---|
| **Narrativo** (predefinido) | Pitch | Legendas grandes; só eventos relevantes; ritmo humano; grafo simplificado |
| **Técnico** | Perguntas do júri | Todos os eventos; JSON; latências; versões do registo; modelo de IA usado; tokens |

## 5. Ritmo: tempo real sem perder a leitura

- Os eventos chegam por SSE em tempo real e entram numa **fila de apresentação**.
- Em modo narrativo, cada evento relevante fica no mínimo **700 ms** em destaque (ajustável: 1× / ½×).
- Um indicador mostra «● ao vivo» ou «+4 eventos em fila».
- **Pausa** congela a apresentação; os eventos continuam a ser recebidos.

## 6. Animações (todas ligadas a eventos)

| Evento | Animação |
|---|---|
| `canal.mensagem.recebida` | Bolha entra no Palco; impulso Telegram → Afonso |
| `afonso.intencao.classificada` | Nó «Entendimento» acende; etiqueta com intenção e confiança |
| `porta.servicos.procurados` | Impulso Afonso → Porta; a Porta mostra a ferramenta MCP chamada |
| `afonso.resposta.verificada` | Visto verde no nó «Verificador»; cartão de fonte desce para o Palco |
| `afonso.resposta.abstencao` | Nó «Verificador» a terracota: «Sem fonte, não respondo» |
| `cofre.item.guardado` | Item voa da conversa para a camada certa do Cofre; o conteúdo vira texto cifrado |
| `mandato.concedido` | Cartão do mandato carimbado com o nível |
| `cofre.chave.libertada` | Cadeado abre com cronómetro «10:00 · MIS-0007» |
| `politica.decisao` | Portão no nó «Política»: verde (permitir), âmbar (confirmar), terracota (bloquear) |
| `porta.capacidade.chamada` | Impulso Porta → sistema simulado; o sistema pisca |
| `su.processo.criado` | Número de processo aparece no nó Serviços Urbanos |
| `consola.caso.decidido` | Impulso Consola → Serviços Urbanos → Afonso → Palco |
| `intencoes.agregado.atualizado` | Contador da freguesia sobe +1 |
| `auditoria.evento.selado` | Novo elo na cadeia de auditoria |

Respeitar `prefers-reduced-motion`: sem movimento, só mudanças de cor e texto.

## 7. Legendas narrativas

O texto de cada legenda vive no catálogo de eventos ([07](07-contrato-de-eventos.md#4-catalogo)) e é escrito pela pessoa de conteúdo. Exemplos:

| Evento | Legenda |
|---|---|
| `afonso.intencao.classificada` | «O Afonso percebeu o pedido: pôr uma esplanada. É um assunto da Câmara.» |
| `porta.servico.obtido` | «Foi buscar a ficha oficial à Porta da Câmara, versão de 20/10.» |
| `afonso.resposta.verificada` | «Antes de responder, verificou que cada afirmação tem fonte.» |
| `afonso.resposta.abstencao` | «Não encontrou fonte para o valor da taxa. Por isso, não o inventa.» |
| `cofre.item.guardado` | «Guardado no Cofre da Inês, cifrado. Nem nós conseguimos ler.» |
| `cofre.chave.libertada` | «Com o mandato da Inês, o Cofre abre só para esta missão, durante 10 minutos.» |
| `politica.decisao` (permitir) | «A política confirmou: há mandato, há confirmação, o risco é baixo.» |
| `consola.caso.decidido` | «A decisão é humana. A técnica aceitou, e o Afonso avisa a Inês.» |

## 8. Repetição e reposição

| Função | Como |
|---|---|
| **Gravar sessão** | Cada sessão de demo guarda a sequência de eventos com tempos |
| **Repetir** | O Observatório reproduz uma sessão gravada, com a etiqueta «Repetição de 23/10, 11h04» |
| **Vídeo de plano B** | Gravar o ecrã durante uma repetição |
| **Repor demo** | Botão protegido: apaga missões, itens e mandatos da demo e recarrega a semente |

A repetição é sempre anunciada como repetição. Nunca se apresenta como ao vivo.

## 9. Prioridades

| Prioridade | Elemento |
|---|---|
| M | Palco + grafo + fluxo de eventos + painéis Missão e Cofre + modo narrativo |
| S | Mandatos, Auditoria, legendas completas, fila com ritmo, Repor demo |
| S | Repetição de sessões |
| C | Modo técnico completo, painel Avaliação embutido, latências por nó |
