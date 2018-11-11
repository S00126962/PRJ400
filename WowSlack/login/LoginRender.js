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

var signInBtn = document.getElementById('loginBTN');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

$(document).ready(function(){
       if (firebase.auth().currentUser) {
        var userRef = firebase.auth().currentUser.uid
        ipcRenderer.send('asynchronous-message',userRef)
       }
})

signInBtn.addEventListener('click', function (event) {

  
  event.preventDefault();
  var email = document.getElementById('inputEmail').value;
  var pw = document.getElementById('inputPassword').value;

  firebase.auth().signInWithEmailAndPassword(email, pw).then(function () {
    var userRef = firebase.auth().currentUser.uid
    ipcRenderer.send('asynchronous-message',userRef)
    ipcRenderer.send('LoadProfilePage')

  }).catch(function (error) {

    if (error != null) {
      alert(error.message)
      return;
    }
  })

});



