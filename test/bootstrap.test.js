'use strict';
import '../config/nconf';
import '../config/sequelize';
import app from '../config/koa';
const request = require('supertest').agent(app.callback());

export {
  request
};
