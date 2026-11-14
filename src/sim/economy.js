import {clamp, recalculate} from './world.js';
import {UNIT_TYPES} from './army.js';

export function economyDay(world) {
  recalculate(world);
  const totalGDP = Object.values(world.countries).reduce((s,c)=>s+c.gdp,0);
  const totalPopulation = Object.values(world.countries).reduce((s,c)=>s+c.population,0);
  const worldIncome = totalGDP / Math.max(totalPopulation,1);
  for (const [id,c] of Object.entries(world.countries)) {
    const b = c.budget ?? {tax:0.22,research:0.03,military:0.05,social:0.08};
    const revenue = c.gdp * b.tax / 365;
    const maintenance = world.armies.filter(a=>a.country===id)
      .reduce((s,a)=>s+(UNIT_TYPES[a.type]?.upkeep ?? 0)*a.strength/365,0);
    const spending = c.gdp * (b.research+b.military+b.social)/365 + maintenance;
    const balance = revenue-spending-(c.debt ?? 0)*world.rules.debtInterest/365;
    c.treasury = (c.treasury ?? 0)+balance;
    if (c.treasury<0) {c.debt=(c.debt??0)-c.treasury;c.treasury=0;}
    const income = c.gdp/Math.max(c.population,1);
    const convergence = clamp(Math.sqrt(worldIncome/Math.max(income,0.001)),0.5,1.8);
    const overspend = Math.max(0,b.research+b.military+b.social-b.tax);
    const growth = world.rules.growthBase*convergence+(c.policyGrowth??0)
      -overspend*world.rules.fiscalDrag-Math.max(0,(c.inflation??0)-0.03)*world.rules.inflationDrag;
    const migration = clamp((b.social-0.06)*world.rules.socialMigrationFactor+
      (c.research?.effects?.migration??0), -0.002,0.002);
    for (const p of world.points.filter(p=>world.cells[p.cell].controller===id)) {
      p.gdp=Math.max(0,p.gdp*(1+growth/365));
      p.population=Math.max(0,p.population*(1+(world.rules.annualPopulationGrowth+migration)/365));
    }
    c.inflation=clamp((c.inflation??0)*0.999+Math.max(0,overspend)*0.0002,0,2);
    c.researchPoints=(c.researchPoints??0)+world.rules.baseResearchRate*Math.sqrt(Math.max(0,b.research*c.gdp))
      *Math.sqrt(Math.max(c.population,1)/1e6)*clamp(Math.sqrt(income/Math.max(worldIncome,0.001)),0.35,1.35);
    for (const army of world.armies.filter(a=>a.country===id)) {
      const funded=Math.min(1,b.military/Math.max(0.001,0.05));
      army.equipment=clamp(army.equipment-(world.rules.annualEquipmentDecay+
        (1-funded)*world.rules.underfundingDecay)/365,0.1,1);
    }
  }
  recalculate(world);
}
