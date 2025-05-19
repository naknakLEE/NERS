import { User } from '../../domain/entites/user.entity';
import { Model, UpdateQuery } from 'mongoose';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserDocument } from 'apps/auth-server/src/account/infrastructure/repositories/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsernameVO } from '../../domain/value-objects/username.vo';
import { HashedPasswordVO } from '../../domain/value-objects/hashed-password.vo';
import { RoleVO } from '../../domain/value-objects/role.vo';

export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private toDomain(userDoc: UserDocument): User {
    return User.fromPersistence(
      userDoc._id.toString(),
      new UsernameVO(userDoc.username),
      new HashedPasswordVO(userDoc.password),
      new RoleVO(userDoc.role),
    );
  }

  async create(user: User): Promise<User> {
    const createData = {
      username: user.username.value,
      password: user.password.value,
      role: user.role.value,
    };
    const newUserDoc = new this.userModel(createData);
    const savedUserDoc = await newUserDoc.save();
    return this.toDomain(savedUserDoc);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    return user ? this.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    return user ? this.toDomain(user) : null;
  }

  async findByIdAndUpdate(
    userId: string,
    data: UpdateQuery<UserDocument>,
  ): Promise<User | null> {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });
    if (!updatedUser) return null;
    return this.toDomain(updatedUser);
  }
}
