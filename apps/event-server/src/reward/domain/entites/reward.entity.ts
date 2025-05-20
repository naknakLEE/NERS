import { BadRequestException } from '@nestjs/common';
import { RewardDetailsVO } from '../value-objects/reward-details.vo';
import { RewardTypeVO } from '../value-objects/reward-type.vo';
import { RewardType as RewardTypeEnum } from '@app/constants';

export class Reward {
  private readonly _id: string | null;
  private _eventId: string;
  private _name: string;
  private _type: RewardTypeVO;
  private _details: RewardDetailsVO;
  private _isActive: boolean;
  private _validTo?: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  public static createNew(args: {
    id?: string;
    eventId: string;
    name: string;
    type: RewardTypeVO;
    details: RewardDetailsVO;
    isActive: boolean;
    validTo?: Date;
  }): Reward {
    const { id, eventId, name, type, details, isActive, validTo } = args;
    const now = new Date();
    return new Reward(
      id,
      eventId,
      name,
      type,
      details,
      isActive,
      validTo,
      now,
      now,
    );
  }

  toJson(): Record<string, any> {
    return {
      id: this._id,
      eventId: this._eventId,
      name: this._name,
      type: this._type.value,
      details: this._details.value,
      isActive: this._isActive,
      validTo: this._validTo,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public static fromPersistence(
    id: string,
    eventId: string,
    name: string,
    type: RewardTypeVO,
    detailsData: any, // DB에서 읽어온 raw details object
    totalQuantity: number,
    remainingQuantity: number,
    isActive: boolean,
    validTo?: Date,
    createdAt?: Date, // DB에 타임스탬프가 있다면
    updatedAt?: Date,
  ): Reward {
    let detailsVO: RewardDetailsVO;
    switch (
      type.value // type.value는 RewardTypeEnum 값
    ) {
      case RewardTypeEnum.ITEM:
        detailsVO = RewardDetailsVO.createItemReward(detailsData);
        break;
      case RewardTypeEnum.CURRENCY:
        detailsVO = RewardDetailsVO.createCurrencyReward(detailsData);
        break;
      default:
        throw new BadRequestException(
          `Unsupported reward type for details hydration: ${type.value}`,
        );
    }

    const now = new Date();

    return new Reward(
      id,
      eventId,
      name,
      type,
      detailsVO,
      isActive,
      validTo,
      createdAt || now,
      updatedAt || now,
    );
  }

  private constructor(
    id: string | null,
    eventId: string,
    name: string,
    type: RewardTypeVO,
    details: RewardDetailsVO,
    isActive: boolean,
    validTo: Date | undefined,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._eventId = eventId;
    this._name = name;
    this._type = type;
    this._details = details;
    this._isActive = isActive;
    this._validTo = validTo;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | null {
    return this._id;
  }
  get eventId(): string {
    return this._eventId;
  }
  get name(): string {
    return this._name;
  }
  get type(): RewardTypeVO {
    return this._type;
  }
  get details(): RewardDetailsVO {
    return this._details;
  }

  get isActive(): boolean {
    return this._isActive;
  }
  get validTo(): Date | undefined {
    return this._validTo;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateDetails(
    newName?: string,
    newDetails?: RewardDetailsVO,
    newValidTo?: Date,
  ): void {
    if (newName) this._name = newName;
    if (newDetails && newDetails.constructor === this._details.constructor) {
      this._details = newDetails;
    } else if (newDetails) {
      throw new BadRequestException(
        'Cannot change the type of reward details. Create a new reward instead.',
      );
    }
    if (newValidTo !== undefined) this._validTo = newValidTo;
    this._updatedAt = new Date();
  }

  public activate(): void {
    if (this._isActive) return;
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    if (!this._isActive) return;
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public isAvailable(): boolean {
    return this._isActive && (!this._validTo || this._validTo >= new Date());
  }

  public equals(other?: Reward): boolean {
    if (!other || this._id === null || other.id === null) return false;
    return this._id === other.id;
  }
}
