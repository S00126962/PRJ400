const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

ipcRenderer.on('ping',function(){
    alert('pong');
    console.log('pong')
})