import { Module } from '@nestjs/common';
import { RewardRequestController } from './reward-request.controller';
import { RewardRequestService } from './reward-request.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RewardRequest,
  RewardRequestSchema,
} from './schemas/reward-request.schema';
import { Reward } from '../reward/schemas/reward.schema';
import { RewardSchema } from '../reward/schemas/reward.schema';
import { Event } from '../event/schemas/event.schema';
import { EventSchema } from '../event/schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [RewardRequestController],
  providers: [RewardRequestService],
})
export class RewardRequestModule {}
