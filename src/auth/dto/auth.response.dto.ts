import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

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
