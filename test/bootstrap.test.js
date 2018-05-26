'use strict';
import '../config/nconf';
import fs from 'fs';
import path from 'path';
import app from '../config/koa';
import sequelize from '../config/sequelize';
const request = require('supertest').agent(app.callback());

// init db
describe('init db', () => {
  it('', async () => {
    const connection = await sequelize.sync({ force: true, hooks: true });
    if (connection) {
      const modelDir = path.join(__dirname, '../api/models');
      const files = fs.readdirSync(modelDir)
        .filter((file) => {
          return (file.indexOf('.') !== 0) && (file !== 'index.js');
        });
      for (let file of files) {
        // 导入模型与fixture数据然后插入数据
        const Model = require(path.join(modelDir, file));
        const fixtures = require(path.join(__dirname, './fixtures', file));
        for (let item of fixtures.default) {
          await Model.default.create(item);
        }
      }
    } else {
      console.log('connection error');
    }
  });
});

export {
  request
};
