'use strict';
import '../config/nconf';
import path from 'path';
import fs from 'fs';
import nconf from 'nconf';
import _ from 'lodash';
import app from '../config/koa';
import { Models, sequelize } from '../config/sequelize';
const request = require('supertest').agent(app.callback());

// init db
describe('init db', () => {
  it('', async () => {
    const connection = await sequelize.sync({ force: true, hooks: true });
    if (connection) {
      // 需要获取所有的
      const modelFiles = await readdirAsync(nconf.get('rootDir') + 'api/models/');
      let models = [];
      for (let file of modelFiles) {
        if (file.indexOf('.') !== 0 && file.slice(-3) === '.js' && file !== 'index.js') {
          models.push(file);
        }
      }
      models = sort(models);
      console.log(models);
      for (let file of models) {
        const fileName = file.slice(0, -3);
        const fixtures = require(path.join(__dirname, './fixtures', file));
        let cal = 0;
        for (let item of fixtures.default) {
          if (_.has(item, 'id')) {
            cal = item.id;
          } else {
            item.id = ++cal;
          }
          await Models[fileName].create(item);
        }
      }
    } else {
      console.log('connection error');
    }
  });
});

function readdirAsync (path) {
  return new Promise(function (resolve, reject) {
    fs.readdir(path, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// 把需要先mork的表放前面
function sort (files) {
  const frontFiles = ['Users.js', 'Albums.js', 'AlbumConfig.js', 'Tags.js'];
  for (let item of frontFiles) {
    for (let p = 0; p < files.length; p++) {
      if (files[p] === item) {
        files.splice(p, 1);
      }
    }
  }
  return frontFiles.concat(files);
}

export {
  request
};
