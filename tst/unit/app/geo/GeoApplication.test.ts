import * as DateFns from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { createMock } from 'ts-auto-mock';

import { GeoApplication } from 'src/app/geo/GeoApplication';
import { IpStackService } from 'src/infra/services/ipstack/IpStackService';
import { CacheRepository } from 'src/infra/repositories/cache/interfaces/Repository';
import { GetGeolocationByIpProps } from 'src/commons/interfaces/GetGeolocationByIpProps';
import { generateClientIpCacheKey } from 'src/commons/helpers/generateCacheKey';
import { normalizeDuplicatedLocalizationErrorMessage } from 'src/commons/helpers/normalizeErrorMessages';
import { ipstackApiResponseMock } from 'tst/support/mocks/ipstack/apiResponseMock';

describe('SRC :: APP :: GEO APPLICATION', () => {
  const ipAddress = '199.222.550.143';
  let geoApplication: GeoApplication;
  let ipStackServiceMock: IpStackService;
  let cacheRepositoryMock: CacheRepository;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Given call to #getGeolocationByIp', () => {
    describe('When receive more than one message with same localization per client and IP within a time window specified in minutes', () => {
      const getGeolocationByIpProps: GetGeolocationByIpProps = {
        ipAddress,
        clientId: uuidv4(),
        timestamp: Date.now(),
      };
      const clientIpCacheKey = generateClientIpCacheKey(
        getGeolocationByIpProps.ipAddress,
        getGeolocationByIpProps.clientId,
      );

      beforeAll(() => {
        ipStackServiceMock = createMock<IpStackService>();
        cacheRepositoryMock = createMock<CacheRepository>({
          hget: jest
            .fn()
            .mockImplementation(() =>
              Promise.resolve(JSON.stringify(getGeolocationByIpProps)),
            ),
        });

        geoApplication = new GeoApplication(
          ipStackServiceMock,
          cacheRepositoryMock,
        );
      });

      test('Then the application should not translates IPs into geographical locations', async () => {
        const getGeolocationByIpResponse =
          await geoApplication.getGeolocationByIp(getGeolocationByIpProps);

        const duplicatedLocalizationErrorMessage =
          normalizeDuplicatedLocalizationErrorMessage(clientIpCacheKey);

        expect(getGeolocationByIpResponse).toStrictEqual({
          hasError: true,
          clientIpCacheKey,
          clientId: getGeolocationByIpProps.clientId,
          ipAddress: getGeolocationByIpProps.ipAddress,
          timestamp: getGeolocationByIpProps.timestamp,
          errorMessage: duplicatedLocalizationErrorMessage,
        });
      });
    });

    describe('When there is no message with same location per client and IP within a time window specified in minutes', () => {
      const getGeolocationByIpProps: GetGeolocationByIpProps = {
        ipAddress,
        clientId: uuidv4(),
        timestamp: DateFns.getTime(new Date('2033-04-23T10:00')),
      };
      const clientIpCacheKey = generateClientIpCacheKey(
        getGeolocationByIpProps.ipAddress,
        getGeolocationByIpProps.clientId,
      );

      beforeAll(() => {
        jest.useFakeTimers().setSystemTime(new Date('2033-04-23T10:03'));

        ipStackServiceMock = createMock<IpStackService>({
          getGeolocationByIp: jest.fn().mockImplementation(() =>
            Promise.resolve({
              city: ipstackApiResponseMock().city,
              region: ipstackApiResponseMock().region_name,
              country: ipstackApiResponseMock().country_name,
              latitude: ipstackApiResponseMock().latitude,
              longitude: ipstackApiResponseMock().longitude,
            }),
          ),
        });
        cacheRepositoryMock = createMock<CacheRepository>({
          hget: jest
            .fn()
            .mockImplementation(() =>
              Promise.resolve(JSON.stringify(getGeolocationByIpProps)),
            ),
        });

        geoApplication = new GeoApplication(
          ipStackServiceMock,
          cacheRepositoryMock,
        );
      });

      test('Then the application should translates IPs into geographical locations', async () => {
        const getGeolocationByIpResponse =
          await geoApplication.getGeolocationByIp(getGeolocationByIpProps);

        expect(getGeolocationByIpResponse).toStrictEqual({
          hasError: false,
          clientIpCacheKey,
          clientId: getGeolocationByIpProps.clientId,
          ipAddress: getGeolocationByIpProps.ipAddress,
          timestamp: getGeolocationByIpProps.timestamp,
          geolocation: {
            city: ipstackApiResponseMock().city,
            region: ipstackApiResponseMock().region_name,
            country: ipstackApiResponseMock().country_name,
            latitude: ipstackApiResponseMock().latitude,
            longitude: ipstackApiResponseMock().longitude,
          },
        });
      });
    });
  });
});
