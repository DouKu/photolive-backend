'use strict';
import {
  uploadImg
} from '../api/controller/images';

module.exports = (router, authRouter, commonRouter, managerRouter, wechatRouter) => {
  authRouter.put('/img/upload/:albumId', uploadImg);
};
