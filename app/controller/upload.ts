import { Controller } from 'egg';
const path =require('path');
const fs=require('fs');
import {write} from 'await-stream-ready';
const sendToWormhole = require('stream-wormhole');
export default class HomeController extends Controller {
    public async uploadImg() {
            const {ctx} = this;
        // 获取 steam
        const stream = await ctx.getFileStream();
        // 生成文件名
        const filename = Date.now() + '' + Math.ceil(Math.random() * 10000) + path.extname(stream.filename);
        // 写入路径
        const target = path.join(this.config.baseDir, 'app/public/', filename);
        const writeStream = fs.createWriteStream(target);
        try { 
            // 写入文件
            await write(stream.pipe(writeStream));
          } catch (err) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            await sendToWormhole(stream);
            throw err;
          }
          ctx.body = stream.fields;

    }
    public async uploadImgAll() {
        const ctx = this.ctx;
        const parts = ctx.multipart();
        console.log(ctx.headers);
        let part;
        // parts() 返回 promise 对象
        while ((part = await parts()) != null) {
          if (part.length) {
            // 这是 busboy 的字段
            console.log('field: ' + part[0]);
            console.log('value: ' + part[1]);
            console.log('valueTruncated: ' + part[2]);
            console.log('fieldnameTruncated: ' + part[3]);
          } else {
            if (!part.filename) {
              // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
              // 需要做出处理，例如给出错误提示消息
              return;
            }
            // part 是上传的文件流
            console.log('field: ' + part.fieldname);
            console.log('filename: ' + part.filename);
            console.log('encoding: ' + part.encoding);
            console.log('mime: ' + part.mime);
            // 文件处理，上传到云存储等等
            let result;
            try {
                const filename = Date.now() + '' + Math.ceil(Math.random() * 10000) + path.extname(part.filename);
                // 写入路径
                const target = path.join(this.config.baseDir, 'app/public/', filename);
                const writeStream = fs.createWriteStream(target);
                await write(part.pipe(writeStream));
            } catch (err) {
              // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
              await sendToWormhole(part);
              throw err;
            }
            console.log(result,'jpg');
          }
        }
        ctx.body =1;
        console.log('and we are done parsing the form!');
    }
    
}