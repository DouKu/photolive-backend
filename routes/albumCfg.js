'use strict';
import {
  addAlbum,
  listMyAlbumBrief,
  getAlbumDetail,
  baseCfg,
  addTag,
  updateTag,
  deleteTag,
  sortTag,
  startPageCfg,
  addBanner,
  updateBanner,
  deleteBanner,
  sortBanner,
  interactiveCfg,
  shareCfg,
  topAdCfg,
  bottomAdCfg,
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
  // 标签排序
  authRouter.put('/album/cfg/tag/sort/:albumId', sortTag);
  // 启动页配置
  authRouter.put('/album/cfg/startpage/:albumId', startPageCfg);
  // 相册banner配置
  authRouter.put('/album/cfg/banner/add/:albumId', addBanner);
  // banner 修改
  authRouter.put('/album/cfg/banner/:bannerId', updateBanner);
  // 删除banner
  authRouter.delete('/album/cfg/banner/:bannerId', deleteBanner);
  // banner排序
  authRouter.put('/album/cfg/banner/sort/:albumId', sortBanner);
  // 互动配置
  authRouter.put('/album/cfg/interactive/:albumId', interactiveCfg);
  // 相册分享配置
  authRouter.put('/album/cfg/share/:albumId', shareCfg);
  // 顶部广告
  authRouter.put('/album/cfg/topad/:albumId', topAdCfg);
  // 底部广告
  authRouter.put('/album/cfg/bottomad/:albumId', bottomAdCfg);
  commonRouter.get('/album/testmq/:albumId', testmq);
};
