'use strict';
import '../config/nconf';
import path from 'path';
import app from '../config/koa';
import { Models, sequelize } from '../config/sequelize';
const request = require('supertest').agent(app.callback());

// init db
describe('init db', () => {
  it('', async () => {
    const connection = await sequelize.sync({ force: true, hooks: true });
    if (connection) {
      const fileNames = ['Users', 'Activities', 'Tags', 'Images'];
      for (let i = 0; i < fileNames.length; i++) {
        // 导入模型与fixture数据然后插入数据
        const file = fileNames[i] + '.js';
        const fixtures = require(path.join(__dirname, './fixtures', file));
        for (let item of fixtures.default) {
          await Models[fileNames[i]].create(item);
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
