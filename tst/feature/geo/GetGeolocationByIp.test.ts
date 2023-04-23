import nock from 'nock';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus from 'http-status';

import kafkaHelper from 'tst/support/helpers/kafka';
import { generateClientIpCacheKey } from 'src/commons/helpers/generateCacheKey';
import { ipstackApiResponseMock } from 'tst/support/mocks/ipstack/apiResponseMock';
import { CacheRepositoryFactory } from 'tst/support/factories/CacheRepositoryFactory';
import { GetGeolocationByIpResponse } from 'src/commons/interfaces/GetGeolocationByIpResponse';
import { IpGeolocationConsumerFactory } from 'tst/support/factories/IpGeolocationConsumerFactory';
import { GetGeolocationByIpResponseError } from 'src/presentations/queue/kafka/consumers/interfaces/GetGeolocationByIpResponse';

const IP_STACK_API_URL = process.env.IP_STACK_API_URL;
const REDIS_CLIENT_IP_HASH = process.env.REDIS_CLIENT_IP_HASH;
const IP_STACK_API_ACCESS_KEY = process.env.IP_STACK_API_ACCESS_KEY;
const KAFKA_TOPIC_IP_GEOLOCATION = process.env.KAFKA_TOPIC_IP_GEOLOCATION;

describe('Given a notification to translates IPs into geographical locations on KAFKA_TOPIC_IP_GEOLOCATION', () => {
  const cacheRepository = new CacheRepositoryFactory().create();
  const ipGeolocationConsumer = new IpGeolocationConsumerFactory().create();

  beforeEach(async () => {
    await kafkaHelper.createTopic(KAFKA_TOPIC_IP_GEOLOCATION);
    await ipGeolocationConsumer.run();
  });

  afterEach(async () => {
    nock.cleanAll();
    await ipGeolocationConsumer.disconnect();
  });

  describe('When receive more than one message with same localization per client and IP within a time window specified in minutes', () => {
    const ipAddress = '199.222.550.143';
    const kafkaMessage = {
      ipAddress,
      clientId: uuidv4(),
      timestamp: Date.now(),
    };
    const clientIpCacheKey = generateClientIpCacheKey(
      kafkaMessage.ipAddress,
      kafkaMessage.clientId,
    );

    beforeAll(async () => {
      await cacheRepository.hset(
        REDIS_CLIENT_IP_HASH,
        clientIpCacheKey,
        JSON.stringify(kafkaMessage),
      );
      await kafkaHelper.publishMessages(
        [{ value: JSON.stringify(kafkaMessage) }],
        KAFKA_TOPIC_IP_GEOLOCATION,
      );
    });

    test('Then the application should not translates IPs into geographical locations', (done) => {
      ipGeolocationConsumer
        .on(`SUCCESS:${clientIpCacheKey}`, () => done.fail())
        .on(
          `ERROR:${clientIpCacheKey}`,
          (error: GetGeolocationByIpResponseError) => {
            expect(error).toStrictEqual(
              `The client and IP address ${clientIpCacheKey} combination has already been localized within the past 1 minute. Please wait before localizing again.`,
            );
            done();
          },
        );
    });
  });

  describe('When there is no message with same location per client and IP within a time window specified in minutes', () => {
    const ipstackApiResponse = ipstackApiResponseMock();
    const ipAddress = ipstackApiResponse.ip;
    const kafkaMessage = {
      ipAddress,
      clientId: uuidv4(),
      timestamp: Date.now(),
    };
    const clientIpCacheKey = generateClientIpCacheKey(
      kafkaMessage.ipAddress,
      kafkaMessage.clientId,
    );

    beforeAll(async () => {
      await kafkaHelper.publishMessages(
        [{ value: JSON.stringify(kafkaMessage) }],
        KAFKA_TOPIC_IP_GEOLOCATION,
      );

      nock(IP_STACK_API_URL)
        .get(`/${ipAddress}?access_key=${IP_STACK_API_ACCESS_KEY}`)
        .reply(HttpStatus.OK, ipstackApiResponse);
    });

    test('Then the application should translates IPs into geographical locations', (done) => {
      ipGeolocationConsumer
        .on(
          `SUCCESS:${clientIpCacheKey}`,
          (getGeolocationByIpResponse: GetGeolocationByIpResponse) => {
            expect(getGeolocationByIpResponse).toStrictEqual({
              city: expect.any(String),
              region: expect.any(String),
              country: expect.any(String),
              latitude: expect.any(Number),
              clientId: expect.any(String),
              ipAddress: expect.any(String),
              longitude: expect.any(Number),
              timestamp: expect.any(Number),
            });
            done();
          },
        )
        .on(`ERROR:${clientIpCacheKey}`, (err) => done.fail(err));
    });
  });
});
