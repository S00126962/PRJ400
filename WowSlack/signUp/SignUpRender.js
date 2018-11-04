// Initialize Firebase
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
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
const signUpForm = document.querySelector('#signUpForm')

signUpForm.addEventListener('submit', function (event) {

  event.preventDefault();
  var email = document.getElementById('inputEmail').value;
  var pw = document.getElementById('inputPassword').value;
  var userName = document.getElementById('inputUserName').value
  var region = document.getElementById('regionSelect');

  firebase.auth().createUserWithEmailAndPassword(email, pw).then(function () {
    firebase.auth().signInWithEmailAndPassword(email, pw).then(function () {
      db.collection('Users').add({
        userEmail: email,
        UserName: userName,
        userRegion: region.options[region.selectedIndex].value,
        UserID : firebase.auth().currentUser.uid
      }).then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
      ipcRenderer.send('asynchronous-message',firebase.auth().currentUser.uid)
      
  
    }).catch(function (error) {
  
      if (error != null) {
        alert(error.message)
        return;
      }
    })

  }).catch(function (error) {

    if (error != null) {
      console.log(error.message)
      return;
    }

  })

   
});