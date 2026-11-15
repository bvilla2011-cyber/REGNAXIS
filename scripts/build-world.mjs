import fs from 'node:fs';
import {feature,neighbors} from 'topojson-client';
import countries from 'world-atlas/countries-50m.json' with {type:'json'};
import iso from 'i18n-iso-countries';
import es from 'i18n-iso-countries/langs/es.json' with {type:'json'};
import {geoEquirectangular,geoPath} from 'd3-geo';

iso.registerLocale(es);
const geometries=countries.objects.countries.geometries;
const features=feature(countries,countries.objects.countries).features;
const adjacent=neighbors(geometries);
const ids=features.map((f,i)=>f.properties.name==='Ashmore and Cartier Is.'?'NE-ASHMORE':f.id??`NE-${i}`);
const project=([lon,lat])=>[+(1000*(lon+180)/360).toFixed(1),+(500*(90-lat)/180).toFixed(1)];
const seamPath=geoPath(geoEquirectangular().scale(1000/(2*Math.PI)).translate([500,250]).precision(0));
function ringsOf(geometry){return geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;}
function anchor(polygons){let best=null,max=-1;for(const polygon of polygons){const ring=polygon[0];let twice=0,cx=0,cy=0;for(let i=0;i<ring.length-1;i++){const [x,y]=ring[i],[u,v]=ring[i+1],cross=x*v-u*y;twice+=cross;cx+=(x+u)*cross;cy+=(y+v)*cross;}const area=Math.abs(twice);if(area>max&&Math.abs(twice)>1e-6){max=area;best=[cx/(3*twice),cy/(3*twice)];}}return best??polygons[0]?.[0]?.[0]??[500,250];}
const output=features.map((item,i)=>{const polygons=ringsOf(item.geometry).map(p=>p.map(r=>r.map(project)));const alpha=iso.numericToAlpha2(item.id??'');const name=alpha?iso.getName(alpha,'es',{select:'official'}):null;const crossing=polygons.some(p=>p.some(r=>r.some(([x],j)=>j>0&&Math.abs(x-r[j-1][0])>500)));return {id:ids[i],name:ids[i]==='NE-ASHMORE'?'Islas Ashmore y Cartier':name||item.properties.name,nameEn:item.properties.name,anchor:anchor(polygons).map(v=>+v.toFixed(1)),neighbors:adjacent[i].map(j=>ids[j]),polygons,...(crossing?{seamPath:seamPath(item)}:{})};});
output.sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
fs.mkdirSync('src/data',{recursive:true});
fs.writeFileSync('src/data/world-countries.json',JSON.stringify(output));
console.log(`${output.length} entidades, ${Math.round(fs.statSync('src/data/world-countries.json').size/1024)} KiB`);
