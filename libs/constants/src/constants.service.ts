import { Injectable } from '@nestjs/common';

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Injectable()
export class ConstantsService {
  static readonly Role = Role;
  static readonly ROLES_KEY = 'roles';
}
