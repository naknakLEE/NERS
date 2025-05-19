import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  RewardRequest,
  RewardRequestDocument,
} from '../../schemas/reward-request.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetRewardHistoryDto } from '@app/dto/event/get-reward-history.dto';

@Injectable()
export class GetRewardRequestHistoryUseCase {
  private readonly logger = new Logger(GetRewardRequestHistoryUseCase.name);
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
  ) {}

  async execute(request: GetRewardHistoryDto) {
    return this.rewardRequestModel.find(request);
  }
}
