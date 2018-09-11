'use strict';
import fs from 'fs';
import path from 'path';
import nconf from 'nconf';
import Sequelize from 'sequelize';
require('pg').defaults.parseInt8 = true;

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

const sequelize = new Sequelize(
  nconf.get('postgres:database'),
  nconf.get('postgres:username'),
  nconf.get('postgres:pass'),
  Object.assign(nconf.get('postgres:options'), {
    operatorsAliases
  })
);

const Models = {};
const modelDir = path.join(__dirname, '../api/models/');

fs
  .readdirSync(modelDir)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(modelDir, file));
    Models[model.name] = model;
  });

Object.keys(Models).forEach(modelName => {
  if (Models[modelName].associate) {
    Models[modelName].associate(Models);
  }
});

Models.sequelize = sequelize;
Models.Sequelize = Sequelize;

export {
  sequelize,
  Models
};
