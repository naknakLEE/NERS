import { Controller, Body, Patch, Param } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { UpdateUserRoleDto } from '@app/dto';
import { UpdateUserRoleUseCase } from '../../application/use-cases/update-user-role.use-case';

@Controller()
export class UserController {
  constructor(private readonly updateUserRoleUseCase: UpdateUserRoleUseCase) {}

  // PATCH /user/{userId}/role (관리자: 특정 사용자 역할 변경)
  @Patch('user/:userId/role')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  updateUserRole(
    @Param('userId') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.updateUserRoleUseCase.execute(userId, updateUserRoleDto);
  }
}
