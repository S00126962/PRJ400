var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;

window.$ = window.Jquery = require("jquery");
var Gid = ""; //change when loading in
$(document ).ready(function() {
    console.log( "ready!" );
    $('#calendar').fullCalendar({
        header: {
          left: 'month,agendaWeek,agendaDay,AddEventBTN',
          center: 'title',
          right: 'prevYear,prev,next,nextYear'
        },
        footer: {
          left: 'AddEventBTN',
          center: '',
          right: 'prev,next'
        },
        customButtons: {
          AddEventBTN: {
            text: 'Add Event',
            click: AddEvent
          } 
        }
      });
    
    });


    ipcRenderer.on('load-guildEventPage', (event,args) => {
      console.log("Gid" + args); 
      Gid = args;
 
  });

  function AddEvent()
  {
    ipcRenderer.send('load-eventCreate',Gid)
    
  }




