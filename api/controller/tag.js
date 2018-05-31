'use strict';
import { Models } from '../../config/sequelize';

const addTag = async ctx => {
  ctx.verifyParams({
    activity_id: 'int',
    title: 'string'
  });
  const body = ctx.request.body;
  await Models.Tags.create(body);
};

export {
  addTag
};
