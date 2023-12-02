import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';
import { RedisClientType } from 'redis';

export async function redisClientFactory(config: ConfigService): Promise<RedisClientType> {
  const redisConfig = {
    password: config.get("REDIS_PASSWORD"),
    socket: {
      host: config.get("REDIS_HOST"),
      port: config.get("REDIS_PORT")
    }
  };
  
  const client = redis.createClient(redisConfig);
  await client.connect();

  new Logger("RedisClient").log(`Connected: ${redisConfig.socket.host}`);
  return client as RedisClientType;
};
