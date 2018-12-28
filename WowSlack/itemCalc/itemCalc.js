const blizzard = require('blizzard.js').initialize({
    apikey: 'qupb7zxzkdtzzzt87nnkyny29b289aw9'
});


const itemMap = require('./itemStatMapping.json'); //call in the mapping for data here
const InvMap = require('./invSlotMapping.json');
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

async function loadCharTemplate(id) {
    //itemListDll

    var charCollection = db.collection("Characters")
    var characterRef = charCollection.doc(id);
    
    characterRef.get().then((snapshot) =>{
       
            var charName =snapshot.data().charName;
            var region = snapshot.data().charRegion;
            var sever = snapshot.data().charRealm;      

             GenerateCharItemTemplate(charName,sever,region).then(result =>{
                 
                     AddItemToListview(result,charName) 
               })

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
        //return CharObj
        return ItemValue;
    }


}

function calcItemStatValue(itemStatWeight, ItemStatAmount) {
    //return the full value in order to get the most correct results whe    n comparing
    return (itemStatWeight * ItemStatAmount);
}


async function GenerateCharItemTemplate(Name, Sever, Region) {
  
    return new Promise((resolve,reject) =>{
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
                CharObj[itemSlotName].id = response.data.items[itemSlotName].id
                CharObj[itemSlotName].ItemName = response.data.items[itemSlotName].name
                CharObj[itemSlotName].bonusList = response.data.items[itemSlotName].bonusLists;
                CharObj[itemSlotName].itemEnchant = response.data.items[itemSlotName].tooltipParams.enchant
                if (itemSlotName == "shoulder" || itemSlotName == "head" ||itemSlotName == "chest") {
                    //we have an azerite item,need to add that on
                    CharObj[itemSlotName].azeriteArray= response.data.items[itemSlotName].azeriteEmpoweredItem.azeritePowers
                }
            });
            CharObj.TotalItemValue = CharitemValue
           // console.log(CharObj);
           // CompareItems(CharObj.wrist, 161397, [4798, 1477])

           resolve(CharObj);

        })
    }catch(e){console.log(e);throw e;}
})
}

function AddItemToListview(CharTemplate,charName)
{     
    //assume if this is called we want a new sub section on the list,eg another char
    //first build out the element to use
      var cardDiv = document.createElement("div");
      cardDiv.className = "card";

      var cardHeader = document.createElement("div");
      cardHeader.className = "card-header"
      var cardLink = document.createElement("a");
      cardLink.setAttribute("data-toggle","collapse");
      cardLink.href = "#" + charName;
      cardLink.setAttribute("aria-expanded","false");
      cardLink.setAttribute("aria-controls",charName);
      cardLink.text = charName;
      var menuDiv = document.createElement("div");
      menuDiv.className = "collapse"
      menuDiv.id = charName;

      var cardBody = document.createElement("div");
      cardBody.className = "card-body"

      for (let index = 0; index < itemSlots.length; index++) {
        //first things first,get the ID for the current item
        var itemID = CharTemplate[itemSlots[index]].id;
        var SlotName = itemSlots[index]; //get the Name of the item slot we are itterating on
        var itemName = CharTemplate[itemSlots[index]].ItemName
        //now build the link for the item
        var slotNameP = document.createElement("p");
        slotNameP.innerText = SlotName + ":";
        var bonus = CharTemplate[itemSlots[index]].bonusList;
        var itemLink = document.createElement("a");
        itemLink.href = "https://www.wowhead.com/item=" + itemID 
        var att = document.createAttribute("data-wowhead"); 
        att.value = "bonus=" +bonus[0] + ":"+bonus[1] + ":"+bonus[2] + "&";
        att.value += "ench=" +CharTemplate[itemSlots[index]].itemEnchant +"&"
        if (SlotName == "shoulder" || SlotName == "head" ||SlotName == "chest") {
            //we have an azerite item,need to add that on
            var azeriteArray = CharTemplate[itemSlots[index]].azeriteArray
            att.value += "azerite-powers=1" + ":" + azeriteArray[0].id + ":" + azeriteArray[1].id + ":" + azeriteArray[2].id
        }
       // itemLink.innerHTML +="data-wowhead=bonus=" + bonus[0] + ":"+bonus[1] + ":"+bonus[2]; 
       // itemLink["data-wowhead=bonus="] = bonus[0] + ":"+bonus[1] + ":"+bonus[2];
        itemLink.setAttributeNode(att);
        itemLink.className = "q4";
        itemLink.innerHTML = itemName;
        cardBody.append(slotNameP);
        cardBody.appendChild(itemLink) //add the link to the body
        itemLink.appendChild(document.createElement("br"));
      }
    //now finaly attach all togethe
    cardHeader.appendChild(cardLink);
    cardHeader.charDetails = CharTemplate;
    cardDiv.appendChild(cardHeader);
    menuDiv.appendChild(cardBody);
    cardDiv.appendChild(menuDiv);
    console.log(cardHeader.charDetails)

    //finally add that to the correct area to the page
    document.getElementById("accordion").appendChild(cardDiv);
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


var compareBtn = document.getElementById("CompareItems");
compareBtn.addEventListener("click", () =>{
    CompareItems();
});

function CompareItems() //function to compare two items and get a postive(upgrade)/negative(downgrade) intger 
{
    var PawnValues = readPawnString("( Pawn: v1: \"Keyboardwárr-Fury\": Class=Warrior, Spec=Fury, Strength=1.44, Ap=1.36, CritRating=1.19, HasteRating=1.66, MasteryRating=1.32, Versatility=1.19, Dps=5.39 ")

    var newitemID = document.getElementById("LoadedItem").LoadedItem.id;
    var bonusArray = document.getElementById("LoadedItem").LoadedItem.bonusArray;

    blizzard.wow.item({
            id: newitemID,
            bonuses: bonusArray,
            origin: 'eu'
        }) //orgin does not matter here,all items will be the same
        .then(response => {
            console.log("The item you are comparing is " + "\n" + response.data)
            var newitem = {};
            var invSlot = InvMap[response.data.inventoryType];
            var statsObj = GenerateItemValue(response.data.bonusStats);
            newitem[response.data.name] = statsObj;
            newitem.OverAllValue = GetOverallItemValue(statsObj, PawnValues)
            
            var CharTabs = document.getElementsByClassName("card-header");
            console.log(CharTabs)
            for (let index = 0; index < CharTabs.length; index++) {
                var charObj = CharTabs[index].charDetails;
                console.log(charObj);
                var currentItem = charObj[invSlot];
                console.log("Here you go greg" +currentItem);
                
            }
            console.log("New item val:" + " " + newitem.OverAllValue)
            console.log("Old item val:" + " " + currentItem.OverAllValue)
            console.log("Result of item calc" + " " + newitem.OverAllValue - currentItem.OverAllValue)
            var reuslt = newitem.OverAllValue - currentItem.OverAllValue
            console.log(result);
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

var wowHeadbtn =document.getElementById("findLinkBtn");

wowHeadbtn.addEventListener('click', () =>{

   ReadWowHeadLink();
})

function ReadWowHeadLink() //alternative to searching an item,let users paste in the link of the item from wowhead and get the info that way
{
    //item is a 355 wrist plate,140 str/int,47haste,73 vers
    var link = document.getElementById("wowheadLink").value;

    var itemID = link.substring(
        link.lastIndexOf("item=") + 5, //Links will always be the same,can grab the item id like this
        link.lastIndexOf("/"));


    var BounusIDs = link.substring(
        link.lastIndexOf("bonus=") + 6, //Links will always be the same,can grab the item id like this
        link.lastIndexOf("")).split(":");

    console.log(itemID)
    console.log(BounusIDs);


    blizzard.wow.item({
            id: itemID,
            origin: 'us',
            bonuses: BounusIDs
        })
        .then(response => {
            console.log(response.data);
            //once we are here we know that that is an item,so build a wowhead link
            var itemHolder = document.getElementById("LoadedItem");
            var itemLink = document.createElement("a");
         itemLink.href = "https://www.wowhead.com/item=" + itemID 
        var att = document.createAttribute("data-wowhead"); 
        att.value = "bonus=" +BounusIDs[0] + ":"+BounusIDs[1] + ":"+BounusIDs[2] + "&";
        // if (SlotName == "shoulder" || SlotName == "head" ||SlotName == "chest") {
        // //need to figure a way to let the user pick the azerite class   
        // }
       // itemLink.innerHTML +="data-wowhead=bonus=" + bonus[0] + ":"+bonus[1] + ":"+bonus[2]; 
       // itemLink["data-wowhead=bonus="] = bonus[0] + ":"+bonus[1] + ":"+bonus[2];
        itemLink.setAttributeNode(att);
        itemLink.className = "q4";
        itemLink.innerHTML = response.data.name;
        itemHolder.appendChild(itemLink);

        //now make an object to store on the item holder
        var itemObj = {}
      //  var PawnValues = readPawnString("( Pawn: v1: \"Keyboardwárr-Fury\": Class=Warrior, Spec=Fury, Strength=1.44, Ap=1.36, CritRating=1.19, HasteRating=1.66, MasteryRating=1.32, Versatility=1.19, Dps=5.39 ")
         itemObj.id = response.data.id;
         itemObj.bonusArray = BounusIDs;
         itemHolder.LoadedItem = itemObj;

         console.log(itemHolder.LoadedItem);
      
        });
}

//console.log(readPawnString( "Pawn: v1: \"Fury\": Class=Warrior, Spec=Fury, Strength=1.44, Ap=1.36, CritRating=1.19, HasteRating=1.66, MasteryRating=1.32, Versatility=1.19, Dps=5.39 "))
GenerateCharItemTemplate("KeyBoardwárr", "Silvermoon", "eu")
//ReadWowHeadLink()