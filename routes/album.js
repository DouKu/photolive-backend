'use strict';
import {
  addAlbum,
  listMyAlbumBrief,
  getAlbumDetail,
  albumBaseCfg,
  albumShareCfg,
  albumBannerCfg
} from '../api/controller/album';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 新建相册
  authRouter.post('/album', addAlbum);
  // 用户创建的活动列表
  authRouter.get('/album/brief', listMyAlbumBrief);
  // 相册详细信息
  authRouter.get('/album/:albumId', getAlbumDetail);
  // 相册基本信息配置
  authRouter.put('/album/cfg/base/:albumId', albumBaseCfg);
  // 相册分享配置
  authRouter.put('/album/cfg/share/:albumId', albumShareCfg);
  // 相册banner配置
  authRouter.put('/album/cfg/banner/:albumId', albumBannerCfg);
};
