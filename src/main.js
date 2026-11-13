(function(){
'use strict';
/* ================= DADOS ================= */
const D=JSON.parse(document.getElementById('data').textContent);
const Q={};
D.q.forEach(r=>{Q[r[0]]={id:r[0],p:r[1],m:r[2],d:r[3],t:r[4],q:r[5],a:r[6],w:r[7],k:r[8],s:r[9]||''};});
const TP=D.tp;TP.forEach(t=>t.qs=[]);Object.values(Q).forEach(q=>TP[q.t].qs.push(q.id));
const DIF=['Fácil','Intermediária','Difícil'];

/* ================= ESTADO SALVO ================= */
const KEY='rumo_a_cnh_v1';
function blank(){return {v:1,tut:false,mute:false,sess:0,au:{},ch:{},sim:{best:null,tries:0},qs:{},nb:{},run:null,sel:0};}
let S=load();
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.v===1)return Object.assign(blank(),x);}catch(e){}return blank();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
// limpa referências a questões que saíram do jogo (ex.: questões de moto)
Object.keys(S.nb).forEach(id=>{if(!Q[id])delete S.nb[id];});
if(S.run&&S.run.queue&&S.run.queue.some(id=>!Q[id]))S.run=null;
const au=n=>S.au[n]||(S.au[n]={st:false,ok:false,stars:0});
const ch=m=>S.ch[m]||(S.ch[m]={done:false,selo:false,best:0});

/* ================= UTIL ================= */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const pick=a=>a[Math.floor(Math.random()*a.length)];
const taught=t=>au(t.a).st;
const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= SOM ================= */
let AC=null;
function ac(){if(S.mute)return null;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){return null;}return AC;}
function tone(seq,type,vol){const A=ac();if(!A)return;let t=A.currentTime;
  seq.forEach(([f,d])=>{const o=A.createOscillator(),g=A.createGain();o.type=type||'square';o.frequency.value=f;
    g.gain.setValueAtTime(vol||.05,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(A.destination);o.start(t);o.stop(t+d);t+=d*.9;});}
const SFX={click:()=>tone([[660,.05]]),ok:()=>tone([[523,.08],[659,.08],[784,.14]]),no:()=>tone([[247,.12],[196,.2]],'triangle',.07),
  win:()=>tone([[523,.1],[659,.1],[784,.1],[1047,.28]]),page:()=>tone([[494,.04],[587,.05]],'triangle',.05),
  blip:()=>tone([[150+Math.random()*60,.045]],'square',.035)};

/* ================= PIXEL: coração e nuvem como imagem ================= */
function pixImg(rows,pal,sc){const c=document.createElement('canvas');c.width=rows[0].length*sc;c.height=rows.length*sc;const x=c.getContext('2d');
  rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(pal[ch]){x.fillStyle=pal[ch];x.fillRect(i*sc,j*sc,sc,sc);}}));return c.toDataURL();}
const HEART=['.xx.xx.','xwxxxxx','xxxxxxx','.xxxxx.','..xxx..','...x...'];
const HEART_ON=pixImg(HEART,{x:'#E8577D',w:'#FFFFFF'},4),HEART_OFF=pixImg(HEART,{x:'#F1E1E7',w:'#F7EDF1'},4),HEART_W=pixImg(HEART,{x:'#FFFFFF',w:'#FFFFFF'},4);
const BROOCH=pixImg(['xxx..xxx','xxxx.xxx','.xxxxxx.','..xccx..','.xxxxxx.','xxx..xxx'],{x:'#8E6CC8',c:'#5C3E99'},4);
const CLOUD=pixImg(['...xxxxx....','.xxxxxxxxx..','xxxxxxxxxxxx','.xxxxxxxxxx.'],{x:'#FFFFFF'},4);
const BOW=pixImg(['xx..........xx','xxxx......xxxx','xxxxx.cc.xxxxx','xxxxxxccxxxxxx','xxxxx.cc.xxxxx','xxxx......xxxx','xx..........xx'],{x:'#E58FA8',c:'#B3264A'},3);
const hImg=(on)=>`<img src="${on?HEART_ON:HEART_OFF}" alt="">`;

/* ================= BRUNO: retrato e fala com digitação ================= */
function drawBruno(cv,wave){cv.width=18;cv.height=21;const x=cv.getContext('2d');x.clearRect(0,0,18,21);drawSprite(x,wave?BRUNO_WAVE:BRUNO,1,1,1);}
function guideHTML(msg){return `<div class="guide"><div class="por"><canvas class="px" data-bruno></canvas><img class="heartf" src="${HEART_ON}" alt="" style="right:-6px;top:14px"></div>
  <div class="bubble" data-act="skipSay" title="Toque para mostrar tudo"><span class="who">Bruno</span><span class="say" data-say="${esc(msg)}"></span></div></div>`;}
let sayTimer=null;
function talk(){
  document.querySelectorAll('canvas[data-bruno]').forEach(c=>drawBruno(c,false));
  const el=document.querySelector('[data-say]');if(!el)return;const txt=el.dataset.say;clearInterval(sayTimer);
  if(reduce){el.textContent=txt;return;}
  let i=0;const cv=document.querySelector('canvas[data-bruno]');
  sayTimer=setInterval(()=>{if(!el.isConnected){clearInterval(sayTimer);return;}
    i++;el.textContent=txt.slice(0,i);const ch=txt[i-1];
    if(ch&&/[A-Za-zÀ-ú0-9]/.test(ch)&&i%2===0)SFX.blip();
    if(cv&&i%6===0)drawBruno(cv,(i/6)%2===1);
    if(i>=txt.length){clearInterval(sayTimer);if(cv)drawBruno(cv,false);}},28);
}
function skipSay(){const el=document.querySelector('[data-say]');if(el){clearInterval(sayTimer);el.textContent=el.dataset.say;}}

/* ================= FALAS DO BRUNO ================= */
const hour=new Date().getHours();
const OI=hour<12?'Bom dia, meu amor!':hour<18?'Boa tarde, meu amor!':'Boa noite, meu amor!';
const F={
 titulo:[`${OI} Bora estudar mais um pouquinho pra essa CNH?`,`${OI} Eu sabia que você ia voltar. Vamos juntos?`],
 tut:['Oi, amor! Eu sou o Bruno, seu instrutor particular. E marido, né? Vou estar do seu lado até o dia da prova.',
   'Esse é o nosso bairro! O caminho sai lá de casa, passa no Val e no Tchuras, sobe a Jayme Sapolnik e termina no Quintas.',
   'Cada parada é uma fase: primeiro a gente estuda uns cartões, depois vem o Desafio com as perguntas oficiais. Sem relógio e sem game over: errou, eu te explico e a pergunta volta depois.',
   'Cada região tem um chefe e, no Quintas, o simulado final. Se quiser revisar o que errou, é só abrir o Reforço. Te amo, vamos nessa!'],
 aula:{1:'Começando pelas placas, amor: elas conversam com a gente na rua o tempo todo.',2:'Agora o chão, as luzes e os ajudantes da sinalização. Repara que você já vê tudo isso todo dia!',
   3:'Hoje é sobre consequências: multa, pontos e o porquê das regras. Prometo que é menos chato do que parece.',4:'Essa aula separa o erro do crime. Lê com calma, que cai bastante na prova.',
   5:'Vias, preferência e equipamentos. Aqui você começa a pensar como motorista de verdade.',6:'Direção defensiva: é prever o perigo antes dele aparecer. Você já faz isso comigo no banco do carona!',
   7:'Corpo, mente e socorro. A parte mais humana do curso, a sua cara.',8:'Última aula, amor! Manutenção e meio ambiente. Depois é só o Quintas.'},
 card:['Tá indo super bem. Próximo?','Esse aqui eu acho que cai na prova.','Lê com calma, sem pressa nenhuma.','Repara nas cores, ajudam a lembrar.','Tô gostando de estudar com você.'],
 lastCard:'Último cartão! Depois dele, o Desafio. Você consegue.',
 q0:['Respira e lê tudo antes de escolher, tá?','Sem pressa. Eu espero.','Lê todas as alternativas, amor.'],
 qn:['Próxima!','Tô vendo seu progresso daqui!','Continua assim.','Mais uma, vai.'],
 ok:['Isso, amor! Mandou bem!','Acertou! Eu sabia.','Perfeito! Orgulho de você.','Exato! Tá voando.','Isso aí, minha motorista!'],
 no:['Quase! Lê o comentário comigo.','Tudo bem errar aqui, é assim que a gente aprende.','Calma, essa é traiçoeira. Ela volta depois.','Não foi dessa vez, mas agora você já sabe.'],
 boss:{1:'O Val tá aberto! Bora ver se você aprendeu as placas e a sinalização.',2:'Chegamos no Tchuras! Desafio das regras e consequências antes do churrasco.',
   3:'A subida da Jayme Sapolnik. Aqui entra tudo de via, preferência e direção defensiva.',4:'O retorno da Rua das Araras! Último chefe antes do Quintas.'},
 fim:{fase3:'Que orgulho, amor! Três corações!',fase2:'Muito bem! Dois corações já é ótimo.',fase1:'Fase concluída! Se quiser, refaz depois pra ganhar mais corações.',
   bossOk:'Você venceu o chefe! Ganhou o broche da região.',bossNo:'Foi quase! A próxima região já tá liberada; volta aqui quando quiser.',
   simOk:'APROVADA! Eu sabia, meu amor! Agora é só a prova de verdade.',simNo:'Ainda não foi, mas você tá perto. Vamos reforçar juntos?',ref:'Mais uma sessão de reforço feita. Cada uma te deixa mais pronta.'},
 ref:'Revisão relâmpago! Primeiro um cartãozinho, depois as perguntas que você mais precisa.',
 dom:'Aqui você vê o que já domina e o que falta. Sem pressão, tá? Um tópico de cada vez.',
};

/* ================= MAPA DO BAIRRO (pixel art, 480×270) ================= */
const NODES=[ // tipo, número, x, y (coordenadas do canvas do mapa)
 {k:'f',n:1,x:392,y:176},{k:'f',n:2,x:354,y:146},{k:'c',n:1,x:378,y:240},
 {k:'f',n:3,x:330,y:214},{k:'f',n:4,x:262,y:225},{k:'c',n:2,x:196,y:231},
 {k:'f',n:5,x:172,y:190},{k:'f',n:6,x:172,y:140},{k:'c',n:3,x:172,y:96},
 {k:'f',n:7,x:240,y:70},{k:'f',n:8,x:318,y:70},{k:'c',n:4,x:388,y:61},{k:'s',n:0,x:96,y:69}];
const BOSS=['Val','Tchuras','Subida da Jayme','Retorno da Araras'];
const BOSSDESC=['O mercadinho de frente pra casa','A barraquinha do churrasco com os amigos','O topo da Jayme Sapolnik','O retorno da Rua das Araras'];
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const ROADS={
 jayme:[[480,196],[430,200],[330,214],[240,228],[200,231],[182,224],[172,208],[172,66]],
 arN:[[0,52],[384,52]],arS:[[0,70],[384,70]],
 colibris:[[420,197],[360,150],[312,112],[300,70]],
 m1:[[172,150],[110,158],[40,166]],m2:[[262,70],[262,150],[290,190]],m3:[[330,70],[340,130],[360,150]],m4:[[60,70],[60,140],[110,158]],
};
function drawMap(cv){
  const W=480,H=270;cv.width=W;cv.height=H;const c=cv.getContext('2d');const R=rng(21);
  const f=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
  f(0,0,W,H,'#F7E8EE');for(let i=0;i<900;i++)f(R()*W,R()*H,1,1,'#EFD6E0');
  // rio à direita
  for(let y=0;y<H;y++){const x=458+Math.round(Math.sin(y/14)*4);f(x,y,12,1,'#BFE3F2');if(y%9===0)f(x+3,y,3,1,'#E8F7FD');}
  const sample=pts=>{const out=[];for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]],n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));for(let s=0;s<=n;s++)out.push([a[0]+(b[0]-a[0])*s/n,a[1]+(b[1]-a[1])*s/n]);}return out;};
  const all=[];Object.values(ROADS).forEach(p=>all.push(...sample(p)));
  const keep=[[392,138,72,60],[392,204,72,60],[60,74,72,58]]; // áreas dos desenhos
  const free=(x,y,w,h,m)=>{if(x<2||y<2||x+w>454||y+h>H-2)return false;for(const k of keep)if(x<k[0]+k[2]+3&&x+w>k[0]-3&&y<k[1]+k[3]+3&&y+h>k[1]-3)return false;
    for(const p of all)if(p[0]>x-m&&p[0]<x+w+m&&p[1]>y-m&&p[1]<y+h+m)return false;return true;};
  // canteiro entre as pistas da Rua das Araras
  f(0,57,388,8,'#BEE3C6');for(let x=6;x<388;x+=16){f(x,57,5,5,'#8CCB9B');f(x+2,62,1,2,'#9A6A55');}
  // quarteirões e praças
  const cols=['#F4D3DE','#E9DDF5','#FBE3CF','#DDEFE2','#FFF1C9'];
  for(let i=0;i<260;i++){const w=10+Math.floor(R()*16),h=8+Math.floor(R()*14),x=R()*W,y=R()*H;if(!free(x,y,w,h,6))continue;
    if(R()<.28){f(x,y,w,h,'#CFEBD3');for(let k=0;k<3;k++){const tx=x+2+R()*(w-5),ty=y+2+R()*(h-5);f(tx,ty,3,3,'#8CCB9B');f(tx+1,ty+3,1,1,'#9A6A55');}}
    else{const col=pick(cols);f(x,y,w,h,col);f(x,y+h,w,1,'#D9C2CF');for(let yy=y+2;yy<y+h-1;yy+=3)for(let xx=x+2;xx<x+w-1;xx+=3)f(xx,yy,1,1,'#FFFFFF');}}
  // ruas
  const draw=(pts,w,col,edge,dash)=>{const s=sample(pts);if(edge)s.forEach(p=>f(p[0]-w/2-1,p[1]-w/2-1,w+2,w+2,edge));s.forEach(p=>f(p[0]-w/2,p[1]-w/2,w,w,col));
    if(dash)s.forEach((p,i)=>{if(Math.floor(i/4)%2===0)f(p[0],p[1],1,1,dash);});};
  ['m1','m2','m3','m4'].forEach(k=>draw(ROADS[k],5,'#FFFFFF','#E2CBD6'));
  draw(ROADS.colibris,6,'#FFFFFF','#D6B9C6');
  draw(ROADS.arN,10,'#F4ECEF','#C9AABA','#F2A7B8');draw(ROADS.arS,10,'#F4ECEF','#C9AABA','#F2A7B8');
  // retorno da Rua das Araras
  for(let a=-Math.PI/2;a<=Math.PI/2;a+=.03){const x=384+Math.cos(a)*9,y=61+Math.sin(a)*9;f(x-6,y-6,12,12,'#C9AABA');}
  for(let a=-Math.PI/2;a<=Math.PI/2;a+=.03){const x=384+Math.cos(a)*9,y=61+Math.sin(a)*9;f(x-5,y-5,10,10,'#F4ECEF');}
  draw(ROADS.jayme,11,'#F4ECEF','#C9AABA','#F2A7B8');
  // lugares de vocês
  drawScene(c,'casa',392,140,1,true);drawScene(c,'val',392,206,1,true);drawScene(c,'quintas',60,75,1,true);
  // corações espalhados
  [[30,30],[140,200],[300,250],[430,110],[240,120],[20,220]].forEach(([x,y])=>{if(!free(x,y,7,6,2))return;
    HEART.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch!=='.')f(x+i,y+j,1,1,ch==='w'?'#FFFFFF':'#E8577D');}));});
}
function nodeDone(i){const n=NODES[i];if(n.k==='f')return au(n.n).ok;if(n.k==='c')return ch(n.n).done;return S.sim.best!==null;}
function nodeOpen(i){return i===0||nodeDone(i-1);}
function nextNode(){for(let i=0;i<NODES.length;i++)if(!nodeDone(i))return i;return NODES.length-1;}
const carImg=(()=>{const c=document.createElement('canvas');c.width=12;c.height=9;const x=c.getContext('2d');
  const r=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};r(2,0,8,3,'#E8577D');r(0,3,12,4,'#E8577D');r(3,1,2,2,'#E8F7FD');r(7,1,2,2,'#E8F7FD');r(1,7,3,2,'#3A2233');r(8,7,3,2,'#3A2233');r(5,0,2,1,'#FFD36E');return c.toDataURL();})();

/* ================= DOMÍNIO ================= */
function topicStat(t){let seen=0,ok=0;t.qs.forEach(id=>{const s=S.qs[id];if(s){seen++;ok+=s[2];}});
  const nb=t.qs.filter(id=>S.nb[id]).length,cov=Math.min(1,seen/Math.min(8,t.qs.length));
  let dom=seen?Math.round(100*(ok/seen)*cov):0;if(nb&&dom>79)dom=79;const lv=!seen?0:dom>=80?3:dom>=50?2:1;
  return {seen,ok,nb,dom,lv,total:t.qs.length};}
const LVN=['Ainda não praticado','Reforçar','Quase lá','Dominado'];

/* ================= RESPOSTAS + CADERNO DE ERROS ================= */
function record(id,ok){const s=S.qs[id]||[0,0,0,0];s[0]++;if(ok)s[1]++;s[2]=ok?1:0;s[3]=S.sess;S.qs[id]=s;
  const n=S.nb[id];if(!ok)S.nb[id]={lv:0,due:S.sess+1,ls:S.sess};
  else if(n&&n.ls!==S.sess){n.lv++;n.ls=S.sess;n.due=S.sess+2;if(n.lv>=2)delete S.nb[id];}}

/* ================= TOPO ================= */
function hud(){
  const hearts=Object.values(S.au).reduce((a,x)=>a+(x.stars||0),0),bro=Object.values(S.ch).filter(x=>x.selo).length;
  $('hud').innerHTML=`<button class="logo" data-act="title" aria-label="Tela inicial"><img class="sway" src="${BOW}" alt="" style="width:34px;height:21px;image-rendering:pixelated">Rumo à CNH</button>
   <span class="chip h"><img class="pxi" src="${HEART_ON}" alt="">${hearts}/24</span><span class="chip b"><img class="pxi" src="${BROOCH}" alt="">${bro}/4 broches</span>
   <span class="spacer"></span>
   <button class="btn sm soft2" data-act="map">Mapa</button>
   <button class="btn sm soft2" data-act="reforco" ${TP.some(taught)?'':'disabled'}>Reforço</button>
   <button class="btn sm" data-act="painel">Domínio</button>
   <button class="btn sm" data-act="mute" aria-pressed="${!S.mute}" aria-label="${S.mute?'Ligar o som':'Desligar o som'}" title="${S.mute?'Som desligado':'Som ligado'}" style="width:46px;padding:0;display:inline-flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/>${S.mute?'<path d="m16 9 5 6M21 9l-5 6"/>':'<path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'}</svg></button>
   <button class="btn sm" data-act="opcoes">Opções</button>`;
}
function show(html){$('screen').innerHTML=html;window.scrollTo(0,0);hud();talk();}

/* ================= TELA INICIAL (cena animada) ================= */
let anim=null;
function scrTitle(){
  const started=Object.keys(S.qs).length>0||TP.some(taught);
  show(`<div class="box bow title"><h1>Rumo à CNH</h1><p class="sub">a jornada da aluna mais linda</p>
    <canvas class="px scene" id="tscene" role="img" aria-label="Cena animada: Bruno acenando em frente ao prédio, com o carrinho rosa passando na rua"></canvas>
    ${guideHTML(pick(F.titulo))}
    <div class="row" style="justify-content:center;margin-top:10px"><button class="btn go" data-act="map">${started?'Continuar a jornada':'Começar a jornada'}</button>
    ${started?'<button class="btn soft2" data-act="reforco">Fazer um Reforço</button>':''}</div>
    <p class="small">Feito com carinho pelo Bruno, com o conteúdo oficial do curso CNH do Brasil.</p></div>`);
  const cv=$('tscene');cv.width=320;cv.height=150;const c=cv.getContext('2d');const t0=performance.now();
  const clouds=[[20,18],[140,30],[250,12]];
  cancelAnimationFrame(anim);
  const frame=now=>{if(!cv.isConnected)return;const t=(now-t0)/1000;
    const f=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
    ['#FFE3EA','#FFE9EE','#FFF0F3','#FFF4F6','#FFF8F9'].forEach((col,i)=>f(0,i*22,320,22,col));
    f(260,14,16,16,'#FFE7A6');f(258,18,20,8,'#FFE7A6');
    clouds.forEach(([x,y],i)=>{const cx=((x+t*(6+i*3))%380)-40;f(cx+6,y,22,4,'#fff');f(cx,y+4,36,6,'#fff');});
    f(0,110,320,40,'#F4ECEF');f(0,118,320,1,'#FFD36E');f(0,119,320,31,'#D8D2DA');for(let x=0;x<320;x+=16)f(x+((t*40)%16),133,8,2,'#F2A7B8');
    for(let x=0;x<320;x+=40){f(x+4,92,14,18,'#F4D3DE');f(x+4,92,14,1,'#E8577D');}
    drawScene(c,'casa',124,62,1,true);
    drawSprite(c,Math.floor(t*2)%2?BRUNO_WAVE:BRUNO,204,99,1);
    const carX=((t*55)%380)-30;f(carX+2,124,16,4,'#E8577D');f(carX,128,20,5,'#E8577D');f(carX+5,125,3,3,'#E8F7FD');f(carX+12,125,3,3,'#E8F7FD');f(carX+2,133,4,3,'#3A2233');f(carX+14,133,4,3,'#3A2233');
    for(let k=0;k<3;k++){const p=((t*.6+k/3)%1);const hx=212+Math.sin((t+k)*3)*4,hy=96-p*40;c.globalAlpha=1-p;
      HEART.forEach((r,j)=>[...r].forEach((chh,i)=>{if(chh!=='.')f(hx+i,hy+j,1,1,chh==='w'?'#fff':'#E8577D');}));c.globalAlpha=1;}
    anim=requestAnimationFrame(frame);};
  anim=requestAnimationFrame(frame);
}

/* ================= TELA DO MAPA ================= */
function scrMap(){
  const nx=nextNode();
  const pc=(x,y)=>`left:${(x/4.8).toFixed(2)}%;top:${(y/2.7).toFixed(2)}%`;
  const labels=[[422,100,'Região 1<br>'+D.mods[0].nome],[262,252,'Região 2<br>'+D.mods[1].nome],[104,190,'Região 3<br>'+D.mods[2].nome],[262,30,'Região 4<br>'+D.mods[3].nome]]
    .map(([x,y,t])=>`<div class="rlabel" style="${pc(x,y)}">${t}</div>`).join('');
  const streets=[[300,236,'R. Jayme Sapolnik',-8],[150,120,'R. Jayme Sapolnik',-90],[200,61,'Rua das Araras',0],[318,104,'Tv. dos Colibris',38]]
    .map(([x,y,t,r])=>`<div class="slabel" style="${pc(x,y)};transform:translate(-50%,-50%) rotate(${r}deg)">${t}</div>`).join('');
  const places=[[452,134,'Casa'],[452,266,'Val'],[96,138,'Quintas'],[196,252,'Tchuras']].map(([x,y,t])=>`<div class="plabel" style="${pc(x,y)}">${t}</div>`).join('');
  const bowSvg='<svg viewBox="0 0 14 9" shape-rendering="crispEdges" aria-hidden="true"><path d="M0 1h2v1h2v1h2v3H4v1H2v1H0zM14 1h-2v1h-2v1H8v3h2v1h2v1h2z" fill="#E58FA8"/><path d="M6 3h2v3H6z" fill="#B3264A"/></svg>';
  const ringSvg='<svg viewBox="0 0 7 7" shape-rendering="crispEdges" aria-hidden="true"><path d="M3 0h1v2h3v1H6v1H5v1h1v2H5V6H2v1H1V5h1V4H1V3H0V2h3z" fill="#8E6CC8"/></svg>';
  const nodes=NODES.map((n,i)=>{const open=nodeOpen(i),done=nodeDone(i);
    const cls=['node',n.k==='c'?'boss':n.k==='s'?'final':'',done?'done':'',open?'':'locked',i===nx&&open&&!done?'cur':'',S.sel===i?'sel':''].join(' ');
    const lab=n.k==='f'?n.n:n.k==='c'?bowSvg:ringSvg;
    const st=n.k==='f'&&au(n.n).stars?`<span class="st">${(`<img src="${HEART_ON}" alt="">`).repeat(au(n.n).stars)}</span>`:n.k==='c'&&ch(n.n).selo?`<span class="st"><img src="${BROOCH}" alt=""></span>`:'';
    const name=n.k==='f'?'Fase '+n.n:n.k==='c'?'Chefe: '+BOSS[n.n-1]:'Simulado final no Quintas';
    return `<button class="${cls}" style="${pc(n.x,n.y)}" data-act="sel" data-arg="${i}" aria-label="${name}${open?'':' (bloqueado)'}">${lab}${st}</button>`;}).join('');
  const cur=NODES[nx];
  show(`<div class="mapwrap"><canvas class="px" id="map" role="img" aria-label="Mapa do bairro em pixel art, da Casa ao Quintas"></canvas>
    <img class="cloud" src="${CLOUD}" alt="" style="top:8%"><img class="cloud" src="${CLOUD}" alt="" style="top:40%;animation-duration:64s;animation-delay:-30s;width:7%">
    ${streets}${labels}${places}<div class="car" style="${pc(cur.x,cur.y)}"><canvas class="px" id="car"></canvas></div>${nodes}</div><div id="panel"></div>`);
  drawMap($('map'));const ci=new Image();ci.onload=()=>{const c=$('car');if(!c)return;c.width=12;c.height=9;c.getContext('2d').drawImage(ci,0,0);};ci.src=carImg;
  panel(S.sel);
  if(!S.tut)tutorial(0);
}
function sceneCanvas(kind){return `<canvas class="px scn" data-scene="${kind}" role="img" aria-label="${kind}"></canvas>`;}
function paintScenes(){document.querySelectorAll('canvas[data-scene]').forEach(cv=>{cv.width=72;cv.height=56;drawScene(cv.getContext('2d'),cv.dataset.scene,0,0,1,false);});}
function panel(i){
  S.sel=i;save();document.querySelectorAll('.node').forEach((b,k)=>b.classList.toggle('sel',k===i));
  const n=NODES[i],open=nodeOpen(i);let h='',say='';
  if(n.k==='f'){const A=D.aulas[n.n-1],s=au(n.n),cont=S.run&&S.run.type==='desafio'&&S.run.aula===n.n;
    say=open?F.aula[n.n]:'Essa parada ainda tá fechada, amor. Termina a anterior que eu libero.';
    h=`<span class="tag">Fase ${n.n} · Região ${A.m}: ${esc(D.mods[A.m-1].nome)}</span><h2>${esc(A.nome)}</h2>
     <p class="small">${TP.filter(t=>t.a===n.n).length} cartões de Estudo · ${D.jor[n.n].length} perguntas no Desafio</p>
     <div class="hearts" style="justify-content:flex-start">${[1,2,3].map(k=>hImg(s.stars>=k)).join('')}</div>
     ${open?`<div class="row"><button class="btn ${s.st?'':'go'}" data-act="study" data-arg="${n.n}">${s.st?'Rever o Estudo':'Estudar'}</button>
      <button class="btn ${s.st?'go':''}" data-act="desafio" data-arg="${n.n}" ${s.st?'':'disabled'}>${cont?'Continuar o Desafio':s.ok?'Refazer o Desafio':'Desafio'}</button></div>
      ${s.st?'':'<p class="small">Conclua o Estudo para liberar o Desafio.</p>'}`:''}`;
  }else if(n.k==='c'){const c=ch(n.n);say=open?F.boss[n.n]:'O chefe só abre depois das duas fases da região.';
    h=`<span class="tag">Chefe da Região ${n.n}</span><h2>${BOSS[n.n-1]}</h2>${n.n===1?sceneCanvas('val'):''}
     <p>${BOSSDESC[n.n-1]}. Mini-simulado de 15 questões da parte “Teste seus conhecimentos” do Módulo ${n.n}. Acerte 11 (70%) e ganhe o broche da região.</p>
     ${c.done?`<p class="small">Melhor resultado: ${c.best}/15${c.selo?' · broche conquistado':''}</p>`:''}
     ${open?`<button class="btn go" data-act="chefe" data-arg="${n.n}">${c.done?'Enfrentar de novo':'Enfrentar o chefe'}</button>`:''}`;
  }else{say=open?'Chegamos no Quintas, amor! É o simulado final. Respira, você está pronta.':'O Quintas abre depois dos quatro chefes. Tô te esperando lá!';
    h=`<span class="tag">Destino final</span><h2>Simulado no Quintas</h2>${sceneCanvas('quintas')}
     <p>30 questões de todos os módulos, com dificuldade equilibrada. Para passar: 21 acertos (70%).</p>
     ${S.sim.best!==null?`<p class="small">Melhor resultado: ${S.sim.best}/30</p>`:''}
     ${open?`<button class="btn go" data-act="simulado">${S.sim.best!==null?'Fazer outro simulado':'Começar o simulado'}</button>`:''}`;}
  $('panel').innerHTML=`<div class="box bow">${guideHTML(say)}<div style="margin-top:14px">${h}</div></div>`;talk();paintScenes();
}
function tutorial(step){
  overlay(`<div class="box bow">${guideHTML(F.tut[step])}<div class="row" style="justify-content:flex-end;margin-top:12px">
    ${step<F.tut.length-1?`<button class="btn sm" data-act="tutEnd">Pular</button><button class="btn go" data-act="tut" data-arg="${step+1}">Próximo</button>`:`<button class="btn go" data-act="tutEnd">Vamos lá!</button>`}</div></div>`);
}

/* ================= ESTUDO: cartões em grid ================= */
let ST={aula:1,i:0};
function visual(v,line){
  if(v&&v.startsWith('P:'))return v.slice(2).split('|').map(c=>plateSVG(c,'Placa '+(PLACAS[c]?PLACAS[c][0]:c))).join('');
  if(v&&v.startsWith('I:'))return iluSVG(v.slice(2),'Ilustração');
  let m=/^(19\d) — /.exec(line);if(m)return `<span class="num">${m[1]}</span>`;
  m=/^(Leve|Média|Grave|Gravíssima): (\d) pontos/.exec(line);
  if(m){const col={Leve:'#6FA8DC',Média:'#E8A317',Grave:'#E9603F',Gravíssima:'#B3264A'}[m[1]];return `<span class="pts" style="background:${col}">${m[2]} pts</span>`;}
  return `<span class="ic">${icoSVG(iconFor(line))}</span>`;
}
function cardHTML(line,v){
  let title='',text=line;const m=/^([^:]{2,52}):\s(.+)$/.exec(line);
  if(m&&!/^\d/.test(line)){title=m[1];text=m[2].charAt(0).toUpperCase()+m[2].slice(1);}
  const n=/^(19\d) — ([^:]+): (.+)$/.exec(line);if(n){title=n[2];text=n[3];}
  return `<div class="mc"><div class="vis">${visual(v,line)}</div>${title?`<b>${esc(title)}</b>`:''}<span>${esc(text)}</span></div>`;
}
function gallery(t){
  const fam=t.id==='plc_regul'?(c=>c.startsWith('R-')):t.id==='plc_advert'?(c=>c.startsWith('A-')):t.id==='plc_indic'?(c=>!/^[RA]-/.test(c)):null;
  if(!fam)return '';const cs=Object.keys(PLACAS).filter(fam);
  return `<h3>Todas as placas desta família que aparecem no Banco</h3><div class="gal">${cs.map(c=>`<button data-act="zoomPlate" data-arg="${c}">${plateSVG(c,PLACAS[c][0])}<b>${c}</b>${esc(PLACAS[c][0])}</button>`).join('')}</div>`;
}
function scrStudy(a,i){
  ST={aula:a,i:i||0};const tps=TP.filter(t=>t.a===a),t=tps[ST.i],A=D.aulas[a-1];
  const say=ST.i===0?F.aula[a]:ST.i===tps.length-1?F.lastCard:pick(F.card);
  show(`<div class="box bow">${guideHTML(say)}</div>
   <div class="box"><span class="tag">Fase ${a} · Estudo · cartão ${ST.i+1} de ${tps.length}</span>
    <h2>${t.ap?'<span class="badge">Aprofundamento</span>':''}${esc(t.t)}</h2>
    <div class="grid">${t.c.map((l,k)=>cardHTML(l,(t.v||[])[k])).join('')}</div>
    ${gallery(t)}
    ${t.sm?`<details><summary>Saiba mais</summary><p>${esc(t.sm.tx)}</p><p class="small">${esc(t.sm.it)}</p></details>`:''}
    ${t.ap?'<p class="small">Cartão criado a partir da apostila, porque o Banco cobra este tema.</p>':''}</div>
   <div class="row"><button class="btn" data-act="stPrev" ${ST.i===0?'disabled':''}>Voltar</button><span class="spacer"></span>
    ${ST.i<tps.length-1?'<button class="btn go" data-act="stNext">Próximo cartão</button>':'<button class="btn go" data-act="stEnd">Concluir o Estudo e ir ao Desafio</button>'}</div>`);
}

/* ================= QUIZ ================= */
function startRun(type,queue,extra){S.sess++;S.run=Object.assign({type,queue,pos:0,first:{},correct:0,answered:0,last:null,opts:null},extra||{});save();SFX.page();renderQ();}
function renderQ(){
  const r=S.run,id=r.queue[r.pos],q=Q[id];
  if(!r.opts||r.opts.key!==id+'@'+r.pos)r.opts={key:id+'@'+r.pos,o:shuffle([q.a].concat(q.w))};
  const distinct=new Set(r.queue).size,doneN=Object.keys(r.first).length;
  const head=r.type==='desafio'?`Fase ${r.aula} · Desafio`:r.type==='chefe'?`Chefe: ${BOSS[r.mod-1]}`:r.type==='simulado'?'Simulado no Quintas':'Reforço';
  const prog=r.type==='desafio'?`${doneN} de ${distinct} respondidas`:`Pergunta ${r.pos+1} de ${r.queue.length}`;
  const pct=Math.round(100*r.pos/r.queue.length);
  let fb='';
  if(r.last){const ok=r.last.ok;
    fb=`<div class="fb ${ok?'ok':''} pop"><p class="tag">${ok?'Resposta certa!':'Resposta incorreta. A certa está em verde.'}</p>
      <p><b>Comentário oficial:</b> ${esc(q.k)}</p>
      ${!ok&&r.type==='desafio'?'<p class="small">Essa pergunta volta mais tarde nesta fase.</p>':''}
      ${!ok&&r.type!=='desafio'?'<p class="small">Anotada no caderno de erros para o Reforço.</p>':''}
      <button class="btn go" data-act="next">${r.pos+1>=r.queue.length?'Ver resultado':'Continuar'}</button></div>`;}
  const say=r.last?(r.last.ok?pick(F.ok):pick(F.no)):(r.pos===0?pick(F.q0):pick(F.qn));
  const codes=q.s?q.s.split(/\s+e\s+/).filter(c=>PLACAS[c]):[];
  show(`<div class="box bow">${guideHTML(say)}</div>
   <div class="box">
    <div class="row"><span class="tag">${head}</span><span class="spacer"></span><span class="small">${prog} · ${DIF[q.d]}</span></div>
    <div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
    <p class="qtext">${esc(q.q)}</p>
    ${codes.length?`<div class="qimg">${codes.map(c=>plateSVG(c,'Placa da questão')).join('')}</div>`:''}
    <div class="opts ${r.last&&!r.last.ok?'shake':''}">${r.opts.o.map((o,i)=>{let cl='opt';if(r.last){if(o===q.a)cl+=' right';else if(i===r.last.i)cl+=' wrong';}
      return `<button class="${cl}" data-act="ans" data-arg="${i}" ${r.last?'disabled':''}><b>${'ABCD'[i]}</b><span>${esc(o)}</span></button>`;}).join('')}</div>
    ${fb}</div>
   <div class="row"><button class="btn sm" data-act="quit">Sair e voltar ao mapa</button><span class="small">${r.type==='desafio'?'Seu progresso nesta fase fica salvo.':''}</span></div>`);
  if(r.last){const b=document.querySelector('[data-act="next"]');if(b)b.focus({preventScroll:true});}
}
function answer(i){const r=S.run;if(!r||r.last)return;const q=Q[r.queue[r.pos]],ok=r.opts.o[i]===q.a;
  record(q.id,ok);r.answered++;if(!(q.id in r.first))r.first[q.id]=ok;if(ok)r.correct++;
  if(!ok&&r.type==='desafio'){r.queue.splice(Math.min(r.pos+4,r.queue.length),0,q.id);}
  r.last={i,ok};save();ok?(SFX.ok(),rain(6)):SFX.no();renderQ();}
function next(){const r=S.run;r.pos++;r.last=null;r.opts=null;save();if(r.pos>=r.queue.length)finish();else{SFX.click();renderQ();}}
function rain(n){if(reduce)return;const box=$('rain');for(let k=0;k<n;k++){const im=document.createElement('img');im.src=HEART_ON;im.style.left=(Math.random()*96)+'%';
  im.style.animationDelay=(Math.random()*.6)+'s';im.style.animationDuration=(2.2+Math.random()*1.4)+'s';box.appendChild(im);setTimeout(()=>im.remove(),4200);}}
function finish(){
  const r=S.run;S.run=null;let h='',say='',party=false;
  const firstOk=Object.values(r.first).filter(Boolean).length,N=Object.keys(r.first).length;
  if(r.type==='desafio'){const ratio=firstOk/N,stars=ratio>=.9?3:ratio>=.7?2:1,s=au(r.aula);s.ok=true;s.stars=Math.max(s.stars,stars);
    const nx=nextNode();S.sel=nx;party=true;say=F.fim['fase'+stars];
    h=`<h2>Fase ${r.aula} concluída!</h2><div class="hearts">${[1,2,3].map(k=>hImg(stars>=k)).join('')}</div>
      <p>Acertos de primeira: <b>${firstOk} de ${N}</b>.</p><p class="small">3 corações: 90% ou mais de primeira · 2 corações: 70% ou mais.</p>`;}
  else if(r.type==='chefe'){const c=ch(r.mod);c.done=true;c.best=Math.max(c.best,r.correct);const pass=r.correct>=11;if(pass)c.selo=true;party=pass;
    S.sel=Math.min(NODES.length-1,NODES.findIndex(n=>n.k==='c'&&n.n===r.mod)+1);say=pass?F.fim.bossOk:F.fim.bossNo;
    h=`<h2>${pass?'Chefe vencido!':'Quase lá!'}</h2>${pass?`<img src="${BROOCH}" alt="Broche" style="width:64px;height:48px;image-rendering:pixelated">`:''}<p class="big">${r.correct}/15</p>
      <p>${pass?`Broche da Região ${r.mod} conquistado: ${esc(D.mods[r.mod-1].nome)}.`:'Para o broche são necessários 11 acertos (70%). A próxima região já está liberada.'}</p>`;}
  else if(r.type==='simulado'){const pass=r.correct>=21;S.sim.tries++;S.sim.best=Math.max(S.sim.best||0,r.correct);S.sel=NODES.length-1;party=pass;say=pass?F.fim.simOk:F.fim.simNo;
    h=`<h2>${pass?'Aprovada no simulado!':'Ainda não foi desta vez'}</h2><p class="big">${r.correct}/30 (${Math.round(100*r.correct/30)}%)</p>
      <p>${pass?'Você atingiu o mínimo de 70%.':'O mínimo é 70% (21 acertos). O Reforço ajuda a treinar os pontos fracos.'}</p>
      <p class="small">A apostila exige no mínimo 70% de acertos, mas não informa quantas questões a prova real tem; por isso este simulado usa 30.</p>`;}
  else{say=F.fim.ref;h=`<h2>Sessão de Reforço concluída</h2><p class="big">${r.correct}/${r.queue.length}</p>
      <p>Itens no caderno de erros agora: <b>${Object.keys(S.nb).length}</b>. Uma pergunta sai do caderno depois de acertos em duas sessões diferentes.</p>`;}
  save();party?(SFX.win(),rain(28)):SFX.page();
  show(`<div class="box bow" style="text-align:center">${guideHTML(say)}<div class="pop" style="margin-top:12px">${h}</div>
    <div class="row" style="justify-content:center"><button class="btn go" data-act="map">Voltar ao mapa</button>
    <button class="btn soft2" data-act="reforco">Fazer um Reforço</button><button class="btn" data-act="painel">Ver domínio</button></div></div>`);
}
function bossQueue(m){
  let pool=Object.values(Q).filter(q=>q.p===2&&q.m===m&&TP[q.t].a<=2*m).map(q=>q.id);
  if(pool.length<15){const jor=new Set([].concat(...Object.values(D.jor)));
    pool=pool.concat(shuffle(Object.values(Q).filter(q=>q.p===1&&q.m===m&&TP[q.t].a<=2*m&&!jor.has(q.id)).map(q=>q.id)).slice(0,15-pool.length));}
  return shuffle(pool).slice(0,15);}
function simQueue(){const per=[8,7,8,7],out=[];
  per.forEach((n,i)=>{const m=i+1,want=n===8?[4,3,1]:[4,2,1];want.forEach((k,d)=>{out.push(...shuffle(Object.values(Q).filter(q=>q.m===m&&q.d===d).map(q=>q.id)).slice(0,k));});});
  return shuffle(out);}
function reforcoPlan(){
  const tps=TP.filter(taught);if(!tps.length)return null;
  const due=Object.keys(S.nb).filter(id=>S.nb[id].due<=S.sess&&taught(TP[Q[id].t])).sort((a,b)=>S.nb[a].lv-S.nb[b].lv);
  const q=shuffle(due).slice(0,5);
  const weak=tps.map(t=>({t,s:topicStat(t)})).sort((a,b)=>(b.s.nb-a.s.nb)||(a.s.dom-b.s.dom)||(a.s.seen-b.s.seen)).slice(0,3).map(x=>x.t);
  const lists=weak.map(t=>shuffle(t.qs.filter(id=>!S.qs[id])).concat(t.qs.filter(id=>S.qs[id]&&!q.includes(id)).sort((a,b)=>(S.qs[a][2]-S.qs[b][2])||(S.qs[a][3]-S.qs[b][3]))));
  let k=0;while(q.length<10&&lists.some(l=>l.length)){const l=lists[k%lists.length];if(l.length){const id=l.shift();if(!q.includes(id))q.push(id);}k++;}
  const cnt={};q.forEach(id=>cnt[Q[id].t]=(cnt[Q[id].t]||0)+1);
  return {q:shuffle(q),review:Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,3).map(Number)};}
let RP=null;
function scrReforco(i){
  if(i===undefined){RP=reforcoPlan();i=0;}
  if(!RP){show(`<div class="box bow">${guideHTML('O Reforço abre depois que você concluir o Estudo da primeira fase, amor.')}<button class="btn go" data-act="map">Ir ao mapa</button></div>`);return;}
  const t=TP[RP.review[i]];
  show(`<div class="box bow">${guideHTML(i===0?F.ref:'Mais um cartão rapidinho.')}</div>
   <div class="box"><span class="tag">Reforço · revisão relâmpago ${i+1} de ${RP.review.length} · ${esc(D.aulas[t.a-1].nome)}</span>
   <h2>${t.ap?'<span class="badge">Aprofundamento</span>':''}${esc(t.t)}</h2><div class="grid">${t.c.map((l,k)=>cardHTML(l,(t.v||[])[k])).join('')}</div></div>
   <div class="row"><span class="small">Sessão de ${RP.q.length} perguntas, priorizando o caderno de erros (${Object.keys(S.nb).length} itens) e os tópicos mais fracos.</span><span class="spacer"></span>
   ${i<RP.review.length-1?`<button class="btn go" data-act="rfNext" data-arg="${i+1}">Próximo cartão</button>`:'<button class="btn go" data-act="rfGo">Começar a sessão</button>'}</div>`);
}
function scrPainel(){
  const rows=TP.map(t=>({t,s:topicStat(t),on:taught(t)}));
  const dom=rows.filter(r=>r.s.lv===3).length,tot=TP.length,seenQ=Object.keys(S.qs).length;
  const weak=rows.filter(r=>r.on&&r.s.lv<3).sort((a,b)=>a.s.dom-b.s.dom).slice(0,5);const col=['#C9C2CF','#B3264A','#E8A317','#2E8A55'];
  let html=`<div class="box bow">${guideHTML(F.dom)}<h2 style="margin-top:14px">Domínio por tópico</h2>
   <p>Você domina <b>${dom} de ${tot}</b> tópicos (${Math.round(100*dom/tot)}%). Já respondeu <b>${seenQ} de ${D.q.length}</b> questões do Banco. Caderno de erros: <b>${Object.keys(S.nb).length}</b>.</p>
   <p class="small">Pronta para a prova = todos os tópicos “Dominado”: pelo menos 80% de respostas certas, com prática suficiente e nada pendente no caderno de erros.</p>
   ${weak.length?`<p><b>O que falta agora:</b> ${weak.map(r=>esc(r.t.t)).join('; ')}.</p>`:''}
   <button class="btn go" data-act="reforco" ${TP.some(taught)?'':'disabled'}>Treinar no Reforço</button></div>
   <div class="box scroll"><table><thead><tr><th>Tópico</th><th>Domínio</th><th>Situação</th><th>Vistas</th><th>Caderno</th></tr></thead><tbody>`;
  D.aulas.forEach(A=>{html+=`<tr><th colspan="5" style="background:var(--blush)">Fase ${A.n}: ${esc(A.nome)}${au(A.n).st?'':' (estudo ainda não feito)'}</th></tr>`;
    rows.filter(r=>r.t.a===A.n).forEach(r=>{html+=`<tr><td>${esc(r.t.t)}</td><td><div class="mini" aria-label="${r.s.dom}%"><i style="width:${r.s.dom}%;background:${col[r.s.lv]}"></i></div></td>
      <td class="lvl lv${r.s.lv}">${LVN[r.s.lv]} ${r.s.seen?r.s.dom+'%':''}</td><td>${r.s.seen}/${r.s.total}</td><td>${r.s.nb||''}</td></tr>`;});});
  show(html+'</tbody></table></div>');
}
function scrOpcoes(msg){
  show(`<div class="box bow"><h2>Opções</h2>${msg?`<p class="soft">${esc(msg)}</p>`:''}
   <p>O progresso fica salvo neste navegador. Faça um backup de vez em quando para não perder nada.</p>
   <div class="row"><button class="btn" data-act="export">Exportar backup</button><button class="btn" data-act="import">Importar backup</button></div>
   <div class="row"><button class="btn soft2" data-act="mute">${S.mute?'Ligar o som':'Desligar o som'}</button><button class="btn soft2" data-act="tutAgain">Ver o tutorial de novo</button></div>
   <div class="row"><button class="btn" data-act="reset">Apagar todo o progresso</button></div>
   <p class="small">Conteúdo: módulos, apostila e Banco Nacional de Questões do curso CNH do Brasil (Ministério dos Transportes / Senatran). Placas redesenhadas em vetor a partir do padrão oficial.</p></div>`);
}
function doExport(){const b=new Blob([JSON.stringify(S)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='rumo-a-cnh-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);scrOpcoes('Backup exportado. Guarde o arquivo em um lugar seguro.');}
$('fileIn').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();
  rd.onload=()=>{try{const x=JSON.parse(rd.result);if(!x||x.v!==1||!x.qs)throw 0;S=Object.assign(blank(),x);save();scrOpcoes('Backup importado com sucesso.');}
    catch(err){scrOpcoes('Este arquivo não é um backup válido do Rumo à CNH.');}e.target.value='';};rd.readAsText(f);});
function overlay(html){$('ovbox').innerHTML=html;$('ov').classList.add('on');talk();const b=$('ovbox').querySelector('.btn');if(b)b.focus();}
function closeOv(){$('ov').classList.remove('on');$('ovbox').innerHTML='';}
$('ov').addEventListener('click',e=>{if(e.target.id==='ov'&&!$('ovbox').querySelector('[data-act="tut"],[data-act="tutEnd"]'))closeOv();});

/* ================= AÇÕES ================= */
const ACT={
 title:()=>{closeOv();scrTitle();},map:()=>{closeOv();scrMap();},sel:a=>{SFX.click();panel(+a);},
 study:a=>{SFX.page();scrStudy(+a,0);},stNext:()=>{SFX.page();scrStudy(ST.aula,ST.i+1);},stPrev:()=>{SFX.page();scrStudy(ST.aula,ST.i-1);},
 stEnd:()=>{au(ST.aula).st=true;save();SFX.ok();ACT.desafio(ST.aula);},
 desafio:a=>{a=+a;if(S.run&&S.run.type==='desafio'&&S.run.aula===a){renderQ();return;}startRun('desafio',D.jor[a].slice(),{aula:a});},
 chefe:a=>startRun('chefe',bossQueue(+a),{mod:+a}),simulado:()=>startRun('simulado',simQueue()),
 ans:a=>answer(+a),next:()=>next(),quit:()=>{if(S.run&&S.run.type!=='desafio')S.run=null;save();scrMap();},
 reforco:()=>{SFX.page();scrReforco();},rfNext:a=>{SFX.page();scrReforco(+a);},rfGo:()=>startRun('reforco',RP.q),
 painel:()=>{SFX.page();scrPainel();},opcoes:()=>{SFX.page();scrOpcoes();},
 mute:()=>{S.mute=!S.mute;save();hud();const o=document.querySelector('.box h2');if(o&&o.textContent==='Opções')scrOpcoes();},
 export:doExport,import:()=>$('fileIn').click(),
 reset:()=>overlay(`<div class="box"><h2>Apagar tudo?</h2><p>Isso apaga corações, broches, estatísticas e o caderno de erros deste navegador.</p>
   <div class="row"><button class="btn" data-act="closeOv">Cancelar</button><button class="btn go" data-act="resetYes">Apagar</button></div></div>`),
 resetYes:()=>{S=blank();save();closeOv();scrTitle();},closeOv:closeOv,
 zoomPlate:c=>overlay(`<div class="box" style="text-align:center"><div style="width:240px;height:240px;margin:0 auto">${plateSVG(c,PLACAS[c][0])}</div>
   <p class="tag" style="margin-top:10px">${c}</p><h3>${esc(PLACAS[c][0])}</h3><button class="btn go" data-act="closeOv">Fechar</button></div>`),
 tut:a=>{SFX.click();tutorial(+a);},tutEnd:()=>{S.tut=true;save();closeOv();},tutAgain:()=>{S.tut=false;save();scrMap();},
 skipSay:skipSay,
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const f=ACT[b.dataset.act];if(f){e.preventDefault();f(b.dataset.arg);}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&$('ov').classList.contains('on')&&!$('ovbox').querySelector('[data-act="tut"]'))closeOv();
  if(S.run&&!S.run.last&&$('screen').querySelector('.opts')&&!$('ov').classList.contains('on')){const k=e.key.toLowerCase();const i='1234'.indexOf(k)>=0?'1234'.indexOf(k):'abcd'.indexOf(k);if(i>=0)answer(i);}
});
scrTitle();
})();
