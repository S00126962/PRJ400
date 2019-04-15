//window.$ = window.jQuery = require('jquery'); // <-- main, not 'slim'
window.Popper = require('popper.js');
window.Tooltip = require('tooltip.js');
const remote = require('electron').remote;
var config = {
    apiKey: "AIzaSyBPwA6lwFFahoYIABYpeAvjmSA10gkj040",
    authDomain: "wow-slack.firebaseapp.com",
    databaseURL: "https://wow-slack.firebaseio.com",
    projectId: "wow-slack",
    storageBucket: "wow-slack.appspot.com",
    messagingSenderId: "105436064015"
};
if (!firebase.apps.length) {
    firebase.initializeApp(config); //pass the config to the init function
}

var db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
let calendar;


ipcRenderer.on('load-guildEventPage', (event, args) => {
    var tid = setInterval(function () {
        if (document.readyState !== 'complete') return;
        clearInterval(tid);
        var calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ['dayGrid'],
            defaultView: 'dayGridMonth',
            defaultDate: '2019-04-07',
            eventRender: function(info) {
                console.log(info);
                var tooltip = new Tooltip(info.el, {
                  title: "Wow",
                  placement: 'top',
        trigger: 'click',
        container: 'body'
                });
              },
              eventClick: function(info) {
                ipcRenderer.send('load-eventCreate', remote.getGlobal("loadGuildID"));
              },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
        
        });
        calendar.render();
        initLister();
    }, 100);
});


function initLister()
{
var guildref = db.collection("Guilds")
var guildInQuestions = guildref.doc(remote.getGlobal("loadGuildID"));
var events = guildInQuestions.collection('GuildEvents');

events.onSnapshot(snapshot => {
    var changes = snapshot.docChanges();
    changes.forEach(change => {
        //add events here
        var EventData = change.doc.data();
        var memeberNames = [];
        //get get the memeber names
        EventData.Memebers.forEach((mID) => {
            db.collection('Users').where('UserID', '==', mID).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    memeberNames.push(doc.data().UserName)
                })
                var eventContent = ""
                eventContent += 'Description:' + EventData.description + "\n";
                for (let index = 0; index < memeberNames.length; index++) {
                    eventContent += memeberNames[index] + "\n"
                    console.log(eventContent)
                }
                var tid = setInterval(function () {
                    if (document.readyState !== 'complete') return;
                    clearInterval(tid);
                    RenderEvent(EventData);
                    console.log(EventData)
                });
            }, 100);
        })
    })
})
}

function RenderEvent(eventObj) {

    var memeberNames = [];
    eventObj.Memebers.forEach((mID) => {
        db.collection('Users').where('UserID', '==', mID).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                memeberNames.push(doc.data().UserName)
            })


            var eventContent = ""
            eventContent += 'Description:' + eventObj.description + "\n";
            for (let index = 0; index < memeberNames.length; index++) {
                eventContent += memeberNames[index] + "\n"
                console.log(eventContent)
            }


            calendar.addEvent({
                title: eventObj.title,
                start: eventObj.start,
                end: eventObj.end,
                description: eventContent,
                eventMemebers: memeberNames

            });
        })
    })
}