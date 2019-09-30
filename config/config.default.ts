import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import {UserInfo} from "../app/entities/UserInfo";
import {Article} from "../app/entities/Article";
export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1539051923601_2007';
  config.typeorm = {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "admin",
    database: "user",
    synchronize: true,
    entities:[UserInfo,Article]
   
  };
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    }
  };
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'auth',
      db: 0,
    },
  };
  config.kafka={
    smtpConfig:{
      "host": "smtp.163.com",
      "port": 465,
      "secure": true,
      auth: {
          user: '13691460209',
          pass: 'a13141215a'
      }
    },
    mailOptions : {
      from: '"www.zjianfang.com" <13691460209@163.com>', // sender address
      to: '2394758186@qq.com', // list of receivers
      subject: 'www.zjianfang.com', // Subject line
      text: '邮箱验证服务', // plain text body
      html: function html(value){return '<b><a href="http://localhost:3000/api/spm?spm='+value.value+'">点击验证邮箱</a></b>'} // html body
    },
    port:'localhost:9092',
    producerTopic:[
       'topic1'
    ],
    consumerTopic:[{topic: 'topic1',
    offset: 0, //default 0
    partition: 0}]
  }
  // add your egg config in here
  config.middleware = [];
  config.security = {
    csrf: false
  };
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
