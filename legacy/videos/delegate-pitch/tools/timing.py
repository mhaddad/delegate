"""Calcula a grelha temporal: duração de cada cena, offset da voz e tempos de palavra (locais e absolutos)."""
import json, subprocess
from pathlib import Path
P = Path(__file__).resolve().parent.parent
IDS = ['01-aqui-nasceu','02-sonho-duvida','03-labirinto','04-insight','05-revelacao','06-afonso','07-palco',
       '08-bastidores','09-cofre','10-pessoas-decidem','11-resposta','12-visao','13-pedido','14-fecho']
DUR = [8.6,6.9,18.2,11.4,8.6,12.6,19.8,21.0,13.2,18.6,9.8,13.8,5.2,12.2]
LEAD = [1.6,0.4,0.4,0.4,0.5,0.4,0.7,0.9,0.5,0.4,0.5,0.4,0.4,0.7]
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(f)]))
t=0; scenes=[]
for i,(fid,d,l) in enumerate(zip(IDS,DUR,LEAD),1):
    vo=P/f'audio/vo/line-{i:02d}.mp3'; vd=dur(vo)
    words=json.loads((P/f'audio/vo/line-{i:02d}.words.json').read_text())
    assert l+vd <= d+0.05, (fid, l+vd, d)
    scenes.append({'n':i,'id':fid,'start':round(t,3),'duration':d,'vo_src':f'audio/vo/line-{i:02d}.mp3','vo_offset':l,'vo_duration':round(vd,3),
        'words':[{'text':w['text'],'local':round(l+w['start'],2),'abs':round(t+l+w['start'],3),'abs_end':round(t+l+w['end'],3)} for w in words]})
    t+=d
(P/'audio/timing.json').write_text(json.dumps({'total':round(t,3),'scenes':scenes},ensure_ascii=False,indent=1))
print('total',round(t,2))
for s in scenes:
    print(f"## {s['id']} start {s['start']} dur {s['duration']} vo {s['vo_offset']}–{round(s['vo_offset']+s['vo_duration'],2)}")
    print(' '.join(f"{w['text']}@{w['local']}" for w in s['words']))
