# Delegate — vídeo de visão geral (3:28)

Vídeo para a submissão na TAIKAI. O roteiro e o storyboard estão em [ROTEIRO.md](ROTEIRO.md).

- **Vídeo final:** `renders/delegate-visao-geral.mp4` (1920×1080, 30 fps, 3:28)
- **Narração:** Sofia (ElevenLabs, pt-PT), modelo `eleven_multilingual_v2`, numa única gravação contínua
- **Música:** original (Eleven Music), cinco secções alinhadas às cenas. A versão de 3:28 reaproveita a música de 3:00 (em `captura/anterior-3min/`), prolongada com dois saltos alinhados à batida (Bastidores +12 batidas, Impacto +36), porque a conta ElevenLabs não tinha créditos para gerar a nova.
- **Demonstração:** capturas reais
  - o **Painel ao vivo** a reproduzir a sessão gravada a 22/10/2026 às 15h58 (`captura/sessao-esplanada.json`, eventos 421–465): decisão pelo TypeSafe Jev em 2,6 s, resposta com fonte, mandatos D2 e D3, Cofre, chamada à Porta e processo OEP/2026/0001 (Simulação);
  - a **Consola da Câmara v2** (`reference-docs/delegate-consola-camara-v2.html`), com o pedido #DG-2048 aprovado com fundamentação e a missão atualizada;
  - a vista **Intenções do Concelho** da mesma Consola (dados sintéticos): garantias, indicadores, mapa por freguesia e tema, motivações e desejos.

## Como regenerar

```bash
npm install
python3 tools/voz.py vg && python3 tools/montar.py vg      # narração (texto da tabela do ROTEIRO.md) e linha de tempo
python3 tools/musica.py vg                                  # banda sonora
node tools/capturar-painel.mjs                              # Painel a reproduzir captura/sessao-esplanada.json
node tools/capturar-consola.mjs                             # Consola v2 com cursor e aprovação
node tools/capturar-intencoes.mjs                           # Consola v2 · Intenções do Concelho
for n in painel consola intencoes; do ffmpeg -y -i captura/$n.webm -r 30 -c:v libx264 -crf 15 -g 1 -pix_fmt yuv420p -an vg/media/$n.mp4; done
node tools/render.mjs vg --cues && python3 tools/misturar.py vg
node tools/render.mjs vg                                    # → renders/delegate-visao-geral.mp4
```

## Notas para o pitch (encontradas durante a captura)

1. **A frase do cartão do jurado salta o TypeSafe Jev.** «Quero pôr uma esplanada…» cai num atalho do núcleo ([principal.ts](../../prototipo/apps/api/src/nucleo/principal.ts), regex `quero.*esplanada`) que inicia logo o fluxo D2: não há resposta com fonte nem árvore de decisão. Com «O que preciso para ter uma esplanada à porta do meu café?» o fluxo segue o guião. Convém mudar o cartão ou a regra.
2. **Corrigido:** as respostas do Henriques em vários balões (`enviarSequencia`) não ficavam no registo com `entregue_no_canal`, por isso o Painel não mostrava a resposta com a fonte. O canal em `principal.ts` passa a registar cada balão.
3. **Reiniciar sempre o núcleo e depois a Porta.** O núcleo arranca o PostgreSQL embutido; se for reiniciado sozinho, a Porta perde a ligação à base e as submissões falham com «Client has encountered a connection error and is not queryable».
4. **Primeira chamada ao Jev depois do arranque:** pode passar dos 10 s e acionar a contingência local. Convém fazer uma pergunta de aquecimento antes de entregar o telemóvel ao jurado.
