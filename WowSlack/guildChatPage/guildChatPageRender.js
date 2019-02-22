
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

ipcRenderer.on('load-guildChatpage',(event, data,data2) => {

    var guildref = db.collection("Guilds")
    var guildInQuestions = guildref.doc(data);
    var chatChannels = guildInQuestions.collection('ChatChannels');
    var channelInQuestion = chatChannels.doc(data2);
    var chatMessages = channelInQuestion.collection("Messages");

    var messageDoc = channelInQuestion.collection("Messages");
    messageDoc.get().then((snapshot) =>{
        snapshot.forEach(doc =>{
            console.log(doc.data())
            var sender = doc.MessageSender;
            var message = doc.MessageText;
            var timeStamp = doc.MessageTimeStamp;
            AppendMessage(sender,message,timeStamp)
        })
    })

})


function AppendMessage(sender,message,timeStamp)
{
    console.log(sender,message,timeStamp);
    //need code here to build a message template and attach it.
}

var guildref = db.collection("Guilds")
var guildInQuestions = guildref.doc("1");
var chatChannels = guildInQuestions.collection('ChatChannels');
var channelInQuestion = chatChannels.doc("1");
var chatMessages = channelInQuestion.collection("Messages");


var observer = chatMessages.onSnapshot(docSnapshot => {
  console.log(`Received doc snapshot: ${docSnapshot}`);
  //its picking up the event,might not need to do the read in on init
}, err => {
  console.log(`Encountered error: ${err}`);
});

