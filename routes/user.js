'use strict';
import {
  accountLogin,
  emailLogin,
  phoneLogin,
  register
} from '../api/controller/user';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 账户登录
  commonRouter.post('/login/account', accountLogin);
  // 邮箱登录
  commonRouter.post('/login/email', emailLogin);
  // 电话验证码登录
  commonRouter.post('/login/phone', phoneLogin);
  // 注册
  commonRouter.post('/register', register);
};
