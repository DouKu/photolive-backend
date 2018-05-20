'use strict';
import nconf from 'nconf';
nconf.argv();

// 命令行配置的变量优先
// 环境变量NODE_ENV后备
// dev作为默认参数
const CNF_PATH = nconf.get('CNF_PATH');

if (CNF_PATH) {
  // 参数传递配置文件的启动方式
  // node index.js --CNF_PATH=../test/config.coding.js
  console.log(
    `\x1b[32m%s%s%s\x1b[0m:`,
    'info:',
    'Server run by  using config file:',
    CNF_PATH
  );
  module.exports = require(CNF_PATH);
} else {
  // 环境变量传递配置文件中缀的启动方式
  // export NODE_ENV=production && node index.js
  nconf.env();
  const NODE_ENV = nconf.get('NODE_ENV') || 'development';
  console.log(
    `\x1b[32m%s%s%s\x1b[0m:`,
    'info:',
    `Server run by setting NODE_ENV AS: `,
    NODE_ENV
  );
  module.exports = require(`${__dirname}/env/config.${NODE_ENV}.js`);
}
