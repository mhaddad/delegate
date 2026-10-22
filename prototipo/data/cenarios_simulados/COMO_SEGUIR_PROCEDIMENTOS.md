# Procedimentos e Serviços Simulados Oficiais — Guimarães 2035

Este documento define os **3 Serviços Oficiais Simulados** de ponta a ponta que constituem a demonstração do **Delegate (Hack4Guimarães 2035)**:

1. **Serviço 1 — Ocupação do Espaço Público: Esplanada Aberta (OVP-SO)**
2. **Serviço 2 — Gestão Urbanística: Pedido de Informação Prévia / PDM (RJUE Art. 14.º)**
3. **Serviço 3 — Via Pública: Autorização para Prova Desportiva / Evento (Regulamento de Eventos)**

Cada serviço inclui uma pasta com os documentos modelo, minutas oficiais e o guião passo a passo de interação conversacional.

---

## Estrutura da Pasta `prototipo/data/cenarios_simulados/`

```
prototipo/data/cenarios_simulados/
├── 01_esplanada/
│   ├── minuta_modelo_ovp_so.md       # Minuta Oficial do Requerimento
│   └── comprovativo_declaracao.json  # Dados estruturados do pacote mínimo PAC-0001
├── 02_urbanismo_pdm/
│   ├── minuta_modelo_pip_rjue.md     # Minuta de Pedido de Informação Prévia
│   └── caderneta_predial_exemplo.txt # Exemplo de caderneta predial auditada
└── 03_prova_desportiva/
    ├── minuta_autorizacao_evento.md  # Minuta de Autorização de Ocupação de Via Pública
    └── termo_responsabilidade.md     # Termo e apólice de seguro obrigatória
```

---

## ☕ SERVIÇO 1 — Licenciamento de Esplanada Aberta (Modelo OVP-SO)

* **Enquadramento Legal:** Artigo 8.º e Anexo I do Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães.
* **Canal:** Telegram (`@afonso_cm_bot`) ou Web Console.
* **Mandato Inicial:** D2 (Instrução sem submissão).
* **Mandato Final:** D3 (Submissão formal com Chave Móvel Digital).

### Guião Passo-a-Passo no Telegram:

1. **Início:**
   - Cidadão envia: `Quero preparar a esplanada` *(ou clica no botão do menu `/start`)*.
   - **Henriques responde:** Explica que ativou o Mandato D2 e pergunta o nome e morada do estabelecimento em Guimarães.

2. **Passo 1 (Localização & Validação de Freguesia):**
   - *Teste de Sanidade:* Se o utilizador escrever `Rua de Santa Catarina, Porto`, o Henriques recusa educadamente indicando que a localidade pertence a outro concelho.
   - *Sucesso:* O utilizador escreve `Casa Joaquim, Largo da Oliveira 12` *(ou clica no botão rápido)*.
   - O Henriques valida contra as 48 freguesias oficiais e guarda o item no Cofre Digital.

3. **Passo 2 (Dimensões & Mesas):**
   - O Henriques pergunta quantas mesas e cadeiras planeia colocar.
   - O utilizador escreve `4 mesas` *(ou clica em `[4 Mesas (~10m²)]`)*.
   - O Henriques calcula a área e guarda as dimensões.

4. **Passo 3 (Verificação Regulamentar — Art. 8.º):**
   - O Henriques cita o requisito regulamentar: corredor pedonal livre de pelo menos 2,00 metros.
   - O utilizador clica em `[📐 Sim, confirmo: 2,10m livres]`.

5. **Apresentação da Minuta & Assinatura Digital (D3):**
   - O Henriques compõe e apresenta a **Minuta Oficial OVP-SO**.
   - Mostra que dados fiscais e bancários estão omitidos do pacote `PAC-0001`.
   - O utilizador clica em `[✍️ Assinar e Submeter com Chave Móvel Digital]`.
   - **Resultado:** O processo entra na fila dos Serviços Urbanos com código `OEP/2026/0001` (Simulação).

---

## 🏡 SERVIÇO 2 — Pedido de Informação Prévia (PIP) / Viabilidade PDM

* **Enquadramento Legal:** Artigo 14.º do RJUE (Dec.-Lei n.º 555/99) e Regulamento do PDM de Guimarães (Aviso n.º 23214/2020).
* **Canal:** Telegram (`@afonso_cm_bot`).
* **Objetivo:** Parecer prévio sobre viabilidade de construção de habitação unifamiliar em terreno.

### Guião Passo-a-Passo no Telegram:

1. **Início:**
   - Cidadão envia: `Quero saber se posso construir num terreno` *(ou clica em `[🏡 Iniciar: PDM Silvares]`)*.
   - **Henriques responde:** Explica os requisitos do Art. 14.º do RJUE (Localização e Caderneta Predial).

2. **Envio da Localização:**
   - Cidadão envia o link do Google Maps ou coordenadas: `https://maps.google.com/?q=41.4425,-8.2918 (Silvares)`.
   - O Henriques georreferencia no PDM: identifica **Solo Urbano — Espaço Residencial Nível 2** (Índice máx. 0.60, cércea 3 pisos, sem RAN nem REN).

3. **Envio do Documento (Caderneta Predial):**
   - Cidadão envia o ficheiro PDF da caderneta predial ou clica em `[📑 Simular Envio: Caderneta Predial]`.
   - O Henriques calcula o resumo criptográfico SHA-256 e cifra o documento com AES-256-GCM no Cofre Digital.

4. **Minuta & Submissão CMD:**
   - O Henriques monta o pacote `PAC-0002` com os dados urbanísticos mínimos.
   - Apresenta a minuta do pedido vinculativo.
   - Cidadão assina com a Chave Móvel Digital. Processo `PIP/2026/0002` criado na Divisão de Gestão Urbanística.

---

## 🏃 SERVIÇO 3 — Autorização para Prova Desportiva na Via Pública

* **Enquadramento Legal:** Regulamento Municipal de Ocupação da Via Pública para Eventos Desportivos e Culturais.
* **Canal:** Telegram (`@afonso_cm_bot`).
* **Objetivo:** Licenciamento e policiamento obrigatório para corrida/caminhada.

### Guião Passo-a-Passo no Telegram:

1. **Início:**
   - Cidadão envia: `Quero organizar uma prova de corrida, o que preciso?`
   - O Henriques responde curto e direto: indica a necessidade de plano de percurso, seguro e parecer policial, perguntando qual o percurso/zona.

2. **Definição da Freguesia e Data:**
   - Cidadão responde: `Uma prova de corrida na freguesia de Azurém para 15 de Outubro`.
   - O Henriques valida que Azurém pertence a Guimarães, anota a data e questiona sobre a apólice de seguro e o percurso.

3. **Minuta e Parecer das Forças de Segurança:**
   - O Henriques gera a minuta de requerimento de policiamento (PSP/GNR) e termo de responsabilidade.
   - Pede confirmação antes da submissão com Chave Móvel Digital.

---

## 🔍 As Duas Consolas Oficiais em Tempo Real

O sistema foca-se exclusivamente nas duas consolas padronizadas:

* **📱 1. Painel Integrado do Cidadão (Demonstrador Principal):**  
  👉 **`http://localhost:4000/painel`** (ou `http://localhost:4000/`)  
  *(Simulador do telemóvel Telegram do cidadão com o Henriques, árvore de decisão TypeSafe Jev, Cofre Digital pessoal, cliente MCP e terminal de auditoria SSE em tempo real).*

* **🏛️ 2. Consola Municipal da Câmara:**  
  👉 **`http://localhost:4000/consola`**  
  *(Consola do técnico municipal da autarquia: lista minimizada de pedidos, apreciação do processo OEP/2026/0001 da Esplanada, solicitar elementos/fachada, deferir ou indeferir).*

---

## 📂 Documentos Disponíveis para Simular a Esplanada (`01_esplanada/`)

Para simular o pedido da esplanada de forma realista no Telegram ou no Painel, estão disponíveis os seguintes ficheiros em `prototipo/data/cenarios_simulados/01_esplanada/`:

1. **`planta_cotada_esplanada_oliveira.md`** — *Planta de Implantação e Croquis Cotado*  
   Memória descritiva e desenho cotado: frente de fachada de 8m, ocupação de 5m x 2m (10 m²), 4 mesas e corredor pedonal livre de **2,10m** (cumpre o Artigo 8.º >= 2,00m).
2. **`certidao_comercial_casa_joaquim.md`** — *Certidão Comercial Permanente*  
   Comprova a titularidade do estabelecimento "Casa Joaquim, Lda" (CAE 56101 - Restauração) no Largo da Oliveira 12.
3. **`medicao_fachada_8m.md`** — *Declaração de Medição da Fachada (8 Metros)*  
   Documento para responder à solicitação da Consola Municipal quando o técnico pede elementos adicionais de fachada.
4. **`termo_conformidade_mobiliario.md`** — *Termo de Responsabilidade do Mobiliário*  
   Garante mobiliário 100% amovível, sem perfurações no granito histórico e em harmonia com o património UNESCO.
5. **`minuta_modelo_ovp_so.md`** — *Requerimento Oficial Modelo OVP-SO*  
   Minuta formal gerada pelo Henriques para submissão com Chave Móvel Digital.

### Como usar os documentos na conversa:
* **Pedir documento:** Escreva no chat `«Dá-me o documento da esplanada»` ou `«Envia a planta»` ou `«Quero a certidão»` — o Henriques envia o ficheiro diretamente na conversa com botões de instrução.
* **Enviar documento:** Anexe qualquer um destes ficheiros através do clipe 📎 do Telegram (ou clique em `[📑 Simular Envio: Planta no Pedido]`) — o Henriques calcula o hash SHA-256, arquiva no Cofre e integra no pedido oficial à Câmara.

