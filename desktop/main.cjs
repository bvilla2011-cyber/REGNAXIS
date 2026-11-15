const {app,BrowserWindow}=require('electron');const path=require('node:path');
function launch(){const win=new BrowserWindow({width:1366,height:768,minWidth:960,minHeight:540,autoHideMenuBar:true,backgroundColor:'#080d1b',webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});win.loadFile(path.join(__dirname,'../dist/index.html'));}
app.whenReady().then(launch);app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)launch();});
