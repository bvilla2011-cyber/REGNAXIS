// UN M49 identifiers; the list is scenario data, not a statement about future membership.
export const EU_MEMBERS=Object.freeze(['040','056','100','191','196','203','208','233','246','250','276','300','348','372','380','428','440','442','470','528','616','620','642','703','705','724','752']);
export function sameBloc(a,b){return a!==b&&EU_MEMBERS.includes(a)&&EU_MEMBERS.includes(b);}
export function initializeBlocs(world){world.blocs={EU:[...EU_MEMBERS].filter(id=>world.countries[id])};world.diplomacy??={};for(const a of world.blocs.EU)for(const b of world.blocs.EU)if(a<b){const key=`${a}|${b}`;world.diplomacy[key]={value:84,trust:75,treaties:[{type:'defense',day:0,bloc:'EU'}],atWar:false};}return world;}
