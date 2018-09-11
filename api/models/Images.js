'use strict';
import { STRING, INTEGER, BIGINT } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Images = sequelize.define(
    'Images',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      }, // 用户id
      album_id: {
        type: INTEGER,
        allowNull: false
      }, // 活动关联
      tag_id: {
        type: INTEGER,
        allowNull: false
      }, // 标签关联
      tiny_url: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 压缩图url
      origin_url: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 原图url
      des: {
        type: STRING(30),
        allowNull: false,
        defaultValue: ''
      }, // 图片描述
      size: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      }, // 图片大小
      upload_at: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      } // 上传时间
    }, {}
  );

  Images.associate = Models => {
    Models.Images.belongsTo(Models.Albums, { foreignKey: 'album_id' });
    Models.Images.belongsTo(Models.Tags, { foreignKey: 'tag_id' });
  };
  return Images;
};
