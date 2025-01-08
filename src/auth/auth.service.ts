import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@@exceptions';

import { UsersRepository } from 'src/users/users.repository';

import { AuthError } from './auth.error';
import { SignInRequestDto } from './dto/auth.request.dto';
import { SignInResponseDto } from './dto/auth.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,

    private readonly usersRepository: UsersRepository,
  ) {}

  async signIn({ username, password }: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.usersRepository.findUserByUsernameForSignIn(username);

    if (!user) {
      throw new CustomHttpException(AuthError.USER_NOT_FOUND);
    }

    if (user.deletedAt) {
      throw new CustomHttpException(AuthError.WITHDRAWN_USER);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomHttpException(AuthError.INVALID_PASSWORD);
    }

    const nodeEnv = this.configService.getOrThrow('NODE_ENV');
    const jwtSecretKey = this.configService.getOrThrow('JWT_SECRET_KEY');

    const expiresIn = nodeEnv === 'production' ? '1h' : '7d';

    const accessToken = this.jwtService.sign({ sub: 'access', id: user.id }, { secret: jwtSecretKey, expiresIn });
    const refreshToken = this.jwtService.sign({ sub: 'refresh', id: user.id }, { secret: jwtSecretKey });

    return { accessToken, refreshToken };
  }
}
