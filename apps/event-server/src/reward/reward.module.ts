import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { RewardController } from './reward.controller';
import { CreateRewardUseCase } from './application/use-cases/create-reward.use-case';
import { Event, EventSchema } from '../event/schemas/event.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [RewardController],
  providers: [CreateRewardUseCase],
})
export class RewardModule {}
