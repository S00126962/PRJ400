const request = require('request');
request('https://eu.battle.net/oauth/token?grant_type=client_credentials&client_id=cc03f6bfa99541d9b2644e450b96eadf&client_secret=e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI', { json: true }, (err, res, body) => {console.log(body)})
