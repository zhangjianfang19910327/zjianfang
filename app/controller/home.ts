import { Controller } from 'egg';
import {UserInfo} from '../entities/UserInfo';
export default class HomeController extends Controller {
  // 登录
  public async login() {
    const { ctx } = this;
    const body = ctx.request.body;
    console.log(ctx.cookies.get('login',{encrypt: true}));
    try {
      const result = await ctx.connection.getRepository(UserInfo)
                                          .createQueryBuilder("user")
                                          .where("user.username = :username AND user.password = :password", { username: body.username, password: body.password })
                                          .getOne();
                                          if(result){
                                            ctx.cookies.set('login','true',{httpOnly: true, encrypt: true});
                                            ctx.body = {status:true,username:result.username};
                                          }else{
                                            ctx.body = {status:false};
                                          }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
  // 注册
  public async register() {
    const { ctx, app} = this;
    const spm = "zjianfang"+ Math.ceil(Math.random()*10000000);
    const body = JSON.stringify(ctx.request.body);//记录参数
    try {
      // const result= await app.redis.set(spm,body);
      const result= await app.redis.set(spm,body,'EX',180000000000);//设置过期时间ms
      if(result=='OK'){
        const kafka=await new Promise((resolve,reject)=>{
          ctx.producer.send([{ topic: 'topic1', messages:spm , partition: 0 }], function (err:any, data:any) {
                  if(err){
                    reject(err)
                  }
                  resolve(data);
            });
          });
          console.log(kafka);
        if(kafka){
          ctx.body = {status: true, kafka: kafka};
        }
      }else{
        ctx.body = {status: false,spm: spm};
      }
      console.log(spm,result);
      console.log(body);
    } catch (error) {
      console.log(error);
    }
  }
  public async html() {
    await this.ctx.render('index.html', {})
  }
  // 点击注册连接
  public async spm() {
    const { ctx ,app} = this;
    const spm :string=ctx.query.spm;
    
    console.log(spm);
    // ctx.cookies.set("name", "张三",{
    //   maxAge: 24 * 3600 * 1000,
    //   httpOnly: true, // by default it's true
    //   encrypt: true, // 加密，并且可以设置为中文
    // });
    try {
      const userinfostring :string= await app.redis.get(spm).then((data)=>{
        if(data==null){
          return '0';
        }
        return data;
      });
      console.log("userinfostring:"+userinfostring);
      const userinfodata = JSON.parse(userinfostring);
      let userinfo=new UserInfo();
      userinfo.username=userinfodata.username;
      userinfo.phonenumber=1;
      userinfo.email=userinfodata.username;
      userinfo.description="";
      userinfo.password=userinfodata.password;
      const status = await ctx.connection.manager.save(userinfo);
      ctx.body = status;
    } catch (error) {
      ctx.body =await {flag:false};
    }
  }
  // 点击注册连接
  public async loginsStatus() {
    const { ctx } = this;
   const cookie=ctx.cookies.get('name',{encrypt: true});
   
    try{
      if(cookie!=null){
        ctx.body=await {status:true};
      }else{
        ctx.body=await {status:false};
      }
      
    }
    catch{
      ctx.body=await {status:false};
    }
  }

}
