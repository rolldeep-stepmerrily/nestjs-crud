import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsString, Length, Matches } from 'class-validator';

import { UserEntity } from 'src/users/entities';

export class CheckEmailDuplicationRequestDto extends PickType(UserEntity, ['email'] as const) {}

export class CheckUsernameDuplicationRequestDto extends PickType(UserEntity, ['username'] as const) {}

export class SendEmailVerificationCodeRequestDto extends PickType(UserEntity, ['email'] as const) {}

export class VerifyEmailVerificationCodeRequestDto extends PickType(UserEntity, ['email'] as const) {
  @ApiProperty({ description: '6자리 숫자 인증 코드' })
  @IsString()
  @Length(6, 6)
  @Matches(/^[0-9]+$/)
  code: string;
}

export class SignUpRequestDto extends PickType(UserEntity, ['username', 'password', 'email'] as const) {}

export class SignInRequestDto extends PickType(UserEntity, ['username', 'password'] as const) {}
