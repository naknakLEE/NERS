import { Role } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    default: 'test_id',
    description: '아이디',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    default: 'test1234!',
    description: '패스워드',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/, {
    message:
      'The password must be 8 to 16 characters long and include at least one letter, one number, and one special character.',
  })
  password: string;

  @ApiProperty({
    default: Role.USER,
    description: '역할',
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;
}
