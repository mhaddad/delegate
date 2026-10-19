# 06 · Consola Municipal e Mapa de Intenções

> Estado: proposta para discussão · Atualizado: 18/10/2026 · [Estratégia](README.md)

## 1. Propósito

Mostrar o lado da Câmara: **casos preparados, decisão humana, ciclo fechado com o munícipe** e uma visão da cidade que hoje não existe.

**Limite de privacidade, a dizer no pitch:** a Consola vê casos, pacotes mínimos e estados. **Nunca navega no Cofre** nem nos projetos pessoais da pessoa.

## 2. Ecrãs

| Ecrã | Prioridade | Conteúdo |
|---|---|---|
| **Fila de casos** | M | Casos em `submetido`, `em_apreciacao`, `pedido_elementos`; prazo; risco; serviço |
| **Detalhe do caso** | M | Motivo, resumo, fontes usadas (com versão), pacote mínimo, proposta de ação, risco, prazo, histórico |
| **Decisão** | M | Aceitar · Pedir elemento · Rejeitar com fundamento · Atribuir · Escalar |
| **Acompanhamento** | S | Todos os processos e missões com estado e tempo em cada estado, sem dados pessoais |
| **Procura e fricção** | S | Perguntas por tema, abstenções (lacunas de conteúdo), pedidos completos à primeira |
| **Mapa de Intenções** | S | Intenções agregadas por freguesia e tema |
| **Registo Canónico** | C | Fichas por serviço; botão «Marcar como validado» (simulado) |
| **Simular evento** | C | Dispara o evento da Assembleia Municipal para o alerta do PDM |

## 3. O ciclo que tem de funcionar ao vivo

```text
Inês submete (Telegram + Mini App)
  → Serviços Urbanos (simulado) cria OEP/2026/0001 → caso aparece na fila da Consola
Técnica abre o caso → vê proposta: «Falta a largura da fachada para confirmar o corredor de 2,00 m»
Técnica clica «Pedir elemento» → Serviços Urbanos muda para pedido_elementos
  → Afonso, no Telegram: «A Câmara pede a largura da fachada do restaurante.»
Inês responde «8 metros» → Afonso junta o elemento pela Porta → caso volta à fila
Técnica clica «Aceitar» → Serviços Urbanos calcula taxa (fictícia) → Tesouraria emite referência
  → Afonso, no Telegram: «Aceite. Pode pagar com esta referência (Simulação).»
```

Cada passo emite eventos e aparece no Observatório. Este ciclo é o momento mais forte para mostrar a decisão humana.

## 4. Detalhe do caso

| Campo | Origem |
|---|---|
| Motivo do encaminhamento | Orquestrador (submissão, pedido humano, risco) |
| Resumo | Gerado pelo Afonso a partir do pacote mínimo, marcado «resumo gerado por IA» |
| Fontes | Ids e versões do Registo Canónico usados na missão |
| Pacote mínimo | Exatamente o que a Inês aprovou na Mini App |
| Proposta de ação | Regras do sistema simulado + sugestão do Afonso, marcada «sugestão» |
| Risco e prazo | Do registo do serviço |
| Histórico | Eventos da missão e do processo |

A técnica pode ignorar a proposta. A decisão é registada com identidade funcional («Técnica · Serviços Urbanos»), momento e fundamento.

## 5. Painel «Procura e fricção»

| Indicador | Cálculo (ao vivo, na demo) |
|---|---|
| Perguntas por tema | Contagem de `afonso.intencao.classificada` por serviço |
| Abstenções | Contagem de `afonso.resposta.abstencao`, com o motivo |
| Lacunas de conteúdo | Abstenções agrupadas → «tarefas de curadoria» sugeridas |
| Encaminhamentos | Contagem por entidade (Espaço Cidadão, Vimágua…) |
| Pedidos completos à primeira | Processos sem `pedido_elementos` ÷ processos submetidos |

Mensagem para o júri: **cada pergunta sem resposta transforma-se numa tarefa para melhorar a informação da Câmara.**

## 6. Mapa de Intenções

| Aspeto | Decisão |
|---|---|
| Dados de base | Sintéticos, por freguesia e tema, com a etiqueta «Dados sintéticos» |
| Ao vivo | Quando a Inês consente guardar a intenção da esplanada, o contador da sua freguesia sobe +1 (`intencoes.agregado.atualizado`) |
| Privacidade | Só intenções com consentimento; grupos com menos de 10 não aparecem; nota no ecrã |
| Visualização | **Barras por freguesia e tema** (M dentro do ecrã); mapa com limites de freguesias só se houver tempo (C) |
| Temas | Esplanadas, obras, construção, eventos, painéis solares |

Mensagem para o júri: **a Câmara passa a saber o que a cidade quer fazer antes de lhe pedirem.**

## 7. Acesso na demo

Página da Consola aberta num segundo separador ou num tablet. Utilizador de demonstração «Técnica · Serviços Urbanos», sem palavra-passe real. Etiqueta «Ambiente de demonstração».
