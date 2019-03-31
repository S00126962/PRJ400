window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')

var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
const remote = require('electron').remote
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


        var uID = remote.getGlobal("uid");
        db.collection('Users').where('UserID', '==', uID).get().then((snapshot) => {
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
        document.getElementById('guildDropDown').innerHTML = "";
        var addGuldBtn = document.createElement('a');
        addGuldBtn.className = "dropdown-item"
        addGuldBtn.innerHTML = "Add Guild";
        addGuldBtn.id = "addGuildBtn";
        addGuldBtn.onclick = loadGuildCreate;
        document.getElementById('guildDropDown').appendChild(addGuldBtn)
        var divder = document.createElement('div');
        divder.className = "dropdown-divider";
        document.getElementById('guildDropDown').appendChild(divder)
        db.collection('Guilds').where('GuildID', '==', userData.GuildID).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                        var guildToAppend = document.createElement('a');
                        guildToAppend.className = "dropdown-item"
                        guildToAppend.innerHTML = doc.data().GuildName;
                        guildToAppend.id = doc.id; //again,save id in id
                        guildToAppend.addEventListener("click", () => {
                                loadGuildOpts(guildToAppend.id,doc.data().GuildName);
                        });
                        document.getElementById('guildDropDown').appendChild(guildToAppend)
                })
        })

}


function loadGuildCreate() {
        ipcRenderer.send('load-guildCreate')
}

function loadGuildOpts(id,name) {

        if (document.getElementById('loadedGuildTChannelsDDL') ==undefined ) {
                //attach a new item to the side bar
                var li = document.createElement('li');
                li.className= "nav-item dropdown";
                var a = document.createElement('a');
                a.className = "nav-link dropdown-toggle";
                a.id = "navDropDown" + ":" + id;
                a.innerHTML = name + "'s" + " " +"Channels"
                a.setAttribute("data-toggle","dropdown")
                a.setAttribute("aria-haspopup","true")
                a.setAttribute("aria-expanded","false")
                li.appendChild(a);
                var dropdown = document.createElement('div');
                dropdown.id = "loadedGuildTChannelsDDL";
                dropdown.classList = "dropdown-menu";
                dropdown.setAttribute("aria-labelledby","navDropDown" + ":" + id);
                li.appendChild(dropdown);
                document.getElementById('sidebar').appendChild(li);
        }
        if (document.getElementById('loadedGuildEventLink') ==undefined ) {
                var eventLi = document.createElement('li');
                eventLi.className = "nav-item"
                var eventA = document.createElement('a');
                eventA.id = "loadedGuildEventLink"
                eventA.innerHTML = name + "'s" + " " +"Events"
                eventA.className = "nav-link";
                eventA.addEventListener('click', () => {
                        loadEventPage(id)
               })
                eventLi.appendChild(eventA);
                document.getElementById('sidebar').appendChild(eventLi);
        }
        console.log(id);
        document.getElementById("loadedGuildTChannelsDDL").innerHTML = "";
        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(id);
        var chatChanne = guildInQuestions.collection('ChatChannels');
        var divder = document.createElement('div');
        divder.className = "dropdown-divider";
        var channelTxt = document.createElement('a');
        channelTxt.className = "dropdown-item"
        channelTxt.innerHTML = "Text Channels";
        document.getElementById('loadedGuildTChannelsDDL').appendChild(channelTxt)
        document.getElementById('loadedGuildTChannelsDDL').appendChild(divder)
        chatChanne.get().then((snapshot) => {
                snapshot.forEach(doc => {
                        console.log(doc.data())
                        //create all the elements needed
                        var channelToAppend = document.createElement('a');
                        channelToAppend.className = "dropdown-item"
                        channelToAppend.id = doc.id;
                        channelToAppend.guildID = id
                        channelToAppend.innerHTML = doc.data().ChannelName;
                        channelToAppend.addEventListener('click', () => {
                                 loadChatPage(doc.id,id)
                        })
                        document.getElementById('loadedGuildTChannelsDDL').appendChild(channelToAppend)
                });

        })

}

function loadItemCalc() {
        $("#pageArea").load("../itemCalc/itemcalc.html");
        ipcRenderer.send("load-itemCalc");
}

function loadChatPage(chatId,guildID)
{
    console.log("At least the click is working" + guildID + " " + chatId)
    $("#pageArea").load("../guildChatpage/guildChatPage.html");
    ipcRenderer.send("load-guildChatpage",chatId,guildID);
}

function loadEventPage(gID)
{
    $("#pageArea").load("../guildCalendar/guildCalendar.html");
    ipcRenderer.send("load-guildEventPage",gID);
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