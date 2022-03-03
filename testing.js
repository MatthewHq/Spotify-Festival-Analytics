var creds=require('./credentials.json')

var client_id = creds.client_id; // Your client id
var client_secret = creds.client_secret; // Your secret

var a= (Buffer.from(client_id + ':' + client_secret,'base64').toString())
var b=new Buffer(client_id + ':' + client_secret).toString('base64')
var c=Buffer.from(client_id + ':' + client_secret).toString('base64')


console.log(a+"\n"+b+"\n"+c)