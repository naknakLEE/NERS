import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsString,
  ValidateNested,
  IsArray,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { EventConditionType } from './condition/condition-type.enum';
import { Type } from 'class-transformer';
import { EventStatusEnum } from 'apps/event-server/src/event/domain/value-objects/event-status.vo';
import { EventConditionParams } from '@app/constants';

export class EventConditionDto implements EventConditionParams {
  @ApiProperty({ enum: EventConditionType })
  @IsEnum(EventConditionType)
  @IsNotEmpty()
  type: EventConditionType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Parameters specific to the condition type',
    example: { requiredLevel: 50 },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;
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
    example: EventStatusEnum.ACTIVE,
    description: 'event status',
    enum: EventStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(EventStatusEnum)
  status: EventStatusEnum;

  @ApiProperty({
    example: [
      {
        type: EventConditionType.LOGIN_STREAK,
        name: 'Login Streak',
        description: 'Login Streak',
        parameters: { days: 7 },
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
