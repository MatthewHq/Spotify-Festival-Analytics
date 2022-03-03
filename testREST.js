import * as https from 'https'
import * as credManager from './credManager.js'
import * as queryString from 'query-string'

var creds = credManager.readDat("creds")
var client_id = creds.client_id; // Your client id
var client_secret = creds.client_secret; // Your secret



// form data


var body={
    grant_type: 'client_credentials'
}

var aaa = Object.keys(body).map(key => key + '=' + body[key]).join('&');

// const stringified = queryString.stringify(parsed);
console.log(aaa)

// var postData = queryString.parse({
//     grant_type: 'client_credentials'
// });
// console.log(postData)

// request option
var options = {
    host: 'accounts.spotify.com',
    port: 443,
    method: 'POST',
    path: '/api/token',
    headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'), //Fixing Deprication,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': aaa.length
    }
};

// request object
var req = https.request(options, function (res) {
    var result = '';
    res.on('data', function (chunk) {
        result += chunk;
    });
    res.on('end', function () {
        console.log(result);
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
req.write(aaa);
req.end();