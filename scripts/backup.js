// Cópia de segurança das fontes (sem git): cria backups/AAAA-MM-DD_HHMM/ com src, scripts, data, tests e arquivos .md/.json da raiz.
// Mantém só as 15 cópias mais recentes. Uso: npm run backup
const fs=require('fs');const path=require('path');
const root=path.join(__dirname,'..');
const d=new Date(),p=n=>String(n).padStart(2,'0');
const name=`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
const out=path.join(root,'backups',name);
fs.mkdirSync(out,{recursive:true});
for(const dir of ['src','scripts','data','tests'])fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});
for(const f of fs.readdirSync(root))if(/\.(md|json)$/.test(f)&&f!=='package-lock.json')fs.copyFileSync(path.join(root,f),path.join(out,f));
const all=fs.readdirSync(path.join(root,'backups')).sort();
all.slice(0,Math.max(0,all.length-15)).forEach(o=>fs.rmSync(path.join(root,'backups',o),{recursive:true,force:true}));
console.log('Backup criado em backups/'+name);
