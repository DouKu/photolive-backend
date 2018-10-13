'use strict';
import { STRING, INTEGER, JSONB, ARRAY, BIGINT, SMALLINT } from 'sequelize';
import nconf from 'nconf';

export default (sequelize, DataTypes) => {
  const normalType = 1;
  const AlbumConfig = sequelize.define(
    'AlbumConfig',
    {
      id: {
        type: BIGINT,
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
      }, // 相册类别
      themeId: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1
      }, // 相册主题id
      tags: {
        type: ARRAY(JSONB),
        allowNull: false,
        defaultValue: []
      }, // 标签
      startPage: {
        type: STRING(512),
        allowNull: false,
        defaultValue: nconf.get('defaultStartPage')
      }, // 启动页
      tinyStartPage: {
        type: STRING(512),
        allowNull: false,
        defaultValue: nconf.get('defaultTinyStartPage')
      },
      loadingGif: {
        type: STRING(512),
        allowNull: false,
        defaultValue: nconf.get('defaultLoadingGif')
      }, // 加载gif
      countDown: {
        type: SMALLINT,
        allowNull: false,
        defaultValue: 0
      }, // 倒数
      topAd: {
        type: STRING(80),
        allowNull: false,
        defaultValue: ''
      }, // 顶部广告
      bottomAd: {
        type: STRING(80),
        allowNull: false,
        defaultValue: ''
      }, // 底部广告文案
      bottomAdLink: {
        type: STRING(500),
        allowNull: false,
        defaultValue: ''
      }, // 广告文案连接
      banners: {
        type: ARRAY(JSONB),
        allowNull: false,
        defaultValue: []
      }, // banner url
      shareAvatar: {
        type: STRING(500),
        allowNull: false,
        defaultValue: ''
      }, // 分享图片
      shareTitle: {
        type: STRING(50),
        allowNull: false,
        defaultValue: ''
      }, // 分享标题
      shareDes: {
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
          photoMessage: false,
          hotPhoto: false
        }
      }, // 互动功能设置
      waterMark: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 水印url
      configJudge: {
        type: JSONB,
        allowNull: false,
        defaultValue: {
          base: false,
          tag: true,
          startPage: false,
          banner: false,
          share: false,
          puzzle: false,
          entryCard: false,
          topAd: false,
          bottomAd: false,
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
    // Models.AlbumConfig.hasOne(Models.Entry, { foreignKey: 'albumId' });
    // Models.AlbumConfig.hasMany(Models.EntryCard, { foreignKey: 'albumId' });
    // Models.AlbumConfig.hasMany(Models.Tags, { foreignKey: 'albumId' });
    // Models.AlbumConfig.hasMany(Models.Images, { foreignKey: 'albumId' });
    // Models.AlbumConfig.belongsTo(Models.Users, { foreignKey: 'userId' });
  };

  return AlbumConfig;
};
