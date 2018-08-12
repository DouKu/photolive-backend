'use strict';
import {
  addAlbum,
  listMyAlbum
} from '../api/controller/album';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 新建相册
  authRouter.post('/album', addAlbum);
  // 用户创建的活动列表
  authRouter.get('/album', listMyAlbum);
};
