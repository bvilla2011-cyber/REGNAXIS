import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemoWorld} from '../src/data/demo.js';
import {relation,proposeTreaty,breakTreaty,declareWar,negotiatePeace,diplomaticCost} from '../src/sim/diplomacy.js';
import {invest,researchQuote,researchState,researchDay} from '../src/sim/research.js';
import {evaluateCountry,runAI} from '../src/ai/planner.js';
import {recalculate} from '../src/sim/world.js';

test('treaties spend points, create obligations, and breaking one harms standing',()=>{
  const w=createDemoWorld();w.countries.A.researchPoints=100;
  const quote=diplomaticCost(w,'A',12);
  assert.equal(quote,12);
  const result=proposeTreaty(w,'A','B','nonAggression');
  assert.equal(result.accepted,true);
  assert.equal(w.countries.A.researchPoints,88);
  assert.equal(relation(w,'A','B').treaties[0].type,'nonAggression');
  assert.equal(breakTreaty(w,'A','B','nonAggression'),true);
  assert.equal(w.countries.A.standing,88);
  assert.ok(diplomaticCost(w,'A',12)>12);
});

test('breaking a truce to declare war has a larger international cost',()=>{
  const w=createDemoWorld();w.countries.A.researchPoints=100;
  proposeTreaty(w,'A','B','truce');
  assert.equal(declareWar(w,'A','B'),true);
  assert.equal(w.countries.A.standing,75);
  assert.equal(relation(w,'A','B').atWar,true);
  assert.equal(w.events.at(-1).ceasefireBroken,true);
});

test('peace transfers only controlled cells and reparations atomically',()=>{
  const w=createDemoWorld();declareWar(w,'A','B');
  assert.throws(()=>negotiatePeace(w,'A','B',{reparations:100,transfer:['west']}),/Invalid territorial/);
  assert.equal(w.countries.B.treasury,800);
  negotiatePeace(w,'A','B',{reparations:100,transfer:['middle']});
  recalculate(w);
  assert.equal(w.cells.middle.owner,'A');
  assert.equal(w.countries.A.gdp,600);
  assert.equal(w.countries.B.treasury,700);
  assert.equal(relation(w,'A','B').atWar,false);
});

test('paired research locks the alternative; prerequisites and area project apply',()=>{
  const w=createDemoWorld();w.countries.A.researchPoints=200;
  assert.equal(researchQuote(w,'A','labs').available,false);
  invest(w,'A','industry');
  assert.equal(researchQuote(w,'A','ecology').available,false);
  assert.throws(()=>invest(w,'A','ecology'),/requirements/);
  assert.equal(researchQuote(w,'A','labs').available,true);
  invest(w,'A','labs');
  w.cells.west.resistance=0.5;
  invest(w,'A','restoration',{area:['west']});
  assert.equal(w.cells.west.resistance,0.35);
  assert.equal(researchState(w,'A').effects.growth,0.003);
});

test('continuous project consumes daily research and can be unfunded',()=>{
  const w=createDemoWorld();w.countries.A.researchPoints=20;
  invest(w,'A','welfare',{daily:2});
  researchDay(w);
  assert.equal(w.countries.A.researchPoints,16);
  assert.equal(researchState(w,'A').effects.migration,0.001);
  w.countries.A.researchPoints=0;researchDay(w);
  assert.equal(researchState(w,'A').effects.migration,0);
});

test('AI provides reasons and repeats deterministically without targeting the human',()=>{
  const a=createDemoWorld({player:'A'}), b=createDemoWorld({player:'A'});
  assert.ok(evaluateCountry(a,'B').selected.reasons.length);
  runAI(a);runAI(b);
  assert.deepEqual(a,b);
  assert.deepEqual(Object.keys(a.aiReasons),['B']);
});
