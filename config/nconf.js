'use strict';
import nconf from 'nconf';
import config from './index';

nconf.overrides(config);

export default nconf;
