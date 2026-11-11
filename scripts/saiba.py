import os,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT); sys.path.insert(0,os.path.join(ROOT,'scripts'))
import re,unicodedata,json
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
L=open('materiais/apostila.txt',encoding='utf-8').read().replace('\f','\n').split('\n')
H=[]
for i,l in enumerate(L):
    if i<300: continue
    m=re.match(r'^\s*(\d\.\d+(?:\.\d+)?)\.?\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ,–()\-:/]+)$',l.strip())
    if m and len(l.strip())<90: H.append((i,m.group(1),m.group(2).strip()))
def rng(item):
    for k,(i,n,t) in enumerate(H):
        if n==item: return i, (H[k+1][0] if k+1<len(H) else len(L)), t
    return None
M={
'sin_tipos':('2.8.1',['seguranca']),'plc_familias':('2.8.2',['regulamentacao']),'plc_regul':('2.8.2',['obrigac','proibic']),
'plc_advert':('2.8.2',['advertencia']),'plc_indic':('2.8.2',['indicacao']),'hor_linhas':('2.8.2',['longitudina']),
'hor_marcas':('2.8.2',['canalizacao']),'semaforo':('2.8.2',['semaforo']),'ciclo_sinal':('2.8.2',['ciclofaixa']),
'aux_temp':('2.8.2',['temporaria']),'hierarquia':('2.8.3',['agente']),'pen_medidas':('2.2.3',['penalidade']),
'pontos':('2.2.3',['pontos']),'antes_sair':('2.4.3',['licenciamento']),'veiculos_doc':('2.4.2',['placa']),
'vermelho_celular':('1.3.3',['celular']),'velocidade_multa':('1.3.1',['velocidade']),'pedestre_faixa':('1.4.5',['pedestre']),
'seta':('2.9.3',['sinaliz','luz indicadora','seta']),'cinto_regra':('3.4',['cinto']),'emergencia':('2.9.4',['emergencia','socorro']),
'estacionar':('2.9.3',['estacion']),'infr_comuns':('2.2.3',['acostamento','gravissima']),'alcool':('1.3.2',['alcool']),
'veiculo_irregular':('3.7.7',['modifica']),'ocupantes':('3.4.2',['banco traseiro']),'parar':('2.9.1',['parada','parar']),
'moto_infr':('3.2.4',['capacete']),'crimes':('2.3.3',['crime']),'multa':('2.2.3',['notificac','recurso','defesa']),
'bom_condutor':('1.4.4',['respeito','convivio']),'categorias':('2.5.2',['categoria']),'ppd':('2.5.1',['permissao']),
'hab_proc':('2.5.4',['renova']),'vias':('2.7.2',['via']),'rodovia':('3.1',['rodovia','estrada']),'cinto_uso':('3.4',['cinto']),
'airbag_apoio':('3.4.3.',['airbag','apoio']),'cadeirinha':('3.4.2',['retencao']),'capacete':('3.4',['capacete']),
'conversoes':('2.9.3',['conversao']),'preferencia':('2.9.2',['preferencia']),'retorno_acel':('2.9.3',['retorno']),
'defensiva':('3.2.1',['defensiva']),'fator_humano':('1.1',['visao zero']),'ver_visto':('3.2.2',['visto']),
'comunicacao':('3.2.3',['buzina']),'moto_def':('3.2.4',['motocic']),'carro_def':('3.3.3',['reacao']),
'velocidade_seg':('3.3.1',['velocidade']),'adversas':('3.5.',['chuva','aquaplanagem']),'posicao':('2.9.1',['direita']),
'ultrapassagem':('2.9.3',['ultrapass']),'pedestres':('1.4.5',['vulnera']),'ciclistas_motos':('2.9.4',['ciclista']),
'grandes':('2.9.9',['onibus']),'sono':('4.1.2',['sono']),'emocoes':('4.1.2',['emoc']),'sinistro_agir':('4.2.1',['sinaliz']),
'sem_vitimas':('4.2.1',['sem vitima']),'numeros':('4.2.1',['192','193']),'socorros':('4.3',['vitima']),
'socorros_ap':('4.3.2',['hemorragia']),'riscos_especiais':('4.2.1',['perigosa']),'pneus':('3.6.1',['pneu']),
'luzes':('3.6.3',['farol','ilumina']),'freios':('3.6.1',['freio']),'limpadores':('3.6.7',['palheta','limpador']),
'oleo':('3.6.4',['oleo']),'revisoes':('3.6.7',['revis','manutencao']),'recall':('3.6.8',['recall']),
'outros_itens':('3.6.5',['arrefecimento']),'ambiente':('3.7.2.',['polui']),'eco':('3.7.4',['consumo','eficien'])}
out={}
for tid,(item,kws) in M.items():
    r=rng(item) or rng(item.rstrip('.'))
    if not r:
        cand=[h for h in H if h[1].startswith(item.rstrip('.'))]
        if cand: r=rng(cand[0][1])
    if not r: out[tid]=None; print('SEM ITEM',tid,item); continue
    a,bb,title=r
    # estende até 3 cabeçalhos à frente se pequeno
    txt=' '.join(x.strip() for x in L[a+1:min(bb+400,len(L)) if bb-a<15 else bb])
    txt=re.sub(r'\s+',' ',txt)
    sents=re.split(r'(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔ])',txt)
    pick=None
    for k,s in enumerate(sents):
        n=norm(s)
        if any(kw in n for kw in kws) and 50<len(s)<400 and not re.search(r'Fonte:|SECRETARIA NACIONAL',s):
            pick=k;break
    if pick is None: out[tid]=None; print('SEM FRASE',tid,item); continue
    res=sents[pick]
    for s in sents[pick+1:pick+3]:
        if len(res)>=230 or re.search(r'Fonte:|SECRETARIA',s): break
        if len(res)+len(s)<420: res+=' '+s
    num=item.rstrip('.')
    out[tid]={'it':'Apostila, item '+num,'tx':res}
    print(tid,'|',num,title[:30],'|',res)
json.dump(out,open('data/saiba.json','w'),ensure_ascii=False)
