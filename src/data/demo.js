import {createWorld} from '../sim/world.js';

// Fictional miniature world for exercising the engine; not a claim of real-world data.
export function createDemoWorld(overrides={}) {
  return createWorld({
    countries:{A:{name:'Aurel',treasury:1000,budget:{tax:0.25,research:0.02,military:0.05,social:0.08}},
      B:{name:'Bruma',treasury:800,budget:{tax:0.25,research:0.02,military:0.05,social:0.08}}},
    cells:{west:{owner:'A',controller:'A',neighbors:['middle'],area:1},
      middle:{owner:'B',controller:'B',neighbors:['west','east'],area:1,resistance:0.2},
      east:{owner:'B',controller:'B',neighbors:['middle'],area:1}},
    points:[{id:'p1',cell:'west',gdp:400,population:4_000_000},
      {id:'p2',cell:'middle',gdp:200,population:2_000_000},
      {id:'p3',cell:'east',gdp:400,population:4_000_000}],
    armies:[{id:'a1',country:'A',cell:'west',type:'infantry',strength:100,equipment:1,morale:80,supply:1}],
    ...overrides
  });
}
