'use strict';
import _ from 'lodash';
import Users from '../models/users';
import { signToken } from '../service/base';

const login = async ctx => {
  ctx.verifyParams({
    username: 'string',
    password: 'string'
  });
  const body = ctx.request.body;
  console.log(body);
  let user = await Users.findOne({ where: { username: body.username } });
  console.log(user);
  const isMatch = user.comparePassword(body.password);
  if (!isMatch) {
    ctx.throw(423, '用户名或密码错误！');
  }
  const token = signToken(user);
  user = _.omit(user, ['password', 'appSecret']);
  ctx.body = {
    code: 200,
    msg: '登录成功!',
    token
  };
};

const register = async ctx => {
  ctx.verifyParams({
    phone: 'string',
    username: 'string',
    password: 'string',
    nickname: 'string'
  });
  const body = ctx.request.body;
  await Users.create(body);
  ctx.body = {
    code: 200,
    msg: '注册成功!'
  };
};

export {
  login,
  register
};
