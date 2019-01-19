window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')

var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
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
var auth = firebase.auth();
db.settings({
        timestampsInSnapshots: true
})

ipcRenderer.on('info', function (event, data) {

        var guildList = document.getElementById('guildsDll')
        guildList.innerHTML = "";

        db.collection('Users').where('UserID', '==', data).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                        populatePageDetails(doc.data());
                })
        })

});

function populatePageDetails(userData) {
        document.getElementById('userName').innerHTML = userData.UserName;
        populateGuildsDropDown(userData);
        var itemCalcBtn = document.getElementById("itemCalcBtn");
        itemCalcBtn.onclick = loadItemCalc;

}


function populateGuildsDropDown(userData) {
        var addGuldBtn = document.createElement('a');
        addGuldBtn.className = "dropdown-item"
        addGuldBtn.innerHTML = "Add Guild";
        addGuldBtn.id = "addGuildBtn";
        addGuldBtn.onclick = loadGuildCreate;
        document.getElementById('guildsDll').appendChild(addGuldBtn)



        db.collection('Guilds').where('GuildID', '==', userData.GuildID).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                        var guildToAppend = document.createElement('a');
                        guildToAppend.className = "dropdown-item"
                        guildToAppend.innerHTML = doc.data().GuildName;
                        guildToAppend.id = doc.id; //again,save id in id
                        guildToAppend.addEventListener("click", () => {
                                loadGuildPage(guildToAppend.id)
                        });
                        document.getElementById('guildsDll').appendChild(guildToAppend)
                })
        })

}


function loadGuildCreate() {
        ipcRenderer.send('load-guildCreate')
}


function loadCharpage(name) {
        //code here to load up the char page,may/maynot be need in end soultion
}

function loadItemCalc() {
        $("#pageArea").load("../itemCalc/itemcalc.html");
        ipcRenderer.send("load-itemCalc");
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
        firebase.auth().signOut().then(function () {

                ipcRenderer.send('sign-out')
        }).catch(function (error) {

                if (error != null) {
                        alert(error.message)
                        return;
                }
        })
});

var profileBtn = document.getElementById('profilePageBtn');
profileBtn.addEventListener('click', () => {
        loadProfilePage();
      //  sendTabChangeMessage;
})

$(document).ready(function () {
        loadProfilePage(); //default page load here
});


function loadProfilePage() {
        console.log("Boom");
        $("#pageArea").load("../ProfilePage/ProfilePage.html");
         ipcRenderer.send("tabChangeProfile");
}

//function sendTabChangeMessage()
//{
    //    console.log("tab change here");
  //      ipcRenderer.send("tabChangeProfile");
//}

function loadGuildPage(id) {
        console.log("In mainpage")
        $("#pageArea").load("../guildPage/guildPage.html");
        ipcRenderer.send("load-guildpage", id);
}