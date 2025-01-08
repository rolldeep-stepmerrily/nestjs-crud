import { HttpStatus } from '@nestjs/common';

export const UsersError = {
  DUPLICATED_EMAIL: {
    errorCode: 'DUPLICATED_EMAIL',
    statusCode: HttpStatus.CONFLICT,
    message: 'Duplicated email',
  },
  DUPLICATED_USERNAME: {
    errorCode: 'DUPLICATED_USERNAME',
    statusCode: HttpStatus.CONFLICT,
    message: 'Duplicated username',
  },
};
