// call exported function to create Electron process
var wrtc = require('electron-webrtc')()
 
// handle errors that may occur when trying to communicate with Electron
wrtc.on('error', function (err) { console.log(err) })
 
// uses the same API as the `wrtc` package
var pc = new wrtc.RTCPeerConnection(config)
 
// compatible with `simple-peer`
var peer = new SimplePeer({
  initiator: true,
  wrtc: wrtc
})
 
// listen for errors
wrtc.on('error', function (err, source) {
  console.error(err)
})
        var Peer = require('simple-peer')
        var peer = new Peer({
            initiator: true,
            trickle: false,
            wrtc: wrtc
        })

    peer.on('signal', function (data) {
        document.getElementById('yourId').value = JSON.stringify(data)
    })

    document.getElementById('connect').addEventListener('click', function () {
        var otherId = JSON.parse(document.getElementById('otherId').value)
        peer.signal(otherId)
    })

    document.getElementById('send').addEventListener('click', function () {
        var yourMessage = document.getElementById('yourMessage').value
        peer.send(yourMessage)
    })

    peer.on('data', function (data) {
        document.getElementById('messages').textContent += data + '\n'
    })

    peer.on('stream', function (stream) {
        var video = document.createElement('video')
        document.body.appendChild(video)

        video.src = window.URL.createObjectURL(stream)
        video.play()
    })
