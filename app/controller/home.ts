import { Controller } from 'egg';
import {UserInfo} from '../entities/UserInfo';
export default class HomeController extends Controller {
  // 登录
  public async login() {
    const { ctx } = this;
    const body = ctx.request.body;
    try {
      const result = await ctx.connection.getRepository(UserInfo)
                                          .createQueryBuilder("user")
                                          .where("user.username = :username AND user.password = :password", { username: body.username, password: body.password })
                                          .getOne();
                                          if(result){
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
    const body = JSON.stringify(ctx.request.body);
    try {
      const result= await app.redis.set(spm,body);
      //const result= await app.redis.set(spm,body,'EX',1800);//设置过期时间ms
      if(result=='ok'){
        ctx.body = {status: true, spm: spm};
      }else{
        ctx.body = {status: false,spm: spm};
      }
      console.log(spm,result);
      console.log(body);
    } catch (error) {
      console.log(error);
    }
  }
  // 点击注册连接
  public async spm() {
    const { ctx, app} = this;
    const spm :string=ctx.query.spm;
    console.log(spm);
    try {
      const userinfostring :string= await app.redis.get(spm).then((data)=>{
        if(data==null){
          return '0';
        }
        return data;
      });
      const userinfodata = JSON.parse(userinfostring);
      console.log(userinfodata);
      let userinfo=new UserInfo();
      userinfo.username=userinfodata.username;
      userinfo.phonenumber=1;
      userinfo.email=userinfodata.username;
      userinfo.description="";
      userinfo.password=userinfodata.password;
      const status = await ctx.connection.manager.save(userinfo);
      console.log(spm,status);
      ctx.body = status;
    } catch (error) {
      console.log(error);
    }
  }
}
