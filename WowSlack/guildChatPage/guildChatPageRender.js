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

if (!firebase.apps.length) {
  firebase.initializeApp(config); //pass the config to the init function
}
var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
})

ipcRenderer.on('load-guildChatpage', (event, guildID, channelID) => {
  var tid = setInterval(function () {
    if (document.readyState !== 'complete') return;
    clearInterval(tid);
    var guildref = db.collection("Guilds") //get the guild collection
    var guildInQuestions = guildref.doc(guildID); //find the users guild
    var chatChannels = guildInQuestions.collection('ChatChannels'); //get that guilds chatchannels
    var channelInQuestion = chatChannels.doc(channelID); //get the id of the channel we want
    var chatMessages = channelInQuestion.collection("Messages"); //get at the messages for the channel

    //set up a listner to the database, this will handle intial load in aswell as new messages
    chatMessages.orderBy('MessageTimeStamp').onSnapshot(snapshot => { //order them by timestamp so we get oldest to newest
      let changes = snapshot.docChanges(); //init the listner
      changes.forEach(change => { //when it gets a chance
        var messageData = change.doc.data() //get the message data
        AppendMessage(messageData.MessageSender, messageData.MessageText, messageData.MessageTimeStamp); //append it to the page
      })
      ipcRenderer.send('toggleLoaderOff'); //once the page is ready, toggle off loading
    })

    var postBtn = document.getElementById('postMessage');
    postBtn.addEventListener('click', () => {

      var messageBody = document.getElementById('message').value; //get the text of the message
      var sender = remote.getGlobal('userDetails')[0]; //get the user name, stored on login
      var today = new Date(); //get the date
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); //format date
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); //format time
      var timeStamp = date + ' ' + time; //create timestamp

      chatMessages.add({ //add the record,already have this declared
          MessageSender: sender,
          MessageText: messageBody,
          MessageTimeStamp: timeStamp
        }).then(function () {

        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    })
  }, 100);
})


function AppendMessage(sender, message, timeStamp) {

  if (sender == undefined || message  == undefined || timeStamp == undefined ) {
    return;
  }
  var userSpan = document.createElement('span');
  userSpan.className = "time-left";
  userSpan.innerHTML = sender + " writes:";

  var textP = document.createElement('p');
  textP.innerHTML = message;
  var spanTime = document.createElement('span');
  spanTime.className = "time-right";
  var date = timeStamp.split(" ");
  spanTime.innerHTML = "On the: " + date[0] + " At: " + date[1] ;

  
  var messageDiv = document.createElement('div');
  messageDiv.className = "container"
  messageDiv.appendChild(userSpan);
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