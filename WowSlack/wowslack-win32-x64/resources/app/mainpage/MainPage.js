window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')

var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
const remote = require('electron').remote;
const {
        clipboard
} = require('electron');
const prompt = require('electron-prompt');
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
var auth = firebase.auth();
db.settings({
        timestampsInSnapshots: true
})
let peer; //decalre the peer here for later
let call; //same with the call
ipcRenderer.on('info', function (event, data) { //fired on sign in
        loadProfilePage(); //load the profile page whenever the user sings in
        var signOutBtn = document.getElementById('signoutBtn');
        //handle exiting the app, this could be got rid of if I decide not to go frameless
        signOutBtn.addEventListener('click', function (event) {
                var config = {
                        apiKey: "AIzaSyBPwA6lwFFahoYIABYpeAvjmSA10gkj040",
                        authDomain: "wow-slack.firebaseapp.com",
                        databaseURL: "https://wow-slack.firebaseio.com",
                        projectId: "wow-slack",
                        storageBucket: "wow-slack.appspot.com",
                        messagingSenderId: "105436064015"
                };
                firebase.initializeApp(config);
                firebase.auth().signOut().then(function () {

                        ipcRenderer.send('sign-out')
                }).catch(function (error) {

                        if (error != null) {
                                alert(error.message)
                                return;
                        }
                })

        });
        //assign the onlcick for loading profile
        var profileBtn = document.getElementById('profilePageBtn');
        profileBtn.addEventListener('click', () => {
                loadProfilePage();
        })

        var uID = remote.getGlobal("uid");
        db.collection('Users').where('UserID', '==', uID).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                        populatePageDetails(doc.data());
                })
        })

});

function errorCallback(e) {
        console.log('Error', e)
}

function populatePageDetails(userData) {
        document.getElementById('userName').innerHTML = userData.UserName; //set the username
        populateGuildsDropDown(); //populate the users guilds

        //set up item calc on click
        var itemCalcBtn = document.getElementById("itemCalcBtn");
        itemCalcBtn.onclick = loadItemCalc;
}


function populateGuildsDropDown() {
        document.getElementById('guildDropDown').innerHTML = "";
        var addGuldBtn = document.createElement('a');
        addGuldBtn.className = "dropdown-item"
        addGuldBtn.innerHTML = "Add Guild";
        addGuldBtn.id = "addGuildBtn";
        addGuldBtn.onclick = loadGuildCreate;
        document.getElementById('guildDropDown').appendChild(addGuldBtn);
        //now a button to join a guild

        var joinGuldBtn = document.createElement('a');
        joinGuldBtn.className = "dropdown-item"
        joinGuldBtn.innerHTML = "Join Guild";
        joinGuldBtn.id = "joinGuildBtn";
        joinGuldBtn.onclick = () => { //whenever a user wants to join a guild,offer a promt 
                prompt({
                                title: 'Join a guild',
                                label: 'URL:',
                                value: 'http://example.org',
                                inputAttrs: {
                                        type: 'text'
                                }
                        })
                        .then((r) => {
                                if (r === null) {

                                } else {
                                        var link = r;
                                        var guild = link.split(':', 2);
                                        var guildID = guild[1];

                                        db.collection('Guilds').doc(guildID).get().then((snapshot) => {
                                                var memebersArray = snapshot.data().GuildMemebers

                                                if (memebersArray.includes(remote.getGlobal('uid'))) {
                                                        alert("You are already in that guild!")
                                                } else {
                                                        memebersArray.push(remote.getGlobal('uid'));
                                                        db.collection('Guilds').doc(guildID).update({
                                                                GuildMemebers: memebersArray
                                                        }).then(() => {
                                                                populateGuildsDropDown()
                                                        })
                                                }
                                        })
                                }
                        })
                        .catch(console.error);
        }
        document.getElementById('guildDropDown').appendChild(joinGuldBtn);

        var divder = document.createElement('div');
        divder.className = "dropdown-divider";
        document.getElementById('guildDropDown').appendChild(divder);

        db.collection('Guilds').where('GuildMemebers', 'array-contains', remote.getGlobal("uid")).get().then((snapshot) => {
                snapshot.docs.forEach(doc => { //get each guild the use is apart of, and fill in the details
                        var guildToAppend = document.createElement('a');
                        guildToAppend.className = "dropdown-item"
                        guildToAppend.innerHTML = doc.data().GuildName;
                        guildToAppend.id = doc.id; 
                        guildToAppend.addEventListener("click", () => {
                                loadGuildOpts(guildToAppend.id, doc.data().GuildName); //load that guilds channels
                        });
                        if (doc.data().GuildLeader == remote.getGlobal("uid")) { //if this user is the guild admin,create the invite link
                                var inviteLink = document.createElement('a');
                                inviteLink.innerHTML = "Click for Invite Code"
                                inviteLink.id = doc.data().GuildInviteCode
                                inviteLink.addEventListener('click', () => {
                                        clipboard.writeText(inviteLink.id) //copy it to the users clipboard
                                })
                                document.getElementById('guildDropDown').appendChild(inviteLink);
                        }
                        document.getElementById('guildDropDown').appendChild(guildToAppend)
                        var divder2 = document.createElement('div');
                        divder2.className = "dropdown-divider";
                        document.getElementById('guildDropDown').appendChild(divder2);

                })
        })
}


function loadGuildCreate() {
        ipcRenderer.send('load-guildCreate');
}

async function loadGuildOpts(id, name) {

        try { //clear out the previsous options,try catch to avoid breaking the first time around
                document.getElementById('loadedGuild').parentNode.removeChild(document.getElementById('loadedGuild'))
                document.getElementById('loadedGuildEvent').parentNode.removeChild(document.getElementById('loadedGuildEvent'))
        } catch (error) {

        }
        ipcRenderer.send("load-Guild", id) //store the current guild gloably
        if (document.getElementById('loadedGuildTChannelsDDL') == undefined) { //create element to store channels
                //attach a new item to the side bar
                var li = document.createElement('li');
                li.className = "nav-item dropdown";
                li.id = "loadedGuild"
                var a = document.createElement('a');
                a.className = "nav-link dropdown-toggle";
                a.id = "navDropDown" + ":" + id;
                a.name = "loadGuildChannels";
                a.innerHTML = name + "'s" + " " + "Channels"
                a.setAttribute("data-toggle", "dropdown")
                a.setAttribute("aria-haspopup", "true")
                a.setAttribute("aria-expanded", "false")
                li.appendChild(a);
                var dropdown = document.createElement('div');
                dropdown.id = "loadedGuildTChannelsDDL";
                dropdown.classList = "dropdown-menu";
                dropdown.setAttribute("aria-labelledby", "navDropDown" + ":" + id);
                li.appendChild(dropdown);
                document.getElementById('sidebar').appendChild(li);
        }
        if (document.getElementById('loadedGuildEventLink') == undefined) { //create a guild event link
                var eventLi = document.createElement('li');
                eventLi.className = "nav-item"
                eventLi.id = "loadedGuildEvent";
                var eventA = document.createElement('a');
                eventA.id = "loadedGuildEventLink"
                eventA.innerHTML = name + "'s" + " " + "Events"
                eventA.className = "nav-link";
                eventA.addEventListener('click', () => {
                        loadEventPage(id);
                })
                eventLi.appendChild(eventA);
                document.getElementById('sidebar').appendChild(eventLi);
        }
        document.getElementById("loadedGuildTChannelsDDL").innerHTML = "";

        //now to get the details out
        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(id);
        var chatChanne = guildInQuestions.collection('ChatChannels');
        var voiceChanne = guildInQuestions.collection('VoiceChannels');
        var divder = document.createElement('div');
        divder.className = "dropdown-divider";
        //create a element for voice channels
        var channelTxt = document.createElement('a');
        channelTxt.className = "dropdown-item"
        channelTxt.innerHTML = "Text Channels";
        //add button for text channel add
        var addTextChannel = document.createElement('a');
        addTextChannel.innerHTML = "Add new Channel"
        addTextChannel.addEventListener('click', () => {
                CreateTextChannel(id);
        });
        //attach everything together
        document.getElementById('loadedGuildTChannelsDDL').appendChild(channelTxt);
        document.getElementById('loadedGuildTChannelsDDL').appendChild(addTextChannel);
        document.getElementById('loadedGuildTChannelsDDL').appendChild(divder);

        //not time to get the channels themselfs
        await chatChanne.get().then((snapshot) => {
                snapshot.forEach(doc => { //each doc here is a channel, so build up the details
                        //create all the elements needed
                        var channelToAppend = document.createElement('a');
                        channelToAppend.className = "dropdown-item"
                        channelToAppend.id = doc.id; //channels ID on firebase,use here so we can tell what channel to load
                        channelToAppend.innerHTML = doc.data().ChannelName;
                        channelToAppend.addEventListener('click', () => {
                                loadChatPage(doc.id, id)
                        })
                        document.getElementById('loadedGuildTChannelsDDL').appendChild(channelToAppend)
                });

        });
        var voiceDivder = document.createElement('div');
        voiceDivder.className = "dropdown-divider";
        var voiceChannelTxt = document.createElement('a');
        voiceChannelTxt.className = "dropdown-item"
        voiceChannelTxt.innerHTML = "Voice Channels";
        var addVoiceChannel = document.createElement('a');
        addVoiceChannel.innerHTML = "Add Voice Channel"
        addVoiceChannel.addEventListener('click', () => {
                CreateVoiceChannel(id);
        })
        document.getElementById('loadedGuildTChannelsDDL').appendChild(voiceDivder);
        document.getElementById('loadedGuildTChannelsDDL').appendChild(voiceChannelTxt);
        document.getElementById('loadedGuildTChannelsDDL').appendChild(addVoiceChannel);
        voiceChanne.get().then((vsnapshot) => { //not get the voice channels,same as text 
                vsnapshot.forEach(vdoc => {
                        //create all the elements needed
                        var channelToAppend = document.createElement('a');
                        channelToAppend.className = "dropdown-item"
                        channelToAppend.id = vdoc.id;
                        channelToAppend.guildID = id
                        channelToAppend.innerHTML = vdoc.data().Name;
                        channelToAppend.addEventListener('click', () => {
                                LoadChannelMembers(vdoc.id, id, vdoc.data().Name);
                        })
                        document.getElementById('loadedGuildTChannelsDDL').appendChild(channelToAppend)
                });

        });
}

function LoadChannelMembers(channelId, gID, channelName) { //used to load in a voice channel to join

        document.getElementById("ChannelMemebersList").innerHTML = "";
        document.getElementById("voiceNavDropDown").innerHTML = channelName;
        document.getElementById("voiceNavDropDown").style.display = "";
        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(gID);
        var voiceChanne = guildInQuestions.collection('VoiceChannels');
        var channelToLoad = voiceChanne.doc(channelId);
        var channelUsers = channelToLoad.collection("ConnectedUsers");
        document.getElementById("guildVoiceChannelBtn").onclick = () => {
                JoinVoiceChannel(channelId, gID); //set up the click here,dont want people join when no channel is loaded
        }

        channelUsers.onSnapshot((snapshot) => {//set up a listner to handle people leaving the room
                snapshot.docChanges().forEach(function (change) {
                        if (change.type === "added") { //if someone hoins
                                var li = document.createElement('li');
                                li.id = "loadVoiceMemeber:" + change.doc.id; //used to remove the user on leave
                                li.className = "list-group-item";
                                li.innerHTML = change.doc.data().name;
                                document.getElementById("ChannelMemebersList").appendChild(li);
                        }
                        if (change.type === "modified") {
                                //cant think of any time this will fire,keep in for later in case
                        }
                        if (change.type === "removed") { //when someone leaves
                                var liLeft = document.getElementById("loadVoiceMemeber:" + change.doc.id);
                                liLeft.parentNode.removeChild(liLeft);
                        }
                })
        })

}

function CreateTextChannel(id) { //use a promt to add a new channel
        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(id);
        var chatChanne = guildInQuestions.collection('ChatChannels');
        prompt({
                        title: 'Create Text Channel',
                        label: 'Name:',
                        value: '',
                        inputAttrs: {
                                type: 'text'
                        }
                })
                .then((r) => {
                        if (r === null) {

                        } else {
                                chatChanne.add({
                                        ChannelName: r //set the name to the result(what the user entered)
                                }).then((ref) => {
                                        var today = new Date(); //get the date
                                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); //format date
                                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); //format time
                                        var timeStamp = date + ' ' + time; //create timestamp
                                        chatChanne.doc(ref.id).collection("Messages").add({ //add a default message
                                                MessagerSender: "WowSlack",
                                                MessageText: "Welcome to " + r,
                                                MessageTimeStamp: timeStamp
                                        })
                                })
                        }
                })
                .catch(console.error);
}

function CreateVoiceChannel(id) { //same as creating a text channel
        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(id);
        var voiceChanne = guildInQuestions.collection('VoiceChannels');
        prompt({
                        title: 'Create Text Channel',
                        label: 'Name:',
                        value: '',
                        inputAttrs: {
                                type: 'text'
                        }
                })
                .then((r) => {
                        if (r === null) {

                        } else {
                                voiceChanne.add({
                                        Name: r //only need to set the name here
                                })
                        }
                })
                .catch(console.error);


}

function loadItemCalc() {
        toggleLoaderOn();
        $("#pageArea").load("../itemCalc/itemcalc.html");
        ipcRenderer.send("load-itemCalc");
}


function initPeer() { //used to handle voice chat, this sets up the peer for use
        peer = new Peer(remote.getGlobal("uid")); //create the peer,use the uId from firebase
        peer.on('call', function (call) { //when we get a call
                navigator.getUserMedia({ //get the audio
                        video: false,
                        audio: true
                }, (localMediaStream) => { //then with the audio
                        call.answer(localMediaStream); //answer the incoming call, with our stream so the other user can hear us
                        call.on('stream', function (stream) { //when the call gets a stream object,eg someone answers
                                console.log(stream);
                                playStream(stream, call.peer); //send it off to be attached to the audio tag
                        });
                }, errorCallback)
        });

        peer.on('disconnected', function () { //whenever we are leaving
                peer = null; //null out the peer
        });

        peer.on('error',(error) =>{
                alert.log(error) //not a great soultion here, since the Peer js severs can hold the ID and thus break the app, I need to know the error
        })

}

function CallPeer(pId) {
        if (pId == remote.getGlobal("uid")) { //make sure we are not calling ourselfs
                return;
        }
        navigator.getUserMedia({
                video: false,
                audio: true
        }, (localMediaStream) => { //set our audio stream
                console.log(localMediaStream);
                call = peer.call(pId, localMediaStream); //set up the call,call the new peer
                call.on('stream', function (remoteStream) { //whenever we get the stream from the other user
                        playStream(remoteStream, pId) //play it
                });
                AddCallControls(pId); //update the calldetails
        }, errorCallback)
}

function AddCallControls(pId) { //add a button to mute the memeber
        var muteBtn = document.createElement('button');
        muteBtn.innerHTML = "X";
        muteBtn.name = "muteBtn"
        muteBtn.addEventListener('click', () => {
                muteSound(pId);
        });
}

function muteSound(id) { //function to mute the person,linked to their mute button
        var sound = document.getElementById('Voice:' + id);
        sound.muted = !sound.muted;
}

function JoinVoiceChannel(channelID, gid) { //whenever a user hoins the room
        if (channelID == undefined || gid == undefined) { //check to see if this was fired by mistake
                return;
        }
        if (peer == null) { //init the peer if its not already done
                initPeer();
        }
        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(gid); //hard code for node
        var chatChanne = guildInQuestions.collection('VoiceChannels');
        var channelInQuestion = chatChanne.doc(channelID);
        var users = channelInQuestion.collection('ConnectedUsers');

        users.onSnapshot(snapshot => { //whenever there is a change(EG if a new user joins)
                let changes = snapshot.docChanges(); //init the listner
                changes.forEach(change => { //when it gets a chance
                        if (change.type === "added") {
                                CallPeer(change.doc.id); //call the new peer
                                var audio = new Audio('../assets/sounds/voice_join.mp3'); //play a sound to indicate whenever someone joins
                                audio.volume = 0.2;
                                audio.play();
                        }
                        if (change.type === "removed") {
                                try {
  
                                       
                                        var memeberAudio = document.getElementById('Voice:' + change.doc.id);
                                       memeberAudio.parentNode.removeChild(memeberAudio);
                                } catch (error) {

                                }
                        }


                })
        });
        users.doc(remote.getGlobal("uid")).set({ //once we join,add our details to the call room
                name: (remote.getGlobal('userDetails')[0])
        });
        //click the click on the join button to disconnect
        var voiceOptBtn = document.getElementById("guildVoiceChannelBtn");
        voiceOptBtn.className = "btn btn-danger"
        voiceOptBtn.innerHTML = "Disconnect"
        voiceOptBtn.onclick = () => {
                DisconnectFromVoice(channelID, gid)
        };
}

function DisconnectFromVoice(channelId, gID) {
        peer.destroy(); //destory the peer, this will kill everything related to the call aswell
        var myNode = document.getElementById("roomAudio"); //remove any audio handing around from the call
        while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
        }

        //go back to connect to call on the button click
        var voiceOptBtn = document.getElementById("guildVoiceChannelBtn");
        voiceOptBtn.className = "btn btn-success"
        voiceOptBtn.innerHTML = "Join";
        voiceOptBtn.onclick = () => {
                JoinVoiceChannel(channelId, gID)
        }

        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(gID);
        var voiceChanne = guildInQuestions.collection('VoiceChannels');
        var channelToLoad = voiceChanne.doc(channelId);
        var channelUsers = channelToLoad.collection("ConnectedUsers");
        var thisUser = channelUsers.doc(remote.getGlobal("uid"));
        thisUser.delete(); //remove ourselfs from the call on the database

        //remove any mute buttons
        var muteBtns = document.getElementsByName("muteBtn");
        for (var i = muteBtns.length - 1; i >= 0; i--) {
                muteBtns[i].parentNode.removeChild(muteBtns[i]);
        }
}

function playStream(stream, callPeer) {//function to handle the adding of audio
        var audioDiv = document.getElementById('roomAudio');
        var memeberAudio = document.createElement('audio'); //create an audio tag
        memeberAudio.src = URL.createObjectURL(stream); //add the mediastream to the audio
        memeberAudio.id = "Voice:" + callPeer //set the ID
        audioDiv.appendChild(memeberAudio); //add the audio
        memeberAudio.play(); //play it

}

function loadChatPage(chatId, guildID) {
        toggleLoaderOn();
        $("#pageArea").load("../guildChatpage/guildChatPage.html");
        ipcRenderer.send("load-guildChatpage", chatId, guildID);
}

function loadEventPage(id) {
        toggleLoaderOn();
        $("#pageArea").load("../guildCalendarV2/calendar.html");
        ipcRenderer.send("load-guildEventPage", id);
}

function loadProfilePage() {
        toggleLoaderOn();
        $("#pageArea").load("../ProfilePage/ProfilePage.html");
        ipcRenderer.send("tabChangeProfile");
}

function toggleLoaderOn() {
        document.getElementById('pageArea').style.display = "none";
        document.getElementById('loader').style.display = "";
}

ipcRenderer.on('toggleLoaderOff', () => { //function used to stop loading
        document.getElementById('pageArea').style.display = "";
        document.getElementById('loader').style.display = "none";
        var audio = new Audio('../assets/sounds/jobs_done.mp3');
        audio.volume = 0.2;
        audio.play();

})