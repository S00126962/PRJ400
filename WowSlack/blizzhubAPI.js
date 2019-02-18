import { API, IBearerToken } from 'blizzhub/lib/api'
import {Wow} from 'blizzhub/lib'
import {Diablo3} from 'blizzhub/lib'
const api = new API('cc03f6bfa99541d9b2644e450b96eadf', 'e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI', (status, token) => {
    //Here inside you do whatever you want with the token like this
    const conRealms = new Wow.ConnectedRealm();
    conRealms.getConnectedRealmIndex('us', 'dynamic-us', 'en_US')
    .then( data )
    .catch( ex => {} )
})