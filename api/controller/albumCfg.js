'use strict';
import _ from 'lodash';
import moment from 'moment';
import nconf from 'nconf';
import {
  dbCreate, dbFindAll, dbFindOne, dbFindById,
  dbUpdate, dbDestroy, dbUpdateOne
} from '../service/dbtools';
import { filterLevelField } from '../service/album';
import { albumLive } from '../service/mq';
import { getFsize } from '../service/qiniu';
import { checkAndDeleteImg } from '../service/image';

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
  let body = ctx.request.body;
  // 检查更新
  const albumObj = await dbFindOne('AlbumConfig', {
    where: { id: albumId }
  });
  checkBaseCfg(albumObj, ctx);
  body = changeConfigJudge(albumObj, body, 'base', true);
  await dbUpdate('AlbumConfig', body, {
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
  const album = await dbFindOne('AlbumConfig', {
    where: { id: albumId }
  });
  checkAddTag(album.tags.length, album, ctx);
  const newTag = {
    album_id: albumId,
    title
  };
  const data = await dbCreate('Tags', newTag);
  const tags = album.tags;
  tags.push({ id: data.id, title });
  await dbUpdateOne('AlbumConfig', { tags }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

function checkAddTag (tagsNum, album, ctx) {
  checkAlbumOwner(album, ctx);
  const albumType = album.album_type;
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

  const tag = await dbUpdateOne('Tags', { title }, {
    where: { id: tagId }
  });
  const albumCfg = await dbFindOne('AlbumConfig', {
    where: { id: tag.album_id }
  });
  checkUpdateTag(albumCfg, ctx);
  for (let i = 0; i < albumCfg.tags.length; i++) {
    if (albumCfg.tags[i].id === tagId) {
      albumCfg.tags[i] = { id: tagId, title };
      break;
    }
  }
  await dbUpdateOne('AlbumConfig', { tags: albumCfg.tags }, {
    where: { id: tag.album_id }
  });
  ctx.body = {
    code: 200,
    data: {
      id: tagId,
      title
    }
  };
};

function checkUpdateTag (albumCfg, ctx) {
  checkAlbumOwner(albumCfg, ctx);
}

const deleteTag = async ctx => {
  const tagId = ctx.params.tagId;
  const imgCheck = await dbFindOne('Images', {
    where: { tag_id: tagId }
  });
  const tag = await dbFindById('Tags', tagId);
  const albumCfg = await dbFindById('AlbumConfig', tag.album_id);
  checkDeleteTag(imgCheck, albumCfg, ctx);
  await dbDestroy('Tags', {
    where: { id: tagId }
  });
  _.remove(albumCfg.tags, o => {
    return String(o.id) === tagId;
  });
  await dbUpdateOne('AlbumConfig', { tags: albumCfg.tags }, {
    where: { id: tag.album_id }
  });
  ctx.body = {
    code: 200,
    msg: '标签删除成功！'
  };
};

function checkDeleteTag (imgChcek, albumCfg, ctx) {
  checkAlbumOwner(albumCfg, ctx);
  if (imgChcek) {
    ctx.throw(400, '有图片处于该标签下，请把该标签下的所有图片修改后再删除该标签');
  }
}

const sortTag = async ctx => {
  ctx.verifyParams({
    tags: {
      type: 'array',
      itemType: 'object',
      rule: {
        id: 'int',
        title: 'string'
      }
    }
  });
  const albumId = ctx.params.albumId;
  const tags = ctx.request.body.tags;
  await dbUpdateOne('AlbumConfig', { tags }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    msg: 'success'
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
  const albumObj = await dbFindOne('AlbumConfig', {
    where: { id: albumId }
  });
  checkStartPageCfg(albumObj, body, ctx);
  await dbUpdate('AlbumConfig', body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

function checkStartPageCfg (albumObj, body, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (body.start_page !== null && body.start_page !== undefined) {
    if (body.tiny_start_page === null || body.tiny_start_page === undefined) {
      ctx.throw(423, '参数错误');
    }
  }
  if (body.tiny_start_page !== null && body.tiny_start_page !== undefined) {
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

/** 验证文件版 */
const addBanner = async ctx => {
  ctx.verifyParams({
    origin: { type: 'string' },
    tiny: { type: 'string' }
  });
  const albumId = ctx.params.albumId;
  const newBanner = ctx.request.body;
  const albumObj = await dbFindOne('AlbumConfig', {
    where: { id: albumId }
  });
  const banners = albumObj.banners;
  checkAddBanner(albumObj, banners, ctx);
  const stat = await getFsize(newBanner.origin);
  const newImg = await dbCreate('Images', {
    album_id: albumId,
    type: nconf.get('imgTyp').banner,
    origin: newBanner.origin,
    tiny: newBanner.tiny,
    size: stat.fsize
  });
  banners.push(Object.assign({ id: newImg.id }, newBanner));
  await dbUpdate('AlbumCfg', {
    banners
  }, {
    where: { id: albumId }
  });
  const data = _.omit(newImg, ['tag_id', 'min_url', 'des']);
  ctx.body = {
    code: 200,
    data
  };
};

function checkAddBanner (albumObj, banners, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (banners.length >= getAlbumAccess(albumObj.album_type, 'banner')) {
    ctx.throw(400, '请升级相册配置更多的首页banner！');
  };
}

const updateBanner = async ctx => {
  ctx.verifyParams({
    origin: { type: 'string' },
    tiny: { type: 'string' }
  });
  const bannerId = ctx.params.bannerId;
  const newBanner = ctx.request.body;
  const oldBanner = await dbFindById('Images', bannerId);
  const albumObj = await dbFindById('AlbumConfig', oldBanner.album_id);
  const bannerList = albumObj.banners;
  checkUpdateBanner(albumObj, ctx);
  for (let i = 0; i < bannerList.length; i++) {
    if (bannerList[i].id === bannerId) {
      bannerList[i] = Object.assign({ id: bannerId }, newBanner);
      break;
    }
  }
  await dbUpdateOne('Images', {
    origin: newBanner.origin,
    tiny: newBanner.tiny
  }, { where: { id: bannerId } });
  await dbUpdateOne('AlbumConfig', { banners: bannerList }, {
    where: { id: albumObj.id }
  });
  await checkAndDeleteImg(oldBanner);
  ctx.body = {
    code: 200
  };
};

function checkUpdateBanner (albumCfg, ctx) {
  checkAlbumOwner(albumCfg, ctx);
}

const deleteBanner = async ctx => {
  const bannerId = ctx.params.bannerId;
  const banner = await dbFindById('Images', bannerId);
  const albumCfg = await dbFindById('AlbumConfig', banner.album_id);
  checkDeleteBanner(albumCfg, ctx);
  _.remove(albumCfg.banners, o => {
    return String(o.id) === bannerId;
  });
  await dbDestroy('Images', {
    where: { id: bannerId }
  });
  await dbUpdateOne('AlbumConfig', { banners: albumCfg.banners }, {
    where: { id: banner.album_id }
  });
  await checkAndDeleteImg(banner);
  ctx.body = {
    code: 200
  };
};

function checkDeleteBanner (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
}

const sortBanner = async ctx => {
  ctx.verifyParams({
    bannerIds: {
      type: 'array',
      itemType: 'int'
    }
  });
  const ids = ctx.request.body.bannerIds;
  const albumId = ctx.params.albumId;
  const albumObj = await dbFindById('AlbumConfig', albumId);
  const OldBanners = albumObj.banners;
  const banners = checkSortBanner(albumObj, ids, OldBanners, ctx);
  await dbUpdateOne('AlbumConfig', { banners }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

function checkSortBanner (albumCfg, ids, OldBanners, ctx) {
  checkAlbumOwner(albumCfg, ctx);
  const banners = [];
  for (let id of ids) {
    const objs = _.filter(OldBanners, o => { return o.id === id; });
    if (objs.length !== 1) {
      ctx.throw(400, '参数错误');
    }
    banners.push(objs);
  }
  return banners;
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

const testmq = async ctx => {
  const albumId = ctx.params.albumId;
  albumLive(albumId, { a: 'lalala' });
  ctx.body = {
    code: 200
  };
};

export {
  addAlbum,
  listMyAlbumBrief,
  getAlbumDetail,
  deleteAlbum,
  baseCfg,
  addTag,
  updateTag,
  deleteTag,
  sortTag,
  startPageCfg,
  addBanner,
  updateBanner,
  deleteBanner,
  sortBanner,
  interactiveCfg,
  shareCfg,
  testmq
};

function checkAlbumOwner (albumObj, ctx) {
  if (albumObj.user_id !== ctx.state.userMess.id) {
    ctx.throw(403, '无权修改该相册');
  }
}

function getAlbumAccess (albumType, field) {
  return nconf.get(`albumAccess:${albumType}:${field}`);
}

function changeConfigJudge (obj, data, key, bool) {
  data.config_judge = obj.config_judge;
  data.config_judge[key] = bool;
  return data;
}
