import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiExceptionResponse } from 'nestjs-swagger-api-exception-response';

import { AuthError } from './auth.error';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/auth.request.dto';
import { SignInResponseDto } from './dto/auth.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: HttpStatus.OK, type: SignInResponseDto })
  @ApiExceptionResponse(HttpStatus.UNAUTHORIZED, [AuthError.INVALID_PASSWORD])
  @ApiExceptionResponse(HttpStatus.NOT_FOUND, [AuthError.USER_NOT_FOUND])
  @ApiExceptionResponse(HttpStatus.GONE, [AuthError.WITHDRAWN_USER])
  @Post('sign-in')
  async signIn(@Body() signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
    return await this.authService.signIn(signInRequestDto);
  }
}
