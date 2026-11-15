import {normalizeRules} from '../data/rules.js';
export const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
export function createWorld({countries,cells,points,armies=[],seed=1,rules={}}){
  const world={version:1,day:0,seed,countries:structuredClone(countries),cells:structuredClone(cells),points:structuredClone(points),armies:structuredClone(armies),rules:normalizeRules(rules),events:[],annexHistory:[],streak:{},winner:null};
  validate(world);return recalculate(world);
}
export function validate(world){const ids=new Set(Object.keys(world.countries));if(!ids.size)throw Error('Mundo sin países');
  for(const [id,cell] of Object.entries(world.cells)){if(!ids.has(cell.controller))throw Error(`Control inválido: ${id}`);for(const next of cell.neighbors)if(!world.cells[next])throw Error(`Vecino inválido: ${next}`);}
  for(const point of world.points)if(!world.cells[point.cell]||point.controller&&!ids.has(point.controller)||point.gdp<0||point.population<0)throw Error(`Punto inválido: ${point.id}`);
  for(const army of world.armies)if(!ids.has(army.country)||!world.cells[army.cell])throw Error(`Ejército inválido: ${army.id}`);
}
export function recalculate(world){for(const country of Object.values(world.countries)){country.gdp=0;country.population=0;country.territory=0;}
  for(const cell of Object.values(world.cells))world.countries[cell.controller].territory+=cell.area??1;
  for(const point of world.points){const country=world.countries[point.controller??world.cells[point.cell].controller];country.gdp+=point.gdp*(point.productivity??1);country.population+=point.population;}return world;}
export function ranking(world){recalculate(world);const total=Object.values(world.countries).reduce((sum,c)=>sum+c.gdp,0);return Object.entries(world.countries).map(([id,c])=>({id,gdp:c.gdp,share:total?c.gdp/total:0})).sort((a,b)=>b.share-a.share||a.id.localeCompare(b.id));}
export function victory(world,mode='casual'){const ranks=ranking(world),cs=Object.values(world.countries),pop=cs.reduce((s,c)=>s+c.population,0),land=cs.reduce((s,c)=>s+c.territory,0),power=world.armies.reduce((s,a)=>s+a.strength*(a.equipment??1),0);
  for(const row of ranks){const c=world.countries[row.id],p=world.armies.filter(a=>a.country===row.id).reduce((s,a)=>s+a.strength*(a.equipment??1),0);
    const score=mode==='hardcore'?.5*row.share+.2*c.population/Math.max(pop,1)+.2*p/Math.max(power,1)+.1*c.territory/Math.max(land,1):row.share;
    world.streak[row.id]=score>world.rules.victoryShare?(world.streak[row.id]??0)+1:0;
    if(world.streak[row.id]>=(mode==='hardcore'?world.rules.hardcoreHoldDays:world.rules.victoryHoldDays))world.winner=row.id;
  }return world.winner;}
