import { Injectable } from '@nestjs/common';
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
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    );
    return user;
  }
}
