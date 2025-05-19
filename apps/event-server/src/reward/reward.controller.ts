import { Body, Controller, Post } from '@nestjs/common';
import { CreateRewardDto } from '@app/dto/event/create-reward.dto';
import { CreateRewardUseCase } from './application/use-cases/create-reward.use-case';
import { Role } from '@app/constants';

@Controller('rewards')
export class RewardController {
  constructor(private readonly createRewardUseCase: CreateRewardUseCase) {}

  // POST /rewards: 보상 생성
  @Post()
  createReward(@Body() createRewardDto: CreateRewardDto) {
    const user = {
      userId: '1',
      role: Role.ADMIN,
      username: 'test',
    };
    return this.createRewardUseCase.execute(createRewardDto, user);
  }
}
