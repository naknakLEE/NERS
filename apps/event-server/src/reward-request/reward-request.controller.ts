import { GetRewardHistoryDto } from '@app/dto/event/get-reward-history.dto';
import { RewardRequestDto } from '@app/dto/event/reward-request.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequestRewardUseCase } from './application/use-cases/request-reward.use-cases';
import { GetRewardRequestHistoryUseCase } from './application/use-cases/get-reward-request-history.use-case';
import {
  GetUserFromHeader,
  UserFromHeader,
} from '../common/get-user-from-header.decorator';
@Controller('reward-request')
export class RewardRequestController {
  constructor(
    private readonly requestRewardUseCase: RequestRewardUseCase,
    private readonly getRewardRequestHistoryUseCase: GetRewardRequestHistoryUseCase,
  ) {}

  // 유저 보상 요청 (유저)
  @Post()
  async requestReward(
    @Body() request: RewardRequestDto,
    @GetUserFromHeader() user: UserFromHeader,
  ) {
    return this.requestRewardUseCase.execute(request, user);
  }

  // 유저 본인 요청 이력 (유저)
  @Get()
  async getUserRewardRequestHistory(@Body() request: GetRewardHistoryDto) {
    return this.getRewardRequestHistoryUseCase.execute(request);
  }
}
