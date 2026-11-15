import {readdirSync,readFileSync,writeFileSync} from 'node:fs';import {join} from 'node:path';
function list(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?list(join(dir,item.name)):[join(dir,item.name)]);}
const assets=list('dist').filter(p=>!p.endsWith('sw.js')).map(p=>'./'+p.slice(5).replaceAll('\\','/'));
const source=readFileSync('sw.js','utf8');writeFileSync('dist/sw.js',source.replace(/const PRELOAD=\[[\s\S]*?\];/,`const PRELOAD=${JSON.stringify(assets)};`));
