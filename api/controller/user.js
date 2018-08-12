'use strict';
import _ from 'lodash';
import { Models } from '../../config/sequelize';
import { signToken } from '../service/base';

const accountLogin = async ctx => {
  ctx.verifyParams({
    account: 'string',
    password: 'string'
  });
  const body = ctx.request.body;
  let user = await Models.User.findOne({ where: { account: body.account } });
  const isMatch = await user.comparePassword(body.password);
  if (!isMatch) {
    ctx.throw(423, '用户名或密码错误！');
  }
  user = user.dataValues;
  const token = signToken(user);
  user = _.omit(user, ['password', 'app_secret']);
  ctx.body = {
    code: 200,
    token,
    user
  };
};

const emailLogin = async ctx => {
  ctx.body = {
    code: 200
  };
};

const phoneLogin = async ctx => {
  ctx.body = {
    code: 200
  };
};

const register = async ctx => {
  ctx.verifyParams({
    account: 'string',
    password: 'string',
    nickname: { type: 'string', required: false },
    email: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  const userCheck = await Models.User.findOne({
    raw: true,
    where: { account: body.username }
  });
  if (userCheck) {
    ctx.throw(400, '该用户已存在！');
  }
  await Models.User.create(body);
  ctx.body = {
    code: 200,
    msg: '注册成功!'
  };
};

export {
  accountLogin,
  emailLogin,
  phoneLogin,
  register
};
