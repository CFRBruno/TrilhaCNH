import os,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT); sys.path.insert(0,os.path.join(ROOT,'scripts'))
import json,re,collections,random,unicodedata,os
from topics import T
from content import C,S as SM
random.seed(42)
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
B=json.load(open('data/banco.json')); A=json.load(open('data/assign.json'))
for o in B:
    t=A[o['id']]; n=norm(o['q'])
    if t=='alcool' and 'sono' in n: A[o['id']]='sono'
    if t=='hab_proc' and re.search(r'\bppd\b|permissao para dirigir',n): A[o['id']]='ppd'
ids=[t[0] for t in T]; TI={t:i for i,t in enumerate(ids)}
cnt=collections.Counter(A.values())
saiba=json.load(open('data/saiba.json'))
VIS={
'sin_tipos':[None,'P:R-1','I:lin-continua','I:sem-verde','I:ciclofaixa','I:cone','I:temporaria'],
'plc_familias':['P:R-1','P:A-32a','I:ind-verde','P:R-1|R-2','I:dica'],
'plc_regul':['P:R-1','P:R-2','P:R-6a','P:R-6c','P:R-3','P:R-19','I:dica'],
'plc_advert':['P:A-2b','P:A-1a','P:A-18','P:A-6','P:A-33a','P:A-20b','I:dica'],
'plc_indic':['P:SAU-09','I:ind-azul','I:ind-verde','I:ind-branca','I:ind-marrom'],
'hor_linhas':['I:lin-branca','I:lin-amarela','I:lin-continua','I:lin-tracejada','I:lin-dupla',None],
'hor_marcas':['I:faixa-ped','I:setas-chao','I:retencao','I:pare-chao','I:cruz-x','I:zebrado','I:faixa-exclusiva'],
'semaforo':['I:sem-vermelho','I:sem-amarelo','I:sem-verde','I:sem-ped','I:sem-trem'],
'ciclo_sinal':['I:ciclovia','I:ciclofaixa','P:R-34',None],
'aux_temp':['I:cone','I:tacha','I:balizador','I:defensa','I:temporaria',None],
'hierarquia':['I:agente','I:sem-verde','P:R-1','I:pare-chao',None,'I:dica'],
'vermelho_celular':['I:sem-vermelho','I:sem-amarelo',None,'I:dica'],
'pedestre_faixa':['I:faixa-ped',None,'I:faixa-ped',None,None],
'seta':[None,None,None,'I:dica'],
'estacionar':[None,None,'P:DEF-01',None,None,None],
'parar':[None,None,'I:faixa-ped',None,None,None,'P:SAU-18'],
'ciclistas_motos':['I:ciclofaixa',None,None,None],
'preferencia':[None,None,'P:A-39','P:R-33',None],
'infr_comuns':['I:lin-continua',None,'I:faixa-exclusiva',None,None,None],
}
for k,v in VIS.items(): assert len(v)==len(C[k][0]),(k,len(v),len(C[k][0]))
tp=[]
for tid,aula,title,ap,_ in T:
    lines,_ims=C[tid]
    if tid in SM and SM[tid]: it,tx=SM[tid]; sm={'it':'Apostila, item '+it,'tx':tx}
    else: sm=saiba.get(tid)
    if sm: sm['tx']=re.sub(r'\s*\d+\s*S\s?EC\s?R\s?E.*?T\s?R\s?Â\s?N\s?S\s?I\s?T\s?O\s*',' ',sm['tx']).strip()
    d={'id':tid,'a':aula,'t':title,'ap':ap,'c':lines,'sm':sm}
    if tid in VIS: d['v']=VIS[tid]
    tp.append(d)
q=[[o['id'],o['p'],o['m'],o['d'],TI[A[o['id']]],o['q'],o['a'],o['w'],o['k'],o.get('s','')] for o in B]
jor={}
for aula in range(1,9):
    tps=[t for t in T if t[1]==aula]
    pools={t[0]:[o for o in B if A[o['id']]==t[0] and o['p']==1] for t in tps}
    N=sum(len(v) for v in pools.values()); sel=[]
    for t in tps:
        pool=pools[t[0]]
        if not pool: continue
        k=max(1,min(len(pool),round(24*len(pool)/N)))
        byd={d:random.sample([o for o in pool if o['d']==d],len([o for o in pool if o['d']==d])) for d in range(3)}
        ch=[]
        for d in [0,1,0,2,1,0,1,2]*3:
            if len(ch)>=k: break
            if byd[d]: ch.append(byd[d].pop())
        rest=[o for d in range(3) for o in byd[d]]
        while len(ch)<k and rest: ch.append(rest.pop(0))
        sel+=[(o['d'],ids.index(t[0]),o['id']) for o in ch]
    sel.sort(); jor[aula]=[x[2] for x in sel]
mods=[{'n':1,'nome':'Placas, Cores e Caminhos'},{'n':2,'nome':'Escolhas e Consequências'},{'n':3,'nome':'Na Direção da Segurança'},{'n':4,'nome':'Cuidar, Agir e Preservar'}]
aulas=[{'n':1,'m':1,'nome':'Placas: a linguagem do trânsito'},{'n':2,'m':1,'nome':'O chão, as luzes e os ajudantes'},
 {'n':3,'m':2,'nome':'Quando o erro traz consequências'},{'n':4,'m':2,'nome':'Quando o erro vira crime'},
 {'n':5,'m':3,'nome':'A via, as regras e os equipamentos'},{'n':6,'m':3,'nome':'Direção defensiva'},
 {'n':7,'m':4,'nome':'Corpo, mente e socorro'},{'n':8,'m':4,'nome':'Manutenção e meio ambiente'}]
DATA={'mods':mods,'aulas':aulas,'tp':tp,'q':q,'jor':jor}
h=open('src/shell.html',encoding='utf-8').read()
dj=json.dumps(DATA,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
h=h.replace('/*__DATA__*/',dj).replace('/*__LIB__*/',open('src/lib.js',encoding='utf-8').read()).replace('/*__MAIN__*/',open('src/main.js',encoding='utf-8').read())
open('dist/rumo-a-cnh.html','w',encoding='utf-8').write(h)
print('MB',round(len(h.encode())/1e6,2))
codes=sorted({c for o in B if 's' in o for c in re.split(r'\s+e\s+',o['s'])})
print('codes',len(codes))
# cobertura.md
L=['# Cobertura do conteúdo — Rumo à CNH','',
 'Todas as 1.500 questões do Banco estão associadas a exatamente um tópico. Onde aparecem: **Fase** (Estudo + Desafio da Jornada, com uma seleção da Parte 1), **Reforço** (todas as questões do tópico, depois que a fase é estudada), **Chefe** (Parte 2 do módulo) e **Simulado final** no Quintas (sorteio entre todas).','']
for a in aulas:
    L.append(f"## Fase {a['n']} — {a['nome']} (Módulo {a['m']}: {mods[a['m']-1]['nome']})"); L.append('')
    L.append('| Tópico | Questões do Banco | Na Jornada | Parte 2 (chefe) |'); L.append('|---|---:|---:|---:|'); tot=0
    for t in [x for x in T if x[1]==a['n']]:
        n=cnt[t[0]]; tot+=n; nj=sum(1 for i in jor[a['n']] if A[i]==t[0]); p2=sum(1 for o in B if A[o['id']]==t[0] and o['p']==2)
        L.append(f"| {t[2]}{' *(Aprofundamento)*' if t[3] else ''} | {n} | {nj} | {p2} |")
    L.append(f"| **Total** | **{tot}** | **{len(jor[a['n']])}** | |"); L.append('')
L+=['## Placas','',f"Todas as {len(codes)} placas citadas no Banco são desenhadas em vetor, no padrão oficial (formato, cores e símbolos), e aparecem nas perguntas e nas galerias do Estudo: "+', '.join(codes)+'.','',
 'O Estudo não usa imagens dos PDFs: os painéis viraram cartões em grid, com placas, ilustrações e ícones desenhados no próprio jogo.','']
open('dist/cobertura.md','w',encoding='utf-8').write('\n'.join(L))
