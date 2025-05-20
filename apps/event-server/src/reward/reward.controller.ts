import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateRewardDto } from '@app/dto/event/create-reward.dto';
import { CreateRewardUseCase } from './application/use-cases/create-reward.use-case';
import {
  UserFromHeader,
  GetUserFromHeader,
} from '../common/get-user-from-header.decorator';
import { GetRewardIdUseCase } from './application/use-cases/get-reward-id.use-case';
import { GetRewardsDto } from '@app/dto/event/get-rewards.dto';
import { GetAllRewardUseCase } from './application/use-cases/get-all-reward.use-cast';
@Controller('reward')
export class RewardController {
  constructor(
    private readonly createRewardUseCase: CreateRewardUseCase,
    private readonly getRewardIdUseCase: GetRewardIdUseCase,
    private readonly getAllRewardUseCase: GetAllRewardUseCase,
  ) {}

  // POST /rewards: 보상 생성
  @Post()
  createReward(
    @Body() createRewardDto: CreateRewardDto,
    @GetUserFromHeader() user: UserFromHeader,
  ) {
    return this.createRewardUseCase.execute(createRewardDto, user);
  }

  // GET /rewards: 보상 목록 조회
  @Get()
  getRewards(@Query() getRewardsDto: GetRewardsDto) {
    return this.getAllRewardUseCase.execute(getRewardsDto);
  }

  // GET /rewards/:eventId 특정 보상 목록 조회
  @Get(':rewardId')
  getRewardById(@Param('rewardId') rewardId: string) {
    return this.getRewardIdUseCase.execute(rewardId);
  }
}
