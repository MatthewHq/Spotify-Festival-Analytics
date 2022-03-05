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
        fs.readdir('./searchQueryBank', (err, files) => {
            if (err) {
                reject(new Error(('Cannot Read Dir: ' + err)));
            }
            files.forEach(async (file) => {
                let artistQuery = fs.readFileSync('./searchQueryBank/' + file, 'utf8')
                artistQuery = JSON.parse(artistQuery)

                if (artistQuery.artists.items.length != 0) {
                    let check = await checkForJSON(file, './artistDB')
                    if (!check) {
                        fs.writeFile('./artistDB/' + file, JSON.stringify(artistQuery.artists.items[0]), (err) => {
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




