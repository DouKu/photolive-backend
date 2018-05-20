'use strict';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nconf from 'nconf';
import { STRING, INTEGER, DATE, NOW } from 'sequelize';
import sequelize from '../../config/sequelize';

const saltRound = 10;
const users = sequelize.define(
  'users',
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    }, // 用户id
    phone: {
      type: STRING(20),
      allowNull: false,
      unique: true
    }, // 电话
    username: {
      type: STRING(50),
      allowNull: false,
      unique: true
    }, // 登录名
    password: {
      type: STRING(512),
      allowNull: false
    }, // 密码(加盐哈希)
    nickname: {
      type: STRING(30),
      allowNull: false,
      defaultValue: ''
    }, // 昵称
    realName: {
      type: STRING(20),
      allowNull: false,
      defaultValue: ''
    }, // 真实姓名
    appSecret: {
      type: STRING(512),
      allowNull: false,
      defaultValue: GetHmac()
    }, // jwt
    avatar: {
      type: STRING(512),
      allowNull: false,
      defaultValue: ''
    }, // 头像
    sign: {
      type: STRING(300),
      allowNull: false,
      defaultValue: ''
    }, // 个性签名
    createdAt: {
      type: DATE,
      allowNull: false,
      defaultValue: NOW
    } // 注册时间
  },
  {
    classMethods: {
      checkToken: async function (token) {
        const user = await this.findById(token.id);
        if (token.secret === user.appSecret) {
          return user;
        } else {
          throw Error('验证未通过!');
        }
      }
    },
    instanceMethods: {
      comparePassword: async function (password) {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
      }
    }
  }
);

function GetHmac (params) {
  const hmac = crypto.createHmac('sha256', nconf.get('secret_key'));
  hmac.update(Date.now().toString());
  return hmac.digest('hex');
}

users.usernameChk = function (username) {
  return this.findOne({ where: { username: username } });
};

users.beforeSave((user, option) => {
  if (user.changed('password')) {
    bcrypt.genSalt(saltRound)
      .then(salt => {
        bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
          });
      })
      .catch(error => {
        return error;
      });
  }
});

export default users;
