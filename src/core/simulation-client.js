export class SimulationClient {
  constructor(worker = new Worker(new URL('../sim/worker.js',import.meta.url),{type:'module'})) {
    this.worker=worker;this.pending=new Map();this.nextId=1;
    worker.onmessage=({data})=>{
      const request=this.pending.get(data.id);
      if (!request) return;
      this.pending.delete(data.id);
      data.ok ? request.resolve(data) : request.reject(new Error(data.error));
    };
    worker.onerror=error=>{
      for (const request of this.pending.values()) request.reject(error);
      this.pending.clear();
    };
  }
  send(type,payload={}) {
    const id=this.nextId++;
    return new Promise((resolve,reject)=>{
      this.pending.set(id,{resolve,reject});
      this.worker.postMessage({id,type,payload});
    });
  }
  close() {this.worker.terminate();this.pending.clear();}
}
