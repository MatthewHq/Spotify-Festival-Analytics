//sourced from https://github.com/spotify/web-api-auth-examples/blob/master/client_credentials/app.js
// but modified



/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

var request = require('request'); // "Request" library
//  import creds from ('./credentials.json') //ES6
var creds = require('./credentials.json')

var client_id = creds.client_id; // Your client id
var client_secret = creds.client_secret; // Your secret

// your application requests authorization
console.log(client_id)
console.log(client_secret)
var authOptions = {
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
console.log(authOptions);
request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log(body)
        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
            url: 'https://api.spotify.com/v1/users/jmperezperez',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };
        request.get(options, function (error, response, body) {
            console.log(body);
        });
    } else {
        console.log("error")
        console.log(response)
        console.log(body)
    }
});