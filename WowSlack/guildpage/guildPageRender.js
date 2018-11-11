


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
db.settings({timestampsInSnapshots:true})

ipcRenderer.on("load-guildpage",(sender,args)=>{
    alert("hi");
    //first get a ref to that guild
    var sideBar = document.getElementById("guildSideBar");
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
    })

    

    
   
})



