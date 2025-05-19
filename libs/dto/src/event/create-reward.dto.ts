import { ApiProperty } from '@nestjs/swagger';
import {
  CouponRewardDetails,
  CurrencyRewardDetails,
  ItemRewardDetails,
  RewardType,
} from 'apps/event-server/src/reward/schemas/reward.schema';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRewardDto {
  @ApiProperty({
    example: '664564564564564564564564',
    description: 'event id',
  })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiProperty({
    example: '아이템 보상',
    description: 'reward name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 100,
    description: 'total quantity',
  })
  @IsNotEmpty()
  @IsNumber()
  totalQuantity: number;

  @ApiProperty({
    example: RewardType.ITEM,
    description: 'reward type',
    enum: RewardType,
  })
  @IsNotEmpty()
  @IsEnum(RewardType)
  type: RewardType;

  @ApiProperty({
    example: 100,
    description: 'remaining quantity',
  })
  @IsNotEmpty()
  @IsNumber()
  remainingQuantity: number;

  @ApiProperty({
    example: true,
    description: 'is active',
  })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: '2025-01-01',
    description: 'valid to',
  })
  @IsOptional()
  validTo?: Date;

  @ApiProperty({
    example: {
      itemCode: '1001',
      itemName: '아이템1',
      quantity: 1,
    },
  })
  details: ItemRewardDetails | CurrencyRewardDetails | CouponRewardDetails;
}
