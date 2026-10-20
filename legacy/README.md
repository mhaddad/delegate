# Legado — Delegate

Ficheiros, código e dados de fases e explorações anteriores que já não fazem parte do âmbito ativo do protótipo R0 (pós-mentoria).

Mantidos no repositório apenas para memória futura e consulta histórica.

---

## Estrutura

- `ouvir.ts`: script exploratório inicial de escuta de eventos via Postgres `LISTEN/NOTIFY`. Substituído pelo fluxo SSE integrado no núcleo (`apps/api/src/nucleo/eventos/servidor.ts`).
- `data/raw/`: ficheiros brutos recolhidos no início do projeto (ex.: `glossario.html`). A base canónica atual assenta em `prototipo/registo/` e a base de conhecimento RAG em `prototipo/data/conhecimento/`.
- `videos/delegate-pitch/`: versão preliminar do pitch de vídeo baseada no motor HyperFrames. O pitch oficial ativo vive em `videos/delegate-pitch-v2/` e a série em `videos/delegate-serie/`.
