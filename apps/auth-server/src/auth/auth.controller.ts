import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService, Tokens } from './auth.service';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto, LogoutUserDto, RefreshTokenDto } from '@app/dto';
import { LoginDto } from '@app/dto';

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
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async logout(
    @Body() logoutUserDto: LogoutUserDto,
  ): Promise<{ message: string }> {
    if (!logoutUserDto.refreshToken) {
      return {
        message:
          'Logout processed. No refresh token provided or client already cleared tokens.',
      };
    }
    await this.authService.logout(logoutUserDto.refreshToken);
    return { message: 'Successfully logged out.' };
  }
}
