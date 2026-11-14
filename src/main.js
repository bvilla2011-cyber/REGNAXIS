import {Application,Container,Graphics} from 'pixi.js';
import {SimulationClient} from './core/simulation-client.js';
import {uiTone} from './core/audio.js';
import {t} from './i18n/strings.js';
import {C,addText,button,grid,label,panel} from './ui/widgets.js';

const canvas=document.querySelector('#game');
const app=new Application();
await app.init({canvas,resizeTo:window,background:C.bg,antialias:true,autoDensity:true,resolution:Math.min(devicePixelRatio||1,2),preference:'webgl'});

const W=1280,H=720;
const root=new Container(),backdrop=new Container(),scene=new Container(),overlay=new Container();
app.stage.addChild(root);root.addChild(backdrop,scene,overlay);
const state={scene:'boot',panel:null,lang:'es',quality:'high',audio:true,world:null,player:'A',selected:'west',
  camera:{x:0,y:0,scale:1},paused:true,busy:false,news:'',mode:'casual',timeline:[]};
const sim=new SimulationClient();
const tr=key=>t(state.lang,key);
const fmt=value=>new Intl.NumberFormat(state.lang==='es'?'es-ES':'en-US',{maximumFractionDigits:1,notation:'compact'}).format(value??0);

function resize(){const scale=Math.min(innerWidth/W,innerHeight/H);root.scale.set(scale);root.position.set((innerWidth-W*scale)/2,(innerHeight-H*scale)/2);}
addEventListener('resize',resize);resize();
function beep(kind='tap'){if(state.audio)uiTone(kind);navigator.vibrate?.(8);}
function action(fn,kind='tap'){return async()=>{beep(kind);try{await fn();}catch(err){state.news=err.message;draw();}};}
function clear(container){for(const child of container.removeChildren())child.destroy({children:true});}
function at(container,item,x,y){item.position.set(x,y);container.addChild(item);return item;}
function pill(text,x,y,color=C.accent){const g=at(scene,panel(170,34,{accent:color,fill:0x102137}),x,y);addText(scene,text,x+13,y+8,12,color,'700');return g;}

function background(time=0){clear(backdrop);backdrop.addChild(grid(W,H,time,state.quality));
  const shapes=new Graphics();
  for(let i=0;i<(state.quality==='low'?10:35);i++){
    const x=(i*223+Math.sin(time*0.0002+i)*15)%W,y=(i*157)%H;
    shapes.moveTo(x,y).lineTo(x+18,y-13).lineTo(x+31,y+7).closePath().stroke({color:C.accent,alpha:0.09,width:1});
  }backdrop.addChild(shapes);
}

function chrome(section){
  pill('U N I F O R M E R',34,25,C.gold);
  addText(scene,'REGNAXIS',36,78,38,C.text,'900');
  addText(scene,section,39,127,13,C.accent,'700');
  addText(scene,'◈  '+tr('demo'),900,34,13,C.gold,'700');
  const line=new Graphics();line.moveTo(35,155).lineTo(1245,155).stroke({color:C.accent,alpha:0.35,width:1});scene.addChild(line);
}

function boot(){chrome('ESTRATEGIA GEOPOLÍTICA · TIEMPO REAL');
  const emblem=new Graphics();emblem.circle(640,344,142).stroke({color:C.gold,width:2,alpha:0.8});
  emblem.circle(640,344,111).stroke({color:C.accent,width:1,alpha:0.45});
  emblem.moveTo(505,344).lineTo(775,344).stroke({color:C.accent,width:2,alpha:0.5});
  emblem.moveTo(640,202).lineTo(640,486).stroke({color:C.accent,width:2,alpha:0.5});
  emblem.moveTo(560,260).lineTo(700,428).lineTo(725,278).closePath().fill({color:C.blue,alpha:0.35});scene.addChild(emblem);
  const name=label('REGNAXIS',66,C.text,'900');name.anchor.set(0.5);at(scene,name,640,345);
  const subtitle=label(tr('loading'),16,C.gold,'700');subtitle.anchor.set(0.5);at(scene,subtitle,640,535);
}

function menu(){chrome('EL MUNDO NO ESPERA');
  const globe=new Graphics();globe.circle(900,395,220).fill({color:0x142b46,alpha:0.9});
  for(let i=-3;i<=3;i++){globe.ellipse(900,395,220,220-Math.abs(i)*30).stroke({color:C.accent,alpha:0.15,width:1});}
  globe.circle(900,395,222).stroke({color:C.gold,width:2,alpha:0.75});scene.addChild(globe);
  addText(scene,'CADA FRONTERA ES UNA DECISIÓN',68,216,29,C.gold,'800');
  addText(scene,'Economía  /  Poder  /  Diplomacia',69,259,17,C.muted);
  at(scene,button(tr('start'),315,64,action(()=>{state.scene='select';draw();})),72,331);
  at(scene,button(tr('observe'),315,54,action(()=>start(null)),{accent:C.gold}),72,407);
  at(scene,button(tr('settings'),315,54,action(()=>{state.scene='settings';draw();}),{accent:C.blue}),72,475);
  addText(scene,'DIFICULTAD',72,562,12,C.muted,'700');
  at(scene,button(state.mode==='casual'?'CASUAL ✓':'CASUAL',138,40,action(()=>{state.mode='casual';draw();}),{small:true}),72,581);
  at(scene,button(state.mode==='hardcore'?'HARDCORE ✓':'HARDCORE',158,40,action(()=>{state.mode='hardcore';draw();}),{accent:C.red,small:true}),220,581);
  addText(scene,'ALFA 0.1   ·   SIMULACIÓN LOCAL',70,636,13,C.muted);
}

function selectCountry(){chrome(tr('country'));addText(scene,'DOS NACIONES FICTICIAS PARA PROBAR EL NÚCLEO',40,187,18,C.muted);
  const countries=[['A','AUREL',C.accent,'400','4 M'],['B','BRUMA',C.red,'600','6 M']];
  countries.forEach(([id,name,color,gdp,pop],i)=>{
    const x=90+i*560;at(scene,panel(500,330,{accent:color}),x,235);
    const symbol=new Graphics();symbol.circle(x+250,315,42).fill({color,alpha:0.2});symbol.circle(x+250,315,39).stroke({color,width:3});scene.addChild(symbol);
    const title=label(name,28,C.text,'900');title.anchor.set(0.5);at(scene,title,x+250,388);
    addText(scene,`PIB  ${gdp}    ·    ${tr('population')}  ${pop}`,x+115,434,16,C.muted);
    at(scene,button(tr('play'),420,56,action(()=>start(id)),{accent:color}),x+40,490);
  });
  at(scene,button(tr('back'),150,48,action(()=>{state.scene='menu';draw();}),{accent:C.gold,small:true}),40,645);
}

async function start(player){state.busy=true;state.player=player;state.news='';
  const data={countries:{A:{name:'Aurel',treasury:1000,budget:{tax:.25,research:.02,military:.05,social:.08}},
    B:{name:'Bruma',treasury:800,budget:{tax:.25,research:.02,military:.05,social:.08}}},
    cells:{west:{owner:'A',controller:'A',neighbors:['middle'],area:1},
      middle:{owner:'B',controller:'B',neighbors:['west','east'],area:1,resistance:.2},
      east:{owner:'B',controller:'B',neighbors:['middle'],area:1}},
    points:[{id:'p1',cell:'west',gdp:400,population:4e6},{id:'p2',cell:'middle',gdp:200,population:2e6},
      {id:'p3',cell:'east',gdp:400,population:4e6}],
    armies:[{id:'a1',country:'A',cell:'west',type:'infantry',strength:100,equipment:1,morale:80,supply:1}],player};
  const response=await sim.send('init',data);state.world=response.world;state.timeline=[structuredClone(response.world)];state.paused=false;state.scene='game';state.busy=false;draw();}

function saveGame(){if(!state.world)return;const save={version:1,world:state.world,player:state.player,mode:state.mode,timeline:state.timeline};
  localStorage.setItem('regnaxis-save-v1',JSON.stringify(save));state.news='PARTIDA GUARDADA EN ESTE DISPOSITIVO';}
async function loadGame(){const raw=localStorage.getItem('regnaxis-save-v1');if(!raw)throw Error('No hay una partida guardada');
  const save=JSON.parse(raw);if(save.version!==1)throw Error('Versión de guardado no compatible');
  const result=await sim.send('load',save.world);state.world=result.world;state.player=save.player;state.mode=save.mode??'casual';state.timeline=save.timeline??[result.world];state.scene='game';state.panel=null;state.paused=true;draw();}

const cellGeometry={west:{x:170,y:320,w:250,h:220},middle:{x:425,y:260,w:260,h:280},east:{x:690,y:295,w:320,h:250}};
function mapView(){
  const map=new Container();map.position.set(state.camera.x,state.camera.y);map.scale.set(state.camera.scale);
  for(const [id,box] of Object.entries(cellGeometry)){
    const own=state.world.cells[id].controller;
    const color=own==='A'?C.accent:C.red;
    const shape=new Graphics();shape.roundRect(box.x,box.y,box.w,box.h,24).fill({color,alpha:id===state.selected?.38:.21});
    shape.roundRect(box.x,box.y,box.w,box.h,24).stroke({color: id===state.selected?C.gold:color,width:id===state.selected?4:2,alpha:.9});
    shape.eventMode='static';shape.cursor='pointer';shape.on('pointertap',e=>{e.stopPropagation();state.selected=id;beep();draw();});
    map.addChild(shape);
    addText(map,id.toUpperCase(),box.x+18,box.y+22,18,C.text,'800');
    const points=state.world.points.filter(p=>p.cell===id);addText(map,`◆ ${fmt(points.reduce((s,p)=>s+p.gdp,0))} PIB`,box.x+18,box.y+57,14,C.gold);
  }
  for(const army of state.world.armies){const box=cellGeometry[army.cell];if(!box)continue;
    const g=new Graphics();g.circle(box.x+box.w/2,box.y+box.h/2,23).fill({color:C.bg});g.circle(box.x+box.w/2,box.y+box.h/2,23).stroke({color:C.gold,width:2});map.addChild(g);
    addText(map,'⚔',box.x+box.w/2-10,box.y+box.h/2-13,20,C.gold);
  }
  scene.addChild(map);
  let down=null;
  map.eventMode='static';map.on('pointerdown',e=>{down={x:e.global.x,y:e.global.y,cx:state.camera.x,cy:state.camera.y};});
  map.on('pointermove',e=>{if(down){state.camera.x=down.cx+(e.global.x-down.x)/root.scale.x;
    state.camera.y=down.cy+(e.global.y-down.y)/root.scale.y;map.position.set(state.camera.x,state.camera.y);}});
  map.on('pointerup',()=>{down=null;});map.on('pointerupoutside',()=>{down=null;});
}

function game(){const w=state.world,c=state.player?w.countries[state.player]:null;
  mapView();at(scene,panel(1210,82),35,20);addText(scene,'REGNAXIS',53,36,25,C.text,'900');
  addText(scene,`${tr('day')} ${w.day}  ·  ${state.paused?tr('pause'):'▶ 1×'}`,256,41,16,C.gold,'700');
  if(c){addText(scene,`PIB ${fmt(c.gdp)}   ${tr('population')} ${fmt(c.population)}`,515,34,16,C.text);
    addText(scene,`${tr('treasury')} ${fmt(c.treasury)}   RP ${fmt(c.researchPoints)}`,515,61,14,C.muted);}
  at(scene,button(state.paused?tr('resume'):tr('pause'),128,45,action(()=>{state.paused=!state.paused;draw();}),{small:true}),1088,37);
  const cell=w.cells[state.selected],country=w.countries[cell.controller];
  at(scene,panel(275,145,{accent:C.gold}),972,120);
  addText(scene,tr('selected')+'  /  '+state.selected.toUpperCase(),990,139,14,C.gold,'800');
  addText(scene,country.name,990,175,23,C.text,'800');
  addText(scene,`PIB ${fmt(w.points.filter(p=>p.cell===state.selected).reduce((s,p)=>s+p.gdp,0))}`,990,216,15,C.muted);
  at(scene,panel(1210,85),35,615);
  const tabs=['military','diplomacy','economy','research','ranking','charts','news','editor','replay','profile','settings'];
  tabs.forEach((key,i)=>at(scene,button(tr(key),101,49,action(()=>{state.panel=key;draw();}),{accent:i<4?C.accent:C.gold,small:true}),48+i*108,632));
  if(state.news)addText(scene,state.news,46,579,14,C.red,'700');
  if(w.winner)addText(scene,`${tr('victory')}: ${w.countries[w.winner].name}`,440,110,27,C.gold,'900');
  if(state.panel)drawPanel();
}

function drawPanel(){const key=state.panel,w=state.world,c=state.player?w.countries[state.player]:null;
  at(overlay,panel(555,425,{accent:key==='military'?C.red:C.accent,fill:0x0b1a2b}),365,150);
  addText(overlay,tr(key).toUpperCase(),393,176,27,C.gold,'900');
  at(overlay,button('×',48,46,action(()=>{state.panel=null;draw();}),{accent:C.red}),845,164);
  const lines={
    military:[`ESCUADRAS  ${w.armies.filter(a=>a.country===state.player).length}`,`EN ENTRENAMIENTO  ${w.training.length}`,
      `ZONA  ${state.selected.toUpperCase()} · ${w.countries[w.cells[state.selected].controller].name}`],
    economy:[`PIB  ${fmt(c?.gdp)}`,`${tr('population')}  ${fmt(c?.population)}`,
      `INFLACIÓN  ${((c?.inflation??0)*100).toFixed(2)} %`,`${tr('treasury')}  ${fmt(c?.treasury)}`],
    diplomacy:[`POSICIÓN INTERNACIONAL  ${fmt(c?.standing??100)}/100`,
      ...Object.entries(w.diplomacy??{}).map(([pair,p])=>`${pair}  ·  RELACIÓN ${p.value.toFixed(1)}  ·  ${p.atWar?'GUERRA':'PAZ'}`)],
    research:[`PUNTOS DISPONIBLES  ${fmt(c?.researchPoints)}`,
      `INDUSTRIA  ${c?.research?.completed?.industry??0}`,`LOGÍSTICA  ${c?.research?.completed?.logistics??0}`],
    ranking:Object.entries(w.countries).sort((a,b)=>b[1].gdp-a[1].gdp).map(([id,v],i)=>`${i+1}. ${v.name}  ·  ${fmt(v.gdp)} PIB`),
    news:w.events.slice(-5).reverse().map(e=>`${tr('day')} ${e.day}  ·  ${e.type.toUpperCase()}`),
    charts:[] , editor:['EDITOR DE ESCENARIO','Puntos económicos: '+w.points.length,'Territorios: '+Object.keys(w.cells).length],
    replay:['REPETICIÓN LOCAL',`Día actual: ${w.day}`, `Instantáneas disponibles: ${state.timeline.length}`,
      ...state.timeline.slice(-5).reverse().map(s=>`DÍA ${s.day} · PIB A ${fmt(s.countries.A?.gdp)} · PIB B ${fmt(s.countries.B?.gdp)}`)],
    profile:['PERFIL LOCAL','Comandante REGNAXIS','Partida sin conexión']
  };
  if(key==='charts'){
    const chart=new Graphics();
    chart.moveTo(405,450).lineTo(855,450).moveTo(405,450).lineTo(405,265)
      .stroke({color:C.muted,alpha:.7,width:1});
    const countries=Object.entries(w.countries),max=Math.max(1,...countries.map(([,v])=>v.gdp));
    for(const [i,[id,v]] of countries.entries()){
      const color=id==='A'?C.accent:C.red,barX=470+i*165,height=Math.max(8,155*v.gdp/max);
      chart.roundRect(barX,450-height,72,height,6).fill({color,alpha:.82});
      addText(overlay,v.name,barX-5,461,13,C.text,'700');
      addText(overlay,fmt(v.gdp),barX,430-height,12,C.gold);
    }
    for(let i=1;i<=3;i++)chart.moveTo(405,450-i*46).lineTo(850,450-i*46).stroke({color:C.accent,alpha:.1,width:1});
    overlay.addChild(chart);addText(overlay,'PIB POR PAÍS · ACTUAL',420,220,13,C.muted,'700');
  }
  if(key!=='charts')(lines[key]?.length?lines[key]:[tr('noData')]).forEach((line,i)=>addText(overlay,line,394,239+i*43,16,C.text));
  if(key==='military'&&state.player){
    at(overlay,button(tr('recruit'),145,49,action(async()=>{const cell=Object.keys(w.cells).find(id=>w.cells[id].controller===state.player);
      const r=await sim.send('recruit',{country:state.player,type:'infantry',cell});state.world=r.world;draw();})),391,500);
    at(overlay,button(tr('attack'),145,49,action(async()=>{const army=w.armies.find(a=>a.country===state.player);
      if(!army)throw Error('Sin ejército disponible');
      const r=await sim.send('order',{army:army.id,kind:'attack',target:state.selected});state.world=r.world;draw();},'danger')),551,500);
  }
  if(key==='research'&&state.player)at(overlay,button('INDUSTRIA  20 RP',200,49,action(async()=>{
    const r=await sim.send('research',{country:state.player,project:'industry'});state.world=r.world;draw();})),393,500);
  if(key==='diplomacy'&&state.player){
    const target=Object.keys(w.countries).find(id=>id!==state.player);
    if(target){
      at(overlay,button('PACTO DE NO AGRESIÓN',205,42,action(async()=>{
        const r=await sim.send('treaty',{country:state.player,target,type:'nonAggression'});state.world=r.world;state.news=r.result.accepted?'Pacto firmado':'Propuesta rechazada';draw();})),390,495);
      at(overlay,button('PROPONER TREGUA',175,42,action(async()=>{
        const r=await sim.send('treaty',{country:state.player,target,type:'truce'});state.world=r.world;state.news=r.result.accepted?'Tregua firmada':'Propuesta rechazada';draw();})),610,495);
    }
  }
  if(key==='editor')at(overlay,button('EXPORTAR ESCENARIO',205,42,action(()=>{
    const blob=new Blob([JSON.stringify({version:1,world:w},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`regnaxis-dia-${w.day}.json`;a.click();URL.revokeObjectURL(url);
  })),390,495);
  if(key==='editor')at(overlay,button('IMPORTAR ESCENARIO',205,42,action(async()=>{
    const raw=prompt('Pega aquí un escenario REGNAXIS exportado:');if(!raw)return;
    const parsed=JSON.parse(raw);const candidate=parsed.world??parsed;
    const loaded=await sim.send('load',candidate);state.world=loaded.world;state.timeline=[structuredClone(loaded.world)];
    state.scene='game';state.panel=null;state.paused=true;draw();
  })),610,495);
  if(key==='profile'&&state.world)at(overlay,button('PASAR TURNO AL OTRO JUGADOR',265,42,action(()=>{
    const ids=Object.keys(state.world.countries),next=ids.find(id=>id!==state.player);
    if(!next){state.news='No hay otro país disponible';return;}
    state.player=next;state.paused=true;state.panel=null;state.news=`Turno de ${state.world.countries[next].name}`;draw();
  })),390,495);
  if(key==='replay'){
    at(overlay,button('GUARDAR PARTIDA',190,45,action(()=>{saveGame();draw();})),391,500);
    at(overlay,button('CARGAR PARTIDA',190,45,action(loadGame)),596,500);
  }
}

function settings(){chrome(tr('settings'));
  at(scene,panel(720,425),280,193);addText(scene,tr('language'),320,240,19,C.gold,'700');
  at(scene,button(state.lang==='es'?'ESPAÑOL':'ENGLISH',180,54,action(()=>{state.lang=state.lang==='es'?'en':'es';draw();})),710,226);
  addText(scene,tr('quality'),320,319,19,C.gold,'700');
  at(scene,button(tr(state.quality),180,54,action(()=>{state.quality={high:'medium',medium:'low',low:'high'}[state.quality];draw();})),710,304);
  addText(scene,tr('audio'),320,400,19,C.gold,'700');
  at(scene,button(state.audio?'ON':'OFF',180,54,action(()=>{state.audio=!state.audio;draw();})),710,388);
  at(scene,button(tr('back'),180,53,action(()=>{state.scene=state.world?'game':'menu';draw();}),{accent:C.gold}),550,533);
}

function draw(){clear(scene);clear(overlay);background(performance.now());
    if(state.scene==='boot')boot();else if(state.scene==='menu')menu();else if(state.scene==='select')selectCountry();
  else if(state.scene==='settings')settings();else if(state.scene==='game')game();}

app.renderer.events.setTargetElement(canvas);
canvas.addEventListener('wheel',e=>{e.preventDefault();if(state.scene==='game'){
  state.camera.scale=Math.max(.65,Math.min(2.4,state.camera.scale*(e.deltaY>0?.9:1.1)));draw();}},{passive:false});
let pinch=null;canvas.addEventListener('touchmove',e=>{if(e.touches.length===2&&state.scene==='game'){
  const a=e.touches[0],b=e.touches[1],distance=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
  if(pinch)state.camera.scale=Math.max(.65,Math.min(2.4,state.camera.scale*distance/pinch));
  pinch=distance;draw();}},{passive:false});canvas.addEventListener('touchend',()=>{pinch=null;});
addEventListener('keydown',e=>{if(e.key==='Escape'&&state.panel){state.panel=null;draw();}
  if(e.key===' '&&state.scene==='game'){e.preventDefault();state.paused=!state.paused;draw();}});
draw();setTimeout(()=>{state.scene='menu';draw();},650);
const manifestLink=document.createElement('link');manifestLink.rel='manifest';manifestLink.href='./manifest.webmanifest';document.head.append(manifestLink);
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
let last=performance.now(),acc=0;
app.ticker.add(async ticker=>{const now=performance.now(),delta=Math.min(now-last,100);last=now;
  if(state.scene!=='game'||state.paused||state.busy)return;
  acc+=delta;if(acc<1000)return;acc=0;state.busy=true;
  try{const r=await sim.send('step',{days:1,mode:state.mode});state.world=r.world;
    if(state.world.day%10===0){state.timeline.push(structuredClone(state.world));if(state.timeline.length>60)state.timeline.shift();}
    draw();}
  catch(err){state.news=err.message;state.paused=true;draw();}finally{state.busy=false;}
});
