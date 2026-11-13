import os,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT); sys.path.insert(0,os.path.join(ROOT,'scripts'))
import json,re,unicodedata,collections,sys
from topics import T
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
b=json.load(open('data/banco.json'))
OV=json.load(open('data/overrides.json')) if __import__('os').path.exists('data/overrides.json') else {}
comp=[(tid,aula,[(w,re.compile(p)) for w,p in pats]) for tid,aula,_,_,pats in T]
asg={};low=[]
for o in b:
    if o['id'] in OV: asg[o['id']]=OV[o['id']]; continue
    if 's' in o:
        c=o['s']; asg[o['id']]='plc_regul' if c.startswith('R') else 'plc_advert' if c.startswith('A') else 'plc_indic'; continue
    q,a,k=norm(o['q']),norm(o['a']),norm(o['k'])
    sc=[]
    for tid,aula,pats in comp:
        s=0
        for w,p in pats:
            if p.search(q): s+=w*3
            elif p.search(a): s+=w*1.5
            elif p.search(k): s+=w*0.5
        if s>0 and (aula+1)//2==o['m']: s+=3
        sc.append((s,tid))
    sc.sort(reverse=True)
    asg[o['id']]=sc[0][1] if sc[0][0]>0 else 'NONE'
    if sc[0][0]-sc[1][0]<4: low.append((o['id'],sc[0],sc[1],o['q'][:75]))
json.dump(asg,open('data/assign.json','w'))
cnt=collections.Counter(asg.values())
print({t[0]:cnt.get(t[0],0) for t in T}); print('NONE',cnt.get('NONE',0))
if len(sys.argv)>1:
    for x in low: print(x[0],x[1][1],round(x[1][0]),'|',x[2][1],round(x[2][0]),'|',x[3])
    for i,t in asg.items():
        if t=='NONE': print('NONE',i,[o['q'] for o in b if o['id']==i][0][:80])
