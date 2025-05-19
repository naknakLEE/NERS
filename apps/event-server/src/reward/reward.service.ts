import { CreateRewardDto } from '@app/dto/event/create-reward.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { Model } from 'mongoose';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async createReward(createRewardDto: CreateRewardDto) {
    const reward = new this.rewardModel(createRewardDto);
    return reward.save();
  }
}
