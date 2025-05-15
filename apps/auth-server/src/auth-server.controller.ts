import { Controller, Get, Logger } from '@nestjs/common';

@Controller('auth')
export class AuthServerController {
  private readonly logger = new Logger(AuthServerController.name);


  @Get('ping')
  ping(): string {
    this.logger.log('ping');
    return 'pong';
  }
}
