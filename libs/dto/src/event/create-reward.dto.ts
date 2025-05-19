import {
  CurrencyType,
  ICurrencyRewardParams,
  IItemRewardParams,
  RewardType,
} from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ItemRewardDetailDto implements IItemRewardParams {
  @IsEnum(RewardType)
  @IsNotEmpty()
  type: RewardType.ITEM;

  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @IsString()
  @IsOptional()
  itemName?: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CurrencyRewardDetailDto implements ICurrencyRewardParams {
  @IsEnum(RewardType)
  @IsNotEmpty()
  type: RewardType.CURRENCY;

  @IsEnum(CurrencyType)
  @IsNotEmpty()
  currencyType: CurrencyType;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

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
    example: RewardType.ITEM,
    description: 'reward type',
    enum: RewardType,
  })
  @IsNotEmpty()
  @IsEnum(RewardType)
  type: RewardType;

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
      type: RewardType.ITEM,
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Object, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: ItemRewardDetailDto, name: RewardType.ITEM },
        { value: CurrencyRewardDetailDto, name: RewardType.CURRENCY },
      ],
    },
  })
  details: ItemRewardDetailDto | CurrencyRewardDetailDto;
}
