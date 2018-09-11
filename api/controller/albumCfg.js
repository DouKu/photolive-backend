'use strict';
// import _ from 'lodash';
import moment from 'moment';
import nconf from 'nconf';
import { Models } from '../../config/sequelize';
import {
  dbCreate, dbFindAll, dbFindOne,
  dbUpdate, dbDestroy, dbCount, dbUpdateOne
} from '../service/dbtools';
import { filterLevelField } from '../service/album';

// 添加相册
const addAlbum = async ctx => {
  ctx.verifyParams({
    name: 'string',
    avatar: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  body.user_id = ctx.state.userMess.id;
  body.expired_at = moment().add(1, 'months').format();
  await dbCreate(body);
  ctx.body = {
    code: 200
  };
};

const listMyAlbumBrief = async ctx => {
  let data = await dbFindAll('Albums', {
    attributes: ['id', 'name', 'avatar', 'created_at', 'expired_at'],
    where: { user_id: ctx.state.userMess.id },
    order: [['created_at', 'DESC']]
  });
  ctx.body = {
    code: 200,
    data,
    count: data.length
  };
};

/** 不含照片 */
const getAlbumDetail = async ctx => {
  const albumId = ctx.params.albumId;
  let data = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  let tags = await dbFindAll('Tags', {
    attributes: ['id', 'title'],
    where: { album_id: albumId },
    order: [['id', 'asc']]
  });
  data = filterLevelField(data, data.album_type);
  data.tags = tags;
  ctx.body = {
    code: 200,
    data
  };
};

const deleteAlbum = async ctx => {
  const albumId = ctx.params.albumId;
  await dbDestroy('Albums', {
    where: { id: albumId }
  });
  await dbDestroy('Tags', {
    where: { album_id: albumId }
  });
  await dbDestroy('Images', {
    where: { album_id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

/** ************************************************** */
/** 分开配置信息 */

const baseCfg = async ctx => {
  ctx.verifyParams({
    name: 'string',
    activity_time: 'int',
    location: 'string',
    theme_id: 'int'
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  // 检查更新
  const albumObj = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  checkBaseCfg(albumObj, ctx);
  await dbUpdate('Albums', body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

function checkBaseCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
}

const addTag = async ctx => {
  ctx.verifyParams({
    title: 'string'
  });
  const title = ctx.request.body.title;
  const albumId = ctx.params.albumId;
  const nowTagsNum = await dbCount('Tags', {
    where: { album_id: albumId }
  });
  const album = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  checkAddTag(nowTagsNum, album.album_type, ctx);
  const newTag = {
    album_id: albumId,
    title
  };
  const data = await dbCreate('Tags', newTag);
  ctx.body = {
    code: 200,
    data
  };
};

/** 检查参数 */
function checkAddTag (tagsNum, albumType, ctx) {
  const maxNum = nconf.get(`albumAccess:${albumType}`).tag;
  if (tagsNum >= maxNum || tagsNum + 1 > maxNum) {
    ctx.throw(400, '标签数量过多，请升级相册版本！');
  }
}

const updateTag = async ctx => {
  ctx.verifyParams({
    title: 'string'
  });
  const title = ctx.request.body.title;
  const tagId = ctx.params.tagId;
  const data = await dbUpdateOne('Tags', { title }, {
    where: { id: tagId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

const deleteTag = async ctx => {
  const tagId = ctx.params.tagId;
  const imgChcek = await dbFindOne('Images', {
    include: [{
      model: Models.Tags,
      where: { id: tagId }
    }]
  });
  if (imgChcek) {
    ctx.throw(400, '有图片处于该标签下，请把该标签下的所有图片修改后再删除该标签');
  }
  await dbDestroy('Tags', {
    where: { id: tagId }
  });
  ctx.body = {
    code: 200,
    msg: '标签删除成功！'
  };
};

const startPageCfg = async ctx => {
  ctx.verifyParams({
    start_page: { type: 'string', required: false },
    tiny_start_page: { type: 'string', required: false },
    loading_gif: { type: 'string', required: false },
    count_down: { type: 'int', required: false }
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  checkStartPageCfg(albumObj, body, ctx);
  await dbUpdate('Albums', body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

function checkStartPageCfg (albumObj, body, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (body.start_page !== null && body.start_page !== undefined) {
    if (body.start_page_tiny === null || body.start_page_tiny === undefined) {
      ctx.throw(423, '参数错误');
    }
  }
  if (body.start_page_tiny !== null && body.start_page_tiny !== undefined) {
    if (body.start_page === null || body.start_page === undefined) {
      ctx.throw(423, '参数错误');
    }
  }
  const gif = body.loading_gif;
  if (gif !== null && gif !== undefined) {
    if (!getAlbumAccess(albumObj.album_type, 'gif')) {
      ctx.throw(400, '该相册不允许配置加载gif，请升级相册');
    }
  }
}

const bannerCfg = async ctx => {
  ctx.verifyParams({
    banners: {
      type: 'array',
      itemType: 'string'
    }
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  checkBannerCfg(albumObj, body.banners, ctx);
  await dbUpdate('Albums', body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

function checkBannerCfg (albumObj, banners, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (banners.length > getAlbumAccess(albumObj.album_type, 'banner')) {
    ctx.throw(400, '请升级相册配置更多的首页banner！');
  };
}

const interactiveCfg = async ctx => {
  ctx.verifyParams({
    interactive: {
      type: 'object',
      rule: {
        comment: { type: 'bool', required: false },
        like: { type: 'bool', required: false },
        photo_message: { type: 'bool', required: false },
        hot_photo: { type: 'bool', required: false }
      }
    }
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  checkInteractiveCfg(albumObj, body.interactive, ctx);
  const newInteractive = Object.assign(albumObj.interactive, body.interactive);
  await dbUpdate('Albums', { interactive: newInteractive }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

function checkInteractiveCfg (album, data, ctx) {
  checkAlbumOwner(album, ctx);
  const InteractiveCfg = getAlbumAccess(album.album_type, 'interactive');
  const cfgKeys = Object.keys(data);
  for (let key of cfgKeys) {
    if (InteractiveCfg[key] !== true) {
      const text = nconf.get(`interactive:${key}`);
      ctx.throw(400, `请升级相册开启${text}功能~`);
    }
  }
}

const shareCfg = async ctx => {
  ctx.verifyParams({
    share_avatar: { type: 'string', required: false },
    share_title: { type: 'string', required: false },
    share_des: { type: 'string', required: false }
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  checkShareCfg(albumObj, ctx);
  await dbUpdate('Albums', body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

function checkShareCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
}

export {
  addAlbum,
  listMyAlbumBrief,
  getAlbumDetail,
  deleteAlbum,
  baseCfg,
  addTag,
  updateTag,
  deleteTag,
  startPageCfg,
  bannerCfg,
  interactiveCfg,
  shareCfg
};

function checkAlbumOwner (albumObj, ctx) {
  if (albumObj.user_id !== ctx.state.userMess.id) {
    ctx.throw(403, '无权修改该相册');
  }
}

function getAlbumAccess (albumType, field) {
  return nconf.get(`albumAccess:${albumType}:${field}`);
}
