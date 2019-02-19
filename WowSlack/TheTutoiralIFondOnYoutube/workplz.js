//var getUserMedia = require('getusermedia')
navigator.getUserMedia({
    video: false,
    audio: true
}, (stream) => {
    getUserMedia({
        video: true,
        audio: false
    }, function (err, stream) {
        if (err) return console.error(err)

        var Peer = require('simple-peer')
        var peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
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
})