import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class EventServerController {
  private readonly logger = new Logger(EventServerController.name);


  @Get('ping')
  ping(): string {
    this.logger.log('ping');
    return 'pong';
  }
}
