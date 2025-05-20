import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  LoginDto,
  LogoutUserDto,
  RefreshTokenDto,
  UpdateUserRoleDto,
} from '@app/dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@app/constants';

@Controller()
@ApiTags('Auth')
export class ProxyAuthController {
  private authServiceUrl: string;
  private readonly logger = new Logger(ProxyAuthController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly proxyService: ProxyService,
  ) {}

  onModuleInit() {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');

    if (!this.authServiceUrl) {
      this.logger.error(
        'AUTH_SERVICE_URL is not defined in environment variables!',
      );
    }
  }

  @Get('auth/ping')
  @ApiOperation({
    summary: 'auth 서버 헬스 체크',
  })
  proxyAuthPing(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.proxyToService(this.authServiceUrl, req, res);
  }

  @Post('auth/logout')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: '유저 로그아웃',
  })
  @ApiTags('Auth')
  proxyAuthLogout(
    @Body() logoutUserDto: LogoutUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.proxyService.proxyToService(this.authServiceUrl, req, res);
  }

  @Post('auth/refresh')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: '유저 토큰 갱신',
  })
  proxyAuthRefresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.proxyService.proxyToService(this.authServiceUrl, req, res);
  }

  @Post('auth/register')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: '유저 회원가입',
  })
  proxyAuthRegister(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.proxyService.proxyToService(this.authServiceUrl, req, res);
  }

  @Post('auth/login')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: '유저 로그인',
  })
  proxyAuthLogin(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.proxyService.proxyToService(this.authServiceUrl, req, res);
  }

  @Patch('auth/user/:userId/role')
  @Roles(Role.ADMIN)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: '유저 역할 수정 (관리자)',
  })
  proxyAuthUpdateUserRole(
    @Param('userId') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.proxyService.proxyToService(this.authServiceUrl, req, res);
  }
}
