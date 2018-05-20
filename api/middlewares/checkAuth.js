'use strict';
export default () => {
  return async (ctx, next) => {
    if (!ctx.state.userMess.isManager) {
      ctx.throw(403, '权限不足');
    }
    await next();
  };
};
