'use strict';
import Users from '../models/users';

// 检查token
export default () => {
  return async (ctx, next) => {
    const token = ctx.state.user;
    if (token) {
      const user = await Users.checkToken(token);
      if (user) {
        ctx.state.userMess = user.toObject();
        await next();
      } else {
        ctx.throw(501, 'token信息异常');
      }
    } else {
      ctx.throw(401, 'token丢失');
    }
  };
};
