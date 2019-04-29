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
    document.getElementById('AddSelected').addEventListener('click', (sender) => {
        sender.preventDefault();
        addMemebers();
    });
    document.getElementById('createEventForm').addEventListener('submit', (sender) => {
        sender.preventDefault();
        AddEvent();
    });
    loadMemebers();
    });


function AddEvent()
{
    //get all the values needed to create the event
    var eventName = document.getElementById('inputEventName').value;
    var eventStartDate = document.getElementById('eventStartDate').value;
    var eventEndDate = document.getElementById('eventEndDate').value;
    var eventDescrip = document.getElementById('eventDesc').value;
    var Memebers = document.getElementById("addedMemebers").getElementsByTagName("li");

    //get the Ids of the event attendies, can be edited later by the user
    var eventMemebers = [];
    for (let index = 0; index < Memebers.length; index++) {
         eventMemebers[index] = Memebers[index].id;   
    }

    var guildref = db.collection("Guilds");//go to the guild collection
    var guildInQuestions = guildref.doc(remote.getGlobal("Gid")); //get the current guild
    var events = guildInQuestions.collection("GuildEvents"); //get the events collection for that guild
    events.add({ //add the event
        title : eventName,
        start: eventStartDate,
        end: eventEndDate,
        eventEditable : true,
        description : eventDescrip,
        Memebers : eventMemebers
    });
    ipcRenderer.send('eventAdded') //send the message that the event was added,this will close the window
}

function loadMemebers() //pulls in a list of all the users guild's memebers from the database to add to the event
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