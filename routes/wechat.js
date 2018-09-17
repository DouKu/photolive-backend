'use strict';
import {
  getJSConfig,
  exchangeToken,
  server
} from '../api/controller/wechat';

module.exports = (router, authRouter, commonRouter, managerRouter, wechatRouter) => {
  wechatRouter.post('/exchangeToken', exchangeToken);
  wechatRouter.get('/getJSConfig', getJSConfig);
  router.get('/', server);
};
