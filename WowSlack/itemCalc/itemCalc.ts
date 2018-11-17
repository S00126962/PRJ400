
interface Statweigts { //this interface lists out all the stats and allows me to assign a value to each
    PrimWeight: number;
    HasteWeight: number;
    CritWeight: number;
    ArmorWeight: number;
    LeechWeight: number;
    MasteryWeight: number;
    StaminaWeight: number;
    VersatilityWeight: number;
    WepDpsWeight: number;

}


interface Character 
{
    charName: string;
    charStatWeight : Statweigts;
}


function GetCharFromAPI(charName : string,charRegion : string, charRealm : string)
{
    
}

export function CalcValue(statWeight: number, itemStat: number): number 
{
    return statWeight * itemStat;
}

