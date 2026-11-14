import {rulesWith} from '../data/rules.js';

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const deepCopy = value => structuredClone(value);

export function createWorld({countries, cells, points, armies = [], rules = {}, seed = 1, player = null}) {
  const world = {version: 1, day: 0, hour: 0, seed: seed >>> 0, player,
    rules: rulesWith(rules), countries: deepCopy(countries), cells: deepCopy(cells),
    points: deepCopy(points), armies: deepCopy(armies), fleets: [], blockades: [], training: [], events: [],
    annexHistory: [], victoryStreak: {}, winner: null};
  validateWorld(world);
  recalculate(world);
  return world;
}

export function validateWorld(world) {
  const countryIds = new Set(Object.keys(world.countries));
  if (!countryIds.size) throw new Error('World needs countries');
  for (const [id, cell] of Object.entries(world.cells)) {
    if (!countryIds.has(cell.owner) || !countryIds.has(cell.controller)) throw new Error(`Invalid owner in ${id}`);
    for (const neighbor of cell.neighbors) if (!world.cells[neighbor]) throw new Error(`Missing neighbor ${neighbor}`);
  }
  for (const point of world.points) {
    if (!world.cells[point.cell]) throw new Error(`Point outside map: ${point.id}`);
    if (point.population < 0 || point.gdp < 0) throw new Error(`Negative value: ${point.id}`);
  }
  for (const army of world.armies) {
    if (!countryIds.has(army.country) || !world.cells[army.cell]) throw new Error(`Invalid army ${army.id}`);
  }
}

export function recalculate(world) {
  for (const country of Object.values(world.countries)) {
    country.gdp = 0; country.population = 0; country.territory = 0;
  }
  for (const cell of Object.values(world.cells)) world.countries[cell.controller].territory += cell.area ?? 1;
  for (const point of world.points) {
    const country = world.countries[world.cells[point.cell].controller];
    country.gdp += point.gdp * (point.productivity ?? 1);
    country.population += point.population;
  }
  return world;
}

export function ranking(world) {
  recalculate(world);
  const total = Object.values(world.countries).reduce((sum, c) => sum + c.gdp, 0);
  return Object.entries(world.countries).map(([id, c]) => ({id, gdp: c.gdp, share: total ? c.gdp / total : 0}))
    .sort((a, b) => b.gdp - a.gdp || a.id.localeCompare(b.id));
}

export function checkVictory(world, mode = 'casual') {
  if (world.winner) return world.winner;
  const ranks = ranking(world);
  const totalPopulation = Object.values(world.countries).reduce((sum, c) => sum + c.population, 0);
  const totalTerritory = Object.values(world.countries).reduce((sum, c) => sum + c.territory, 0);
  const totalPower = world.armies.reduce((sum, army) => sum + army.strength * army.equipment, 0);
  for (const row of ranks) {
    const country = world.countries[row.id];
    const power = world.armies.filter(a => a.country === row.id).reduce((sum, a) => sum + a.strength * a.equipment, 0);
    const score = mode === 'hardcore'
      ? 0.5 * row.share + 0.2 * (totalPopulation ? country.population / totalPopulation : 0)
        + 0.2 * (totalPower ? power / totalPower : 0) + 0.1 * (totalTerritory ? country.territory / totalTerritory : 0)
      : row.share;
    world.victoryStreak[row.id] = score > world.rules.victoryShare ? (world.victoryStreak[row.id] ?? 0) + 1 : 0;
    const hold = mode === 'hardcore' ? world.rules.hardcoreHoldDays : world.rules.victoryHoldDays;
    if (world.victoryStreak[row.id] >= hold) world.winner = row.id;
  }
  return world.winner;
}
