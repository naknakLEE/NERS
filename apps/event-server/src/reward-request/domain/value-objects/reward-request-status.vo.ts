import {
  RewardRequestStatus,
  RewardRequestStatus as RewardRequestStatusEnum,
} from '@app/constants';

export class RewardRequestStatusVO {
  private readonly _value: RewardRequestStatusEnum;

  private constructor(value: RewardRequestStatus) {
    this._value = value;
  }

  public static readonly APPROVED = new RewardRequestStatusVO(
    RewardRequestStatus.APPROVED,
  );
  public static readonly REJECTED_CONDITION = new RewardRequestStatusVO(
    RewardRequestStatusEnum.REJECTED_CONDITION,
  );
  public static readonly REJECTED_DUPLICATE = new RewardRequestStatusVO(
    RewardRequestStatus.REJECTED_DUPLICATE,
  );
  public static readonly REJECTED_EVENT_INACTIVE = new RewardRequestStatusVO(
    RewardRequestStatus.REJECTED_EVENT_INACTIVE,
  );
  public static readonly REJECTED_NO_REWARD = new RewardRequestStatusVO(
    RewardRequestStatus.REJECTED_NO_REWARD,
  );
  public static readonly FAILED_SERVER_ERROR = new RewardRequestStatusVO(
    RewardRequestStatus.FAILED_SERVER_ERROR,
  );

  public static fromEnum(
    value: RewardRequestStatusEnum,
  ): RewardRequestStatusVO {
    return new RewardRequestStatusVO(value);
  }

  get value(): RewardRequestStatusEnum {
    return this._value;
  }

  public isPending(): boolean {
    return this._value === RewardRequestStatus.PENDING;
  }

  public isApproved(): boolean {
    return this._value === RewardRequestStatusEnum.APPROVED;
  }
  public isRejected(): boolean {
    return (
      this._value.startsWith('REJECTED_') ||
      this._value === RewardRequestStatusEnum.FAILED_SERVER_ERROR
    );
  }

  public equals(other?: RewardRequestStatusVO): boolean {
    return (
      other instanceof RewardRequestStatusVO && this._value === other.value
    );
  }

  public toString(): string {
    return this._value;
  }
}
