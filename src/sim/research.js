import {clamp} from './world.js';

export const PROJECTS=Object.freeze({
  industry:{branch:'economy',cost:20,required:0,kind:'permanent',bonus:{growth:0.003},pair:'ecology'},
  ecology:{branch:'economy',cost:20,required:0,kind:'permanent',bonus:{stability:2},pair:'industry'},
  logistics:{branch:'military',cost:25,required:0,kind:'permanent',bonus:{supply:0.1},pair:'firepower'},
  firepower:{branch:'military',cost:25,required:0,kind:'permanent',bonus:{attack:0.1},pair:'logistics'},
  labs:{branch:'economy',cost:45,required:20,kind:'permanent',bonus:{research:0.08}},
  welfare:{branch:'society',cost:2,required:0,kind:'continuous',bonus:{migration:0.001}},
  restoration:{branch:'society',cost:12,required:0,kind:'area',bonus:{resistance:-0.15}},
  prestige:{branch:'military',cost:80,required:50,kind:'batch',bonus:{standing:2}}
});

export function researchState(world,countryId) {
  if(!world.countries[countryId]) throw new Error('Unknown country');
  return world.countries[countryId].research??={completed:{},invested:{},continuous:{},effects:{}};
}

export function researchQuote(world,countryId,projectId,{level=1,area=[]}={}) {
  const project=PROJECTS[projectId];if(!project) throw new Error('Unknown project');
  const state=researchState(world,countryId);
  const branchSpent=state.invested[project.branch]??0;
  const pairUsed=project.pair?(state.completed[project.pair]??0):0;
  const pairLimit=1;
  const cost=project.kind==='area'?project.cost*Math.max(1,area.length)
    :project.kind==='batch'?project.cost*level:project.cost;
  return {cost,branchSpent,required:project.required,available:branchSpent>=project.required
    &&(project.kind==='batch'||project.kind==='area'||project.kind==='continuous'||!(state.completed[projectId]??0))
    &&(!project.pair||pairUsed<pairLimit),pairLimit};
}

export function invest(world,countryId,projectId,options={}) {
  const project=PROJECTS[projectId],state=researchState(world,countryId),quote=researchQuote(world,countryId,projectId,options);
  if(!quote.available) throw new Error('Project requirements or paired limit not met');
  const country=world.countries[countryId];
  if((country.researchPoints??0)<quote.cost) throw new Error('Insufficient research points');
  if(project.kind==='area') for(const id of options.area??[]) {
    if(world.cells[id]?.controller!==countryId) throw new Error(`Area not controlled: ${id}`);
  }
  country.researchPoints-=quote.cost;
  state.invested[project.branch]=(state.invested[project.branch]??0)+quote.cost;
  if(project.kind==='continuous') state.continuous[projectId]=options.daily??project.cost;
  else state.completed[projectId]=(state.completed[projectId]??0)+1;
  if(project.kind==='area') for(const id of options.area??[]) {
    world.cells[id].resistance=clamp((world.cells[id].resistance??0)+(project.bonus.resistance??0),0,1);
  }
  else if(project.kind!=='continuous') for(const [key,value] of Object.entries(project.bonus)) {
    state.effects[key]=(state.effects[key]??0)+value;
  }
  world.events.push({day:world.day,type:'research',country:countryId,project:projectId,cost:quote.cost});
  return quote;
}

export function researchDay(world) {
  for(const [id,c] of Object.entries(world.countries)) {
    const state=researchState(world,id);
    for(const [projectId,daily] of Object.entries(state.continuous)) {
      const p=PROJECTS[projectId];
      const spent=Math.min(c.researchPoints??0,daily);
      c.researchPoints-=spent;
      state.effects[p.kind==='continuous'?'migration':projectId]=spent/daily*(p.bonus.migration??0);
    }
  }
}
