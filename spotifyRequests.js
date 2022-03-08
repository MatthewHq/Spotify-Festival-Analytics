import * as https from 'https'
import * as credManager from './credManager.js'
import * as fs from 'fs'
import * as dbManage from './dbManage.js'


//gets the a bulk of artists from artists.json and caches them into searchQueryBank dir
export async function bulkArtistCache() {
    return new Promise(async (resolve, reject) => {

        await credManager.supplyTokenData()
        setTimeout(async () => {
            let lineup = fs.readFileSync('mainDB/artists.json', 'utf8')
            lineup = JSON.parse(lineup)
            lineup.artists.forEach(async (artist) => {
                console.log(artist)
                let check = await dbManage.checkForJSON(artist, './searchQueryBank')
                if (!check) {
                    var search = await searchArtist(artist)
                    fs.writeFile('./searchQueryBank/' + artist + ".json", search, (err) => {
                        if (err) reject(err);
                        console.log('File is created successfully.');
                    });
                }
            });
            resolve("true")
        }, 2000);
    })
}


//takes the top tracks from each artist and adds them to topTracksDB
export async function bulkArtistTopTrack() {
    return new Promise(async (resolve, reject) => {
        await credManager.supplyTokenData()
        setTimeout(async () => {
            let artistsPath = './artistDB'
            let topTracksDBPath = './topTracksDB'
            fs.readdir(artistsPath, (err, files) => {
                if (err) {
                    reject(new Error(('Cannot Read Dir: ' + err)));
                }
                files.forEach(async (file) => {
                    let artist = fs.readFileSync(artistsPath + "/" + file, 'utf8')
                    artist = JSON.parse(artist)

                    // if (artistQuery.artists.items.length != 0) {
                    let check = await dbManage.checkForJSON(file, topTracksDBPath)
                    if (!check) {
                        let topTracks = await getTopTracks(artist.id)
                        fs.writeFile(topTracksDBPath + "/" + file, topTracks, (err) => {
                            if (err) reject(err);
                            console.log('File is created ' + topTracksDBPath + "/" + file);
                        });
                    }
                    // } else {
                    //     console.log("DID NOT FIND DATA FOR " + file)
                    // }
                    // break //debug

                });

            });

        }, 2000);
        resolve(true)
    })
}


//general format structure for a get call to spotify API
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

//spotify api call for searching an artist
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



//spotify api call for searching an artist's top tracks
export async function getTopTracks(artistId) {
    return new Promise(async (resolve, reject) => {
        try {
            var tkd = await credManager.supplyTokenData()
        } catch {
            reject(new Error("supplyTokenData in searchArtist Error"))
        }

        var body = {
            // id: artistId,
            market: 'US'
        }
        var qString = "?" + Object.keys(body).map(key => key + '=' + body[key]).join('&');
        qString = qString.split(' ').join('%20');
        console.log(qString)

        const options = {
            hostname: 'api.spotify.com',
            port: 443,
            path: '/v1/artists/' + artistId + '/top-tracks' + qString,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tkd.access_token,
                'Content-Type': 'application/json',
            }
        }

        resolve(await generalGet(options))
    })
}

//getting multiple tracks spotify api call limit of 100 tracks
export async function getMultiTrackAudioFeatures(allIds) {
    return new Promise(async (resolve, reject) => {
        try {
            var tkd = await credManager.supplyTokenData()
        } catch {
            reject(new Error("supplyTokenData in searchArtist Error"))
        }

        var body = {
            ids: allIds,
        }
        var qString = "?" + Object.keys(body).map(key => key + '=' + body[key]).join('&');
        // console.log(qString)

        const options = {
            hostname: 'api.spotify.com',
            port: 443,
            path: '/v1/audio-features' + qString,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tkd.access_token,
                'Content-Type': 'application/json',
            }
        }
        let getDat = await generalGet(options)
        console.log("| " + getDat + " |")
        resolve(getDat)
    })
}

//will call getMultiTrackAudioFeatures(allIds) every 100 tracks from the toptracks database
//gathered from consolidateTopTracks()
export async function getAllTrackAudioFeatures() {
    return new Promise(async (resolve, reject) => {

        try {
            await credManager.supplyTokenData()
        } catch {
            reject(new Error("supplyTokenData in searchArtist Error"))
        }

        setTimeout(async () => {
            let allTracks = await dbManage.consolidateTopTracks()
            // console.log(allTracks)
            let allIds = ""
            let batchCount = 0 //100s
            let batchCounter = 0 //1s
            for (let i = 0; i < allTracks.tracks.length; i++) {
                allIds += "," + allTracks.tracks[i].track.id
                batchCounter++
                if (batchCounter == 100) {
                    allIds = allIds.substring(1, allIds.length)
                    let multiTrackArray = await getMultiTrackAudioFeatures(allIds)
                    multiTrackArray = JSON.parse(multiTrackArray)
                    // console.log(JSON.stringify(multiTrackArray))
                    console.log("batch of 100 number" + batchCount)
                    for (let j = 0; j < batchCounter; j++) {
                        allTracks.tracks[j + batchCount * 100].audio_features =
                            multiTrackArray.audio_features[j * batchCount * 100]
                    }
                    batchCount++;
                    allIds = ""
                    batchCounter = 0 //1s

                }
            }
            allIds = allIds.substring(1, allIds.length)
            let multiTrackArray = await getMultiTrackAudioFeatures(allIds)
            multiTrackArray = JSON.parse(multiTrackArray)
            console.log("final batch of " + batchCounter)
            for (let j = 0; j < batchCounter; j++) {
                allTracks.tracks[j + batchCount * 100].audio_features =
                    multiTrackArray.audio_features[j * batchCount * 100]
            }
            // allTracks.tracks.forEach(async (element) => {
            //     allIds += "," + element.track.id
            // });





            fs.writeFile("mainDB/topTracksData.json", JSON.stringify(allTracks), (err) => {
                if (err) reject(err);
                // console.log('File is created ' + file);
            });
        }, 2000);
        resolve(true)

    })
}