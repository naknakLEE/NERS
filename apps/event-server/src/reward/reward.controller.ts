import { Body, Controller, Post } from '@nestjs/common';
import { CreateRewardDto } from '@app/dto/event/create-reward.dto';
import { CreateRewardUseCase } from './application/use-cases/create-reward.use-case';
import {
  UserFromHeader,
  GetUserFromHeader,
} from '../common/get-user-from-header.decorator';
@Controller('rewards')
export class RewardController {
  constructor(private readonly createRewardUseCase: CreateRewardUseCase) {}

  // POST /rewards: 보상 생성
  @Post()
  createReward(
    @Body() createRewardDto: CreateRewardDto,
    @GetUserFromHeader() user: UserFromHeader,
  ) {
    return this.createRewardUseCase.execute(createRewardDto, user);
  }
}
