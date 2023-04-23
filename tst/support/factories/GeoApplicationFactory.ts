import { Factory } from './factory';
import { container } from 'src/container';
import { GeoApplication } from 'src/app/geo/GeoApplication';
import { IpStackService } from 'src/infra/services/ipstack/IpStackService';
import { RedisRepository } from 'src/infra/repositories/cache/redis/RedisRepository';
import { CacheRepository } from 'src/infra/repositories/cache/interfaces/Repository';

export class GeoApplicationFactory implements Factory<GeoApplication> {
  create(): GeoApplication {
    const ipStackService = container.get(IpStackService);
    const cacheRepository = container.get<CacheRepository>(RedisRepository);

    return new GeoApplication(ipStackService, cacheRepository);
  }
}
