import {clamp,recalculate} from './world.js';
export function economyDay(world){recalculate(world);for(const [id,c] of Object.entries(world.countries)){
  const budget=c.budget??{tax:.25,research:.02,military:.05,social:.08},out=(budget.research+budget.military+budget.social)*c.gdp/365,income=budget.tax*c.gdp/365,deficit=Math.max(0,out-income),growth=world.rules.growthBase-(c.inflation??0)*.35-deficit/Math.max(c.gdp,1)*.045;
  c.treasury=(c.treasury??0)+income-out;c.inflation=clamp((c.inflation??0)+deficit/Math.max(c.gdp,1)*.01-.0001,-.05,1);
  for(const point of world.points.filter(p=>world.cells[p.cell].controller===id)){point.gdp=Math.max(0,point.gdp*(1+growth/365));point.population=Math.max(0,point.population*(1+(.007+(budget.social-.08)*.002)/365));if(c.treasury<0)point.productivity=clamp((point.productivity??1)-.0001,.2,2);}
  for(const army of world.armies.filter(a=>a.country===id))army.equipment=clamp((army.equipment??1)-world.rules.annualEquipmentDecay/365-(c.treasury<0?.001:0),0,1);
 }recalculate(world);}
