import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@@exceptions';

import { UsersRepository } from 'src/users/users.repository';

import { AuthError } from '../auth.error';
import { SignUpRequestDto } from '../dto/auth.request.dto';

import { ValidationService } from './validation.service';
import { VerificationService } from './verification.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly verificationService: VerificationService,
    private readonly usersRepository: UsersRepository,
  ) {}

  private async validateSignUpRequestDto(signUpRequestDto: SignUpRequestDto) {
    await Promise.all([
      this.validationService.checkUsernameDuplication(signUpRequestDto.username),
      this.validationService.checkEmailDuplication(signUpRequestDto.email),
      this.verificationService.verifyEmailVerification(signUpRequestDto.email),
    ]);
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async signUp(signUpRequestDto: SignUpRequestDto) {
    await this.validateSignUpRequestDto(signUpRequestDto);

    const hashedPassword = await this.hashPassword(signUpRequestDto.password);

    const createdUser = await this.usersRepository.createUser({ ...signUpRequestDto, password: hashedPassword });

    if (!createdUser) {
      throw new CustomHttpException(AuthError.FAILED_TO_CREATE_USER);
    }

    await this.verificationService.deleteVerificationCode(signUpRequestDto.email);

    return { id: createdUser.id };
  }
}
