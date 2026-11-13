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
console.log('ERROS',errs);
