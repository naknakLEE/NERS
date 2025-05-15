import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { ApiConsumes } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
