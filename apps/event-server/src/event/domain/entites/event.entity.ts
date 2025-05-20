import { EventConditionsVO } from '../value-objects/event-conditions.vo';
import {
  EventStatusEnum,
  EventStatusVO,
} from '../value-objects/event-status.vo';
import { EventDateRangeVO } from '../value-objects/event-date-range.vo';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
export class Event {
  private readonly _id: string | null;
  private _name: string;
  private _description: string;
  private _dateRange: EventDateRangeVO;
  private _status: EventStatusVO;
  private _conditions: EventConditionsVO;
  private readonly _createdBy: string;
  private _rewards: string[];
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string | null,
    name: string,
    description: string,
    dateRange: EventDateRangeVO,
    status: EventStatusVO,
    conditions: EventConditionsVO,
    createdBy: string,
    rewards: string[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._dateRange = dateRange;
    this._status = status;
    this._conditions = conditions;
    this._createdBy = createdBy;
    this._rewards = rewards;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static createNew(args: {
    id?: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: EventStatusVO;
    conditions: EventConditionsVO;
    createdBy: string;
    initialStatus?: EventStatusVO;
  }): Event {
    const {
      id,
      name,
      description,
      startDate,
      endDate,
      status,
      conditions,
      createdBy,
    } = args;
    const now = new Date();

    return new Event(
      id,
      name,
      description,
      EventDateRangeVO.create(startDate, endDate),
      status,
      conditions,
      createdBy,
      [],
      now,
      now,
    );
  }

  get id(): string | null {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string {
    return this._description;
  }
  get dateRange(): EventDateRangeVO {
    return this._dateRange;
  }
  get startDate(): Date {
    return this._dateRange.startDate;
  }
  get endDate(): Date {
    return this._dateRange.endDate;
  }

  get status(): EventStatusVO {
    return this._status;
  }
  get conditions(): EventConditionsVO {
    return this._conditions;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  get rewards(): ReadonlyArray<string> {
    return Object.freeze([...this._rewards]);
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJson(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      startDate: this._dateRange.startDate,
      endDate: this._dateRange.endDate,
      status: this._status.value,
      conditions: this._conditions.values,
      createdBy: new Types.ObjectId(this._createdBy),
    };
  }

  public updateDetails(
    newName?: string,
    newDescription?: string,
    newDateRange?: EventDateRangeVO,
    newConditions?: EventConditionsVO,
  ): void {
    if (
      this._status.value === EventStatusEnum.COMPLETED ||
      this._status.value === EventStatusEnum.INACTIVE
    ) {
      throw new BadRequestException(
        'Cannot update details of a completed or inactive event.',
      );
    }
    if (newName) this._name = newName;
    if (newDescription) this._description = newDescription;
    if (newDateRange) {
      this._dateRange = newDateRange;
    }
    if (newConditions) this._conditions = newConditions;
    this._updatedAt = new Date();
  }

  public activate(): void {
    if (!this._dateRange.isWithinRange() || this._dateRange.hasEnded()) {
      throw new BadRequestException(
        'Event cannot be activated outside its date range or if it has ended.',
      );
    }
    if (this._status.value === EventStatusEnum.ACTIVE) return;
    if (
      this._status.value === EventStatusEnum.COMPLETED ||
      this._status.value === EventStatusEnum.INACTIVE
    ) {
      throw new BadRequestException(
        'Cannot activate a completed or inactive event.',
      );
    }
    this._status = EventStatusVO.ACTIVE;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    if (this._status.value === EventStatusEnum.INACTIVE) return;
    this._status = EventStatusVO.INACTIVE;
    this._updatedAt = new Date();
  }

  public complete(): void {
    if (this._status.value === EventStatusEnum.COMPLETED) return;
    if (!this._dateRange.hasEnded()) {
      throw new BadRequestException(
        'Event cannot be completed before its end date.',
      );
    }
    this._status = EventStatusVO.COMPLETED;
    this._updatedAt = new Date();
  }

  public archive(): void {
    if (
      this._status.value !== EventStatusEnum.COMPLETED &&
      this._status.value !== EventStatusEnum.INACTIVE
    ) {
      throw new BadRequestException(
        'Only completed or inactive events can be archived.',
      );
    }
    this._status = EventStatusVO.INACTIVE;
    this._updatedAt = new Date();
  }

  public isActiveAndRunning(now: Date = new Date()): boolean {
    return this._status.isActive() && this._dateRange.isWithinRange(now);
  }

  public addReward(rewardId: string): void {
    if (!this._rewards.includes(rewardId)) {
      this._rewards.push(rewardId);
      this._updatedAt = new Date();
    }
  }

  public removeReward(rewardId: string): void {
    const index = this._rewards.indexOf(rewardId);
    if (index > -1) {
      this._rewards.splice(index, 1);
      this._updatedAt = new Date();
    }
  }
}
