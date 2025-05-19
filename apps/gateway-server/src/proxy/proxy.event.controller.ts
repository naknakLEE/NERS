import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import { Role } from '@app/constants';
import { Roles } from '../auth/roles.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from '@app/dto/event/create-event.dto';

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
  @Roles(Role.ADMIN, Role.USER, Role.AUDITOR, Role.OPERATOR)
  proxyEventPing(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  @Post('event')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  proxyEventCreate(
    @Body() body: CreateEventDto,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }
}
