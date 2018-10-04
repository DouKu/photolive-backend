import { sendMessage } from '../../config/mq';

/** 微信端照片直播 */
function albumLive (albumId, data) {
  const key = 'album.live.' + String(albumId);
  sendMessage(key, JSON.stringify(data));
};

/** 配置后台消息通知 */
function messagePush (userId, data) {
  const key = 'web.message.' + String(userId);
  sendMessage(key, JSON.stringify(data));
}

export {
  albumLive,
  messagePush
};
