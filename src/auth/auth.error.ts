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
  EMAIL_SEND_FAILED: {
    errorCode: 'EMAIL_SEND_FAILED',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Failed to send email, please try again later',
  },
  INVALID_VERIFICATION_CODE: {
    errorCode: 'INVALID_VERIFICATION_CODE',
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid verification code',
  },
};
