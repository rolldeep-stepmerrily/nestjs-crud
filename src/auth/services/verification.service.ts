import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { MailerService } from 'src/mailer/mailer.service';
import { RedisRepository } from 'src/redis/redis.repository';

import { AuthError } from '../auth.error';

@Injectable()
export class VerificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly redisRepository: RedisRepository,
  ) {}

  private generateVerificationCode() {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
  }

  async sendEmailVerificationCode(email: string) {
    const code = this.generateVerificationCode();

    const sendEmail = this.mailerService.sendEmail({
      to: email,
      subject: 'Email verification code',
      text: `Your verification code is ${code}`,
    });

    const setRedis = this.redisRepository.set(`email-verification-code:${email}`, code, 5 * 60 * 1000);

    await Promise.all([sendEmail, setRedis]);
  }

  async verifyEmailVerificationCode(email: string, code: string) {
    const redisCode = await this.redisRepository.get(email);

    if (redisCode !== code) {
      throw new CustomHttpException(AuthError.INVALID_VERIFICATION_CODE);
    }
  }
}
