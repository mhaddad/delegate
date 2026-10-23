# Funcionalidades

Esta página descreve o que o Delegate faz e indica, para cada funcionalidade, o que está construído no protótipo, o que é simulado e o que está planeado para o piloto.

| Estado | Significado |
|---|---|
| **Construído** | Funciona no protótipo apresentado a 23 de outubro de 2026 |
| **Simulação** | Funciona no protótipo, mas substitui um sistema real; está assinalado como «Simulação» no ecrã |
| **Planeado** | Faz parte da proposta, mas ainda não está construído |

## Para a pessoa

### Henriques, o representante digital

O Henriques conversa no **Telegram**, em português e em linguagem simples. Trabalha para a pessoa, não para a Câmara, e apresenta-se sempre como assistente de inteligência artificial, como exige o Regulamento Europeu de IA (artigo 50.º).

Em cada mensagem, o Henriques escolhe um de quatro comportamentos:

| Comportamento | Quando | Exemplo |
|---|---|---|
| **Responder** | Há uma fonte oficial válida | Explica as regras de uma esplanada e cita o regulamento, o artigo e a data de consulta |
| **Abster-se** | Não há fonte que sustente a resposta | Diz que não sabe e não inventa taxas, custos nem prazos |
| **Encaminhar** | O assunto não é da competência municipal | Indica a entidade certa, como o Espaço Cidadão ou a empresa de águas |
| **Recusar** | O pedido exige juízo técnico, tenta manipular o sistema ou pede dados de terceiros | Encaminha a pessoa para um pedido de informação prévia, em vez de dizer se uma obra «vai ser aprovada» |

O Henriques mantém o contexto de uma conversa com várias mensagens e percebe quando a pessoa muda de assunto.

**Estado:** Construído.

### Base de conhecimento municipal

O Henriques responde a partir de **224 documentos públicos do Município**: páginas do portal, o diretório de serviços, formulários, regulamentos e informação de urbanismo. Usa também a Tabela de Taxas municipal de 2025 e um corpus de 98 procedimentos. Cada documento guarda o endereço de origem, a data de consulta e uma impressão digital criptográfica, o que permite provar que a fonte citada não foi alterada.

**Estado:** Construído. Conteúdo consultado a 19 e 20 de outubro de 2026.

### Registo Canónico de serviços

Para os serviços mais procurados, o Delegate mantém uma **ficha canónica**, curada a partir de fontes oficiais, com requisitos, documentos, regras e custos, sempre com fonte. O protótipo inclui 16 serviços:

- Comunicação prévia de esplanada
- Ocupação do espaço público com andaimes
- Publicidade e reclamos em fachada
- Licença especial de ruído
- Autorização de prolongamento de horário
- Lançamento de fogo de artifício
- Provas desportivas e caminhadas
- Recintos de festividades temporários
- Inspeção de ascensores
- Pedido de informação prévia de urbanismo
- Certidão de classificação de terrenos
- Consulta de processo e certidão
- Atribuição de número de porta
- Limpeza de terrenos e vegetação
- Cartão de residente para estacionamento
- Cartão Municipal Sénior

**Estado:** Construído.

### Mandato Digital

O mandato é a autorização que a pessoa dá ao Henriques. Define o que ele pode fazer, para que serviço e por quanto tempo. Pode ser revogado a qualquer momento, e nenhuma ação acontece sem ele.

| Nível | Nome | O que o Henriques pode fazer | Estado |
|---|---|---|---|
| **D0** | Informar | Responder com fonte, sem tocar em nenhum processo | Construído |
| **D1** | Vigiar | Consultar o estado de processos existentes | Construído |
| **D2** | Preparar | Preparar rascunhos de pedidos, sem os submeter | Construído |
| **D3** | Agir com confirmação | Submeter formalmente, depois de a pessoa confirmar | Construído (submissão em «Simulação») |
| **D4** | Agir dentro de regras | Agir sozinho, dentro de regras definidas pela pessoa | Planeado |

### Cofre Digital Pessoal

O Cofre guarda os dados, os documentos e as intenções da pessoa (por exemplo, abrir uma esplanada ou construir uma casa). O conteúdo é cifrado com AES-256-GCM, um padrão de cifra usado na banca e na administração pública.

Em cada pedido, o Cofre prepara o **pacote mínimo** de dados de que a Câmara precisa. A pessoa vê o que sai e o que não sai e aprova antes de seguir. O acesso a um item é temporário, limitado à missão em curso, e fica registado.

**Estado:** Construído.

### Missão

Cada pedido torna-se uma missão: uma ficha legível com objetivo, lista de passos, documentos, prazos e estado. A pessoa pode consultar na conversa as suas missões, os mandatos em vigor, o conteúdo do Cofre e a Carta de Lealdade do Henriques.

**Estado:** Construído.

## Para a Câmara

### Porta Agêntica Municipal

A Porta Agêntica é um **contrato aberto** que define como qualquer agente de inteligência artificial autorizado trata de serviços municipais. Usa o Model Context Protocol (MCP), um padrão aberto para ligar agentes de IA a serviços, e tem também uma interface REST equivalente.

O Henriques é o primeiro cliente da Porta, mas não o único possível: o atendedor virtual da Câmara ou agentes de terceiros podem usá-la, com as mesmas regras, o mesmo mandato e o mesmo registo de auditoria.

O protótipo disponibiliza oito operações:

| Operação | Tipo |
|---|---|
| Procurar serviços no catálogo | Consulta |
| Consultar a ficha de um serviço | Consulta |
| Criar um rascunho de ocupação do espaço público | Preparação |
| Criar um rascunho de pedido de informação prévia | Preparação |
| Submeter uma comunicação prévia | Ação |
| Consultar o estado de um processo | Consulta |
| Responder a um pedido de elementos | Ação |
| Obter uma referência de pagamento | Ação |

As operações de ação exigem mandato. Os sistemas internos da Câmara a que a Porta se liga no protótipo são simulados.

**Estado:** Construído. Sistemas da Câmara em «Simulação».

### Consola Municipal

Os técnicos recebem na Consola os casos já preparados, com as fontes, os dados verificados e os documentos. A partir daí, aprovam o pedido ou pedem elementos em falta, e o Henriques comunica o resultado à pessoa. A decisão é sempre do técnico.

**Estado:** Construído. Os processos tratados vêm do sistema de Serviços Urbanos simulado.

### Intenções do Concelho

É uma vista da Consola onde a Câmara vê o que a cidade quer fazer. As intenções guardadas nos Cofres juntam-se de forma anónima, e só com o consentimento explícito de cada pessoa. Aparecem organizadas por freguesia e por tema, com as motivações, os desejos para a cidade e o horizonte em que as pessoas pretendem avançar.

Quatro salvaguardas protegem a privacidade:

- grupos com menos de 10 pessoas não são publicados;
- os agregados levam ruído estatístico;
- nenhum dado individual sai do Cofre;
- os dados servem apenas a Câmara e não são vendidos.

**Estado:** Construído, com dados sintéticos assinalados como tal. A alimentação por Cofres reais está planeada para o piloto.

### Painel de observação em tempo real

Um painel mostra, enquanto a conversa decorre, cada passo do sistema: a conversa, a decisão do Henriques, o acesso ao Cofre e as chamadas à Porta. Serve para demonstrar e auditar o funcionamento à vista de todos.

**Estado:** Construído.

## Limites do protótipo

- O protótipo **não usa dados pessoais reais**. As personagens e os dados são de demonstração.
- São simulados, e assinalados como «Simulação»: a autenticação com Chave Móvel Digital, os sistemas internos da Câmara e o número de processo.
- O mandato D4 (agir sozinho dentro de regras) não está disponível.
- O protótipo corre num único computador para demonstração. Não é um serviço em produção.

## Planeado para o piloto e seguintes

- Canal **WhatsApp**, para além do Telegram.
- Autenticação real com **Chave Móvel Digital**.
- **Avisos proativos** a partir do Cofre, por exemplo quando muda uma regra que afeta uma intenção guardada.
- **Intenções do Concelho** alimentadas por Cofres reais, com consentimento.
- Atendimento através das **Juntas de Freguesia**, com mandato, para quem não usa canais digitais.
- Ligação à **carteira europeia de identidade digital** (EUDI Wallet), numa fase posterior.
