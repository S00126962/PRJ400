# blizzhub-ts
A typescript library with the implementation of the new blizzard API
This library is inteded to be used with a know-how of restful API's and some experience of blizzard games at all.

## How to install?
> npm i blizzhub

## How to use?
First you have to create an Application or have an existing one at the new battle.net portal in order
to retrieve the client_id and client_secret (this is basically how OAuth works).
To initialize our api we simply do:

```ts
import { API, IBearerToken } from 'blizzhub/lib/api'
import wow from 'blizzhub/lib/wow'
import d3 from 'blizzhub/lib/diablo3'
const api = new API('client_id', 'client_secret', (status, token) => {
    //Here inside you do whatever you want with the token like this
    const const conRealms = new wow.ConnectedRealm();
    conRealms.getConnectedRealmIndex('us', 'dynamic-us', 'en_US')
    .then( data )
    .catch( ex => {} )
})
```
Now there are alot of options for Wow or Diablo3, you can even import them directly by doing

```ts
import {Boss} from 'blizzhub/lib/wow'
```

This library is up-to-date with battle.net dev portal, i'll keep updating this
after they release Starcraft2 API.

If you find any bug or something not working well, please simply report it and i'll fix

