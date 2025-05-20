import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsString,
  ValidateNested,
  IsArray,
  IsOptional,
  IsObject,
} from 'class-validator';
import { EventConditionType } from './condition/condition-type.enum';
import { Type } from 'class-transformer';
import { EventStatusEnum } from 'apps/event-server/src/event/domain/value-objects/event-status.vo';
import { EventConditionParams } from '@app/constants';

export class EventConditionDto implements EventConditionParams {
  @IsEnum(EventConditionType)
  @IsNotEmpty()
  type: EventConditionType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;
}
export class CreateEventDto {
  @ApiProperty({
    example: '7일 연속 출석',
    description: '이벤트 이름',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '7일 연속 출석 이벤트',
    description: '이벤트 설명',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '2025-01-01',
    description: '이벤트 시작 날짜',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: '2025-01-01',
    description: '이벤트 종료 날짜',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    example: EventStatusEnum.ACTIVE,
    description: '이벤트 상태(active: 활성, inactive: 비활성, completed: 종료)',
    enum: EventStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(EventStatusEnum)
  status: EventStatusEnum;

  @ApiProperty({
    description: '이벤트 조건',
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
}
