const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;


var defualt = firebase.app();
const db = defualt.firestore();
db.settings({timestampsInSnapshots:true})


var usernameLbl = document.getElementById('profileUserName');
var userEmailLbl = document.getElementById('profileuserEmail');
var userRegion = document.getElementById('profileUserRegion');
ipcRenderer.on('loadProfilePage',(event,data) =>{
    db.collection('Users').where('UserID', '==',defualt.auth().currentUser.uid).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {

            usernameLbl.innerHTML = doc.data().UserName;
            userEmailLbl.innerHTML = doc.data().userEmail;  
            userRegion.innerHTML = doc.data().userRegion;
                //add more on here mate! it works now
        })
        var tbody= document.getElementById('charTable');
        db.collection('Characters').where('userID', '==',defualt.auth().currentUser.uid).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
              
                var row = document.createElement("tr");
                var cell1 = document.createElement("td");
                var cell2 = document.createElement("td");
                var cell3 = document.createElement("td");

                row.id = doc.id; //assign the id to the id so we can get at it again
                cell1.innerHTML = doc.data().charName;
                cell2.innerHTML = doc.data().charRegion;
                cell3.innerHTML = doc.data().charRealm;
                row.appendChild(cell1);
                row.appendChild(cell2);
                row.appendChild(cell3);
                tbody.appendChild(row);
            })
})
})

})
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


  