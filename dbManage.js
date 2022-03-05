import * as fs from 'fs'


export async function checkForJSON(query, path) {
    return new Promise(async (resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(new Error(('Cannot Read Dir: ' + err)));
            }
            files.forEach((file) => {
                if (query == file.substring(0, file.length - 5)) {
                    resolve(true)
                }
            });
            resolve(false)
        });
    })
}



export async function artistCollect() {
    return new Promise(async (resolve, reject) => {
        let searchQBPath = './searchQueryBank'
        let artistDBPath = './artistDB/'
        fs.readdir(searchQBPath, (err, files) => {
            if (err) {
                reject(new Error(('Cannot Read Dir: ' + err)));
            }
            files.forEach(async (file) => {
                let artistQuery = fs.readFileSync(searchQBPath + '/' + file, 'utf8')
                artistQuery = JSON.parse(artistQuery)

                if (artistQuery.artists.items.length != 0) {
                    let check = await checkForJSON(file, artistDBPath)
                    if (!check) {
                        fs.writeFile(artistDBPath + file, JSON.stringify(artistQuery.artists.items[0]), (err) => {
                            if (err) reject(err);
                            console.log('File is created ' + file);
                        });
                    }
                } else {
                    console.log("DID NOT FIND DATA FOR " + file)
                }


            });
            resolve(true)

        });

    })
}

export async function consolidateTopTracks() {
    return new Promise((resolve, reject) => {
        let topTracksDBPath = './topTracksDB/'
        let artistDBPath = './artistDB/'
        fs.readdir(topTracksDBPath, (err, files) => {
            let allTracks = { "tracks": [] }

            if (err) {
                reject(new Error(('Cannot Read Dir: ' + err)));
            }
            files.forEach(async (file) => {
                let artistTopTracks = fs.readFileSync(topTracksDBPath + '/' + file, 'utf8')
                artistTopTracks = JSON.parse(artistTopTracks)

                let artist = fs.readFileSync(artistDBPath + '/' + file, 'utf8')
                artist = JSON.parse(artist)

                artistTopTracks.tracks.forEach(track => {
                    let topTrack = {}
                    topTrack.track = track
                    topTrack.artist = artist
                    allTracks.tracks[allTracks.tracks.length] = topTrack
                });



                // let check = await checkForJSON(file, artistDBPath)
                // if (!check) {

                // fs.writeFile(artistDBPath + file, JSON.stringify(artistQuery.artists.items[0]), (err) => {
                //     if (err) reject(err);
                //     console.log('File is created ' + file);
                // });


                // }
            });
            // console.log(JSON.stringify(allTracks))
            resolve(allTracks)

        });
    })

}



