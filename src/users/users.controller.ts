import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiExceptionResponse } from 'nestjs-swagger-api-exception-response';

import { CreateUserRequestDto } from './dto/users.request.dto';
import { CreateUserResponseDto, FindUsersResponseDto } from './dto/users.response.dto';
import { UsersError } from './users.error';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'Find users' })
  @ApiResponse({ status: HttpStatus.OK, type: FindUsersResponseDto })
  @Get()
  async findUsers(): Promise<FindUsersResponseDto> {
    return await this.usersService.findUsers();
  }

  @ApiOperation({ description: 'Create user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateUserResponseDto })
  @ApiExceptionResponse(HttpStatus.CONFLICT, [UsersError.DUPLICATED_EMAIL, UsersError.DUPLICATED_USERNAME])
  @Post()
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return await this.usersService.createUser(createUserRequestDto);
  }
}
