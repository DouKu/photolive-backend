'use strict';
import Router from 'koa-router';
// const fs = require('fs')
// const os = require('os')
// const path = require('path')

/** 中间件导入 */
import checkToken from '../api/middlewares/checkToken';
import errorHandle from '../api/middlewares/errorHandle';
/** 资源路由 */
const router = new Router();
/** restful api 路由 */
const commonRouter = new Router();
/** 监权路由 */
const authRouter = new Router();
/** 管理员路由 */
const managerRouter = new Router();
/** 微信路由 */
const wechatRouter = new Router();

/** 路由前缀 */
router.prefix('/api');
commonRouter.prefix('/v1');
authRouter.prefix('/auth');
managerRouter.prefix('/mana');
wechatRouter.prefix('/wechat');

/** 通用路由中间件 */
router.use(errorHandle());

/** 平常路由中间件 */

/** 监权路由中间件 */
authRouter.use(checkToken());

/** 管理员理由中间件 */
managerRouter.use(checkToken());

/** 路由编写 */
require('./user')(router, authRouter, commonRouter, managerRouter, wechatRouter);
require('./albumCfg')(router, authRouter, commonRouter, managerRouter, wechatRouter);
require('./qiniu')(router, authRouter, commonRouter, managerRouter, wechatRouter);
require('./wechatApp')(router, authRouter, commonRouter, managerRouter, wechatRouter);
require('./wechat')(router, authRouter, commonRouter, managerRouter, wechatRouter);
require('./images')(router, authRouter, commonRouter, managerRouter, wechatRouter);

/** 整合路由 */
router.use(commonRouter.routes(), commonRouter.allowedMethods());
router.use(authRouter.routes(), authRouter.allowedMethods());
router.use(managerRouter.routes(), managerRouter.allowedMethods());
router.use(wechatRouter.routes(), wechatRouter.allowedMethods());

export default router;
