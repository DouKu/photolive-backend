'use strict';
import Koa from 'koa';
import nconf from 'nconf';
import json from 'koa-json';
import jwt from 'koa-jwt';
import logger from 'koa-logger';
import cors from 'kcors';
import parameter from 'koa-parameter';
import koaBody from 'koa-body';
import serve from 'koa-static';
import { join } from 'path';
import routes from '../routes/index';
import sequelize from './sequelize';
const app = module.exports = new Koa();

app.use(koaBody());

app.use(parameter(app));

app.use(json());

if (nconf.get('NODE_ENV') !== 'unittest') {
  app.use(cors());
  app.use(logger());
  app.use(serve(join(__dirname, '/public')));
}

app.use(
  jwt({ secret: nconf.get('jwt_secret') }).unless({
    path: [/^\/api\/v1/, /^\/api\/upload/]
  })
);

app.use(routes.routes(), routes.allowedMethods());

if (nconf.get('NODE_ENV') !== 'unittest') {
  sequelize.sync()
    .then(connection => {
      if (connection) {
        console.log('sequelize connection success!');
        app.listen(nconf.get('port') || 8426, nconf.get('host'), () => {
          console.log(
            `\x1b[33m%s\x1b[0m`,
            `Server running at http://${nconf.get('host')}:${nconf.get('port') || 8426}`
          );
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
}
