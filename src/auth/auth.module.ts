import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailerModule } from 'src/mailer/mailer.module';
import { RedisModule } from 'src/redis/redis.module';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthenticationService, RegistrationService, ValidationService, VerificationService } from './services';

@Module({
  imports: [MailerModule, JwtModule, PassportModule, UsersModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthenticationService, RegistrationService, ValidationService, VerificationService],
})
export class AuthModule {}
