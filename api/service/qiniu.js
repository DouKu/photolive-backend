import fs from 'fs';
import Busboy from 'busboy';
import path from 'path';
import qiniu from 'qiniu';
import nconf from 'nconf';
import crypto from 'crypto';

// 写入目录
const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
  return false;
};

function getSuffix (fileName) {
  return fileName.split('.').pop();
}

// 重命名
function Rename (fileName) {
  return Math.random().toString(16).substr(2) + '.' + getSuffix(fileName);
}

function getName () {
  return 'upload-' + crypto.createHash('md5')
    .update((Date.now() + Math.floor(Math.random() * 10).toString()))
    .digest('hex');
}

// 删除文件
function removeTemImage (path) {
  fs.unlink(path, (err) => {
    if (err) {
      throw err;
    }
  });
}

/**
 * 上传文件到七牛云
 * @param {文件夹路径} localFile
 * @param {文件名} fileName
 */
const upToQiniu = (localFile, key) => {
  const bucket = nconf.get('qiniu').Bucket;
  const accessKey = nconf.get('qiniu').ACCESS_KEY;
  const secretKey = nconf.get('qiniu').SECRET_KEY;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket,
    returnBody: '{"key":"$(key)","fsize":$(fsize)}'
  };

  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;

  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  // 文件上传
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, null, localFile, putExtra, function (respErr,
      respBody, respInfo) {
      if (respErr) {
        reject(respErr);
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody);
      } else {
        resolve(respBody);
      }
    });
  });
};

// 上传到本地服务器
function uploadFile (ctx, options) {
  const _emmiter = new Busboy({ headers: ctx.req.headers });
  const fileType = options.fileType;
  const filePath = path.join(options.path, fileType);
  const confirm = mkdirsSync(filePath);
  if (!confirm) {
    return;
  }
  return new Promise((resolve, reject) => {
    _emmiter.on('file', function (fieldname, file, filename, encoding, mimetype) {
      const fileName = Rename(filename);
      const saveTo = path.join(path.join(filePath, fileName));
      file.pipe(fs.createWriteStream(saveTo));
      file.on('end', function () {
        resolve({
          imgPath: `/${fileType}/${fileName}`,
          imgKey: fileName
        });
      });
    });

    _emmiter.on('error', function (err) {
      reject(err);
    });

    ctx.req.pipe(_emmiter);
  });
}

function upload64 (ctx, options) {
  const fileType = options.fileType;
  const filePath = path.join(options.path, fileType);
  const confirm = mkdirsSync(filePath);
  if (!confirm) {
    return;
  }
  // 接收前台POST过来的base64
  const imgData = ctx.request.body.data;
  // 过滤data:URL
  const fileName = getName();
  const saveTo = path.join(path.join(filePath, fileName));
  const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = Buffer.from(base64Data, 'base64');
  return new Promise((resolve, reject) => {
    fs.writeFile(saveTo, dataBuffer, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          imgPath: `/${fileType}/${fileName}`,
          imgKey: fileName
        });
      }
    });
  });
};

function fileStat (key) {
  const bucket = nconf.get('qiniu').Bucket;
  const accessKey = nconf.get('qiniu').ACCESS_KEY;
  const secretKey = nconf.get('qiniu').SECRET_KEY;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  return new Promise((resolve, reject) => {
    bucketManager.stat(bucket, key, function (err, respBody, respInfo) {
      if (err) {
        reject(err);
      } else {
        if (respInfo.statusCode === 200) {
          resolve(respBody);
        } else {
          reject(respBody.error);
        }
      }
    });
  });
}

async function getFsize (url) {
  const key = url.match(/\b(\w|%)+\b(.jpg|.png|jpeg)$/)[0];
  const stat = await fileStat(key);
  return stat;
}

function deleteFile (key) {
  const bucket = nconf.get('qiniu').Bucket;
  const accessKey = nconf.get('qiniu').ACCESS_KEY;
  const secretKey = nconf.get('qiniu').SECRET_KEY;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  return new Promise((resolve, reject) => {
    bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
      if (err) {
        reject(err);
      } else {
        resolve(respBody);
      }
    });
  });
}

export {
  uploadFile,
  upToQiniu,
  removeTemImage,
  upload64,
  fileStat,
  getFsize,
  deleteFile
};
