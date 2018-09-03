import { mqChannel } from '../../config/mq';

async function mqSend (data, queue) {
  await mqChannel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};

export {
  mqSend
};
