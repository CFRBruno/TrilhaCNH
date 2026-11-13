const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'..','dist','rumo-a-cnh.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/x.html',
 beforeParse(w){w.HTMLCanvasElement.prototype.getContext=function(){return {fillRect(){},clearRect(){},drawImage(){},fillStyle:'',globalAlpha:1}};w.HTMLCanvasElement.prototype.toDataURL=()=>'data:,';
  w.scrollTo=()=>{};w.AudioContext=undefined;w.URL.createObjectURL=()=>'blob:x';w.URL.revokeObjectURL=()=>{};}});
const w=dom.window,d=w.document;
const errs=[];w.addEventListener('error',e=>errs.push(e.message));
const click=sel=>{const b=d.querySelector(sel);if(!b)throw new Error('sem '+sel+' em '+d.getElementById('screen').textContent.slice(0,200));b.click();};
const txt=()=>d.getElementById('screen').textContent;
click('[data-act="map"]');                       // título -> mapa (tutorial)
for(let i=0;i<4;i++){const b=d.querySelector('#ovbox [data-act="tut"]')||d.querySelector('#ovbox [data-act="tutEnd"]');if(b)b.click();}
const D=JSON.parse(d.getElementById('data').textContent);
const Qa={};D.q.forEach(r=>Qa[r[5]+'|'+r[0]]=r);
const byText={};D.q.forEach(r=>byText[r[5]]=r[6]);
function playRun(maxSteps,mode){let n=0,seen=new Set();
  while(d.querySelector('.opts')&&n<maxSteps){n++;
    const R=JSON.parse(w.localStorage.getItem('rumo_a_cnh_v1')).run;const qid=R.queue[R.pos];const q=qid+'@'+R.pos;const right=D.q.find(r=>r[0]===qid)[6];
    const opts=[...d.querySelectorAll('.opt')];
    let idx=opts.findIndex(o=>o.querySelector('span').textContent===right);
    if(mode==='wrongfirst'&&!seen.has(qid)){seen.add(qid);idx=(idx+1)%4;}
    opts[idx].click();click('[data-act="next"]');}
  return n;}
for(let f=1;f<=8;f++){
  // fase f
  const ni=[0,1,3,4,6,7,9,10][f-1];
  d.querySelectorAll('.node')[ni].click(); click('[data-act="study"]');
  let c=0;while(d.querySelector('[data-act="stNext"]')){click('[data-act="stNext"]');c++;}
  click('[data-act="stEnd"]');
  const steps=playRun(400,f===1?'wrongfirst':'');
  console.log('fase',f,'cartões',c+1,'respostas',steps,'|',txt().match(/Acertos de primeira: \d+ de \d+/)[0]);
  click('[data-act="map"]');
  if(f%2===0){const m=f/2;d.querySelectorAll('.node')[[2,5,8,11][m-1]].click();click('[data-act="chefe"]');const s=playRun(50);console.log(' chefe',m,s,txt().match(/\d+\/15/)[0]);click('[data-act="map"]');}
}
d.querySelectorAll('.node')[12].click();click('[data-act="simulado"]');console.log('simulado',playRun(40),txt().match(/\d+\/30/)[0]);
click('[data-act="map"]');click('#hud [data-act="reforco"]');
while(d.querySelector('[data-act="rfNext"]'))click('[data-act="rfNext"]');click('[data-act="rfGo"]');console.log('reforço',playRun(20,'wrongfirst'));
click('#hud [data-act="painel"]');console.log(txt().slice(0,260));
// placas: verifica que todas as questões com código mostram imagem quando necessário
const st=JSON.parse(w.localStorage.getItem('rumo_a_cnh_v1'));console.log('vistas',Object.keys(st.qs).length,'caderno',Object.keys(st.nb).length,'sess',st.sess);
// ---- verificações extras ----
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
// dados: ids únicos, 3 erradas por questão, todas as placas citadas existem em vetor
const PL=w.eval('PLACAS'),plate=w.eval('plateSVG');
ok(new Set(D.q.map(r=>r[0])).size===D.q.length,'ids de questão repetidos');
D.q.forEach(r=>{ok(Array.isArray(r[7])&&r[7].length===3&&!r[7].includes(r[6]),'alternativas inválidas em '+r[0]);ok(r[8]&&r[8].length>5,'sem comentário oficial em '+r[0]);
  if(r[9])r[9].split(/\s+e\s+/).forEach(c=>ok(PL[c]&&plate(c).includes('<svg'),'placa sem desenho: '+c+' (questão '+r[0]+')'));});
// caminho de erro: errar no Desafio mostra a certa em verde, comentário oficial e recoloca a pergunta na fila
click('[data-act="map"]');d.querySelectorAll('.node')[0].click();click('[data-act="desafio"]');
{const R0=JSON.parse(w.localStorage.getItem('rumo_a_cnh_v1')).run,len0=R0.queue.length,right=D.q.find(r=>r[0]===R0.queue[R0.pos])[6];
 const opts=[...d.querySelectorAll('.opt')];const bad=opts.findIndex(o=>o.querySelector('span').textContent!==right);opts[bad].click();
 ok(d.querySelector('.opt.right')&&d.querySelector('.opt.wrong'),'erro não marcou certa/errada');
 ok(/Comentário oficial/.test(txt())&&/volta mais tarde/.test(txt()),'faltou comentário/aviso após erro');
 ok(JSON.parse(w.localStorage.getItem('rumo_a_cnh_v1')).run.queue.length===len0+1,'pergunta errada não voltou para a fila');
 ok([...d.querySelectorAll('.opt')].every(o=>o.disabled),'alternativas não travaram após responder');}
click('[data-act="quit"]');
// backup: exportar registra a data
click('#hud [data-act="opcoes"]');ok(/nenhum backup/.test(txt()),'opções deveria avisar que não há backup');
click('[data-act="export"]');ok(JSON.parse(w.localStorage.getItem('rumo_a_cnh_v1')).bk>0&&/Último backup/.test(txt()),'export não registrou a data');
console.log('ERROS',errs);
console.log('FALHAS',fails);
if(errs.length||fails.length)process.exitCode=1;
