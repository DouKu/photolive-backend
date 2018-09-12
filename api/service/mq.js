import { sendMessage } from '../../config/mq';

function albumLive (albumId, data) {
  const key = 'album.live.' + String(albumId);
  sendMessage(key, JSON.stringify(data));
};

export {
  albumLive
};
