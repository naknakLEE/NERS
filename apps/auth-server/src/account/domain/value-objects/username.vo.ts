import { BadRequestException } from '@nestjs/common';

export class UsernameVO {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException('Username cannot be empty.');
    }
    this._value = value.trim();
  }

  public get value(): string {
    return this._value;
  }
}
