import { User } from '../entites/user.entity';
import { UpdateQuery } from 'mongoose';
import { UserDocument } from '../../infrastructure/repositories/schemas/user.schema';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByIdAndUpdate(
    userId: string,
    data: UpdateQuery<UserDocument>,
  ): Promise<User>;
}
