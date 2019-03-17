const request = require('request');
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var remote = electron.remote;

var token = remote.getGlobal('Token');
console.log(token)

const blizzard = require('blizzard.js').initialize({
key: 'cc03f6bfa99541d9b2644e450b96eadf',
secert : 'e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI',
access_token : remote.getGlobal('Token')
});


const itemMap = require('./itemStatMapping.json'); //call in the mapping for data here
const InvMap = require('./invSlotMapping.json'); //call mapping for item slot mapping
//Should put these into a file,get an array of all the item slows we want to calculate
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


ipcRenderer.on("load-itemCalc", (sender, args) => {

    //will need to add more here If I need anything happenings on loading this page
})

var stageOneDiv = document.getElementById('stageOneDiv');
var stageOneBtn = document.getElementById('stageOneBtn');
var StageOnedll = document.getElementById('StageOnedll');
var itemListDll = document.getElementById('itemListDropDown');
var personalModeBtn = document.getElementById('personalMode');

personalModeBtn.addEventListener('click', () => {
    LoadPersonalMode();
})

var guildModeBtn = document.getElementById('guildMode');

guildModeBtn.addEventListener('click', () => {

    //need to be implented
});


//Personal mode is just the users characters
function LoadPersonalMode() {
    StageOnedll.innerHTML = "";
    stageOneBtn.innerText = "Select Char";
    stageOneDiv.style.visibility = "visible";

    //get a collection of the users characters from the db
    db.collection('Characters').where('userID', '==', defualt.auth().currentUser.uid).get().then((snapshot) => {
        snapshot.docs.forEach(doc => { //loop though and add them to the dropdown

            var charli = document.createElement('li');
            charli.innerHTML = doc.data().charName;
            charli.id = doc.id;
            charli.addEventListener('click', () => {
                loadCharTemplate(charli.id) //whenever someone clicks on a character,I want to load that character in for the calcuation
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

//load in the character selected into the calcuation system
async function loadCharTemplate(id) {

    var charCollection = db.collection("Characters")
    var characterRef = charCollection.doc(id); //get a ref to that document

    characterRef.get().then((snapshot) => { //get it and

        //get the details needed for the API to get that characters items
        var charName = snapshot.data().charName;
        var region = snapshot.data().charRegion;
        var sever = snapshot.data().charRealm;
        var classID = snapshot.data().ClassID; //need this for azerite traits
        var pawnString = snapshot.data().charPawnString; //need to check this for a null val later on
        //Call the promise to generate a character template,once its down,sent it to get added to the listview
        GenerateCharItemTemplate(charName, sever, region, pawnString, classID).then(result => {
            AddItemToListview(result) //send the resulting template and name off to be put on screen
        })

    })


}

//important function,used to generate a value for items on char/new items
function GetOverallItemValue(itemToCalc, StatWeights, SlotName , classID) {
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
        //now check to see if its an azerite item
        if (SlotName == "shoulder" || SlotName == "head" || SlotName == "chest") {
            console.log("Iterating over an azerite Item")
            //needs replaceing with acutal pointers
            //get the values from the azerite traits from the DB
            var classRef = db.collection("Class");
            var classInQuestion = classRef.doc(classID.toString());
            var specs = classInQuestion.collection('Specs');
            var statWeights = specs.doc("Fury");

            //then with the data
            statWeights.get().then(snapsnot => {
                var weights = snapsnot.data().AzeriteVals //get the trait/value pairs from the database
                ReadAzeriteVals(weights).then(obj => { //get them into a useble form,once we have that
                    for (let index = 0; index < itemToCalc.azeriteArray.length; index++) {

                        var traitID = itemToCalc.azeriteArray[index].id; //get the trait ID
                        var traitValue = obj[traitID]; //get the value from the azierte object

                        //bloodmallet only keep track of relevant traits,some may not be in there
                        if (traitValue != undefined) //so make sure we have a vaule before adding it onto the item
                        {
                            ItemValue += traitValue; //total it onto the new item
                        }

                    }
                });

            })
        }

        return ItemValue;
    }


}

function calcItemStatValue(itemStatWeight, ItemStatAmount) {
    //return the full value in order to get the most correct results when comparing
    return (itemStatWeight * ItemStatAmount);
}

//promised based function to create an object to use for working with Wow Characters
async function GenerateCharItemTemplate(Name, Sever, Region, Pawnstring, classID) {

    return new Promise((resolve, reject) => {
        try {
            //TODO,Add option to use this during item calc rather than provide this
            var CustomPawnValues; //declare this here
            var PawnValues = {}
            //now decide which one to use during the template generatetion
            if (Pawnstring || Pawnstring != "") //if it is there
            {
                CustomPawnValues = readPawnString(Pawnstring); //use the one pulled from the database
                PawnValues["CustomValues"] = CustomPawnValues
            }
            //otherwise go and find the default weights from the database
                var classRef = db.collection("Class")
                var classInQuestion = classRef.doc(classID.toString()); //get the doc related to the 
                var specs = classInQuestion.collection('Specs');

                 specs.get().then((snapshot) =>{
                    snapshot.forEach((doc) =>{
                        PawnValues[doc.id] = readPawnString(doc.data().PawnString)
                    })
               
                 
            var CharObj = {}; //create a blank object to build up
            CharObj.charName = Name; //set the name on the object
            CharObj.classID = classID; //use this for wowheadTooltips later
            CharObj.StatWeights = PawnValues; //save these for later
            CharObj.PawnObjs = {}; // define this for later
            var CharitemValue = 0; //value to add up and get an overall value
            blizzard.wow.character(['profile', 'items'], { //call the api to get the users character,more specficly their items
                    realm: Sever,
                    name: Name,
                    origin: Region
                })
                .then(response => {
                    for (var key in CharObj.StatWeights) {
                    var ValsObj = {};
                    itemSlots.forEach(function (itemSlotName) { //loop though each item slot on the character
                        try {    
                            var statsObj = GenerateItemValue(response.data.items[itemSlotName].stats); //get the current items stats
                            ValsObj[itemSlotName] = statsObj; //assign the name and the stats to the object

                            var itemValue = GetOverallItemValue(ValsObj[itemSlotName], CharObj.StatWeights[key], itemSlotName,CharObj.classID) //calcaute the value of that item
                            CharitemValue += itemValue;
                            ValsObj[itemSlotName].OverAllValue = itemValue; //assign this to the object,have the overall value ready for comparsion
                            ValsObj[itemSlotName].id = response.data.items[itemSlotName].id //get the Item ID
                            ValsObj[itemSlotName].ItemName = response.data.items[itemSlotName].name //get the name of the name
                            ValsObj[itemSlotName].bonusList = response.data.items[itemSlotName].bonusLists; //pull out the bonus lists on the item
                            ValsObj[itemSlotName].itemEnchant = response.data.items[itemSlotName].tooltipParams.enchant //get any enchants on the item
                            if (itemSlotName == "shoulder" || itemSlotName == "head" || itemSlotName == "chest") { //if this is a azerite item we are looking at
                                //we have an azerite item,need to add that on
                                ValsObj[itemSlotName].azeriteArray = response.data.items[itemSlotName].azeriteEmpoweredItem.azeritePowers //get the list of pwoers on that
                            }
                            CharObj.PawnObjs[key] = ValsObj; 
                        } catch (error) {
                            console.log(error);
                        }
                    })
                    
                    };
                    CharObj.TotalItemValue = CharitemValue //assign the overvall value for a character
                    resolve(CharObj); //return the object

                })
            })
        } catch (e) {
            console.log(e);
            throw e;
        }
    })
    
}

//Function to generate a list item of the character,needs a character template from above to work
function AddItemToListview(CharTemplate) {
    //assume if this is called we want a new sub section on the list,eg another char
    //first build out the element to use
    var cardDiv = document.createElement("div");
    cardDiv.className = "card";
    var cardHeader = document.createElement("div");
    cardHeader.className = "card-header"
    var cardLink = document.createElement("a");
    cardLink.setAttribute("data-toggle", "collapse");
    cardLink.href = "#" + CharTemplate.charName; //used for datatoggle
    cardLink.setAttribute("aria-expanded", "false");
    cardLink.setAttribute("aria-controls", CharTemplate.charName);
    cardLink.text = CharTemplate.charName;
    var menuDiv = document.createElement("div");
    menuDiv.className = "collapse"
    menuDiv.id = CharTemplate.charName; //used for datatoggle
    var cardBody = document.createElement("div");
    cardBody.className = "card-body"
    for (var key in CharTemplate.PawnObjs) {
    for (let index = 0; index < itemSlots.length; index++) {
        try {
            var itemID = CharTemplate.PawnObjs[key][itemSlots[index]].id;
            var SlotName = itemSlots[index]; //get the Name of the item slot we are itterating on
            var itemName = CharTemplate.PawnObjs[key][itemSlots[index]].ItemName

            var borderDiv = document.createElement("div");
            borderDiv.style = "border-style: groove;";
            //now build the link for the item
            var slotNameP = document.createElement("p");
            slotNameP.innerText = SlotName + ":";
            slotNameP.id = SlotName;
            var bonus = CharTemplate.PawnObjs[key][itemSlots[index]].bonusList;
            var itemLink = document.createElement("a");
            itemLink.href = "https://www.wowhead.com/item=" + itemID
            var att = document.createAttribute("data-wowhead");
            //assign the custom wowhead attributes to an item,this will allow us to show the item correclty to the user
            //Eg if its warforogred for +10 ilvls,it will show on the tooltip
            att.value = "bonus=" + bonus[0] + ":" + bonus[1] + ":" + bonus[2] + "&"; //attach any bonuses
            att.value += "ench=" + CharTemplate.PawnObjs[key][itemSlots[index]].itemEnchant + "&" //attach any enchats
            if (SlotName == "shoulder" || SlotName == "head" || SlotName == "chest") { //check to see if this is an azerite item
                //we have an azerite item,need to add that on
                var azeriteArray = CharTemplate.PawnObjs[key][itemSlots[index]].azeriteArray
                att.value += "azerite-powers=" + CharTemplate.classID + ":";
                for (let Azeriteindex = 0; Azeriteindex < azeriteArray.length; Azeriteindex++) {
                    att.value += azeriteArray[Azeriteindex].id + ":"
                }
                azeriteArray[0].id + ":" + azeriteArray[1].id + ":" + azeriteArray[2].id //need to replace one with the characters classID
            }
            // itemLink.innerHTML +="data-wowhead=bonus=" + bonus[0] + ":"+bonus[1] + ":"+bonus[2]; 
            // itemLink["data-wowhead=bonus="] = bonus[0] + ":"+bonus[1] + ":"+bonus[2];
            itemLink.setAttributeNode(att);
            itemLink.className = "q4";
            itemLink.innerHTML = itemName;
            borderDiv.append(slotNameP);
            borderDiv.append(itemLink);
            cardBody.append(borderDiv)
            //   cardBody.append(slotNameP);
            // cardBody.appendChild(itemLink) //add the link to the body
            itemLink.appendChild(document.createElement("br"));
        } catch (error) {

        }
        //nest everything again in another div,clopaseable
    }

    }
    //now attach all together
    cardHeader.appendChild(cardLink);
    cardHeader.charDetails = CharTemplate;
    cardDiv.appendChild(cardHeader);
    menuDiv.appendChild(cardBody);
    cardDiv.appendChild(menuDiv);
    //and finally add that to the correct area to the page
    document.getElementById("accordion").appendChild(cardDiv);
}

var clearCharBtn = document.getElementById("resetChars");
clearCharBtn.addEventListener("click", () => {
    ClearTemplateCards();
});
//function to clear any characters loaded in
function ClearTemplateCards() {
    //loop though the child nodes and remove the character templates
    var charNode = document.getElementById("accordion");
    while (charNode.firstChild) {
        charNode.removeChild(charNode.firstChild);
    }
}
//function to clear any item loaded in
function ClearLoadItem() {
    document.getElementById("LoadedItem").innerHTML = "";
}

//function to attach item's stat values to an object,used in the generatechartemplate function
function GenerateItemValue(item) {
    var returnObj = {};

    item.forEach(element => {

        var Name = itemMap[element.stat];
        var StatAmount = element.amount;
        returnObj[Name] = StatAmount

    });
    return returnObj;
}

//assign the compare function to the compare button
var compareBtn = document.getElementById("CompareItems");
compareBtn.addEventListener("click", () => {
    CompareItems();
});

function CompareItems() //function to compare two items and get a postive(upgrade)/negative(downgrade) intger 
{

    var CharTabs = document.getElementsByClassName("card-header");
    if (CharTabs.length < 1) {
        console.log("You need characters to compare the item too!")
        return;
    }
    var LoadedItem = document.getElementById("LoadedItem").LoadedItem;
    if (LoadedItem == undefined) {
        console.log("you need an item to compare!")
        return;
    }
    //get the new item's ID and bounus array(For contacting API)
    var newitemID = document.getElementById("LoadedItem").LoadedItem.id;
    var bonusArray = document.getElementById("LoadedItem").LoadedItem.bonusArray;


    blizzard.wow.item({
            id: newitemID,
            bonuses: bonusArray,
            origin: 'eu' //orgin does not matter here,all items will be the same,maybe the chinse version could be behind
        })
        .then(response => {
            var newitem = {};
            var invSlot = InvMap[response.data.inventoryType];
            var statsObj = GenerateItemValue(response.data.bonusStats);
            newitem[response.data.name] = statsObj;
            newitem.azerite = response.data.azeriteClassPowers


            for (let index = 0; index < CharTabs.length; index++) {
                var charObj = CharTabs[index].charDetails;

                var currentItem = charObj[invSlot];
                newitem.OverAllValue = GetOverallItemValue(newitem[response.data.name], charObj.StatWeights, currentItem);
                var CharItemSlotsDivs = document.getElementById(charObj.charName).firstElementChild.childNodes;
                var CharItemSlots = [];
                CharItemSlotsDivs.forEach(item => {
                    CharItemSlots.push(item.firstChild);
                })
                for (let i = 0; i < CharItemSlots.length; i++) {
                    //first lets see if we are dealing with an azerite item

                    if (CharItemSlots[i].id == invSlot) {
                        if (invSlot == "head" || invSlot == "shoulder" || invSlot == "Chest") {
                            //sum up azerite vals here for each character
                            //first need to figure out what azerite values we are looking at,based on classID
                            var newAzeriteIDs = newitem.azerite[charObj.classID]
                            //4 tiers of azerite exist,so pick the best out of each tier and use that for a value
                            var teir1 = newAzeriteIDs.filter(function (el) {
                                return el.tier === 1
                            });
                            var optiomalT1 = OptimalAzeriteTeir(teir1, charObj.classID)

                            var teir2 = newAzeriteIDs.filter(function (el) {
                                return el.tier === 2
                            });
                            var optiomalT2 = OptimalAzeriteTeir(teir2, charObj.classID)

                            var teir3 = newAzeriteIDs.filter(function (el) {
                                return el.tier === 3
                            });
                            var optiomalT3 = OptimalAzeriteTeir(teir3, charObj.classID);

                            var teir4 = newAzeriteIDs.filter(function (el) {
                                return el.tier === 4
                            });
                            var optiomalT4 = OptimalAzeriteTeir(teir4, charObj.classID);
                            console.log("Before")
                            console.log(newitem.OverAllValue);
                            //once all the values are returned,add each to the overall value of the new item
                            Promise.all([optiomalT1, optiomalT2, optiomalT3, optiomalT4]).then(function (values) {
                                for (let i = 0; i < values.length; i++) {
                                    newitem.OverAllValue += Number(values[i]);
                                    //great sucess
                                }

                            });
                        }
                        var result = (newitem.OverAllValue - currentItem.OverAllValue).toFixed(2); //round to two decimal places
                        if (result > 0) {
                            //this is an upgrade
                            CharItemSlots[i].innerText += "\n" + "Value Compared to comparison Item" + result + "\n" + "Upgrade!"
                            CharTabs[index].style.backgroundColor = "green"

                        } else if (result < 0) {
                            //then we have a downgrade
                            CharItemSlots[i].innerText += "\n" + "Value Compared to comparison Item" + result + "\n" + "DownGrade!"
                            CharTabs[index].style.backgroundColor = "red"

                        } else if (result == 0) {
                            //very rare,but we have a tie,up to the user at this point
                            CharItemSlots[i].innerText = result += "\n" + "Value Compared to comparison Item" + result + "\n" + "Tie!"

                        }
                    }

                }


            }
        });
}


function OptimalAzeriteTeir(azeriteTeir, classID) { //used to find the best azerite value for a teir and return the dps value

    return new Promise((resolve, reject) => {
        var classRef = db.collection("Class"); //very bad greg,change the DB!!!
        var classInQuestion = classRef.doc("Warrior");
        var specs = classInQuestion.collection('Specs');
        var azeriteWeights = specs.doc("Fury");
        var returnAzeriteVal = 0;
        //then with the data
        azeriteWeights.get().then(snapsnot => {
            var weights = snapsnot.data().AzeriteVals //get the trait/value pairs from the database
            ReadAzeriteVals(weights).then(obj => { //get them into a useble form,once we have that
                for (let index = 0; index < azeriteTeir.length; index++) {

                    var traitID = azeriteTeir[index].id; //get the trait ID
                    var traitValue = obj[traitID]; //get the value from the azierte object

                    //bloodmallet only keep track of relevant traits,some may not be in there
                    if (traitValue != undefined) //so make sure we have a vaule before adding it onto the item
                    {
                        //if the current trait has a higher value,set the value to that
                        if (traitValue > returnAzeriteVal) {
                            returnAzeriteVal = traitValue;
                        }
                    }

                }

                resolve(returnAzeriteVal)

            });

        });

    })

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
    Pawnstring = Pawnstring.replace(')','');
    try {
        while (Pawnstring.includes(":")) {
            Pawnstring = Pawnstring.substring(Pawnstring.indexOf(":") + 1);
        }

        //now,spilt up the array on commas
        var PawnArray = Pawnstring.split(",");
        //check for the equal
        var PrimWeight = PawnArray.filter(s => s.includes('Strength') || s.includes('Intellect') || s.includes('Agility')); //allows me to treat all these are the same value
        if (PrimWeight && PrimWeight.length) { //make sure that there is stuff in the array
            returnObj.PrimWeight = Number(PrimWeight[0].split("=")[1]); //get the decimal value out
        }
        var CritRating = PawnArray.filter(s => s.includes('Crit'));
        if (CritRating && CritRating.length) {
            returnObj.CritWeight = Number(CritRating[0].split("=")[1]);
        }
        var HasteWeight = PawnArray.filter(s => s.includes('Haste'));
        if (HasteWeight && HasteWeight.length) {
            returnObj.HasteWeight = Number(HasteWeight[0].split("=")[1]);
        }
        var LeechWeight = PawnArray.filter(s => s.includes('Leech'));
        if (LeechWeight && LeechWeight.length) {
            returnObj.LeechWeight = Number(LeechWeight[0].split("=")[1]);
        }
        var MasteryWeight = PawnArray.filter(s => s.includes('Mast'));
        if (MasteryWeight && MasteryWeight.length) {
            returnObj.MasteryWeight = Number(MasteryWeight[0].split("=")[1]);
        }
        var StaminaWeight = PawnArray.filter(s => s.includes('Stam'));
        if (StaminaWeight && StaminaWeight.length) {
            returnObj.StaminaWeight = Number(StaminaWeight[0].split("=")[1]);
        }
        var ArmorWeight = PawnArray.filter(s => s.includes('Armor'));
        if (ArmorWeight && ArmorWeight.length) {
            returnObj.ArmorWeight = Number(ArmorWeight[0].split("=")[1]);
        }
        var VersatilityWeight = PawnArray.filter(s => s.includes('Vers'));
        if (VersatilityWeight && VersatilityWeight.length) {
            returnObj.VersatilityWeight = Number(VersatilityWeight[0].split("=")[1]);
        }
        var WepDpsWeight = PawnArray.filter(s => s.includes('Dps'));
        if (WepDpsWeight && WepDpsWeight.length) {
            returnObj.WepDpsWeight = Number(WepDpsWeight[0].split("=")[1]);
        }

    } catch (error) {
        console.log(error.message)
    }
    return returnObj; //finally return the object
}

//function to read in azerite weights(from bloodmallet.com) and get a useable array
async function ReadAzeriteVals(AzeriteString) {
    return new Promise((resolve, reject) => {
        var string = AzeriteString.split(' ').join('')
        var string2 = string.replace("\"", "");
        var vals = string.split(",");
        var AzeriteDict = {};

        for (let index = 0; index < vals.length; index++) {
            var holder = vals[index].split("=");
            AzeriteDict[holder[0]] = holder[1];

        }
        resolve(AzeriteDict);
    })
}

var wowHeadbtn = document.getElementById("findLinkBtn");
wowHeadbtn.addEventListener('click', () => {
    ReadWowHeadLink();
})

function ReadWowHeadLink() //alternative to searching an item,let users paste in the link of the item from wowhead and get the info that way
{

    ClearLoadItem(); //make sure to clear out the old item first regardless
    ///check to make sure something is their before we try and find it,also check to see if item is there(should be in a wowhead link)
    var link = document.getElementById("wowheadLink").value;
    if (link == "" || link == null || !link.includes("item=")) {
        console.log("Error,Please Link an item");
        return;
    }
    //try and get the itemID out of the link
    var itemID = link.substring(
        link.lastIndexOf("item=") + 5, //Links will always be the same,can grab the item id like this
        link.lastIndexOf("/"));

    //try and get any bonus IDs from the link
    var BounusIDs = link.substring(
        link.lastIndexOf("bonus=") + 6, //Links will always be the same,can grab the item id like this
        link.lastIndexOf("")).split(":");

    //now call the API with the data we pulled
    blizzard.wow.item({
            id: itemID,
            origin: 'us',
            bonuses: BounusIDs
        })
        .then(response => {
            //once we are here we know that that is an item,so build a wowhead link
            var itemHolder = document.getElementById("LoadedItem");
            var itemLink = document.createElement("a");
            itemLink.href = "https://www.wowhead.com/item=" + itemID
            var att = document.createAttribute("data-wowhead"); //create and attach bonus IDs to the attributes of the tooltip
            att.value = "bonus=" + BounusIDs[0] + ":" + BounusIDs[1] + ":" + BounusIDs[2] + "&";
            itemLink.setAttributeNode(att);
            itemLink.className = "q4";
            itemLink.innerHTML = response.data.name;
            itemHolder.appendChild(itemLink);

            //now make an object to store on the item holder
            var itemObj = {}
            itemObj.id = response.data.id;
            itemObj.bonusArray = BounusIDs;
            itemHolder.LoadedItem = itemObj;

        }).catch(error => {
            console.log(error)
        }); //use catch on promise to catch any incorrect user input

}