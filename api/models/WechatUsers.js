'use strict';
import { STRING, BIGINT, SMALLINT } from 'sequelize';

export default (sequelize, DataTypes) => {
  const WechatUsers = sequelize.define(
    'WechatUsers',
    {
      openid: {
        type: STRING,
        allowNull: false,
        defaultValue: ''
      },
      nickname: {
        type: STRING,
        allowNull: false,
        defaultValue: ''
      },
      sex: {
        type: SMALLINT,
        allowNull: false,
        defaultValue: 0
      },
      city: {
        type: STRING,
        allowNull: false,
        defaultValue: ''
      },
      province: {
        type: STRING,
        allowNull: false,
        defaultValue: ''
      },
      country: {
        type: STRING,
        allowNull: false,
        defaultValue: ''
      },
      headimgurl: {
        type: STRING,
        allowNull: false,
        defaultValue: ''
      },
      // privilege: {
      //   type: ARRAY,
      //   allowNull: false,
      //   defaultValue: []
      // },
      accessToken: {
        type: STRING,
        allowNull: false,
        defaultValue: ''
      },
      refresh_token: {
        type: STRING,
        allowNull: false,
        defaultValue: ''
      },
      create_at: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      },
      updateAt: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      },
      realname: {
        type: STRING(50),
        allowNull: false,
        defaultValue: ''
      },
      phone: {
        type: STRING(20),
        allowNull: false,
        defaultValue: ''
      }
    }, {
      indexes: [
        {
          method: 'BTREE',
          fields: ['phone', 'openid', 'nickname']
        }
      ]
    }
  );

  return WechatUsers;
};
