var token = "EUqWqBNitbV1zGOXpEkAwgPW5xy3nv1u7u"
const blizzard = require('blizzard.js').initialize({
  key: 'cc03f6bfa99541d9b2644e450b96eadf',
  secert: 'e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI',
  access_token: token
});







function GetCharacterDetails(_realm, _name, _origin) {
  blizzard.wow.character(['profile'], {
      realm: _realm,
      name: _name,
      origin: _origin
    })
    .then(response => {
      console.log(response.data);
      return response;
    });
}

function GetCharacterItems(_realm, _name, _origin) {
  blizzard.wow.character(['profile', 'items'], {
      realm: _realm,
      name: _name,
      origin: _origin
    })
    .then(response => {
      console.log(response.data.items["head"].azeriteEmpoweredItem)
    });
}

function GetItemDetail(_itemID, _origin) {
  blizzard.wow.item({
      id: _itemID,
      origin: _origin
    })
    .then(response => {
      console.log(response.data);
    }).catch(error => {
      console.log(error)
    });

}


function GetRealms(_origin) {
  var returnArray = new Array();
  blizzard.wow.realms({
      origin: 'eu'
    })
    .then(response => {
      for (let index = 0; index < response.data.realms.length; index++) {
        var rName = response.data.realms[index].name
        returnArray.push(rName)
      }
      return returnArray;
    });

}

function GetCharClass() {
  var result;
  blizzard.wow.data('character-classes', {
      origin: 'us'
    })
    .then(response => {
      console.log(response.data.classes);
      result = response.data.classes.filter(obj => {
        return obj.id === 6
      })
      return result;
    });
}

GetItemDetail('4777', 'eu')
//GetCharacterDetails("Silvermoon", "Keyboardwárr", "eu")