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
      album_id: {
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
      link: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      } // 详情链接/跳转图片
    }, {
      indexes: [
        {
          method: 'BTREE',
          fields: ['album_id']
        }
      ]
    }
  );

  return Entry;
};
