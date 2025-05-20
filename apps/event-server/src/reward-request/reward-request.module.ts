import { Module } from '@nestjs/common';
import { RewardRequestController } from './reward-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RewardRequest,
  RewardRequestSchema,
} from './schemas/reward-request.schema';
import { Reward } from '../reward/schemas/reward.schema';
import { RewardSchema } from '../reward/schemas/reward.schema';
import { Event } from '../event/schemas/event.schema';
import { EventSchema } from '../event/schemas/event.schema';
import { RequestRewardUseCase } from './application/use-cases/request-reward.use-cases';
import { GetRewardRequestHistoryUseCase } from './application/use-cases/get-reward-request-history.use-case';
import { GetRewardRequestMeUseCase } from './application/use-cases/get-reward-request-me.use-case';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [RewardRequestController],
  providers: [
    RequestRewardUseCase,
    GetRewardRequestHistoryUseCase,
    GetRewardRequestMeUseCase,
  ],
})
export class RewardRequestModule {}
