import {initializeBlocs} from './blocs.js';
import atlas from './world-countries.json?map-v2' with {type:'json'};
import {createWorld} from '../sim/world.js';

export const countries=atlas.filter(country=>country.id!=='010');
export const byId=new Map(countries.map(country=>[country.id,country]));

function landArea(country){let area=0;for(const polygon of country.polygons){const ring=polygon[0]??[];let sum=0;for(let i=0;i<ring.length-1;i++)sum+=ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];area+=Math.abs(sum)/2;}return area;}
function within(point,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
function pointLocations(country){const ring=[...country.polygons].map(p=>p[0]).sort((a,b)=>b.length-a.length)[0];if(!ring?.length)return Array(4).fill(country.anchor);const xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),result=[];for(let i=1;i<=4;i++){let pos=country.anchor;for(let j=0;j<30;j++){const x=minX+(maxX-minX)*((i*.313+j*.6180339)%1),y=minY+(maxY-minY)*((i*.579+j*.41421)%1);if(within([x,y],ring)){pos=[x,y];break;}}result.push(pos);}return result;}
function distance(a,b){const dx=Math.min(Math.abs(a.anchor[0]-b.anchor[0]),1000-Math.abs(a.anchor[0]-b.anchor[0]));return Math.hypot(dx,(a.anchor[1]-b.anchor[1])*1.4);}
const seaLinks=new Map();
const coasts=new Set('012 032 036 050 076 124 152 156 170 196 203 208 246 250 276 300 352 356 360 372 376 380 392 410 428 470 484 528 554 578 586 604 608 616 620 642 643 702 710 724 752 764 788 792 804 818 826 840 858 862'.split(' '));
for(const country of countries){if(country.neighbors.some(id=>byId.has(id)))continue;const nearest=countries.filter(other=>other.id!==country.id).sort((a,b)=>distance(country,a)-distance(country,b)).slice(0,2);seaLinks.set(country.id,nearest.map(item=>item.id));}
for(const country of countries){if(!coasts.has(country.id))continue;const nearest=countries.filter(other=>coasts.has(other.id)&&other.id!==country.id&&!country.neighbors.includes(other.id)).sort((a,b)=>distance(country,a)-distance(country,b)).slice(0,2);seaLinks.set(country.id,[...new Set([...(seaLinks.get(country.id)??[]),...nearest.map(c=>c.id)])]);}

export function newWorld(playerId){
  if(playerId!==null&&!byId.has(playerId))throw Error('País no disponible');
  const states={},cells={},points=[];
  for(const c of countries){const area=landArea(c),seed=[...c.id].reduce((sum,char)=>sum+char.charCodeAt(0),0),gdp=Math.round(60+Math.sqrt(area)*19+seed%90),population=Math.round((.25+Math.sqrt(area)*.17+seed%11*.08)*1e6);
    states[c.id]={name:c.name,treasury:Math.round(420+gdp*.9),budget:{tax:.25,research:.02,military:.05,social:.08}};
    cells[c.id]={controller:c.id,neighbors:[...new Set([...c.neighbors.filter(id=>byId.has(id)),...(seaLinks.get(c.id)??[])])],seaRoutes:seaLinks.get(c.id)??[],area:Math.max(.05,Math.sqrt(area)/20),resistance:.12};
    pointLocations(c).forEach(([x,y],i)=>points.push({id:`p-${c.id}-${i}`,cell:c.id,controller:c.id,x,y,gdp:gdp/4,population:population/4,resource:['industry','food','energy','services'][i]}));
  }
  // Links are bidirectional. These sea links let isolated islands take part in the prototype.
  for(const [id,cell] of Object.entries(cells))for(const neighbor of cell.neighbors)if(!cells[neighbor].neighbors.includes(id)){cells[neighbor].neighbors.push(id);cells[neighbor].seaRoutes.push(id);}
  const armies=playerId?[{id:'u-player',country:playerId,cell:playerId,type:'infantry',strength:100,morale:80,equipment:1}]:[];
  const world=createWorld({countries:states,cells,points,armies});world.player=playerId;world.fleets=[];initializeBlocs(world);world.dataStatus='provisional-synthetic-economy';return world;
}
