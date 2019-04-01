var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var remote = electron.remote;
const request = require('request');
var config = {
  apiKey: "AIzaSyBPwA6lwFFahoYIABYpeAvjmSA10gkj040",
  authDomain: "wow-slack.firebaseapp.com",
  databaseURL: "https://wow-slack.firebaseio.com",
  projectId: "wow-slack",
  storageBucket: "wow-slack.appspot.com",
  messagingSenderId: "105436064015"
};

//when a user enters a channel,I want to keep these details around
var gID;
var chanID;
if (!firebase.apps.length) {
  firebase.initializeApp(config); //pass the config to the init function
}
var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
})

ipcRenderer.on('load-guildChatpage', (event, data, data2) => {

  gID = data;
  chanID = data2;
  var tid = setInterval(function () {
    if (document.readyState !== 'complete') return;
    clearInterval(tid);
    var guildref = db.collection("Guilds")
    var guildInQuestions = guildref.doc(data);
    var chatChannels = guildInQuestions.collection('ChatChannels');
    var channelInQuestion = chatChannels.doc(data2);
    var chatMessages = channelInQuestion.collection("Messages");

    chatMessages.orderBy('MessageTimeStamp').onSnapshot(snapshot => {
      let changes = snapshot.docChanges();

      changes.forEach(change => {
        var messageData = change.doc.data()
        AppendMessage(messageData.MessageSender, messageData.MessageText, messageData.MessageTimeStamp);
      })
    })
  }, 100);

})


function AppendMessage(sender, message, timeStamp) {
  console.log(sender, message, timeStamp);
  //need code here to build a message template and attach it.
  var textP = document.createElement('p');
  textP.innerHTML = sender + "\n" + message;
  var spanTime = document.createElement('span');
  spanTime.className = "time-right";
  spanTime.innerHTML = timeStamp;
  var messageDiv = document.createElement('div');
  messageDiv.className = "container"
  messageDiv.appendChild(textP);
  messageDiv.appendChild(spanTime);

  console.log(message)
  try {
    var urlRegex = /(https?:\/\/[^ ]*)/;
    var url = message.match(urlRegex)[1];
    request('https://api.linkpreview.net?key=5c742d7e3a29617fafdf83f40c1f65914304d453b6f88&q=' + url, {
      json: true
    }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body);
      var title = body.title;
      var descrip = body.description;
      var image = body.image;
      var url = body.url;

      var cardDiv = document.createElement('div');
      cardDiv.classList.add("card");
      var cardImg = document.createElement('img');

      cardImg.src = image;

      var cardDesc = document.createElement('p');
      cardDesc.innerHTML = descrip;
      var cardURl = document.createElement('a');
      cardURl.innerHTML = title;
      cardURl.onclick = function () {
        require('electron').shell.openExternal(url);
      }
      var containerDiv = document.createElement('div');
      containerDiv.class = "container";

      containerDiv.appendChild(cardURl);
      containerDiv.appendChild(cardDesc);
      cardDiv.appendChild(cardImg);
      cardDiv.appendChild(containerDiv);
      messageDiv.appendChild(cardDiv)

    });
    //  }

  } catch (error) {

  }

  document.getElementById("temp").appendChild(messageDiv); //finally, attach the message onto the div
}



var postBtn = document.getElementById('postMessage');


postBtn.addEventListener('click', () => {
  var messageBody = document.getElementById('message').value;
  var sender = remote.getGlobal('userDetails')[0];
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var timeStamp = date + ' ' + time;
  chatMessages.add({
      MessageSender: sender,
      MessageText: messageBody,
      MessageTimeStamp: timeStamp
    }).then(function () {

    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
})