import * as fs from 'fs';
import express from "express";
import * as dbManage from '../dbManage.js'
// import URLSearchParams from 'URLSearchParams'

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


export function readDat(type) {
    const tempTokenPath = '../mainDB/tempToken.json'
    const credPath = '../mainDB/credentials.json'
    var path
    if (type == "token") {
        path = tempTokenPath
    } else if (type == "creds") {
        path = credPath
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

function userAuth() {
    // return new Promise(async (resolve, reject) => {

    var path

    var creds = readDat("creds")
    var client_id = creds.client_id; // Your client id
    var client_secret = creds.client_secret; // Your secret

    var redirect_uri = 'http://localhost:8888/callback';

    var app = express();

    app.get('/login', function (req, res) {

        var state = generateRandomString(16);
        var scope = 'user-read-private user-read-email';

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
        dbManage.promiseWriteFile("../mainDB/authCodes/currAuthCode.json", JSON.stringify(res.req.query))
        console.log(res.req.query)
    });

    app.listen(8888)
}

userAuth()