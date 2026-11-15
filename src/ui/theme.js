export const palettes=Object.freeze({normal:{bg:'#080d1b',panel:'#141d35',cyan:'#60dce4',violet:'#986cf5',plasma:'#d65af0',gold:'#e3bc82',red:'#f0759b',white:'#f0f2ff',muted:'#a6b3cd'},accessible:{bg:'#070b14',panel:'#18233a',cyan:'#6eeaff',violet:'#b8a1ff',plasma:'#ed86ff',gold:'#ffdc69',red:'#ff7788',white:'#ffffff',muted:'#c6d3e8'}});
export const theme={...palettes.normal};
export function applyTheme(name){Object.assign(theme,palettes[name]??palettes.normal);}
