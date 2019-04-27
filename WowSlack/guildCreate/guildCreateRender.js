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


var guildCreateForm = document.getElementById('guildCreateForm');
var guildName = document.getElementById('inputGuildName');
var guildDescrip = document.getElementById('guildDescrip');
var regionSelect = document.getElementById('regionSelect');
var serverSelect = document.getElementById('serverSelect');

regionSelect.addEventListener('change', () => {   
    serverSelect.options.length = 0;
    if (regionSelect.options[regionSelect.selectedIndex].value == "choose") {
        return;
    } else {
        blizzard.wow.realms({
                origin: regionSelect.options[regionSelect.selectedIndex].value
            })
            .then(response => {
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

    event.preventDefault();
    db.collection('Guilds').add({
        GuildName: guildName.value,
        GuildRealm: serverSelect.options[serverSelect.selectedIndex].innerText,
        GuildRegion: regionSelect.options[regionSelect.selectedIndex].innerText,
        GuildDescription: guildDescrip.value,
       GuildMemebers : [remote.getGlobal("uid")], //start off us just the user in the guild
       GuildLeader : remote.getGlobal("uid"), //set the creator as the leader
    }).then(function (docRef) {
        console.log(docRef);

        var newGuildRef = db.collection('Guilds').doc(docRef.id);
        newGuildRef.update({GuildInviteCode : "JoinUs:" + docRef.id })
         newGuildRef.collection('ChatMessages').doc('1').collection('Messages').doc().set({
            MessagerSender : "WowSlack",
            MessageText : "Welcome To WowSlack Chat!",
            MessageTimeStamp : "Welcome!"
         }).then(() =>{
            newGuildRef.collection('ChatChannels').doc('1').set({
                ChannelName : "MainChannel"
            })
         })
         newGuildRef.collection('VoiceChannels').doc('1').set({
             Name: "Main Channel"
         })
         var today = new Date(); //get the date
         var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); //format date
         newGuildRef.collection('GuildEvents').doc().set({
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