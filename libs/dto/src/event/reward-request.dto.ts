import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RewardRequestDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  eventId: string;
}
