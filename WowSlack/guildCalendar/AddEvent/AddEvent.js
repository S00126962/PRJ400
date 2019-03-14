var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var remote = require('electron').remote
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

$(document ).ready(function() {
    loadMemebers();
    });


ipcRenderer.on('load-eventCreate',(args) =>{
    console.log("messageReviced" + args);

    //first need to get a list of everyone in the guild
    var guildref = db.collection("Guilds")
    var guildInQuestions = guildref.doc(remote.getGlobal("Gid"));

    guildInQuestions.get().then((snapshot) =>{
        snapshot.forEach(doc =>{
            console.log("I am grrot");
        });
    });
});

document.getElementById('createEventForm').addEventListener('submit', (sender) => {
    sender.preventDefault();
    AddEvent();
});

function AddEvent()
{
    var Gid = remote.getGlobal("Gid"); //gets the gid,make sure to null this out once your done
    console.log("Gid");

    var eventName = document.getElementById('inputEventName').value;
    var eventStartDate = document.getElementById('eventStartDate').value;
    var eventEndDate = document.getElementById('eventEndDate').value;
    var eventDescrip = document.getElementById('eventDesc').value;
    var Memebers = document.getElementById("addedMemebers").getElementsByTagName("li");

    var eventMemebers = [];
    for (let index = 0; index < Memebers.length; index++) {
         eventMemebers[index] = Memebers[index].id;   
    }

    console.log(eventMemebers);

    var guildref = db.collection("Guilds")
    var guildInQuestions = guildref.doc(remote.getGlobal("Gid"));
    var events = guildInQuestions.collection("GuildEvents");
    events.add({
        title : eventName,
        start: eventStartDate,
        end: eventEndDate,
        eventEditable : true,
        description : eventDescrip,
        Memebers : eventMemebers
    });
}

function loadMemebers()
{
    var guildref = db.collection("Guilds");
    var id = remote.getGlobal("Gid");
    var guildInQuestions = guildref.doc(remote.getGlobal("Gid"));

    guildInQuestions.get().then((snapshot) =>{
        var GuildMemebers = snapshot.data().GuildMemebers;

        var memebersSelect = document.getElementById('guildMemebersSel');


        for (let index = 0; index < GuildMemebers.length; index++) {
            db.collection('Users').where('UserID', '==', GuildMemebers[index]).get().then((uSnapShot) => {
                uSnapShot.docs.forEach(doc => {
                        var memeber = document.createElement('option');
                        memeber.id = doc.data().UserID;
                        memeber.innerHTML = doc.data().UserName;
                        memebersSelect.appendChild(memeber);
                })
        })
        }
      
    });
}

document.getElementById('AddSelected').addEventListener('click', () => {
    addMemebers();
})
function addMemebers()
{
    
    var clicked = document.getElementById("guildMemebersSel").options[document.getElementById("guildMemebersSel").selectedIndex];
    var newMemeber = document.createElement('li');
    newMemeber.className = "list-group-item";
    newMemeber.innerHTML =clicked.value;
    newMemeber.id = clicked.id;
    console.log(newMemeber);
    document.getElementById('addedMemebers').appendChild(newMemeber);
}