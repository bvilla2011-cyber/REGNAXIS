import {clamp} from './world.js';

export const SHIPS=Object.freeze({
  destroyer:{cost:180,upkeep:0.02,power:45},cruiser:{cost:360,upkeep:0.035,power:90},
  battleship:{cost:650,upkeep:0.06,power:150},carrier:{cost:900,upkeep:0.08,power:120},submarine:{cost:300,upkeep:0.03,power:75}
});

export function buildShip(world,country,type,sea){
  const ship=SHIPS[type],c=world.countries[country];
  if(!ship||!c)throw new Error('Unknown ship or country');
  if(!world.cells[sea]?.sea)throw new Error('Ships can only be built in sea cells');
  if((c.treasury??0)<ship.cost)throw new Error('Insufficient treasury');
  c.treasury-=ship.cost;world.fleets??=[];
  const fleet={id:`fleet-${world.seed++}`,country,type,cell:sea,strength:ship.power,order:null};
  world.fleets.push(fleet);world.events.push({day:world.day,type:'ship-built',country,ship:type});return fleet;
}

export function orderFleet(world,id,kind,target){
  const fleet=(world.fleets??[]).find(f=>f.id===id);if(!fleet)throw new Error('Unknown fleet');
  if(!['move','attack','blockade','land','hold'].includes(kind))throw new Error('Unknown fleet order');
  if(target&&!world.cells[target])throw new Error('Unknown target');fleet.order={kind,target};
}

export function navyDay(world){
  for(const fleet of world.fleets??[]){
    const order=fleet.order;if(!order||order.kind==='hold')continue;
    const sea=world.cells[fleet.cell],target=world.cells[order.target];if(!sea||!target)continue;
    if(order.kind==='move'&&sea.neighbors.includes(order.target)&&target.sea){fleet.cell=order.target;continue;}
    if(order.kind==='attack'&&sea.neighbors.includes(order.target)&&target.sea){
      const enemy=(world.fleets??[]).filter(f=>f.cell===order.target&&f.country!==fleet.country);
      for(const foe of enemy){foe.strength-=fleet.strength*0.12;fleet.strength-=foe.strength*0.08;}
      world.fleets=world.fleets.filter(f=>f.strength>5);continue;
    }
    if(order.kind==='land'&&sea.neighbors.includes(order.target)&&!target.sea&&target.coastal){
      const troops=world.armies.find(a=>a.country===fleet.country&&a.cell===fleet.cell);
      if(troops){troops.order={kind:'attack',target:order.target};fleet.order=null;}continue;
    }
    if(order.kind==='blockade'){
      const blocked=sea.neighbors.includes(order.target)&&target.sea;
      if(blocked){world.blockades??=[];world.blockades=world.blockades.filter(b=>b.fleet!==fleet.id);
        world.blockades.push({fleet:fleet.id,cell:order.target,country:fleet.country});}
    }
  }
  world.fleets??=[];world.fleets=world.fleets.filter(f=>f.strength>0);
}

export function navalPower(fleet){return clamp(fleet.strength,0,1000);}
