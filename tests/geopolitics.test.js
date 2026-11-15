import test from 'node:test';import assert from 'node:assert/strict';
import {newWorld} from '../src/data/worldScenario.js';
import {relation,war,treaty} from '../src/sim/diplomacy.js';
import {tradeDay} from '../src/sim/trade.js';
import {planAI} from '../src/ai/planner.js';
import {advance} from '../src/sim/engine.js';

test('UE inicia con afinidad y defensa; agresión activa respuesta y condena',()=>{const world=newWorld('724');assert.equal(relation(world,'724','250').value,84);const before=relation(world,'840','276').value;war(world,'840','250');assert.equal(relation(world,'724','840').atWar,true);assert.ok(relation(world,'840','276').value<before);assert.equal(relation(world,'250','276').value,84);});
test('la IA no invade aliados ni países neutrales por PIB',()=>{const world=newWorld('724');world.armies.push({id:'ai-fr',country:'250',cell:'250',type:'infantry',strength:900,morale:80,equipment:1});const p=planAI(world,'250');assert.notEqual(p.action,'expand');});
test('acuerdo y ruta comercial bilateral produce ingresos; guerra la bloquea',()=>{const world=newWorld('724');world.countries['724'].researchPoints=100;const a=world.countries['724'],b=world.countries['250'];treaty(world,'724','250','trade');assert.equal(world.tradeRoutes.length,1);const before=a.treasury,other=b.treasury;tradeDay(world);assert.ok(a.treasury>before&&b.treasury>other);war(world,'724','250');tradeDay(world);assert.equal(world.tradeRoutes[0].status,'blocked');});
test('campaña neutral no entra en guerra automáticamente en quince días',()=>{const world=newWorld('724');advance(world,15);assert.equal(world.events.filter(e=>e.type==='war').length,0);});
