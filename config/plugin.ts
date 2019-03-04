import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  typeorm:{
    enable: true,
    package: 'egg-fortypeorm',
  },
};
export default plugin;
