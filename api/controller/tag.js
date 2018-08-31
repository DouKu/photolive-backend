'use strict';
import nconf from 'nconf';
import { Models } from '../../config/sequelize';

const addTag = async ctx => {
  ctx.verifyParams({
    album_id: 'int',
    titles: {
      type: 'array',
      itemType: 'string'
    }
  });
  const body = ctx.request.body;
  const nowTagsNum = await Models.Tags.count({
    where: { album_id: body.album_id }
  });
  const album = await Models.Albums.findOne({
    raw: true,
    where: { id: body.album_id }
  });
  checkAddTag(nowTagsNum, body.titles.length, album.album_type, ctx);
  const newTags = [];
  for (let title of body.titles) {
    newTags.push({ album_id: body.album_id, title: title });
  }
  await Models.Tags.bulkCreate(newTags);
  ctx.body = {
    code: 200,
    msg: '标签创建成功！'
  };
};

const updateTag = async ctx => {
  ctx.verifyParams({
    title: 'string'
  });
  const title = ctx.request.body.title;
  const tagId = ctx.params.tagId;
  await Models.Tags.update({ title }, {
    where: { id: tagId }
  });
  ctx.body = {
    code: 200
  };
};

const deleteTag = async ctx => {
  const tagId = ctx.params.tagId;
  const imgChcek = await Models.Images.findOne({
    include: [{
      model: Models.Tags,
      where: { id: tagId }
    }]
  });
  if (imgChcek) {
    ctx.throw(400, '有图片处于该标签下，请把该标签下的所有图片修改后再删除该标签');
  }
  await Models.Tags.destroy({
    where: { id: tagId }
  });
  ctx.body = {
    code: 200,
    msg: '标签删除成功！'
  };
};

export {
  addTag,
  updateTag,
  deleteTag
};

/** 检查参数 */
function checkAddTag (tagsNum, addNum, albumType, ctx) {
  const maxNum = nconf.get(`albumAccess:${albumType}`).titles;
  if (tagsNum >= maxNum || tagsNum + addNum > maxNum) {
    ctx.throw(400, '标签数量过多，请升级相册版本！');
  }
}
