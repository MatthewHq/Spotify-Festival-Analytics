import * as fs from 'fs';
import * as https from 'https'



export async function supplyTokenData() {
    return new Promise((resolve, reject) => {
        console.log("ASYNC CHECKPOINT supplyTokenData")
        let tokenData = readDat("token",null)
        // console.log(tokenData.expires_at + " vs \n" + (Math.floor(Date.now() / 1000)))
        // console.log('expires in ' + (tokenData.expires_at - Math.floor(Date.now() / 1000)))
        if (tokenData.expires_at < Math.floor(Date.now() / 1000)) {
            console.log("token expired, fetching new one...")
            resolve(getCredToken())
        } else {
            // console.log("token not expired yet")
            resolve(tokenData)
        }
        reject(false)
    })

}


export async function getCredToken() {

    var creds = readDat("creds")
    var client_id = creds.client_id; // Your client id
    var client_secret = creds.client_secret; // Your secret
    var body = {
        grant_type: 'client_credentials'
    }

    // var qString = Object.keys(body).map(key => key + '=' + body[key]).join('&');

    // request option
    var options = {
        host: 'accounts.spotify.com',
        port: 443,
        method: 'POST',
        path: '/api/token',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'), //Fixing Deprication,
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': qString.length
        }
    };

    var qString = Object.keys(body).map(key => key + '=' + body[key]).join('&');

    // request object

    return new Promise((resolve, reject) => {
        var req = https.request(options, function (res) {
            var tokenPath = './mainDB/tempToken.json'
            var result = '';
            res.on('data', function (chunk) {
                result += chunk;
            });
            res.on('end', function () {
                console.log(JSON.parse(result))

                let tokenData = fs.readFileSync(tokenPath, 'utf8')
                tokenData = JSON.parse(tokenData)

                // console.log("TD" + tokenData + "\n" + JSON.stringify(tokenData))
                // console.log("TD" + result + "\n" + JSON.stringify(result))
                result = JSON.parse(result)
                tokenData.access_token = result.access_token
                tokenData.token_type = result.token_type
                tokenData.expires_in = result.expires_in
                tokenData.expires_at = Math.floor(Date.now() / 1000) + result.expires_in - 1


                fs.writeFile(tokenPath, JSON.stringify(tokenData), function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                });
                resolve(tokenData)
            });
            res.on('error', function (err) {
                console.log(err + "| raw print"); //keeping these around just incase because i'm new to implementing async
                reject(err)
            })
        });

        // req error
        req.on('error', function (err) {
            console.log(err + "| raw print");//keeping these around just incase because i'm new to implementing async
            reject(err)
        });
        //send request witht the postData form
        req.write(qString);
        req.end();
    })


};




export function readDat(type, optionalPath) {
    var path
    if (optionalPath == null) {


        const tempTokenPath = 'mainDB/tempToken.json'
        const credPath = 'mainDB/credentials.json'

        if (type == "token") {
            path = tempTokenPath
        } else if (type == "creds") {
            path = credPath
        }
    } else[
        path =optionalPath
    ]
    //check for token file existence
    var exists = false
    try {
        if (fs.existsSync(path)) {
            exists = true
        }
    } catch (err) {
        console.error(err)
    }

    //if exists read it, else CREATE and write to it
    if (exists) {
        try {
            const data = fs.readFileSync(path, 'utf8')
            return JSON.parse(data)

        } catch (err) {
            console.error(err)
        }

    } else {
        var body
        const tempTokenTemplate = {
            "access_token": null,
            "token_type": null,
            "expires_in": null,
            "expires_at": null
        }
        const credTemplate = {
            "client_secret": null,
            "client_id": null,
        }

        if (type == "token") {
            body = tempTokenTemplate
        } else if (type == "creds") {
            body = credTemplate
        }

        fs.writeFile(path, JSON.stringify(body), function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });

    }
}
