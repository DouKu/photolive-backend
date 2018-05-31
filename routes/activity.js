'use strict';
import {
  addActivity,
  editActivity,
  listActivity
} from '../api/controller/activity';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 新建活动
  authRouter.post('/activity', addActivity);
  // 编辑活动
  authRouter.put('/activity/:actId', editActivity);
  // 活动列表
  authRouter.get('/activity', listActivity);
};
