import { Application } from 'egg';
export default (app: Application) => {
  const { controller, router } = app;
  router.post('/api/register', controller.home.register);
  router.post('/api/login', controller.home.login);
  router.get('/api/spm', controller.home.spm);
  router.post('/api/upload', controller.upload.uploadImgAll);
};
