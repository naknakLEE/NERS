import { GetRewardHistoryDto } from '@app/dto/event/get-reward-history.dto';
import { RewardRequestDto } from '@app/dto/event/reward-request.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service';
import { UserFromHeader } from '../common/get-user-from-header.decorator';
import { GetUserFromHeader } from '../common/get-user-from-header.decorator';
import { Role } from '@app/constants';
@Controller('reward-request')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  // 유저 보상 요청 (유저)
  @Post()
  async requestReward(@Body() request: RewardRequestDto) {
    const user = {
      userId: 'user_met_all_conditions',
      role: Role.USER,
      username: 'test_user',
    };
    return this.rewardRequestService.requestReward(request, user);
  }

  // 유저 본인 요청 이력 (유저)
  @Get()
  async getUserRewardRequestHistory(@Body() request: GetRewardHistoryDto) {
    return this.rewardRequestService.getUserRewardRequestHistory(request);
  }
}
