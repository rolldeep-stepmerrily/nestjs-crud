import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { MailerService } from 'src/mailer/mailer.service';
import { RedisRepository } from 'src/redis/redis.repository';

import { AuthError } from '../auth.error';

import { ValidationService } from './validation.service';

interface IVerification {
  code: string;
  isVerified: boolean;
}

@Injectable()
export class VerificationService {
  #VERIFICATION_CODE_KEY_PREFIX = 'email-verification-code';
  #VERIFICATION_CODE_EXPIRATION_TIME = 5 * 60; // 5 minutes
  #VERIFICATION_CODE_LENGTH = 6;

  constructor(
    private readonly validationService: ValidationService,
    private readonly mailerService: MailerService,
    private readonly redisRepository: RedisRepository,
  ) {}

  private generateVerification() {
    return {
      code: Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(this.#VERIFICATION_CODE_LENGTH, '0'),
      isVerified: false,
    };
  }

  async sendEmailVerificationCode(email: string) {
    await this.validationService.checkEmailDuplication(email);

    const verification = this.generateVerification();

    const sendEmail = this.mailerService.sendEmail({
      to: email,
      subject: 'Email verification code',
      text: `Your verification code is ${verification.code}`,
    });

    const setRedis = this.redisRepository.set(
      `${this.#VERIFICATION_CODE_KEY_PREFIX}:${email}`,
      verification,
      this.#VERIFICATION_CODE_EXPIRATION_TIME,
    );

    await Promise.all([sendEmail, setRedis]);
  }

  async verifyEmailVerificationCode(email: string, code: string) {
    const redisCode = await this.redisRepository.get<IVerification>(`${this.#VERIFICATION_CODE_KEY_PREFIX}:${email}`);

    if (!redisCode) {
      throw new CustomHttpException(AuthError.INVALID_VERIFICATION_CODE);
    }

    if (redisCode.code !== code) {
      throw new CustomHttpException(AuthError.INVALID_VERIFICATION_CODE);
    }

    await this.redisRepository.set(
      `${this.#VERIFICATION_CODE_KEY_PREFIX}:${email}`,
      { ...redisCode, isVerified: true },
      this.#VERIFICATION_CODE_EXPIRATION_TIME,
    );
  }

  async verifyEmailVerification(email: string) {
    const redisCode = await this.redisRepository.get<IVerification>(`${this.#VERIFICATION_CODE_KEY_PREFIX}:${email}`);

    if (!redisCode || !redisCode.isVerified) {
      throw new CustomHttpException(AuthError.NOT_VERIFIED_EMAIL);
    }
  }

  async deleteVerificationCode(email: string) {
    await this.redisRepository.del(`${this.#VERIFICATION_CODE_KEY_PREFIX}:${email}`);
  }
}
