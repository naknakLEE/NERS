import { RewardRequestStatus } from '@app/constants';
import { RewardRequestStatusVO } from '../value-objects/reward-request-status.vo';

export class RewardRequest {
  private readonly _id: string | null;
  private readonly _userId: string;
  private readonly _eventId: string;
  private readonly _rewardId: string;
  private _status: RewardRequestStatusVO;
  private readonly _requestedAt: Date;
  private _processedAt?: Date;
  private _claimedAt?: Date;

  public static createNew(
    userId: string,
    eventId: string,
    rewardId: string,
  ): RewardRequest {
    const now = new Date();
    const id = null;
    const initialStatus = RewardRequestStatus.PENDING;

    return new RewardRequest(id, userId, eventId, rewardId, initialStatus, now);
  }

  private constructor(
    id: string | null,
    userId: string,
    eventId: string,
    rewardId: string,
    status: RewardRequestStatus,
    requestedAt: Date,
    processedAt?: Date,
    claimedAt?: Date,
  ) {
    this._id = id;
    this._userId = userId;
    this._eventId = eventId;
    this._rewardId = rewardId;
    this._status = RewardRequestStatusVO.fromEnum(status);
    this._requestedAt = requestedAt;
    this._processedAt = processedAt;
    this._claimedAt = claimedAt;
  }

  // Getters
  get id(): string | null {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get eventId(): string {
    return this._eventId;
  }
  get rewardId(): string {
    return this._rewardId;
  }
  get status(): RewardRequestStatusVO {
    return this._status;
  }
  get requestedAt(): Date {
    return this._requestedAt;
  }
  get processedAt(): Date | undefined {
    return this._processedAt;
  }
  get claimedAt(): Date | undefined {
    return this._claimedAt;
  }

  public approve(processorId?: string, notes?: string): void {
    if (!this._status.isPending()) {
      throw new Error(
        `Cannot approve a reward request that is not in PENDING state. Current state: ${this._status.value}`,
      );
    }
    this._status = RewardRequestStatusVO.APPROVED;
    this._processedAt = new Date();
  }

  public reject(
    reason: RewardRequestStatus,
    processorId?: string,
    notes?: string,
  ): void {
    if (this._status.isApproved() || this._status.isRejected()) {
      throw new Error(
        `Cannot reject a reward request in state: ${this._status.value}`,
      );
    }
    if (
      !reason.startsWith('REJECTED_') &&
      reason !== RewardRequestStatus.FAILED_SERVER_ERROR
    ) {
      throw new Error(
        `Invalid rejection reason: ${reason}. Must be a REJECTED_ or FAILED_SERVER_ERROR status.`,
      );
    }
    this._status = RewardRequestStatusVO.fromEnum(reason);
    this._processedAt = new Date();
  }

  public markAsConditionFailed(
    snapshot: Record<string, any>,
    notes?: string,
  ): void {
    if (this._status.value !== RewardRequestStatus.PENDING) {
      throw new Error('Can only mark PENDING requests as condition failed.');
    }
    this._status = RewardRequestStatusVO.REJECTED_CONDITION;
    this._processedAt = new Date();
  }

  public markAsDuplicate(notes?: string): void {
    if (this._status.value !== RewardRequestStatus.PENDING) {
      throw new Error('Can only mark PENDING requests as duplicate.');
    }
    this._status = RewardRequestStatusVO.REJECTED_DUPLICATE;
    this._processedAt = new Date();
  }

  public toJSON(): any {
    return {
      id: this._id,
      userId: this._userId,
      eventId: this._eventId,
      rewardId: this._rewardId,
      status: this._status.value,
      requestedAt: this._requestedAt.toISOString(),
      processedAt: this._processedAt?.toISOString(),
      claimedAt: this._claimedAt?.toISOString(),
    };
  }
}
