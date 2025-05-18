import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LogoutUserDto {
  @ApiPropertyOptional({
    default: 'test_id',
    description: '리프레시 토큰',
  })
  @IsString()
  refreshToken?: string;
}
