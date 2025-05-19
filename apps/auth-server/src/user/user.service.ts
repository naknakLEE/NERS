import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../account/infrastructure/repositories/schemas/user.schema';
import { UserDocument } from '../account/infrastructure/repositories/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserRoleDto } from '@app/dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto) {
    const { role } = updateUserRoleDto;

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
