import {advance} from './engine.js?u4';
self.onmessage=event=>{const {world,mode,revision}=event.data;try{advance(world,1,mode);self.postMessage({world,revision});}catch(error){self.postMessage({error:error.message,revision});}};
