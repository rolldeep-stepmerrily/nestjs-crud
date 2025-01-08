import { PickType } from '@nestjs/swagger';

import { UserEntity } from '../entities';

export class CreateUserRequestDto extends PickType(UserEntity, ['username', 'password', 'email'] as const) {}
