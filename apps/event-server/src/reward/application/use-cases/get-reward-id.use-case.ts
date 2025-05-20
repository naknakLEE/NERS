import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from '../../../reward/domain/entites/reward.entity';
import { RewardDocument } from '../../../reward/schemas/reward.schema';
import { RewardTypeVO } from '../../../reward/domain/value-objects/reward-type.vo';
import {
  RewardDetail,
  RewardDetailsVO,
} from '../../../reward/domain/value-objects/reward-details.vo';
@Injectable()
export class GetRewardIdUseCase {
  private readonly logger = new Logger(GetRewardIdUseCase.name);
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async execute(rewardId: string) {
    const reward = await this.rewardModel.findOne({ _id: rewardId });
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${rewardId} not found`);
    }
    const rewardEntity = Reward.createNew({
      id: reward._id.toString(),
      eventId: reward.eventId.toString(),
      name: reward.name,
      type: RewardTypeVO.fromEnum(reward.type),
      details: RewardDetailsVO.create(reward.details as RewardDetail),
      isActive: reward.isActive,
      validTo: reward?.validTo,
    });

    return rewardEntity.toJson();
  }
}
