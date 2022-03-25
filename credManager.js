import * as fs from 'fs';
import * as https from 'https'
import express from "express";



export async function supplyTokenData(tokenType, tokenPath) {
    return new Promise((resolve, reject) => {
        console.log("ASYNC CHECKPOINT supplyTokenData")
        let tokenData = readDat(tokenType, null)
        // console.log(tokenData.expires_at + " vs \n" + (Math.floor(Date.now() / 1000)))
        // console.log('expires in ' + (tokenData.expires_at - Math.floor(Date.now() / 1000)))
        if (tokenData.expires_at < Math.floor(Date.now() / 1000)) {
            console.log("token expired, fetching new one...")
            if (tokenType == "clientToken") {
                resolve(getClientCredToken(tokenPath))
            } else if (tokenType == "userRefreshToken") {
                console.log("NOTE: USER REFRESH TOKEN REFRESHER DOES NOT TAKE INTO ACCOUNT WHEN USER ACESS TOKEN IS REFRESHED AND NEEDS A MANUAL DELETION OF TEMPUSERREFRESTOKEN.JSON")
                resolve(getTempUserRefreshToken(tokenPath))
            }
        } else {
            // console.log("token not expired yet")
            resolve(tokenData)
        }
        reject(false)
    })

}


export function getClientCredToken(tokenPath) {

    var creds = readDat("creds".null)
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

    return generalTokenRequest("clientToken", tokenPath, options, qString)


};

export function getTempUserRefreshToken(tokenPath) {

    // readDat("userAccessToken", null)

    var creds = readDat("creds", null)
    var client_id = creds.client_id; // Your client id
    var client_secret = creds.client_secret; // Your secret

    var tokens = readDat("userAccessToken", null)

    var rfToken = tokens.refresh_token
    var body = {
        grant_type: 'refresh_token',
        refresh_token: rfToken
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

    return generalTokenRequest("userRefreshToken", tokenPath, options, qString)


};



export async function generalTokenRequest(tokenType, tokenPath, options, qString) {
    console.log(tokenPath)
    // console.log(options)
    return new Promise((resolve, reject) => {
        var req = https.request(options, function (res) {

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
                if (tokenType == "userAccessToken") {
                    tokenData.refresh_token = result.refresh_token
                }
                if (tokenType == "userAccessToken" || tokenType == "userRefreshToken") {
                    tokenData.scope = result.scope
                }

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
}





export function readDat(type, optionalPath) {
    var path
    if (optionalPath == null) {
        const tempClientTokenPath = 'mainDB/tempClientToken.json'
        const tempUserAccessTokenPath = 'mainDB/tempUserAccessToken.json'
        const tempUserRefreshTokenPath = 'mainDB/tempUserRefreshToken.json'
        const credPath = 'mainDB/credentials.json'

        if (type == "clientToken") {
            path = tempClientTokenPath
        } else if (type == "creds") {
            path = credPath
        } else if (type == "userAccessToken") {
            path = tempUserAccessTokenPath
        } else if (type == "userRefreshToken") {
            path = tempUserRefreshTokenPath
        }
    } else {
        path = optionalPath
    }


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
        const tempClientTokenTemplate = {
            "access_token": null,
            "token_type": null,
            "expires_in": null,
            "expires_at": null
        }

        const tempUserAccessTokenTemplate = {
            "access_token": null,
            "token_type": null,
            "expires_in": null,
            "expires_at": null,
            "refresh_token": null,
            "scope": null
        }

        const tempUserRefreshTokenTemplate = {
            "access_token": null,
            "token_type": null,
            "expires_in": null,
            "expires_at": null,
            "scope": null
        }

        const credTemplate = {
            "client_secret": null,
            "client_id": null,
        }

        if (type == "clientToken") {
            body = tempClientTokenTemplate
        } else if (type == "creds") {
            body = credTemplate
        } else if (type == "userAccessToken") {
            body = tempUserAccessTokenTemplate
        } else if (type == "userRefreshToken") {
            body = tempUserRefreshTokenTemplate
        }

        fs.writeFile(path, JSON.stringify(body), function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });

    }
}

export function userAuth() {
    // return new Promise(async (resolve, reject) => {

    var path

    var creds = readDat("creds")
    var client_id = creds.client_id; // Your client id
    var client_secret = creds.client_secret; // Your secret

    var redirect_uri = 'http://localhost:8888/callback';

    var app = express();

    app.get('/login', function (req, res) {

        var state = generateRandomString(16);
        var scope = 'ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-private user-read-email user-follow-modify user-follow-read user-library-modify user-library-read app-remote-control user-read-playback-position user-top-read user-read-recently-played playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public'

        res.redirect('https://accounts.spotify.com/authorize?' +
            new URLSearchParams({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            }).toString());
    });

    app.get('/callback', function (req, res) {
        // dbManage.promiseWriteFile("../mainDB/authCodes/currAuthCode.json", JSON.stringify(res.req.query))
        readDat("userAccessToken", null)

        var creds = readDat("creds")
        var client_id = creds.client_id; // Your client id
        var client_secret = creds.client_secret; // Your secret
        var body = {
            grant_type: 'authorization_code',
            code: res.req.query.code,
            redirect_uri: 'http://localhost:8888/callback'

        }

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

        generalTokenRequest('userAccessToken', './mainDB/tempUserAccessToken.json', options, qString)

        // console.log(res.req.query)
        // console.log(res.req.query.code)
    });

    app.listen(8888)
}

//https://www.kindacode.com/article/how-to-easily-generate-a-random-string-in-node-js/
//from online resource, generate string of x length
const generateRandomString = (myLength) => {
    const chars =
        "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
        { length: myLength },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
};