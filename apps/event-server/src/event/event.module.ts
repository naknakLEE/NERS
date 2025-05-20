import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { EventController } from './event.controller';
import { CreateEventUseCase } from './application/use-cases/create-event.use-case';
import { GetAllEventUseCase } from './application/use-cases/get-all-event.use-cast';
import { GetEventDetailUseCase } from './application/use-cases/get-event-detail.use-case';
import { RewardSchema } from '../reward/schemas/reward.schema';
import { Reward } from '../reward/domain/entites/reward.entity';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
  ],
  controllers: [EventController],
  providers: [CreateEventUseCase, GetAllEventUseCase, GetEventDetailUseCase],
})
export class EventModule {}
