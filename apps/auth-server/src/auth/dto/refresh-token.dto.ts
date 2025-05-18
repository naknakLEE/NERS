import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    default: 'test_id',
    description: '리프레시 토큰',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
