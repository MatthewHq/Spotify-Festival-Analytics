import * as fs from 'fs'


export async function dbCheckQuery(query){
    return new Promise(async(resolve,reject)=>{
        let text="abcd"
        console.log(text.substring(1,text.length))
        
        fs.readdir('./testing', (err, files) =>{
            if (err) {
                reject(new Error(('Cannot Read Dir: ' + err)));
            } 
            files.forEach( (file) =>{
                if(query==file.substring(0,file.length-4)){
                    resolve(true)
                }
            });
            resolve(false)
        });
    })
}
