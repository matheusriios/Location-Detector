export interface CacheRepository {
  closeConnection(): void;
  hget(hash: string, key: string): Promise<string>;
  hset(hash: string, key: string, value: string): any;
}
