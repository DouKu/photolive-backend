'use strict';
import {
  addAlbum,
  listMyAlbumBrief,
  getAlbumDetail,
  baseCfg,
  addTag,
  updateTag,
  deleteTag,
  startPageCfg,
  bannerCfg,
  interactiveCfg,
  shareCfg,
  testmq
} from '../api/controller/albumCfg';

/** 配置后台相册相关接口 */
module.exports = (router, authRouter, commonRouter, managerRouter, wechatRouter) => {
  // 新建相册
  authRouter.post('/album', addAlbum);
  // 我的相册列表
  authRouter.get('/album/brief', listMyAlbumBrief);
  // 相册详细信息
  authRouter.get('/album/cfg/:albumId', getAlbumDetail);
  // 相册基本信息配置
  authRouter.put('/album/cfg/base/:albumId', baseCfg);
  // 批量添加相册标签
  authRouter.put('/album/cfg/tag/add/:albumId', addTag);
  // 更新标签信息
  authRouter.put('/album/cfg/tag/:tagId', updateTag);
  // 删除相册标签
  authRouter.delete('/album/cfg/tag/:tagId', deleteTag);
  // 启动页配置
  authRouter.put('/album/cfg/startpage/:albumId', startPageCfg);
  // 相册banner配置
  authRouter.put('/album/cfg/banner/:albumId', bannerCfg);
  // 互动配置
  authRouter.put('/album/cfg/interactive/:albumId', interactiveCfg);
  // 相册分享配置
  authRouter.put('/album/cfg/share/:albumId', shareCfg);

  commonRouter.get('/album/testmq/:albumId', testmq);
};
