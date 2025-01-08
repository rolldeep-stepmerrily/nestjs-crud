import { ApiProperty, PickType } from '@nestjs/swagger';

import { UserEntity } from '../entities';

class UserResponseDto extends PickType(UserEntity, ['id', 'username'] as const) {}

export class FindUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto], description: 'users' })
  users: UserResponseDto[];
}

export class CreateUserResponseDto extends PickType(UserEntity, ['id'] as const) {}
