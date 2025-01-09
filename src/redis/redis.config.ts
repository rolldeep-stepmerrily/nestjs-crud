import { ConfigService } from '@nestjs/config';

export const redisConfig = (configService: ConfigService) => ({
  host: configService.getOrThrow('REDIS_HOST'),
  port: configService.getOrThrow('REDIS_PORT'),
  password: configService.getOrThrow('REDIS_PASSWORD'),
});
