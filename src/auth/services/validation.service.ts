import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { UsersRepository } from 'src/users/users.repository';

import { AuthError } from '../auth.error';

@Injectable()
export class ValidationService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async checkUsernameDuplication(username: string) {
    const foundUser = await this.usersRepository.findUserByUsername(username);

    if (foundUser) {
      throw new CustomHttpException(AuthError.DUPLICATED_USERNAME);
    }
  }

  async checkEmailDuplication(email: string) {
    const foundUser = await this.usersRepository.findUserByEmail(email);

    if (foundUser) {
      throw new CustomHttpException(AuthError.DUPLICATED_EMAIL);
    }
  }
}
