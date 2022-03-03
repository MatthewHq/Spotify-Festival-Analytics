const fs = require('fs')

function getCredToken(authOptions) {

    var creds = require('./credentials.json')
    var client_id = creds.client_id; // Your client id
    var client_secret = creds.client_secret; // Your secret
    var auOps
    if (authOptions) {
        auOps = authOptions
    } else {
        auOps = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                // 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64') //Fixing Deprication
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
    }


    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            var token = body.access_token;

        } else {
            throw response
            // console.log(response)
            // console.log(body)
        }
    });

};


function readToken(){
    try {
        fs.readFile('./tempToken', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            return data
        })
    } catch (e) {
        
    }
}
