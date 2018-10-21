'use strict';
import { STRING, INTEGER } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Entry = sequelize.define(
    'Entry',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      }, // 用户id
      albumId: {
        type: INTEGER,
        allowNull: false
      }, // 相册id外键
      title: {
        type: STRING(50),
        allowNull: false,
        defaultValue: ''
      }, // 标题
      des: {
        type: STRING(200),
        allowNull: false,
        defaultValue: ''
      }, // 描述
      avatar: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // logo图
      link: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      } // 详情链接/跳转图片
    }, {
      indexes: [
        {
          method: 'BTREE',
          fields: ['albumId']
        }
      ]
    }
  );

  Entry.associate = Models => {
    Models.Entry.belongsTo(Models.Albums, { foreignKey: 'albumId' });
    Models.Entry.belongsTo(Models.AlbumConfig, { foreignKey: 'albumId' });
  };

  return Entry;
};
