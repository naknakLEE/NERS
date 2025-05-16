import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { Role, ConstantsService } from '@app/constants';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Roles(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ConstantsService.ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
