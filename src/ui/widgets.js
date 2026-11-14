import {Container,Graphics,Text,Rectangle} from 'pixi.js';

export const C={bg:0x050d18,panel:0x101f32,raised:0x1b3045,accent:0x2ce9d3,gold:0xd8ac61,
  text:0xe6f2f4,muted:0x829baa,red:0xff6479,blue:0x4579d6,green:0x3fc69e};

export function label(value,size=16,color=C.text,weight='500') {
  return new Text({text:String(value),style:{fontFamily:'Arial, sans-serif',fontSize:size,fontWeight:weight,fill:color,
    letterSpacing:size>=18?1.3:0.5}});
}

export function panel(w,h,{accent=C.accent,fill=C.panel}={}) {
  const g=new Graphics();
  g.roundRect(0,0,w,h,12).fill({color:fill,alpha:0.96});
  g.roundRect(0,0,w,h,12).stroke({color:accent,alpha:0.34,width:1.5});
  g.moveTo(14,2).lineTo(Math.min(w-20,105),2).stroke({color:accent,width:3,alpha:0.8});
  g.moveTo(0,h-20).lineTo(0,h-60).stroke({color:accent,width:2,alpha:0.5});
  return g;
}

export function button(title,w,h,callback,{accent=C.accent,small=false}={}) {
  const root=new Container();root.eventMode='static';root.cursor='pointer';root.hitArea=new Rectangle(0,0,w,h);
  const bg=new Graphics();bg.roundRect(0,0,w,h,8).fill({color:C.raised,alpha:0.98});
  bg.roundRect(0,0,w,h,8).stroke({color:accent,width:1.5,alpha:0.75});
  bg.moveTo(9,h-3).lineTo(w-9,h-3).stroke({color:accent,width:2,alpha:0.7});root.addChild(bg);
  const text=label(title,small?13:16,C.text,'700');text.anchor.set(0.5);text.position.set(w/2,h/2);root.addChild(text);
  root.on('pointerover',()=>{bg.tint=0xc5ffff;});root.on('pointerout',()=>{bg.tint=0xffffff;});
  root.on('pointertap',e=>{e.stopPropagation();callback();});
  return root;
}

export function addText(container,value,x,y,size=16,color=C.text,weight='500') {
  const text=label(value,size,color,weight);text.position.set(x,y);container.addChild(text);return text;
}

export function grid(w,h,tick=0,quality='high') {
  const g=new Graphics();g.rect(0,0,w,h).fill(C.bg);
  const spacing=quality==='low'?100:55;
  for(let x=0;x<w;x+=spacing)g.moveTo(x,0).lineTo(x,h).stroke({color:C.accent,alpha:0.055,width:1});
  for(let y=0;y<h;y+=spacing)g.moveTo(0,y).lineTo(w,y).stroke({color:C.accent,alpha:0.055,width:1});
  const glowX=w*0.62+Math.sin(tick*0.0004)*w*0.08;
  g.circle(glowX,h*0.4,quality==='low'?70:150).fill({color:C.blue,alpha:0.045});
  return g;
}
