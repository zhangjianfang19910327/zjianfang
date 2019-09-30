import { Application } from 'egg';
export default (app: Application) => {
  const { controller, router } = app;
  router.post('/api/register', controller.home.register);//注册接口
  router.post('/api/login', controller.home.login);//登录接口
  router.post('/api/findPassword', controller.home.findPassword);//找回密码
  router.post('/api/updateHeadImg', controller.home.updateHeadImg);//修改用户头像
  router.post('/api/article', controller.home.article);//文章发表
  router.post('/api/modifyArticle', controller.home.modifyArticle);//修改文章
  router.get('/api/spm', controller.home.spm);//注册链接生成
  router.get('/index.html', controller.home.html);
  router.post('/api/upload', controller.upload.uploadImgAll);
  router.post('/api/upload1', controller.upload.uploadImgAll);
};
