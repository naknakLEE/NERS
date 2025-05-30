import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEventsDto {
  @ApiProperty({
    example: 1,
    description: 'page number',
  })
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty({
    example: 10,
    description: 'page size',
  })
  @Type(() => Number)
  @IsNumber()
  pageSize: number;
}
