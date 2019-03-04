import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import {UserInfo} from "../app/entities/UserInfo";
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
    entities:[UserInfo]
   
  };
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'auth',
      db: 0,
    },
  };
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
