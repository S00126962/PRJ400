const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const remote = require('electron').remote


const defualt = firebase.app();
const db = defualt.firestore();
db.settings({timestampsInSnapshots:true})



ipcRenderer.on('loadProfilePage',() =>{
  var tid = setInterval( function () {
    if ( document.readyState !== 'complete' || remote.getGlobal("uid") == undefined) return;
    clearInterval( tid );       
    
var searchInput = document.getElementById('searchCharacters');

searchInput.addEventListener('input', () =>{ //very simple search,will do for time being
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchCharacters");
    filter = input.value.toUpperCase();
    table = document.getElementById("charTbl");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      } 
    }
})

var addcharBtn = document.getElementById('AddCharacterBTn');
addcharBtn.addEventListener('click', () =>{ //when the user clicks add character

        ipcRenderer.send('load-charCreate') //load that into the child window
})

    var uID = remote.getGlobal("uid");
    //get the detail holders
    var usernameLbl = document.getElementById('profileUserName');
    var userEmailLbl = document.getElementById('profileuserEmail');
    var userRegion = document.getElementById('profileUserRegion');

    //then get those details from the db
      db.collection('Users').where('UserID', '==',uID).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {     
              ipcRenderer.send( "storeUserDetails", [doc.data().UserName,doc.data().userEmail,doc.data().userRegion] ); //store them for later
              usernameLbl.innerHTML = doc.data().UserName;
              userEmailLbl.innerHTML =doc.data().userEmail;
              userRegion.innerHTML = doc.data().userRegion;    
                  
        })
      })
      //clear out the table first
        var tbody= document.getElementById('charTable');
        while (tbody.childNodes.length) {
            tbody.removeChild(tbody.childNodes[0]);
          }
          //get the users characters
        db.collection('Characters').where('userID', '==',uID).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
              //create the elements, and then fill in the details
                var row = document.createElement("tr");
                var cell1 = document.createElement("td");
                var cell2 = document.createElement("td");
                var cell3 = document.createElement("td");
                var cell4 = document.createElement("td");
                var btn = document.createElement("BUTTON");

                row.id = doc.id; //assign the id to the id so we can get at it again
                cell1.innerHTML = doc.data().charName;
                cell2.innerHTML = doc.data().charRegion;
                cell3.innerHTML = doc.data().charRealm;
                btn.className= "btn btn-danger"
                btn.onclick = delteChar;
                btn.innerHTML="Delete"
                cell4.appendChild(btn);
                row.appendChild(cell1);
                row.appendChild(cell2);
                row.appendChild(cell3);
                row.appendChild(cell4);
                tbody.appendChild(row);
            })
}).catch(function (error) {

    if (error != null) {
      alert(error.message)
      return;
    }
  })
  ipcRenderer.send('toggleLoaderOff');
}, 100 );
})



function delteChar()
{ 
    var row =this.closest('tr');
    var id = row.id;
    row.parentNode.removeChild(row);

    db.collection("Characters").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}


  