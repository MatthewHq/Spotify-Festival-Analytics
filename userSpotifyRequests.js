import * as https from 'https'
import * as credManager from './credManager.js'
import * as fs from 'fs'
import * as dbManage from './dbManage.js'
import * as spotifyRequests from './spotifyRequests.js'


//term -  long_term || medium_term || short_term
//type - artists || tracks
export async function getUserTopItems(type, term) {
    return new Promise(async (resolve, reject) => {
        try {
            var tkd = await credManager.supplyTokenData('userRefreshToken', 'mainDB/tempUserRefreshToken.json')
        } catch {
            reject(new Error("supplyTokenData in searchArtist Error"))
        }

        var body = {
            limit: 50,
            offset: 0,
            time_range: term
        }
        var qString = "?" + Object.keys(body).map(key => key + '=' + body[key]).join('&');
        qString = qString.split(' ').join('%20');
        console.log(qString)

        const options = {
            hostname: 'api.spotify.com',
            port: 443,
            path: '/v1/me/top/' + type + qString,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tkd.access_token,
                'Content-Type': 'application/json',
            }
        }

        console.log(options)

        let results = await spotifyRequests.generalGet(options)
        dbManage.promiseWriteFile('./mainDB/userData/topItems.json', results)


        resolve(results)
    })
}

export async function getUserProfile() {
    return new Promise(async (resolve, reject) => {
        try {
            var tkd = await credManager.supplyTokenData('userRefreshToken', 'mainDB/tempUserRefreshToken.json')
        } catch {
            reject(new Error("supplyTokenData in searchArtist Error"))
        }

        // var body = {
        //     limit: 50,
        //     offset: 0,
        //     time_range: term
        // }
        // var qString = "?" + Object.keys(body).map(key => key + '=' + body[key]).join('&');
        // qString = qString.split(' ').join('%20');
        // console.log(qString)

        const options = {
            hostname: 'api.spotify.com',
            port: 443,
            path: '/v1/me',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tkd.access_token,
                'Content-Type': 'application/json',
            }
        }

        console.log(options)

        let results = await spotifyRequests.generalGet(options)
        dbManage.promiseWriteFile('./mainDB/userData/profile.json', results)


        resolve(results)
    })
}

export async function createPlaylist(name, isPublic, collaborative, description) {
    return new Promise(async (resolve, reject) => {
        var creds = credManager.readDat("creds", null)
        var client_id = creds.client_id; // Your client id
        var client_secret = creds.client_secret; // Your secret


        try {
            var tkd = await credManager.supplyTokenData('userRefreshToken', 'mainDB/tempUserRefreshToken.json')
        } catch {
            reject(new Error("supplyTokenData in searchArtist Error"))
        }

        const userProfile = JSON.parse(fs.readFileSync('./mainDB/userData/profile.json', 'utf8'))
        console.log(userProfile.id)

        var body = {
            name: name,
            public: isPublic,
            collaborative: collaborative,
            description: description
        }
        var options = {
            host: 'api.spotify.com',
            port: 443,
            method: 'POST',
            path: '/v1/users/' + userProfile.id + '/playlists',
            headers: {
                'Authorization': 'Bearer ' + tkd.access_token,
                'Content-Type': 'application/json',
            }
        };

        // var qString = Object.keys(body).map(key => key + '=' + body[key]).join('&');

        
        resolve(spotifyRequests.generalPost(options, JSON.stringify(body)))
    })
}