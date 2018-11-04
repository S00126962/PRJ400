'use strict'
window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
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

ipcRenderer.on('info', function (event, data) {
        console.log("boo");
        var charList =document.getElementById('charactersDll')
        var guildList =document.getElementById('guildsDll')
        charList.innerHTML = "";
        guildList.innerHTML = "";
        
        db.collection('Users').where('UserID', '==',data).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                        populatePageDetails(doc.data());
                })
        })
        
});
function populatePageDetails(userData)
{
        console.log(userData.UserName);
        document.getElementById('userName').innerHTML = userData.UserName;
        populateCharacterDropDown(userData);
        populateGuildsDropDown(userData);

}

function populateCharacterDropDown(userData)
{
        var id = userData.UserID;
       var addCharBtn = document.createElement('a');
       addCharBtn.className ="dropdown-item"
       addCharBtn.innerHTML = "Add character";
       addCharBtn.id = "addCharBtn";
       addCharBtn.onclick = loadCharCreate;
       document.getElementById('charactersDll').appendChild(addCharBtn)
        db.collection('Characters').where('userID', '==',id).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                        var childToAppend = document.createElement('a');
                        childToAppend.className ="dropdown-item"
                        childToAppend.innerHTML = doc.data().charName;
                        childToAppend.id = "characterDlItem";
                        childToAppend.onclick = function(){loadCharpage(this.innerHTML)}
                       document.getElementById('charactersDll').appendChild(childToAppend)
                })
        })
         
}

function populateGuildsDropDown(userData)
{
        var guildId = userData.GuildID;
        console.log(guildId)
        var addGuldBtn = document.createElement('a');
        addGuldBtn.className ="dropdown-item"
        addGuldBtn.innerHTML = "Add Guild";
        addGuldBtn.id = "addGuildBtn";
        addGuldBtn.onclick = loadGuildCreate;
        document.getElementById('guildsDll').appendChild(addGuldBtn)

   

                db.collection('Guilds').where('GuildID', '==',userData.GuildID).get().then((snapshot) => {
                        snapshot.docs.forEach(doc => {
                                var guildToAppend = document.createElement('a');
                                guildToAppend.className ="dropdown-item"
                                guildToAppend.innerHTML = doc.data().GuildName;
                                guildToAppend.id = "guildDlItem";
                                guildToAppend.onclick = function(){}
                                console.log(guildToAppend)
                               document.getElementById('guildsDll').appendChild(guildToAppend)
                        })
                })
        

      
}

function loadCharCreate()
{
        ipcRenderer.send('load-charCreate')
}

function loadGuildCreate()
{
        console.log("Test")
        ipcRenderer.send('load-guildCreate')
}

//addCharBtn.addEventListener('click',() =>{
  //      ipcRenderer.send('load-charCreate')
//})
function loadCharpage(name)
{
        //code here to load up the char page
}



var signOutBtn = document.getElementById('signoutBtn');
signOutBtn.addEventListener('click', function (event) {
        var config = {
                apiKey: "AIzaSyBPwA6lwFFahoYIABYpeAvjmSA10gkj040",
                authDomain: "wow-slack.firebaseapp.com",
                databaseURL: "https://wow-slack.firebaseio.com",
                projectId: "wow-slack",
                storageBucket: "wow-slack.appspot.com",
                messagingSenderId: "105436064015"
        };
        firebase.initializeApp(config);
        firebase.auth().signOut().then(function(){
                
         ipcRenderer.send('sign-out')
        }).catch(function (error) {

                if (error != null) {
                  alert(error.message)
                  return;
                }
              })
  });

$(document).ready(function () {
        $("#pageArea").load("../ProfilePage/ProfilePage.html");

});