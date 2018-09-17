import jwt from 'jsonwebtoken';
import nconf from 'nconf';
import crypto from 'crypto';
import { getToken, getUserInfo } from '../service/wechatSns';
import { wechatAPI } from '../service/wechatApi';
import { dbCreate, dbFindOne } from '../service/dbtools';

const getJSConfig = async ctx => {
  const jsApiList = [
    'checkJsApi',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'showAllNonBaseMenuItem',
    'translateVoice',
    'startRecord',
    'stopRecord',
    'onRecordEnd',
    'playVoice',
    'pauseVoice',
    'stopVoice',
    'uploadVoice',
    'downloadVoice',
    'chooseImage',
    'previewImage',
    'uploadImage',
    'downloadImage',
    'getNetworkType',
    'openLocation',
    'getLocation',
    'hideOptionMenu',
    'showOptionMenu',
    'closeWindow',
    'scanQRCode',
    'chooseWXPay',
    'openProductSpecificView',
    'configWXDeviceWiFi',
    'getWXDeviceTicket',
    'openWXDeviceLib',
    'closeWXDeviceLib',
    'getWXDeviceInfos'
  ];
  const param = {
    debug: nconf.get('wechat:debug'), // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: nconf.get('wechat:appId'), // 必填，公众号的唯一标识
    jsApiList: jsApiList, // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    url: ctx.query.url
  };
  wechatAPI.getJsConfig(param, (err, result) => {
    if (err) {
      ctx.throw(400, err);
    }
    ctx.body = {
      code: 200,
      data: result
    };
  });
};

const exchangeToken = async ctx => {
  const code = ctx.request.body.code;
  const body = await getToken(code);
  const refreshToken = body.refresh_token;
  const accessToken = body.access_token;
  const openid = body.openid;
  const userInfo = await getUserInfo(accessToken, openid);
  const user = await dbFindOne('WechatUsers', { openid });
  if (user !== null || user !== undefined) {
    await dbCreate('WechatUsers', {
      ...userInfo,
      refresh_token: refreshToken,
      access_token: accessToken
    });
  }
  const token = jwt.sign({
    user: JSON.parse(JSON.stringify(userInfo)),
    exp: Date.now()
  }, nconf.get('jwt_secret'));
  ctx.body = {
    code: 200,
    msg: '微信登录成功',
    data: {
      openid,
      token
    }
  };
};

const server = async ctx => {
  // let signature = ctx.query.signature;
  // let timestamp = ctx.query.timestamp;
  // let nonce = ctx.query.nonce;
  let echostr = ctx.query.echostr;
  // let array = [nconf.get('wechat:token'), timestamp, nonce];
  // array.sort();
  // let tempStr = array.join('');
  // const hashCode = crypto.createHash('sha1');
  // let resultCode = hashCode.update(tempStr, 'utf8').digest('hex');
  // if (resultCode === signature) {
  ctx.body = echostr;
  // } else {
  // ctx.body = 'mismatch';
  // }
};

export {
  exchangeToken,
  getJSConfig,
  server
};
