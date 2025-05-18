import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserRoleDto } from './dto/update-user-role';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto) {
    const { role } = updateUserRoleDto;
    let user: UserDocument | null = null;

    try {
      user = await this.userModel.findByIdAndUpdate(
        userId,
        { role },
        { new: true },
      );
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }

    return user;
  }
}
