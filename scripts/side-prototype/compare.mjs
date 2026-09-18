import {execFileSync} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
const [before='before',after='a']=process.argv.slice(2);
const suffixes=['','-Map','-Counterfactual','-Full','-Timeline',...(before==='a'?['-Clock']:[])];
const results=[];
for(const suffix of suffixes)for(const f of [60,180,300,420,540,660,780]){
 const name=`ClaimIntake-SideBySide${suffix}-${f}.png`;
 execFileSync('cmp',[`out/side-prototype/${before}/${name}`,`out/side-prototype/${after}/${name}`]);
 results.push(`cmp PASS ${name}`);
}
await writeFile(`out/side-prototype/cmp-${before}-${after}.txt`,results.join('\n')+'\n');
console.log(`${results.length} PNG files byte-identical (${before} → ${after})`);
