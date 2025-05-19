import { RewardType as RewardTypeEnum } from '@app/constants';

export class RewardTypeVO {
  private readonly _value: RewardTypeEnum;

  private constructor(value: RewardTypeEnum) {
    this._value = value;
  }
  public static readonly ITEM = new RewardTypeVO(RewardTypeEnum.ITEM);
  public static readonly CURRENCY = new RewardTypeVO(RewardTypeEnum.CURRENCY);
  public static readonly COUPON = new RewardTypeVO(RewardTypeEnum.COUPON);

  public static fromEnum(value: RewardTypeEnum): RewardTypeVO {
    return new RewardTypeVO(value);
  }

  get value(): RewardTypeEnum {
    return this._value;
  }

  public isItem(): boolean {
    return this._value === RewardTypeEnum.ITEM;
  }
  public isCurrency(): boolean {
    return this._value === RewardTypeEnum.CURRENCY;
  }
  public isCoupon(): boolean {
    return this._value === RewardTypeEnum.COUPON;
  }

  public toString(): string {
    return this._value;
  }
}
