require('get-user-media');

let peer = new Peer("supercoolgregman1993"); 

const {desktopCapturer} = require('electron')




console.log(peer);

var conn = peer.connect('another-peers-id');
// on open will be launch when you successfully connect to PeerServer
conn.on('open', function(){
  // here you have conn.id
  conn.send('hi!');
});



peer.on('connection', function(conn) {
  conn.on('data', function(data){
    // Will print 'hi!'
    console.log(data);
  });
});

desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
  if (error) throw error
  for (let i = 0; i < sources.length; ++i) {
    if (sources[i].name === 'Electron') {
      navigator.mediaDevices.getUserMedia({audio:true }).then((stream) =>{
  let call = peer.call('another-peers-id', stream);
  call.on('stream', function(remoteStream) {
    // Show stream in some video/canvas element.
    console.log(remoteStream);
  });
}, function(err) {
  console.log('Failed to get local stream' ,err);
});


peer.on('call', function(call) {
  desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
    if (error) throw error
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i].name === 'Electron') {
        navigator.mediaDevices.getUserMedia({audio: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        }}).then((stream) =>{
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', function(remoteStream) {
      console.log(remoteStream);
      var audio =document.getElementById('audioHere');
      var source = document.createElement('source');
      audio.src = remoteStream;
      audio.appendChild(source);
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
      }}})})}}})



