'use strict';
import { STRING, INTEGER, BIGINT, SMALLINT } from 'sequelize';
import nconf from 'nconf';

export default (sequelize, DataTypes) => {
  const Images = sequelize.define(
    'Images',
    {
      id: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true
      }, // 用户id
      album_id: {
        type: INTEGER,
        allowNull: false
      }, // 活动关联
      tag_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      }, // 标签关联
      type: {
        type: SMALLINT,
        allowNull: false,
        defaultValue: nconf.get('imgTyp').img
      }, // 图片类别
      origin: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 原图url
      tiny: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 压缩图url
      min: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 极压缩图url
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
    }, {
      indexes: [
        {
          method: 'BTREE',
          fields: ['album_id', 'type', 'origin', 'tiny', 'min']
        }
      ]
    }
  );

  // Images.associate = Models => {
  //   Models.Images.belongsTo(Models.Albums, { foreignKey: 'album_id' });
  //   Models.Images.belongsTo(Models.Tags, { foreignKey: 'tag_id' });
  // };
  return Images;
};
