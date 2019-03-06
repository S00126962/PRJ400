var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var remote = require('electron').remote

ipcRenderer.on('load-eventCreate',(args) =>{
    console.log("messageReviced" + args);

});

document.getElementById('createEventForm').addEventListener('submit', (sender) => {
    sender.preventDefault();
    AddEvent();
});

function AddEvent()
{
    var Gid = remote.getGlobal("Gid"); //gets the gid,make sure to null this out once your done
}