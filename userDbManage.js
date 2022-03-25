import * as fs from 'fs'
import * as dbManage from './dbManage.js'
import * as readline from 'readline'
import * as events from 'events'


//from source: https://geshan.com.np/blog/2021/10/nodejs-read-file-line-by-line/
//edited for more specific function
export async function lineByLineToJSON(path) {
    return new Promise(async (resolve, reject) => {
        let uriArrayObj = {}
        uriArrayObj.doubleUriArray = []
        uriArrayObj.doubleUriArray.push({ uris: [] })
        let trackCounter = 0
        let batchCounter = 0


        try {
            const rl = readline.createInterface({
                input: fs.createReadStream(path),
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                if (trackCounter == 100) {
                    uriArrayObj.doubleUriArray.push({ uris: [] })
                    batchCounter++
                    trackCounter=0
                }
                uriArrayObj.doubleUriArray[batchCounter].uris.push(line)
                trackCounter++
                // console.log(`Line from file: ${line}`);
            });

            await events.once(rl, 'close');

            console.log(uriArrayObj)
            resolve(uriArrayObj)
        } catch (err) {
            console.error(err);
            reject(err)
        }
    })



}


