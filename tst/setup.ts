import 'reflect-metadata';
import 'jest-ts-auto-mock';

import kafkaHelper from './support/helpers/kafka';
import redisHelper from './support/helpers/redis';
import { CacheRepositoryFactory } from './support/factories/CacheRepositoryFactory';

beforeAll(async () => {
  await redisHelper.clean();
  await kafkaHelper.cleanKafkaQueue();
});

afterEach(async () => {
  await redisHelper.clean();
  await kafkaHelper.cleanKafkaQueue();
});

afterAll(() => {
  new CacheRepositoryFactory().create().closeConnection();
});
