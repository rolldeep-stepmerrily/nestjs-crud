import { HttpStatus } from '@nestjs/common';

export const AuthError = {
  USER_NOT_FOUND: {
    errorCode: 'USER_NOT_FOUND',
    statusCode: HttpStatus.NOT_FOUND,
    message: 'User not found',
  },
  WITHDRAWN_USER: {
    errorCode: 'WITHDRAWN_USER',
    statusCode: HttpStatus.GONE,
    message: 'Withdrawn user',
  },
  INVALID_PASSWORD: {
    errorCode: 'INVALID_PASSWORD',
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'Invalid password',
  },
};
