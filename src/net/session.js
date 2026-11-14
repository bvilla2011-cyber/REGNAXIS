/** Network boundary: the simulation remains authoritative and transport is replaceable. */
export class LocalPassAndPlay {
  constructor(players=['A','B']){this.players=[...players];this.turn=0;this.listeners=new Set();}
  current(){return this.players[this.turn];}
  advance(){this.turn=(this.turn+1)%this.players.length;for(const fn of this.listeners)fn(this.current());return this.current();}
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
}
export class RoomTransport {
  constructor(adapter){this.adapter=adapter;this.listeners=new Set();this.state='offline';}
  async connect({room,password}){if(!this.adapter)throw new Error('Configura un adaptador de señalización para habilitar salas online');this.state='connecting';await this.adapter.connect({room,password});this.state='connected';}
  send(command){if(this.state!=='connected')throw new Error('Sala no conectada');return this.adapter.send(command);}
  onMessage(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
  close(){this.adapter?.close?.();this.state='offline';this.listeners.clear();}
}
