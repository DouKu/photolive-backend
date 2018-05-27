'use strict';
import { STRING, INTEGER, DATE, NOW } from 'sequelize';
import sequelize from '../../config/sequelize';

const Activities = sequelize.define(
  'Activities',
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    }, // 用户id
    user_id: {
      type: INTEGER,
      allowNull: false
    },
    name: {
      type: STRING(50),
      allowNull: false,
      defaultValue: ''
    }, // 活动名
    avatar: {
      type: STRING(512),
      allowNull: false,
      defaultValue: ''
    }, // 活动封面图
    created_at: {
      type: DATE,
      allowNull: false,
      defaultValue: NOW
    }, // 建立时间
    expired_at: {
      type: DATE,
      allowNull: false
    } // 过期时间
  }, {}
);

Activities.associate = function (model) {
  Activities.hasMany(model.Tags, { foreignKey: 'activity_id' });
  Activities.hasMany(model.Images, { foreignKey: 'activity_id' });
  Activities.belongsTo(model.Users, { foreignKey: 'user_id' });
};

export default Activities;
