window.Popper = require('popper.js');
window.Tooltip = require('tooltip.js');
window.select2 = require('select2');

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
let calendar; //decalre calendar here, so other functions can get at it


ipcRenderer.on('load-guildEventPage', (event, args) => {
    var tid = setInterval(function () {
        if (document.readyState !== 'complete') return;
        clearInterval(tid);
        var calendarEl = document.getElementById('calendar'); //get the div for the calendar

        calendar = new FullCalendar.Calendar(calendarEl, { //make it a full calendar
            plugins: ['interaction', 'dayGrid', 'timeGrid'], //plugins for differnt views
            timeZone: 'UTC', //default timezone
            defaultView: 'dayGridMonth', //default view for the calendar
            customButtons: { //custom button for users to add event
                AddEventBtn: {
                    text: 'Add Event',
                    click: function () {
                        AddEvent();
                    }
                }
            },
            eventClick: function (info) { //when a event is clicked, load its details into the childwindow
                ipcRenderer.send('load-eventEdit', info.event.id);
            },
            header: { //set up the header,IE the controls on the calendar
                left: 'prev,next today AddEventBtn',
                right: 'title',
                center: 'dayGridMonth,timeGridWeek'
            },

        });
        calendar.render(); //render the calendar
        initLister(); //once the calendar is rendered and setup, start the database listener for events
    }, 100);
});


function initLister() {
    var guildref = db.collection("Guilds") //go to guilds
    var guildInQuestions = guildref.doc(remote.getGlobal("loadGuildID")); //get the current guild
    var events = guildInQuestions.collection('GuildEvents'); //get that guilds events
    ipcRenderer.send('toggleLoaderOff'); //turn off loading here, users can see the event "load" in
    events.onSnapshot(snapshot => {
        var changes = snapshot.docChanges();
        changes.forEach(change => {
            var EventData = change.doc.data(); //get the data for the event
            var memeberNames = [];
            EventData.Memebers.forEach((mID) => { //loop though all the memebers
                db.collection('Users').where('UserID', '==', mID).get().then((snapshot) => { //find there user record
                    snapshot.docs.forEach(doc => {
                        memeberNames.push(doc.data().UserName) //add their name to the array
                    })
                    var eventContent = "" //build up a description object with the memebers
                    eventContent += 'Description:' + EventData.description + "\n";
                    for (let index = 0; index < memeberNames.length; index++) {
                        eventContent += memeberNames[index] + "\n"
                    }
                    var tid = setInterval(function () {
                        if (document.readyState !== 'complete') return; //make sure the document is ready
                        clearInterval(tid);
                        RenderEvent(EventData, eventContent, change.doc.id); //then render the event
                    });
                }, 100);
            })
        })
    })
}

function AddEvent() {
    ipcRenderer.send('load-eventCreate', remote.getGlobal("loadGuildID"))
}

function RenderEvent(eventObj, eventContent, eventID) {

    if (calendar.getEventById(eventID)) { //check to see if that event is there already
        calendar.getEventById(eventID).remove(); //remove it,this is to prevent an event being edited, and readded as a differnt event
    }
    //render the event to the calendar
    calendar.addEvent({
        id: eventID,
        title: eventObj.title,
        start: eventObj.start,
        end: eventObj.end,
        description: eventContent,
    });

}