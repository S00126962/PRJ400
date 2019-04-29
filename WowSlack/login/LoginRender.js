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

//varibles for later
var signInBtn = document.getElementById('loginBTN');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

$(document).ready(function(){ //whenever the document is ready
       if (firebase.auth().currentUser) { //in case of some werid issue, check if they are already logged in
        var userRef = firebase.auth().currentUser.uid; //if so send the UID onto the main page to start everything off
        ipcRenderer.send('asynchronous-message',userRef)
       }
})

signInBtn.addEventListener('click', function (event) { //event listern to handle logging in
  event.preventDefault(); //stop the forms default
  //get the details
  var email = document.getElementById('inputEmail').value;
  var pw = document.getElementById('inputPassword').value;

  //sign the user in
  firebase.auth().signInWithEmailAndPassword(email, pw).then(function () {
    var userRef = firebase.auth().currentUser.uid

    //load the main page
    ipcRenderer.send('asynchronous-message',userRef)
    ipcRenderer.send('LoadProfilePage')
  }).catch(function (error) {
    if (error != null) {
      alert(error.message); //use an alert to let the user know whats wrong, firebases errors are well suited for this
      return;
    }
  })

});



