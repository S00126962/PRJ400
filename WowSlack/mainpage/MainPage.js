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
      
        var guildList =document.getElementById('guildsDll')
        guildList.innerHTML = "";
        
        db.collection('Users').where('UserID', '==',data).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                        populatePageDetails(doc.data());
                })
        })
        
});
function populatePageDetails(userData)
{
        document.getElementById('userName').innerHTML = userData.UserName;
        populateGuildsDropDown(userData);

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
                                guildToAppend.id = doc.id; //again,save id in id
                                guildToAppend.onclick = function(){}
                                console.log(guildToAppend)
                               document.getElementById('guildsDll').appendChild(guildToAppend)
                        })
                })
        

      
}



function loadGuildCreate()
{
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
        loadProfilePage();
});

function loadProfilePage(userData)
{
        $("#pageArea").load("../ProfilePage/ProfilePage.html");
        ipcRenderer.send("loadProfilePage");
}


