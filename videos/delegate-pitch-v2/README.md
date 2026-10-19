# Delegate — pitch v2 (Hack4Guimarães)

Vídeo de 3:00 em motion graphics, com narração em PT-PT. Não usa Hyperframes.

- **Vídeo final:** `renders/delegate-pitch-v2.mp4` (1920×1080, 30 fps, -16 LUFS)
- **Roteiro:** [STORYBOARD.md](STORYBOARD.md) · [NARRACAO.md](NARRACAO.md)

## Áudio

- **Voz:** Sofia (pt-PT) no ElevenLabs `eleven_v3`, com indicações de tom (`[warmly]`, `[excited]`, `[joyful]`…).
- **Banda sonora:** original, composta no Eleven Music com 11 secções alinhadas às cenas (`audio/musica_plano.json`).
- **Efeitos:** 25 sons gerados na ElevenLabs (`audio/sfx/`), colocados nos instantes declarados pela animação (`cue(...)`).

## Como regenerar

```bash
npm install                        # puppeteer-core + fontes
python3 tools/gerar_voz.py         # narração (aceita ids de bloco: 07 11 …)
python3 tools/montar_audio.py      # linha de tempo da voz → audio/voz.wav + audio/timeline.json
python3 -c "import json;d=json.load(open('audio/timeline.json'));open('video/timeline.js','w').write('window.TIMELINE = '+json.dumps(d,ensure_ascii=False)+';\n')"
python3 tools/gerar_musica.py      # banda sonora (secções seguem a timeline)
python3 tools/gerar_sfx.py         # efeitos sonoros (só os que faltam)
node tools/render.mjs --cues       # exporta os instantes dos efeitos → audio/cues.json
python3 tools/misturar.py          # voz + música + efeitos → audio/mix.wav
node tools/render.mjs              # renderiza renders/delegate-pitch-v2.mp4
node tools/render.mjs --stills 12,60,140   # fotogramas soltos para rever
```

Para pré-visualizar no browser com som, sirva a pasta (`python3 -m http.server`) e abra
`video/index.html?play` (clique para tocar/pausar; `&t=90` para começar num instante).

## Estrutura

- `video/core.js`: motor de animação (função pura do tempo, sincronizada com as palavras da narração)
- `video/act1.js`: cenas 1–4 · `video/demo.js`: cenas 5–10 · `video/act4.js`: cenas 11–14
- `audio/vo/`: clipes de voz com timestamps por caractere (`audio/vo-paulo/`: versão anterior)
- `.env`: `ELEVENLABS_API_KEY` (não partilhar)
