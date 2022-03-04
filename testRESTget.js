import * as https from 'https'
import * as credManager from './credManager.js'

async function main() {

    let tkd = await credManager.supplyTokenData()
    console.log(tkd.access_token + "| async")



    var body = {
        q: "valentino khan",
        type: ["artist"],
        market: 'US',
        limit: 5,
        offset: 0,
        // include_external: 'true',
    }

    var qString = "?" + Object.keys(body).map(key => key + '=' + body[key]).join('&');
    qString = qString.replace(" ", "%20")
    console.log(qString)


    const options = {
        hostname: 'api.spotify.com',
        port: 443,
        path: '/v1/search' + qString,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + tkd.access_token,
            'Content-Type': 'application/json',
        }
    }
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
    // req.write(qString)
    req.end();

}
main()