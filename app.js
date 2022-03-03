// const cr= require('./credManager.js')
// cr.readToken()
import * as credManager from './credManager.js'; 
console.log("hmm")
let test=credManager.readDat("creds")
let credToken=credManager.getCredToken()

console.log("aa\n"+credToken+"aa")