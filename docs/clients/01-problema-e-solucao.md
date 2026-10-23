# O problema e a solução

## O problema

Para resolver uma necessidade junto da Câmara, a pessoa tem de descobrir sozinha que procedimento se aplica, que documentos entregar, em que canal, com que regras e a que custo. A informação existe, mas está repartida pelo portal, pelo diretório de serviços, por formulários, regulamentos e tabelas de taxas, e está escrita em linguagem técnica.

Pense na Inês, uma personagem fictícia construída a partir de casos reais. Herdou um restaurante no centro de Guimarães e quer pôr uma esplanada. Sabe que precisa da Câmara, mas não sabe o que pedir, a quem, nem que regras se aplicam. O mais provável é telefonar, mandar um email e, mesmo assim, ir ao balcão.

### A dimensão do problema em Guimarães

Os números seguintes vêm dos relatórios de atividades da Câmara Municipal de Guimarães e cobrem o período de fevereiro a novembro de 2025:

| Indicador | Volume |
|---|---:|
| Atendimentos presenciais no Balcão Único (duração média entre 20 min 31 s e 28 min 24 s) | 22.425 |
| Chamadas atendidas | 41.473 |
| Registos de correspondência (88,7% por email) | 28.308 |
| Processos registados no Urbanismo Digital | 7.141 |
| Pedidos de inspeção ou reinspeção de ascensores | 751 |
| Licenças de ocupação do espaço público para obras | 407 |

Não existem dados públicos sobre a parte destes contactos que é apenas informativa ou que poderia ser evitada. Medi-la é um dos objetivos do piloto proposto (ver [Impacto e resultados esperados](04-impacto-e-resultados.md)).

### O que já existe e o que falta

O Município já tem um atendedor virtual com inteligência artificial. O Delegate não o substitui: acrescenta o que um assistente de perguntas e respostas não faz sozinho.

- Responder com a **fonte oficial à vista** e dizer «não sei» quando não há fonte.
- Encaminhar para o **procedimento certo**, e não apenas dar uma resposta certa.
- **Acompanhar o pedido** ao longo do tempo, do primeiro contacto à decisão.
- **Agir em nome da pessoa**, quando ela o autoriza.
- Mostrar à Câmara **o que a cidade quer fazer**, antes de os pedidos chegarem.

## A solução

O Delegate tem duas faces: uma que trabalha para a pessoa e outra que serve a Câmara. Ligam-se através de uma porta aberta e governada.

| Para quem | Peça | O que faz |
|---|---|---|
| Pessoa | **Henriques**, o representante digital | Recebe pedidos em linguagem natural, identifica o procedimento, responde com fonte e acompanha o pedido até ao fim |
| Pessoa | **Mandato Digital** | Autorização por níveis, de informar a agir, revogável a qualquer momento |
| Pessoa | **Cofre Digital Pessoal** | Guarda, cifrados e sob controlo da pessoa, os seus dados, documentos e intenções |
| Pessoa e Câmara | **Missão** | Cada pedido torna-se um processo acompanhado, com objetivo, passos, documentos, prazos e estado |
| Câmara | **Porta Agêntica Municipal** | Contrato aberto que define como agentes autorizados tratam serviços municipais, com regras, mandato e auditoria |
| Câmara | **Consola Municipal** | Os técnicos recebem casos preparados, com fontes e dados verificados, e concentram-se na decisão |
| Câmara | **Intenções do Concelho** | Vista agregada e anónima do que as pessoas pretendem fazer, por freguesia e por tema |

O detalhe de cada peça está em [Funcionalidades](02-funcionalidades.md).

## Como funciona: a esplanada da Inês

Este é o caso que o protótipo executa de ponta a ponta. Os passos assinalados com «Simulação» não tocam em sistemas reais da Câmara.

1. **A Inês pergunta.** Escreve ao Henriques no Telegram: quer pôr uma esplanada à porta do restaurante.
2. **O Henriques identifica o procedimento.** Reconhece que se trata de uma comunicação prévia de ocupação do espaço público com esplanada e responde em linguagem simples, com a fonte oficial: documento, artigo e data de consulta.
3. **A Inês dá um mandato.** Se quiser que o Henriques prepare o pedido, autoriza esse nível de ação. Sem autorização, o Henriques apenas informa.
4. **O Henriques recolhe o necessário.** Pede a morada, o estabelecimento, o número de mesas e as condições do passeio. Pede também os documentos exigidos e verifica-os contra as regras do regulamento. O que a Inês autoriza fica guardado, cifrado, no Cofre Digital.
5. **A Inês aprova o que sai.** O Henriques prepara o pacote mínimo de dados que a Câmara precisa para este pedido. A Inês vê o que segue e o que não segue.
6. **Autenticação e submissão** («Simulação»). A Inês confirma com a Chave Móvel Digital, e o pedido entra na Câmara com um número de processo.
7. **O técnico decide.** O caso chega à Consola Municipal já preparado, com fontes e dados verificados. O técnico aprecia, pede elementos se faltar alguma coisa e decide.
8. **A Inês é informada.** O Henriques acompanha o estado do processo e explica-lhe cada passo.

Em todo o percurso, cada passo fica registado num histórico selado, que mostra o que o Henriques fez e com que fundamento (ver [Diferenciais](03-diferenciais.md#pode-ser-auditado)).
