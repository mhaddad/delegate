# 14 · Governação, privacidade e segurança

> Estado: versão de trabalho · Atualizado: 18/10/2026 · [Índice](README.md)
> Esta é uma visão de produto e não um parecer jurídico. Antes de R1, validar com o serviço jurídico, o encarregado de proteção de dados e os donos dos serviços da Câmara.

## 1. Quadro legal relevante

| Instrumento | O que exige | Decisão de desenho |
|---|---|---|
| Código do Procedimento Administrativo | Meios eletrónicos com disponibilidade, integridade, autenticidade, confidencialidade e conservação; direito à informação sobre o andamento | O chat não é o arquivo nem substitui o recibo; atos e prova vivem no sistema competente |
| RGPD e Lei n.º 58/2019 | Licitude, minimização, limitação da finalidade, direitos dos titulares | Pacote mínimo por missão; Cofre com controlo da pessoa; sem «aceito tudo» |
| RGPD, art. 22.º | Sem decisões exclusivamente automatizadas com efeitos significativos | Decisão sempre humana; o Henriques explica e prepara |
| RGPD, art. 28.º | Contrato com subcontratante | O Delegate é subcontratante da Câmara na Porta e na Consola |
| Regulamento Europeu de IA, art. 50.º | Informar que se interage com IA | O Henriques identifica-se sempre como IA |
| eIDAS 2 | Carteira europeia de identidade digital | Ligação à EUDI Wallet em R3+ |
| Licenciamento Zero e regulamentos municipais | Regras dos procedimentos | Fonte canónica de cada resposta |

## 2. Papéis no tratamento de dados

| Tratamento | Responsável | Subcontratante | Base legal provável | Estado |
|---|---|---|---|---|
| Porta, Consola e auditoria | Câmara | Delegate | Exercício de funções de interesse público / obrigação legal | 🧪 a validar |
| Cofre Digital Pessoal (chaves da pessoa) | A definir | A definir | Consentimento | 🧪 análise própria ([ADR-004](21-registo-de-decisoes.md#adr-004)) |
| Mapa de Intenções | Câmara | Delegate | Consentimento explícito para agregação | 🧪 a validar |
| Fornecedor de modelo de IA | — | Subcontratante ulterior | Contrato com cláusulas de não treino | A verificar |

## 3. Dados por release

| Release | Dados pessoais | Regras |
|---|---|---|
| R0 | **Nenhum dado real.** Personagens e dados de demonstração | Proibido introduzir dados reais no protótipo; aviso no ecrã |
| R1 | Munícipes do piloto, com consentimento informado | AIPD antes do arranque; alojamento na UE; retenção definida |
| R2+ | Escala municipal | AIPD revista; auditoria de segurança anual |

## 4. Avaliação de impacto (AIPD) — esboço

| Risco para as pessoas | Probabilidade | Gravidade | Medida |
|---|---|---|---|
| Resposta errada leva a ato errado | Média | Média | Fonte obrigatória, abstenção, decisão humana, avaliação contínua |
| Acesso indevido ao Cofre | Baixa | Alta | Cifra com chave da pessoa; operador sem acesso |
| Partilha excessiva com a Câmara | Média | Média | Pacote mínimo visível e aprovado pela pessoa |
| Reidentificação no Mapa de Intenções | Baixa | Alta | Consentimento, grupos ≥ 10, ruído estatístico |
| Exclusão de quem não usa digital | Média | Média | Canais humanos, Juntas com mandato |
| Uso dos dados pelo fornecedor de IA | Baixa | Alta | Cláusulas contratuais, alojamento UE |
| Mandato usado fora do âmbito | Baixa | Alta | Motor de política, auditoria, revogação imediata |

## 5. Controlos de segurança

| Controlo | R0 | R1 |
|---|---|---|
| Segredos fora do repositório | ✔ | Cofre de segredos |
| HTTPS | ✔ | ✔ |
| Ferramentas tipadas via motor de política | ✔ | ✔ |
| Isolamento de conteúdo recuperado | ✔ | ✔ + testes de regressão |
| Auditoria só de acréscimo com encadeamento por hash | ✔ (demo) | ✔ |
| Funções separadas e menor privilégio | — | ✔ |
| Tokens curtos por capacidade | — | ✔ |
| Ambientes segregados (demo, piloto) | — | ✔ |
| Teste de intrusão | — | Antes de dados reais |
| Plano de resposta a incidentes | — | ✔ |

## 6. Autonomia responsável

| Ação | Pode? | Condição | Nível |
|---|---|---|---|
| Explicar um serviço | Sim | Fonte atual e versão | D0 |
| Enviar alerta | Sim | Opt-in por tema | D1 |
| Consultar estado de processo | Sim, limitado | Autenticação e âmbito válidos | D1 |
| Criar checklist ou rascunho | Sim | Sem transformar rascunho em ato | D2 |
| Gerar referência de pagamento | Sim | Valor confirmado pelo sistema de origem | D2 |
| Submeter, assinar ou alterar dados | Só no fluxo formal | CMD, assinatura e validações | D3 |
| Efetuar pagamento | Não no chat | Ambiente seguro do prestador | — |
| Deferir, indeferir, priorizar, avaliar exceções | Não | Decisão humana por titular competente | — |

## 7. Inclusão

- O WhatsApp nunca é a única via: balcão, telefone, portal e Juntas asseguram continuidade.
- Representantes humanos (familiares, Juntas) agem com o mesmo mandato e auditoria.
- Linguagem simples testada com pessoas de baixa literacia no piloto.
- Métrica de equidade entre canais e perfis ([18](18-metricas-e-okr.md)).

## 8. Governação do conteúdo

| Papel | Responsabilidade |
|---|---|
| Dono funcional do serviço (Câmara) | Valida o registo e cada nova versão |
| Curador (Delegate) | Recolhe fontes, estrutura, propõe versões |
| Avaliação | Corre o conjunto a cada nova versão |
| Encarregado de proteção de dados | Aprova finalidades e conservação |

Regra: uma jornada só entra em produção experimental com dono nomeado, fonte canónica versionada, mapa das decisões humanas, avaliação de dados e risco, rota alternativa, plano de incidente, métricas de qualidade e formação de técnicos. «O modelo responde bem» não chega.
