import * as https from 'https'
import * as credManager from './credManager.js'

async function main() {

    let tkd = await credManager.supplyTokenData()
    console.log(tkd.access_token + "| async")

    const options = {
        hostname: 'api.spotify.com',
        port: 443,
        path: '/v1/users/jmperezperez',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + tkd.access_token
        }
    }

    // request object
    var req = https.request(options, function (res) {
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            console.log(result+"RESULT");
        });
        res.on('error', function (err) {
            console.log(err);
        })
    });

    // req error
    req.on('error', function (err) {
        console.log(err);
    });
    req.end();

}


main()