// In the renderer process.
const { desktopCapturer } = require('electron')

const constraints = {
    audio: {
      mandatory: {
        chromeMediaSource: 'desktop'
      }
    },
    video: false
  }
desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
  if (error) throw error
  for (let i = 0; i < sources.length; ++i) {
    if (sources[i].name === 'Electron') {
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => console.log(stream))
        .catch((e) => handleError(e))
      return
    }
  }
})
