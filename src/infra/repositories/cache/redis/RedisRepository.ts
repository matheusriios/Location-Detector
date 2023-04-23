import { Tedis } from 'tedis';
import { injectable } from 'inversify';

import { CacheRepository } from '../interfaces/Repository';

@injectable()
export class RedisRepository implements CacheRepository {
  private redisClient = new Tedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  });

  public async hset(hash: string, key: string, value: string) {
    await this.redisClient.hset(hash, key, value);
  }

  public async hget(hash: string, key: string) {
    return this.redisClient.hget(hash, key);
  }

  public closeConnection() {
    this.redisClient.close();
  }
}
