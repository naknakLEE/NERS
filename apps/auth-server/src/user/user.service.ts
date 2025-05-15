import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto) {
    const { username } = createUserDto;

    const existingUser = await this.userModel
      .findOne({ $or: [{ username }] })
      .exec();
    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException(`Username '${username}' already exists.`);
      }
    }

    const newUser = new this.userModel(createUserDto);

    try {
      const savedUser = await newUser.save();

      return {
        username: savedUser.username,
        role: savedUser.role,
      } as User;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username or email already exists.');
      }
      throw new InternalServerErrorException('Failed to create user.');
    }
  }
}
