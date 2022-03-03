import * as fs from 'fs';
// import * as request from 'request';

export function getCredToken(authOptions) {

    var creds=readDat("creds")
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
        const tempTokenPath='./tempToken.json'
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            console.log(response)
            console.log(body)
            var token = body.access_token;
            // var tempTokenTemplate={
            //     "access_token":null,
            //     "token_type":null,
            //     "expires_in":null,
            //     "exires_at":null
            // }
            // fs.writeFile(tempTokenPath, JSON.stringify(tempTokenTemplate), function (err) {
            //     if (err) throw err;
            //     console.log('File is created successfully.');
            //   });

        } else {
            throw response
            // console.log(response)
            // console.log(body)
        }
    });

};




export function readDat(type) {
    const tempTokenPath='./tempToken.json'
    const credPath='./credentials.json'
    var path
    if(type=="token"){
        path=tempTokenPath
    }else if(type=="creds"){
        path=credPath
    }

    console.log(path)
    //check for token file existence
    var exists=false
    try {
        if (fs.existsSync(path)) {
            exists=true
        }
    } catch (err) {
        // console.error(err)
    }

    //if exists read it, else CREATE and write to it
    if(exists){
        try {
            const data = fs.readFileSync(path, 'utf8')
            return JSON.parse(data)
          } catch (err) {
            console.error(err)
          }
          
    }else{
        var body
        const tempTokenTemplate={
            "access_token":null,
            "token_type":null,
            "expires_in":null,
            "exires_at":null
        }
        const credTemplate={
            "client_secret":null,
            "client_id":null,
        }

        if(type=="token"){
            body=tempTokenTemplate
        }else if(type=="creds"){
            body=credTemplate
        }
        
        fs.writeFile(path, JSON.stringify(body), function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
          });
        
    }
}
