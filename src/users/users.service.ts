import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@@exceptions';

import { CreateUserRequestDto } from './dto/users.request.dto';
import { CreateUserResponseDto, FindUsersResponseDto } from './dto/users.response.dto';
import { UsersError } from './users.error';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserByEmail(email: string): Promise<{ id: number } | null> {
    return await this.usersRepository.findUserByEmail(email);
  }

  async findUserByUsername(username: string): Promise<{ id: number } | null> {
    return await this.usersRepository.findUserByUsername(username);
  }

  async findUsers(): Promise<FindUsersResponseDto> {
    const users = await this.usersRepository.findUsers();

    return { users };
  }

  async createUser({ username, password, email }: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const [findUserByUsername, findUserByEmail] = await Promise.all([
      this.findUserByUsername(username),
      this.findUserByEmail(email),
    ]);

    if (findUserByUsername) {
      throw new CustomHttpException(UsersError.DUPLICATED_USERNAME);
    }

    if (findUserByEmail) {
      throw new CustomHttpException(UsersError.DUPLICATED_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.createUser({ username, password: hashedPassword, email });
  }
}
