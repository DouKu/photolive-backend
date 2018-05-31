'use strict';
import { STRING, INTEGER } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Tags = sequelize.define(
    'Tags',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      }, // 用户id
      activity_id: {
        type: INTEGER,
        allowNull: false
      },
      title: {
        type: STRING(20),
        allowNull: false,
        defaultValue: ''
      } // 标签名
    }, {}
  );

  Tags.associate = Models => {
    Tags.hasMany(Models.Images, { foreignKey: 'tag_id' });
    Tags.belongsTo(Models.Activities, { foreignKey: 'activity_id' });
  };

  return Tags;
};
