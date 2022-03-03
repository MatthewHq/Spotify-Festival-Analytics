// const cr= require('./credManager.js')
// cr.readToken()
import * as credManager from './credManager.js'; 
let test=credManager.readDat("creds")
credManager.getCredToken(false)
console.log(test)