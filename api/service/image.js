'use strict';
import nconf from 'nconf';
import { dbFindOne } from './dbtools';
import { deleteFile } from './qiniu';

function getFileKey (url) {
  const key = url.match(/\b(\w|%)+\b(.jpg|.png|jpeg)$/)[0];
  return key;
}

async function checkAndDeleteImg (imgObj) {
  const imgUrls = nconf.get('imgUrls');
  const deleteFiles = [];
  for (let key of imgUrls) {
    if (imgObj[key] !== '') {
      const judge = await dbFindOne('Images', { where: { key: imgObj[key] } });
      if (judge === null) {
        deleteFiles.push(getFileKey(imgObj[key]));
      }
    }
  }
  if (deleteFiles !== []) {
    for (let fileKey of deleteFiles) {
      await deleteFile(fileKey);
    }
  }
}

export {
  getFileKey,
  checkAndDeleteImg
};
