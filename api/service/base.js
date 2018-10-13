'use strict';
import jwt from 'jsonwebtoken';
import nconf from 'nconf';

// 生成token
const signToken = user => {
  const token = jwt.sign(
    {
      id: user.id,
      secret: user.appSecret
    },
    nconf.get('jwt_secret'),
    { expiresIn: '24h' }
  );
  return token;
};

// 检查并且更新token
const checkToken = async (ctx, User, getUser) => {
  const token = ctx.state.user;
  if (token) {
    const user = await User.checkAndUpdateToken(token);
    if (user) {
      if (getUser) {
        return user;
      } else {
        return this.signToken(user);
      }
    } else {
      ctx.throw(501, 'token信息异常');
    }
  } else {
    ctx.throw(401, 'token丢失');
  }
};

export {
  signToken,
  checkToken
};
