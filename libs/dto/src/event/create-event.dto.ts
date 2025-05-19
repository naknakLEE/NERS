import { Role } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsObject,
  IsString,
  ValidateNested,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { EventStatus } from '../../../../apps/event-server/src/event/schemas/event.schema';
import { EventConditionType } from './condition/condition-type.enum';

import { Type } from 'class-transformer';

export class EventConditionDto {
  @IsEnum(EventConditionType)
  type: EventConditionType;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  parameters: Record<string, any>;

  @IsNumber()
  @Min(1)
  @IsOptional()
  requiredCount: number = 1;
}
export class CreateEventDto {
  @ApiProperty({
    example: '7일 연속 출석',
    description: 'event name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '7일 연속 출석 이벤트',
    description: 'event description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '2025-01-01',
    description: 'event start date',
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: '2025-01-01',
    description: 'event end date',
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @ApiProperty({
    example: EventStatus.ACTIVE,
    description: 'event status',
    enum: EventStatus,
  })
  @IsNotEmpty()
  @IsEnum(EventStatus)
  status: EventStatus;

  @ApiProperty({
    example: [
      {
        type: EventConditionType.ACTION_COMPLETED,
        name: 'Action Completed',
        description: 'Action Completed',
        parameters: {},
        requiredCount: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventConditionDto)
  conditions: EventConditionDto[];

  @ApiProperty({
    example: true,
    description: 'require all conditions',
  })
  @IsNotEmpty()
  @IsBoolean()
  requireAllConditions: boolean;
}
