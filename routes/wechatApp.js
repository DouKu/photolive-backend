'use strict';
import {
  getAlbumMsg
} from '../api/controller/wechatApp';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  commonRouter.get('/wechat/album/:albumId', getAlbumMsg);
};
