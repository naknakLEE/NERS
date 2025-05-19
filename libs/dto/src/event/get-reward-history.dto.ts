import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRewardHistoryDto {
  @ApiProperty({
    description: '보상 ID',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  rewardId: string;
}
