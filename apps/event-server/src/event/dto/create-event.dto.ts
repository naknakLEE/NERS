import { Role } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsObject,
  IsString,
} from 'class-validator';
import { EventStatus } from '../schemas/event.schema';

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
    example: 'event status',
    description: 'event status',
  })
  @IsNotEmpty()
  @IsEnum(EventStatus)
  status: EventStatus;

  @ApiProperty({
    example: 'event conditions',
    description: 'event conditions',
  })
  @IsNotEmpty()
  @IsObject()
  conditions: object;
}
