import * as https from 'https'
import * as credManager from './credManager.js'
import * as fs from 'fs'
import * as dbManage from './dbManage.js'

export async function bulkArtistCache(){
    return new Promise(async (resolve,reject)=>{
        
        await credManager.supplyTokenData()
        setTimeout(async() => {
            let lineup = fs.readFileSync('artists.json', 'utf8')
            lineup = JSON.parse(lineup)
            lineup.artists.forEach(async (artist) => {
                console.log(artist)
                let check= await dbManage.dbCheckQuery(artist)
                if(!check){
                    var search=await searchArtist(artist)
                    fs.writeFile('./searchQueryBank/'+artist+".json", search,  (err)=> {
                    if (err) reject(err) ;
                    console.log('File is created successfully.');
                });
                }
            });
        resolve("true")
        
        }, 2000);
        

        
        

    })
}


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
        qString = qString.split(' ').join('%20');
        console.log(qString)

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

