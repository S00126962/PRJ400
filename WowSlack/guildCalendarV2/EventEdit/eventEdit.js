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

    var guildref = db.collection("Guilds"); //go to the guild
    var guildInQuestions = guildref.doc(remote.getGlobal("Gid")); //get the current guild
    var guildEvents = guildInQuestions.collection("GuildEvents"); //get the events table

    var editingEvent = guildEvents.doc(remote.getGlobal("editEventID")); //get the event we are editing

    editingEvent.get().then((eventDoc) =>{ //get the document
        //set the data from the event to the relevant feilds
        document.getElementById('inputEventName').value = eventDoc.data().title;
        document.getElementById('eventStartDate').value = eventDoc.data().start;
        document.getElementById('eventEndDate').value = eventDoc.data().end;
        document.getElementById('eventDesc').value = eventDoc.data().description;
    });
    //now get the guild memebers
    guildInQuestions.get().then((snapshot) =>{
        var GuildMemebers = snapshot.data().GuildMemebers;
        var memebersSelect = document.getElementById('guildMemebersSel'); //get the list storing the current attendies
        for (let index = 0; index < GuildMemebers.length; index++) { //loop though all guild memebers
            db.collection('Users').where('UserID', '==', GuildMemebers[index]).get().then((uSnapShot) => { 
                uSnapShot.docs.forEach(doc => {
                    //create the option for the memeber
                        var memeber = document.createElement('option');
                        memeber.id = doc.data().UserID;
                        memeber.innerHTML = doc.data().UserName;
                        memebersSelect.appendChild(memeber); //append it
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
    var guildref = db.collection("Guilds"); //get the guild collection
    var guildInQuestions = guildref.doc(remote.getGlobal("Gid")); //get the current guild
    var guildEvents = guildInQuestions.collection("GuildEvents"); //get that guilds events
    var editingEvent = guildEvents.doc(remote.getGlobal("editEventID")); //get the doc we want to update
    var Memebers = document.getElementById("addedMemebers").getElementsByTagName("li"); //get all the memebers
    var eventMemebers = [];
    for (let index = 0; index < Memebers.length; index++) { //loop though the memebers
         eventMemebers[index] = Memebers[index].id;  //add there ids to the event Memebers array
    }
    editingEvent.update({ //call update with all the neccary values
        Memebers : eventMemebers,
        description :document.getElementById('eventDesc').value,
        end : document.getElementById('eventEndDate').value,
        eventEditable : true,
        start : document.getElementById('eventStartDate').value,
        title :document.getElementById('inputEventName').value
    });

    ipcRenderer.send('eventUpdated'); //send the message back to main, this will close the child window

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
