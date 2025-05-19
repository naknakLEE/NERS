import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { CreateEventUseCase } from './application/use-cases/create-event.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService, CreateEventUseCase],
})
export class EventModule {}
