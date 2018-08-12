'use strict';
import moment from 'moment';
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
    code: 200,
    msg: '新建了一个新的活动！'
  };
};

// 获取我的所有活动
const listMyAlbum = async ctx => {
  let data = await Models.Albums.findAll({
    include: [{
      model: Models.User,
      attributes: ['id'],
      where: { id: ctx.state.userMess.id }
    }],
    order: [['created_at', 'DESC']]
  });
  ctx.body = {
    code: 200,
    data
  };
};

export {
  addAlbum,
  listMyAlbum
};
