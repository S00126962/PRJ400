var axios = require('axios');
https://{region}.battle.net/oauth/authorize
axios.request({
  url: "/oauth/authorize",
  method: "post",
  baseURL: "https://eu.battle.net/",
  auth: {
    username: "vaf7vX0LpsL5",
    password: "pVEosNa5TuK2x7UBG_ZlONonDsgJc3L1"
  },
  data: {
    "grant_type": "client_credentials",
    "scope": "public"    
  }
}).then(function(res) {
  console.log(res);  
});
const blizzard = require('blizzard.js').initialize({
  key: 'cc03f6bfa99541d9b2644e450b96eadf',
  secert : 'e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI',
  access_token : 'USSt8C61cdMub9FUCFpXFOvYN9XqYrYJ9C'
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
blizzard.wow.character(['profile'], { origin: 'us', realm: 'amanthul', name: 'charni' })
  .then(response => {
    console.log(response.data);
  });
