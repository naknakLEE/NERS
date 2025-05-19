import { EventConditionType } from '@app/dto/event/condition/condition-type.enum';
import { Injectable } from '@nestjs/common';

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export enum RewardType {
  ITEM = 'ITEM',
  CURRENCY = 'CURRENCY',
  COUPON = 'COUPON',
}

export enum CurrencyType {
  MESO = 'MESO',
  MAPLE_POINT = 'MAPLE_POINT',
  PLAY_POINT = 'PLAY_POINT',
  MILEAGE = 'MILEAGE',
}

export enum RewardRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED', // 조건 충족, 보상 지급 승인됨
  REJECTED_CONDITION = 'REJECTED_CONDITION',
  REJECTED_DUPLICATE = 'REJECTED_DUPLICATE',
  REJECTED_EVENT_INACTIVE = 'REJECTED_EVENT_INACTIVE',
  REJECTED_NO_REWARD = 'REJECTED_NO_REWARD',
  FAILED_SERVER_ERROR = 'FAILED_SERVER_ERROR',
}

export interface IItemRewardParams {
  type: RewardType.ITEM;
  itemCode: string;
  itemName?: string;
  quantity: number;
}

export interface ICurrencyRewardParams {
  type: RewardType.CURRENCY;
  currencyType: CurrencyType;
  amount: number;
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
