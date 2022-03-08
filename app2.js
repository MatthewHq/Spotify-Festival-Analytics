import * as credManager from './credManager.js';
import * as spotifyRequests from './spotifyRequests.js'
import * as dbManage from './dbManage.js'
async function main() {
    // dbManage.consolidateArtists()

    await dbManage.artistCollect()
    await spotifyRequests.overWriteArtists()
    dbManage.read()
    // x.then(dbManage.read(),false)
    // dbManage.read()
    // (dbManage.artistCollect()).then(dbManage.read(), false)
    // console.log(typeof (test))
    // console.log((test))
    // test.then(dbManage.read())
    // dbManage.read()
    // .then(spotifyRequests.overWriteArtists())
    // .then(dbManage.consolidateArtists)
    // .then(spotifyRequests.bulkArtistTopTrack())
    // .then(dbManage.consolidateTopTracks())
}

main()