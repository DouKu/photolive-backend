'use strict';
import {
  getAlbumBase
} from '../api/controller/wechatApp';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  commonRouter.get('/wechat/album/base/:albumId', getAlbumBase);
};
