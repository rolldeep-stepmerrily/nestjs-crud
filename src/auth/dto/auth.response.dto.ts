import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { UserEntity } from 'src/users/entities';

export class SignUpResponseDto extends PickType(UserEntity, ['id'] as const) {}

export class SignInResponseDto {
  @ApiProperty({ type: String, example: 'accessToken', description: 'Access token' })
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty({ type: String, example: 'refreshToken', description: 'Refresh token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
