import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
}
