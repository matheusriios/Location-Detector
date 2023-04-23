import { Message } from 'kafkajs';

import { KafkaQueue } from 'src/presentations/queue/kafka/KafkaQueue';

const kafkaQueue = new KafkaQueue();

const queue = kafkaQueue.client;
const topicsIpGeoLocation = [process.env.KAFKA_TOPIC_IP_GEOLOCATION];

const cleanKafkaQueue = async () => {
  await queue.admin().connect();

  const topics = await queue.admin().listTopics();

  await Promise.all(
    topics.map(async (topic) => {
      if (topicsIpGeoLocation.includes(topic))
        await queue.admin().deleteTopics({
          topics: [topic],
          timeout: 2000,
        });
    }),
  );

  await queue.admin().disconnect();
};

const createTopic = async (topic: string) => {
  await queue.admin().connect();

  await queue.admin().createTopics({
    waitForLeaders: false,
    topics: [{ topic }],
  });

  await queue.admin().disconnect();
};

const publishMessages = async (messages: Message[], topic: string) => {
  const producer = queue.producer();

  await producer.connect();

  await producer.send({
    topic,
    messages,
  });

  await producer.disconnect();
};

export default {
  createTopic,
  cleanKafkaQueue,
  publishMessages,
};
