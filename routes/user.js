'use strict';
import {
  accountLogin,
  emailLogin,
  phoneLogin,
  register,
  checkUserExist
} from '../api/controller/user';

module.exports = (router, authRouter, commonRouter, managerRouter, wechatRouter) => {
  // 账户登录
  commonRouter.post('/login/account', accountLogin);
  // 邮箱登录
  commonRouter.post('/login/email', emailLogin);
  // 电话验证码登录
  commonRouter.post('/login/phone', phoneLogin);
  // 注册
  commonRouter.post('/register', register);
  // 检查账号是否存在
  commonRouter.get('/user/check', checkUserExist);
};
