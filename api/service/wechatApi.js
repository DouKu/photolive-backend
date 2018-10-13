import WeChatAPI from 'wechat-api';
import { dbFindOne, dbUpsert } from './dbtools';
import nconf from 'nconf';
const wechatAPI = new WeChatAPI(nconf.get('wechat:appId'), nconf.get('wechat:appSecret'), function (cb) {
  dbFindOne('AccessToken', { type: 'wechat' }).then(result => {
    if (!result) {
      return cb();
    }
    console.log('read token from mongoose:' + result.token);
    cb(null, result.token);
  }).catch(function (err) {
    cb(err);
  });
}, function (token, cb) {
  console.log('createToken:' + token);
  const accessToken = token.accessToken;
  const expiresIn = token.expiresIn;
  dbUpsert('AccessToken', {
    type: 'wechat',
    accessToken: accessToken,
    expiresIn: expiresIn,
    updateAt: Date.now()
  }, {}).then(function (result) {
    cb(null, result);
  }).catch(function (err) {
    cb(err);
  });
});

export {
  wechatAPI
};
