import {
  CurrencyType,
  ICurrencyRewardParams,
  IItemRewardParams,
  RewardType,
} from '@app/constants';
import { BadRequestException } from '@nestjs/common';

export type RewardDetail = IItemRewardParams | ICurrencyRewardParams;

export class RewardDetailsVO {
  private readonly _value: RewardDetail;

  private constructor(detail: RewardDetail) {
    switch (detail.type) {
      case RewardType.ITEM:
        const itemParams = detail;
        if (!itemParams.itemCode || typeof itemParams.itemCode !== 'string') {
          throw new BadRequestException(
            'ITEM reward requires a valid "itemCode" string in parameters.',
          );
        }
        if (
          typeof itemParams.quantity !== 'number' ||
          itemParams.quantity <= 0
        ) {
          throw new BadRequestException(
            'ITEM reward requires a positive "quantity" number in parameters.',
          );
        }
        break;
      case RewardType.CURRENCY:
        const currencyParams = detail as ICurrencyRewardParams;
        if (
          !currencyParams.currencyType ||
          !Object.values(CurrencyType).includes(currencyParams.currencyType)
        ) {
          throw new BadRequestException(
            'CURRENCY reward requires a valid "currencyType" in parameters.',
          );
        }
        if (
          typeof currencyParams.amount !== 'number' ||
          currencyParams.amount <= 0
        ) {
          throw new BadRequestException(
            'CURRENCY reward requires a positive "amount" number in parameters.',
          );
        }
        break;
      default:
        const exhaustiveCheck: never = detail;
        throw new BadRequestException(
          `Unsupported reward detail type: ${(exhaustiveCheck as any).type}`,
        );
    }
    this._value = Object.freeze(detail);
  }

  public static create(detail: RewardDetail): RewardDetailsVO {
    return new RewardDetailsVO(detail);
  }

  public static createItemReward(params: IItemRewardParams): RewardDetailsVO {
    return new RewardDetailsVO({ type: RewardType.ITEM, ...params });
  }

  public static createCurrencyReward(
    params: ICurrencyRewardParams,
  ): RewardDetailsVO {
    return new RewardDetailsVO({
      type: RewardType.CURRENCY,
      ...params,
    });
  }

  get value(): RewardDetail {
    return this._value;
  }

  get type(): RewardType {
    return this._value.type;
  }
}
