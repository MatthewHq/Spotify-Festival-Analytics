import * as fs from 'fs'

let text="abcd"
console.log(text.substring(1,text.length))

fs.readdir('./testing', function (err, files) {
    if (err) {
        return console.log('Cannot Read Dir: ' + err);
    } 
    files.forEach(function (file) {
        console.log(file); 
    });
});