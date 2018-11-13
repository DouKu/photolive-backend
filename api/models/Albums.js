'use strict';
import { INTEGER, BIGINT, STRING } from 'sequelize';
import nconf from 'nconf';

export default (sequelize, DataTypes) => {
  const normalType = 1;
  const Albums = sequelize.define(
    'Albums',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: INTEGER,
        allowNull: false
      }, // 用户id
      albumType: {
        type: INTEGER,
        allowNull: false,
        defaultValue: nconf.get(`albumAccess:${normalType}`).type
      }, // 相册服务类别()
      themeId: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1
      }, // 相册主题id
      name: {
        type: STRING(50),
        allowNull: false,
        defaultValue: nconf.get('initAlbumName')
      }, // 活动名(相册名)
      avatar: {
        type: STRING(512),
        allowNull: false,
        defaultValue: nconf.get('initAlbumAvatar')
      }, // 相册封面图
      activityTime: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      }, // 活动时间(用户配置)
      location: {
        type: STRING(200),
        allowNull: false,
        defaultValue: ''
      }, // 活动地点
      store: {
        type: BIGINT,
        allowNull: false,
        defaultValue: nconf.get('defaultStore')
      }, // 存储容量
      storeUse: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      }, // 已用容量
      configExpiredAt: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      }, // 编辑过期时间
      imgNum: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      }, // 图片数量
      createdAt: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      }, // 建立时间
      expiredAt: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      } // 过期时间
    }, {
      indexes: [
        {
          method: 'BTREE',
          fields: ['createdAt', 'userId']
        }
      ]
    }
  );

  Albums.associate = Models => {
    Models.Albums.hasOne(Models.AlbumConfig, { foreignKey: 'id' });
    Models.Albums.hasMany(Models.EntryCard, { foreignKey: 'albumId' });
    Models.Albums.hasOne(Models.Entry, { foreignKey: 'albumId' });
    Models.Albums.hasMany(Models.Tags, { foreignKey: 'albumId' });
    Models.Albums.hasMany(Models.Images, { foreignKey: 'albumId' });
    Models.Albums.belongsTo(Models.Users, { foreignKey: 'userId' });
  };

  return Albums;
};
