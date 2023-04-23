import { Tedis } from 'tedis';

const clean = async () => {
  const REDIS_CLIENT_IP_HASH = process.env.REDIS_CLIENT_IP_HASH;
  const redisClient = new Tedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  });
  const hashKeys = await redisClient.hkeys(REDIS_CLIENT_IP_HASH);

  for (const key of hashKeys) {
    await redisClient.hdel(REDIS_CLIENT_IP_HASH, key);
  }
};

export default {
  clean,
};
