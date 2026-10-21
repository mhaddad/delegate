"""Gera a narração bloco a bloco na ElevenLabs, com timestamps por caractere.

Uso: python3 tools/gerar_voz.py [ids dos blocos a regenerar...]
Saída: audio/vo/<id>.mp3 e audio/vo/<id>.json (alinhamento + duração)
"""
import base64
import json
import os
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "audio", "vo")
VOICE_ID = "MTAejQCmgXMzsj4Dgq5O"  # Sofia — pt-PT
MODEL = "eleven_v3"  # o mais expressivo; aceita indicações de tom entre [ ]

# Texto escrito para o TTS (grafia fonética onde é preciso). O texto "oficial" está em NARRACAO.md.
BLOCOS = [
    ("01", "[warmly] Esta é a Inês. Do avô, herdou um terreno em Ponte, aqui em Guimarães. [softly] E, com ele, um plano: construir ali a sua casa. [hopeful] Cento e cinquenta metros quadrados."),
    ("02", "[concerned] Mas Guimarães acaba de aprovar um novo Plano Diretor Municipal. E uma pergunta simples deixa de o ser: [worried] ainda posso construir? [frustrated] Regulamentos, plantas, condicionantes, balcões, telefonemas… [sighs] Para ter uma resposta, a Inês teria de se tornar especialista em urbanismo."),
    ("03", "[thoughtful] A burocracia existe por boas razões: protege o interesse público e deixa prova de cada decisão. [serious] O problema é outro. Hoje, quem carrega essa complexidade é o cidadão."),
    ("04", "[curious] E se fosse ao contrário? [excited] Este é o Delegate. Cada munícipe passa a ter um representante digital pessoal. Em Guimarães, chama-se Henriques. [proudly] Um nome que, aqui, dispensa apresentações."),
    ("05a", "[warmly] A Inês abre o WhatsApp e escreve ao Henriques, como escreveria a um amigo."),
    ("05b", "[softly] É tudo o que precisa de fazer."),
    ("06", "[intrigued] Do outro lado, começa o trabalho invisível. O Henriques abre o Cofre Digital Pessoal da Inês — cifrado, e controlado só por ela. Retira apenas o essencial: o terreno, a pretensão, a planta. [firmly] Mais nada sai do cofre."),
    ("07", "[energetic] Em seguida, entram em ação agentes de inteligência artificial especializados. Um lê o novo pê-dê-éme, na versão oficial. Outro cruza o terreno com as plantas e as condicionantes. Um terceiro prepara o processo. [serious] E um supervisor garante que nenhum passa dos limites: cada acesso aos sistemas da Câmara tem finalidade, autorização e registo."),
    ("08", "[happy] Minutos depois, o Henriques responde: a análise preliminar é favorável! Para ter certeza formal, já preparou o Pedido de Informação Prévia. A Inês confirma com a Chave Móvel Digital."),
    ("09", "[confident] Onde é preciso juízo técnico, decide uma pessoa. A arquiteta Marta recebe o caso completo, com fontes e apenas os dados necessários. Analisa, valida e propõe a decisão. Tudo fica registado."),
    ("10", "[joyful] Dias depois, a resposta chega ao telemóvel da Inês: pode avançar! [warmly] Com fonte, recibo e próximos passos."),
    ("11", "[amazed] Para a Inês, foram quatro mensagens. [confident] Para a Câmara, foi todo o rigor de sempre. [warmly] Parece magia, mas é método: simplicidade para o cidadão, controlo para a Administração."),
    ("12", "[confident] E a Câmara ganha pedidos completos à primeira, menos contactos repetidos e técnicos focados no que importa: decidir."),
    ("13", "[inspired] O próximo passo é um piloto com a Câmara e as Freguesias de Guimarães. Depois, a região. Um dia, o país — sem nenhuma base de dados central sobre as pessoas."),
    ("14", "[proudly] Delegate. [inspired] Onde nasceu Portugal, pode nascer uma nova relação entre o cidadão e o Estado."),
]


def load_key():
    with open(os.path.join(ROOT, ".env")) as f:
        for line in f:
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise SystemExit("ELEVENLABS_API_KEY em falta no .env")


def tts(key, text, prev_text, next_text):
    body = {
        "text": text,
        "model_id": MODEL,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return float(out)


def main():
    key = load_key()
    os.makedirs(OUT, exist_ok=True)
    only = set(sys.argv[1:])
    for i, (bid, text) in enumerate(BLOCOS):
        if only and bid not in only:
            continue
        prev_text = BLOCOS[i - 1][1] if i > 0 else None
        next_text = BLOCOS[i + 1][1] if i + 1 < len(BLOCOS) else None
        res = tts(key, text, prev_text, next_text)
        mp3 = os.path.join(OUT, f"{bid}.mp3")
        with open(mp3, "wb") as f:
            f.write(base64.b64decode(res["audio_base64"]))
        al = res.get("alignment") or {}
        meta = {"id": bid, "text": text, "duration": duration(mp3), "alignment": al}
        with open(os.path.join(OUT, f"{bid}.json"), "w") as f:
            json.dump(meta, f, ensure_ascii=False)
        print(f"{bid}: {meta['duration']:.2f}s")


if __name__ == "__main__":
    main()
