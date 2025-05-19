import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetEventsDto {
  @ApiProperty({
    example: 1,
    description: 'page number',
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    example: 10,
    description: 'page size',
  })
  @IsNumber()
  pageSize: number;
}
