import { CreateUserUseCase } from './../../application/use-cases/create-user.use-case';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from '@app/dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';

@Controller()
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
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

  // @Post('refresh')
  // @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  // async refreshTokens(
  //   @Body() refreshTokenDto: RefreshTokenDto,
  // ): Promise<Tokens> {
  //   if (!refreshTokenDto) {
  //     throw new ForbiddenException('Refresh token is missing.');
  //   }
  //   const newTokens = await this.authService.refreshToken(refreshTokenDto);

  //   return newTokens;
  // }

  // @Post('logout')
  // @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  // async logout(
  //   @Body() logoutUserDto: LogoutUserDto,
  // ): Promise<{ message: string }> {
  //   if (!logoutUserDto.refreshToken) {
  //     return {
  //       message:
  //         'Logout processed. No refresh token provided or client already cleared tokens.',
  //     };
  //   }
  //   await this.authService.logout(logoutUserDto.refreshToken);
  //   return { message: 'Successfully logged out.' };
  // }
}
