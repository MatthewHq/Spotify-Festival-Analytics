// let str = "1 1"
// var someEncodedString = Buffer.from(str, 'utf-8');

// console.log(someEncodedString.)
// someEncodedString.forEach(element => {
//     console.log(element)
// });
// console.log(str.values())
// let totVal=0


// for(let i =0;i<str.length;i++){
//     totVal+=str.charAt(i)
//     console.log(str.charAt(i))

// }

// console.log(totVal)


//compares two strings by adding up their UTF8 values and returning the dif
//aimed at differences in names based on spotify search results
//ignores spaces
export function comprStrs(str1, str2) {
    let strEnc1 = Buffer.from(str1, 'utf-8');
    let strEnc2 = Buffer.from(str2, 'utf-8');
    let val1 = cmprStrLoop(strEnc1)
    let val2 = cmprStrLoop(strEnc2)
    return (Math.abs(val1 - val2))
}

//for loop section of the compareStrs method, called twice per compareStrs call
export function cmprStrLoop(arr) {
    let total = 0
    arr.forEach(charVal => {
        if (charVal != 32) {
            total += charVal
        }
    });
    return total
}

comprStrs(" one", " onee")



// console.log(comprStrs(" hammer", " hammerFall"))


