'use strict';
import { STRING, INTEGER, JSONB, ARRAY, BIGINT, SMALLINT } from 'sequelize';
import nconf from 'nconf';

export default (sequelize, DataTypes) => {
  const normalType = 1;
  const AlbumConfig = sequelize.define(
    'AlbumConfig',
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
      }, // 相册类别
      theme_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1
      }, // 相册主题id
      name: {
        type: STRING(50),
        allowNull: false,
        defaultValue: ''
      }, // 活动名(相册名)
      avatar: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 相册封面图
      activity_time: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      }, // 活动时间(用户配置)
      location: {
        type: STRING(200),
        allowNull: false,
        defaultValue: ''
      }, // 活动地点
      tags: {
        type: ARRAY(JSONB),
        allowNull: false,
        defaultValue: []
      }, // 标签
      start_page: {
        type: STRING(512),
        allowNull: false,
        defaultValue: nconf.get('defaultStartPage')
      }, // 启动页
      tiny_start_page: {
        type: STRING(512),
        allowNull: false,
        defaultValue: nconf.get('defaultTinyStartPage')
      },
      loading_gif: {
        type: STRING(512),
        allowNull: false,
        defaultValue: nconf.get('defaultLoadingGif')
      }, // 加载gif
      count_down: {
        type: SMALLINT,
        allowNull: false,
        defaultValue: 0
      }, // 倒数
      top_ad: {
        type: STRING(80),
        allowNull: false,
        defaultValue: ''
      }, // 顶部广告
      bottom_ad: {
        type: STRING(80),
        allowNull: false,
        defaultValue: ''
      }, // 底部广告文案
      bottom_ad_link: {
        type: STRING(500),
        allowNull: false,
        defaultValue: ''
      }, // 广告文案连接
      banners: {
        type: ARRAY(JSONB),
        allowNull: false,
        defaultValue: []
      }, // banner url
      share_avatar: {
        type: STRING(500),
        allowNull: false,
        defaultValue: ''
      }, // 分享图片
      share_title: {
        type: STRING(50),
        allowNull: false,
        defaultValue: ''
      }, // 分享标题
      share_des: {
        type: STRING(100),
        allowNull: false,
        defaultValue: ''
      }, // 分享描述
      interactive: {
        type: JSONB,
        allowNull: false,
        defaultValue: {
          comment: false,
          like: false,
          photo_message: false,
          hot_photo: false
        }
      }, // 互动功能设置
      water_mark: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 水印url
      config_judge: {
        type: JSONB,
        allowNull: false,
        defaultValue: {
          base: false,
          tag: true,
          start_page: false,
          banner: false,
          share: false,
          puzzle: false,
          entry_card: false,
          top_ad: false,
          bottom_ad: false,
          security: false
        }
      }, // 判断配置
      view: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      } // 浏览量
    }, {}
  );

  AlbumConfig.associate = Models => {
    Models.AlbumConfig.belongsTo(Models.Albums, { foreignKey: 'id' });
    Models.AlbumConfig.hasOne(Models.Entry, { foreignKey: 'album_id' });
    Models.AlbumConfig.hasMany(Models.EntryCard, { foreignKey: 'album_id' });
    Models.AlbumConfig.hasMany(Models.Tags, { foreignKey: 'album_id' });
    Models.AlbumConfig.hasMany(Models.Images, { foreignKey: 'album_id' });
    Models.AlbumConfig.belongsTo(Models.Users, { foreignKey: 'user_id' });
  };

  return AlbumConfig;
};
