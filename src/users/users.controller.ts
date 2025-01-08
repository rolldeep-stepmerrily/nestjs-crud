import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiExceptionResponse } from 'nestjs-swagger-api-exception-response';

import { AuthError } from 'src/auth/auth.error';
import { AuthService } from 'src/auth/auth.service';
import { SignInRequestDto } from 'src/auth/dto/auth.request.dto';
import { SignInResponseDto } from 'src/auth/dto/auth.response.dto';

import { CreateUserRequestDto } from './dto/users.request.dto';
import { CreateUserResponseDto, FindUsersResponseDto } from './dto/users.response.dto';
import { UsersError } from './users.error';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({ status: HttpStatus.OK, type: FindUsersResponseDto })
  @Get()
  async findUsers(): Promise<FindUsersResponseDto> {
    return await this.usersService.findUsers();
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateUserResponseDto })
  @ApiExceptionResponse(HttpStatus.CONFLICT, [UsersError.DUPLICATED_EMAIL, UsersError.DUPLICATED_USERNAME])
  @Post()
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return await this.usersService.createUser(createUserRequestDto);
  }

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
