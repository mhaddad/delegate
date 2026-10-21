# 20 · Riscos e pressupostos

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Probabilidade (P) e impacto (I): 1 baixo · 2 médio · 3 alto. Exposição = P × I.

## 1. Registo de riscos

### Hackathon (R0)

| ID | Risco | P | I | Exp. | Mitigação | Dono |
|---|---|---:|---:|---:|---|---|
| R-01 | Vídeos, deck e blueprint feitos antes do evento serem considerados «projeto já começado» | 2 | 3 | 6 | Código e dados só a partir de 19/10; perguntar à organização no arranque; declarar a origem; se necessário, refazer o pitch durante a semana | Produto |
| R-02 | O júri ver «mais um chatbot» e o desafio 3.4 ter muitas equipas com o caminho óbvio | 3 | 3 | 9 | Mostrar em segundos o que só nós temos: fonte e versão, missão com mandato, Porta usada por agente externo, avaliação medida | Produto |
| R-03 | Respostas erradas durante a demo ao vivo | 2 | 3 | 6 | Avaliação, verificador, perguntas da demo testadas; vídeo de plano B | IA/backend |
| R-04 | Curadoria do registo mais lenta do que o previsto | 3 | 2 | 6 | Começar pelos 5 serviços M; esquema simples; cortar para 10 serviços | Conteúdo |
| R-05 | Fontes oficiais incompletas ou contraditórias (ex.: canal da esplanada) | 2 | 2 | 4 | Registar a dúvida, marcar «a confirmar», perguntar ao mentor; o Henriques abstém-se | Conteúdo |
| R-06 | Falha de rede ou do fornecedor de IA no pitch | 2 | 3 | 6 | Versão local, vídeo gravado, respostas da demo em cache como último recurso, declarado | Porta/infra |
| R-07 | Âmbito demasiado grande para 5 dias | 3 | 2 | 6 | MoSCoW, congelamento a 22/10, ordem de corte | Produto |
| R-08 | Melindrar a Câmara ao comparar com o atendedor existente | 2 | 2 | 4 | Posicionar como complemento e consumidor da Porta ([ADR-011](21-registo-de-decisoes.md#adr-011)) | Produto |
| R-09 | Custos de IA acima do previsto | 1 | 1 | 1 | Teto diário; modelos menores para classificação | Porta/infra |
| R-10 | Equipa incompleta ou indisponível | 2 | 2 | 4 | Papéis acumuláveis; documentação clara | Produto |
| R-11 | Material dos vídeos sem direitos (voz, música) | 1 | 2 | 2 | Confirmar licenças; créditos na submissão | Produto |

### Piloto e negócio (R1+)

| ID | Risco | P | I | Exp. | Mitigação |
|---|---|---:|---:|---:|---|
| R-20 | Contratação pública lenta | 3 | 2 | 6 | Ajuste direto ou parceria para a inovação; acordo-quadro CIM |
| R-21 | Câmara prefere estender o fornecedor atual | 2 | 3 | 6 | Porta aberta que o fornecedor atual também usa; diferenciação por avaliação |
| R-22 | Ilegalidade de cobrar a agentes terceiros | 2 | 2 | 4 | Parecer jurídico; acesso básico gratuito |
| R-23 | AMA lança solução nacional | 2 | 2 | 4 | Protocolo aberto; posicionar como implementador municipal |
| R-24 | Resistência dos técnicos | 2 | 2 | 4 | Consola que poupa trabalho; decisão humana; métricas que não premeiam cortes |
| R-25 | Sem interfaces de leitura nos sistemas municipais | 2 | 2 | 4 | R1 funciona com conteúdo e Consola; integração quando houver |
| R-26 | Incidente de dados no piloto | 1 | 3 | 3 | AIPD, cifra, minimização, teste de intrusão, plano de incidente |
| R-27 | Dependência da Meta (WhatsApp) | 2 | 2 | 4 | WhatsApp como campainha; omnicanal |

## 2. Pressupostos a validar

| ID | Pressuposto | Como validar | Quando | Estado |
|---|---|---|---|---|
| PR-01 | Os critérios e prazos da TAIKAI são os extraídos a 18/10 | Arranque | 19/10 | ⚠️ |
| PR-02 | A esplanada aberta e contígua segue mera comunicação prévia (art. 8.º e Anexo I) | Fonte já verificada; reconfirmar | 19/10 | ✅ |
| PR-03 | O canal formal da comunicação prévia de esplanada é conhecido | Mentor / ficha oficial | 19–20/10 | ⚠️ |
| PR-04 | O mentor fornece perguntas reais | Mentor | 19/10 | 🧪 |
| PR-05 | As páginas públicas podem ser usadas como fonte | Termos do portal | 19/10 | ⚠️ |
| PR-06 | Novo limite de ajuste direto de 75.000 € para serviços | Diário da República | Novembro | ⚠️ |
| PR-07 | A Câmara está disposta a pagar um piloto | Reunião | Novembro | 🧪 |
| PR-08 | Munícipes confiam num representante digital para agir (D3) | Piloto | R1 | 🧪 |

## 3. Dependências externas

| Dependência | Afeta | Contingência |
|---|---|---|
| Plataforma TAIKAI disponível a 23/10 | Submissão | Submeter às 15h00, não às 17h |
| Fornecedor de modelo de IA | Toda a demo | Segundo fornecedor configurado; vídeo |
| Portal municipal acessível | Curadoria | Guardar cópia local das páginas consultadas (com data e hash) |
| Alojamento | Demo | Versão local |
