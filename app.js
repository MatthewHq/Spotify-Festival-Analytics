// const cr= require('./credManager.js')
// cr.readToken()
import * as credManager from './credManager.js'; 
console.log("hmm")

// let credToken=credManager.getCredToken()
// console.log(credToken)
let credsType=credManager.readDat("creds")
let test=credManager.readDat("token")
console.log("tokentype "+test+"aa")
// console.log("tokentype element "+test.access_token+"aa")
console.log("credstype "+credsType+"aa")
console.log("credstype element "+credsType.client_id+"aa")
