"""Shared ElevenLabs helpers. The key is read from ELEVENLABS_API_KEY or the project .env and never printed."""
import json, os, sys, urllib.request, urllib.parse
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent

def load_key():
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key:
        env = PROJECT / ".env"
        if env.exists():
            for line in env.read_text().splitlines():
                line = line.strip()
                if line.startswith("ELEVENLABS_API_KEY"):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'")
    if not key:
        sys.exit("ELEVENLABS_API_KEY não encontrada no ambiente nem em .env")
    return key

def get(path, params=None):
    url = "https://api.elevenlabs.io" + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"xi-api-key": load_key()})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())

def post(path, body, accept="application/json"):
    req = urllib.request.Request("https://api.elevenlabs.io" + path, data=json.dumps(body).encode(),
        headers={"xi-api-key": load_key(), "Content-Type": "application/json", "Accept": accept}, method="POST")
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read()
