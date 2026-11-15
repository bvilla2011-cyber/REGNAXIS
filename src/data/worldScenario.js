import atlas from './world-countries.json' with {type:'json'};
import {createWorld} from '../sim/world.js';

export const countries=atlas.filter(country=>country.id!=='010');
export const byId=new Map(countries.map(country=>[country.id,country]));

function landArea(country){let area=0;for(const polygon of country.polygons){const ring=polygon[0]??[];let sum=0;for(let i=0;i<ring.length-1;i++)sum+=ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];area+=Math.abs(sum)/2;}return area;}
function distance(a,b){const dx=Math.min(Math.abs(a.anchor[0]-b.anchor[0]),1000-Math.abs(a.anchor[0]-b.anchor[0]));return Math.hypot(dx,(a.anchor[1]-b.anchor[1])*1.4);}
const seaLinks=new Map();
for(const country of countries){if(country.neighbors.some(id=>byId.has(id)))continue;const nearest=countries.filter(other=>other.id!==country.id).sort((a,b)=>distance(country,a)-distance(country,b)).slice(0,2);seaLinks.set(country.id,nearest.map(item=>item.id));}

export function newWorld(playerId){
  if(playerId!==null&&!byId.has(playerId))throw Error('País no disponible');
  const states={},cells={},points=[];
  for(const c of countries){const area=landArea(c),seed=[...c.id].reduce((sum,char)=>sum+char.charCodeAt(0),0),gdp=Math.round(60+Math.sqrt(area)*19+seed%90),population=Math.round((.25+Math.sqrt(area)*.17+seed%11*.08)*1e6);
    states[c.id]={name:c.name,treasury:Math.round(420+gdp*.9),budget:{tax:.25,research:.02,military:.05,social:.08}};
    cells[c.id]={controller:c.id,neighbors:[...new Set([...c.neighbors.filter(id=>byId.has(id)),...(seaLinks.get(c.id)??[])])],seaRoutes:seaLinks.get(c.id)??[],area:Math.max(.05,Math.sqrt(area)/20),resistance:.12};
    points.push({id:`p-${c.id}`,cell:c.id,gdp,population});
  }
  // Links are bidirectional. These sea links let isolated islands take part in the prototype.
  for(const [id,cell] of Object.entries(cells))for(const neighbor of cell.neighbors)if(!cells[neighbor].neighbors.includes(id)){cells[neighbor].neighbors.push(id);cells[neighbor].seaRoutes.push(id);}
  const armies=playerId?[{id:'u-player',country:playerId,cell:playerId,type:'infantry',strength:100,morale:80,equipment:1}]:[];
  const world=createWorld({countries:states,cells,points,armies});world.player=playerId;world.dataStatus='provisional-synthetic-economy';return world;
}
