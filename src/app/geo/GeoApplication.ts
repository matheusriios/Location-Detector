import * as DateFns from 'date-fns';
import { inject, injectable } from 'inversify';

import { IpStackService } from 'src/infra/services/ipstack/IpStackService';
import { generateClientIpCacheKey } from 'src/commons/helpers/generateCacheKey';
import { RedisRepository } from 'src/infra/repositories/cache/redis/RedisRepository';
import { GetGeolocationByIpResponse } from './interfaces/GetGeolocationByIpResponse';
import { CacheRepository } from 'src/infra/repositories/cache/interfaces/Repository';
import { GetGeolocationByIpProps } from 'src/commons/interfaces/GetGeolocationByIpProps';
import { normalizeDuplicatedLocalizationErrorMessage } from 'src/commons/helpers/normalizeErrorMessages';

@injectable()
export class GeoApplication {
  private readonly clientIpCacheHash = process.env.REDIS_CLIENT_IP_HASH;

  constructor(
    @inject(IpStackService)
    private readonly ipStackService: IpStackService,
    @inject(RedisRepository)
    private readonly cacheRepository: CacheRepository,
  ) {}

  public async getGeolocationByIp(
    props: GetGeolocationByIpProps,
  ): Promise<GetGeolocationByIpResponse> {
    const clientIpCacheKey = generateClientIpCacheKey(
      props.ipAddress,
      props.clientId,
    );

    const ipInfoCached = await this.cacheRepository.hget(
      this.clientIpCacheHash,
      clientIpCacheKey,
    );

    if (ipInfoCached && !this.isWithinAllowedTimeWindow(props)) {
      return {
        ...props,
        hasError: true,
        clientIpCacheKey,
        errorMessage:
          normalizeDuplicatedLocalizationErrorMessage(clientIpCacheKey),
      };
    }

    await this.setClientIpInCache(clientIpCacheKey, props);

    return {
      ...props,
      hasError: false,
      clientIpCacheKey,
      geolocation: await this.ipStackService.getGeolocationByIp(
        props.ipAddress,
      ),
    };
  }

  private async setClientIpInCache(
    cacheKey: string,
    props: GetGeolocationByIpProps,
  ) {
    await this.cacheRepository.hset(
      this.clientIpCacheHash,
      cacheKey,
      JSON.stringify(props),
    );
  }

  private isWithinAllowedTimeWindow(props: GetGeolocationByIpProps) {
    const currentTimestamp = Date.now();
    const previousTimestamp = props.timestamp;
    const differenceInMinutes = DateFns.differenceInMinutes(
      currentTimestamp,
      previousTimestamp,
    );
    const windowTimeConfigured = parseInt(process.env.IP_SEARCH_WINDOW_MINUTES);

    return differenceInMinutes >= windowTimeConfigured;
  }
}
