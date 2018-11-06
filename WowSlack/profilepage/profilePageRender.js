const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const db = firebase.firestore();
db.settings({timestampsInSnapshots:true})


var usernameLbl = document.getElementById('username');
var userEmailLbl = document.getElementById('userEmail');
ipcRenderer.on('loadProfilePage',(event,data) =>{
    console.log(data + " " +data)
    db.collection('Users').where('UserID', '==',data).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            console.log(doc.data())
                usernameLbl.innerHTML = doc.data().UserName;
                userEmailLbl.innerHTML = doc.data().userEmail;  
                
                //add more on here mate! it works now
        })
})
})