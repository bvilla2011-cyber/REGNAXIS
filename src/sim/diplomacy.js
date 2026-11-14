import {clamp} from './world.js';

export const TREATIES = Object.freeze({
  alliance:{cost:30,duration:0}, truce:{cost:8,duration:365}, nonAggression:{cost:12,duration:730},
  trade:{cost:10,duration:1095}, militaryAccess:{cost:15,duration:365},
  defense:{cost:25,duration:730}, protectorate:{cost:50,duration:0},
  vassalage:{cost:60,duration:0}, embargo:{cost:8,duration:365}, sanctions:{cost:12,duration:365}
});

export function pairKey(a,b) {if(a===b) throw new Error('A country cannot negotiate with itself');return [a,b].sort().join('|');}
export function relation(world,a,b) {
  if(!world.countries[a] || !world.countries[b]) throw new Error('Unknown country');
  const key=pairKey(a,b);
  world.diplomacy ??={};
  return world.diplomacy[key] ??= {value:50,trust:50,grievances:0,treaties:[],atWar:false};
}

export function diplomaticCost(world,countryId,base) {
  const standing=clamp(world.countries[countryId].standing??100,0,100);
  return base*(1+(100-standing)/100);
}

export function explainTreaty(world,a,b,type) {
  if(!TREATIES[type]) throw new Error('Unknown treaty');
  const pair=relation(world,a,b), cost=diplomaticCost(world,a,TREATIES[type].cost);
  const utility=pair.value*0.55+pair.trust*0.3-pair.grievances*0.25
    +(type==='trade'?15:0)+(type==='alliance'||type==='defense'?-10:0)
    -(pair.atWar && type!=='truce'?60:0);
  return {cost,utility,accepted:utility>=38,
    factors:{relation:pair.value,trust:pair.trust,grievances:pair.grievances,war:pair.atWar}};
}

export function proposeTreaty(world,a,b,type,{force=false,terms={}}={}) {
  const decision=explainTreaty(world,a,b,type), country=world.countries[a],pair=relation(world,a,b);
  if(!force && !decision.accepted) return {accepted:false,...decision};
  if((country.researchPoints??0)<decision.cost) throw new Error('Insufficient diplomatic research');
  if(pair.treaties.some(t=>t.type===type)) throw new Error('Treaty already active');
  country.researchPoints-=decision.cost;
  const treaty={type,parties:[a,b],start:world.day,end:TREATIES[type].duration?world.day+TREATIES[type].duration:null,terms};
  pair.treaties.push(treaty);
  pair.value=clamp(pair.value+(type==='alliance'?15:5),0,100);
  pair.trust=clamp(pair.trust+5,0,100);
  if(type==='truce') pair.atWar=false;
  world.events.push({day:world.day,type:'treaty',treaty});
  return {accepted:true,treaty,...decision};
}

export function breakTreaty(world,a,b,type) {
  const pair=relation(world,a,b),index=pair.treaties.findIndex(t=>t.type===type);
  if(index<0) return false;
  pair.treaties.splice(index,1);
  pair.value=clamp(pair.value-15,0,100);pair.trust=clamp(pair.trust-20,0,100);
  world.countries[a].standing=clamp((world.countries[a].standing??100)-12,0,100);
  world.events.push({day:world.day,type:'treaty-break',country:a,target:b,treaty:type});
  return true;
}

export function declareWar(world,a,b,{surprise=false}={}) {
  const pair=relation(world,a,b);
  if(pair.atWar) return false;
  const ceasefire=pair.treaties.some(t=>['truce','nonAggression'].includes(t.type));
  pair.treaties=pair.treaties.filter(t=>!['alliance','defense','truce','nonAggression'].includes(t.type));
  pair.atWar=true;pair.value=Math.min(pair.value,20);pair.grievances=clamp(pair.grievances+30,0,100);
  world.countries[a].standing=clamp((world.countries[a].standing??100)-(ceasefire?25:surprise?12:8),0,100);
  for(const [x,y] of [[a,b],[b,a]]) {
    world.countries[x].wars??=[];
    if(!world.countries[x].wars.includes(y)) world.countries[x].wars.push(y);
  }
  world.events.push({day:world.day,type:'war',attacker:a,defender:b,ceasefireBroken:ceasefire});
  return true;
}

export function negotiatePeace(world,a,b,{reparations=0,transfer=[]}={}) {
  const pair=relation(world,a,b);
  if(!pair.atWar) throw new Error('Countries are not at war');
  if(reparations<0 || !Number.isFinite(reparations)) throw new Error('Invalid reparations');
  if((world.countries[b].treasury??0)<reparations) throw new Error('Reparations exceed treasury');
  for(const cellId of transfer) {
    const cell=world.cells[cellId];
    if(!cell || cell.controller!==b) throw new Error(`Invalid territorial transfer: ${cellId}`);
  }
  world.countries[b].treasury-=reparations;world.countries[a].treasury+=reparations;
  for(const cellId of transfer) {world.cells[cellId].controller=a;world.cells[cellId].owner=a;}
  pair.atWar=false;pair.value=clamp(pair.value+20,0,100);
  for(const [x,y] of [[a,b],[b,a]]) world.countries[x].wars=(world.countries[x].wars??[]).filter(id=>id!==y);
  pair.treaties.push({type:'truce',parties:[a,b],start:world.day,end:world.day+365,terms:{reparations,transfer}});
  world.events.push({day:world.day,type:'peace',parties:[a,b],reparations,transfer});
}

export function diplomacyDay(world) {
  for(const pair of Object.values(world.diplomacy??{})) {
    pair.treaties=pair.treaties.filter(t=>t.end===null || t.end>world.day);
    if(!pair.atWar) pair.value=clamp(pair.value+(50-pair.value)*0.0005,0,100);
    pair.grievances=clamp(pair.grievances-0.01,0,100);
  }
  for(const country of Object.values(world.countries)) country.standing=clamp((country.standing??100)+0.005,0,100);
}
