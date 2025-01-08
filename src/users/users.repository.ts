import { Injectable } from '@nestjs/common';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserRequestDto } from './dto/users.request.dto';

@Injectable()
@CatchDatabaseErrors()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
  }

  async findUserByUsername(username: string) {
    return await this.prisma.user.findUnique({ where: { username }, select: { id: true } });
  }

  async findUserByUsernameForSignIn(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, password: true, deletedAt: true },
    });
  }

  async findUsers() {
    return await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, username: true, role: true, createdAt: true },
    });
  }

  async createUser(createUserRequestDto: CreateUserRequestDto) {
    return await this.prisma.user.create({ data: createUserRequestDto, select: { id: true } });
  }
}
