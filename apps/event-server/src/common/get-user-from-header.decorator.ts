import { Role } from '@app/constants';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export interface UserFromHeader {
  userId: string;
  role: Role;
  username: string;
}

export const GetUserFromHeader = createParamDecorator(
  (
    data: keyof UserFromHeader | undefined,
    ctx: ExecutionContext,
  ): UserFromHeader | string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    const role = request.headers['x-user-role'];
    const username = request.headers['x-user-name'];

    if (!userId || !role) {
      throw new UnauthorizedException(
        `User information missing in headers. Ensure request comes through Gateway. x-user-id: ${userId}, x-user-role: ${role}, x-user-name: ${username}`,
      );
    }

    const user: UserFromHeader = { userId, role, username };

    return data ? user[data] : user;
  },
);
