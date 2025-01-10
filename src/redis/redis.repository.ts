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

  async get<T>(key: string) {
    const value = await this.#redisClient.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set(key: string, value: any, ttl: number) {
    await this.#redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string) {
    await this.#redisClient.del(key);
  }
}
