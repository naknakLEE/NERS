import { GetRewardHistoryDto } from '@app/dto/event/get-reward-history.dto';
import { RewardRequestDto } from '@app/dto/event/reward-request.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RequestRewardUseCase } from './application/use-cases/request-reward.use-cases';
import { GetRewardRequestHistoryUseCase } from './application/use-cases/get-reward-request-history.use-case';
import {
  GetUserFromHeader,
  UserFromHeader,
} from '../common/get-user-from-header.decorator';
import { GetRewardRequestMeUseCase } from './application/use-cases/get-reward-request-me.use-case';
import { GetRewardRequestDto } from '@app/dto/event/get-reward-request.dto';
@Controller('reward-request')
export class RewardRequestController {
  constructor(
    private readonly requestRewardUseCase: RequestRewardUseCase,
    private readonly getRewardRequestHistoryUseCase: GetRewardRequestHistoryUseCase,
    private readonly getRewardRequestMeUseCase: GetRewardRequestMeUseCase,
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
  @Get('me')
  async gettHistoryByUser(@GetUserFromHeader() user: UserFromHeader) {
    return this.getRewardRequestMeUseCase.execute(user);
  }

  // 관리자 전체 요청 이력
  @Get()
  async getUserRewardRequestHistory(@Query() request: GetRewardRequestDto) {
    return this.getRewardRequestHistoryUseCase.execute(request);
  }
}
