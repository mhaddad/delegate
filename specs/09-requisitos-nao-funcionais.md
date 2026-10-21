# 09 · Requisitos não funcionais

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Coluna R0: meta para o protótipo. Coluna R1: meta para o piloto.

## Qualidade das respostas

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-QUA-01 | Procedimento corretamente identificado no conjunto de avaliação | ≥ 85% | ≥ 92% |
| RNF-QUA-02 | Respostas factuais com fonte válida | 100% | 100% |
| RNF-QUA-03 | Valores (taxas, prazos, medidas) sem fonte | 0 | 0 |
| RNF-QUA-04 | Abstenção ou encaminhamento correto em perguntas fora de âmbito ou sem fonte | ≥ 90% | ≥ 95% |
| RNF-QUA-05 | Ataques de injeção de instruções bloqueados | 100% | 100% |

## Desempenho

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-DES-01 | Tempo até à primeira palavra da resposta (p95) | ≤ 3 s | ≤ 2 s |
| RNF-DES-02 | Tempo de resposta completa (p95) | ≤ 8 s | ≤ 6 s |
| RNF-DES-03 | Utilizadores simultâneos | 20 (demo) | 200 |

## Disponibilidade e operação

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-OPE-01 | Disponibilidade | Durante a submissão e o pitch | 99,5% mensal |
| RNF-OPE-02 | Plano B da demo | Vídeo gravado + versão local | — |
| RNF-OPE-03 | Observabilidade | Registos de erros e latência | Painel de operação e alertas |
| RNF-OPE-04 | Custos de IA monitorizados | Teto diário configurado | Teto por município |

## Privacidade

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-PRI-01 | Sem dados pessoais reais no protótipo | Obrigatório | — |
| RNF-PRI-02 | Minimização: só o pacote mínimo sai do Cofre | Demonstrado | Obrigatório |
| RNF-PRI-03 | Registos de aplicação sem dados pessoais | Obrigatório | Obrigatório |
| RNF-PRI-04 | Dados alojados na União Europeia | Recomendado | Obrigatório |
| RNF-PRI-05 | Conservação definida por item do Cofre | Demonstrado | Obrigatório |
| RNF-PRI-06 | Fornecedor de IA sem uso dos dados para treino | Verificar termos | Contratual |

## Segurança

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-SEG-01 | HTTPS em todos os pontos de acesso | Obrigatório | Obrigatório |
| RNF-SEG-02 | Segredos fora do repositório | Obrigatório | Cofre de segredos |
| RNF-SEG-03 | Ferramentas dos agentes tipadas e validadas pelo motor de política | Obrigatório | Obrigatório |
| RNF-SEG-04 | Conteúdo recuperado tratado como dados, nunca como instruções | Obrigatório | Obrigatório + testes |
| RNF-SEG-05 | Tokens curtos por capacidade | — | Obrigatório |
| RNF-SEG-06 | Trilho de auditoria imutável (só acrescenta) | Demonstrado | Obrigatório |
| RNF-SEG-07 | Teste de intrusão independente | — | Antes de dados reais |

## Acessibilidade e inclusão

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-ACE-01 | WCAG 2.2 nível AA na interface web | Boas práticas | Auditado |
| RNF-ACE-02 | Linguagem simples nas respostas | Obrigatório | Testado com utilizadores |
| RNF-ACE-03 | Navegação por teclado e leitor de ecrã | Boas práticas | Obrigatório |
| RNF-ACE-04 | Funciona em telemóvel (largura 360 px) | Obrigatório | Obrigatório |
| RNF-ACE-05 | Rota humana sempre disponível | Indicada | Operacional |

## Transparência e conformidade

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-TRA-01 | O Henriques identifica-se como IA | Obrigatório | Obrigatório |
| RNF-TRA-02 | O que é simulado aparece marcado «Simulação» | Obrigatório | — |
| RNF-TRA-03 | Ferramentas, modelos e bibliotecas de terceiros identificados | Obrigatório (regra do hackathon) | Obrigatório |
| RNF-TRA-04 | Resultados da avaliação publicados | No painel | Relatório periódico |

## Manutenção e portabilidade

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-MAN-01 | Código aberto com licença EUPL | Obrigatório | Obrigatório |
| RNF-MAN-02 | Registo Canónico em ficheiros versionados no repositório | Obrigatório | Base de dados com histórico |
| RNF-MAN-03 | Fornecedor de modelo de IA substituível por configuração | Recomendado | Obrigatório |
| RNF-MAN-04 | Testes automáticos sobre o motor de política e o conjunto de avaliação | Mínimos | Integração contínua |

## Localização

| ID | Requisito | R0 | R1 |
|---|---|---|---|
| RNF-LOC-01 | Interface e respostas em português de Portugal | Obrigatório | Obrigatório |
| RNF-LOC-02 | Datas no formato dd/mm/aaaa, moeda em euros com vírgula decimal | Obrigatório | Obrigatório |
| RNF-LOC-03 | Inglês para residentes estrangeiros | — | Desejável |
