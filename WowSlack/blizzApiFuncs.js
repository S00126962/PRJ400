
const blizzard = require('blizzard.js').initialize({
  key: 'cc03f6bfa99541d9b2644e450b96eadf',
  secert : 'jfTKRlzCmeUNlbpNA905QEdpICdJCuJ6',
  access_token : "USrNZIXG43xDgMkKL6yOC7DfgaMI1UDnYx"
});





function GetCharacterDetails(_realm, _name, _origin) {
  blizzard.wow.character(['profile'], {
      realm: _realm,
      name: _name,
      origin: _origin
    })
    .then(response => {
      console.log(response.data.head);
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
      origin: _origin,
      bonus :[1547, 5136, 5378]
    })
    .then(response => {
        console.log(response.data.azeriteClassPowers);
    }).catch(error => {console.log(error)});

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


//GetItemDetail(157993,"us")
GetCharacterItems('Silvermoon', 'KeyboardWárr', 'eu')
