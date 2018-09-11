'use strict';
export default () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      let message = error.message;
      if (error.status === 422) {
        message = error.errors;
      };
      ctx.body = {
        code: error.status || 500,
        error: message
      };
    }
  };
};
