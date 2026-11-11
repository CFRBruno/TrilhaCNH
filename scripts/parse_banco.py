import os,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT); sys.path.insert(0,os.path.join(ROOT,'scripts'))
import re, json
txt=open('materiais/banco.txt',encoding='utf-8').read()
# remove cabeçalhos de página
txt=txt.replace('\f','\n')
txt=re.sub(r'\nCNH do Brasil - Ministério dos Transportes - Secretaria Nacional de Trânsito\n','\n',txt)
lines=[l.rstrip() for l in txt.split('\n')]
part=0; mod=0; cur=None; qs=[]; field=None
def join(parts):
    s=''
    for p in parts:
        p=p.strip()
        if not p: continue
        if not s: s=p; continue
        if s.endswith('-') and not s.endswith(' -') and re.search(r'[a-zà-ú]-$',s) and p[:1].islower():
            s=s[:-1]+p   # hifenização
        else:
            s+=' '+p
    return re.sub(r'\s+',' ',s).strip()
for l in lines:
    if l.startswith('PARTE 1'): part=1; continue
    if l.startswith('PARTE 2'): part=2; continue
    m=re.match(r'^MÓDULO (\d) - ',l)
    if m: mod=int(m.group(1)); continue
    m=re.match(r'^● \((Fácil|Intermediário|Difícil)\) (\d+)\.\s*(.*)$',l)
    if m:
        cur={'p':part,'m':mod,'n':int(m.group(2)),'d':m.group(1),'q':[m.group(3)],'placa':None,'c':[],'com':[],'x':[]}
        qs.append(cur); field='q'; continue
    if cur is None: continue
    if not l.strip(): continue
    m=re.match(r'^Código da placa:\s*(.*)$',l)
    if m: cur['placa']=m.group(1).strip(); field=None; continue
    m=re.match(r'^Alternativa correta:\s*(.*)$',l)
    if m: cur['c']=[m.group(1)]; field='c'; continue
    m=re.match(r'^Comentário:\s*(.*)$',l)
    if m: cur['com']=[m.group(1)]; field='com'; continue
    if l.startswith('Respostas incorretas:'): field='xh'; continue
    m=re.match(r'^✗\s*(.*)$',l)
    if m: cur['x'].append([m.group(1)]); field='x'; continue
    if field=='x': cur['x'][-1].append(l)
    elif field in ('q','c','com'): cur[field].append(l)
out=[]
for q in qs:
    c=join(q['c']); 
    c=re.sub(r'\s*✓\s*$','',c)
    o={'id':f"{q['p']}-{q['m']}-{q['n']}",'p':q['p'],'m':q['m'],'n':q['n'],'d':{'Fácil':0,'Intermediário':1,'Difícil':2}[q['d']],
       'q':join(q['q']),'a':c,'w':[join(x) for x in q['x']],'k':join(q['com'])}
    if q['placa']: o['s']=q['placa']
    out.append(o)
json.dump(out,open('data/banco.json','w',encoding='utf-8'),ensure_ascii=False)
print(len(out))
from collections import Counter
print(Counter((o['p'],o['m']) for o in out))
print(Counter(o['d'] for o in out))
print('placa',sum(1 for o in out if 's' in o), len(set(o['s'] for o in out if 's' in o)))
bad=[o['id'] for o in out if len(o['w'])!=3 or not o['a'] or not o['k'] or not o['q']]
print('bad',bad)
ids=[o['id'] for o in out]; print('dup',len(ids)-len(set(ids)))
# checa ✓ restante ou cabeçalhos
for o in out:
    for f in ['q','a','k']+[]:
        if '✓' in o[f] or 'Secretaria Nacional' in o[f] or 'MÓDULO' in o[f]: print('lixo',o['id'],f,o[f][:80])
    for w in o['w']:
        if 'MÓDULO' in w or 'PARTE' in w or 'Secretaria' in w: print('lixow',o['id'],w)
