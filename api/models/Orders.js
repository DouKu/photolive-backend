'use strict';
import { INTEGER, BIGINT, SMALLINT } from 'sequelize';
// import nconf from 'nconf';

export default (sequelize, DataTypes) => {
  const fields = {
    userId: {
      type: INTEGER,
      defaultValue: 0
    }, // 下单用户
    type: {
      type: INTEGER,
      defaultValue: 0
    }, // 订单类型
    state: {
      type: SMALLINT,
      defaultValue: 0
    }, // 订单状态
    sumPrice: {
      type: INTEGER,
      defaultValue: 0
    }, // 总价：分
    discount: {
      type: INTEGER,
      defaultValue: 0
    }, // 折扣 / 10000
    subPrice: {
      type: INTEGER,
      defaultValue: 0
    }, // 直减价格：分
    createAt: {
      type: BIGINT,
      defaultValue: Date.now()
    },
    updateAt: {
      type: BIGINT,
      defaultValue: Date.now()
    }
  };
  const keys = Object.keys(fields);
  for (let key of keys) {
    fields[key].allowNull = false;
  }
  fields.id = {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true
  };
  const Schema = sequelize.define(
    'Orders',
    fields, {
      indexes: [
        {
          method: 'BTREE',
          fields: ['userId', 'createAt', 'type']
        }
      ]
    }
  );

  Schema.associate = Models => {
    // Models.Images.belongsTo(Models.Tags, { foreignKey: 'tagId' });
  };
  return Schema;
};
