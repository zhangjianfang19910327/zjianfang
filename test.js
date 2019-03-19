const chan = require('chan');
const fs=require('fs');
const path=require('path');
const write =require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const ch = chan();
async function parts(fn) {
    return new Promise(function (resolve, reject) {
        ch(function (err, res) {
            resolve(res);
        })
    })
}
let count = 0;
let a;
const tick=setInterval(async () => {
        if(count===3){
            ch(a);
            clearInterval(tick);
           
        }else{
            count++;
            ch([count]);
        }
}, 4000);
async function fun() {
    let part;
    const a =  await 4;
    try {
        while (
            (part =await parts()
            ) != null
        ) {
           
            try {
                const writeStream = fs.createWriteStream(path.join(__dirname,count+'.txt'));
               await fs.appendFile(path.join(__dirname,count+'.txt'),part,function(){});
                
            } catch (error) {
                await sendToWormhole(part);
            }
            console.log(part)
        }
    } catch (error) {
    }
    
    console.log('wan')
    
}
new Promise((a,b)=>{
    fun();
    a(1);
})





