import * as fs from 'fs'


export async function dbCheckQuery(query){
    return new Promise(async(resolve,reject)=>{
        fs.readdir('./queryBank', (err, files) =>{
            if (err) {
                reject(new Error(('Cannot Read Dir: ' + err)));
            } 
            files.forEach( (file) =>{
                if(query==file.substring(0,file.length-5)){
                    resolve(true)
                }
            });
            resolve(false)
        });
    })
}
