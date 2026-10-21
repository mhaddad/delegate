# Delegate — série de 3 vídeos (Hack4Guimarães)

| Vídeo | Duração | Pergunta a que responde | Música | Roteiro |
|---|---|---|---|---|
| 1 · O problema | ~1:50 | *Porque é que a Inês está presa?* | melancólica, baixa | [01-PROBLEMA.md](01-PROBLEMA.md) |
| 2 · A solução | ~2:00 | *Como é a vida da Inês com o Henriques?* | alegre, divertida, emocionante | [02-SOLUCAO.md](02-SOLUCAO.md) |
| 3 · A tecnologia | ~3:55 | *O que está por trás da magia?* | genial, brilhante, inteligente | [03-TECNOLOGIA.md](03-TECNOLOGIA.md) |

## Como os vídeos se ligam

- **Os mesmos dois casos atravessam a série:** a **casa** no terreno do avô, atrás do restaurante, e a **esplanada** da Casa Joaquim. O vídeo 1 mostra o problema nos dois casos, o vídeo 2 resolve-os do ponto de vista da Inês e o vídeo 3 abre o caso da esplanada por dentro.
- **A ligação entre vídeos é feita por quem apresenta.** Ainda assim, o 1 termina com *"E se bastasse dizer o que precisa?"*, o 2 com o slogan *"Diga o que precisa. O Henriques trata do resto."* e o 3 abre com as mensagens do vídeo 2 a afundarem abaixo da Linha de Superfície.
- **O fio do arquiteto:** no vídeo 1 a Inês pensa em contratar um arquiteto só para perceber o caminho; no vídeo 2 pergunta isso mesmo ao Henriques, e ele explica quando e para quê.
- **A cor conta a história:** o vídeo 1 é frio e dessaturado, a cair para a noite; o vídeo 2 é quente e solar; o vídeo 3 é técnico, em blueprint azul-tinta.
- **Os elementos visuais transitam da versão aprovada:** a Inês, o anel do Henriques, o Cofre hexagonal, a Linha de Superfície, a paleta e as tipografias.

## Voz: como garantir que a Sofia soa sempre igual

Na versão anterior, cada frase foi gerada num pedido separado, com uma indicação de emoção diferente. O modelo eleven_v3 varia o timbre de pedido para pedido, e foi daí que veio a sensação de vozes diferentes. Para a série, faço assim:

1. **Uma única gravação contínua por vídeo:** a narração inteira de cada vídeo sai num só pedido, por isso a voz, o ritmo e o timbre ficam iguais do princípio ao fim. Depois corto-a nos blocos usando os timestamps de cada palavra.
2. **O mesmo modelo, as mesmas definições e a mesma semente nos três vídeos**, para os três soarem à mesma pessoa.
3. **A emoção vem do texto e da pontuação**, não de indicações de tom frase a frase, que eram a principal causa de variação.
4. **Antes de produzir**, gero uma amostra de cerca de 20 s de cada vídeo com o mesmo método, para comparar e aprovar a voz.

## Factos verificados (pesquisa no site da Câmara de Guimarães, outubro 2026)

- **PDM:** em vigor está a revisão de 2015 (Aviso 6936/2015). A proposta de **2.ª revisão** foi aprovada pela Câmara a 14/09/2026 e segue para a Assembleia Municipal ([pdm.guimaraes.pt](https://pdm.guimaraes.pt/)). Por isso os vídeos dizem "a Câmara aprovou a **proposta** de um novo PDM" e "pelo PDM em vigor e pela proposta de revisão".
- **Esplanada:** o Regulamento de Ocupação do Espaço Público e Publicidade de Guimarães (art. 8.º e Anexo I) prevê que uma esplanada aberta, contígua à fachada e que não excede a largura do estabelecimento, segue a **mera comunicação prévia** do Licenciamento Zero. Exige um **corredor para peões de pelo menos 2,00 m**. A taxa existe, mas o valor não foi verificado e não aparece nos vídeos. ([regulamento](https://www.cm-guimaraes.pt/cmguimaraes/uploads/document/file/2797/47138.pdf), [alteração 2020](https://www.cm-guimaraes.pt/cmguimaraes/uploads/document/file/16470/alteracao_ao_regulamento_de_ocupacao_do_espaco_publico_e_publicidade__no_municipio_de_guimaraes.pdf))
- **Pedido de informação prévia:** é submetido na plataforma **Urbanismo Digital** ([ud.cm-guimaraes.pt](https://ud.cm-guimaraes.pt)). Na prática costuma ter apoio de um técnico habilitado, e por isso o Henriques não promete dispensá-lo. O RJUE foi revisto pelo DL 108/2026.
- **Freguesias:** desde 2025 são **55**, não 48. Os vídeos não indicam número.

## Produção

- **Narração:** cada vídeo é uma **única gravação contínua** da Sofia, cortada pelos timestamps (`tools/voz.py`, `tools/montar.py`). O texto vem diretamente da tabela "Narração" de cada roteiro.
- **Modelo de voz:** `eleven_multilingual_v2`, com a mesma semente e as mesmas definições nos três vídeos. A Sofia só está **verificada em pt-PT** para alguns modelos (multilingual_v2, a família v4, turbo/flash v2.5). O `eleven_v3`, usado numa primeira versão, puxava a pronúncia para pt-BR. A gravação anterior ficou em `v*/audio/v3-br/`.
- **Música:** original, composta no Eleven Music com secções alinhadas aos blocos (`tools/musica.py`).
- **Efeitos:** 43 sons da ElevenLabs (`audio/sfx/`), colocados nos instantes declarados pela animação.
- **Animação:** HTML/SVG com o motor próprio (`shared/core.js`), renderizado quadro a quadro com o Chrome headless e o ffmpeg (`tools/render.mjs`).

```bash
python3 tools/voz.py v1 && python3 tools/montar.py v1     # narração e linha de tempo
python3 tools/musica.py v1                                 # banda sonora
node tools/render.mjs v1 --cues && python3 tools/misturar.py v1
node tools/render.mjs v1                                   # → renders/delegate-01-problema.mp4
```

Pré-visualização com som: servir esta pasta (`python3 -m http.server`) e abrir `v1/index.html?play` (clique para tocar/pausar; `&t=60` para começar num instante).
