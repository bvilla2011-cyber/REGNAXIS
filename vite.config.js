import {defineConfig} from 'vite';

export default defineConfig({
  base:'./',
  build:{target:'esnext',rollupOptions:{output:{manualChunks:{pixi:['pixi.js']}}}},
  server:{host:'0.0.0.0'}
});
