import * as fs from 'fs';
import * as https from 'https'
// import * as request from 'request';




export function getCredToken(authOptions) {

    var creds = readDat("creds")
    var client_id = creds.client_id; // Your client id
    var client_secret = creds.client_secret; // Your secret
    var body = {
        grant_type: 'client_credentials'
    }

    var qString = Object.keys(body).map(key => key + '=' + body[key]).join('&');

    // request option
    var options = {
        host: 'accounts.spotify.com',
        port: 443,
        method: 'POST',
        path: '/api/token',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'), //Fixing Deprication,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': qString.length
        }
    };

    var qString = Object.keys(body).map(key => key + '=' + body[key]).join('&');

    // request object
    
    var req = https.request(options, function (res) {
        var tokenPath='./tempToken.json'
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            console.log(JSON.parse(result))

            let tokenData = fs.readFileSync(tokenPath, 'utf8')

            fs.writeFile(tokenPath, result, function (err) {
                if (err) throw err;
                console.log('File is created successfully.');
            });
            return result
        });
        res.on('error', function (err) {
            console.log(err);
        })
    });

    // req error
    req.on('error', function (err) {
        console.log(err);
    });
    //send request witht the postData form
    req.write(qString);
    req.end();

};




export function readDat(type) {
    const tempTokenPath = './tempToken.json'
    const credPath = './credentials.json'
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
        // console.error(err)
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
            "exires_at": null
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
