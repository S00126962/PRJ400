

window.$ = window.Jquery = require("jquery");

var config = {
  apiKey: "AIzaSyBPwA6lwFFahoYIABYpeAvjmSA10gkj040",
  authDomain: "wow-slack.firebaseapp.com",
  databaseURL: "https://wow-slack.firebaseio.com",
  projectId: "wow-slack",
  storageBucket: "wow-slack.appspot.com",
  messagingSenderId: "105436064015"
};
firebase.initializeApp(config);
var db = firebase.firestore();
db.settings({timestampsInSnapshots:true})
var Gid = ""; //change when loading in
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;

$(document).ready(function() {
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
        eventRender: function(eventObj, $el) {
          $el.popover({
            title: eventObj.title,
            content:eventObj.description,
            trigger: 'hover',
            placement: 'top',
            container: 'body'
          });
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

  
var guildref = db.collection("Guilds")
var guildInQuestions = guildref.doc("1");
var events = guildInQuestions.collection('GuildEvents');

events.onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    //add events here
    var EventData = change.doc.data();
    var memeberNames = [];
    //get get the memeber names
    EventData.Memebers.forEach((mID) =>{
      db.collection('Users').where('UserID', '==', mID).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          memeberNames.push(doc.data().UserName)
        })
})
    })

    var eventContent = ""
    eventContent += 'Description:' + EventData.description + "\n";
    for (let index = 0; index < memeberNames.length; index++) {
      eventContent += memeberNames[index] + "\n"
      console.log(eventContent)
    }
    $('#calendar').fullCalendar('renderEvent', {
      title: EventData.title,
      start: EventData.start,
      end : EventData.end,
      description : eventContent,
      eventMemebers : memeberNames
    });
  })
})



  function AddEvent()
  {
    ipcRenderer.send('load-eventCreate',Gid)
    
  }




