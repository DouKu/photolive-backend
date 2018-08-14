'use strict';
import { Models } from '../../config/sequelize';

const addTag = async ctx => {
  ctx.verifyParams({
    activity_id: 'int',
    title: 'string'
  });
  const body = ctx.request.body;
  await Models.Tags.create(body);
  ctx.body = {
    code: 200,
    msg: '标签创建成功！'
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
  deleteTag
};
