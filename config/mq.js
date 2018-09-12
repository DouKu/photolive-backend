'use strict';
import amqp from 'amqplib';
import nconf from 'nconf';

let mqChannel = null;

async function connectRabbitMQ () {
  const connection = await amqp.connect(nconf.get('mq'));
  const channel = await connection.createChannel();
  channel.assertExchange('topic_logs', 'topic', { durable: false });
  mqChannel = channel;
};

function sendMessage (key, Msg) {
  mqChannel.publish('topic_logs', key, Buffer.from(Msg));
};

connectRabbitMQ().then(() => {
  console.info('connect to RabbitMQ success!');
}).catch(error => {
  console.log(error);
});

export {
  sendMessage
};
