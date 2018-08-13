'use strict';
// import _ from 'lodash';
import moment from 'moment';
import nconf from 'nconf';
import { Models } from '../../config/sequelize';

// 添加相册
const addAlbum = async ctx => {
  ctx.verifyParams({
    name: 'string',
    avatar: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  body.user_id = ctx.state.userMess.id;
  body.expired_at = moment().add(1, 'months').format();
  await Models.Albums.create(body);
  ctx.body = {
    code: 200
  };
};

const listMyAlbum = async ctx => {
  let data = await Models.Albums.findAll({
    where: { user_id: ctx.state.userMess.id },
    order: [['created_at', 'DESC']]
  });
  ctx.body = {
    code: 200,
    data
  };
};

/** ************************************************** */
/** 分开配置信息 */

const albumBaseCfg = async ctx => {
  ctx.verifyParams({
    name: 'string',
    activity_time: 'int',
    location: 'string'
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  // 检查更新
  const albumObj = await Models.Albums.findOne({
    where: { id: albumId }
  });
  checkBaseCfg(albumObj, ctx);
  await Models.Albums.findOneAndUpdate(body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

const albumShareCfg = async ctx => {
  ctx.verifyParams({
    share_avatar: 'string',
    share_title: 'string',
    share_des: 'string'
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await Models.Albums.findOne({
    where: { id: albumId }
  });
  checkShareCfg(albumObj, ctx);
  checkAlbumOwner(albumObj, ctx);
  await Models.Albums.findOneAndUpdate(body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

const albumBannerCfg = async ctx => {
  ctx.verifyParams({
    banners: 'string'
  });
  const albumId = ctx.params.albumId;
  const body = ctx.request.body;
  const albumObj = await Models.Albums.findOne({
    where: { id: albumId }
  });
  checkBannerCfg(albumObj, body.banners, ctx);
  await Models.Albums.findOneAndUpdate(body, {
    where: { id: albumId }
  });
  ctx.body = {
    code: 200
  };
};

function checkBaseCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
}

function checkShareCfg (albumObj, ctx) {
  checkAlbumOwner(albumObj, ctx);
}

function checkBannerCfg (albumObj, banners, ctx) {
  checkBannerCfg2(albumObj, banners, 'normal', ctx);
}

function checkBannerCfg2 (albumObj, banners, albumType, ctx) {
  checkAlbumOwner(albumObj, ctx);
  checkAlbumType(albumObj, albumType, ctx);
  checkBannerLen(banners, albumType, ctx);
}

function checkAlbumOwner (albumObj, ctx) {
  if (albumObj.user_id !== ctx.state.userMess.id) {
    ctx.throw(403, '无权修改该相册');
  }
}

function checkAlbumType (albumObj, albumType, ctx) {
  if (albumObj.album_type !== getAlbumAccess(albumType, 'type')) {
    ctx.throw(403, '相册类型不匹配');
  }
}

function checkBannerLen (banners, albumType, ctx) {
  if (banners.length > getAlbumAccess(albumType, 'banner')) {
    ctx.throw(400, '非法配置banner');
  }
}

function getAlbumAccess (albumType, field) {
  return nconf.get(`albumAccess:${albumType}:${field}`);
}

export {
  addAlbum,
  listMyAlbum,
  albumBaseCfg,
  albumShareCfg,
  albumBannerCfg
};
