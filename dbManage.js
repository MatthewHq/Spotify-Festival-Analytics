import * as fs from 'fs'

//check if a JSON file is in existance and return if it is or not
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


//collects all artists from the querybank, each artist is selected from the top result
//this process may be changed later as there were issues with less popular artists being picked up
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
                        let index = -1
                        let popularity = 0
                        let compare = 9001
                        for (let i = 0; i < artistQuery.artists.items.length; i++) {
                            let compareVal = comprStrs(file.substring(0, file.length - 5), artistQuery.artists.items[i].name)
                            if (compareVal < compare) {
                                index = i
                                popularity = artistQuery.artists.items[i].popularity
                                compare = compareVal
                                // console.log("BETTER DATA | " + file.substring(0, file.length - 5) + " | -- |" + artistQuery.artists.items[index].name + " | with a dif of " + compare)
                            } else if (compareVal == compare) {
                                if (artistQuery.artists.items[i].popularity > popularity) {
                                    console.log("***SAME DATA | " + file.substring(0, file.length - 5) + "|" + " pop (" + popularity + ") -- |" + artistQuery.artists.items[index].name + "|" +
                                        " pop(" + artistQuery.artists.items[i].popularity + ") with a dif of " + compare)
                                    index = i
                                    popularity = artistQuery.artists.items[i].popularity
                                    compare = compareVal

                                }
                            }
                        }
                        if (compare < 100) {
                            fs.writeFile(artistDBPath + file, JSON.stringify(artistQuery.artists.items[0]), (err) => {
                                if (err) reject(err);
                                // console.log('File is created ' + file);
                            });
                        } else {
                            console.log("DID NOT FIND CORRECT DATA FOR | " + file + " | closest is |" + artistQuery.artists.items[index].name + " | with a dif of " + compare)
                        }
                    }
                } else {
                    console.log("DID NOT FIND DATA FOR " + file)
                }


            });
            resolve(true)

        });

    })
}

//collects all topTracks with artist info embedded into each track
//redundant data on purpose as these are small batches
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
                let topTrackOrder = 1
                let artistTopTracks = fs.readFileSync(topTracksDBPath + '/' + file, 'utf8')
                artistTopTracks = JSON.parse(artistTopTracks)

                let artist = fs.readFileSync(artistDBPath + '/' + file, 'utf8')
                artist = JSON.parse(artist)

                artistTopTracks.tracks.forEach(track => {
                    let topTrack = {}
                    topTrack.track = track
                    topTrack.artist = artist
                    topTrack.topTrackOrder = topTrackOrder
                    topTrackOrder++
                    allTracks.tracks[allTracks.tracks.length] = topTrack
                });

            });
            resolve(allTracks)

        });
    })

}


//puts all the artists in artistDB into a json file
export async function consolidateArtists() {
    return new Promise((resolve, reject) => {
        let artistDBPath = './artistDB/'
        fs.readdir(artistDBPath, (err, files) => {
            let allArtists = { "artists": [] }

            if (err) {
                reject(new Error(('Cannot Read Dir: ' + err)));
            }

            files.forEach(async (file) => {

            });

            for (let i = 0; i < files.length; i++) {
                let artistData = fs.readFileSync(artistDBPath + '/' + files[i], 'utf8')
                artistData = JSON.parse(artistData)
                allArtists.artists[i] = artistData
            }
            fs.writeFile("mainDB/allArtistsData.json", JSON.stringify(allArtists), (err) => {
                if (err) reject(err);
            });
            resolve(true)

        });
    })

}

//takes the 'allArtistsData.json' from consolidateArtists() and organizes it into a csv extracting only some of the information
export async function allArtistsToCSVcustom() {
    return new Promise(async (resolve, reject) => {
        let allArtistsPath = 'mainDB/allArtistsData.json'
        let allArtists = fs.readFileSync(allArtistsPath, 'utf8')
        allArtists = JSON.parse(allArtists)
        let data = []

        console.log(allArtists.artists.length)

        for (let i = 0; i < allArtists.artists.length; i++) {
            let artistObj = {}
            artistObj.name = allArtists.artists[i].name
            artistObj.followers = allArtists.artists[i].followers.total
            artistObj.popularity = allArtists.artists[i].popularity


            let aGenreString = ""
            allArtists.artists[i].genres.forEach(genre => {
                aGenreString += '| ' + genre
            });
            aGenreString = aGenreString.substring(2, aGenreString.length)
            artistObj.genres = aGenreString



            artistObj.uri = allArtists.artists[i].uri
            artistObj.url = allArtists.artists[i].external_urls.spotify
            if (allArtists.artists[i].images.length > 0) {
                artistObj.image = allArtists.artists[i].images[0].url
            }
            console.log(JSON.stringify(artistObj))
            data[i] = artistObj

        }

        console.log(data)
        let datCSV = arrToCSV(data)
        fs.writeFile("mainDB/allArtists.CSV", datCSV, (err) => {
            if (err) reject(err);
            console.log('File is created : mainDB/allArtists.CSV');
        });
        resolve(true)
    })
}

//makes an array of json data into a CSV
function arrToCSV(data) {
    let csv = data.map(row => Object.values(row));
    csv.unshift(Object.keys(data[0]));
    return `"${csv.join('"\n"').replace(/,/g, '","')}"`;
}

//compares two strings by adding up their UTF8 values and returning the dif
//aimed at differences in names based on spotify search results
//ignores spaces
export function comprStrs(str1, str2) {
    let strEnc1 = Buffer.from(str1, 'utf-8');
    let strEnc2 = Buffer.from(str2, 'utf-8');
    let val1 = cmprStrLoop(strEnc1)
    let val2 = cmprStrLoop(strEnc2)
    return (Math.abs(val1 - val2))
}

//for loop section of the compareStrs method, called twice per compareStrs call
export function cmprStrLoop(arr) {
    let total = 0
    arr.forEach(charVal => {
        if (charVal != 32) {
            total += charVal
        }
    });
    return total
}



