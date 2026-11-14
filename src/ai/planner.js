import {relation,treaty} from '../sim/diplomacy.js';
import {order,recruit} from '../sim/army.js';

export function planAI(world,id){
  const country=world.countries[id];if(!country)return null;
  const army=world.armies.find(a=>a.country===id&&a.strength>20);
  const owned=Object.entries(world.cells).filter(([,cell])=>cell.controller===id);
  const border=owned.flatMap(([cellId,cell])=>cell.neighbors.map(target=>({cellId,target}))).filter(({target})=>world.cells[target].controller!==id);
  if(!army)return {country:id,action:'recruit',target:owned[0]?.[0],reasons:['Defensa insuficiente','Tesoro disponible']};
  const adjacent=border.filter(b=>b.cellId===army.cell);
  const options=adjacent.map(({target})=>{const foe=world.cells[target].controller,pair=relation(world,id,foe);
    const prize=world.points.filter(p=>p.cell===target).reduce((sum,p)=>sum+p.gdp,0);
    const defense=world.armies.filter(a=>a.country===foe&&a.cell===target).reduce((sum,a)=>sum+a.strength,0);
    const score=prize/20-defense/10-(world.mode==='casual'&&foe===world.player?20:0)-(pair.treaties.some(t=>t.type==='nonAggression')?100:0);
    return {target,prize,defense,score};}).sort((a,b)=>b.score-a.score);
  if(options.length&&options[0].score>2&&country.treasury>80){const best=options[0];return {country:id,action:'expand',army:army.id,target:best.target,score:best.score,
    reasons:[`PIB objetivo ${best.prize.toFixed(0)}`,`Defensa estimada ${best.defense.toFixed(0)}`,`Margen ${best.score.toFixed(1)}`]};}
  return {country:id,action:country.treasury<100?'rebuild':'cooperate',target:border[0]?.target,reasons:[`Tesoro ${country.treasury.toFixed(0)}`,'No hay ataque favorable']};
}
export function runAI(world){world.aiLog??=[];for(const id of Object.keys(world.countries)){
  if(id===world.player)continue;const plan=planAI(world,id);if(!plan)continue;
  world.aiLog.push({day:world.day,...plan});
  if(plan.action==='expand')order(world,plan.army,'attack',plan.target);
  if(plan.action==='recruit'&&plan.target&&world.countries[id].treasury>150)try{recruit(world,id,'infantry',plan.target);}catch{}
  if(plan.action==='cooperate'&&plan.target&&(world.countries[id].researchPoints??0)>10)try{treaty(world,id,world.cells[plan.target].controller,'trade');}catch{}
 }world.aiLog=world.aiLog.slice(-60);}
