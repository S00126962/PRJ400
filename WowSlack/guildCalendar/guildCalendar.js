var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;

window.$ = window.Jquery = require("jquery");
$(document ).ready(function() {
    console.log( "ready!" );
    $('#calendar').fullCalendar({
        header: {
          left: 'month,agendaWeek,agendaDay custom1',
          center: 'title',
          right: 'custom2 prevYear,prev,next,nextYear'
        },
        footer: {
          left: 'custom1,custom2',
          center: '',
          right: 'prev,next'
        },
        customButtons: {
          custom1: {
            text: 'Add Event',
            click: AddEvent
          } 
        }
      });
    
    });


    ipcRenderer.on('load-guildEventPage', (event,args) => {
      console.log("Gid" + args); 
      
  });

  function AddEvent()
  {
    console.log("Add event Clicked");
    
  }




