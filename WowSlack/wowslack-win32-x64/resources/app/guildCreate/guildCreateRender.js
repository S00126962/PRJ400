const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
var remote = electron.remote;
const blizzard = require('blizzard.js').initialize({
    key: 'cc03f6bfa99541d9b2644e450b96eadf',
    secert : 'e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI',
    access_token : remote.getGlobal('Token')
    });

var config = {
    apiKey: "AIzaSyBPwA6lwFFahoYIABYpeAvjmSA10gkj040",
    authDomain: "wow-slack.firebaseapp.com",
    databaseURL: "https://wow-slack.firebaseio.com",
    projectId: "wow-slack",
    storageBucket: "wow-slack.appspot.com",
    messagingSenderId: "105436064015"
};
firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({timestampsInSnapshots:true})


//details for sumbit
var guildCreateForm = document.getElementById('guildCreateForm');
var guildName = document.getElementById('inputGuildName');
var guildDescrip = document.getElementById('guildDescrip');
var regionSelect = document.getElementById('regionSelect');
var serverSelect = document.getElementById('serverSelect');

regionSelect.addEventListener('change', () => { //simliar to char create,whenever the region changes
    serverSelect.options.length = 0;
    if (regionSelect.options[regionSelect.selectedIndex].value == "choose") {
        return;
    } else {
        blizzard.wow.realms({ //call the api to get the servers in that region
                origin: regionSelect.options[regionSelect.selectedIndex].value
            })
            .then(response => { //fill the server select with the reponse
                for (let index = 0; index < response.data.realms.length; index++) {
                    var rName = response.data.realms[index].name
                    var childToAppend = document.createElement('option');
                    childToAppend.innerHTML = rName;
                    childToAppend.value = rName;
                    serverSelect.appendChild(childToAppend);
                }
            });
    }
})

guildCreateForm.addEventListener('submit', (event)=>{

    event.preventDefault(); //prevent the form default
    db.collection('Guilds').add({ //add the guild to the database
        GuildName: guildName.value,
        GuildRealm: serverSelect.options[serverSelect.selectedIndex].innerText,
        GuildRegion: regionSelect.options[regionSelect.selectedIndex].innerText,
        GuildDescription: guildDescrip.value,
       GuildMemebers : [remote.getGlobal("uid")], //start off us just the user in the guild
       GuildLeader : remote.getGlobal("uid"), //set the creator as the leader
    }).then(function (docRef) {
        console.log(docRef);
//used to timestamp hello messages
     var today = new Date(); //get the date
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); //format date
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); //format time
      var timeStamp = date + ' ' + time; //create timestamp
        //now build up the collections for events/messaging/voice chat
        var newGuildRef = db.collection('Guilds').doc(docRef.id); //get the guild we just created
        newGuildRef.update({GuildInviteCode : "JoinUs:" + docRef.id }) //add the invite code
         newGuildRef.collection('ChatChannels').doc('1').collection('Messages').doc().set({ //set a defulat message,ID doesnt matter,system doesnt look for IDS when pulling messages
            MessagerSender : "WowSlack",
            MessageText : "Welcome To WowSlack Chat!",
            MessageTimeStamp : timeStamp
         }).then(() =>{
            newGuildRef.collection('ChatChannels').doc('1').set({ //now set the default name for a channel
                ChannelName : "MainChannel" 
            })
         })
         newGuildRef.collection('VoiceChannels').doc('1').set({ //do the same for voice chat
             Name: "Main Channel"
         });
         newGuildRef.collection('GuildEvents').doc().set({ //need a default event to fill the table,dont like it but it will have to do
             Memebers : [],
             description : "Default event",
             start: date,
             end:date,
             title:"Default Event",
             eventEditable : true
         }).then(() =>{
             ipcRenderer.send('asynchronous-message',firebase.auth().currentUser.uid)
         })
    })
    .catch(function (error) {
        console.error("Error writing document: ", error);
    });
}).catch(function (error) {

    if (error != null) {
        alert(error.message)
        return;
    }

})