// Immutable quadtree for fast hit testing of map points and units.
export function buildSpatialIndex(items, bounds, capacity = 16, depth = 0) {
  const node = {bounds, items:[], children:null};
  if (items.length <= capacity || depth >= 12) {node.items=items;return node;}
  const {x,y,width,height}=bounds, hw=width/2, hh=height/2;
  const boxes=[{x,y,width:hw,height:hh},{x:x+hw,y,width:hw,height:hh},
    {x,y:y+hh,width:hw,height:hh},{x:x+hw,y:y+hh,width:hw,height:hh}];
  node.children=boxes.map(box=>buildSpatialIndex(items.filter(item=>contains(box,item.x,item.y)),box,capacity,depth+1));
  return node;
}

function contains(box,x,y) {return x>=box.x && x<box.x+box.width && y>=box.y && y<box.y+box.height;}

export function querySpatial(node,x,y,radius=0,out=[]) {
  const b=node.bounds;
  if (x+radius<b.x || x-radius>b.x+b.width || y+radius<b.y || y-radius>b.y+b.height) return out;
  if (node.children) for (const child of node.children) querySpatial(child,x,y,radius,out);
  else for (const item of node.items) if (Math.hypot(item.x-x,item.y-y)<=radius) out.push(item);
  return out;
}
