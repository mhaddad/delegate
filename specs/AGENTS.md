# AGENTS.md — Especificações

Regras de edição e governação da documentação em `specs/`. Parte de [`../AGENTS.md`](../AGENTS.md).

---

## 1. Fonte de verdade

As especificações definem o produto, os requisitos, o modelo de dados e a arquitetura conceptual:
- `specs/00`–`specs/23`: fundação do projeto, personas, jornadas, arquitetura e segurança.
- `specs/24`: processos canónicos municipais e inversão da responsabilidade de integração ([ADR-020](21-registo-de-decisoes.md#adr-020)).
- `specs/25`: base de conhecimento municipal RAG D0 e salvaguardas ([ADR-021](21-registo-de-decisoes.md#adr-021)).
- `specs/26`: modelo de impacto e poupança de custos/tempo para a autarquia ([ADR-022](21-registo-de-decisoes.md#adr-022)).
- `specs/strategy/`: planeamento operacional do protótipo R0, com precedência definida por [strategy/11](strategy/11-ajustes-pos-mentoria.md).

---

## 2. Regras de redação

1. **Português de Portugal (pt-PT) estrito:** ortografia e vocabulário sem desvios («contacto», «ação», «concelho», «autarquia», «regulamento»).
2. **Evidência e citações reais:** qualquer número, taxa ou prazo legal tem de ter fonte identificada (artigo de regulamento, RTTL 2025, portal da Câmara de Guimarães). Sem fonte, declara-se `null` ou abstenção formal.
3. **Decisões arquiteturais:** qualquer mudança de rumo exige registo em [specs/21-registo-de-decisoes.md](21-registo-de-decisoes.md) com novo ADR.
4. **Honestidade de simulação:** tudo o que no protótipo for simulado (sistemas legados dos Serviços Urbanos, Chave Móvel Digital, referências de pagamento) é explicitamente documentado com etiqueta de simulação.
