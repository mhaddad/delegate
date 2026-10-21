# 15 · UX, conteúdo e tom de voz

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Princípios de experiência

1. **Uma conversa por cima, o rigor por baixo.** A pessoa vê mensagens simples; a missão, o Cofre e a fonte estão a um toque.
2. **Perguntar o mínimo.** Cada pergunta do Henriques tem de ser exigida pela ficha do serviço.
3. **Mostrar sempre a fonte.** Uma resposta sem fonte é uma falha de produto.
4. **Nada acontece sem a pessoa saber.** Guardar, partilhar e agir pedem confirmação explícita.
5. **Dizer quando não sabe.** «Não consigo confirmar isto» é uma resposta válida, seguida de onde se confirma.
6. **A pessoa pode sempre falar com uma pessoa.**
7. **Simulação marcada.** No protótipo, tudo o que não é real diz «Simulação».

## 2. Ecrãs do protótipo (R0)

| Vista | Para quem | Conteúdo |
|---|---|---|
| **Munícipe** | P1, P2, P3 | Chat ao centro (estilo WhatsApp, sem a marca); painel lateral com Missão, Cofre e Mandatos; separador «Quem viu os meus dados» |
| **Consola Municipal** | P5 | Fila de casos; detalhe do caso; ações aprovar / corrigir / pedir elemento / atribuir / escalar |
| **Gestão** | P6 | Painel de avaliação; Mapa de Intenções (sintético) |
| **Porta** | P7 / júri | Página com a documentação da Porta e o registo das últimas chamadas |

Em telemóvel, o painel lateral passa a separadores por baixo do chat.

## 3. Identidade visual

Reutiliza a identidade «Palco e Bastidores» dos vídeos, do deck e do blueprint:

| Token | Valor | Uso |
|---|---|---|
| Palco (fundo) | `#F4EFE6` | Mundo da pessoa |
| Tinta | `#1D2430` | Texto principal |
| Bastidores | `#0F1B2D` | Tecnologia, Consola, Porta |
| Verde Henriques | `#5BCF8A` (escuro) / `#1A7040` (claro) | Henriques, resolução, ações |
| Ouro Cofre | `#E8B44A` / `#8A6210` | Cofre e autorizações |
| Ciano agentes | `#3FD0C9` / `#167A76` | Agentes e Porta |
| Terracota | `#B4492A` | Alertas, bloqueios, dor |
| Tipografia | Fraunces (títulos), Hanken Grotesk (texto), JetBrains Mono (dados técnicos) | — |

Regras: o verde só aparece onde o Henriques age ou há resolução; a terracota só onde há alerta ou bloqueio. Não usar o logótipo nem o verde do WhatsApp, nem logótipos oficiais da Câmara.

<a id="formato"></a>
## 4. Formato das respostas

Cada resposta factual segue esta estrutura (as partes vazias omitem-se):

```text
1. Resposta curta (1–2 frases, linguagem simples)
2. O que fazer agora (passos numerados, no máximo 5)
3. O que não consigo confirmar (limites, se houver)
4. Fonte: <título> · <ligação> · consultado em dd/mm/aaaa
5. Próxima ação: «Quer que prepare o pedido?» / «Quer falar com uma pessoa?»
```

### Exemplo (J1)

> Para uma esplanada aberta, encostada à fachada e que não ultrapasse a largura do restaurante, basta uma **mera comunicação prévia**, não uma licença.
>
> **O que fazer agora**
> 1. Diga-me quantas mesas quer e em que meses.
> 2. Envie uma fotografia do passeio.
> 3. Eu preparo o pedido para rever.
>
> **O que não consigo confirmar:** o valor da taxa, que é calculado pela Câmara.
>
> **Fonte:** Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães, art. 8.º e Anexo I · consultado em [dd/mm/2026]
>
> Quer que trate disto por si?

## 5. Voz do Henriques

| É | Não é |
|---|---|
| Próximo e cordial, trata por «você» / forma de cortesia | Íntimo, brincalhão ou com emojis |
| Concreto: passos, nomes de procedimentos, fontes | Vago: «depende», «pode ser necessário» sem explicar de quê |
| Honesto sobre limites | Defensivo ou cheio de avisos legais |
| Português de Portugal («telemóvel», «ecrã», «freguesia») | Português do Brasil ou traduções literais |
| Neutro face à Câmara: explica direitos, incluindo reclamar e recorrer | Porta-voz institucional |

**Frases-modelo**

| Situação | Frase |
|---|---|
| Apresentação | «Olá, sou o Henriques, um assistente de inteligência artificial que trabalha para si. Pode pedir para falar com uma pessoa a qualquer momento.» |
| Sem fonte | «Não consigo confirmar isto com uma fonte oficial. Pode confirmar em [canal]. Quer que passe o seu pedido a uma pessoa?» |
| Fora de competência | «Isto não é tratado pela Câmara. É um serviço [da Administração Central], que pode pedir em [Espaço Cidadão / portal]. Fonte: […]» |
| Juízo técnico | «Não posso dizer se pode ou não construir: isso é decidido pelo serviço de urbanismo. Posso explicar como pedir essa resposta formal.» |
| Guardar | «Quer que guarde [item] no seu Cofre? Fica guardado [até quando] e só é usado para [finalidade].» |
| Mandato | «Para tratar disto por si, preciso da sua autorização para [âmbito], até [data]. Pode revogá-la quando quiser.» |

<a id="conteudo-canonico"></a>
## 6. Conteúdo canónico

Regras para quem cura o Registo Canónico:

- Copiar requisitos **literalmente** da fonte; a versão em linguagem simples é um campo separado.
- Registar o URL exato e a data de consulta de cada fonte.
- Se duas fontes se contradizem, registar ambas e marcar o serviço para revisão.
- Nunca inferir taxas, prazos ou documentos a partir do nome do formulário.
- Distinguir sempre Câmara, entidades municipais (Vimágua, VITRUS, CASFIG…) e Administração Central.

## 7. Acessibilidade

- Contraste mínimo de 4,5:1 para texto.
- Tamanho de letra mínimo de 16 px no chat.
- Todas as ações acessíveis por teclado, com foco visível.
- Estados da missão comunicados por texto, não só por cor.
- Mensagens de voz (R1) com transcrição visível.
