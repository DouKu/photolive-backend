'use strict';
import { STRING, INTEGER, BIGINT } from 'sequelize';

export default (sequelize, DataTypes) => {
  const AccessToken = sequelize.define(
    'AccessToken',
    {
      type: {
        type: STRING,
        unique: true
      }, // wechat
      access_token: {
        type: STRING,
        allowNull: false
      }, // token
      expires_in: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      }, // 过期时间
      update_at: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      }
    }, {}
  );

  return AccessToken;
};
