import { PickType } from '@nestjs/swagger';

import { UserEntity } from 'src/users/entities';

export class SignInRequestDto extends PickType(UserEntity, ['username', 'password'] as const) {}
