import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  RewardRequest,
  RewardRequestDocument,
} from '../../schemas/reward-request.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetRewardRequestDto } from '@app/dto/event/get-reward-request.dto';

@Injectable()
export class GetRewardRequestHistoryUseCase {
  private readonly logger = new Logger(GetRewardRequestHistoryUseCase.name);
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
  ) {}

  async execute(request: GetRewardRequestDto) {
    const { page, pageSize } = request;
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    return this.rewardRequestModel.find().skip(skip).limit(limit);
  }
}
