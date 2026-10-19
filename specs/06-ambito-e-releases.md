# 06 · Âmbito e releases

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)

## 1. Releases

| Release | Nome | Período | Objetivo | Dados | Integrações |
|---|---|---|---|---|---|
| **R0** | Protótipo do hackathon | 19–23/10/2026 | Ganhar o desafio 3.4 com algo real e mensurável | Só informação pública | Nenhuma real; submissão e recibos simulados |
| R1 | Piloto em Guimarães | 5 meses após contrato | Validar a hipótese central com 100–300 munícipes | Conteúdo validado pela Câmara | Leitura de 1 sistema por domínio; CMD |
| R2 | Escala municipal | Ano 2 | 10+ capacidades, primeira transação formal | Idem | Transação com recibo oficial |
| R3 | Rede e agentes certificados | Anos 2–3 | CIM do Ave; agentes de terceiros | Idem | Conectores reutilizados |
| R4 | Federação | Depois | Outras regiões e entidades nacionais | Idem | iAP, EUDI Wallet |

## 2. Âmbito do protótipo R0

### 2.1 Objetivo

Demonstrar, com fontes públicas reais e um sistema a funcionar:

1. o «bom resultado» do desafio: pergunta real → resposta correta, simples, com fonte à vista;
2. o que nos distingue: missão, mandato, cofre, Porta Agêntica e avaliação medida.

### 2.2 MoSCoW

| Prioridade | Funcionalidade | Requisitos |
|---|---|---|
| **M** | Chat web estilo WhatsApp com o Afonso, em PT-PT | RF-CON-01..03 |
| **M** | Registo Canónico com **10 a 15 serviços** reais curados de fontes públicas, com URL, data de consulta e versão | RF-REG-01..04 |
| **M** | Respostas com fonte e data visíveis; abstenção quando não há fonte; encaminhamento fora de competência | RF-RES-01..06 |
| **M** | Identificação do procedimento certo | RF-RES-02 |
| **M** | Conjunto de avaliação (≥ 40 perguntas) e painel com resultados | RF-AVA-01..04 |
| **M** | Jornada J1 completa: missão, Cofre, Mandato D3, rascunho, recibo simulado | RF-MIS, RF-COF, RF-MAN |
| **S** | Porta Agêntica em MCP (leitura do catálogo e consulta de serviço) usada por um agente externo | RF-POR-01..03 |
| **S** | Alerta proativo do PDM (J2) | RF-PRO-01..02 |
| **S** | Consola Municipal com um caso preparado (J8) | RF-CNS-01..03 |
| **S** | Trilho de auditoria visível («Quem viu os meus dados») | RF-AUD-01..02 |
| **C** | Mapa de Intenções com dados sintéticos marcados | RF-MAP-01 |
| **C** | Canal WhatsApp real via sandbox | RF-CON-04 |
| **C** | Entrada por voz (áudio transcrito) | RF-CON-05 |
| **W** | Autenticação real com Chave Móvel Digital | — |
| **W** | Integração com Urbanismo Digital ou Serviços Online | — |
| **W** | Pagamentos | — |
| **W** | Agentes terceiros certificados em produção | — |

<a id="criterios-de-saida"></a>
### 2.3 Critérios de saída de R0 (definição de pronto do produto)

- [ ] Uma pessoa de fora da equipa faz 5 perguntas reais e recebe respostas corretas com fonte à vista.
- [ ] Painel de avaliação mostra os resultados sobre ≥ 40 perguntas, com as metas de [18](18-metricas-e-okr.md) atingidas ou explicadas.
- [ ] J1 corre de ponta a ponta sem intervenção da equipa.
- [ ] Tudo o que é simulado está marcado como «Simulação» no ecrã.
- [ ] Repositório público com README, licença EUPL e créditos de ferramentas e IA.
- [ ] Vídeo de demonstração gravado como plano B.
- [ ] Submissão feita na TAIKAI antes das 15h00 de 23/10.

## 3. Âmbito do piloto R1

| Inclui | Não inclui |
|---|---|
| 2 capacidades: comunicação prévia de esplanada e alertas do PDM (leitura) | Decisão automática de qualquer ato |
| Consola usada por técnicos reais | Acesso a dados da AT, Segurança Social ou Saúde |
| 100 a 300 munícipes reais, recrutados com consentimento | Pagamentos dentro do chat |
| Autenticação com CMD no canal oficial | Substituição de sistemas municipais |
| Conteúdo canónico validado pelos donos dos serviços | Memória invisível ou perfis |
| Linha de base e relatório de impacto | — |

## 4. Fora de âmbito (todas as releases)

- Decisões automatizadas com efeito jurídico (deferir, indeferir, sancionar, priorizar direitos).
- Pareceres de viabilidade urbanística.
- Venda de dados, agregados ou não.
- Recomendações pagas de profissionais ou produtos.
- Base de dados central de perfis de pessoas.

## 5. Dependências

| Dependência | Release | Dono |
|---|---|---|
| Fontes públicas acessíveis (Diretório, Formulários, Regulamentos) | R0 | Equipa |
| Fornecedor de modelo de IA (identificado na submissão) | R0 | Equipa |
| Contrato com a Câmara | R1 | Negócio |
| Donos funcionais por serviço e validação de conteúdo | R1 | Câmara |
| Acesso de leitura a um sistema por domínio | R1 | Câmara / fornecedores |
| Integração CMD | R1 | Câmara / AMA |
| Parecer jurídico sobre cobrança a terceiros | R3 | Negócio |
