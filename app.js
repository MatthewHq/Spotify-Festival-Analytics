// const cr= require('./credManager.js')
// cr.readToken()
import * as credManager from './credManager.js';
import * as spotifyRequests from './spotifyRequests.js'
import * as dbManage from './dbManage.js'
async function main() {
    //MAIN PROCEDURE HERE ++++++++++++++++
    credManager.readDat("token")
    setTimeout(() => {
        credManager.supplyTokenData()
    }, 1000);

    setTimeout(async () => {
        await spotifyRequests.bulkArtistCache()
        await dbManage.artistCollect()
        await spotifyRequests.overWriteArtists()
        await spotifyRequests.bulkArtistTopTrack()
        await spotifyRequests.getAllTrackAudioFeatures()
        await dbManage.consolidateTopTracks()
        await dbManage.consolidateArtists()
        await dbManage.allArtistsToCSVcustom()
        await dbManage.allTracksToCSVcustom()

    }, 2000);

    //MAIN PROCEDURE HERE ++++++++++++++++++





    // let artist = await spotifyRequests.getArtist("3NYySx3H1V7zHemD9hmsQv")
    // console.log(artist)

    // await spotifyRequests.overWriteArtists()



    // let topTracks = await spotifyRequests.getTopTracks('12Zk1DFhCbHY6v3xep2ZjI')
    // console.log(topTracks)

    // 

    // dbManage.consolidateTopTracks()

    // let audioFeatues = await spotifyRequests.getMultiTrackAudioFeatures('0PoMoPqIJxe6H0rDMnpGP8,5i5fCpsnqDJ9AfeObgd0gW')
    // console.log(audioFeatues)

    // await spotifyRequests.getAllTrackAudioFeatures()
    // await dbManage.consolidateArtists()

    // await dbManage.allArtistsToCSVcustom()
}
main()


// let credToken=credManager.getCredToken()
// credToken.then((credTokenData)=>{
//     console.log(credTokenData.access_token+"| async")
// })


// console.log(credToken)
// let credsType = credManager.readDat("creds")
// let test = credManager.readDat("token")
// console.log("tokentype " + test + "aa")
// console.log("tokentype element " + test.access_token + "aa")
// console.log("credstype " + credsType + "aa")
// console.log("credstype element " + credsType.client_id + "aa")


