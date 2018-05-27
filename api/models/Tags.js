'use strict';
import { STRING, INTEGER } from 'sequelize';
import sequelize from '../../config/sequelize';

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

Tags.associate = function (model) {
  Tags.hasMany(model.Images, { foreignKey: 'tag_id' });
  Tags.belongsTo(model.Activities, { foreignKey: 'activity_id' });
};

export default Tags;
