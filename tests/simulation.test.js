import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemoWorld} from '../src/data/demo.js';
import {checkVictory, ranking, recalculate} from '../src/sim/world.js';
import {orderArmy, splitArmy, moveArmies, undoAnnex, recruit, recruitmentQuote} from '../src/sim/army.js';
import {economyDay} from '../src/sim/economy.js';
import {stepDays, snapshot, restore} from '../src/sim/engine.js';
import {buildSpatialIndex,querySpatial} from '../src/sim/spatial.js';

test('victory requires strict GDP majority held for configured days',()=>{
  const world=createDemoWorld({rules:{victoryHoldDays:2}});
  assert.equal(checkVictory(world),null);
  world.points[0].gdp=800;
  assert.equal(checkVictory(world),null);
  assert.equal(checkVictory(world),'A');
  assert.ok(ranking(world)[0].share>0.5);
});

test('annexation follows adjacency, transfers point GDP, and can be undone',()=>{
  const world=createDemoWorld({rules:{annexBase:4}});
  orderArmy(world,'a1','attack','middle');
  moveArmies(world);
  assert.equal(world.cells.middle.controller,'A');
  assert.equal(world.countries.A.gdp,600);
  assert.equal(world.events[0].type,'war');
  assert.equal(undoAnnex(world),true);
  assert.equal(world.cells.middle.controller,'B');
  assert.equal(world.countries.A.gdp,400);
});

test('resistance slows occupation and wears down forces',()=>{
  const world=createDemoWorld({rules:{annexBase:0.1}});
  world.cells.middle.resistance=0.9;
  orderArmy(world,'a1','attack','middle');
  moveArmies(world);
  assert.ok(world.cells.middle.progress<0.1);
  assert.ok(world.armies[0].strength<100);
});

test('recruitment quote is explained and training uses a treasury',()=>{
  const world=createDemoWorld();
  const price=recruitmentQuote(world,'A','infantry');
  assert.equal(price.total,price.base*price.incomeFactor*price.priceFactor);
  recruit(world,'A','infantry','west');
  assert.ok(world.countries.A.treasury<1000);
  assert.equal(world.training.length,1);
  const fragment=splitArmy(world,'a1',0.4);
  assert.equal(fragment.strength+world.armies[0].strength,100);
});

test('economy changes output, research, population and equipment without negatives',()=>{
  const world=createDemoWorld();
  const before=world.countries.A.gdp;
  economyDay(world);
  assert.ok(world.countries.A.gdp>before);
  assert.ok(world.countries.A.researchPoints>0);
  assert.ok(world.armies[0].equipment<1);
  assert.ok(world.countries.A.population>4_000_000);
  recalculate(world);
});

test('same seed and commands yield identical worlds; snapshot restores independently',()=>{
  const a=createDemoWorld(); const b=createDemoWorld();
  orderArmy(a,'a1','attack','middle'); orderArmy(b,'a1','attack','middle');
  stepDays(a,2); stepDays(b,2);
  assert.deepEqual(a,b);
  const saved=snapshot(a);
  stepDays(a,1);
  assert.deepEqual(restore(saved),b);
});

test('spatial index finds only points inside a touch radius',()=>{
  const items=Array.from({length:100},(_,i)=>({id:i,x:i%10*10,y:Math.floor(i/10)*10}));
  const tree=buildSpatialIndex(items,{x:0,y:0,width:100,height:100},4);
  assert.deepEqual(querySpatial(tree,50,50,1).map(p=>p.id),[55]);
  assert.equal(querySpatial(tree,50,50,11).length,5);
});
