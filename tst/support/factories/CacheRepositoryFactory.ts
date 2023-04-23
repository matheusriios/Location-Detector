import { Factory } from './factory';
import { RedisRepository } from 'src/infra/repositories/cache/redis/RedisRepository';
import { CacheRepository } from 'src/infra/repositories/cache/interfaces/Repository';

export class CacheRepositoryFactory implements Factory<CacheRepository> {
  create(): CacheRepository {
    return new RedisRepository();
  }
}
