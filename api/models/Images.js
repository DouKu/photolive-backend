'use strict';
import { STRING, INTEGER } from 'sequelize';
import sequelize from '../../config/sequelize';

const Images = sequelize.define(
  'Images',
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    }, // 用户id
    activity_id: {
      type: INTEGER,
      allowNull: false
    }, // 活动关联
    tag_id: {
      type: INTEGER,
      allowNull: false
    }, // 标签关联
    url: {
      type: STRING(512),
      allowNull: false,
      defaultValue: ''
    }, // 图片url
    des: {
      type: STRING(30),
      allowNull: false,
      defaultValue: ''
    }, // 图片描述
    size: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0
    } // 图片大小
  }, {}
);

Images.associate = function (model) {
  Images.belongsTo(model.Activities, { foreignKey: 'activity_id' });
  Images.belongsTo(model.Tags, { foreignKey: 'tag_id' });
};

export default Images;
