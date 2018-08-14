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
  let user = await Models.Users.findOne({ where: { account: body.account } });
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
  ctx.verifyParams({
    email: 'email',
    password: 'string'
  });
  const body = ctx.request.body;
  let user = await Models.Users.findOne({ where: { email: body.email } });
  const isMatch = await user.comparePassword(body.password);
  if (!isMatch) {
    ctx.throw(423, '邮箱或密码错误！');
  }
  user = user.dataValues;
  const token = signToken(user);
  ctx.body = {
    code: 200,
    token,
    user
  };
};

const phoneLogin = async ctx => {
  ctx.body = {
    code: 200
  };
};

const register = async ctx => {
  ctx.verifyParams({
    account: { type: 'string', required: false },
    password: 'string',
    real_name: { type: 'string', required: false },
    phone: { type: 'string', required: false },
    nickname: { type: 'string', required: false },
    email: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  checkRegister(body, ctx);
  const userCheck = await Models.Users.findOne({
    raw: true,
    where: { account: body.account }
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

const checkAccountExist = async ctx => {
  ctx.verifyParams({
    account: 'string'
  });
  const body = ctx.request.body;
  const userCheck = await Models.Users.findOne({
    raw: true,
    where: { account: body.account }
  });
  if (userCheck) {
    ctx.body = {
      code: 200,
      exist: true
    };
  } else {
    ctx.body = {
      code: 200,
      exist: false
    };
  }
};

function checkRegister (obj, ctx) {
  if (!checkUserRegisterParams(obj)) {
    ctx.throw(423, '请检查注册信息栏，填写好对应信息');
  }
}

function checkUserRegisterParams (obj) {
  const field = ['account', 'email', 'phone'];
  for (let item of field) {
    if (_.has(obj, item)) {
      return true;
    }
  }
  return false;
}

export {
  accountLogin,
  emailLogin,
  phoneLogin,
  register,
  checkAccountExist
};
