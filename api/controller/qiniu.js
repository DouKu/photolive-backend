import qiniu from 'qiniu';
import nconf from 'nconf';
import path from 'path';
import crypto from 'crypto';
import { uploadFile, upload64, upToQiniu, removeTemImage } from '../service/qiniu';

const getUploadToken = async ctx => {
  const key = crypto.createHash('md5')
    .update((Date.now() + Math.floor(Math.random() * 10).toString()))
    .digest('hex') + '-' + ctx.query.fileName;

  const bucket = nconf.get('qiniu').Bucket;
  const accessKey = nconf.get('qiniu').ACCESS_KEY;
  const secretKey = nconf.get('qiniu').SECRET_KEY;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);

  const uploadToken = putPolicy.uploadToken(mac);

  ctx.body = {
    code: 200,
    key,
    uploadToken,
    domain: nconf.get('qiniu').Domain
  };
};

const upload = async ctx => {
  // ignore non-POSTs
  const serverPath = path.join(__dirname, '../../.tmp/');
  // 获取上存图片
  const result = await uploadFile(ctx, {
    fileType: 'album',
    path: serverPath
  });
  const imgPath = path.join(serverPath, result.imgPath);
  // 上传到七牛
  const qiniu = await upToQiniu(imgPath, result.imgKey);
  // 上存到七牛之后 删除原来的缓存图片
  removeTemImage(imgPath);
  ctx.body = {
    code: 200,
    imgUrl: `${nconf.get('qiniu').Domain}${qiniu.key}`,
    fsize: qiniu.fsize
  };
};

const uploadBase64 = async ctx => {
  // ignore non-POSTs
  const serverPath = path.join(__dirname, '../../.tmp/');
  // 获取上存图片
  const result = await upload64(ctx, {
    fileType: 'album',
    path: serverPath
  });
  const imgPath = path.join(serverPath, result.imgPath);
  // 上传到七牛
  // 上传到七牛
  const qiniu = await upToQiniu(imgPath, result.imgKey);
  // 上存到七牛之后 删除原来的缓存图片
  removeTemImage(imgPath);
  ctx.body = {
    code: 200,
    imgUrl: `${nconf.get('qiniu').Domain}${qiniu.key}`,
    fsize: qiniu.fsize
  };
};

export {
  getUploadToken,
  upload,
  uploadBase64
};
