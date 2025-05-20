import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RewardDocument } from '../../schemas/reward.schema';
import { GetRewardsDto } from '@app/dto/event/get-rewards.dto';
import { Reward } from '../../domain/entites/reward.entity';

@Injectable()
export class GetAllRewardUseCase {
  private readonly logger = new Logger(GetAllRewardUseCase.name);
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async execute(getRewardsDto: GetRewardsDto) {
    const { page, pageSize } = getRewardsDto;
    const rewards = await this.rewardModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return rewards;
  }
}
