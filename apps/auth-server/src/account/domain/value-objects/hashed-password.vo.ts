import { PlainPasswordVO } from './password.vo';
import * as bcrypt from 'bcrypt';

export class HashedPasswordVO {
  private readonly _value: string;

  constructor(hashedValue: string) {
    if (!hashedValue || hashedValue.trim() === '') {
      throw new Error('Hashed password value cannot be empty.');
    }
    this._value = hashedValue;
  }

  public get value(): string {
    return this._value;
  }

  public async matches(plainPassword: PlainPasswordVO): Promise<boolean> {
    return bcrypt.compare(plainPassword.value, this._value);
  }
}
