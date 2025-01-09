import { Injectable } from '@nestjs/common';

import { CatchDatabaseErrors } from '@@decorators';

import { SignUpRequestDto } from 'src/auth/dto/auth.request.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@CatchDatabaseErrors()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByUsername(username: string) {
    return await this.prisma.user.findUnique({ where: { username }, select: { id: true } });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
  }

  async findUserByUsernameForSignIn(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, password: true, deletedAt: true },
    });
  }

  async createUser(signUpRequestDto: SignUpRequestDto) {
    return await this.prisma.user.create({ data: signUpRequestDto, select: { id: true } });
  }
}
