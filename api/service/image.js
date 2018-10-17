'use strict';
import nconf from 'nconf';
import _ from 'lodash';
import { dbFindOne } from './dbtools';
import { deleteFile } from './qiniu';

function getFileKey (url) {
  const key = url.match(/(\w)+(\.jpg|\.png|\.jpeg)/)[0];
  return key;
}

async function checkAndDeleteImg (data) {
  if (_.isObject(data)) {
    await deleteImgObj(data);
  } else {
    await deleteUrl(data);
  }
}

async function deleteImgObj (imgObj) {
  const imgUrls = nconf.get('imgUrls');
  const deleteFiles = [];
  for (let key of imgUrls) {
    if (imgObj[key] !== '') {
      const cond = {};
      cond[key] = imgObj[key];
      const judge = await dbFindOne('Images', { where: cond });
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

async function deleteUrl (url) {
  const judge = await dbFindOne('Images', {
    where: { $or: [
      { origin: url },
      { min: url },
      { tiny: url }
    ] }
  });
  if (judge === null) {
    await deleteFile(getFileKey(url));
  }
}

export {
  getFileKey,
  checkAndDeleteImg
};
