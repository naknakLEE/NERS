import { BadRequestException } from '@nestjs/common';

export class PlainPasswordVO {
  private readonly _value: string;

  private static readonly PASSWORD_REGEX =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
  private static readonly PASSWORD_REQUIREMENTS_MESSAGE =
    'The password must be 8 to 16 characters long and include at least one letter, one number, and one special character (!@#$%^&*?_).';

  constructor(value: string) {
    if (!PlainPasswordVO.isValid(value)) {
      throw new BadRequestException(
        PlainPasswordVO.PASSWORD_REQUIREMENTS_MESSAGE,
      );
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  public static isValid(password: string): boolean {
    if (!password) {
      return false;
    }
    return PlainPasswordVO.PASSWORD_REGEX.test(password);
  }
}
