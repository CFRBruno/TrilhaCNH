// Roda scripts/build.py com o Python que existir (python3, python ou py), em qualquer sistema.
const {spawnSync}=require('child_process');const path=require('path');
const script=path.join(__dirname,'build.py');
for(const [cmd,pre] of [['python3',[]],['python',[]],['py',['-3']]]){
  const r=spawnSync(cmd,[...pre,script],{stdio:'inherit'});
  if(r.error)continue;                       // comando não existe
  if(r.status===9009)continue;               // atalho vazio do Windows
  process.exit(r.status===null?1:r.status);
}
console.error('Python não encontrado. Instale o Python 3 (python.org) e tente de novo.');process.exit(1);
