import { Models } from '../../config/sequelize';
import _ from 'lodash';

const dbCreate = async (model, data) => {
  const val = await Models[model].create(data);
  return val;
};

const dbFindById = async (model, id) => {
  const val = await Models[model].findOne({
    where: { id },
    raw: true
  });
  return val;
};

const dbFindOne = async (model, filter) => {
  const baseParam = { raw: true };
  const fullParam = Object.assign(baseParam, filter);
  const val = await Models[model].findOne(fullParam);
  return val;
};

const dbFindAll = async (model, filter) => {
  const val = await Models[model].findAll(filter);
  return val;
};

const dbUpdateOne = async (model, newData, filter) => {
  const updateParam = { returning: true };
  const fullParam = Object.assign(updateParam, filter);
  const val = await Models[model].update(newData, fullParam);
  if (val[0]) {
    return val[1][0];
  }
  return [];
};

const dbUpdate = async (model, newData, filter) => {
  const updateParam = { returning: true };
  const fullParam = Object.assign(updateParam, filter);
  const val = await Models[model].update(newData, fullParam);
  return val;
};

const dbUpsert = async (model, Data, Otrions) => {
  const val = await Models[model].upsert(Data, Otrions);
  return val;
};

const dbDestroy = async (model, filter) => {
  const val = await Models[model].destroy(filter);
  return val;
};

const dbCount = async (model, filter) => {
  const val = await Models[model].count(filter);
  return val;
};

const dbBulkCreate = async (model, datas) => {
  let arrayData = null;
  if (_.isObject(datas)) {
    arrayData = [datas];
  } else {
    arrayData = datas;
  }
  const val = await Models[model].bulkCreate(arrayData);
  return val;
};

export {
  dbCreate,
  dbFindById,
  dbFindOne,
  dbFindAll,
  dbUpdateOne,
  dbUpdate,
  dbUpsert,
  dbDestroy,
  dbCount,
  dbBulkCreate
};
