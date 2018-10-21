'use strict';
import nconf from 'nconf';
import _ from 'lodash';
import { dbFindOne } from './dbtools';
import { deleteFile } from './qiniu';

function getFileKey (url) {
  if (url !== '' && url !== null && url !== undefined) {
    const key = url.match(/(\w)+(\.jpg|\.png|\.jpeg|\.gif)/);
    if (key !== null) {
      return key[0];
    } else {
      return '';
    }
  } else {
    return '';
  }
}

async function checkAndDeleteImg (data) {
  if (_.isObject(data)) {
    /** {origin, tiny, min} */
    await deleteImgObj(data);
  } else if (_.isString(data)) {
    await deleteUrl(data);
    /** [{old, new}] */
  } else if (_.isArray(data)) {
    /** url */
    await deleteArray(data);
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
  if (url !== '') {
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
}

async function deleteArray (array) {
  for (let item of array) {
    const oldFileKey = getFileKey(item.oldUrl);
    const newFileKey = getFileKey(item.newUrl);
    if (oldFileKey !== newFileKey && oldFileKey !== '') {
      const judge = await dbFindOne('Images', {
        where: { $or: [
          { origin: item.oldUrl },
          { min: item.oldUrl },
          { tiny: item.oldUrl }
        ] }
      });
      if (judge === null) {
        await deleteFile(getFileKey(item.oldUrl));
      }
    }
  }
}

export {
  getFileKey,
  checkAndDeleteImg
};
