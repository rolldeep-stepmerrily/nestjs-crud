import { ApiProperty } from '@nestjs/swagger';

import { User as UserModel, ERole } from '@prisma/client';
import { IsEmail, IsEnum, IsPositive, Matches } from 'class-validator';

import { BaseEntity } from '@@entities';

const random = Math.random().toString(36).substring(2, 8);

export class UserEntity extends BaseEntity implements UserModel {
  @ApiProperty({ description: 'User ID', minimum: 1, required: true, example: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: 'User email', required: true, example: `test_${random}@example.com` })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User username', required: true, example: `test${random}` })
  @Matches(/^[a-zA-Z0-9]{4,16}$/)
  username: string;

  @ApiProperty({ description: 'User password', required: true, example: 'qwer1234!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_=+])[A-Za-z\d`~!@#$%^&*()_=+]{8,16}$/)
  password: string;

  @ApiProperty({ description: 'User role', required: true, example: ERole.USER })
  @IsEnum(ERole)
  role: ERole;
}
