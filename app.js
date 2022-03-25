import * as credManager from './credManager.js';
import * as spotifyRequests from './spotifyRequests.js'
import * as dbManage from './dbManage.js'
import * as userSpotifyRequests from './userSpotifyRequests.js'
import * as userDbManage from './userDbManage.js'


async function main() {
    //MAIN PROCEDURE HERE ++++++++++++++++

    let festivalTitle = "beyond2022"
    // await clientTokenCreds()
    // setTimeout(async () => {
    // dbManage.iniFestival(festivalTitle)
    // await spotifyRequests.bulkArtistCache(festivalTitle)
    // await dbManage.artistCollect(festivalTitle)
    // await spotifyRequests.overWriteArtists(festivalTitle)
    // await spotifyRequests.bulkArtistTopTrack(festivalTitle)
    // await spotifyRequests.getAllTrackAudioFeatures(festivalTitle)
    // await dbManage.consolidateTopTracks(festivalTitle)
    // await dbManage.consolidateArtists(festivalTitle)
    // await dbManage.allArtistsToCSVcustom(festivalTitle)
    // await dbManage.allTracksToCSVcustom(festivalTitle)
    // }, 2000);
    // END MAIN PROCEDURE HERE ++++++++++++++++++




    //USER PROCEDURE HERE ++++++++++++++++++
    // userAccessTokenCreds()
    // userRefreshTokenCreds()

    setTimeout(async () => {
        // let playlistCreateResult = await userSpotifyRequests.createPlaylist("MY CODED PLAYLIST", false, false, "THIS IS MY PLAYLIST mADE WITH MY CODE")
        // console.log(playlistCreateResult)


        // let lineByLineToJSON = await userDbManage.lineByLineToJSON('./mainDB/userData/playlistTracks.txt')

        await userSpotifyRequests.bulkToPlaylistAdd()

    }, 2000);
    //END USER PROCEDURE HERE ++++++++++++++++++





}

async function clientTokenCreds() {
    credManager.readDat("clientToken", null)
    setTimeout(() => {
        credManager.supplyTokenData("clientToken", './mainDB/tempClientToken.json')
    }, 1000);
}


async function userAccessTokenCreds() {
    credManager.readDat("userAccessToken", null)
    setTimeout(() => {
        credManager.userAuth()
    }, 1000);
}

async function userRefreshTokenCreds() {
    credManager.readDat("userRefreshToken", null)
    setTimeout(() => {
        credManager.supplyTokenData('userRefreshToken', 'mainDB/tempUserRefreshToken.json')
    }, 1000);
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


