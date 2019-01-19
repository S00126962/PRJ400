const blizzard = require('blizzard.js').initialize({
    key: 'cc03f6bfa99541d9b2644e450b96eadf',
    secert : 'jfTKRlzCmeUNlbpNA905QEdpICdJCuJ6',
    access_token : "USgBRrOmhhW3lJsO6KaFkd30vvc8fqBBS8" //This technically works,need better OAuth implentation 
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
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;

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

})


//Personal mode is just the users characters
function LoadPersonalMode() {
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
    
    characterRef.get().then((snapshot) =>{ //get it and
       
        //get the details needed for the API to get that characters items
            var charName =snapshot.data().charName;
            var region = snapshot.data().charRegion;
            var sever = snapshot.data().charRealm;      
            var classID = snapshot.data().classID; //need this for azerite traits
            var pawnString = snapshot.data().charPawnString; //need to check this for a null val later on
            //Call the promise to generate a character template,once its down,sent it to get added to the listview
             GenerateCharItemTemplate(charName,sever,region,pawnString,classID).then(result =>{
                     AddItemToListview(result) //send the resulting template and name off to be put on screen
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
    //return the full value in order to get the most correct results when comparing
    return (itemStatWeight * ItemStatAmount);
}

//promised based function to create an object to use for working with Wow Characters
async function GenerateCharItemTemplate(Name, Sever, Region,Pawnstring,classID) {
  
    return new Promise((resolve,reject) =>{
    try{
    //TODO,Add option to use this during item calc rather than provide this
    var PawnValues; //declare this here
    //now decide which one to use during the template generatetion
    if(Pawnstring || Pawnstring != "") //if it is there
    {
        PawnValues = readPawnString(Pawnstring); //use the one pulled from the database
    }
    else{ //otherwise go and find the default weights from the database
        //needs replacing with a reading system,rebuild class database
        var classRef = db.collection("Class")
        var classInQuestion = classRef.doc("Warrior");
        var specs = classInQuestion.collection('Specs');
        var statWeights = specs.doc("Fury");
        statWeights.get().then((snapshot) =>{ //need to wait here,look back into this
            //create the same object,just use the vals from the database
            PawnValues = {
                "PrimWeight": snapshot.data().PrimWeight,
                "HasteWeight": snapshot.data().HasteWeight,
                "CritWeight": snapshot.data().CritWeight,
                "ArmorWeight": snapshot.data().ArmorWeight,
                "LeechWeight": snapshot.data().LeechWeight,
                "MasteryWeight": snapshot.data().MasteryWeight,
                "StaminaWeight": snapshot.data().StaminaWeight,
                "VersatilityWeight": snapshot.data().VersatilityWeight,
                "WepDpsWeight": snapshot.data().WepDpsWeight
            };
        })
    }
    var CharObj = {}; //create a blank object to build up
    CharObj.charName = Name; //set the name on the object
    CharObj.classID = classID; //use this for wowheadTooltips later
    CharObj.StatWeights = PawnValues; //save these for later
    var CharitemValue = 0; //value to add up and get an overall value
    blizzard.wow.character(['profile', 'items'], { //call the api to get the users character,more specficly their items
            realm: Sever,
            name: Name,
            origin: Region
        })
        .then(response => {
            itemSlots.forEach(function (itemSlotName) { //loop though each item slot on the character
                try {
                var statsObj = GenerateItemValue(response.data.items[itemSlotName].stats); //get the current items stats
                CharObj[itemSlotName] = statsObj; //assign the name and the stats to the object
                var itemValue = GetOverallItemValue(CharObj[itemSlotName], PawnValues) //calcaute the value of that item
                
                CharitemValue += itemValue;
                CharObj[itemSlotName].OverAllValue = itemValue; //assign this to the object,have the overall value ready for comparsion
                CharObj[itemSlotName].id = response.data.items[itemSlotName].id //get the Item ID
                CharObj[itemSlotName].ItemName = response.data.items[itemSlotName].name //get the name of the name
                CharObj[itemSlotName].bonusList = response.data.items[itemSlotName].bonusLists; //pull out the bonus lists on the item
                CharObj[itemSlotName].itemEnchant = response.data.items[itemSlotName].tooltipParams.enchant //get any enchants on the item
                if (itemSlotName == "shoulder" || itemSlotName == "head" ||itemSlotName == "chest") { //if this is a azerite item we are looking at
                    //we have an azerite item,need to add that on
                    CharObj[itemSlotName].azeriteArray= response.data.items[itemSlotName].azeriteEmpoweredItem.azeritePowers //get the list of pwoers on that
                }
                } catch (error) {
                    console.log(error);
                }
                
            });
            CharObj.TotalItemValue = CharitemValue //assign the overvall value for a character
           resolve(CharObj); //return the object

        })
    }catch(e){console.log(e);throw e;}
})
}

//Function to generate a list item of the character,needs a character template from above to work
function AddItemToListview(CharTemplate)
{     
    //assume if this is called we want a new sub section on the list,eg another char
    //first build out the element to use
      var cardDiv = document.createElement("div");
      cardDiv.className = "card";
      var cardHeader = document.createElement("div");
      cardHeader.className = "card-header"
      var cardLink = document.createElement("a");
      cardLink.setAttribute("data-toggle","collapse");
      cardLink.href = "#" + CharTemplate.charName; //used for datatoggle
      cardLink.setAttribute("aria-expanded","false");
      cardLink.setAttribute("aria-controls",CharTemplate.charName);
      cardLink.text = CharTemplate.charName;
      var menuDiv = document.createElement("div");
      menuDiv.className = "collapse"
      menuDiv.id = CharTemplate.charName;//used for datatoggle
      var cardBody = document.createElement("div");
      cardBody.className = "card-body"

      for (let index = 0; index < itemSlots.length; index++) {
          try {
            var itemID = CharTemplate[itemSlots[index]].id;
            var SlotName = itemSlots[index]; //get the Name of the item slot we are itterating on
            var itemName = CharTemplate[itemSlots[index]].ItemName

            var borderDiv = document.createElement("div");
            borderDiv.style = "border-style: groove;";
            //now build the link for the item
            var slotNameP = document.createElement("p");
            slotNameP.innerText = SlotName + ":";
            slotNameP.id = SlotName;
            var bonus = CharTemplate[itemSlots[index]].bonusList;
            var itemLink = document.createElement("a");
            itemLink.href = "https://www.wowhead.com/item=" + itemID 
            var att = document.createAttribute("data-wowhead"); 
            //assign the custom wowhead attributes to an item,this will allow us to show the item correclty to the user
            //Eg if its warforogred for +10 ilvls,it will show on the tooltip
            att.value = "bonus=" +bonus[0] + ":"+bonus[1] + ":"+bonus[2] + "&"; //attach any bonuses
            att.value += "ench=" +CharTemplate[itemSlots[index]].itemEnchant +"&" //attach any enchats
            if (SlotName == "shoulder" || SlotName == "head" ||SlotName == "chest") { //check to see if this is an azerite item
                //we have an azerite item,need to add that on
                var azeriteArray = CharTemplate[itemSlots[index]].azeriteArray
                att.value += "azerite-powers=" + CharTemplate.classID + ":";
                for (let Azeriteindex = 0; Azeriteindex < azeriteArray.length; Azeriteindex++) {
                    att.value +=azeriteArray[Azeriteindex].id + ":"                   
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

//function to clear any characters loaded in
function ClearTemplateCards()
{
    //loop though the child nodes and remove the character templates
    var charNode = document.getElementById("accordion");
    while (charNode.firstChild) {
        charNode.removeChild(charNode.firstChild);
    }
}
//function to clear any item loaded in
function ClearLoadItem()
{
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
compareBtn.addEventListener("click", () =>{
    CompareItems();
});

function CompareItems() //function to compare two items and get a postive(upgrade)/negative(downgrade) intger 
{

    var CharTabs = document.getElementsByClassName("card-header");
    if(CharTabs.length <1)
    {
        console.log("You need characters to compare the item too!")
        return;
    }
    var LoadedItem = document.getElementById("LoadedItem").LoadedItem;
    if(LoadedItem == undefined)
    {
        console.log("you need an item to compare!")
        return;
    }
    //REPLACE WITH VAL FROM DB
   // var PawnValues = readPawnString("( Pawn: v1: \"Keyboardwárr-Fury\": Class=Warrior, Spec=Fury, Strength=1.44, Ap=1.36, CritRating=1.19, HasteRating=1.66, MasteryRating=1.32, Versatility=1.19, Dps=5.39 ")

    //get the new item's ID and bounus array(For contacting API)
    var newitemID = document.getElementById("LoadedItem").LoadedItem.id;
    var bonusArray = document.getElementById("LoadedItem").LoadedItem.bonusArray;

    blizzard.wow.item({
            id: newitemID,
            bonuses: bonusArray,
            origin: 'eu'//orgin does not matter here,all items will be the same,maybe the chinse version could be behind
        }) 
        .then(response => {  
            var newitem = {};
            var invSlot = InvMap[response.data.inventoryType];
            var statsObj = GenerateItemValue(response.data.bonusStats);
            newitem[response.data.name] = statsObj;
          //  newitem.OverAllValue = GetOverallItemValue(statsObj, PawnValues);
            
            
            for (let index = 0; index < CharTabs.length; index++) {
                var charObj = CharTabs[index].charDetails;
              
                var currentItem = charObj[invSlot];
                newitem.OverAllValue = GetOverallItemValue(newitem[response.data.name],charObj.StatWeights);
                var CharItemSlotsDivs = document.getElementById(charObj.charName).firstElementChild.childNodes;
                var CharItemSlots = [];
                CharItemSlotsDivs.forEach(item =>{
                    CharItemSlots.push(item.firstChild);
                })
                
                for (let i = 0; i < CharItemSlots.length; i++) {
                    if (CharItemSlots[i].id == invSlot) {
                       var result = (newitem.OverAllValue - currentItem.OverAllValue).toFixed(2); //round to two decimal places
                if (result > 0) {
                    //this is an upgrade
                    CharItemSlots[i].innerText+="\n" + "Value Compared to comparison Item"+ result  + "\n" + "Upgrade!"
                    CharTabs[index].style.backgroundColor = "green"

                }
                else if (result < 0) {
                    //then we have a downgrade
                    CharItemSlots[i].innerText+="\n" + "Value Compared to comparison Item"+ result  + "\n" + "DownGrade!"
                    CharTabs[index].style.backgroundColor = "red"

                }
                else if (result == 0) {
                    //very rare,but we have a tie,up to the user at this point
                    CharItemSlots[i].innerText= result+= "\n" + "Value Compared to comparison Item"+ result  + "\n"  + "Tie!"
    
                }
                    }
                    
                }
                
                
            }
         //   console.log("New item val:" + " " + newitem.OverAllValue)
          //  console.log("Old item val:" + " " + currentItem.OverAllValue)
          //  console.log("Result of item calc" + " " + newitem.OverAllValue - currentItem.OverAllValue)
                   
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

//function to read in azerite weights(from bloodmallet.com) and get a useable array
function ReadAzeriteVals(AzeriteString)
{
     var vals = azeriteString.split(",");
    var AzeriteDict = {};

    for (let index = 0; index < vals.length; index++) {
      var holder = vals[index].split("=");
      AzeriteDict[holder[0]] = holder[1];
      
    }
}
ReadAzeriteVals()

var wowHeadbtn =document.getElementById("findLinkBtn");
wowHeadbtn.addEventListener('click', () =>{
   ReadWowHeadLink();
})

function ReadWowHeadLink() //alternative to searching an item,let users paste in the link of the item from wowhead and get the info that way
{
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
        att.value = "bonus=" +BounusIDs[0] + ":"+BounusIDs[1] + ":"+BounusIDs[2] + "&";
        itemLink.setAttributeNode(att);
        itemLink.className = "q4";
        itemLink.innerHTML = response.data.name;
        itemHolder.appendChild(itemLink);

        //now make an object to store on the item holder
        var itemObj = {}
         itemObj.id = response.data.id;
         itemObj.bonusArray = BounusIDs;
         itemHolder.LoadedItem = itemObj;
      
        }).catch(error =>{console.log(error)}); //use catch on promise to catch any incorrect user input
      
}
