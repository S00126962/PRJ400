const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
var remote = electron.remote;

const blizzard = require('blizzard.js').initialize({
    key: 'cc03f6bfa99541d9b2644e450b96eadf',
    secert : 'e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI',
    access_token : remote.getGlobal('Token')
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


//get the page controls
var regionSelect = document.getElementById('regionSelect');
var serverSelect = document.getElementById('serverSelect');
var createCharForm = document.getElementById('createCharForm');
var charName = document.getElementById('inputCharName');
var pawnString = document.getElementById('pawnString');
regionSelect.addEventListener('change', () => { //whenever the use changes there region
    serverSelect.options.length = 0; //reset the length of the sever select
    if (regionSelect.options[regionSelect.selectedIndex].value == "choose") { //if they are on the default value, do nothing
        return;
    } else { //otherwise
        blizzard.wow.realms({ //ask the APi for the servers in that region,could hardcode this too, but API is more reliable
                origin: regionSelect.options[regionSelect.selectedIndex].value
            })
            .then(response => {
                for (let index = 0; index < response.data.realms.length; index++) { //loop though the servers returned
                    var rName = response.data.realms[index].name //create the options
                    var childToAppend = document.createElement('option');
                    childToAppend.innerHTML = rName;
                    childToAppend.value = rName;
                    serverSelect.appendChild(childToAppend);
                }
            });
    }
})

createCharForm.addEventListener('submit', (sender) => { //handle submiting the form
    sender.preventDefault(); //prevent the default form behaviour
    if (pawnString.value !== "") { //if there is a pawn string
        if(readPawnString(pawnString.value).PrimWeight == 0) { //if the pawn string is invaild
            alert("Invaild Pawn String"); //let the user know
            return;
        }
    }
    
    blizzard.wow.character(['profile'], { //call the apu for the charcter data, need some of it for later
        //this also is a way to check if that character exists, stops issues in item comparsion
            realm: serverSelect.options[serverSelect.selectedIndex].innerText,
            name: charName.value,
            origin: regionSelect.options[regionSelect.selectedIndex].value
        })
        .then(response => {
            db.collection('Characters').add({ //add the character to the database
                charName: response.data.name, //Used to call API later
                charPawnString: pawnString.value, //used for Item calc if provided
                charRealm: serverSelect.options[serverSelect.selectedIndex].innerText,//Used to call API later
                charRegion: regionSelect.options[regionSelect.selectedIndex].value,//Used to call API later
                ClassID: response.data.class,//used for Item calc if provided
                userID: firebase.auth().currentUser.uid //used to tie a character to a user
            }).then(function () {
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


//function to pull out the stat weights for a character
function readPawnString(Pawnstring) {
    //obj to store all the weights in,default everything to zero in the case a character doesnt use a certain stat
    //eg Dps wont care about leech,chances are they wont be in the pawn string
    var returnObj = {
        "PrimWeight": 0,
        "HasteWeight": 0,
        "CritWeight": 0,
        "ArmorWeight": 0,
        "LeechWeight": 0,
        "MasteryWeight": 0,
        "StaminaWeight": 0,
        "VersatilityWeight": 0,
        "WepDpsWeight": 0
    };

    try {
        while (Pawnstring.includes(":")) {
            Pawnstring = Pawnstring.substring(Pawnstring.indexOf(":") + 1);
        }

        //now,spilt up the array on commas
        var PawnArray = Pawnstring.split(",");
        //check for the equal
        var PrimWeight = PawnArray.filter(s => s.includes('Strength') || s.includes('Intellect') || s.includes('Agility')); //allows me to treat all these are the same value
        if (PrimWeight && PrimWeight.length) { //make sure that there is stuff in the array
            returnObj.PrimWeight = PrimWeight[0].split("=")[1]; //get the decimal value out
        }
        var CritRating = PawnArray.filter(s => s.includes('Crit'));
        if (CritRating && CritRating.length) {
            returnObj.CritWeight = CritRating[0].split("=")[1];
        }
        var HasteWeight = PawnArray.filter(s => s.includes('Haste'));
        if (HasteWeight && HasteWeight.length) {
            returnObj.HasteWeight = HasteWeight[0].split("=")[1];
        }
        var LeechWeight = PawnArray.filter(s => s.includes('Leech'));
        if (LeechWeight && LeechWeight.length) {
            returnObj.LeechWeight = LeechWeight[0].split("=")[1];
        }
        var MasteryWeight = PawnArray.filter(s => s.includes('Mast'));
        if (MasteryWeight && MasteryWeight.length) {
            returnObj.MasteryWeight = MasteryWeight[0].split("=")[1];
        }
        var StaminaWeight = PawnArray.filter(s => s.includes('Stam'));
        if (StaminaWeight && StaminaWeight.length) {
            returnObj.StaminaWeight = StaminaWeight[0].split("=")[1];
        }
        var ArmorWeight = PawnArray.filter(s => s.includes('Armor'));
        if (ArmorWeight && ArmorWeight.length) {
            returnObj.ArmorWeight = ArmorWeight[0].split("=")[1];
        }
        var VersatilityWeight = PawnArray.filter(s => s.includes('Vers'));
        if (VersatilityWeight && VersatilityWeight.length) {
            returnObj.VersatilityWeight = VersatilityWeight[0].split("=")[1];
        }
        var WepDpsWeight = PawnArray.filter(s => s.includes('Dps'));
        if (WepDpsWeight && WepDpsWeight.length) {
            returnObj.WepDpsWeight = WepDpsWeight[0].split("=")[1];
        }

    } catch (error) {
        console.log(error.message)
        return error;
    }
    return returnObj; //finally return the object
}


