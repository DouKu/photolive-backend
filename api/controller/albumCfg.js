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
import { checkAndDeleteImg, getFileKey } from '../service/image';

// 添加相册
const addAlbum = async ctx => {
  ctx.verifyParams({
    name: 'string',
    avatar: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  body.userId = ctx.state.userMess.id;
  body.expiredAt = moment().add(1, 'months').format();
  await dbCreate(body);
  ctx.body = {
    code: 200,
    success: true
  };
};

const listMyAlbumBrief = async ctx => {
  let data = await dbFindAll('Albums', {
    attributes: ['id', 'name', 'avatar', 'createdAt', 'expiredAt'],
    where: { userId: ctx.state.userMess.id },
    order: [['createdAt', 'DESC']]
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
  let baseData = await dbFindById('Albums', albumId);
  let configData = await dbFindById('AlbumConfig', albumId);
  let tags = await dbFindAll('Tags', {
    attributes: ['id', 'title'],
    where: { albumId: albumId },
    order: [['id', 'asc']]
  });
  let entry = await dbFindOne('Entry', { where: { albumId } });
  let data = Object.assign(baseData, configData);
  data = filterLevelField(data, data.albumType);
  data.tags = tags;
  data.entry = entry;
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
    where: { albumId: albumId }
  });
  await dbDestroy('Images', {
    where: { albumId: albumId }
  });
  ctx.body = {
    code: 200,
    success: true
  };
};

/** ************************************************** */
/** 分开配置信息 */

const getBase = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const data = await dbFindOne('Albums', {
    attributes: ['id', 'name', 'activityTime', 'location', 'themeId'],
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

const baseCfg = async ctx => {
  ctx.verifyParams({
    name: 'string',
    activityTime: 'int',
    location: 'string',
    themeId: 'int'
  });
  const albumId = Number(ctx.params.albumId);
  let body = ctx.request.body;
  // 检查更新
  const albumObj = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  const cfgObj = await dbFindById('AlbumConfig', albumId);
  checkBaseCfg(albumObj, ctx);
  await changeConfigJudge(cfgObj, 'base', true);
  await dbUpdate('Albums', body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkBaseCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
}

const getAlubmTag = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const data = await dbFindOne('AlbumConfig', {
    attributes: ['id', 'tags'],
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

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
    albumId,
    title
  };
  const data = await dbCreate('Tags', newTag);
  const tags = album.tags;
  tags.push({ id: data.id, title });
  await changeConfigJudge(album, 'tag', true);
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
  const albumType = album.albumType;
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
    where: { id: tag.albumId }
  });
  checkUpdateTag(albumCfg, ctx);
  for (let i = 0; i < albumCfg.tags.length; i++) {
    if (albumCfg.tags[i].id === tagId) {
      albumCfg.tags[i] = { id: tagId, title };
      break;
    }
  }
  await changeConfigJudge(albumCfg, 'tag', true);
  await dbUpdateOne('AlbumConfig', { tags: albumCfg.tags }, {
    where: { id: tag.albumId }
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
    where: { tagId: tagId }
  });
  const tag = await dbFindById('Tags', tagId);
  const albumCfg = await dbFindById('AlbumConfig', tag.albumId);
  checkDeleteTag(imgCheck, albumCfg, ctx);
  await dbDestroy('Tags', {
    where: { id: tagId }
  });
  _.remove(albumCfg.tags, o => {
    return String(o.id) === tagId;
  });
  await changeConfigJudge(albumCfg, 'tag', true);
  await dbUpdateOne('AlbumConfig', { tags: albumCfg.tags }, {
    where: { id: tag.albumId }
  });
  ctx.body = {
    code: 200,
    success: true
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
  const albumCfg = await dbFindById('AlbumConfig', albumId);
  await changeConfigJudge(albumCfg, 'tag', true);
  await dbUpdateOne('AlbumConfig', { tags }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    tags
  };
};

const getStartPage = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const data = await dbFindOne('AlbumConfig', {
    attributes: ['id', 'startPage', 'tinyStartPage', 'loadingGif', 'countDown'],
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

const startPageCfg = async ctx => {
  ctx.verifyParams({
    startPage: { type: 'string', required: false },
    tinyStartPage: { type: 'string', required: false },
    loadingGif: { type: 'string', required: false },
    countDown: { type: 'int', required: false }
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await dbFindOne('AlbumConfig', {
    where: { id: albumId }
  });
  const deleteImgs = checkStartPageCfg(albumObj, body, ctx);
  await dbUpdate('AlbumConfig', body, {
    where: { id: albumId }
  });
  await changeConfigJudge(albumObj, 'startPage', true);
  await checkAndDeleteImg(deleteImgs);
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkStartPageCfg (albumObj, body, ctx) {
  checkAlbumOwner(albumObj, ctx);
  const deleteImg = [];
  if (body.startPage !== null && body.startPage !== undefined) {
    if (body.tinyStartPage === null || body.tinyStartPage === undefined) {
      ctx.throw(423, '参数错误');
    }
    deleteImg.push({ old: albumObj.startPage, new: body.startPage });
  }
  if (body.tinyStartPage !== null && body.tinyStartPage !== undefined) {
    if (body.startPage === null || body.startPage === undefined) {
      ctx.throw(423, '参数错误');
    }
    deleteImg.push({ old: albumObj.tinyStartPage, new: body.tinyStartPage });
  }
  const gif = body.loadingGif;
  if (gif !== null && gif !== undefined) {
    if (!getAlbumAccess(albumObj.albumType, 'gif')) {
      ctx.throw(400, '该相册不允许配置加载gif，请升级相册');
    }
    deleteImg.push({ old: albumObj.loadingGif, new: gif });
  }
}

const getBanners = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const data = await dbFindOne('AlbumConfig', {
    attributes: ['id', 'banners'],
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

/** 验证文件版 */
const addBanner = async ctx => {
  ctx.verifyParams({
    origin: { type: 'string' },
    tiny: { type: 'string' }
  });
  const albumId = Number(ctx.params.albumId);
  const newBanner = ctx.request.body;
  const albumObj = await dbFindOne('AlbumConfig', {
    where: { id: albumId }
  });
  const banners = albumObj.banners;
  checkAddBanner(albumObj, banners, ctx);
  const size = await getFsize(newBanner.origin);
  const newImg = await dbCreate('Images', {
    albumId,
    type: nconf.get('imgTyp').banner,
    origin: newBanner.origin,
    tiny: newBanner.tiny,
    size
  });
  const data = Object.assign({ id: newImg.id }, newBanner);
  banners.push(data);
  await changeConfigJudge(albumObj, 'banner', true);
  await dbUpdate('AlbumConfig', {
    banners
  }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

function checkAddBanner (albumObj, banners, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (banners.length >= getAlbumAccess(albumObj.albumType, 'banner')) {
    ctx.throw(400, '请升级相册配置更多的首页banner！');
  };
}

const updateBanner = async ctx => {
  ctx.verifyParams({
    origin: { type: 'string' },
    tiny: { type: 'string' }
  });
  const bannerId = Number(ctx.params.bannerId);
  const newBanner = ctx.request.body;
  const oldBanner = await dbFindById('Images', bannerId);
  const albumObj = await dbFindById('AlbumConfig', oldBanner.albumId);
  const bannerList = albumObj.banners;
  checkUpdateBanner(albumObj, ctx);
  for (let i = 0; i < bannerList.length; i++) {
    if (bannerList[i].id === bannerId) {
      bannerList[i] = Object.assign({ id: bannerId }, newBanner);
      break;
    }
  }
  await changeConfigJudge(albumObj, 'banner', true);
  await dbUpdateOne('Images', {
    origin: newBanner.origin,
    tiny: newBanner.tiny
  }, { where: { id: bannerId } });
  await dbUpdateOne('AlbumConfig', { banners: bannerList }, {
    where: { id: albumObj.id }
  });
  await checkAndDeleteImg(oldBanner);
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkUpdateBanner (albumCfg, ctx) {
  checkAlbumOwner(albumCfg, ctx);
}

const deleteBanner = async ctx => {
  const bannerId = ctx.params.bannerId;
  const banner = await dbFindById('Images', bannerId);
  const albumCfg = await dbFindById('AlbumConfig', banner.albumId);
  checkDeleteBanner(albumCfg, ctx);
  _.remove(albumCfg.banners, o => {
    return String(o.id) === bannerId;
  });
  await dbDestroy('Images', {
    where: { id: bannerId }
  });
  await dbUpdateOne('AlbumConfig', { banners: albumCfg.banners }, {
    where: { id: banner.albumId }
  });
  await changeConfigJudge(albumCfg, 'banner', true);
  await checkAndDeleteImg(banner);
  ctx.body = {
    code: 200,
    success: true
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
  const albumId = Number(ctx.params.albumId);
  const albumObj = await dbFindById('AlbumConfig', albumId);
  const OldBanners = albumObj.banners;
  const banners = checkSortBanner(albumObj, ids, OldBanners, ctx);
  await changeConfigJudge(albumObj, 'banner', true);
  await dbUpdateOne('AlbumConfig', { banners }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    success: true
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
    banners.push(objs[0]);
  }
  return banners;
}

const getInteractive = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const data = await dbFindOne('AlbumConfig', {
    attributes: ['id', 'interactive'],
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

const interactiveCfg = async ctx => {
  ctx.verifyParams({
    interactive: {
      type: 'object',
      rule: {
        comment: { type: 'bool', required: false },
        like: { type: 'bool', required: false },
        photoMessage: { type: 'bool', required: false },
        hotPhoto: { type: 'bool', required: false }
      }
    }
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await dbFindOne('AlbumConfig', {
    where: { id: albumId }
  });
  checkInteractiveCfg(albumObj, body.interactive, ctx);
  const newInteractive = Object.assign(albumObj.interactive, body.interactive);
  await changeConfigJudge(albumObj, 'interactive', true);
  await dbUpdate('AlbumConfig', { interactive: newInteractive }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkInteractiveCfg (album, data, ctx) {
  checkAlbumOwner(album, ctx);
  const InteractiveCfg = getAlbumAccess(album.albumType, 'interactive');
  const cfgKeys = Object.keys(data);
  for (let key of cfgKeys) {
    if (InteractiveCfg[key] !== true) {
      const text = nconf.get(`interactive:${key}`);
      ctx.throw(400, `请升级相册开启${text}功能~`);
    }
  }
}

const getShare = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const data = await dbFindOne('AlbumConfig', {
    attributes: ['id', 'shareAvatar', 'shareTitle', 'shareDes'],
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

const shareCfg = async ctx => {
  ctx.verifyParams({
    shareAvatar: { type: 'string', required: false },
    shareTitle: { type: 'string', required: false },
    shareDes: { type: 'string', required: false }
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  checkShareCfg(albumObj, ctx);
  await changeConfigJudge(albumObj, 'share', true);
  await dbUpdate('AlbumConfig', body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkShareCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
}

const getTopAd = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const data = await dbFindOne('AlbumConfig', {
    attributes: ['id', 'topAd'],
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

const topAdCfg = async ctx => {
  ctx.verifyParams({
    topAd: 'string'
  });
  const albumId = ctx.params.albumId;
  const topAd = ctx.request.body.topAd;
  const albumObj = await dbFindById('AlbumConfig', albumId);
  checkTopAdCfg(albumObj, ctx);
  await changeConfigJudge(albumObj, 'topAd', true);
  await dbUpdate('AlbumConfig', { topAd }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkTopAdCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (albumObj.albumType < nconf.get('albumLevel:quality')) {
    ctx.throw(500, '请升级相册解锁顶部广告');
  }
}

const getBottomAd = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const data = await dbFindOne('AlbumConfig', {
    attributes: ['id', 'bottomAd', 'bottomAdLink'],
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data
  };
};

const bottomAdCfg = async ctx => {
  ctx.verifyParams({
    bottomAd: 'string',
    bottomAdLink: 'string'
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await dbFindById('AlbumConfig', albumId);
  checkBottomAdCfg(albumObj, ctx);
  /** 删除云文件 */
  const oldFileKey = getFileKey(albumObj.bottomAdLink);
  const newFileKey = getFileKey(body.bottomAdLink);
  if (oldFileKey !== newFileKey) {
    checkAndDeleteImg(albumObj.bottomAdLink);
  };
  await changeConfigJudge(albumObj, 'bottomAd', true);
  await dbUpdate('AlbumConfig', body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkBottomAdCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (albumObj.albumType < nconf.get('albumLevel:middle')) {
    ctx.throw(500, '请升级相册解锁顶部广告');
  }
}

const getEntryCfg = async ctx => {
  const albumId = Number(ctx.params.albumId);
  const entry = await dbFindOne('Entry', {
    where: { albumId }
  });
  const album = await dbFindOne('AlbumConfig', {
    attributes: ['entryCards'],
    where: { id: albumId }
  });
  const data = { id: albumId, entry, entryCards: album.entryCards };
  ctx.body = {
    code: 200,
    data
  };
};

const entryCfg = async ctx => {
  ctx.verifyParams({
    title: { type: 'string', required: false },
    des: { type: 'string', required: false },
    avatar: { type: 'string', required: false },
    link: { type: 'string', required: false }
  });
  const albumId = Number(ctx.params.albumId);
  const body = ctx.request.body;
  const albumObj = await dbFindById('AlbumConfig', albumId);
  const entry = await dbFindOne('Entry', { where: { albumId } });
  checkEntryCfg(albumObj, ctx);
  await changeConfigJudge(albumObj, 'entryCard', true);
  await dbUpdateOne('Entry', body, { where: { id: entry.id } });
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkEntryCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (albumObj.albumType < nconf.get('albumLevel:middle')) {
    ctx.throw(500, '请升级相册解锁词条配置');
  }
}

const addEntryCard = async ctx => {
  ctx.verifyParams({
    title: 'string',
    des: { type: 'string', required: false },
    avatar: 'string',
    link: { type: 'string', required: false }
  });
  const albumId = Number(ctx.params.albumId);
  const body = ctx.request.body;
  const albumObj = await dbFindById('AlbumConfig', albumId);
  checkAddEntryCard(albumObj, ctx);
  const newEntryCard = await dbCreate('EntryCard', Object.assign({ albumId: albumObj.id }, body));
  const newCards = albumObj.entryCards;
  newCards.push(Object.assign({ id: newEntryCard.id }, {
    title: body.title,
    avatar: body.avatar,
    link: body.link
  }));
  await changeConfigJudge(albumObj, 'entryCard', true);
  await dbUpdateOne('AlbumConfig', { entryCards: newCards }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data: newEntryCard
  };
};

function checkAddEntryCard (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (albumObj.albumType < nconf.get('albumLevel:middle')) {
    ctx.throw(500, '请升级相册解锁词条卡片配置');
  }
  if (albumObj.entryCards.length >= getAlbumAccess(albumObj.albumType, 'entryCards')) {
    ctx.throw(500, '词条卡片配置超出上限');
  }
}

const updateEntryCard = async ctx => {
  ctx.verifyParams({
    title: 'string',
    des: { type: 'string', required: false },
    avatar: 'string',
    link: 'string'
  });
  const entryCardId = Number(ctx.params.entryCardId);
  const body = ctx.request.body;
  const entryCard = await dbFindById('EntryCard', entryCardId);
  const albumObj = await dbFindById('AlbumConfig', entryCard.albumId);
  checkUpdateEntryCard(albumObj, ctx);
  const entryCardList = albumObj.entryCards;
  for (let i = 0; i < entryCardList.length; i++) {
    if (entryCardList[i].id === entryCardId) {
      entryCardList[i] = Object.assign({ id: entryCardId }, {
        title: body.title,
        avatar: body.avatar,
        link: body.link
      });
      break;
    }
  }
  const deleteImgs = [
    { old: entryCard.avatar, new: body.avatar },
    { old: entryCard.link, new: body.link }
  ];
  await changeConfigJudge(albumObj, 'entryCard', true);
  await checkAndDeleteImg(deleteImgs);
  await dbUpdateOne('EntryCard', body, { where: { id: entryCardId } });
  await dbUpdateOne('AlbumConfig', { entryCards: entryCardList }, { where: { id: albumObj.id } });
  ctx.body = {
    code: 200,
    data: Object.assign({ id: entryCardId }, body)
  };
};

function checkUpdateEntryCard (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (albumObj.albumType < nconf.get('albumLevel:middle')) {
    ctx.throw(500, '请升级相册解锁词条卡片配置');
  }
}

const deleteEntryCard = async ctx => {
  const entryCardId = Number(ctx.params.entryCardId);
  const entryCard = await dbFindById('EntryCard', entryCardId);
  const albumCfg = await dbFindById('AlbumConfig', entryCard.albumId);
  checkDeleteEntryCard(albumCfg, ctx);
  const newEntryCard = albumCfg.entryCards;
  _.remove(newEntryCard, o => {
    return o.id === entryCardId;
  });
  await changeConfigJudge(albumCfg, 'entryCard', true);
  await dbDestroy('EntryCard', {
    where: { id: entryCardId }
  });
  await dbUpdateOne('AlbumConfig', { entryCards: newEntryCard }, {
    where: { id: entryCard.albumId }
  });
  await checkAndDeleteImg(entryCard.link);
  await checkAndDeleteImg(entryCard.avatar);
  ctx.body = {
    code: 200,
    success: true
  };
};

function checkDeleteEntryCard (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
  if (albumObj.albumType < nconf.get('albumLevel:middle')) {
    ctx.throw(500, '请升级相册解锁词条卡片配置');
  }
}

const sortEntryCard = async ctx => {
  ctx.verifyParams({
    entryCards: { type: 'array', itemType: 'int' }
  });
  const albumId = Number(ctx.params.albumId);
  const cardIds = ctx.request.body.entryCards;
  const albumObj = await dbFindById('AlbumConfig', albumId);
  const newCards = checkSortEntryCard(albumObj, cardIds, ctx);
  await changeConfigJudge(albumObj, 'entryCard', true);
  await dbUpdateOne('AlbumConfig', { entryCards: newCards }, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200,
    data: newCards
  };
};

function checkSortEntryCard (albumObj, cardIds, ctx) {
  checkAlbumOwner(albumObj, ctx);
  const newCards = [];
  for (let id of cardIds) {
    const oldCard = _.filter(albumObj.entryCards, o => { return o.id === id; });
    if (oldCard.length === 0) {
      ctx.throw(400, '参数错误');
    }
    newCards.push(oldCard[0]);
  }
  return newCards;
}

const testmq = async ctx => {
  const albumId = ctx.params.albumId;
  albumLive(albumId, { a: 'lalala' });
  ctx.body = {
    code: 200,
    success: true
  };
};

export {
  addAlbum,
  listMyAlbumBrief,
  getAlbumDetail,
  deleteAlbum,
  getBase,
  baseCfg,
  getAlubmTag,
  addTag,
  updateTag,
  deleteTag,
  sortTag,
  getStartPage,
  startPageCfg,
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  sortBanner,
  getInteractive,
  interactiveCfg,
  getShare,
  shareCfg,
  getTopAd,
  topAdCfg,
  getBottomAd,
  bottomAdCfg,
  getEntryCfg,
  entryCfg,
  addEntryCard,
  updateEntryCard,
  deleteEntryCard,
  sortEntryCard,
  testmq
};

function checkAlbumOwner (albumObj, ctx) {
  if (albumObj.userId !== ctx.state.userMess.id) {
    ctx.throw(403, '无权修改该相册');
  }
}

function getAlbumAccess (albumType, field) {
  return nconf.get(`albumAccess:${albumType}:${field}`);
}

async function changeConfigJudge (obj, key, bool) {
  const configJudge = obj.configJudge;
  if (configJudge[key] !== bool) {
    configJudge[key] = bool;
    await dbUpdateOne('AlbumConfig', { configJudge }, {
      where: { id: obj.id }
    });
  }
}
