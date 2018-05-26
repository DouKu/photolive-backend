'use strict';
import _ from 'lodash';
import Users from '../models/Users';
import { signToken } from '../service/base';

const login = async ctx => {
  ctx.verifyParams({
    username: 'string',
    password: 'string'
  });
  const body = ctx.request.body;
  let user = await Users.findOne({ where: { username: body.username } });
  const isMatch = await user.comparePassword(body.password);
  if (!isMatch) {
    ctx.throw(423, '用户名或密码错误！');
  }
  user = user.dataValues;
  const token = signToken(user);
  user = _.omit(user, ['password', 'appSecret']);
  ctx.body = {
    code: 200,
    token,
    user
  };
};

const register = async ctx => {
  ctx.verifyParams({
    username: 'string',
    password: 'string',
    nickname: { type: 'string', required: false },
    email: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  const userCheck = await Users.findOne({
    raw: true,
    where: { username: body.username }
  });
  if (userCheck) {
    ctx.throw(400, '该用户已存在！');
  }
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
