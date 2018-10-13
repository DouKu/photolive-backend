'use strict';
import _ from 'lodash';
import { Models } from '../../config/sequelize';
import { signToken } from '../service/base';
import { dbFindOne } from '../service/dbtools';

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
  user = filterloginFeild(user);
  ctx.body = {
    code: 200,
    msg: '登录成功!',
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
  user = filterloginFeild(user);
  ctx.body = {
    code: 200,
    msg: '登录成功!',
    token,
    user
  };
};

const phoneLogin = async ctx => {
  ctx.body = {
    code: 200
  };
};

const checkUserExist = async ctx => {
  const query = ctx.request.query;
  const filter = checkCheckUserExist(query, ctx);
  const userCheck = await dbFindOne('Users', {
    where: filter
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

function checkCheckUserExist (obj, ctx) {
  const field = ['account', 'email', 'phone'];
  const filter = {};
  for (let item of field) {
    if (_.has(obj, item)) {
      filter[item] = obj[item];
      return filter;
    }
  }
  ctx.throw(423, '账户名/邮箱/电话缺失');
}

const register = async ctx => {
  ctx.verifyParams({
    account: { type: 'string', min: 6, max: 50, required: false },
    password: 'string',
    realName: { type: 'string', min: 1, max: 50, required: false },
    phone: { type: 'string', max: 20, required: false },
    nickname: { type: 'string', min: 1, max: 50, required: false },
    email: { type: 'email', required: false }
  });
  const body = ctx.request.body;
  checkRegister(body, ctx);
  const userCheck = await Models.Users.findOne({
    raw: true,
    where: {
      $or: [{
        account: body.account
      }, {
        email: body.email
      }, {
        phone: body.phone
      }]
    }
  });
  if (userCheck) {
    ctx.throw(400, '该用户已存在！');
  }
  await Models.Users.create(body);
  ctx.body = {
    code: 200,
    msg: '注册成功!'
  };
};

function checkRegister (obj, ctx) {
  const field = ['account', 'email', 'phone'];
  let check = false;
  for (let item of field) {
    if (_.has(obj, item)) {
      check = true;
      break;
    }
  }
  if (!check) {
    ctx.throw(423, '请检查注册信息栏，填写好对应信息');
  }
}

export {
  accountLogin,
  emailLogin,
  phoneLogin,
  register,
  checkUserExist
};

function filterloginFeild (user) {
  return _.omit(user, ['password', 'appSecret']);
}
