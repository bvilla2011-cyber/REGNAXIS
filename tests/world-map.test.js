import test from 'node:test';
import assert from 'node:assert/strict';
import {countries,byId,newWorld} from '../src/data/worldScenario.js';
import {advance} from '../src/sim/engine.js';

test('atlas completo, nombres españoles ordenados e identificadores únicos',()=>{
  assert.equal(countries.length,240);
  assert.equal(new Set(countries.map(c=>c.id)).size,countries.length);
  assert.deepEqual(countries.map(c=>c.name),[...countries.map(c=>c.name)].sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})));
  for(const id of ['724','840','250','336','702','NE-130'])assert.ok(byId.has(id));
});
test('la elección inicial corresponde al país jugado y cada enlace existe',()=>{
  const world=newWorld('724');assert.equal(world.player,'724');assert.equal(world.armies[0].country,'724');
  assert.equal(Object.keys(world.countries).length,240);
  for(const [id,cell] of Object.entries(world.cells))for(const neighbor of cell.neighbors){assert.ok(world.cells[neighbor]);assert.ok(world.cells[neighbor].neighbors.includes(id));}
  advance(world,1);assert.equal(world.day,1);
});
test('una isla sin frontera terrestre conserva ruta jugable',()=>{
  const world=newWorld('702');assert.ok(world.cells['702'].neighbors.length>0);
  assert.ok(world.cells['702'].seaRoutes.length>0);
});
