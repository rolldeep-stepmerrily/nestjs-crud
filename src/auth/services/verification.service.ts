import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { MailerService } from 'src/mailer/mailer.service';
import { RedisRepository } from 'src/redis/redis.repository';

import { AuthError } from '../auth.error';

@Injectable()
export class VerificationService {
  #redisRepository: RedisRepository;
  #VERIFICATION_CODE_EXPIRATION_TIME = 5 * 60 * 1000;
  #VERIFICATION_CODE_LENGTH = 6;
  #VERIFICATION_CODE_KEY_PREFIX = 'email-verification-code';

  constructor(
    private readonly mailerService: MailerService,
    private readonly redisRepository: RedisRepository,
  ) {
    this.#redisRepository = redisRepository;
  }

  private generateVerificationCode() {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(this.#VERIFICATION_CODE_LENGTH, '0');
  }

  async sendEmailVerificationCode(email: string) {
    const code = this.generateVerificationCode();

    const sendEmail = this.mailerService.sendEmail({
      to: email,
      subject: 'Email verification code',
      text: `Your verification code is ${code}`,
    });

    const setRedis = this.redisRepository.set(
      `${this.#VERIFICATION_CODE_KEY_PREFIX}:${email}`,
      code,
      this.#VERIFICATION_CODE_EXPIRATION_TIME,
    );

    await Promise.all([sendEmail, setRedis]);
  }

  async verifyEmailVerificationCode(email: string, code: string) {
    const redisCode = await this.redisRepository.get(`${this.#VERIFICATION_CODE_KEY_PREFIX}:${email}`);

    if (redisCode !== code) {
      throw new CustomHttpException(AuthError.INVALID_VERIFICATION_CODE);
    }
  }
}
