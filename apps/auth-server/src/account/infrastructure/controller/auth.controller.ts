import { CreateUserUseCase } from './../../application/use-cases/create-user.use-case';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import {
  CreateUserDto,
  LoginDto,
  LogoutUserDto,
  RefreshTokenDto,
} from '@app/dto';
import { Tokens } from '../../application/service/jwt-token.service';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case';

@Controller()
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
  ) {}

  @Post('register')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  register(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  login(@Body() loginDto: LoginDto) {
    return this.loginUserUseCase.execute(loginDto);
  }

  @Post('refresh')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<Tokens> {
    const newTokens = await this.refreshTokenUseCase.execute(refreshTokenDto);
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
    await this.logoutUserUseCase.execute(logoutUserDto.refreshToken);
    return { message: 'Successfully logged out.' };
  }
}
