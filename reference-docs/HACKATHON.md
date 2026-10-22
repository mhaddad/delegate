# HACKATHON.md — Hack4Guimarães 2035: Manual Operacional e Catálogo de Serviços

Documento operacional e estratégico da equipa. O contrato técnico do software está em [AGENTS.md](../AGENTS.md).
Este documento mapeia o desafio, o catálogo oficial de serviços da Câmara Municipal de Guimarães, as fontes normativas e o plano de ataque para os 5 dias.

---

## 1. O Desafio Oficial

> **4. Falar com a Câmara sem burocracia**  
> **Área temática:** Tecnologias Inteligentes  
> **Mentoria:** Filipe Novais (DTx), CCG/ZGDV  
> 
> *Saber que licença é precisa, que documentos entregar ou em que ponto está um processo obriga muitas vezes a ir ao balcão. A informação existe, mas está dispersa e escrita em linguagem difícil.*  
> 
> *Como tornar os serviços municipais mais acessíveis e compreensíveis para quem cá vive?*  
> 
> *Por onde começar: Um assistente conversacional é o caminho óbvio, mas não é o único. Toda a informação de partida é pública, no portal do Município.*  
> 
> *Um bom resultado: Alguém faz uma pergunta real sobre um serviço municipal e obtém uma resposta correta, em linguagem simples, com a fonte à vista.*

---

## 2. Catálogo Oficial dos Serviços Municipais de Guimarães

Mapeamento exaustivo a partir do portal oficial de procedimentos administrativos ([cm-guimaraes.pt/pages/97](https://www.cm-guimaraes.pt/pages/97)), composto por **28 áreas temáticas** e **98 blocos de procedimentos** factuais.

| ID | Área / Serviço Municipal | N.º Blocos | URL Autoritativo | Procedimentos e Blocos de Exemplo | Enquadramento / RTTL 2025 |
|---|---|:---:|---|---|---|
| **#01** | **Geral** | 1 | [cm-guimaraes.pt?cat=1](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=1) | `shl27` (Pesquisa de respostas e navegação) | CPA (DL 4/2015) |
| **#03** | **Ambiente** | 6 | [cm-guimaraes.pt?cat=3](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=3) | `shl136` (Lixo não recolhido), `shl151` (Licença de ruído), `shl138` (Queimadas) | RTTL Cap. VII Art. 40 (Ruído) / Regulamento Resíduos |
| **#04** | **Trânsito, Transportes e Logística** | 10 | [cm-guimaraes.pt?cat=4](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=4) | `shl174` (Mudança de viatura táxi), `shl139` (Dístico centro histórico), `shl163` (Cartão residente) | RTTL Cap. VII Art. 40 / Regulamento Municipal de Trânsito |
| **#05** | **Eventos e Espetáculos** | 2 | [cm-guimaraes.pt?cat=5](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=5) | `shl101` (Licenças para festas/arraiais/recintos), `shl151` (Licença especial de ruído) | RTTL Cap. VI Art. 38 (Recintos) e Cap. VII Art. 40 (Ruído/Fogo) |
| **#06** | **Desporto e Lazer** | 3 | [cm-guimaraes.pt?cat=6](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=6) | `shl132` (Provas desportivas na via pública), `shl177` (Caminhadas / marchas) | RTTL Cap. VII Art. 40 (Licenciamento desportivo) |
| **#07** | **Pagamentos e Cobranças de Taxas** | 2 | [cm-guimaraes.pt?cat=7](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=7) | `shl40` (Levantamento de quantias), `shl2` (Meios de pagamento de taxas) | RTTL Regulamento Geral (Edital 161/2025) |
| **#08** | **Aprovisionamento e Compras** | 5 | [cm-guimaraes.pt?cat=8](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=8) | `shl44` (Ofício de adjudicação), `shl68` (Plataforma eletrónica de compras) | Código dos Contratos Públicos (CCP) |
| **#09** | **Educação** | 5 | [cm-guimaraes.pt?cat=9](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=9) | `shl43` (Atividades AAAF), `shl42` (AEC 1.º ciclo), `shl70` (Transportes escolares) | Regulamentos de Ação Social Escolar |
| **#10** | **Recursos Humanos** | 3 | [cm-guimaraes.pt?cat=10](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=10) | `shl3` (Candidatura a emprego público), `shl39` (Estágios municipais) | LTFP (Lei 35/2014) |
| **#13** | **Diversos** | 5 | [cm-guimaraes.pt?cat=13](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=13) | `shl67` (Casa Pronta / Direito de preferência), `shl38` (Venda de terrenos), `shl114` (Número de polícia) | RTTL Cap. I Art. 1 e Art. 5 (Toponímia/Numeração) |
| **#14** | **Certidões e Fotocópias** | 3 | [cm-guimaraes.pt?cat=14](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=14) | `shl5` (Certidão de obras particulares), `shl90` (Fotocópias simples/autenticadas A4) | RTTL Cap. I Art. 1 (Certidões: 15,87 €; A4: 0,06 €) |
| **#17** | **Elevadores e Monta-cargas** | 4 | [cm-guimaraes.pt?cat=17](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=17) | `shl6` (Periodicidade de inspeções), `shl37` (Pedido de reinspeção) | DL 320/2002 / RTTL Cap. I Art. 7 (Inspeção: 73,00 €) |
| **#20** | **Cemitérios** | 3 | [cm-guimaraes.pt?cat=20](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=20) | `shl11` (Compra de jazigos e covais), `shl34` (Averbamento de covais) | RTTL Cap. VIII Art. 59–61 (Taxas cemiteriais) |
| **#21** | **Arquivo Municipal** | 11 | [cm-guimaraes.pt?cat=21](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=21) | `shl58` (Acesso a processos de obras antigos), `shl75` (Reprodução de plantas históricas) | RTTL Cap. I Art. 1 e Art. 2 (Reproduções) |
| **#22** | **Biblioteca Municipal** | 6 | [cm-guimaraes.pt?cat=22](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=22) | `shl23` (Cartão de leitor), `shl28` (Empréstimo domiciliário de livros) | Regulamento da Biblioteca Raul Brandão (Gratuito) |
| **#23** | **Reclamações** | 1 | [cm-guimaraes.pt?cat=23](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=23) | `shl13` (Livro de reclamações físico/eletrónico) | DL 156/2005 / CPA |
| **#25** | **Polícia Municipal** | 1 | [cm-guimaraes.pt?cat=25](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=25) | `shl14` (Competências e fiscalização urbana) | Regulamento da Polícia Municipal |
| **#26** | **Cultura** | 3 | [cm-guimaraes.pt?cat=26](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=26) | `shl33` (Apoios a associações culturais), `shl15` (Registo no cadastro cultural) | Regulamento de Apoio às Atividades Culturais |
| **#29** | **Licenciamento Zero** | 4 | [cm-guimaraes.pt?cat=29](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=29) | `shl179` (Horários de funcionamento de cafés/bares), `shl55` (Mera comunicação prévia) | DL 48/2011 / RTTL (Mera comunicação: 17,00 €) |
| **#31** | **Caça** | 1 | [cm-guimaraes.pt?cat=31](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=31) | `shl166` (Carta de caçador e licença municipal de uso e porte) | Legislação Cinegética Nacional / RTTL |
| **#32** | **Acampamento Ocasional** | 1 | [cm-guimaraes.pt?cat=32](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=32) | `shl158` (Licença para acampamento / autocaravanas fora de parques) | DL 51/2015 / RTTL Cap. VII Art. 40 (17,00 €) |
| **#37** | **Georreferenciação (SIG)** | 1 | [cm-guimaraes.pt?cat=37](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=37) | `shl21` (Instruções SIG para plantas de localização e DWG/DGN) | RTTL Cap. I Art. 9 (Extração SIG: 5,00 €) |
| **#40** | **Mercados** | 2 | [cm-guimaraes.pt?cat=40](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=40) | `shl25` (Atribuição de bancas/lojas), `shl29` (Transmissão de concessão) | RTTL Cap. III Art. 25 (Taxas de terrado/banca) |
| **#46** | **Quiosques** | 1 | [cm-guimaraes.pt?cat=46](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=46) | `shl157` (Exploração e concessão de quiosques municipais devolutos) | RTTL Cap. III Art. 24 (Ocupação: 5,51 €/m²) |
| **#49** | **IFRRU 2020** | 3 | [cm-guimaraes.pt?cat=49](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=49) | `shl184` (Âmbito de financiamento), `shl185` (Candidatura à reabilitação) | Instrumento Financeiro para Reabilitação Urbana |
| **#51** | **Estado Conservação Imóveis (EBF)** | 2 | [cm-guimaraes.pt?cat=51](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=51) | `shl196` (Vistorias para benefícios de IMI/IMT em reabilitação urbana) | Estatuto dos Benefícios Fiscais Art. 45.º / RJUE |
| **#52** | **Programa Retomar** | 5 | [cm-guimaraes.pt?cat=52](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=52) | `shl199` (Apoio financeiro de emergência a empresas do concelho) | Regulamento Municipal Programa Retomar |
| **#57** | **Sedes de Associações Sem Fins Lucrativos** | 4 | [cm-guimaraes.pt?cat=57](https://www.cm-guimaraes.pt/pages/97?site_help_link_category_id=57) | `shl233` (Legalização e regularização urbanística de edifícios de associações) | Regulamento Extraordinário de Regularização Urbanística |

---

## 3. Fontes Oficiais e Referências Normativas Globais

Todo o dado manipulado pelo nosso motor tem de possuir âncora verificável numa das fontes oficiais abaixo:

1. **Tabela de Taxas e Outras Receitas Municipais (RTTL 2025):**
   * **Diploma:** Edital n.º 597/2025, publicado no *Diário da República*, 2.ª série, n.º 62, de 28 de março de 2025.
   * **Deliberações:** Aprovada em Reunião de Câmara Municipal de 10/02/2025 e Assembleia Municipal de 06/03/2025.
   * **Conteúdo:** 491 itens de taxa distribuídos por 18 capítulos e 69 artigos (`data/fees/rttl_2025.pdf`, `data/fees/rttl_2025.txt`, `data/fees/rttl_cache.json`).
2. **Regulamento Geral de Taxas do Município de Guimarães:**
   * **Diploma:** Edital n.º 161/2025, publicado no *Diário da República*, 2.ª série, n.º 20, de 29 de janeiro de 2025 (`data/fees/regulamento_2025.pdf`).
3. **Glossário Municipal de Termos Complexos da CMG:**
   * **URL:** [cm-guimaraes.pt/.../glossario-de-termos-complexos-ou-tecnicos](https://www.cm-guimaraes.pt/ficha-tecnica/declaracao-de-acessibilidade-e-usabilidade/glossario-de-termos-complexos-ou-tecnicos)
   * **Conteúdo:** ~130 termos técnicos (ex.: *Emolumentos*, *Alvará*, *CUP*, *RJUE*). Prova do problema: define palavras, mas contém **zero números**.
4. **Código do Procedimento Administrativo (CPA):**
   * **Diploma:** Decreto-Lei n.º 4/2015, de 7 de janeiro.
   * **Relevância:** Fixa os prazos supletivos de decisão (art. 128.º: 90 dias úteis para procedimentos de iniciativa particular; art. 86.º: 10 dias úteis para pedidos de certidão; prazos especiais para ruído e ocupação).
5. **Padrão Institucional Nacional de Interoperabilidade:**
   * **Referência:** iAP (Plataforma de Interoperabilidade da Administração Pública — [iap.gov.pt](https://iap.gov.pt/)) e Catálogo Nacional de Serviços Públicos.

---

## 4. Calendário e Aritmética do Hackathon

| Data | Fase | Descrição Operacional |
|---|---|---|
| **12–18 Out** | **Pré-semana** | Reconhecimento de dados, levantamento dos 28 serviços, criação do Gold Set (30 perguntas) e estruturação do contrato `AGENTS.md`. Zero commits. |
| **19 Out (seg)** | **Arranque** | Apresentação oficial dos desafios no CIAJG (09h30). Primeiro commit do repositório (`git init`). |
| **19–23 Out** | **Semana de Trabalho** | Desenvolvimento híbrido/presencial no CIAJG. Execução faseada (Fase 1 a 4). |
| **23 Out 17h30** | **Fecho de Submissão** | Encerramento rígido na plataforma Taikai. Submeter até às **15h00** (margem de segurança). |
| **26 Out 14h30** | **Pitches ao Júri** | Pitch presencial de **4 minutos + 1 minuto de perguntas** perante júri de especialistas (sem votação popular). Guião: [Anexo C](../specs/anexos/C-guiao-da-demonstracao.md). |
| **26–27 Out** | **Avaliação** | Deliberação técnica do júri. |
| **28 Out** | **Cerimónia de Prémios** | Anúncio dos vencedores (20.000 € em prémios globais). |

---

## 5. Critérios de Avaliação e Onde se Ganham os Pontos

| Critério | Peso | Como Garantimos a Pontuação Máxima |
|---|:---:|---|
| **Impacto e Relevância** | **30%** | Evitar deslocações inúteis ao balcão presencial. Relatório concreto: *"Dos 98 procedimentos municipais, 88 não indicavam preço na prosa; a nossa solução devolve o custo exato, poupando tempo ao munícipe e desafogando o atendimento presencial."* |
| **Viabilidade Técnica** | **25%** | Arquitetura testável em Python (`uv`, `pytest`, `pydantic`). Prova com runner parametrizado sobre o Gold Set: **Zero Alucinações**, 100% de citações literais da RTTL (Edital 597/2025) e 0 dependências frágeis. |
| **Inovação e Originalidade** | **25%** | **Compilar em vez de conversar.** Recusa de um chatbot genérico que alucina. Transformação da linguagem natural numa ontologia factual determinística com auditoria jurídica de cada número. |
| **Apresentação e Continuidade** | **20%** | Pitch ensaiado ao segundo, CLI robusto sem falhas de rede, e continuidade garantida pelo alinhamento com a taxonomia do Catálogo de Serviços da AP (iAP). |

---

## 6. A Regra de Ouro do Palco (Pitch de 3 Minutos)

O júri ouve dezenas de equipas. A nossa apresentação assenta em 4 regras:
1. **Sem Dependência de Rede:** Toda a base (corpus e tabela de taxas) corre de cache local. Zero risco de timeout do portal da Câmara.
2. **Sem Click-through:** Um comando no terminal ou um ecrã único: a entrada colloquial entra e a ficha completa de decisão cidadã aparece com os carimbos de evidência legal.
3. **O Momento de Honestidade:** Demonstrar que para uma pergunta sem cobertura legal o sistema recusa-se formalmente a inventar e explica porquê. Isso prova que a solução é séria e confiável.
4. **Alinhamento dos 3 Minutos:**
   * `[0:00 - 0:35]` **O Problema:** 90% das páginas de procedimentos não têm custo nem prazo. O glossário da Câmara tem 130 termos, mas zero euros.
   * `[0:35 - 1:15]` **A Solução:** Não um chatbot — uma camada de compilação semântica que liga a vida real aos 491 artigos da RTTL oficial.
   * `[1:15 - 2:05]` **Demo ao Vivo:** `"vou fazer uma festa na rua"` $\rightarrow$ Atos decompostos, 11,35 € de ruído com citação do Art. 40.º, Edital 597/2025.
   * `[2:05 - 2:30]` **Disciplina:** Mostrar teste do Gold Set: 0 alucinações.
   * `[2:30 - 3:00]` **Impacto e Futuro:** Escalabilidade para os restantes municípios via iAP.

---

## 7. Gestão de Riscos

| Risco | Sinal de Alerta | Mitigação Operacional |
|---|---|---|
| **Linguagem livre não coincide com os atos** | Baixo acerto no Gold Set | Camada do Semantic Router com JSON Schema estrito (código removido; algoritmo descrito no plano do protótipo). |
| **Tabela de Taxas com taxas compostas** | Escalões de m² ou dias | Modelo `TaxItem` com suporte a variáveis de entrada e limites de escalão. |
| **Falha técnica em direto no pitch** | Terminal encrava | Vídeo de fallback gravado localmente no D4. |
| **Questionamento sobre originalidade** | Pergunta do júri no palco | O planeamento e o corpus público foram recolhidos na pré-semana; o código Python foi criado e commitado durante os 5 dias. |