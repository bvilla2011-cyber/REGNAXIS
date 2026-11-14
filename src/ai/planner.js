import {ranking,clamp} from '../sim/world.js';
import {relation,declareWar,proposeTreaty} from '../sim/diplomacy.js';
import {orderArmy} from '../sim/army.js';

// Deterministic utility planner. Every choice carries its visible reasons.
export function evaluateCountry(world,id) {
  const country=world.countries[id], ranks=ranking(world);
  const army=world.armies.find(a=>a.country===id);
  const neighbors=new Set(Object.entries(world.cells).filter(([,cell])=>cell.controller===id)
    .flatMap(([,cell])=>cell.neighbors.map(n=>world.cells[n].controller)).filter(other=>other!==id));
  const options=[];
  if(country.debt>country.gdp*0.5) options.push({kind:'rebuild',utility:75,reasons:['high-debt']});
  if(country.wars?.length) options.push({kind:'defend',utility:70,reasons:['active-war']});
  for(const target of [...neighbors].sort()) {
    const pair=relation(world,id,target);
    const targetRank=ranks.find(r=>r.id===target);
    const armyPower=world.armies.filter(a=>a.country===id).reduce((s,a)=>s+a.strength*a.equipment,0);
    const defensePower=world.armies.filter(a=>a.country===target).reduce((s,a)=>s+a.strength*a.equipment,0);
    const danger=defensePower/Math.max(armyPower,1);
    if(!pair.atWar && pair.value>=55 && !pair.treaties.some(t=>t.type==='trade'))
      options.push({kind:'trade',target,utility:45+pair.value/5,reasons:['friendly-border','trade-opportunity']});
    if(army && !pair.atWar && !pair.treaties.some(t=>['truce','nonAggression','alliance'].includes(t.type)))
      options.push({kind:'prepare',target,utility:clamp(42+targetRank.share*20-danger*22-pair.value*0.14,0,80),
        reasons:['border-access',danger>1?'strong-defender':'military-advantage']});
  }
  options.push({kind:'rebuild',utility:25,reasons:['baseline-growth']});
  options.sort((a,b)=>b.utility-a.utility||a.kind.localeCompare(b.kind)||(a.target??'').localeCompare(b.target??''));
  return {country:id,selected:options[0],alternatives:options.slice(1,4)};
}

export function runAI(world,{aggression=1,enableWars=true}={}) {
  world.aiReasons??={};
  for(const id of Object.keys(world.countries).sort()) {
    if(id===world.player) continue;
    const plan=evaluateCountry(world,id);world.aiReasons[id]=plan;
    const {kind,target}=plan.selected;
    if(kind==='rebuild') {
      const c=world.countries[id];c.budget??={tax:0.22,research:0.03,military:0.05,social:0.08};
      if(c.debt>c.gdp*0.5)c.budget.military=clamp(c.budget.military-0.001,0.02,0.2);
    }
    if(kind==='trade' && target && (world.countries[id].researchPoints??0)>=10) {
      try {proposeTreaty(world,id,target,'trade');} catch {/* A failed offer changes no state. */}
    }
    if(kind==='prepare' && target && enableWars && aggression>0 && plan.selected.utility*aggression>55) {
      const army=world.armies.find(a=>a.country===id && world.cells[a.cell].neighbors.some(n=>world.cells[n].controller===target));
      if(army) {
        const destination=world.cells[army.cell].neighbors.find(n=>world.cells[n].controller===target);
        world.events.push({day:world.day,type:'war-warning',country:id,target,reasons:plan.selected.reasons});
        if((world.aiWarnings?.[`${id}|${target}`]??world.day)<=world.day-7) {
          declareWar(world,id,target);
          orderArmy(world,army.id,'attack',destination);
        } else (world.aiWarnings??={})[`${id}|${target}`]??=world.day;
      }
    }
  }
  return world.aiReasons;
}
