'use strict';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nconf from 'nconf';
import { STRING, INTEGER, BIGINT } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      }, // 用户id
      phone: {
        type: STRING(20),
        allowNull: false,
        defaultValue: ''
      }, // 电话
      account: {
        type: STRING(50),
        allowNull: false,
        unique: true,
        defaultValue: ''
      }, // 账户
      password: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 密码(加盐哈希)
      nickname: {
        type: STRING(30),
        allowNull: false,
        defaultValue: ''
      }, // 昵称
      realName: {
        type: STRING(50),
        allowNull: false,
        defaultValue: ''
      }, // 真实姓名
      email: {
        type: STRING(128),
        allowNull: false,
        defaultValue: ''
      },
      appSecret: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // jwt
      avatar: {
        type: STRING(512),
        allowNull: false,
        defaultValue: ''
      }, // 头像
      sign: {
        type: STRING(300),
        allowNull: false,
        defaultValue: '这个人很懒，什么都没有记录。。。'
      }, // 个性签名
      registerAt: {
        type: BIGINT,
        allowNull: false,
        defaultValue: Date.now()
      } // 注册时间
    }, {
      hooks: {
        beforeCreate: (user, option) => {
          // 哈希密码，生成appSecret
          return bcrypt.genSalt(nconf.get('saltRound'))
            .then(salt => {
              return bcrypt.hash(user.password, salt)
                .then(hash => {
                  user.password = hash;
                  user.appSecret = GetHmac();
                });
            })
            .catch(error => {
              return error;
            });
        }
      },
      indexes: [
        {
          method: 'BTREE',
          fields: ['phone', 'account', 'email']
        }
      ]
    }
  );

  function GetHmac (params) {
    const hmac = crypto.createHmac('sha256', nconf.get('secret_key'));
    hmac.update(Date.now().toString());
    return hmac.digest('hex');
  }

  Users.associate = Models => {
    Models.Users.hasMany(Models.Albums, { foreignKey: 'userId' });
    Models.Users.hasMany(Models.AlbumConfig, { foreignKey: 'userId' });
  };

  Users.checkToken = async function (token) {
    const user = await this.findById(token.id);
    if (token.secret === user.appSecret) {
      return user;
    } else {
      throw Error('验证未通过!');
    }
  };

  Users.prototype.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  };
  return Users;
};
