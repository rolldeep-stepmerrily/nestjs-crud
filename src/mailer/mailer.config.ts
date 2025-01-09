import { ConfigService } from '@nestjs/config';

export const SESConfig = (configService: ConfigService) => ({
  region: configService.getOrThrow('AWS_REGION'),
  credentials: {
    accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
  },
});
