import { CreateUserUseCase } from './../../application/use-cases/create-user.use-case';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto } from '@app/dto';

@Controller()
export class AuthController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('register')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  register(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
