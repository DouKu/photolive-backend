'use strict';
import { Models } from '../../config/sequelize';

// 检查token
export default () => {
  return async (ctx, next) => {
    const token = ctx.state.user;
    if (token) {
      const user = await Models.User.checkToken(token);
      if (user) {
        ctx.state.userMess = user;
        await next();
      } else {
        ctx.throw(501, 'token信息异常');
      }
    } else {
      ctx.throw(401, 'token丢失');
    }
  };
};
