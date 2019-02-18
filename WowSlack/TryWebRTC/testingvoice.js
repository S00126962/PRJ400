var Peer = require('simple-peer')
var p = new Peer({ initiator: location.hash === '#1', trickle: false })
 
p.on('error', function (err) { console.log('error', err) })
 
p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
})
 
document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault()
  var val = document.getElementById('incoming').value;
  var obj = {};
  obj.data = JSON.parse(val);
  p.signal(JSON.parse(val))
})
 
p.on('connect', function () {
  console.log('CONNECT')
  p.send('whatever' + Math.random())
})
 
p.on('data', function (data) {
  console.log('data: ' + data)
})