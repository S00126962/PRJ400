window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')

var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
const remote = require('electron').remote
const {
        clipboard
} = require('electron')
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
let peer;
let call;
ipcRenderer.on('info', function (event, data) {
        //  initPeer();   
        loadProfilePage();
        var signOutBtn = document.getElementById('signoutBtn');
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
        document.getElementById('userName').innerHTML = userData.UserName;
        populateGuildsDropDown();
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
        joinGuldBtn.onclick = () => {
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
                                        
                                        db.collection('Guilds').doc(guildID).get().then((snapshot) =>{
                                                var memebersArray = snapshot.data().GuildMemebers

                                                if (memebersArray.includes(remote.getGlobal('uid'))) {
                                                        alert("You are already in that guild!")
                                                }
                                                else
                                                {
                                                        memebersArray.push(remote.getGlobal('uid'));
                                                        db.collection('Guilds').doc(guildID).update({
                                                                GuildMemebers : memebersArray
                                                        }).then(() =>{populateGuildsDropDown()})
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
                snapshot.docs.forEach(doc => {
                        var guildToAppend = document.createElement('a');
                        guildToAppend.className = "dropdown-item"
                        guildToAppend.innerHTML = doc.data().GuildName;
                        guildToAppend.id = doc.id; //again,save id in id
                        guildToAppend.addEventListener("click", () => {
                                loadGuildOpts(guildToAppend.id, doc.data().GuildName);
                        });
                        if (doc.data().GuildLeader == remote.getGlobal("uid")) {
                                var inviteLink = document.createElement('a');
                                inviteLink.innerHTML = "Click for Invite Code"
                                console.log("heregreg")
                                inviteLink.id = doc.data().GuildInviteCode
                                inviteLink.addEventListener('click', () => {
                                        clipboard.writeText(inviteLink.id)
                                })
                                document.getElementById('guildDropDown').appendChild(inviteLink);
                        }
                        document.getElementById('guildDropDown').appendChild(guildToAppend)
                })
        })
}


function loadGuildCreate() {
        ipcRenderer.send('load-guildCreate')
}

async function loadGuildOpts(id, name) {

        try {
                document.getElementById('loadedGuild').parentNode.removeChild(document.getElementById('loadedGuild'))
                document.getElementById('loadedGuildEvent').parentNode.removeChild(document.getElementById('loadedGuildEvent'))
        } catch (error) {

        }
        ipcRenderer.send("load-Guild", id) //store the current guild gloably
        if (document.getElementById('loadedGuildTChannelsDDL') == undefined) {
                //attach a new item to the side bar
                var li = document.createElement('li');
                li.className = "nav-item dropdown";
                li.id = "loadedGuild"
                var a = document.createElement('a');
                a.className = "nav-link dropdown-toggle";
                a.id = "navDropDown" + ":" + id;
                a.name = "loadGuildChannels"
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
        if (document.getElementById('loadedGuildEventLink') == undefined) {
                var eventLi = document.createElement('li');
                eventLi.className = "nav-item"
                eventLi.id = "loadedGuildEvent";
                var eventA = document.createElement('a');
                eventA.id = "loadedGuildEventLink"
                eventA.innerHTML = name + "'s" + " " + "Events"
                eventA.className = "nav-link";
                eventA.addEventListener('click', () => {
                        loadEventPage(id)
                })
                eventLi.appendChild(eventA);
                document.getElementById('sidebar').appendChild(eventLi);
        }
        document.getElementById("loadedGuildTChannelsDDL").innerHTML = "";
        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(id);
        var chatChanne = guildInQuestions.collection('ChatChannels');
        var voiceChanne = guildInQuestions.collection('VoiceChannels');
        var divder = document.createElement('div');
        divder.className = "dropdown-divider";
        var channelTxt = document.createElement('a');
        channelTxt.className = "dropdown-item"
        channelTxt.innerHTML = "Text Channels";
        document.getElementById('loadedGuildTChannelsDDL').appendChild(channelTxt);
        document.getElementById('loadedGuildTChannelsDDL').appendChild(divder);

        await chatChanne.get().then((snapshot) => {
                snapshot.forEach(doc => {
                        console.log(doc.data())
                        //create all the elements needed
                        var channelToAppend = document.createElement('a');
                        channelToAppend.className = "dropdown-item"
                        channelToAppend.id = doc.id;
                        channelToAppend.guildID = id
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
        document.getElementById('loadedGuildTChannelsDDL').appendChild(voiceDivder);
        document.getElementById('loadedGuildTChannelsDDL').appendChild(voiceChannelTxt);
        voiceChanne.get().then((vsnapshot) => {
                vsnapshot.forEach(vdoc => {
                        console.log(vdoc.data())
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

function LoadChannelMembers(channelId, gID, channelName) {

        document.getElementById("ChannelMemebersList").innerHTML = "";
        document.getElementById("voiceNavDropDown").innerHTML = channelName;
        var guildref = db.collection("Guilds")
        var guildInQuestions = guildref.doc(gID);
        var voiceChanne = guildInQuestions.collection('VoiceChannels');
        var channelToLoad = voiceChanne.doc(channelId);
        var channelUsers = channelToLoad.collection("ConnectedUsers");
        document.getElementById("guildVoiceChannelBtn").onclick = () => {
                JoinVoiceChannel(channelId, gID);
        }

        channelUsers.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(function (change) {
                        if (change.type === "added") {
                                var li = document.createElement('li');
                                li.id = "loadVoiceMemeber:" + change.doc.id;
                                li.className = "list-group-item";
                                li.innerHTML = change.doc.data().name;
                                document.getElementById("ChannelMemebersList").appendChild(li);
                        }
                        if (change.type === "modified") {

                        }
                        if (change.type === "removed") {
                                var liLeft = document.getElementById("loadVoiceMemeber:" + change.doc.id);
                                liLeft.parentNode.removeChild(liLeft);
                        }
                })
        })

}

function loadItemCalc() {
        toggleLoaderOn();
        $("#pageArea").load("../itemCalc/itemcalc.html");
        ipcRenderer.send("load-itemCalc");
}


function initPeer() {
        peer = new Peer(remote.getGlobal("uid")); //create the peer,use the uId from firebase
        peer.on('call', function (call) {
                navigator.getUserMedia({
                        video: false,
                        audio: true
                }, (localMediaStream) => { //set our audio stream
                        call.answer(localMediaStream); //answer the incoming call, with our stream so the other user can hear us
                        call.on('stream', function (stream) {
                                playStream(stream, call.peer); //send it off to be attached to the audio tag
                        });
                }, errorCallback)
        });

        peer.on('disconnected', function () {
                //code here to handle user hanging up,eg kill the peer
                peer = null;
                console.log("Disconnteded fired!");
                // call.close();
        });

        peer.on('error', function (err) {
                console.log("ERROR");
                console.log(err);
        })
}

function CallPeer(pId) {
        if (pId == remote.getGlobal("uid")) {
                return;
        }
        console.log("I am calling" + " " + pId);
        navigator.getUserMedia({
                video: false,
                audio: true
        }, (localMediaStream) => { //set our audio stream
                call = peer.call(pId, localMediaStream);
                call.on('stream', function (remoteStream) {
                        playStream(remoteStream, pId)
                });
                UpdateCallRom(pId);
        }, errorCallback)
}

function UpdateCallRom(pId) {
        var muteBtn = document.createElement('button');
        muteBtn.innerHTML = "X";
        muteBtn.name = "muteBtn"
        muteBtn.addEventListener('click', () => {
                muteSound(pId);
        });
}

function muteSound(id) {
        var sound = document.getElementById('Voice:' + id);
        sound.muted = !sound.muted;
}

function JoinVoiceChannel(channelID, gid) {
        if (peer == null) {
                initPeer();
        }
        if (channelID == undefined || gid == undefined) {
                return;
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
                                var audio = new Audio('../assets/sounds/voice_join.mp3');
                                audio.volume = 0.2;
                                audio.play();
                        }
                        if (change.type === "removed") {
                                try {
                                        //if someone leaves, see if there audio is handing around and get rid of it
                                        var memeberAudio = document.getElementById('Voice:' + change.doc.id);
                                        memeberAudio.parentNode.removeChild(memeberAudio);
                                } catch (error) {
                                        console.log("Couldnt get rid");
                                }
                        }


                })
        });
        users.doc(remote.getGlobal("uid")).set({
                name: (remote.getGlobal('userDetails')[0])
        });

        var voiceOptBtn = document.getElementById("guildVoiceChannelBtn");
        voiceOptBtn.className = "btn btn-danger"
        voiceOptBtn.innerHTML = "Disconnect"
        voiceOptBtn.onclick = () => {
                DisconnectFromVoice(channelID, gid)
        };
}

function DisconnectFromVoice(channelId, gID) {
        peer.destroy();
        // document.getElementById("roomAudio").innerHTML = "";
        var myNode = document.getElementById("roomAudio");
        while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
        }
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
        thisUser.delete();
        var muteBtns = document.getElementsByName("muteBtn");
        for (var i = muteBtns.length - 1; i >= 0; i--) {
                muteBtns[i].parentNode.removeChild(muteBtns[i]);
        }
}

function playStream(stream, callPeer) {
        console.log(stream);
        var audioDiv = document.getElementById('roomAudio');
        var memeberAudio = document.createElement('audio');
        //   var isPlaying = document.createElement('p');
        //   isPlaying.id = "activeAudio:" + callPeer;
        //  stream.onactive = VoiceOn(isPlaying.id)
        //  stream.oninactive = VoiceOff(isPlaying.id)
        memeberAudio.src = URL.createObjectURL(stream);
        memeberAudio.id = "Voice:" + callPeer
        audioDiv.appendChild(memeberAudio);
        //  document.getElementById('loadVoiceMemeber:' + callPeer).appendChild(isPlaying);
        memeberAudio.play();

}

function VoiceOn(id) {
        document.getElementById(id).innerHTML = "Y";
}

function VoiceOff(id) {
        document.getElementById(id).innerHTML = "";
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

ipcRenderer.on('toggleLoaderOff', () => {
        console.log("I should be off right now");
        document.getElementById('pageArea').style.display = "";
        document.getElementById('loader').style.display = "none";
        var audio = new Audio('../assets/sounds/jobs_done.mp3');
        audio.volume = 0.2;
        audio.play();

})

function loadGuildPage(id) {
        console.log("In mainpage")
        $("#pageArea").load("../guildPage/guildPage.html");
        ipcRenderer.send("load-guildpage", id);
}