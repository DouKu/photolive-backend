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
      accessToken: {
        type: STRING,
        allowNull: false
      }, // token
      expiresIn: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      }, // 过期时间
      updateAt: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      }
    }, {}
  );

  return AccessToken;
};
