'use strict';
import { INTEGER, BIGINT } from 'sequelize';
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
      user_id: {
        type: INTEGER,
        allowNull: false
      }, // 用户id
      album_type: {
        type: INTEGER,
        allowNull: false,
        defaultValue: nconf.get(`albumAccess:${normalType}`).type
      }, // 相册服务类别()
      theme_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1
      }, // 相册主题id
      store: {
        type: BIGINT,
        allowNull: false,
        defaultValue: nconf.get('defaultStore')
      }, // 存储容量
      store_use: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      }, // 已用容量
      config_expired_at: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      }, // 编辑过期时间
      created_at: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      }, // 建立时间
      expired_at: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      } // 过期时间
    }, {
      indexes: [
        {
          method: 'BTREE',
          fields: ['created_at', 'user_id']
        }
      ]
    }
  );

  Albums.associate = Models => {
    Models.Albums.hasOne(Models.AlbumConfig, { foreignKey: 'id' });
    Models.AlbumConfig.hasMany(Models.EntryCard, { foreignKey: 'album_id' });
    Models.Albums.hasOne(Models.Entry, { foreignKey: 'album_id' });
    Models.Albums.hasMany(Models.Tags, { foreignKey: 'album_id' });
    Models.Albums.hasMany(Models.Images, { foreignKey: 'album_id' });
    Models.Albums.belongsTo(Models.Users, { foreignKey: 'user_id' });
  };

  return Albums;
};
