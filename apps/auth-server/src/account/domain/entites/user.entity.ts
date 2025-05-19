import { UsernameVO } from '../value-objects/username.vo';
import { RoleVO } from '../value-objects/role.vo';
import { PlainPasswordVO } from '../value-objects/password.vo';
import { HashedPasswordVO } from '../value-objects/hashed-password.vo';
import * as bcrypt from 'bcrypt';

export class User {
  constructor(
    private readonly _id: string | null,
    private readonly _username: UsernameVO,
    private readonly _hashedPassword: HashedPasswordVO,
    private readonly _role: RoleVO,
  ) {}

  get id(): string | null {
    return this._id;
  }
  get username(): UsernameVO {
    return this._username;
  }
  get password(): HashedPasswordVO {
    return this._hashedPassword;
  }
  get role(): RoleVO {
    return this._role;
  }

  public static async register(
    username: UsernameVO,
    plainPassword: PlainPasswordVO,
    initialRole?: RoleVO,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(plainPassword.value, 10);
    const hashedPasswordVO = new HashedPasswordVO(hashedPassword);
    const role = initialRole || RoleVO.USER;
    return new User(null, username, hashedPasswordVO, role);
  }

  public static fromPersistence(
    id: string,
    username: UsernameVO,
    hashedPassword: HashedPasswordVO,
    role: RoleVO,
  ): User {
    return new User(id, username, hashedPassword, role);
  }

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      username: this._username.value,
      role: this._role.value,
    };
  }
}
