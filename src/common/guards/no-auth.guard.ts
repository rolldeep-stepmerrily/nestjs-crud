import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

@Injectable()
export class NoAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    console.log({ authHeader });

    if (authHeader) {
      throw new CustomHttpException({
        errorCode: 'NOT_ALLOWED_REQUEST',
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Not allowed request',
      });
    }

    return true;
  }
}
