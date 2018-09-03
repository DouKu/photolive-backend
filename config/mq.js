'use strict';
import nconf from 'nconf';
import amqp from 'amqplib';

let mqChannel = null;

async function connectRabbitMQ () {
  const connection = await amqp.connect(nconf.get('mq'));

  const channel = await connection.createChannel();
  const queues = Object.values(nconf.get('mqQueues'));
  for (let queue of queues) {
    await channel.assertQueue(queue);
    console.info(`assert rabbitmq queue: ${queue}, success!`);
  };
  mqChannel = channel;
};

connectRabbitMQ().then((channel) => {
  console.info('connect to RabbitMQ success!');
}).catch(error => {
  console.log(error);
  setTimeout(connectRabbitMQ, 10000);
});

export {
  mqChannel
};
