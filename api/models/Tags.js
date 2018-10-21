'use strict';
import { STRING, INTEGER } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Tags = sequelize.define(
    'Tags',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      }, // 用户id
      albumId: {
        type: INTEGER,
        allowNull: false
      },
      title: {
        type: STRING(20),
        allowNull: false,
        defaultValue: ''
      } // 标签名
    }, {
      indexes: [
        {
          method: 'BTREE',
          fields: ['albumId']
        }
      ]
    }
  );

  Tags.associate = Models => {
    // Models.Tags.hasMany(Models.Images, { foreignKey: 'tagId' });
    Models.Tags.belongsTo(Models.Albums, { foreignKey: 'albumId' });
  };

  return Tags;
};
