import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

import { redisConfig } from './redis.config';

@Injectable()
export class RedisRepository {
  #redisClient: Redis;

  constructor(configService: ConfigService) {
    this.#redisClient = new Redis(redisConfig(configService));
  }

  async get(key: string) {
    return await this.#redisClient.get(key);
  }

  async set(key: string, value: string, ttl: number) {
    await this.#redisClient.set(key, value, 'EX', ttl);
  }

  async del(key: string) {
    await this.#redisClient.del(key);
  }
}
