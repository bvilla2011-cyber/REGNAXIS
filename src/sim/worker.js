import {stepDays, snapshot, restore} from './engine.js';
import {createWorld, ranking} from './world.js';
import {orderArmy, recruit, splitArmy, undoAnnex} from './army.js';
import {proposeTreaty,breakTreaty,declareWar,negotiatePeace} from './diplomacy.js';
import {invest} from './research.js';

let world = null;
const actions={
  init: payload => {world=createWorld(payload);return {world:snapshot(world)};},
  load: payload => {world=restore(payload);return {world:snapshot(world)};},
  step: payload => {stepDays(world,payload.days,payload.mode);return {world:snapshot(world)};},
  order: payload => {orderArmy(world,payload.army,payload.kind,payload.target);return {world:snapshot(world)};},
  recruit: payload => ({quote:recruit(world,payload.country,payload.type,payload.cell),world:snapshot(world)}),
  split: payload => ({unit:splitArmy(world,payload.army,payload.share),world:snapshot(world)}),
  undoAnnex: () => ({undone:undoAnnex(world),world:snapshot(world)}),
  treaty: payload => ({result:proposeTreaty(world,payload.country,payload.target,payload.type,payload.options),world:snapshot(world)}),
  breakTreaty: payload => ({result:breakTreaty(world,payload.country,payload.target,payload.type),world:snapshot(world)}),
  declareWar: payload => ({result:declareWar(world,payload.country,payload.target),world:snapshot(world)}),
  peace: payload => {negotiatePeace(world,payload.country,payload.target,payload.terms);return {world:snapshot(world)};},
  research: payload => ({result:invest(world,payload.country,payload.project,payload.options),world:snapshot(world)}),
  state: () => ({world:snapshot(world),ranking:ranking(world)})
};

self.onmessage = ({data}) => {
  const {id,type,payload}=data;
  try {
    if (!actions[type]) throw new Error(`Unknown command ${type}`);
    if (!world && type!=='init' && type!=='load') throw new Error('World not initialized');
    self.postMessage({id,ok:true,...actions[type](payload)});
  } catch(error) {self.postMessage({id,ok:false,error:error.message});}
};
