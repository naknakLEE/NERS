import { Role } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: Role.USER,
    enum: Role,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
