/* ===================================================================
   BIBLIOTECA VISUAL — placas em vetor, ilustrações, ícones e pixel art
   =================================================================== */
const K='#111111',RD='#D8262F',YL='#FFCC00',BL='#1F5FB8',GR='#0E7A3E',BR='#7A4A2C',WH='#FFFFFF',AS='#4A4652';

/* ---------- utilitários de desenho vetorial ---------- */
function head(x,y,a,s,c){const dx=Math.cos(a),dy=Math.sin(a),px=-dy,py=dx,bx=x-dx*s,by=y-dy*s,h=s*.72;
  return `<polygon points="${x},${y} ${bx+px*h},${by+py*h} ${bx-px*h},${by-py*h}" fill="${c}"/>`;}
function PL(pts,c,w,s){c=c||K;w=w||8;s=s||14;const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1);
  const q=pts.slice(0,-1).concat([[x2-Math.cos(a)*s*.8,y2-Math.sin(a)*s*.8]]);
  return `<polyline points="${q.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`+head(x2,y2,a,s,c);}
function CV(d,x,y,a,c,w,s){c=c||K;return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w||8}" stroke-linejoin="round"/>`+head(x,y,a,s||14,c);}
const LN=(d,c,w)=>`<path d="${d}" fill="none" stroke="${c||K}" stroke-width="${w||12}" stroke-linejoin="round"/>`;
const T=(x,y,s,txt,c,w)=>`<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-weight="${w||700}" font-size="${s}" fill="${c||K}" text-anchor="middle">${txt}</text>`;
const UP=-Math.PI/2,DN=Math.PI/2,LF=Math.PI,RT=0;
/* pictogramas (desenhados numa caixa própria e posicionados com transform) */
const G=(x,y,s,inner)=>`<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const pic={
 carSide:c=>`<path d="M0 14h40v-6l-6-2-5-6H12L7 6 0 8z" fill="${c}"/><path d="M13 1.6h6v4.6H9.5zM21 1.6h6l3.6 4.6H21z" fill="#fff"/><circle cx="8" cy="15" r="3.6" fill="${c}"/><circle cx="32" cy="15" r="3.6" fill="${c}"/>`,
 carRear:c=>`<path d="M4 6 7 0h10l3 6z" fill="${c}"/><rect x="0" y="6" width="24" height="12" rx="3" fill="${c}"/><path d="M7.4 1.8h9.2l1.6 4.2H5.8z" fill="#fff"/><rect x="2" y="9" width="4" height="2.4" fill="#fff"/><rect x="18" y="9" width="4" height="2.4" fill="#fff"/><rect x="2" y="17" width="5" height="5" fill="${c}"/><rect x="17" y="17" width="5" height="5" fill="${c}"/>`,
 truck:c=>`<rect x="0" y="0" width="28" height="18" fill="${c}"/><path d="M30 6h8l5 6v6H30z" fill="${c}"/><path d="M32 8h5l3 4h-8z" fill="#fff"/><circle cx="7" cy="20" r="4" fill="${c}"/><circle cx="19" cy="20" r="4" fill="${c}"/><circle cx="37" cy="20" r="4" fill="${c}"/>`,
 bus:c=>`<rect x="0" y="0" width="30" height="30" rx="4" fill="${c}"/><rect x="3" y="4" width="24" height="11" rx="1.5" fill="#fff"/><rect x="4" y="21" width="5" height="3" fill="#fff"/><rect x="21" y="21" width="5" height="3" fill="#fff"/><rect x="2" y="29" width="6" height="5" fill="${c}"/><rect x="22" y="29" width="6" height="5" fill="${c}"/>`,
 moto:c=>`<circle cx="8" cy="18" r="6.5" fill="none" stroke="${c}" stroke-width="3"/><circle cx="36" cy="18" r="6.5" fill="none" stroke="${c}" stroke-width="3"/><path d="M8 18 17 9h11l8 9" fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/><path d="M15 9h13l-2-4H17z" fill="${c}"/><path d="M29 9l3-7h5" fill="none" stroke="${c}" stroke-width="3"/>`,
 bike:c=>`<g fill="none" stroke="${c}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"><circle cx="8" cy="18" r="7"/><circle cx="36" cy="18" r="7"/><path d="M8 18 17 6h13l6 12M17 6l5 12 8-12M8 18h14M14 3h6M30 6l-2-5h5"/></g>`,
 ped:c=>`<circle cx="13" cy="4.5" r="4.3" fill="${c}"/><g fill="none" stroke="${c}" stroke-linecap="round" stroke-linejoin="round"><path d="M13 10 10.5 25" stroke-width="5.5"/><path d="M10.5 25 4 42M10.5 25l7 9 1.5 8" stroke-width="4.6"/><path d="M12 13 5 22M12 13l8 7" stroke-width="4"/></g>`,
 tractor:c=>`<rect x="14" y="8" width="26" height="10" fill="${c}"/><rect x="4" y="0" width="14" height="12" fill="${c}"/><rect x="7" y="2.5" width="8" height="6" fill="#fff"/><rect x="31" y="1" width="3" height="8" fill="${c}"/><circle cx="12" cy="20" r="10" fill="${c}"/><circle cx="12" cy="20" r="4" fill="#fff"/><circle cx="36" cy="24" r="6" fill="${c}"/>`,
 cow:c=>`<rect x="6" y="6" width="30" height="13" rx="4" fill="${c}"/><path d="M33 3h10v10h-10z" fill="${c}"/><path d="M34 3l-2-3M42 3l2-3" stroke="${c}" stroke-width="2"/><rect x="8" y="17" width="4" height="11" fill="${c}"/><rect x="14" y="17" width="4" height="11" fill="${c}"/><rect x="26" y="17" width="4" height="11" fill="${c}"/><rect x="31" y="17" width="4" height="11" fill="${c}"/><path d="M6 9 1 18" stroke="${c}" stroke-width="2"/>`,
 train:c=>`<rect x="12" y="8" width="26" height="12" fill="${c}"/><rect x="0" y="2" width="14" height="18" fill="${c}"/><rect x="3" y="5" width="7" height="6" fill="#fff"/><rect x="31" y="0" width="6" height="9" fill="${c}"/><path d="M38 12l8 10h-8z" fill="${c}"/><circle cx="6" cy="24" r="5" fill="${c}"/><circle cx="20" cy="24" r="5" fill="${c}"/><circle cx="32" cy="24" r="5" fill="${c}"/>`,
 horn:c=>`<path d="M0 6h10L30 0v20L10 14H0z" fill="${c}"/><path d="M34 4q5 6 0 12" fill="none" stroke="${c}" stroke-width="3"/>`,
 wheel:c=>`<circle cx="20" cy="20" r="20" fill="${c}"/><circle cx="20" cy="20" r="9" fill="#fff"/><circle cx="20" cy="20" r="4" fill="${c}"/>`,
};
const reg=s=>`<circle cx="50" cy="50" r="47" fill="${RD}"/><circle cx="50" cy="50" r="37" fill="${WH}"/>${s}`;
const BAR=`<line x1="23.5" y1="23.5" x2="76.5" y2="76.5" stroke="${RD}" stroke-width="9"/>`;
const adv=s=>`<polygon points="50,2 98,50 50,98 2,50" fill="${K}"/><polygon points="50,7.5 92.5,50 50,92.5 7.5,50" fill="${YL}"/>${s}`;
const sau=s=>`<rect x="3" y="3" width="94" height="94" rx="8" fill="${BL}"/><rect x="8" y="8" width="84" height="84" rx="5" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="20" y="20" width="60" height="60" fill="#fff"/>${s}`;
const tur=s=>`<rect x="3" y="3" width="94" height="94" rx="8" fill="${BR}"/><rect x="8" y="8" width="84" height="84" rx="5" fill="none" stroke="#fff" stroke-width="2.5"/>${s}`;
const roundabout=c=>{let s='';const r=21;for(let i=0;i<3;i++){const a0=i*2.0944+.3,a1=a0-1.55,e=a1+.32;
  s+=`<path d="M${(50+Math.cos(a0)*r).toFixed(1)} ${(50+Math.sin(a0)*r).toFixed(1)}A${r} ${r} 0 0 0 ${(50+Math.cos(e)*r).toFixed(1)} ${(50+Math.sin(e)*r).toFixed(1)}" fill="none" stroke="${c}" stroke-width="7"/>`+head(+(50+Math.cos(a1)*r).toFixed(1),+(50+Math.sin(a1)*r).toFixed(1),a1-Math.PI/2,12,c);}return s;};
const octagon=(r,c)=>{const p=[];for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;p.push((50+r*Math.cos(a)).toFixed(1)+','+(50+r*Math.sin(a)).toFixed(1));}return `<polygon points="${p.join(' ')}" fill="${c}"/>`;};

/* ---------- placas: código -> [nome, desenho] ---------- */
const PLACAS={
 'R-1':['Parada obrigatória',()=>octagon(48,WH)+octagon(44,RD)+T(50,62,30,'PARE',WH)],
 'R-2':['Dê a preferência',()=>`<polygon points="4,8 96,8 50,94" fill="${RD}"/><polygon points="22,19 78,19 50,71" fill="${WH}"/>`],
 'R-3':['Sentido proibido',()=>reg(PL([[50,78],[50,22]]))+BAR],
 'R-4a':['Proibido virar à esquerda',()=>reg(PL([[58,78],[58,44],[24,44]]))+BAR],
 'R-4b':['Proibido virar à direita',()=>reg(PL([[42,78],[42,44],[76,44]]))+BAR],
 'R-5a':['Proibido retornar à esquerda',()=>reg(CV('M60 78V44A12 12 0 0 0 36 44V58',36,72,DN))+BAR],
 'R-5b':['Proibido retornar à direita',()=>reg(CV('M40 78V44A12 12 0 0 1 64 44V58',64,72,DN))+BAR],
 'R-6a':['Proibido estacionar',()=>reg(T(50,68,48,'E',K,900))+BAR],
 'R-6b':['Estacionamento regulamentado',()=>reg(T(50,68,48,'E',K,900))],
 'R-6c':['Proibido parar e estacionar',()=>reg(T(50,68,48,'E',K,900))+BAR+`<line x1="76.5" y1="23.5" x2="23.5" y2="76.5" stroke="${RD}" stroke-width="9"/>`],
 'R-7':['Proibido ultrapassar',()=>reg(G(25,38,1,pic.carRear(K))+G(51,38,1,pic.carRear(RD)))+BAR],
 'R-8a':['Proibido mudar de faixa da esquerda para a direita',()=>reg(PL([[60,80],[60,22]],K,6,11)+PL([[40,80],[40,54],[56,32]],K,6,11))+BAR],
 'R-8b':['Proibido mudar de faixa da direita para a esquerda',()=>reg(PL([[40,80],[40,22]],K,6,11)+PL([[60,80],[60,54],[44,32]],K,6,11))+BAR],
 'R-9':['Proibido trânsito de caminhões',()=>reg(G(27,39,1.05,pic.truck(K)))+BAR],
 'R-10':['Proibido trânsito de veículos automotores',()=>reg(G(29,40,1.05,pic.carSide(K)))+BAR],
 'R-14':['Peso bruto total máximo permitido',()=>reg(T(50,61,30,'10t',K))],
 'R-15':['Altura máxima permitida',()=>reg(`<polygon points="38,20 62,20 50,30" fill="${K}"/><polygon points="38,80 62,80 50,70" fill="${K}"/>`+T(50,58,22,'3,0 m',K))],
 'R-16':['Largura máxima permitida',()=>reg(`<polygon points="15,40 15,60 24,50" fill="${K}"/><polygon points="85,40 85,60 76,50" fill="${K}"/>`+T(50,56,16,'1,8 m',K))],
 'R-19':['Velocidade máxima permitida',()=>reg(T(50,57,34,'80',K,900)+T(50,72,11,'km/h',K))],
 'R-20':['Proibido acionar buzina ou sinal sonoro',()=>reg(G(30,40,1.05,pic.horn(K)))+BAR],
 'R-23':['Conserve-se à direita',()=>reg(PL([[24,50],[48,50]],K,6,12)+G(54,40,1,pic.carRear(K)))],
 'R-24a':['Sentido de circulação da via',()=>reg(PL([[22,50],[78,50]]))],
 'R-24b':['Passagem obrigatória',()=>reg(PL([[30,30],[72,72]]))],
 'R-25a':['Vire à esquerda',()=>reg(CV('M58 78V52Q58 40 46 40H38',24,40,LF))],
 'R-25b':['Vire à direita',()=>reg(CV('M42 78V52Q42 40 54 40H62',76,40,RT))],
 'R-25c':['Siga em frente ou à esquerda',()=>reg(PL([[58,80],[58,20]])+CV('M58 58Q58 46 46 46H40',26,46,LF))],
 'R-25d':['Siga em frente ou à direita',()=>reg(PL([[42,80],[42,20]])+CV('M42 58Q42 46 54 46H60',74,46,RT))],
 'R-26':['Siga em frente',()=>reg(PL([[50,80],[50,20]]))],
 'R-27':['Ônibus, caminhões e veículos de grande porte mantenham-se à direita',()=>reg(PL([[18,50],[40,50]],K,6,11)+G(44,40,.85,pic.truck(K)))],
 'R-28':['Duplo sentido de circulação',()=>reg(PL([[39,20],[39,80]])+PL([[61,80],[61,20]]))],
 'R-29':['Proibido trânsito de pedestres',()=>reg(G(39,27,1.05,pic.ped(K)))+BAR],
 'R-30':['Pedestre, ande pela esquerda',()=>reg(G(48,27,1,pic.ped(K))+PL([[42,50],[20,50]],K,6,11))],
 'R-31':['Pedestre, ande pela direita',()=>reg(G(30,27,1,pic.ped(K))+PL([[58,50],[80,50]],K,6,11))],
 'R-32':['Circulação exclusiva de ônibus',()=>reg(G(35,32,1,pic.bus(K)))],
 'R-33':['Sentido de circulação na rotatória',()=>reg(roundabout(K))],
 'R-34':['Circulação exclusiva de bicicletas',()=>reg(G(28,38,1,pic.bike(K)))],
 'R-35':['Pedestres à esquerda, ciclistas à direita',()=>reg(G(22,30,.85,pic.ped(K))+`<line x1="50" y1="18" x2="50" y2="82" stroke="${K}" stroke-width="3"/>`+G(53,42,.6,pic.bike(K)))],
 'R-37':['Proibido trânsito de motocicletas, motonetas e ciclomotores',()=>reg(G(28,38,1,pic.moto(K)))+BAR],
 'R-38':['Proibido trânsito de ônibus',()=>reg(G(35,32,1,pic.bus(K)))+BAR],
 'R-39':['Circulação exclusiva de caminhão',()=>reg(G(27,39,1.05,pic.truck(K)))],
 'R-44':['Circulação compartilhada de pedestres e ciclistas',()=>reg(G(24,28,.8,pic.ped(K))+G(42,48,.7,pic.bike(K)))],
 'A-1a':['Curva acentuada à esquerda',()=>adv(CV('M58 80V46Q58 34 46 34H40',24,34,LF,K,9,15))],
 'A-1b':['Curva acentuada à direita',()=>adv(CV('M42 80V46Q42 34 54 34H60',76,34,RT,K,9,15))],
 'A-2a':['Curva à esquerda',()=>adv(CV('M58 80V62Q58 42 44 32',33,24,-2.5,K,9,15))],
 'A-2b':['Curva à direita',()=>adv(CV('M42 80V62Q42 42 56 32',67,24,-.64,K,9,15))],
 'A-3a':['Pista sinuosa à esquerda',()=>adv(CV('M56 82C40 70 64 60 50 48S56 30 46 28',38,20,-2.4,K,8,14))],
 'A-4b':['Curva acentuada em “S” à direita',()=>adv(CV('M42 82V64H58V42H50',38,42,LF,K,8,14))],
 'A-5a':['Curva em “S” à esquerda',()=>adv(CV('M58 82C58 64 40 64 42 50S60 38 56 30',52,20,-1.9,K,8,14))],
 'A-6':['Cruzamento de vias',()=>adv(LN('M50 20V80M20 50H80'))],
 'A-7a':['Via lateral à esquerda',()=>adv(LN('M54 18V82M22 50H54'))],
 'A-8':['Interseção em “T”',()=>adv(LN('M22 36H78M50 36V80'))],
 'A-9':['Bifurcação em “Y”',()=>adv(LN('M50 82V54L30 26M50 54 70 26'))],
 'A-11a':['Junções sucessivas contrárias, primeira à esquerda',()=>adv(LN('M50 18V82M24 62H50M50 38H76'))],
 'A-12':['Interseção em círculo',()=>adv(roundabout(K))],
 'A-14':['Semáforo à frente',()=>adv(`<rect x="38" y="20" width="24" height="60" rx="6" fill="${K}"/><circle cx="50" cy="32" r="7" fill="#FF3B30"/><circle cx="50" cy="50" r="7" fill="#FFB300"/><circle cx="50" cy="68" r="7" fill="#26C281"/>`)],
 'A-15':['Parada obrigatória à frente',()=>adv(`<g transform="translate(50 50) scale(.5) translate(-50 -50)">${octagon(48,WH)+octagon(43,RD)+T(50,62,30,'PARE',WH)}</g>`)],
 'A-17':['Pista irregular',()=>adv(`<path d="M18 64H82V60Q76 46 70 60Q64 46 58 60Q52 46 46 60Q40 46 34 60Q28 46 22 60H18z" fill="${K}"/>`)],
 'A-18':['Saliência ou lombada',()=>adv(`<path d="M16 66H84V60H68Q60 38 50 38T32 60H16z" fill="${K}"/>`)],
 'A-19':['Depressão',()=>adv(`<path d="M16 46H32Q40 68 50 68T68 46H84V54H72Q62 76 50 76T28 54H16z" fill="${K}"/>`)],
 'A-20a':['Declive acentuado',()=>adv(`<polygon points="22,46 80,70 22,70" fill="${K}"/><g transform="rotate(22 46 44)">${G(34,32,.7,pic.carSide(K))}</g>`)],
 'A-20b':['Aclive acentuado',()=>adv(`<polygon points="20,70 78,46 78,70" fill="${K}"/><g transform="rotate(-22 54 44)">${G(40,32,.7,pic.carSide(K))}</g>`)],
 'A-31':['Trânsito de tratores ou maquinaria agrícola',()=>adv(G(28,36,1,pic.tractor(K)))],
 'A-32a':['Trânsito de pedestres',()=>adv(G(38,26,1.05,pic.ped(K)))],
 'A-32b':['Passagem sinalizada de pedestres',()=>adv(G(39,20,.9,pic.ped(K))+`<path d="M26 66h6l-3 10h-6zM38 66h6l-3 10h-6zM56 66h6l3 10h-6zM68 66h6l3 10h-6z" fill="${K}"/>`)],
 'A-33a':['Área escolar',()=>adv(G(28,30,.9,pic.ped(K))+G(52,40,.68,pic.ped(K)))],
 'A-35':['Animais',()=>adv(G(28,36,1,pic.cow(K)))],
 'A-39':['Passagem de nível sem barreira',()=>adv(G(27,38,1,pic.train(K)))],
 'A-40':['Passagem de nível com barreira',()=>adv(`<rect x="24" y="40" width="52" height="6" fill="${K}"/><rect x="24" y="54" width="52" height="6" fill="${K}"/><rect x="28" y="34" width="6" height="34" fill="${K}"/><rect x="47" y="34" width="6" height="34" fill="${K}"/><rect x="66" y="34" width="6" height="34" fill="${K}"/>`)],
 'A-41':['Cruz de Santo André',()=>`<g transform="rotate(32 50 50)"><rect x="4" y="40" width="92" height="20" fill="${K}"/><rect x="7" y="43" width="86" height="14" fill="${YL}"/></g><g transform="rotate(-32 50 50)"><rect x="4" y="40" width="92" height="20" fill="${K}"/><rect x="7" y="43" width="86" height="14" fill="${YL}"/></g><rect x="44" y="44" width="12" height="12" fill="${YL}"/>`],
 'A-42a':['Início de pista dupla',()=>adv(`<rect x="44" y="18" width="12" height="26" rx="6" fill="${K}"/>`+PL([[36,46],[36,80]],K,7,12)+PL([[64,80],[64,46]],K,7,12))],
 'A-42b':['Fim de pista dupla',()=>adv(`<rect x="44" y="56" width="12" height="26" rx="6" fill="${K}"/>`+PL([[36,20],[36,54]],K,7,12)+PL([[64,54],[64,20]],K,7,12))],
 'A-42c':['Pista dividida',()=>adv(`<rect x="44" y="26" width="12" height="48" rx="6" fill="${K}"/>`+PL([[34,24],[34,76]],K,7,12)+PL([[66,76],[66,24]],K,7,12))],
 'A-45':['Rua sem saída',()=>adv(T(50,43,13,'RUA',K,900)+T(50,57,13,'SEM',K,900)+T(50,71,13,'SAÍDA',K,900))],
 'SAU-06':['Telefone',()=>sau(`<path d="M36 30c-6 5-6 13-1 22 6 11 14 19 25 23 8 3 13 1 16-3l-8-9c-2-2-5-2-7 0l-3 3c-7-3-12-8-15-15l3-3c2-2 2-5 0-7z" fill="${K}"/>`)],
 'SAU-08':['Borracharia',()=>sau(G(30,30,1,pic.wheel(K)))],
 'SAU-09':['Abastecimento',()=>sau(`<rect x="32" y="28" width="22" height="44" rx="2" fill="${K}"/><rect x="36" y="32" width="14" height="10" fill="#fff"/><path d="M54 38h8v24a4 4 0 0 1-8 0v-6" fill="none" stroke="${K}" stroke-width="4"/><rect x="28" y="72" width="30" height="4" fill="${K}"/>`)],
 'SAU-10':['Pronto-socorro',()=>sau(`<rect x="44" y="27" width="12" height="46" fill="${RD}"/><rect x="27" y="44" width="46" height="12" fill="${RD}"/>`)],
 'SAU-12':['Restaurante',()=>sau(`<path d="M36 26v18c0 4 3 6 6 6v24M33 26v14M39 26v14M42 26v14" fill="none" stroke="${K}" stroke-width="3.5"/><path d="M60 26c6 4 8 14 4 24v24" fill="none" stroke="${K}" stroke-width="5"/>`)],
 'SAU-13':['Hotel',()=>sau(`<rect x="26" y="38" width="6" height="34" fill="${K}"/><rect x="26" y="56" width="50" height="9" fill="${K}"/><rect x="36" y="46" width="14" height="8" rx="3" fill="${K}"/><rect x="70" y="56" width="6" height="16" fill="${K}"/>`)],
 'SAU-18':['Pedágio',()=>sau(`<rect x="28" y="40" width="18" height="34" fill="${K}"/><rect x="31" y="45" width="12" height="9" fill="#fff"/><path d="M24 40h26l-4-8H28z" fill="${K}"/><path d="M46 60 76 44" stroke="${K}" stroke-width="5"/><path d="M56 55l4-2M66 50l4-2" stroke="#fff" stroke-width="5"/>`)],
 'SAU-21':['Aeroporto',()=>sau(`<path d="M50 24c2.5 0 3.5 3.5 3.5 7v11l20 11v6l-20-6v11l6 4.5v4.5l-9.5-2.5L40.5 72v-4.5l6-4.5V52l-20 6v-6l20-11V31c0-3.5 1-7 3.5-7z" fill="${K}"/>`)],
 'SAU-26':['Terminal rodoviário',()=>sau(G(35,32,1,pic.bus(K)))],
 'DEF-01':['Local acessível',()=>`<rect x="3" y="3" width="94" height="94" rx="8" fill="${BL}"/><circle cx="46" cy="24" r="6" fill="#fff"/><path d="M45 33v20h17l6 16" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><path d="M45 43h14" stroke="#fff" stroke-width="5"/><path d="M38 47a16 16 0 1 0 22 21" fill="none" stroke="#fff" stroke-width="5"/>`],
 'TAR-03':['Parque',()=>tur(`<circle cx="50" cy="38" r="17" fill="#fff"/><circle cx="38" cy="46" r="10" fill="#fff"/><circle cx="62" cy="46" r="10" fill="#fff"/><rect x="46" y="50" width="8" height="26" fill="#fff"/><rect x="24" y="74" width="52" height="4" fill="#fff"/>`)],
 'THC-05':['Atrativo histórico-cultural',()=>tur(`<polygon points="22,40 50,24 78,40" fill="#fff"/><rect x="26" y="42" width="48" height="4" fill="#fff"/><rect x="29" y="48" width="6" height="22" fill="#fff"/><rect x="41" y="48" width="6" height="22" fill="#fff"/><rect x="53" y="48" width="6" height="22" fill="#fff"/><rect x="65" y="48" width="6" height="22" fill="#fff"/><rect x="22" y="72" width="56" height="5" fill="#fff"/>`)],
 'THC-11':['Biblioteca',()=>tur(`<path d="M50 34C42 28 30 28 22 31v38c8-3 20-3 28 3zM50 34c8-6 20-6 28-3v38c-8-3-20-3-28 3z" fill="#fff"/><path d="M50 34v38" stroke="${BR}" stroke-width="2"/>`)],
 'TNA-05':['Atrativo turístico natural',()=>tur(`<path d="M22 34h30v36H22z" fill="#fff"/><path d="M52 34h26" stroke="#fff" stroke-width="4"/><path d="M60 36v30M66 36v30M72 36v30" stroke="#fff" stroke-width="3"/><path d="M52 70h28" stroke="#fff" stroke-width="5"/><path d="M54 76q6-4 12 0t12 0" fill="none" stroke="#fff" stroke-width="3"/>`)],
 'TNA-06':['Atrativo ambiental ou paisagístico',()=>tur(`<circle cx="68" cy="32" r="8" fill="#fff"/><polygon points="18,76 42,36 58,60 66,50 84,76" fill="#fff"/>`)],
};
function plateSVG(code,label){const p=PLACAS[code];if(!p)return '';return `<svg viewBox="0 0 100 100" role="img" aria-label="${label||'Placa'}">${p[1]()}</svg>`;}

/* ---------- ilustrações dos cartões de Estudo (vetor) ---------- */
const road=(s)=>`<rect x="0" y="0" width="100" height="100" rx="14" fill="${AS}"/>${s}`;
const dashV=(x,c,w)=>{let s='';for(let y=4;y<100;y+=18)s+=`<rect x="${x-(w||3)/2}" y="${y}" width="${w||3}" height="10" fill="${c}"/>`;return s;};
const arrowW=(x,y,dir)=>dir>0?PL([[x,y+22],[x,y]],'#fff',5,10):PL([[x,y],[x,y+22]],'#fff',5,10);
const light=(on)=>{const col={r:'#FF3B30',y:'#FFB300',g:'#26C281'};const dim='#5A5560';
  return `<rect x="34" y="6" width="32" height="88" rx="10" fill="#2A2430"/>`+[['r',24],['y',50],['g',76]].map(([k,cy])=>`<circle cx="50" cy="${cy}" r="11" fill="${on===k?col[k]:dim}"/>`+(on===k?`<circle cx="50" cy="${cy}" r="15" fill="${col[k]}" opacity=".25"/>`:'')).join('');};
const ILU={
 'lin-branca':()=>road(dashV(50,'#fff')+arrowW(25,40,1)+arrowW(75,40,1)),
 'lin-amarela':()=>road(dashV(50,YL)+arrowW(25,40,-1)+arrowW(75,40,1)),
 'lin-continua':()=>road(`<rect x="48" y="0" width="4" height="100" fill="${YL}"/>`+arrowW(25,40,-1)+arrowW(75,40,1)),
 'lin-tracejada':()=>road(dashV(50,YL)+arrowW(25,40,-1)+arrowW(75,40,1)),
 'lin-dupla':()=>road(`<rect x="44" y="0" width="4" height="100" fill="${YL}"/>`+dashV(55,YL)+arrowW(25,40,-1)+arrowW(78,40,1)),
 'faixa-ped':()=>road([12,28,44,60,76].map(x=>`<rect x="${x}" y="14" width="10" height="72" fill="#fff"/>`).join('')),
 'setas-chao':()=>road(dashV(50,'#fff')+PL([[25,84],[25,24]],'#fff',7,14)+CV('M75 84V52Q75 40 63 40',56,40,LF,'#fff',7,14)),
 'retencao':()=>road(`<rect x="6" y="34" width="88" height="9" fill="#fff"/>`+dashV(50,'#fff')+G(32,58,.9,pic.carRear('#F2A7B8'))),
 'pare-chao':()=>road(`<rect x="6" y="18" width="88" height="7" fill="#fff"/>`+`<text x="50" y="74" font-family="Arial" font-weight="900" font-size="26" fill="#fff" text-anchor="middle" transform="scale(1 1.5) translate(0 -24)">PARE</text>`),
 'cruz-x':()=>road(`<rect x="16" y="16" width="68" height="68" fill="none" stroke="${YL}" stroke-width="4"/><path d="M16 16 84 84M84 16 16 84" stroke="${YL}" stroke-width="4"/>`),
 'zebrado':()=>road(`<clipPath id="zb"><polygon points="50,8 86,92 14,92"/></clipPath><polygon points="50,8 86,92 14,92" fill="none" stroke="#fff" stroke-width="3"/><g clip-path="url(#zb)">${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${-20+i*14}" y="0" width="6" height="140" fill="#fff" transform="rotate(35 50 50)"/>`).join('')}</g>`),
 'faixa-exclusiva':()=>road(`<rect x="56" y="0" width="4" height="100" fill="#fff"/>`+dashV(28,'#fff')+`<text x="80" y="62" font-family="Arial" font-weight="900" font-size="11" fill="#fff" text-anchor="middle" transform="rotate(-90 80 56)">ÔNIBUS</text>`),
 'sem-vermelho':()=>light('r'),'sem-amarelo':()=>light('y'),'sem-verde':()=>light('g'),
 'sem-ped':()=>`<rect x="26" y="8" width="48" height="84" rx="10" fill="#2A2430"/><rect x="32" y="14" width="36" height="34" rx="6" fill="#3D3842"/><rect x="32" y="52" width="36" height="34" rx="6" fill="#1E3B2C"/>${G(42,55,.6,pic.ped('#26C281'))}`,
 'sem-trem':()=>`<path d="M50 30V96" stroke="#5A5560" stroke-width="6"/><rect x="14" y="30" width="72" height="30" rx="15" fill="#2A2430"/><circle cx="30" cy="45" r="10" fill="#FF3B30"/><circle cx="70" cy="45" r="10" fill="#5A5560"/><g transform="rotate(25 50 16)"><rect x="18" y="12" width="64" height="9" fill="#fff" stroke="${K}" stroke-width="2"/></g><g transform="rotate(-25 50 16)"><rect x="18" y="12" width="64" height="9" fill="#fff" stroke="${K}" stroke-width="2"/></g>`,
 'ciclovia':()=>road(`<rect x="58" y="0" width="42" height="100" fill="#C9413B"/><rect x="52" y="0" width="7" height="100" fill="#B9B2BE"/>`+G(64,40,.72,pic.bike('#fff'))),
 'ciclofaixa':()=>road(`<rect x="56" y="0" width="40" height="100" fill="#C9413B"/><rect x="54" y="0" width="3" height="100" fill="#fff"/><rect x="95" y="0" width="3" height="100" fill="#fff"/>`+G(60,40,.72,pic.bike('#fff'))),
 'cone':()=>`<rect x="14" y="82" width="72" height="8" rx="2" fill="#E9603F"/><polygon points="42,10 58,10 74,84 26,84" fill="#F07A3E"/><polygon points="37,34 63,34 67,50 33,50" fill="#fff"/><polygon points="31,60 69,60 72,72 28,72" fill="#fff"/>`,
 'tacha':()=>road(dashV(50,YL)+[20,50,80].map(y=>`<rect x="40" y="${y-6}" width="20" height="12" rx="4" fill="#FFE27A"/><circle cx="50" cy="${y}" r="12" fill="#FFE27A" opacity=".25"/>`).join('')),
 'balizador':()=>`<rect x="0" y="80" width="100" height="20" rx="4" fill="${AS}"/>`+[28,64].map(x=>`<rect x="${x}" y="18" width="12" height="66" rx="5" fill="#2A2430"/><rect x="${x}" y="30" width="12" height="8" fill="${YL}"/><rect x="${x}" y="46" width="12" height="8" fill="${YL}"/>`).join(''),
 'defensa':()=>`<rect x="0" y="70" width="100" height="30" fill="${AS}"/>`+[14,48,82].map(x=>`<rect x="${x-3}" y="40" width="6" height="34" fill="#7E7886"/>`).join('')+`<path d="M0 40h100v16H0z" fill="#B9B2BE"/><path d="M0 48h100" stroke="#8C8592" stroke-width="3"/>`,
 'temporaria':()=>`<polygon points="50,2 98,50 50,98 2,50" fill="${K}"/><polygon points="50,7.5 92.5,50 50,92.5 7.5,50" fill="#F07A1A"/>`+G(36,26,1,pic.ped(K))+`<path d="M54 48 70 74" stroke="${K}" stroke-width="4"/><rect x="62" y="72" width="14" height="5" fill="${K}"/>`,
 'agente':()=>`<circle cx="50" cy="50" r="46" fill="#FFE3EA"/><circle cx="50" cy="34" r="11" fill="#7A4A2E"/><path d="M36 26h28l-3-9H39z" fill="#2E4A8C"/><path d="M30 92V66c0-11 9-18 20-18s20 7 20 18v26z" fill="#2E4A8C"/><path d="M64 56 80 28" stroke="#2E4A8C" stroke-width="9" stroke-linecap="round"/><circle cx="81" cy="25" r="5" fill="#7A4A2E"/><rect x="44" y="54" width="12" height="6" fill="${YL}"/>`,
 'ind-azul':()=>`<rect x="3" y="14" width="94" height="72" rx="8" fill="${BL}"/><rect x="10" y="22" width="24" height="24" fill="#fff"/><rect x="38" y="22" width="24" height="24" fill="#fff"/><rect x="66" y="22" width="24" height="24" fill="#fff"/><rect x="16" y="26" width="8" height="16" fill="${K}"/><path d="M50 26v16M46 26v7c0 2 2 3 4 3M54 26v7c0 2-2 3-4 3" stroke="${K}" stroke-width="2" fill="none"/><text x="78" y="41" font-family="Arial" font-weight="900" font-size="16" text-anchor="middle" fill="${K}">E</text><text x="50" y="72" font-family="Arial" font-weight="700" font-size="15" text-anchor="middle" fill="#fff">A 500 m</text>`,
 'ind-verde':()=>`<rect x="3" y="14" width="94" height="72" rx="8" fill="${GR}"/><rect x="7" y="18" width="86" height="64" rx="5" fill="none" stroke="#fff" stroke-width="2"/>`+PL([[18,46],[18,26]],'#fff',5,9)+`<text x="56" y="42" font-family="Arial" font-weight="700" font-size="14" text-anchor="middle" fill="#fff">Centro</text>`+PL([[12,66],[26,66]],'#fff',5,9)+`<text x="60" y="71" font-family="Arial" font-weight="700" font-size="12" text-anchor="middle" fill="#fff">Zona Norte</text>`,
 'ind-branca':()=>`<rect x="3" y="20" width="94" height="60" rx="8" fill="#fff" stroke="${K}" stroke-width="3"/><text x="50" y="46" font-family="Arial" font-weight="900" font-size="11" text-anchor="middle" fill="${K}">NÃO FECHE</text><text x="50" y="64" font-family="Arial" font-weight="900" font-size="10.5" text-anchor="middle" fill="${K}">O CRUZAMENTO</text>`,
 'ind-marrom':()=>`<rect x="3" y="14" width="94" height="72" rx="8" fill="${BR}"/><rect x="7" y="18" width="86" height="64" rx="5" fill="none" stroke="#fff" stroke-width="2"/><rect x="14" y="34" width="26" height="22" rx="3" fill="#fff"/><circle cx="27" cy="45" r="6" fill="${BR}"/><rect x="18" y="31" width="8" height="4" fill="#fff"/><text x="66" y="51" font-family="Arial" font-weight="700" font-size="14" text-anchor="middle" fill="#fff">Mirante</text>`,
 'dica':()=>`<circle cx="50" cy="50" r="40" fill="#FFD36E" stroke="#E8A317" stroke-width="6"/><path d="M50 26l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#fff"/>`,
};
function iluSVG(k,label){return ILU[k]?`<svg viewBox="0 0 100 100" role="img" aria-label="${label||''}">${ILU[k]()}</svg>`:'';}

/* ---------- ícones de traço (24×24) para os demais cartões ---------- */
const ICO={
 phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 belt:'<circle cx="12" cy="5" r="2.5"/><path d="M7 21v-6a5 5 0 0 1 10 0v6M8.5 10.5 16 19"/>',
 walk:'<circle cx="13" cy="4" r="2"/><path d="M12 8 10 14l3 3v5M10 14l-3 7M13 9l4 3M11 9 7 12"/>',
 helmet:'<path d="M4 16a8 8 0 0 1 16 0v2H4zM12 8v4M14 12h6"/>',
 bike:'<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="m6 16 4-7h5l3 7M10 9l3 7H6"/>',
 rain:'<path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 17 15zM8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
 fog:'<path d="M4 8h16M3 12h18M5 16h14M8 20h8"/>',
 light:'<path d="M10 6h3a6 6 0 0 1 0 12h-3zM3 8h4M3 12h4M3 16h4"/>',
 tire:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
 drop:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
 brake:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M17 4a10 10 0 0 1 3 4"/>',
 glass:'<path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v6M8 21h8"/>',
 moon:'<path d="M20 14a8 8 0 1 1-10-10 6.5 6.5 0 0 0 10 10z"/>',
 heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
 cross:'<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',
 triangle:'<path d="M12 4 21 20H3z"/><path d="M12 10v4M12 17h.01"/>',
 doc:'<path d="M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h6M9.5 16h6"/>',
 gavel:'<path d="m14 4 6 6M11 7l6 6M13 9l-8 8 2 2 8-8M4 21h8"/>',
 speed:'<path d="M4 17a8 8 0 1 1 16 0M12 17l4-5"/>',
 baby:'<circle cx="12" cy="7" r="3"/><path d="M8 21v-5a4 4 0 0 1 8 0v5"/>',
 bus:'<rect x="5" y="3" width="14" height="14" rx="2"/><path d="M5 10h14M8 20v-3M16 20v-3"/>',
 leaf:'<path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14zM5 19l8-8"/>',
 pump:'<path d="M5 21V5h9v16M5 11h9M14 8h3l2 3v7a1.5 1.5 0 0 1-3 0v-3"/>',
 road:'<path d="M9 3 5 21M15 3l4 18M12 5v2M12 10v2M12 15v2"/>',
 curve:'<path d="M6 21v-8a7 7 0 0 1 7-7h5M15 3l3 3-3 3"/>',
 arrows:'<path d="M4 12h14M14 7l5 5-5 5"/>',
 horn:'<path d="M3 10h4l8-5v14l-8-5H3zM18 9a4 4 0 0 1 0 6"/>',
 id:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 10h5M13 14h5M6 16h5"/>',
 car:'<path d="m3 15 2-6h14l2 6v4H3zM7 19v2M17 19v2M6 15h2M16 15h2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 shield:'<path d="M12 3 20 6v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 users:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M15 15a4.5 4.5 0 0 1 6 4"/>',
 wrench:'<path d="M15 4a4 4 0 0 0 5 5L10 19l-3 1 1-3L18 7"/>',
 battery:'<rect x="3" y="7" width="16" height="11" rx="2"/><path d="M21 11v3M8 12.5h5M10.5 10v5"/>',
 temp:'<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 siren:'<path d="M7 17v-5a5 5 0 0 1 10 0v5M5 21h14v-4H5zM12 3v2M4 6l1.5 1.5M20 6l-1.5 1.5"/>',
 parking:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
 book:'<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2zM20 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2z"/>',
 truck:'<path d="M2 7h11v9H2zM13 10h5l3 3v3h-8"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
 star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 cone:'<path d="M10 4h4l4 15H6zM8 13h8M4 20h16"/>',
 money:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
};
const ICO_RULES=[[/celular|mensagem|tela/i,'phone'],[/cinto/i,'belt'],[/cadeirinha|bebê|criança|assento de elevação/i,'baby'],[/capacete|viseira|moto/i,'helmet'],
 [/bicicleta|ciclist|ciclovia|ciclofaixa/i,'bike'],[/chuva|aquaplanagem|alagad/i,'rain'],[/neblina/i,'fog'],[/farol|faróis|luz|luzes|seta/i,'light'],[/pneu|estepe|rodízio/i,'tire'],
 [/óleo|combustível|abastec/i,'drop'],[/freio|pedal/i,'brake'],[/álcool|bebe|bafômetro|etilômetro/i,'glass'],[/sono|cansaço|cochilo|bocejo|descans/i,'moon'],
 [/emoç|raiva|ansiedade|respire/i,'heart'],[/SAMU|socorro|vítima|primeiros|ferimento|hemorragia|fratura|queimadura/i,'cross'],[/triângulo|pisca-alerta|sinaliz/i,'triangle'],
 [/multa|notificação|prazo|desconto/i,'doc'],[/crime|detenção|reclusão|prisão|processo criminal/i,'gavel'],[/velocidade|km\/h|frenagem|acima do limite/i,'speed'],
 [/ônibus|transporte público/i,'bus'],[/caminh|trator/i,'truck'],[/ambiente|polui|resíduo|lixo|etanol|elétric|sustent/i,'leaf'],[/rodovia|estrada|via|rua|avenida/i,'road'],
 [/curva|conversão|retorno/i,'curve'],[/buzina/i,'horn'],[/CNH|PPD|categoria|habilita|exame/i,'id'],[/estacion|vaga|guia rebaixada|parar|parada/i,'parking'],
 [/pedestre|calçada|faixa/i,'walk'],[/bateria/i,'battery'],[/radiador|arrefecimento/i,'temp'],[/revis|manual|manutenção|mecânico|filtro|escapamento|suspensão/i,'wrench'],
 [/emergência|ambulância|sirene|bombeiro/i,'siren'],[/olh|retrovisor|ponto cego|visto|visibilidade|vidro|para-brisa|palheta/i,'eye'],[/defensiv|previsão|pilares|seguro/i,'shield'],
 [/empatia|respeito|paciência|gentileza|convivência/i,'users'],[/pontos|R\$/i,'money'],[/regra|lei|CTB/i,'book'],[/carro|veículo/i,'car']];
function iconFor(text){for(const [re,k] of ICO_RULES)if(re.test(text))return k;return 'spark';}
function icoSVG(k){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[k]||ICO.spark}</svg>`;}

/* ---------- pixel art: Bruno, lugares e mapa ---------- */
const BRUNO=['....hhhhhhhh....','...hhhhhhhhhh...','...hhhhhhhhhh...','...hssssssssh...','..dssessssessd..',
 '..drssssssssrd..','...sssbbbbsss...','...sbbmmmmbbs...','....bbbbbbbb....','.....dssssd.....',
 '...ttcwwwwcttt..','..ttttcwwcttttt.','.tttttttttttfft.','.sttttttttttyts.','.s.tttttttttt.s.',
 '...pppppppppp...','...pppp..pppp...','...pppp..pppp...','...kkkk..kkkk...'];
const BRUNO_WAVE=['....hhhhhhhh....','...hhhhhhhhhh...','...hhhhhhhhhh...','...hssssssssh...','..dssessssessd..',
 '..drssssssssrd..','...sssbbbbsss..s','...sbbmmmmbbs.s.','....bbbbbbbb.s..','.....dssssd..t..',
 '...ttcwwwwcttt..','..ttttcwwctttt..','.tttttttttttff..','.sttttttttttyt..','.s.tttttttttt...',
 '...pppppppppp...','...pppp..pppp...','...pppp..pppp...','...kkkk..kkkk...'];
const BPAL={h:'#1D1214',s:'#7A4A2E',d:'#5E3721',e:'#1D1214',r:'#C76B6B',b:'#2A1A1C',m:'#F2DCD5',t:'#E58FA8',c:'#FFFFFF',w:'#FFFFFF',f:'#FFFFFF',y:'#FFD36E',p:'#5B4A7A',k:'#3A2233'};
function drawSprite(ctx,grid,x,y,sc){sc=sc||1;grid.forEach((row,j)=>[...row].forEach((ch,i)=>{const c=BPAL[ch];if(c){ctx.fillStyle=c;ctx.fillRect(x+i*sc,y+j*sc,sc,sc);}}));}
const SPAL={sky:'#CFEFFF',white:'#FFFFFF',cream:'#FFF6E2',yellow:'#F2C14E',yellowD:'#D9A53A',red:'#D94A3A',redD:'#A8352B',orange:'#E9603F',dark:'#3A2233',gray:'#9F98A6',grayL:'#D8D2DA',grayD:'#6E6672',
 green:'#3E9A62',greenD:'#2A7048',greenL:'#8CCB9B',teal:'#2E5E73',blue:'#6FA8DC',pink:'#E8577D',lilac:'#B89BE0',beige:'#D8C3A0',black:'#2A2430',fruitY:'#FFD36E',fruitO:'#F29A4A',brown:'#9A6A55',peach:'#F7C9A9',heart:'#E8577D'};
const SORDER=['sky','yellow','yellowD','lilac','pink','red','redD','white','cream','peach','blue','beige','green','greenD','grayL','gray','dark','teal','brown','greenL','black','grayD','orange','fruitY','fruitO','heart'];
function sceneRects(kind,noSky){
  const L={};const a=(k,x,y,w,h)=>{(L[k]=L[k]||[]).push([x,y,w,h]);};
  const tiles=(k,x,y,w,h,s)=>{for(let yy=y+s-1;yy<y+h;yy+=s)a(k,x,yy,w,1);for(let xx=x+s-1;xx<x+w;xx+=s)a(k,xx,y,1,h);};
  const street=()=>{a('grayL',0,46,72,6);a('fruitY',0,52,72,1);a('gray',0,53,72,3);for(let x=4;x<72;x+=10)a('grayL',x,54,4,1);};
  if(kind==='casa'){if(!noSky)a('sky',0,0,72,46);
    a('yellow',0,4,18,42);a('yellowD',0,4,18,1);[[3,9],[11,9],[3,20],[11,20]].forEach(p=>{a('white',p[0],p[1],5,5);a('dark',p[0]+1,p[1]+1,3,3);});
    a('gray',3,34,7,12);for(let y=35;y<46;y+=2)a('grayD',3,y,7,1);
    a('yellow',18,0,32,46);a('cream',33,0,1,24);
    [[21,6],[38,6]].forEach(p=>{a('white',p[0],p[1],8,7);a('dark',p[0]+1,p[1]+1,6,5);for(let x=p[0]+2;x<p[0]+7;x+=2)a('grayD',x,p[1]+1,1,5);});
    a('red',20,17,21,5);a('white',22,19,9,1);a('white',33,19,6,1);a('orange',17,23,25,2);a('redD',17,25,25,1);
    a('dark',23,27,14,19);[30,34,38,42].forEach(y=>{a('brown',24,y,12,1);a('fruitY',25,y-1,2,1);a('heart',29,y-1,2,1);a('fruitO',33,y-1,2,1);});
    a('greenD',18,34,5,12);[36,39,42].forEach(y=>{a('fruitO',19,y,1,1);a('fruitY',21,y,1,1);a('fruitY',19,y+1,1,1);a('fruitO',21,y+1,1,1);});
    a('white',41,27,8,19);a('grayL',42,28,6,18);a('gray',42,36,6,1);a('grayD',46,37,1,2);
    a('lilac',50,0,22,27);a('pink',50,27,22,19);a('white',53,15,6,4);a('white',61,15,7,4);a('grayL',54,16,4,2);a('grayL',62,16,5,2);
    a('redD',52,28,17,3);a('white',55,29,8,1);a('dark',57,33,9,13);a('blue',58,34,3,11);
    a('grayD',13,0,2,46);street();[31,47].forEach(x=>{a('black',x,43,1,6);a('fruitY',x,44,1,1);a('fruitY',x,46,1,1);});}
  if(kind==='val'){if(!noSky)a('sky',0,0,72,2);a('white',0,2,72,9);
    [[5,3,11],[30,3,8],[49,3,9]].forEach(w=>{a('dark',w[0],w[1],w[2],7);a('greenL',w[0]+1,w[1]+6,2,1);a('greenL',w[0]+w[2]-3,w[1]+6,2,1);});
    a('green',0,11,17,35);tiles('greenD',0,11,17,35,3);a('dark',4,25,9,21);for(let x=5;x<13;x+=2)a('grayD',x,25,1,21);
    a('red',17,9,55,37);tiles('redD',17,9,55,37,3);a('redD',16,13,56,1);
    a('blue',22,21,12,25);a('teal',24,39,3,4);a('teal',29,39,3,4);a('white',19,16,4,4);a('blue',20,17,2,2);a('white',36,17,4,5);a('fruitY',37,18,2,1);
    a('dark',42,21,12,25);a('greenL',42,21,12,7);for(let y=22;y<28;y+=2)a('grayD',42,y,12,1);for(let x=43;x<54;x+=2)a('grayD',x,28,1,18);
    a('dark',58,21,12,25);[26,31,36,41].forEach(y=>{a('brown',59,y,10,1);a('fruitO',60,y-1,2,1);a('heart',63,y-1,2,1);a('fruitY',66,y-1,2,1);});
    a('white',55,18,2,2);a('white',66,17,2,2);street();a('brown',31,47,4,3);a('greenL',30,44,6,3);a('greenL',32,42,2,2);a('white',70,41,2,1);a('white',70,42,1,5);}
  if(kind==='quintas'){if(!noSky)a('sky',0,0,72,44);
    a('white',0,0,20,34);for(let y=2;y<32;y+=4)for(let x=2;x<18;x+=5)a('grayL',x,y,3,2);
    a('blue',22,2,8,30);for(let y=4;y<30;y+=3)a('white',24,y,4,1);a('peach',36,12,7,18);for(let y=14;y<28;y+=3)a('white',38,y,3,1);
    a('white',51,0,21,34);for(let y=2;y<32;y+=4)for(let x=53;x<70;x+=5)a('grayL',x,y,3,2);
    a('brown',41,24,2,6);a('greenL',32,12,20,6);a('greenL',34,9,15,4);a('greenL',30,16,6,5);a('greenL',46,16,8,5);
    a('black',0,30,24,1);for(let x=0;x<24;x+=2)a('black',x,30,1,14);a('black',50,30,22,1);for(let x=51;x<72;x+=2)a('black',x,30,1,10);
    a('beige',50,38,22,6);for(let x=52;x<72;x+=5)a('grayD',x,38,1,6);a('grayD',50,41,22,1);
    a('green',24,22,28,5);a('greenD',24,26,28,1);a('blue',30,28,10,16);a('grayL',32,30,6,5);a('teal',26,27,3,17);a('teal',47,27,3,17);
    for(let x=40;x<47;x+=2)a('black',x,29,1,15);a('black',40,29,7,1);
    [21,50].forEach(px=>{for(let yy=28;yy<44;yy+=4){a('fruitY',px,yy,2,2);a('black',px,yy+2,2,2);}});
    a('grayL',0,44,72,12);a('grayD',20,50,6,1);a('grayD',48,52,8,1);
    [5,13,21].forEach(cx=>{a('black',cx+1,45,1,1);a('fruitY',cx,46,3,2);a('black',cx,48,3,1);a('fruitY',cx,49,3,1);a('black',cx-1,50,5,1);});[8,10,16,18].forEach(cx=>a('fruitY',cx,47,1,1));}
  return L;
}
function drawScene(ctx,kind,x,y,sc,noSky){sc=sc||1;const L=sceneRects(kind,noSky);SORDER.forEach(k=>{if(!L[k])return;ctx.fillStyle=SPAL[k];L[k].forEach(r=>ctx.fillRect(x+r[0]*sc,y+r[1]*sc,r[2]*sc,r[3]*sc));});}
