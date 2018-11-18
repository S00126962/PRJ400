
const blizzard = require('blizzard.js').initialize({
    apikey: 'qupb7zxzkdtzzzt87nnkyny29b289aw9'
});
const itemMap = require('./itemStatMapping.json'); //call in the mapping for data here
const itemSlots = ["head","neck","shoulder","back","chest","wrist","hands","waist","legs","feet","finger1","finger2","trinket1","trinket2","mainHand","offHand"];


function GetOverallItemValue(itemToCalc,StatWeights)
{
    var ItemValue = 0; //var to hold the overallValue for the item
    for (var key in itemToCalc) {
        if (itemToCalc.hasOwnProperty(key)) {

            if(key == "Strength" ||key == "Intellect" ||key == "Agility")
            {
                ItemValue += calcItemStatValue(StatWeights["PrimWeight"],itemToCalc[key]);
            }

            else
            {
                for(var WeightKey in StatWeights)
                {
                    if(WeightKey.includes(key))
                    {
                      // console.log(WeightKey +":" +StatWeights[WeightKey] + " " +  "-> " + key + itemToCalc[key])
                       ItemValue += calcItemStatValue(StatWeights[WeightKey],itemToCalc[key])
                    }
                }
            }
        }
      return ItemValue;
    }


}
function calcItemStatValue(itemStatWeight,ItemStatAmount)
{
    //return the full value in order to get the most correct results when comparing
    return (itemStatWeight * ItemStatAmount);
}

function GetCharAPI(Name,Sever,Region)
{
    blizzard.wow.character(['profile', 'items'], {
        realm: Sever,
        name: Name,
        origin: Region
      })
      .then(response => {
        console.log(response.data.items.shoulder);
    })
}

function GenerateCharItemTemplate(Name,Sever,Region)
{
    var PawnValues =readPawnString("( Pawn: v1: \"Keyboardwárr-Fury\": Class=Warrior, Spec=Fury, Strength=1.46, Ap=1.37, CritRating=1.21, HasteRating=1.68, MasteryRating=1.35, Versatility=1.21, Dps=5.39 )")

    var CharObj = {};
    blizzard.wow.character(['profile', 'items'], {
        realm: Sever,
        name: Name,
        origin: Region
      })
      .then(response => {

        itemSlots.forEach(function(itemSlotName) {

            var statsObj = GenerateItemValue(response.data.items[itemSlotName].stats);     
            CharObj[itemSlotName] = statsObj;
            var itemValue = GetOverallItemValue(CharObj[itemSlotName],PawnValues)

            CharObj[itemSlotName].OverAllValue = itemValue;
         });
         console.log(CharObj)
    })
    
}

function GenerateItemValue(item)
{
    var returnObj = {};
    item.forEach(element => {
                
        var Name = itemMap[element.stat];
        var StatAmount = element.amount;   
        returnObj[Name] = StatAmount   

     });
    return returnObj;
}

//function to pull out the stat weights for a character
function readPawnString(Pawnstring)
{
    //obj to store all the weights in,default everything to zero in the case a character doesnt use a certain stat
    //eg Dps wont care about leech,chances are they wont be in the pawn string
    var returnObj = {
        "PrimWeight":0 ,
        "HasteWeight":0 ,
        "CritWeight":0 ,
        "ArmorWeight":0 ,
        "LeechWeight":0 ,
        "MasteryWeight":0 ,
        "StaminaWeight":0 ,
        "VersatilityWeight":0 ,
        "WepDpsWeight":0 };

        //since we dont care about the Pawn version or name,just remove everything before the stats
       while (Pawnstring.includes(":")) {
        Pawnstring = Pawnstring.substring(Pawnstring.indexOf(":") + 1);
       }

        //now,spilt up the array on commas
        var PawnArray = Pawnstring.split(","); //I could just send this back,but I need to make sure everything has a default value
     
        //this is abit messy,maybe a way to loop the whole thing
        //now look for particlar stats in the array and get the value out
        var PrimWeight = PawnArray.filter(s => s.includes('Strength') || s.includes('Intellect') || s.includes('Agility')); //allows me to treat all these are the same value
        if (PrimWeight && PrimWeight.length ) { //make sure that there is stuff in the array
            returnObj.PrimWeight = PrimWeight[0].split("=")[1]; //get the decimal value out
        }
        var CritRating = PawnArray.filter(s => s.includes('Crit'));
        if (CritRating && CritRating.length ) {
            returnObj.CritWeight = CritRating[0].split("=")[1];
        } 
        var HasteWeight = PawnArray.filter(s => s.includes('Haste'));
        if (HasteWeight && HasteWeight.length ) {
            returnObj.HasteWeight = HasteWeight[0].split("=")[1];
        }
        var LeechWeight = PawnArray.filter(s => s.includes('Leech'));
        if (LeechWeight && LeechWeight.length ) {
            returnObj.LeechWeight = LeechWeight[0].split("=")[1];
        }
        var MasteryWeight = PawnArray.filter(s => s.includes('Mast'));
        if (MasteryWeight && MasteryWeight.length ) {
            returnObj.MasteryWeight = MasteryWeight[0].split("=")[1];
        }
        var StaminaWeight = PawnArray.filter(s => s.includes('Stam'));
        if (StaminaWeight && StaminaWeight.length ) {
            returnObj.StaminaWeight = StaminaWeight[0].split("=")[1];
        }
        var ArmorWeight = PawnArray.filter(s => s.includes('Armor'));
        if (ArmorWeight && ArmorWeight.length ) {
            returnObj.ArmorWeight = ArmorWeight[0].split("=")[1];
        }
        var VersatilityWeight = PawnArray.filter(s => s.includes('Vers'));
        if (VersatilityWeight && VersatilityWeight.length ) {
            returnObj.VersatilityWeight = VersatilityWeight[0].split("=")[1];
        }
        var WepDpsWeight = PawnArray.filter(s => s.includes('Dps'));
        if (WepDpsWeight && WepDpsWeight.length ) {
            returnObj.WepDpsWeight = WepDpsWeight[0].split("=")[1];
        }
        return returnObj; //finally return the object
}

GenerateCharItemTemplate("KeyBoardwárr","Silvermoon","eu")
//var stats =readPawnString("( Pawn: v1: \"Keyboardwárr-Fury\": Class=Warrior, Spec=Fury, Strength=1.46, Ap=1.37, CritRating=1.21, HasteRating=1.68, MasteryRating=1.35, Versatility=1.21, Dps=5.39 )")
