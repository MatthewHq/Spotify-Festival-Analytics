import * as https from 'https'
import * as credManager from './credManager.js'

export async function generalGet(options) {
    return new Promise((resolve, reject) => {
        var req = https.request(options, function (res) {
            var result = '';
            res.on('data', function (chunk) {
                result += chunk;
            });
            res.on('end', function () {
                // console.log(result);
                resolve(result)
            });
            res.on('error', function (err) {
                console.log(err);
                reject(err)
            })
        });
        // req error
        req.on('error', function (err) {
            console.log(err);
            reject(err)
        });
        // req.write(qString)
        req.end();
    })

}


export async function searchArtist(search) {
    return new Promise(async (resolve, reject) => {
        try {
            var tkd = await credManager.supplyTokenData()
        } catch {
            reject(new Error("supplyTokenData in searchArtist Error"))
        }
        var body = {
            q: search,
            type: ["artist"],
            market: 'US',
            limit: 20,
            offset: 0
            // include_external: 'true',
        }
        var qString = "?" + Object.keys(body).map(key => key + '=' + body[key]).join('&');
        qString = qString.replace(" ", "%20")

        const options = {
            hostname: 'api.spotify.com',
            port: 443,
            path: '/v1/search' + qString,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tkd.access_token,
                'Content-Type': 'application/json',
            }
        }
        resolve(await generalGet(options))
    })
}

