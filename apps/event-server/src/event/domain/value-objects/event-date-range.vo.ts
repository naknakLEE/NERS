import { BadRequestException } from '@nestjs/common';

export class EventDateRangeVO {
  public readonly startDate: Date;
  public readonly endDate: Date;

  private constructor(startDate: Date, endDate: Date) {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public static create(startDate: Date, endDate: Date): EventDateRangeVO {
    return new EventDateRangeVO(startDate, endDate);
  }

  public isWithinRange(date: Date = new Date()): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  public hasStarted(now: Date = new Date()): boolean {
    return now >= this.startDate;
  }

  public hasEnded(now: Date = new Date()): boolean {
    return now > this.endDate;
  }
}
