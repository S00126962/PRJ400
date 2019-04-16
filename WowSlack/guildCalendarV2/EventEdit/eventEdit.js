var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var remote = require('electron').remote
window.$ = window.Jquery = require("jquery");
window.select2 = require('select2');
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

    //first things first,lets get the data we need,eg the data on firebase for the event

    var guildref = db.collection("Guilds");
    var id = remote.getGlobal("Gid");
    var guildInQuestions = guildref.doc(remote.getGlobal("Gid"));
    var guildEvents = guildInQuestions.collection("GuildEvents");

    var editingEvent = guildEvents.doc(remote.getGlobal("editEventID"));

    editingEvent.get().then((eventDoc) =>{
        console.log(eventDoc.data())
        document.getElementById('inputEventName').value = eventDoc.data().title;
        document.getElementById('eventStartDate').value = eventDoc.data().start;
        document.getElementById('eventEndDate').value = eventDoc.data().end;
        document.getElementById('eventDesc').value = eventDoc.data().description;
    });
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
    document.getElementById('AddSelected').addEventListener('click', (sender) => {
        sender.preventDefault();
        addMemebers();
    });


    document.getElementById('editEventForm').addEventListener('submit', (sender) => {
        sender.preventDefault();
        UpdateEvent();
    });
    loadMemebers();

    });


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
                    var newMemeber = document.createElement('li');
                    newMemeber.className = "list-group-item";
                    newMemeber.innerHTML =doc.data().UserName;;
                    newMemeber.id = doc.data().UserID;
                    var btn = document.createElement('button');
                    btn.className = "btn btn-danger btn-xs"; //need restyle
                    btn.innerHTML = "X";
                    btn.addEventListener('click', (sender) =>{
                        sender.preventDefault();
                        newMemeber.remove();
                    })
                    newMemeber.append(btn);
                    console.log(newMemeber);
                    document.getElementById('addedMemebers').appendChild(newMemeber);
                })
        })
        }
      
    });
}

function UpdateEvent()
{
    var guildref = db.collection("Guilds");
    var id = remote.getGlobal("Gid");
    var guildInQuestions = guildref.doc(remote.getGlobal("Gid"));
    var guildEvents = guildInQuestions.collection("GuildEvents");
    var editingEvent = guildEvents.doc(remote.getGlobal("editEventID"));
    var Memebers = document.getElementById("addedMemebers").getElementsByTagName("li");
    var eventMemebers = [];
    for (let index = 0; index < Memebers.length; index++) {
         eventMemebers[index] = Memebers[index].id;   
    }
    editingEvent.update({
        Memebers : eventMemebers,
        description :document.getElementById('eventDesc').value,
        end : document.getElementById('eventEndDate').value,
        eventEditable : true,
        start : document.getElementById('eventStartDate').value,
        title :document.getElementById('inputEventName').value
    });

    ipcRenderer.send('eventUpdated');

}

function addMemebers()
{   
    var clicked = document.getElementById("guildMemebersSel").options[document.getElementById("guildMemebersSel").selectedIndex];
    var newMemeber = document.createElement('li');
    newMemeber.className = "list-group-item";
    newMemeber.innerHTML =clicked.value;
    newMemeber.id = clicked.id;
    var btn = document.createElement('button');
    btn.className = "btn btn-danger btn-xs"; //need restyle
    btn.innerHTML = "X";
    btn.addEventListener('click', (sender) =>{
        sender.preventDefault();
        newMemeber.remove();
    })
    newMemeber.append(btn);
    console.log(newMemeber);
    document.getElementById('addedMemebers').appendChild(newMemeber);
}
