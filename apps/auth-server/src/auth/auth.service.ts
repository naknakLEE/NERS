import { Model } from 'mongoose';
import { LoginDto } from './dto/login-user.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      userId: (user._id as any).toHexString(),
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
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
