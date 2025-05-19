import { EventConditionType } from '@app/dto/event/condition/condition-type.enum';
import { Injectable } from '@nestjs/common';

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export interface EventConditionParams {
  type: EventConditionType;
  name: string;
  description?: string;
  parameters?: Record<string, any>;
}

@Injectable()
export class ConstantsService {
  static readonly Role = Role;
  static readonly ROLES_KEY = 'roles';
}
