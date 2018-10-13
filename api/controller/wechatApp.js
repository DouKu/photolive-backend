'use strict';
import {
  dbFindAll, dbFindOne
} from '../service/dbtools';
import { filterWechatField } from '../service/album';

// 获取相册内容
const getAlbumBase = async ctx => {
  const albumId = ctx.params.albumId;
  let data = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  if (data === null || data.expiredAt <= Date.now()) {
    ctx.throw(400, '相册不存在或无法查看！');
  }
  let tags = await dbFindAll('Tags', {
    attributes: ['id', 'title'],
    where: { albumId: albumId },
    order: [['id', 'asc']]
  });

  data = filterWechatField(data, data.albumType);
  data.tags = tags;
  ctx.body = {
    code: 200,
    data
  };
};

const getAlbumImgs = async ctx => {
  const albumId = ctx.params.albumId;
  const imgs = await dbFindAll('Images', {
    attributes: ['id', 'tagId', 'tiny_url', 'origin_url', 'des', 'size'],
    where: { albumId: albumId },
    order: [['uploadAt', 'desc']]
  });
  ctx.body = {
    code: 200,
    data: imgs
  };
};

export {
  getAlbumBase,
  getAlbumImgs
};
