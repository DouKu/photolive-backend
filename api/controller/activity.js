'use strict';
import moment from 'moment';
import { Models } from '../../config/sequelize';

// 添加活动
const addActivity = async ctx => {
  ctx.verifyParams({
    name: 'string',
    avatar: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  body.user_id = ctx.state.userMess.id;
  body.expired_at = moment().add(1, 'months').format();
  await Models.Activities.create(body);
  ctx.body = {
    code: 200,
    msg: '新建了一个新的活动！'
  };
};

// 修改活动信息
const editActivity = async ctx => {
  ctx.verifyParams({
    name: { type: 'string', required: false },
    avatar: { type: 'string', required: false }
  });
  const actId = ctx.params.actId;
  const body = ctx.request.body;
  await Models.Activities.update(body, { where: { id: actId } });
  ctx.body = {
    code: 200,
    msg: '活动信息修改成功！'
  };
};

// 获取所有活动
const listActivity = async ctx => {
  let data = await Models.Activities.findAll({
    include: [{
      model: Models.Users,
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
  addActivity,
  editActivity,
  listActivity
};
