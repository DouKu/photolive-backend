'use strict';
import _ from 'lodash';
import nconf from 'nconf';

const filterLevelField = (albumData, albumType) => {
  if (!_.isArray(albumData)) {
    return _.omit(albumData, nconf.get(`albumAccess:${albumType}`).removeFields);
  }
  return _.chain(albumData)
    .map(obj => {
      return _.omit(obj, nconf.get(`albumAccess:${albumType}`).removeFields);
    })
    .value();
};

export {
  filterLevelField
};
