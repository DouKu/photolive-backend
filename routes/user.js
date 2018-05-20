'use strict';
import {
  login,
  register
} from '../api/controller/user';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 登录
  commonRouter.post('/login', login);
  // 注册
  commonRouter.post('/register', register);
};
