const blizzard = require('blizzard.js').initialize({
    apikey: 'qupb7zxzkdtzzzt87nnkyny29b289aw9'
});


const itemMap = require('./itemStatMapping.json'); //call in the mapping for data here
const itemSlots = ["head", "neck", "shoulder", "back", "chest", "wrist", "hands", "waist", "legs", "feet", "finger1", "finger2", "trinket1", "trinket2", "mainHand", "offHand"];
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
var defualt = firebase.app();
db.settings({
    timestampsInSnapshots: true
})
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;

ipcRenderer.on("load-itemCalc", (sender, args) => {

    console.log("I like memes");
})

var stageOneDiv = document.getElementById('stageOneDiv');
var stageOneBtn = document.getElementById('stageOneBtn');
var StageOnedll = document.getElementById('StageOnedll');
var itemListDll = document.getElementById('itemListDropDown');
var personalModeBtn = document.getElementById('personalMode');
personalModeBtn.addEventListener('click', () => {

    console.log("personal modeClicked");


    LoadPersonalMode();

})

var guildModeBtn = document.getElementById('guildMode');

guildModeBtn.addEventListener('click', () => {

    console.log("guild modeClicked");
})


function LoadPersonalMode() {
    stageOneBtn.innerText = "Select Char";
    stageOneDiv.style.visibility = "visible";

    db.collection('Characters').where('userID', '==', defualt.auth().currentUser.uid).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {

            var charli = document.createElement('li');
            charli.innerHTML = doc.data().charName;
            charli.id = doc.id;
            charli.addEventListener('click', () => {
                loadCharTemplate(charli.id)
            })
            StageOnedll.append(charli);

        })
    }).catch(function (error) {

        if (error != null) {
            alert(error.message)
            return;
        }
    })
}

function loadCharTemplate(id) {
    //itemListDll

    var charCollection = db.collection("Characters")
    var characterRef = charCollection.doc(id);
    
    characterRef.get().then((snapshot) =>{
       
            var charName =snapshot.data().charName;
            var region = snapshot.data().charRegion;
            var sever = snapshot.data().charRealm;      

            var promise = GenerateCharItemTemplate(charName,sever,region);

            promise.then((results) =>{console.log(results)})
        })


}

function GetOverallItemValue(itemToCalc, StatWeights) {
    var ItemValue = 0; //var to hold the overallValue for the item
    var PrimaryArrray = [itemMap["3"], itemMap["4"], itemMap["5"], itemMap["71"], itemMap["72"], itemMap["73"], itemMap["74"]]; //array containing all the "Primary" keys
    for (var key in itemToCalc) {
        if (itemToCalc.hasOwnProperty(key)) {
            if (PrimaryArrray.includes(key)) { //check if we are dealiong with a primary stat
                ItemValue += calcItemStatValue(StatWeights.PrimWeight, itemToCalc[key]);
            } else {
                for (var WeightKey in StatWeights) {
                    if (WeightKey.includes(key)) {

                        ItemValue += calcItemStatValue(StatWeights[WeightKey], itemToCalc[key])
                    }
                }
            }
        }
        return CharObj
      //  return ItemValue;
    }


}

function calcItemStatValue(itemStatWeight, ItemStatAmount) {
    //return the full value in order to get the most correct results whe    n comparing
    return (itemStatWeight * ItemStatAmount);
}

function GenerateCharItemTemplate(Name, Sever, Region) {
    
    try{
    var PawnValues = readPawnString("( Pawn: v1: \"Keyboardwárr-Fury\": Class=Warrior, Spec=Fury, Strength=1.44, Ap=1.36, CritRating=1.19, HasteRating=1.66, MasteryRating=1.32, Versatility=1.19, Dps=5.39 ")
    var CharObj = {}; //create a blank object to build up
    var CharitemValue = 0; //value to add up and get an overall value
    blizzard.wow.character(['profile', 'items'], { //call the api to get the users character
            realm: Sever,
            name: Name,
            origin: Region
        })
        .then(response => {

            itemSlots.forEach(function (itemSlotName) { //loop though each item slot on the character

                var statsObj = GenerateItemValue(response.data.items[itemSlotName].stats); //get the current items stats
                CharObj[itemSlotName] = statsObj; //assign the name and the stats to the object
                var itemValue = GetOverallItemValue(CharObj[itemSlotName], PawnValues) //calcaute the value of that item
                CharitemValue += itemValue;
                CharObj[itemSlotName].OverAllValue = itemValue; //assign this to the object
            });
            CharObj.TotalItemValue = CharitemValue
           // console.log(CharObj);
           // CompareItems(CharObj.wrist, 161397, [4798, 1477])

           return CharObj.promise();

        })
    }catch(e){console.log(e);throw e;}

}

function GenerateItemValue(item) {
    var returnObj = {};

    item.forEach(element => {

        var Name = itemMap[element.stat];
        var StatAmount = element.amount;
        returnObj[Name] = StatAmount

    });
    return returnObj;
}

function CompareItems(currentItem, newitemID, bonusArray) //function to compare two items and get a postive(upgrade)/negative(downgrade) intger 
{
    var PawnValues = readPawnString("( Pawn: v1: \"Keyboardwárr-Fury\": Class=Warrior, Spec=Fury, Strength=1.44, Ap=1.36, CritRating=1.19, HasteRating=1.66, MasteryRating=1.32, Versatility=1.19, Dps=5.39 ")

    blizzard.wow.item({
            id: newitemID,
            bonuses: bonusArray,
            origin: 'eu'
        }) //orgin does not matter here,all items will be the same
        .then(response => {
            console.log("The item you are comparing is " + "\n" + response.data)
            var newitem = {};

            var statsObj = GenerateItemValue(response.data.bonusStats);
            newitem[response.data.name] = statsObj;
            newitem.OverAllValue = GetOverallItemValue(statsObj, PawnValues)
            console.log("New item val:" + " " + newitem.OverAllValue)
            console.log("Old item val:" + " " + currentItem.OverAllValue)
            console.log("Result of item calc" + " " + newitem.OverAllValue - currentItem.OverAllValue)
        });
}

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
    }
    return returnObj; //finally return the object
}

function ReadWowHeadLink() //alternative to searching an item,let users paste in the link of the item from wowhead and get the info that way
{
    //item is a 355 wrist plate,140 str/int,47haste,73 vers
    var testLink = "https://www.wowhead.com/item=160723/imperious-vambraces&bonus=1522:4798"

    var itemID = testLink.substring(
        testLink.lastIndexOf("item=") + 5, //Links will always be the same,can grab the item id like this
        testLink.lastIndexOf("/"));


    var BounusIDs = testLink.substring(
        testLink.lastIndexOf("bonus=") + 6, //Links will always be the same,can grab the item id like this
        testLink.lastIndexOf("")).split(":");

    console.log(itemID)
    console.log(BounusIDs);


    blizzard.wow.item({
            id: itemID,
            origin: 'us',
            bonuses: BounusIDs
        })
        .then(response => {
            console.log(response.data);
        });
}

//console.log(readPawnString( "Pawn: v1: \"Fury\": Class=Warrior, Spec=Fury, Strength=1.44, Ap=1.36, CritRating=1.19, HasteRating=1.66, MasteryRating=1.32, Versatility=1.19, Dps=5.39 "))
GenerateCharItemTemplate("KeyBoardwárr", "Silvermoon", "eu")
//ReadWowHeadLink()