'use strict';
import {
  addTag,
  updateTag,
  deleteTag
} from '../api/controller/tag';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 批量添加相册标签
  authRouter.post('/album/tag', addTag);
  // 更新标签信息
  authRouter.put('/album/tag/:tagId', updateTag);
  // 删除相册标签
  authRouter.delete('/album/tag/:tagId', deleteTag);
};
