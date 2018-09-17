'use strict';
import {
  getAlbumBase
} from '../api/controller/wechatApp';

module.exports = (router, authRouter, commonRouter, managerRouter, wechatRouter) => {
  commonRouter.get('/wechat/album/base/:albumId', getAlbumBase);
};
