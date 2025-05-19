import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import { Role } from '@app/constants';
import { Roles } from '../auth/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Event')
export class ProxyEventController {
  private eventServiceUrl: string;
  private readonly logger = new Logger(ProxyEventController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly proxyService: ProxyService,
  ) {}

  onModuleInit() {
    this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL');

    if (!this.eventServiceUrl) {
      this.logger.error(
        'EVENT_SERVICE_URL is not defined in environment variables!',
      );
    }
  }

  @Get('event/ping')
  @Roles(Role.USER)
  proxyEventPing(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }
}
