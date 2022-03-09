import * as fs from 'fs'


//initialize db dirs for festival
export function iniFestival(festivalTitle) {

    var dirs = ['mainDB', "artistDB", "topTracksDB", "searchQueryBank"]

    dirs.forEach(dir => {
        dir = festivalTitle + '/' + dir
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

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
export async function artistCollect(festivalTitle) {
    return new Promise(async (resolve, reject) => {
        let promises = []
        console.log("ASYNC CHECKPOINT ARTISTCOLLECT")
        let searchQBPath = './' + festivalTitle + '/searchQueryBank'
        let artistDBPath = './' + festivalTitle + '/artistDB/'



        // fs.readdir(searchQBPath, async (err, files) => {
        // });

        try { var files = await promiseReadDir(searchQBPath) } catch (err) {
            reject(err)
        }
        console.log("FILES " + files)
        for (let i = 0; i < files.length; i++) {
            // console.log("ASYNC CHECKPOINT INNER FOR LOOP ARTISTCOLLECT")
            let artistQuery = fs.readFileSync(searchQBPath + '/' + files[i], 'utf8')
            artistQuery = JSON.parse(artistQuery)

            if (artistQuery.artists.items.length != 0) {
                let check = await checkForJSON(files[i], artistDBPath)
                if (!check) {
                    let index = -1
                    let popularity = 0
                    let compare = 9001
                    for (let j = 0; j < artistQuery.artists.items.length; j++) {
                        let compareVal = comprStrs(files[i].substring(0, files[i].length - 5), artistQuery.artists.items[j].name)
                        if (compareVal < compare) {
                            index = j
                            popularity = artistQuery.artists.items[j].popularity
                            compare = compareVal
                            // console.log("BETTER DATA | " + file.substring(0, file.length - 5) + " | -- |" + artistQuery.artists.items[index].name + " | with a dif of " + compare)
                        } else if (compareVal == compare) {
                            if (artistQuery.artists.items[j].popularity > popularity) {
                                console.log("***SAME DATA | " + files[i].substring(0, files[i].length - 5) + "|" + " pop (" + popularity + ") -- |" + artistQuery.artists.items[index].name + "|" +
                                    " pop(" + artistQuery.artists.items[j].popularity + ") with a dif of " + compare)
                                index = j
                                popularity = artistQuery.artists.items[j].popularity
                                compare = compareVal

                            }
                        }
                    }
                    if (compare < 100) {
                        promises.push(promiseWriteFile(artistDBPath + files[i], JSON.stringify(artistQuery.artists.items[index])))
                        // console.log(promises)
                        // console.log("promises^")
                    } else {
                        console.log("DID NOT FIND CORRECT DATA FOR | " + files[i] + " | closest is |" + artistQuery.artists.items[index].name + " | with a dif of " + compare)
                    }
                }
            } else {
                console.log("DID NOT FIND DATA FOR " + files[i])
            }

        }



        let nP = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
                reject(false)
            }, 2000);
        })

        promises.push(nP)

        console.log(promises)
        console.log("promisesFINAL^")
        await Promise.all(promises)
        resolve(true)

    })
}

//collects all topTracks with artist info embedded into each track
//redundant data on purpose as these are small batches
export async function consolidateTopTracks(festivalTitle) {
    return new Promise((resolve, reject) => {
        let topTracksDBPath = './' + festivalTitle + '/topTracksDB/'
        let artistDBPath = './' + festivalTitle + '/artistDB/'
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
export async function consolidateArtists(festivalTitle) {
    return new Promise((resolve, reject) => {
        let artistDBPath = './' + festivalTitle + '/artistDB'
        fs.readdir(artistDBPath, async (err, files) => {
            let allArtists = { "artists": [] }

            console.log(files)

            if (err) {
                reject(new Error(('Cannot Read Dir: ' + err)));
            }

            for (let i = 0; i < files.length; i++) {
                let artistData = fs.readFileSync(artistDBPath + '/' + files[i], 'utf8')
                console.log(files[i] + " a")
                artistData = JSON.parse(artistData)
                console.log(files[i])
                allArtists.artists[i] = artistData
                console.log(files[i])
            }
            resolve(await promiseWriteFile(festivalTitle + "/mainDB/allArtistsData.json", JSON.stringify(allArtists)))
        });
    })

}

//takes the 'allArtistsData.json' from consolidateArtists() and organizes it into a csv extracting only some of the information
export async function allArtistsToCSVcustom(festivalTitle) {
    return new Promise(async (resolve, reject) => {
        let allArtistsPath = festivalTitle + '/mainDB/allArtistsData.json'
        let allArtists = fs.readFileSync(allArtistsPath, 'utf8')
        allArtists = JSON.parse(allArtists)
        let data = []

        console.log(allArtists.artists.length)

        for (let i = 0; i < allArtists.artists.length; i++) {
            let artistObj = {}
            artistObj.name = allArtists.artists[i].name.replace(/,/g, "")
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
            } else {
                artistObj.image = "notAvailable"
            }
            console.log(JSON.stringify(artistObj))
            data[i] = artistObj

        }

        console.log(data)
        let datCSV = arrToCSV(data)
        resolve(await promiseWriteFile(festivalTitle + "/mainDB/allArtists.CSV", datCSV))
    })
}

export async function allTracksToCSVcustom(festivalTitle) {
    return new Promise(async (resolve, reject) => {
        let topTracksPath = festivalTitle + '/mainDB/topTracksData.json'
        let topTracks = fs.readFileSync(topTracksPath, 'utf8')
        topTracks = JSON.parse(topTracks)
        let data = []

        for (let i = 0; i < topTracks.tracks.length; i++) {
            let currTrack = topTracks.tracks[i]

            let trackObj = {}
            trackObj.name = currTrack.track.name.replace(/,/g, "")
            console.log(trackObj.name + " " + i)
            trackObj.artist = currTrack.artist.name.replace(/,/g, "")
            trackObj.artistPopularity = currTrack.artist.popularity
            trackObj.artistFollowers = currTrack.artist.followers.total
            trackObj.popularity = currTrack.track.popularity



            trackObj.topTrackOrder = currTrack.topTrackOrder


            if (currTrack.audio_features != null) {
                trackObj.danceability = currTrack.audio_features.danceability
                trackObj.energy = currTrack.audio_features.energy
                trackObj.speechiness = currTrack.audio_features.speechiness
            } else {
                trackObj.danceability = "nan"
                trackObj.energy = "nan"
                trackObj.speechiness = "nan"
            }

            if (currTrack.track.external_urls != null) {
                trackObj.trackURL = currTrack.track.external_urls.spotify
            } else {
                trackObj.trackURL = "nan"
            }

            if (currTrack.track.preview_url != null) {
                trackObj.trackPrev = currTrack.track.preview_url
            } else {
                trackObj.trackPrev = "nan"
            }


            if (currTrack.artist.external_urls != null) {
                trackObj.artistURL = currTrack.artist.external_urls.spotify
            } else {
                trackObj.artistURL = "nan"
            }

            if (currTrack.artist.images.length > 0) {
                trackObj.image = currTrack.artist.images[0].url
            } else {
                trackObj.image = "nan"
            }

            console.log(trackObj)
            data[i] = trackObj

        }

        console.log(data)
        let datCSV = arrToCSV(data)
        resolve(await promiseWriteFile(festivalTitle + "/mainDB/allTopTracks.CSV", datCSV))
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

//async writefile wrapped in a promise
export async function promiseWriteFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(true)
            }

        })
    })

}



export async function promiseReadDir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) reject(new Error(('Cannot Read Dir: ' + err)));
            else resolve(files)
        })
    })

}



