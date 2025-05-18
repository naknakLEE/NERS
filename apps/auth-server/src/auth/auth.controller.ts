import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { AuthService, Tokens } from './auth.service';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('refresh')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<Tokens> {
    if (!refreshTokenDto) {
      throw new ForbiddenException('Refresh token is missing.');
    }
    const newTokens = await this.authService.refreshToken(refreshTokenDto);

    return newTokens;
  }

  @Post('logout')
  async logout(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ message: string }> {
    if (!refreshToken) {
      return {
        message:
          'Logout processed. No refresh token provided or client already cleared tokens.',
      };
    }
    await this.authService.logout(refreshToken);
    return { message: 'Successfully logged out.' };
  }
}
