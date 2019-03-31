


var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;

var config = {
    apiKey: "AIzaSyBPwA6lwFFahoYIABYpeAvjmSA10gkj040", //api key for my app
    authDomain: "wow-slack.firebaseapp.com", //Points to the auth for this app
    databaseURL: "https://wow-slack.firebaseio.com", //Points to the database for this app
    projectId: "wow-slack", //Id for Firebase
    storageBucket: "wow-slack.appspot.com", //points to the file storage for this app
    messagingSenderId: "105436064015" //use for cloud messaging
};
if (!firebase.apps.length) {
    
}

var db = firebase.firestore();
db.settings({timestampsInSnapshots:true})

ipcRenderer.on("load-guildpage",(sender,args)=>{

    var tid = setInterval( function () {
        if ( document.readyState !== 'complete' ) return;
        clearInterval( tid );       
        var sideBar = document.getElementById("guildSideBar");

var eventspage = document.getElementById('eventslbl');
eventspage.addEventListener('click', () =>{
    loadEventPage(args);
});
    var guildref = db.collection("Guilds")
    var guildInQuestions = guildref.doc(args);
    var chatChanne = guildInQuestions.collection('ChatChannels');
   
    chatChanne.get().then((snapshot) =>{
        snapshot.forEach(doc =>{
            console.log(doc.data())
            //create all the elements needed
            var channelToAppend = document.createElement('li')
            channelToAppend.className = "nav-item active";
            var channelLink = document.createElement('a');
            channelLink.className = "nav-link";
            channelLink.id = doc.id;
            channelLink.guildID = args
            channelLink.addEventListener('click', () => {
                loadChatPage(doc.id,args);
            })
            var channelText = document.createElement('span');
            channelText.innerHTML = doc.data().ChannelName;
            //now tie all together
            channelLink.appendChild(channelText);
            channelToAppend.appendChild(channelLink);
            console.log(channelToAppend);
            //finally,add this to the sidebar
            sideBar.appendChild(channelToAppend);
            console.log(sideBar);
        })
   
    }, 100 );
     });


    function loadEventPage(gID)
    {
        $("#chatArea").load("../guildCalendar/guildCalendar.html");
        ipcRenderer.send("load-guildEventPage",gID);
    }
    function loadChatPage(chatId,guildID)
    {
        console.log("At least the click is working" + guildID + " " + chatId)
        $("#chatArea").load("../guildChatpage/guildChatPage.html");
        ipcRenderer.send("load-guildChatpage",chatId,guildID);
    }

    

    
   
})



