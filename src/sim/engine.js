import {checkVictory, deepCopy} from './world.js';
import {advanceTraining, moveArmies} from './army.js';
import {economyDay} from './economy.js';
import {diplomacyDay} from './diplomacy.js';
import {researchDay} from './research.js';
import {runAI} from '../ai/planner.js';

export function stepHour(world, mode='casual') {
  if (world.winner) return world;
  world.hour++;
  if (world.hour >= world.rules.dayHours) {
    world.hour=0;
    world.day++;
    moveArmies(world);
    advanceTraining(world);
    economyDay(world);
    researchDay(world);
    diplomacyDay(world);
    if(world.day%7===0) runAI(world,{aggression:world.aiAggression??1,enableWars:world.aiWars??true});
    checkVictory(world,mode);
  }
  return world;
}

export function stepDays(world, days, mode='casual') {
  if (!Number.isSafeInteger(days) || days<0) throw new RangeError('Invalid days');
  for (let i=0;i<days*world.rules.dayHours;i++) stepHour(world,mode);
  return world;
}

export function snapshot(world) {return deepCopy(world);}
export function restore(snapshotData) {return deepCopy(snapshotData);}
