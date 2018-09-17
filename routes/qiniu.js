'use strict';
import {
  getUploadToken,
  upload, uploadBase64
} from '../api/controller/qiniu';

module.exports = (router, authRouter, commonRouter, managerRouter, wechatRouter) => {
  // 获取上传凭证
  authRouter.get('/uploadToken', getUploadToken);
  // 上传文件
  authRouter.post('/upload', upload);
  // 上传base64
  authRouter.post('/upBase64', uploadBase64);
};
