// const chan = require('chan');
// const fs=require('fs');
// const path=require('path');
// const write =require('await-stream-ready').write;
// const sendToWormhole = require('stream-wormhole');
// const ch = chan();
// async function parts(fn) {
//     return new Promise(function (resolve, reject) {
//         ch(function (err, res) {
//             resolve(res);
//         })
//     })
// }
// let count = 0;
// let a;
// const tick=setInterval(async () => {
//         if(count===3){
//             ch(a);
//             clearInterval(tick);
           
//         }else{
//             count++;
//             ch([count]);
//         }
// }, 4000);
// async function fun() {
//     let part;
//     const a =  await 4;
//     try {
//         while (
//             (part =await parts()
//             ) != null
//         ) {
           
//             try {
//                 const writeStream = fs.createWriteStream(path.join(__dirname,count+'.txt'));
//                await fs.appendFile(path.join(__dirname,count+'.txt'),part,function(){});
                
//             } catch (error) {
//                 await sendToWormhole(part);
//             }
//             console.log(part)
//         }
//     } catch (error) {
//     }
    
//     console.log('wan')
    
// }
// new Promise((a,b)=>{
//     fun();
//     a(1);
// })
var StreamSearch = require('streamsearch'),
      inspect = require('util').inspect;
 
  var needle = new Buffer([13, 10]), // CRLF
      s = new StreamSearch(needle);
      
  s.on('info', function(isMatch, data, start, end) {
    if (data)
      console.log('data: ' + inspect(data.toString('ascii', start, end)),start,end);
    if (isMatch)
      console.log('match!',start,end);
  });
  const a=s.push(new Buffer('\r\n ok\r\n 0000'));
  console.log('a:'+a);
// var WritableStream = require('stream').Writable
//                      || require('readable-stream').Writable,
//     inherits = require('util').inherits;
//     function Demo(cfg){
//         WritableStream.call(this, cfg);
//     }
//     Demo.prototype._write=function(buffer, enc, next){
//         console.log(buffer.toString('utf-8'));
//         next();
//     }
   
//     var i=0;
//     inherits(Demo, WritableStream);
//     var w=new Demo();
//     w.on('finish', () => {
//         console.log('finish');
//        });
//     function callee() {
//         if(i < 10) {
//             console.log('write'+i);  
//          w.write(i + '', 'utf-8', () => {
//           // 写入完成
//           console.log('write');
//          });
//         } else {
//          w.end();
//         }
//         i++;
//     }
//     setInterval(callee,1000);
       





