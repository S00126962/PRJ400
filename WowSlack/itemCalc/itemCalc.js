window.$ = window.Jquery = require("jquery")
window.$ = window.Jquery = require("jquery")
const request = require('request');
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;

var remote = electron.remote;
const blizzard = require('blizzard.js').initialize({
    key: 'cc03f6bfa99541d9b2644e450b96eadf',
    secert: 'e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI',
    access_token: remote.getGlobal('Token')
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

if (!firebase.apps.length) {
    firebase.initializeApp(config);
    console.log("Hi i inited firebase");
}


ipcRenderer.on("load-itemCalc", (sender, args) => {
    var tid = setInterval(function () { //ensure that doc is ready before firing anything, this fixs issues with page loading
        if (document.readyState !== 'complete') return;
        clearInterval(tid);
        $('.js-example-basic-single').select2();
        LoadPersonalMode();
        LoadGuildMode();
        var wowHeadbtn = document.getElementById("findLinkBtn");
        wowHeadbtn.addEventListener('click', () => {
            LoadItemViaWowHead();
        });
        var clearCharBtn = document.getElementById("resetTable");
        clearCharBtn.addEventListener("click", () => {
            clearCharTables();
        });
        $('#charSelect').on('select2:select', function (e) {
            var id = $('#charSelect').val();
            loadCharTemplate(id);
        });
    }, 100);
})


//Personal mode is just the users characters
function LoadPersonalMode() {

    var playerCharGroup = document.createElement("optgroup");
    playerCharGroup.label = "Your Characters";
    //get a collection of the users characters from the db
    db.collection('Characters').where('userID', '==', remote.getGlobal("uid")).get().then((snapshot) => {
        snapshot.docs.forEach(doc => { //loop though and add them to the dropdown

            var newOption = new Option(doc.data().charName, doc.id, false, false);
            playerCharGroup.appendChild(newOption);
        })
    }).catch(function (error) {

        if (error != null) {
            alert(error.message)
            return;
        }
    })
    $('#charSelect').append(playerCharGroup).trigger('change');
}

function LoadGuildMode() {

    var guildMemebersOBJ = {}
    //I need to get a collection of Uids to get their characters
    db.collection('Guilds').where('GuildMemebers', 'array-contains', remote.getGlobal("uid")).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            var memebers = [];
            for (let index = 0; index < doc.data().GuildMemebers.length; index++) {
                if (memebers.indexOf(doc.data().GuildMemebers[index]) === -1) { //only get me unquie ids
                    memebers.push(doc.data().GuildMemebers[index]);
                }
            }
            guildMemebersOBJ[doc.data().GuildName] = memebers;
        });
        //now that I have the IDs, I need a list of characters

        for (key in guildMemebersOBJ) {
            var currentGuild = guildMemebersOBJ[key];
            for (let index = 0; index < currentGuild.length; index++) {
                var guildCharGroup = document.createElement("optgroup");
                guildCharGroup.label = "Characters from " + " " + key;
                db.collection('Characters').where('userID', '==', currentGuild[index]).get().then((snapshot) => {
                    snapshot.docs.forEach(doc => { //loop though and add them to the dropdown
                        var newOption = new Option(doc.data().charName, doc.id, false, false);
                        guildCharGroup.appendChild(newOption);
                    })
                    $('#charSelect').append(guildCharGroup).trigger('change');
                }).catch(function (error) {

                    if (error != null) {
                        alert(error.message)
                        return;
                    }
                })

            }
        }
    }).catch(function (error) {

        if (error != null) {
            console.log(error.message)
            return;
        }
    })
}

document.getElementById('refreshChars').addEventListener('click', () => {
    LoadPersonalMode();
    LoadGuildMode();

})

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
            console.log(result);
            AddCharToTable(result);
            //  AddItemToListview(result) //send the resulting template and name off to be put on screen
        })

    })


}

//important function,used to generate a value for items on char/new items
function GetOverallItemValue(itemToCalc, StatWeights, AzeriteWeights, SlotName, classID) {
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

            var weights = AzeriteWeights;
            for (let index = 0; index < itemToCalc.azeriteArray.length; index++) {

                var traitID = itemToCalc.azeriteArray[index].id; //get the trait ID
                var traitValue = weights[traitID]; //get the value from the azierte object

                //bloodmallet only keep track of relevant traits,some may not be in there
                if (traitValue != undefined) //so make sure we have a vaule before adding it onto the item
                {
                    ItemValue += traitValue; //total it onto the new item
                }

            }
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
            var AzeriteValues = {};
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

            specs.get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (AzeriteValues["CustomValues"] == undefined) {
                        ReadAzeriteVals(doc.data().AzeriteVals).then(azeriteRes => {
                            AzeriteValues["CustomValues"] = azeriteRes
                        })
                    }
                    PawnValues[doc.id] = readPawnString(doc.data().PawnString)
                    ReadAzeriteVals(doc.data().AzeriteVals).then(azeriteRes => {
                        AzeriteValues[doc.id] = azeriteRes
                    })
                })




                var CharObj = {}; //create a blank object to build up
                CharObj.charName = Name; //set the name on the object
                CharObj.classID = classID; //use this for wowheadTooltips later
                CharObj.StatWeights = PawnValues; //save these for later
                CharObj.PawnObjs = {}; // define this for later
                CharObj.AzeriteValues = AzeriteValues; // define this for later
                var CharitemValue = 0; //value to add up and get an overall value
                blizzard.wow.character(['profile', 'items'], { //call the api to get the users character,more specficly their items
                        realm: Sever,
                        name: Name,
                        origin: Region
                    })
                    .then(response => {
                        console.log(response.data)
                        for (var key in CharObj.StatWeights) {
                            var ValsObj = {};
                            itemSlots.forEach(function (itemSlotName) { //loop though each item slot on the character
                                try {
                                    var statsObj = GenerateItemValue(response.data.items[itemSlotName].stats); //get the current items stats
                                    ValsObj[itemSlotName] = statsObj; //assign the name and the stats to the object
                                    if (itemSlotName == "head" || itemSlotName == "shoulder" || itemSlotName == "chest") {
                                        ValsObj[itemSlotName].azeriteArray = response.data.items[itemSlotName].azeriteEmpoweredItem.azeritePowers
                                    }
                                    var itemValue = GetOverallItemValue(ValsObj[itemSlotName], CharObj.StatWeights[key], CharObj.AzeriteValues[key], itemSlotName, CharObj.classID) //calcaute the value of that item
                                    CharitemValue += itemValue;
                                    ValsObj[itemSlotName].OverAllValue = itemValue; //assign this to the object,have the overall value ready for comparsion
                                    ValsObj[itemSlotName].id = response.data.items[itemSlotName].id //get the Item ID
                                    ValsObj[itemSlotName].ItemName = response.data.items[itemSlotName].name //get the name of the name
                                    ValsObj[itemSlotName].bonusList = response.data.items[itemSlotName].bonusLists; //pull out the bonus lists on the item
                                    ValsObj[itemSlotName].itemEnchant = response.data.items[itemSlotName].tooltipParams.enchant //get any enchants on the item
                                    ValsObj[itemSlotName].itemImg = "https://wow.zamimg.com/images/wow/icons/medium/" + response.data.items[itemSlotName].icon + ".jpg"
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

function AddCharToTable(CharTemplate) {
    //first make the nav for the character
    var charNav = document.createElement('a');
    charNav.id = "nav" + "-" + CharTemplate.charName + "-" + "tab";
    charNav.setAttribute("data-toggle", "tab");
    charNav.className = "nav-item nav-link";
    charNav.charObj = CharTemplate; //save this data on the page to use again
    charNav.name = "charObj"
    charNav.href = "#nav-" + CharTemplate.charName
    charNav.setAttribute("aria-controls", "nav-" + CharTemplate.charName);
    charNav.innerHTML = CharTemplate.charName
    if (document.getElementById('nav-tab').hasChildNodes()) {
        charNav.setAttribute("aria-selected", "true");
    } else {
        charNav.setAttribute("aria-selected", "false");
    }

    var charTblDiv = document.createElement('div');
    charTblDiv.className = "tab-pane fade";
    charTblDiv.id = "nav-" + CharTemplate.charName;
    charTblDiv.name = "charTblDiv"
    charTblDiv.setAttribute("role", "tabpanel");
    charTblDiv.setAttribute("aria-labelledby", charNav.id);

    var charTbl = document.createElement('table');
    charTbl.className = "table";

    var charTblHead = document.createElement('thead');
    var charTableRow = document.createElement('tr');
    var itemHead = document.createElement('th');
    itemHead.innerHTML = "Items";
    charTableRow.appendChild(itemHead);
    var charTblBody = document.createElement('tbody');


    for (var key in CharTemplate.PawnObjs) {
        // skip loop if the property is from prototype
        if (!CharTemplate.PawnObjs.hasOwnProperty(key)) continue;
        var pawnHead = document.createElement('th');
        pawnHead.innerHTML = key;
        charTableRow.appendChild(pawnHead);
    }
    var da = Object.keys(CharTemplate.PawnObjs)[0];
    //now lets handle the rows,go for each item,append a row for it
    for (let index = 0; index < itemSlots.length; index++) {
        try {
            var itemRowTr = document.createElement('tr');

            var items = CharTemplate.PawnObjs[da];
            var itemID = items[itemSlots[index]].id;
            var itemLink = document.createElement("a");
            itemLink.href = "https://www.wowhead.com/item=" + itemID;
            itemLink.innerHTML = items[itemSlots[index]].ItemName;
            itemLink.id = CharTemplate.charName + ":" + itemSlots[index];
            var att = document.createAttribute("data-wowhead");
            var itemImg = document.createElement('img');
            itemImg.src = items[itemSlots[index]].itemImg
            itemImg.style = "border-style: groove;";
            var bonus = items[itemSlots[index]].bonusList;
            att.value = "bonus=" + bonus[0] + ":" + bonus[1] + ":" + bonus[2] + "&"; //attach any bonuses
            att.value += "ench=" + items[itemSlots[index]].itemEnchant + "&" //attach any enchats
            if (itemSlots[index] == "shoulder" || itemSlots[index] == "head" || itemSlots[index] == "chest") { //check to see if this is an azerite item
                //we have an azerite item,need to add that on
                var azeriteArray = items[itemSlots[index]].azeriteArray
                att.value += "azerite-powers=" + CharTemplate.classID + ":";
                for (let Azeriteindex = 0; Azeriteindex < azeriteArray.length; Azeriteindex++) {
                    att.value += azeriteArray[Azeriteindex].id + ":"
                }
                azeriteArray[0].id + ":" + azeriteArray[1].id + ":" + azeriteArray[2].id //need to replace one with the characters classID
            }
            itemLink.setAttributeNode(att);
            var itemTd = document.createElement('td');
            itemTd.appendChild(itemImg);
            itemTd.appendChild(itemLink);



            itemRowTr.appendChild(itemTd)

            for (var key in CharTemplate.PawnObjs) {
                //now add the specifc values for the item, for each possible PawnString
                var ValTd = document.createElement('td');
                var currentItem = CharTemplate.PawnObjs[key];
                var itemVal = currentItem[itemSlots[index]].OverAllValue;
                ValTd.innerHTML = parseFloat(itemVal.toFixed(2));
                ValTd.id = CharTemplate.charName + ":" + itemSlots[index] + ":" + key;
                itemRowTr.appendChild(ValTd);
                
            }
            charTblBody.appendChild(itemRowTr);
        } catch (error) {

        }
    }
    charTbl.appendChild(charTblBody);
    charTblHead.appendChild(charTableRow);
    charTblDiv.appendChild(charTbl);
    charTbl.appendChild(charTblHead);
    document.getElementById('nav-tab').appendChild(charNav); //link ready to go, need to build char table frist
    document.getElementById('nav-tabContent').append(charTblDiv); //now that the div is there, we need a table for our data


}


//function to clear any characters loaded in
function clearCharTables() {
    var charTables = document.getElementsByName('charObj');
    for (let index = 0; index < charTables.length; index++) {
        charTables[index].parentNode.removeChild(charTables[index])
    }
    document.getElementById("nav-tabContent").innerHTML = null;
}

function clearitemFromTable() {
    
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

async function CompareItems() //function to compare two items and get a postive(upgrade)/negative(downgrade) intger 
{

    var itemCount = document.getElementsByName('compareItem').length;
    var itemArray = [];
    for (var x = 0; x < itemCount; x++) //first get all the items
    {
        itemArray.push(document.getElementsByName("compareItem")[x].LoadedItem);
    }

    //now get all the characters nav-item nav-link
    var charCount = document.getElementsByName('charObj').length;
    var charArray = [];
    for (var x = 0; x < charCount; x++) {
        charArray.push(document.getElementsByName("charObj")[x].charObj);
    }

    //loop though every character and run the math
    for (let charIndex = 0; charIndex < charArray.length; charIndex++) { //for every char
        for (let itemIndex = 0; itemIndex < itemArray.length; itemIndex++) {
            var currentChar = charArray[charIndex]; //get the current character being iterated on
            var newtItem = itemArray[itemIndex];
            var newitemID = newtItem.id;
            var newItemBonusArray = newtItem.bonusArray;
            await blizzard.wow.item({
                    id: newitemID,
                    bonuses: newItemBonusArray,
                    origin: 'eu' //orgin does not matter here,all items will be the same,maybe the chinse version could be behind
                })
                .then(response => {
                    //build the basic details for the item
                    var newitem = {};
                    var invSlot = InvMap[response.data.inventoryType];
                    var statsObj = GenerateItemValue(response.data.bonusStats);
                    newitem[response.data.name] = statsObj;
                    newitem.azerite = response.data.azeriteClassPowers;
                    for (var key in currentChar.PawnObjs) {
                        //back here mate
                        if (!currentChar.PawnObjs.hasOwnProperty(key)) continue;
                        var currentItem = currentChar.PawnObjs[key][invSlot];

                        //check to see if its a azerite item
                        if (InvMap[response.data.inventoryType] == "head" || InvMap[response.data.inventoryType] == "shoulder" || InvMap[response.data.inventoryType] == "chest") {

                            var teir1 = newAzeriteIDs.filter(function (el) {
                                return el.tier === 1
                            });
                            var optiomalT1 = OptimalAzeriteTeir(teir1, currentChar.classID)

                            var teir2 = newAzeriteIDs.filter(function (el) {
                                return el.tier === 2
                            });
                            var optiomalT2 = OptimalAzeriteTeir(teir2, currentChar.classID)

                            var teir3 = newAzeriteIDs.filter(function (el) {
                                return el.tier === 3
                            });
                            var optiomalT3 = OptimalAzeriteTeir(teir3, currentChar.classID);

                            var teir4 = newAzeriteIDs.filter(function (el) {
                                return el.tier === 4
                            });
                            var optiomalT4 = OptimalAzeriteTeir(teir4, currentChar.classID);

                            //azeriteArray
                            Promise.all([optiomalT1, optiomalT2, optiomalT3, optiomalT4]).then(function (values) {
                                newitem.azeriteArray = [optiomalT1, optiomalT2, optiomalT3, optiomalT4]
                            });
                        }
                        //need to edit to include all values, not just for custom
                        var newitemValue = GetOverallItemValue(newitem[response.data.name], currentChar.StatWeights[key], currentChar.AzeriteValues[key], InvMap[response.data.inventoryType], currentChar.classID);
                        //now that we have the result,we can append to to the relevant tag in the character
                        var itemLink = document.getElementById(currentChar.charName + ":" + InvMap[response.data.inventoryType] + ":" + key)
                        //now for math, I need to get the value of the current item in the slot vs the new value we have for that slot
                        var resultP = document.createElement('p')
                        resultP.style.border = '5px solid black';
                        resultP.name = "results" //can use this for reset
                        try { //some class/specs dont wear certain peices of gear,so a good chance it just cant be equiped,handle it with a try catch
                            var resultPercentage = (currentItem.OverAllValue - newitemValue) / currentItem.OverAllValue * 100.0;
                            if (resultPercentage < 0) { //downgrade
                                resultP.innerHTML = Math.abs(resultPercentage).toFixed(2) + "%";
                                resultP.style.color = "green"

                                //I also want to append this information to the ItemRow
                                // itemRowTr.id = "compareTR" + ":" + itemID;
                                var itemRowTr = document.getElementById("compareTR" + ":" + newitemID);
                                //back here greg
                                var charNavLink = document.createElement('a');
                                charNavLink.id = "nav" + "-" + currentChar.charName + "-" + "tab";
                                charNavLink.setAttribute("data-toggle", "tab");
                                charNavLink.className = "nav-item nav-link";
                                charNavLink.href = "#nav-" + currentChar.charName
                                charNavLink.setAttribute("aria-controls", "nav-" + currentChar.charName);
                                charNavLink.onclick = function () {
                                    document.getElementById("nav" + "-" + currentChar.charName + "-" + "tab").setAttribute("aria-selected", "true");
                                }
                                charNavLink.innerHTML = "Upgrade found for:" + currentChar.charName + " for : " + key
                                var itemTd = document.createElement('td');
                                itemTd.appendChild(charNavLink);
                                itemRowTr.appendChild(itemTd);
                            } else { //upgrade
                                resultP.innerHTML = Math.abs(resultPercentage).toFixed(2) + "%";
                                resultP.style.color = "red"
                            }

                            itemLink.appendChild(resultP);
                        } catch (error) {
                            resultP.innerHTML = "No matching Slot"
                        }

                    }
                })





        }
    }
}


function OptimalAzeriteTeir(azeriteTeir, azeriteArray) { //used to find the best azerite value for a teir and return the dps value

    var returnAzeriteVal = 0;

    for (let index = 0; index < azeriteTeir.length; index++) {

        var traitID = azeriteTeir[index].id; //get the trait ID
        var traitValue = azeriteArray[traitID]; //get the value from the azierte object

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
    Pawnstring = Pawnstring.replace(')', '');
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
            AzeriteDict[holder[0]] = Number(holder[1]);

        }
        resolve(AzeriteDict);
    })
}



function LoadItemViaWowHead() {
    var link = document.getElementById("wowheadLink").value;
    if (link == "" || link == null || !link.includes("item=")) {
        console.log("Error,Please Link an item");
        return;
    }

    //try and get the itemID out of the link
    var itemID = link.substring(
        link.lastIndexOf("item=") + 5); //this will get use the ID,followed by other data

    //handle differnt forms of links,just need the id of the item
    if (itemID.indexOf('/') > -1) {
        itemID = itemID.slice(0, itemID.indexOf("/"))
    } else if (itemID.indexOf('&') > -1) {
        itemID = itemID.slice(0, itemID.indexOf("&"))
    }
    //try and get any bonus IDs from the link
    var BounusIDs = link.substring(
        link.lastIndexOf("bonus=") + 6, //Links will always be the same,can grab the item id like this
        link.lastIndexOf("")).split(":");


    //first make the nav for the character
    if (document.getElementById("nav" + "-" + "loadedItem" + "-" + "tab") == null) {
        tabled = true;
        var itemNav = document.createElement('a');
        itemNav.id = "nav" + "-" + "loadedItem" + "-" + "tab";
        itemNav.setAttribute("data-toggle", "tab");
        itemNav.className = "nav-item nav-link";
        itemNav.href = "#nav-" + "loadedItems"
        itemNav.setAttribute("aria-controls", "nav-" + "loadedItems");
        itemNav.innerHTML = "Items to Compare"
        if (document.getElementById('nav-tab').hasChildNodes()) {
            itemNav.setAttribute("aria-selected", "true");
        } else {
            itemNav.setAttribute("aria-selected", "false");
        }
    }

    var itemTblDiv = document.createElement('div');
    itemTblDiv.className = "tab-pane fade";
    itemTblDiv.id = "nav-" + "loadedItems";
    itemTblDiv.setAttribute("role", "tabpanel");
    itemTblDiv.setAttribute("aria-labelledby", itemTblDiv.id);

    var itemTbl = document.createElement('table');
    itemTbl.className = "table";
    itemTbl.id = "itemTable"

    var itemTblHead = document.createElement('thead');
    var itemTblTRow = document.createElement('tr');
    var itemHead = document.createElement('th');
    itemHead.innerHTML = "Items";
    itemTblTRow.appendChild(itemHead);
    var itemTblBody = document.createElement('tbody');
    itemTblBody.id = "itemTblBody"

    //now call the API with the data we pulled
    blizzard.wow.item({
            id: itemID,
            origin: 'us',
            bonuses: BounusIDs
        })
        .then(response => {
            var itemRowTr = document.createElement('tr');
            itemRowTr.id = "compareTR" + ":" + itemID;
            var itemLink = document.createElement("a");
            itemLink.href = "https://www.wowhead.com/item=" + itemID;
            itemLink.innerHTML = response.data.name;
            itemLink.name = "compareItem";
            var itemObj = {}
            itemObj.id = response.data.id;
            itemObj.bonusArray = BounusIDs; //obj here=
            itemLink.LoadedItem = itemObj;
            console.log(itemLink.LoadedItem)

            //get a vals obj for the item,and attach it to the link,this way, i can get them all and loop for great math
            var att = document.createAttribute("data-wowhead");
            var itemImg = document.createElement('img');
            itemImg.src = "https://wow.zamimg.com/images/wow/icons/medium/" + response.data.icon + ".jpg"
            itemImg.style = "border-style: groove;";
            att.value = "bonus=" + BounusIDs[0] + ":" + BounusIDs[1] + ":" + BounusIDs[2] + "&";
            //if (itemSlots[index] == "shoulder" || itemSlots[index] == "head" || itemSlots[index] == "chest") { //check to see if this is an azerite item

            //if it is, add fucntionality here to try and load in some traits to the item for each character
            // }
            itemLink.setAttributeNode(att);
            var itemTd = document.createElement('td');
            itemTd.appendChild(itemImg);
            itemTd.appendChild(itemLink); //back here gre   

                   //now lets add a button to remove that item
                   var removeTd = document.createElement('td');
                   var removeBtn = document.createElement('button');
                   removeBtn.addEventListener('click',() =>{
                      document.getElementById('itemTblBody').removeChild(itemRowTr);
                });
                   removeBtn.innerHTML = "Remove Item";
                   removeBtn.className = "btn btn-danger"
                   removeTd.appendChild(removeBtn);
                 
            itemRowTr.appendChild(itemTd);
            itemRowTr.appendChild(removeTd);
            itemTblBody.appendChild(itemRowTr);
            if (document.getElementById("itemTable") != null) {
                document.getElementById("itemTblBody").appendChild(itemRowTr);
                return;
            }

        }).catch(error => {
            console.log(error)
        }); //use catch on promise to catch any incorrect user input

    if (document.getElementById("itemTable") != null) {
        return;
    }
    itemTbl.appendChild(itemTblBody);
    itemTblHead.appendChild(itemTblTRow);
    itemTblDiv.appendChild(itemTbl);
    itemTbl.appendChild(itemTblHead);
    document.getElementById('nav-tab').appendChild(itemNav);
    document.getElementById('nav-tabContent').append(itemTblDiv);


}