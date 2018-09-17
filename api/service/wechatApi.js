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
  const accessToken = token.access_token;
  const expiresIn = token.expires_in;
  dbUpsert('AccessToken', {
    type: 'wechat',
    access_token: accessToken,
    expires_in: expiresIn,
    update_at: Date.now()
  }, {}).then(function (result) {
    cb(null, result);
  }).catch(function (err) {
    cb(err);
  });
});

export {
  wechatAPI
};
