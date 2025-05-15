import { Module } from '@nestjs/common';
import { EventServerController } from './event-server.controller';

@Module({
  imports: [],
  controllers: [EventServerController],
})
export class EventServerModule {}
