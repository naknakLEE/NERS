import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { RewardController } from './reward.controller';
import { CreateRewardUseCase } from './application/use-cases/create-reward.use-case';
import { Event, EventSchema } from '../event/schemas/event.schema';
import { GetRewardIdUseCase } from './application/use-cases/get-reward-id.use-case';
import { GetAllRewardUseCase } from './application/use-cases/get-all-reward.use-cast';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [RewardController],
  providers: [CreateRewardUseCase, GetRewardIdUseCase, GetAllRewardUseCase],
})
export class RewardModule {}
