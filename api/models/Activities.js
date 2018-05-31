'use strict';
import { STRING, INTEGER, DATE, NOW } from 'sequelize';

export default (sequelize, DataTypes) => {
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

  Activities.associate = Models => {
    Models.Activities.hasMany(Models.Tags, { foreignKey: 'activity_id' });
    Models.Activities.hasMany(Models.Images, { foreignKey: 'activity_id' });
    Models.Activities.belongsTo(Models.Users, { foreignKey: 'user_id' });
  };

  return Activities;
};
