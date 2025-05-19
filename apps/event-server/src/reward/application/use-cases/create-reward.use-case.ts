import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from '../../domain/entites/reward.entity';
import { RewardDocument } from '../../schemas/reward.schema';
import { CreateRewardDto } from '@app/dto/event/create-reward.dto';
import { UserFromHeader } from '../../../common/get-user-from-header.decorator';
import { RewardTypeVO } from '../../domain/value-objects/reward-type.vo';
import {
  RewardDetail,
  RewardDetailsVO,
} from '../../domain/value-objects/reward-details.vo';
@Injectable()
export class CreateRewardUseCase {
  private readonly logger = new Logger(CreateRewardUseCase.name);
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async execute(createRewardDto: CreateRewardDto, user: UserFromHeader) {
    const reward = Reward.createNew(
      createRewardDto.eventId,
      createRewardDto.name,
      RewardTypeVO.fromEnum(createRewardDto.type),
      RewardDetailsVO.create(createRewardDto.details as RewardDetail),
    );
    const newReward = new this.rewardModel(createRewardDto);
    return newReward.save();
  }
}
