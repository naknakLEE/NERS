import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserRoleDto } from './dto/update-user-role';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // PATCH /users/{userId}/role (관리자: 특정 사용자 역할 변경)
  @Patch(':userId/role')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  updateUserRole(
    @Param('userId') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userService.updateUserRole(userId, updateUserRoleDto);
  }
}
