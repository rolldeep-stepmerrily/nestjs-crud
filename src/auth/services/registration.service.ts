import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersRepository } from 'src/users/users.repository';

import { SignUpRequestDto } from '../dto/auth.request.dto';
import { SignUpResponseDto } from '../dto/auth.response.dto';

import { ValidationService } from './validation.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly usersRepository: UsersRepository,
  ) {}

  private async validateSignUpRequestDto(signUpRequestDto: SignUpRequestDto) {
    await Promise.all([
      this.validationService.checkUsernameDuplication(signUpRequestDto.username),
      this.validationService.checkEmailDuplication(signUpRequestDto.email),
    ]);
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    await this.validateSignUpRequestDto(signUpRequestDto);

    const hashedPassword = await this.hashPassword(signUpRequestDto.password);

    return await this.usersRepository.createUser({ ...signUpRequestDto, password: hashedPassword });
  }
}
