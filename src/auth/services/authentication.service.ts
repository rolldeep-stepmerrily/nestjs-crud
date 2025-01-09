import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@@exceptions';

import { UsersRepository } from 'src/users/users.repository';

import { AuthError } from '../auth.error';
import { SignInRequestDto } from '../dto/auth.request.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  private async validateSignInRequestDto(signInRequestDto: SignInRequestDto) {
    const user = await this.usersRepository.findUserByUsernameForSignIn(signInRequestDto.username);

    if (!user) {
      throw new CustomHttpException(AuthError.USER_NOT_FOUND);
    }

    if (user.deletedAt) {
      throw new CustomHttpException(AuthError.WITHDRAWN_USER);
    }

    return user;
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      throw new CustomHttpException(AuthError.INVALID_PASSWORD);
    }
  }

  private async generateTokens(userId: number) {
    const nodeEnv = this.configService.getOrThrow('NODE_ENV');
    const jwtSecretKey = this.configService.getOrThrow('JWT_SECRET_KEY');

    const expiresIn = nodeEnv === 'production' ? '1h' : '7d';

    const accessToken = this.jwtService.sign({ sub: 'access', id: userId }, { secret: jwtSecretKey, expiresIn });
    const refreshToken = this.jwtService.sign({ sub: 'refresh', id: userId }, { secret: jwtSecretKey });

    return { accessToken, refreshToken };
  }

  async signIn({ username, password }: SignInRequestDto) {
    const user = await this.validateSignInRequestDto({ username, password });

    await this.validatePassword(password, user.password);

    return await this.generateTokens(user.id);
  }
}
