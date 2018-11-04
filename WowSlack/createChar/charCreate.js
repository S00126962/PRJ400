

const blizzard = require('blizzard.js').initialize({
    apikey: 'qupb7zxzkdtzzzt87nnkyny29b289aw9'
});
var config = {
    apiKey: "AIzaSyBPwA6lwFFahoYIABYpeAvjmSA10gkj040",
    authDomain: "wow-slack.firebaseapp.com",
    databaseURL: "https://wow-slack.firebaseio.com",
    projectId: "wow-slack",
    storageBucket: "wow-slack.appspot.com",
    messagingSenderId: "105436064015"
};
firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({timestampsInSnapshots:true})

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;


var regionSelect = document.getElementById('regionSelect');
var serverSelect = document.getElementById('serverSelect');
var createCharForm = document.getElementById('createCharForm');
var charName = document.getElementById('inputCharName');
regionSelect.addEventListener('change', () => {
    serverSelect.options.length = 0;
    if (regionSelect.options[regionSelect.selectedIndex].value == "choose") {
        return;
    } else {
        blizzard.wow.realms({
                origin: regionSelect.options[regionSelect.selectedIndex].value
            })
            .then(response => {
                for (let index = 0; index < response.data.realms.length; index++) {
                    var rName = response.data.realms[index].name
                    var childToAppend = document.createElement('option');
                    childToAppend.innerHTML = rName;
                    childToAppend.value = rName;
                    serverSelect.appendChild(childToAppend);
                }
            });
    }
})

createCharForm.addEventListener('submit', (sender) => {
    sender.preventDefault();

    blizzard.wow.character(['profile'], {
            realm: serverSelect.options[serverSelect.selectedIndex].innerText,
            name: charName.value,
            origin: regionSelect.options[regionSelect.selectedIndex].value
        })
        .then(response => {
            db.collection('Characters').add({
                charName: response.data.name,
                charPawnString: "",
                charRealm: serverSelect.options[serverSelect.selectedIndex].innerText,
                charRegion: regionSelect.options[regionSelect.selectedIndex].value,
                ClassID: response.data.class,
                userID: firebase.auth().currentUser.uid
            }).then(function () {
                console.log("Document successfully written!");
                //send a message back to update the main page
                ipcRenderer.send('asynchronous-message',firebase.auth().currentUser.uid)
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
        }).catch(function (error) {

            if (error != null) {
                alert(error.message)
                return;
            }
        })
})


