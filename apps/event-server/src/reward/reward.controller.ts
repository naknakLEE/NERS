import { Body, Controller, Post } from '@nestjs/common';
import { CreateRewardDto } from '@app/dto/event/create-reward.dto';
import { RewardService } from './reward.service';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  // POST /rewards: 보상 생성
  @Post()
  createReward(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.createReward(createRewardDto);
  }
}
