// const cr= require('./credManager.js')
// cr.readToken()
import * as credManager from './credManager.js';
import * as spotifyRequests from './spotifyRequests.js'
import * as dbManage from './dbManage.js'
async function main() {
    // credManager.readDat("token")
    // let credToken = await credManager.supplyTokenData()
    // console.log(credToken.access_token + "| async")
    // var aSearch = await spotifyRequests.searchArtist("fisher")
    // console.log(aSearch)
    // let check= await dbManage.dbCheckQuery("a")
    // console.log(check)

    spotifyRequests.bulkArtistCache()
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


