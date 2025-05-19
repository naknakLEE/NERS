import { Role } from '@app/constants';

export class RoleVO {
  private readonly _value: string;

  constructor(value: string) {
    if (!Object.values(Role).includes(value as Role)) {
      throw new Error(
        `Invalid role: ${value}. Must be one of ${Object.values(Role).join(', ')}`,
      );
    }
    this._value = value;
  }

  public static readonly USER = new RoleVO(Role.USER);
  public static readonly OPERATOR = new RoleVO(Role.OPERATOR);
  public static readonly AUDITOR = new RoleVO(Role.AUDITOR);
  public static readonly ADMIN = new RoleVO(Role.ADMIN);

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this.value;
  }

  isAdmin(): boolean {
    return this.value === Role.ADMIN;
  }

  isOperator(): boolean {
    return this.value === Role.OPERATOR;
  }

  isAuditor(): boolean {
    return this.value === Role.AUDITOR;
  }

  isUser(): boolean {
    return this.value === Role.USER;
  }
}
