import { BadRequestException } from '@nestjs/common';

export enum EventStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

export class EventStatusVO {
  private readonly _value: EventStatusEnum;

  private constructor(value: EventStatusEnum) {
    this._value = value;
  }

  public static readonly ACTIVE = new EventStatusVO(EventStatusEnum.ACTIVE);
  public static readonly INACTIVE = new EventStatusVO(EventStatusEnum.INACTIVE);
  public static readonly COMPLETED = new EventStatusVO(
    EventStatusEnum.COMPLETED,
  );

  public static fromString(value: string): EventStatusVO {
    const upperValue = value.toUpperCase();
    const enumKey = Object.keys(EventStatusEnum).find(
      (key) => EventStatusEnum[key].toUpperCase() === upperValue,
    );
    if (!enumKey) {
      throw new BadRequestException(`Invalid event status string: ${value}`);
    }
    return new EventStatusVO(EventStatusEnum[enumKey]);
  }

  public static fromEnum(value: EventStatusEnum): EventStatusVO {
    return new EventStatusVO(value);
  }

  get value(): EventStatusEnum {
    return this._value;
  }

  public isActive(): boolean {
    return this._value === EventStatusEnum.ACTIVE;
  }

  public isInactive(): boolean {
    return this._value === EventStatusEnum.INACTIVE;
  }

  public toString(): string {
    return this._value;
  }
}
