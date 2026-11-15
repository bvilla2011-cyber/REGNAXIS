import {relation,treaty} from '../sim/diplomacy.js';
import {order,recruit} from '../sim/army.js';
import {sameBloc} from '../data/blocs.js';

export function planAI(world,id){
 const country=world.countries[id];if(!country)return null;
 const army=world.armies.find(a=>a.country===id&&a.strength>25&&!a.order);
 const owned=Object.entries(world.cells).filter(([,cell])=>cell.controller===id);
 const border=owned.flatMap(([cellId,cell])=>cell.neighbors.map(target=>({cellId,target}))).filter(({target})=>world.cells[target].controller!==id);
 if(!army)return {country:id,action:country.treasury>150?'recruit':'rebuild',target:owned[0]?.[0],reasons:['Defensa insuficiente',`Tesoro ${country.treasury.toFixed(0)}`]};
 const adjacent=border.filter(b=>b.cellId===army.cell);
 const options=adjacent.map(({target})=>{const foe=world.cells[target].controller,pair=relation(world,id,foe);
  const prize=world.points.filter(p=>p.cell===target).reduce((sum,p)=>sum+p.gdp,0);
  const defense=world.armies.filter(a=>a.country===foe&&a.cell===target).reduce((sum,a)=>sum+a.strength,0);
  const pacts=pair.treaties.some(t=>['nonAggression','truce','alliance','defense','trade','militaryAccess'].includes(t.type));
  const allowed=!sameBloc(id,foe)&&!pacts&&pair.value<world.rules.aiMinRelationForWar&&country.treasury>120&&army.strength>defense*1.35;
  const score=prize*.035+army.strength*.12-defense*.17-pair.value*.9-(foe===world.player?12:0);
  return {target,foe,prize,defense,score,allowed,relation:pair.value};}).filter(x=>x.allowed).sort((a,b)=>b.score-a.score);
 if(options[0]?.score>world.rules.aiWarThreshold){const best=options[0];return {country:id,action:'expand',army:army.id,target:best.target,score:best.score,reasons:[`Disputa fronteriza: relación ${best.relation.toFixed(0)}`,`PIB ${best.prize.toFixed(0)} frente a defensa ${best.defense.toFixed(0)}`,`Utilidad ${best.score.toFixed(1)}`]};}
 const friendly=adjacent.find(({target})=>{const foe=world.cells[target].controller,p=relation(world,id,foe);return !p.atWar&&p.value>=55&&!p.treaties.some(t=>t.type==='trade')&&country.treasury>60;});
 return {country:id,action:country.treasury<100?'rebuild':'cooperate',target:friendly?.target,reasons:[`Tesoro ${country.treasury.toFixed(0)}`,'Sin ataque justificado; priorizar estabilidad']};
}
export function runAI(world){world.aiLog??=[];for(const id of Object.keys(world.countries)){
 if(id===world.player)continue;const plan=planAI(world,id);if(!plan)continue;
 world.aiLog.push({day:world.day,...plan});if(plan.action==='expand'){order(world,plan.army,'attack',plan.target);world.events.push({day:world.day,type:'warning',a:id,b:world.cells[plan.target].controller,reasons:plan.reasons});}
 if(plan.action==='recruit'&&plan.target)try{recruit(world,id,'infantry',plan.target);}catch{}
 if(plan.action==='cooperate'&&plan.target&&(world.countries[id].researchPoints??0)>10)try{treaty(world,id,world.cells[plan.target].controller,'trade');}catch{}
 }world.aiLog=world.aiLog.slice(-120);}
