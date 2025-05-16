import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import { Role } from '@app/constants';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class ProxyController {
  private authServiceUrl: string;
  private eventServiceUrl: string;
  private readonly logger = new Logger(ProxyController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly proxyService: ProxyService,
  ) {}

  onModuleInit() {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL');

    if (!this.authServiceUrl) {
      this.logger.error(
        'AUTH_SERVICE_URL is not defined in environment variables!',
      );
    }
    if (!this.eventServiceUrl) {
      this.logger.error(
        'EVENT_SERVICE_URL is not defined in environment variables!',
      );
    }
  }

  @Get('auth/ping')
  proxyAuthPing(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.proxyToService(this.authServiceUrl, req, res);
  }

  @Get('event/ping')
  @Roles(Role.USER)
  proxyEventPing(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }
}
