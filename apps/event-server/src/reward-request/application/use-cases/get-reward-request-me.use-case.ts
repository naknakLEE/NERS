import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  RewardRequest,
  RewardRequestDocument,
} from '../../schemas/reward-request.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserFromHeader } from 'apps/event-server/src/common/get-user-from-header.decorator';

@Injectable()
export class GetRewardRequestMeUseCase {
  private readonly logger = new Logger(GetRewardRequestMeUseCase.name);
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
  ) {}

  async execute(user: UserFromHeader) {
    const { userId } = user;
    return this.rewardRequestModel.find({ userId });
  }
}
