import {clamp, recalculate} from './world.js';

export const UNIT_TYPES = Object.freeze({
  infantry: {cost: 100, upkeep: 0.012, days: 12, strength: 100, speed: 1},
  motorized: {cost: 220, upkeep: 0.026, days: 20, strength: 170, speed: 2},
  mechanized: {cost: 410, upkeep: 0.045, days: 32, strength: 260, speed: 1.7},
  armor: {cost: 650, upkeep: 0.065, days: 40, strength: 380, speed: 1.5},
  artillery: {cost: 300, upkeep: 0.032, days: 28, strength: 190, speed: 0.8},
  airDefense: {cost: 280, upkeep: 0.025, days: 25, strength: 130, speed: 0.9},
  special: {cost: 500, upkeep: 0.04, days: 42, strength: 240, speed: 1.5},
  logistics: {cost: 190, upkeep: 0.018, days: 18, strength: 70, speed: 1.2},
  reservist: {cost: 35, upkeep: 0.004, days: 7, strength: 50, speed: 0.6, defenseOnly: true},
  paramilitary: {cost: 75, upkeep: 0.009, days: 10, strength: 65, speed: 1, defenseOnly: true}
});

export function recruitmentQuote(world, countryId, type) {
  const unit = UNIT_TYPES[type];
  const country = world.countries[countryId];
  if (!unit || !country) throw new Error('Unknown unit or country');
  const worldGDP = Object.values(world.countries).reduce((sum, c) => sum + c.gdp, 0);
  const worldPopulation = Object.values(world.countries).reduce((sum, c) => sum + c.population, 0);
  const relativeIncome = (country.gdp / Math.max(country.population, 1)) / (worldGDP / Math.max(worldPopulation, 1));
  const incomeFactor = clamp(Math.sqrt(relativeIncome), 0.6, 1.8);
  const priceFactor = clamp(1 + (country.inflation ?? 0), 0.5, 3);
  return {base: unit.cost, incomeFactor, priceFactor, total: unit.cost * incomeFactor * priceFactor};
}

export function trainingCapacity(world, countryId) {
  const c = world.countries[countryId];
  const paramilitary = world.armies.filter(a => a.country === countryId && a.type === 'paramilitary').length;
  return world.rules.trainingParallelBase + Math.floor(c.population / world.rules.trainingPopulationStep) + paramilitary;
}

export function recruit(world, countryId, type, cellId) {
  if (world.cells[cellId]?.controller !== countryId) throw new Error('Train in controlled territory');
  const quote = recruitmentQuote(world, countryId, type);
  const c = world.countries[countryId];
  if ((c.treasury ?? 0) < quote.total) throw new Error('Insufficient treasury');
  c.treasury -= quote.total;
  world.training.push({id: `training-${world.seed++}`,country:countryId,type,cell:cellId,remaining:UNIT_TYPES[type].days});
  return quote;
}

export function orderArmy(world, armyId, kind, target) {
  const army = world.armies.find(a => a.id === armyId);
  if (!army) throw new Error('Unknown army');
  if (!['move', 'attack', 'defend', 'auto', 'hold'].includes(kind)) throw new Error('Unknown order');
  if (target && !world.cells[target]) throw new Error('Unknown cell');
  if (army.type === 'reservist' && kind === 'attack') throw new Error('Reservists defend only');
  army.order = {kind, target};
}

export function splitArmy(world, armyId, share = 0.5) {
  const army = world.armies.find(a => a.id === armyId);
  if (!army || share <= 0 || share >= 1 || army.strength < 2) throw new Error('Cannot split army');
  const amount = Math.floor(army.strength * share);
  army.strength -= amount;
  const other = {...structuredClone(army), id: `army-${world.seed++}`, strength: amount};
  world.armies.push(other);
  return other;
}

export function moveArmies(world) {
  for (const army of world.armies) {
    if (!army.order || !['move','attack','auto'].includes(army.order.kind)) continue;
    let target = army.order.target;
    if (army.order.kind === 'auto') {
      target = world.cells[army.cell].neighbors.filter(id => world.cells[id].controller !== army.country)
        .sort((a,b) => cellValue(world,b)/Math.max(world.cells[b].resistance ?? 1,0.1)
          - cellValue(world,a)/Math.max(world.cells[a].resistance ?? 1,0.1))[0];
    }
    if (!target || !world.cells[army.cell].neighbors.includes(target)) continue;
    const cell = world.cells[target];
    if (cell.controller !== army.country && army.type === 'reservist') continue;
    if (cell.controller !== army.country && army.order.kind !== 'attack' && army.order.kind !== 'auto') continue;
    if (cell.controller === army.country) army.cell = target;
    else annex(world, army, target);
  }
}

function cellValue(world, cellId) {
  return world.points.filter(p => p.cell === cellId).reduce((sum,p) => sum + p.gdp + p.population / 1e6,0) + 1;
}

export function annex(world, army, target) {
  const cell = world.cells[target];
  if (!world.cells[army.cell].neighbors.includes(target)) throw new Error('No adjacent access');
  if (cell.controller === army.country) return false;
  const defender = world.armies.filter(a => a.country === cell.controller && a.cell === target)
    .reduce((sum,a) => sum + a.strength * a.equipment * a.morale / 100, 0);
  const attacker = army.strength * army.equipment * army.morale / 100;
  const superiority = clamp(attacker / Math.max(defender,1), 0.25, 4);
  const resistance = Math.max(0, cell.resistance ?? 0);
  const advance = world.rules.annexBase * (UNIT_TYPES[army.type]?.speed ?? 1) *
    (army.supply ?? 1) * army.morale / 100 * superiority ** 0.35 *
    (cell.terrainFactor ?? 1) / (1 + resistance * world.rules.resistanceWeight);
  if (!world.countries[army.country].wars?.includes(cell.controller)) {
    (world.countries[army.country].wars ??= []).push(cell.controller);
    (world.countries[cell.controller].wars ??= []).push(army.country);
    world.events.push({day: world.day,type:'war',attacker:army.country,defender:cell.controller});
  }
  cell.progress = (cell.progress ?? 0) + advance;
  if (resistance > world.rules.militiaThreshold) {
    army.strength = Math.max(1, army.strength * (1 - world.rules.militiaDamage * resistance));
    world.events.push({day:world.day,type:'resistance',cell:target,country:army.country});
  }
  if (cell.progress < 1 || defender > attacker) return false;
  const previous = cell.controller;
  world.annexHistory.push({cell:target,previous,current:army.country,day:world.day});
  cell.controller = army.country; cell.progress = 0; cell.resistance = clamp(resistance + 0.2,0,1);
  army.cell = target; army.morale = clamp(army.morale + world.rules.moraleCaptureGain,0,100);
  for (const other of world.armies.filter(a => a.country === previous && a.cell === target)) {
    other.strength *= 0.7; other.morale = clamp(other.morale - world.rules.moraleLoss,0,100);
  }
  world.events.push({day:world.day,type:'annex',cell:target,from:previous,to:army.country});
  recalculate(world);
  return true;
}

export function undoAnnex(world) {
  const last = world.annexHistory.pop();
  if (!last || world.cells[last.cell].controller !== last.current) return false;
  world.cells[last.cell].controller = last.previous;
  world.cells[last.cell].progress = 0;
  world.events.push({day:world.day,type:'annex-undo',...last});
  recalculate(world);
  return true;
}

export function advanceTraining(world) {
  const active = new Map();
  for (const item of world.training) {
    const used = active.get(item.country) ?? 0;
    if (used >= trainingCapacity(world,item.country)) continue;
    active.set(item.country,used+1);
    item.remaining--;
    if (item.remaining <= 0) world.armies.push({id:`army-${world.seed++}`,country:item.country,
      type:item.type,cell:item.cell,strength:UNIT_TYPES[item.type].strength,
      equipment:1,morale:75,supply:1,order:{kind:'hold',target:null}});
  }
  world.training = world.training.filter(item => item.remaining > 0);
}
