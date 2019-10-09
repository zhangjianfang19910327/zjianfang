import { Controller } from 'egg';
import { UserInfo } from '../entities/UserInfo';
import { Article } from '../entities/Article';
export default class HomeController extends Controller {
  // 登录
  public async login() {
    const { ctx } = this;
    const body = ctx.request.body;
    console.log(ctx.cookies.get('login', { encrypt: true }));
    try {
      const result = await ctx.connection.getRepository(UserInfo)
        .createQueryBuilder('user')
        .where('user.username = :username AND user.password = :password', { username: body.username, password: body.password })
        .getOne();
      if (result) {
        ctx.cookies.set('login', 'true', { httpOnly: true, encrypt: true });
        ctx.body = { status: true, username: result.username };
      } else {
        ctx.body = { status: false };
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
  // 注册
  public async register() {
    const { ctx, app } = this;
    const spm = 'zjianfang' + Math.ceil(Math.random() * 10000000);
    const body = JSON.stringify(ctx.request.body);//记录参数
    try {
      // const result= await app.redis.set(spm,body);
      const result = await app.redis.set(spm, body, 'EX', 180000000000);//设置过期时间ms
      if (result == 'OK') {
        const kafka = await new Promise((resolve, reject) => {
          ctx.producer.send([{ topic: 'topic1', messages: spm, partition: 0 }], function (err: any, data: any) {
            if (err) {
              reject(err)
            }
            resolve(data);
          });
        });

        if (kafka) {
          ctx.body = { status: true, kafka: kafka, msg: '请登录邮箱验证注册！' };
        }
      } else {
        ctx.body = { status: false, spm: spm };
      }
      console.log(spm, result);
      console.log(body);
    } catch (error) {
      ctx.body = { status: false, msg: '服务器内部错误！' }
    }
  }
  public async html() {
    await this.ctx.render('index.html', {})
  }
  // 点击注册连接
  public async spm() {
    const { ctx, app } = this;
    const spm: string = ctx.query.spm;

    console.log(spm);
    // ctx.cookies.set('name', '张三',{
    //   maxAge: 24 * 3600 * 1000,
    //   httpOnly: true, // by default it's true
    //   encrypt: true, // 加密，并且可以设置为中文
    // });
    try {
      const userinfostring: string = await app.redis.get(spm).then((data) => {
        if (data == null) {
          return '0';
        }
        return data;
      });
      console.log('userinfostring:' + userinfostring);
      const userinfodata = JSON.parse(userinfostring);
      let userinfo = new UserInfo();
      userinfo.username = userinfodata.username;
      userinfo.phonenumber = '1';
      userinfo.email = userinfodata.username;
      userinfo.description = '';
      userinfo.password = userinfodata.password;
      const status = await ctx.connection.manager.save(userinfo);
      console.log(status)
      ctx.body = status;
    } catch (error) {
      ctx.body = await { flag: false };
    }
  }
  // 点击注册连接
  public async loginsStatus() {
    const { ctx } = this;
    const cookie = ctx.cookies.get('name', { encrypt: true });

    try {
      if (cookie != null) {
        ctx.body = await { status: true };
      } else {
        ctx.body = await { status: false };
      }

    }
    catch{
      ctx.body = await { status: false };
    }
  }
  async qq() {
    const query = this.ctx.query;
    const client_id = 101579655;
    // const state = query.state;
    const grant_type = 'authorization_code';
    const code = query.code;
    const redirect_uri = 'https://www.zjianfang.com/api/qq';
    const open_id_url = 'https://graph.qq.com/oauth2.0/me?access_token=';
    const appkey = '409257504ca4c23275b516b5dce2d315';
    const token_url = `https://graph.qq.com/oauth2.0/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${appkey}&code=${code}&redirect_uri= ${redirect_uri}`;
    try {
      const res = await this.ctx.curl(token_url, {
        timeout: 3000
      });
      let data = res.data.toString('utf8');
      const datajson: any = parsePara(data);
      console.log('datajson:' + datajson);
      const access_token = datajson.access_token;
      // const expires_in = datajson.expires_in;//过期时间
      // const refresh_token = datajson.refresh_token;//刷新token
      const res_access_token = await this.ctx.curl(open_id_url + access_token, {
        timeout: 3000
      });
      const open_id_json = JSON.parse((res_access_token.data.toString('utf8')).replace(/(callback|\(|\)|\;)/g, ''));
      console.log('open_id_json:' + open_id_json)
      const openid = open_id_json.openid;
      let userinfo = await this.ctx.curl(`https://graph.qq.com/user/get_user_info?access_token=${access_token}&oauth_consumer_key=${client_id}&openid=${openid}`, {
        timeout: 3000
      });
      userinfo = JSON.parse(userinfo.data.toString('utf8'));
      this.ctx.body = { login: true, userinfo: userinfo };
    } catch (e) {
      this.ctx.body = { msg: '服务器内部异常!', errcode: '501' }
    }

    // get请求字符串 转json
    function parsePara(e) {
      var t, n, r, i = e, s = {};
      t = i.split('&'),
        r = null,
        n = null;
      for (var o in t) {
        var u = t[o].indexOf('=');
        u !== -1 && (r = t[o].substr(0, u),
          n = t[o].substr(u + 1),
          s[r] = n)
      }
      return s
    }
    //buffer转换成字符串

  }
// 找回密码
  async findPassword (){
    const { ctx } = this;
    const body = ctx.request.body;
    try {
      const result = await ctx.connection.getRepository(UserInfo)
        .createQueryBuilder('user')
        .where('user.username = :username', { username: body.username})
        .getOne();
      console.log(result);
      if (result) {
        const resultobj = await ctx.connection
        .createQueryBuilder()
        .update(UserInfo)
        .set({ password: body.password})
        .where('username = :username', { username: body.username })
        .execute();
        ctx.body = { status: true ,msg:'找到账号了',result:resultobj};
        console.log(true,result);
      } else {
        console.log(false,result);
        ctx.body = { status: false ,msg:'您输入的账号尚未注册！'};
      }
    } catch (error) {
      ctx.body = { status: false ,msg:'服务器内部错误！' ,errcode:'501'};
    }
  }
  // updateHeadImg
  async updateHeadImg (){
    const { ctx } = this;
    const body = ctx.request.body;
    try {
      const result = await ctx.connection.getRepository(UserInfo)
        .createQueryBuilder('user')
        .where('user.username = :username', { username: body.username})
        .getOne();
      console.log(result);
      if (result) {
        console.log(typeof result)
      } else {
        ctx.body = { status: false ,msg:'您输入的账号尚未注册！'};
      }
      console.log(result);
    } catch (error) {
      ctx.body = { status: false ,msg:'服务器内部错误！' ,errcode:'501'};
    }
  }
  // 发布文章 
  async article(){
    const { ctx } = this;
    const body = ctx.request.body;
    let article = new Article();
    article.username = body.username;
    article.type = body.type;
    article.topic = body.topic;
    article.conetent = body.conetent;
    article.title = body.title;
    try {
      const result = await ctx.connection.getRepository(Article)
        .createQueryBuilder('article')
        .where('article.title = :title', { title: body.title})
        .getOne();
      
      if (result) {
        ctx.body={status:true,msg:'文章已存在！'}
      }else{
        const status = await ctx.connection.manager.save(article);
        ctx.body={status:true,msg:'文章保存成功！',info:status};
      }
      
      
    } catch (error) {
      ctx.body={status:false,msg:'文章保存失败！'}
    }

    
  }
  // 修改文章 
  async modifyArticle(){
    const { ctx } = this;
    const body = ctx.request.body;
    let article = new Article();
    article.username = body.username;
    article.type = body.type;
    article.topic = body.topic;
    article.conetent = body.conetent;
    try {
      const result = await ctx.connection.getRepository(Article)
        .createQueryBuilder('article')
        .where('article.title = :title', { title: body.title})
        .getOne();
      console.log(result);
      if (result) {
        const resultobj = await ctx.connection
        .createQueryBuilder()
        .update(Article)
        .set({ conetent: body.conetent})
        .where('title = :title', { title: body.title })
        .execute();
        ctx.body = { status: true ,msg:'文章更新成功',result:resultobj};
      } else {
        ctx.body = { status: false ,msg:'您的文章还未发表！'};
      }
    } catch (error) {
      ctx.body = { status: false ,msg:'服务器内部错误！' ,errcode:'501'};
    }

    
  }
}

// query:
// { code: 'B93042902BC54A2D17140E7A69168C51', state: 'state' }
// res:
// { data:
//    <Buffer 61 63 63 65 73 73 5f 74 6f 6b 65 6e 3d 36 30 36 30 35 37 33 43 31 46 38 34 31 31 36 36 44 46 41 36 39 36 41 42 45 34 36 43 36 43 41 33 26 65 78 70 69 ... >,
//   status: 200,
//   headers:
//    { date: 'Thu, 26 Sep 2019 03:59:57 GMT',
//      'content-type': 'text/html',
//      'content-length': '111',
//      connection: 'keep-alive',
//      server: 'QZHTTP-2.38.20',
//      'cache-control': 'no-cache' },
//   res:
//    { status: 200,
//      statusCode: 200,
//      statusMessage: 'OK',
//      headers:
//       { date: 'Thu, 26 Sep 2019 03:59:57 GMT',
//         'content-type': 'text/html',
//         'content-length': '111',
//         connection: 'keep-alive',
//         server: 'QZHTTP-2.38.20',
//         'cache-control': 'no-cache' },
//      size: 111,
//      aborted: false,
//      rt: 212,
//      keepAliveSocket: false,
//      data:
//       <Buffer 61 63 63 65 73 73 5f 74 6f 6b 65 6e 3d 36 30 36 30 35 37 33 43 31 46 38 34 31 31 36 36 44 46 41 36 39 36 41 42 45 34 36 43 36 43 41 33 26 65 78 70 69 ... >,
//      requestUrls:
//       [ 'https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=101579655&client_secret=409257504ca4c23275b516b5dce2d315&code=B93042902BC54A2D17140E7A69168C51&redirect_uri=https://www.zjianfang.com/api/qq' ],
//      timing: null,
//      remoteAddress: '113.96.208.232',
//      remotePort: 443,
//      socketHandledRequests: 1,
//      socketHandledResponses: 1 } }
// datajson:
// { access_token: '6060573C1F841166DFA696ABE46C6CA3',
//   expires_in: '7776000',
//   refresh_token: '6DA5E2CD6579D9F26CD9B5D608D62F0F' }
// open_id_json:
// { client_id: '101579655',
//   openid: 'CBFBEAEB98A0864762ABE244BC0F17BC' }
// { ret: 0,
//   msg: '',
//   is_lost: 0,
//   nickname: '买买买提',
//   gender: '男',
//   province: '河南',
//   city: '郑州',
//   year: '1991',
//   constellation: '',
//   figureurl:
//    'http://qzapp.qlogo.cn/qzapp/101579655/CBFBEAEB98A0864762ABE244BC0F17BC/30',
//   figureurl_1:
//    'http://qzapp.qlogo.cn/qzapp/101579655/CBFBEAEB98A0864762ABE244BC0F17BC/50',
//   figureurl_2:
//    'http://qzapp.qlogo.cn/qzapp/101579655/CBFBEAEB98A0864762ABE244BC0F17BC/100',
//   figureurl_qq_1:
//    'http://thirdqq.qlogo.cn/g?b=oidb&k=ZJe3I1oyPuXOxicWVP4tdBw&s=40&t=1558580030',
//   figureurl_qq_2:
//    'http://thirdqq.qlogo.cn/g?b=oidb&k=ZJe3I1oyPuXOxicWVP4tdBw&s=100&t=1558580030',
//   figureurl_qq:
//    'http://thirdqq.qlogo.cn/g?b=oidb&k=ZJe3I1oyPuXOxicWVP4tdBw&s=140&t=1558580030',
//   figureurl_type: '1',
//   is_yellow_vip: '0',
//   vip: '0',
//   yellow_vip_level: '0',
//   level: '0',
//   is_yellow_year_vip: '0' }
