'use strict';
import { STRING, INTEGER } from 'sequelize';

export default (sequelize, DataTypes) => {
  const EntryCard = sequelize.define(
    'EntryCard',
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
        type: STRING(20),
        allowNull: false,
        defaultValue: ''
      }, // 标题
      avatar: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 图片
      des: {
        type: STRING(50),
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
          fields: ['albumId']
        }
      ]
    }
  );

  EntryCard.associate = Models => {
    Models.EntryCard.belongsTo(Models.Albums, { foreignKey: 'albumId' });
    Models.EntryCard.belongsTo(Models.AlbumConfig, { foreignKey: 'albumId' });
  };

  return EntryCard;
};
