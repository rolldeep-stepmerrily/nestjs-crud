import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiExceptionResponse } from 'nestjs-swagger-api-exception-response';

import { AuthError } from './auth.error';
import {
  CheckEmailDuplicationRequestDto,
  CheckUsernameDuplicationRequestDto,
  SendEmailVerificationCodeRequestDto,
  SignInRequestDto,
  SignUpRequestDto,
  VerifyEmailVerificationCodeRequestDto,
} from './dto/auth.request.dto';
import { SignInResponseDto, SignUpResponseDto } from './dto/auth.response.dto';
import { AuthenticationService, RegistrationService, ValidationService, VerificationService } from './services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly registrationService: RegistrationService,
    private readonly validationService: ValidationService,
    private readonly verificationService: VerificationService,
  ) {}

  @ApiOperation({ summary: 'Check username duplication' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiExceptionResponse(HttpStatus.CONFLICT, [AuthError.DUPLICATED_USERNAME])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('duplication/username')
  async checkUsernameDuplication(@Query() { username }: CheckUsernameDuplicationRequestDto) {
    await this.validationService.checkUsernameDuplication(username);
  }

  @ApiOperation({ summary: 'Check email duplication' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiExceptionResponse(HttpStatus.CONFLICT, [AuthError.DUPLICATED_EMAIL])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('duplication/email')
  async checkEmailDuplication(@Query() { email }: CheckEmailDuplicationRequestDto) {
    await this.validationService.checkEmailDuplication(email);
  }

  @ApiOperation({ summary: 'Send email verification code' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiExceptionResponse(HttpStatus.INTERNAL_SERVER_ERROR, [AuthError.EMAIL_SEND_FAILED])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('verification/email')
  async sendEmailVerificationCode(@Query() { email }: SendEmailVerificationCodeRequestDto) {
    await this.verificationService.sendEmailVerificationCode(email);
  }

  @ApiOperation({ summary: 'Verify code' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiExceptionResponse(HttpStatus.BAD_REQUEST, [AuthError.INVALID_VERIFICATION_CODE])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('verification/email')
  async verifyEmailVerificationCode(@Body() { email, code }: VerifyEmailVerificationCodeRequestDto) {
    await this.verificationService.verifyEmailVerificationCode(email, code);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SignUpResponseDto })
  @ApiExceptionResponse(HttpStatus.CONFLICT, [AuthError.DUPLICATED_USERNAME, AuthError.DUPLICATED_EMAIL])
  @Post('sign-up')
  async signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    return await this.registrationService.signUp(signUpRequestDto);
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: HttpStatus.OK, type: SignInResponseDto })
  @ApiExceptionResponse(HttpStatus.UNAUTHORIZED, [AuthError.INVALID_PASSWORD])
  @ApiExceptionResponse(HttpStatus.NOT_FOUND, [AuthError.USER_NOT_FOUND])
  @ApiExceptionResponse(HttpStatus.GONE, [AuthError.WITHDRAWN_USER])
  @Post('sign-in')
  async signIn(@Body() signInRequestDto: SignInRequestDto) {
    return await this.authenticationService.signIn(signInRequestDto);
  }
}
