import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../user/schemas/refresh-token.schema';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { CreateUserDto, LoginDto, RefreshTokenDto } from '@app/dto';
export interface Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { username, password } = loginDto;

    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refresh_token);
    return tokens;
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

  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.refreshTokenModel.updateOne(
      { _id: tokenId },
      { isRevoked: true },
    );
  }

  async logout(refreshTokenValue: string): Promise<void> {
    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      token: refreshTokenValue,
      isRevoked: false,
    });
    if (refreshTokenDoc) {
      await this.revokeRefreshToken(refreshTokenDoc._id.toString());
      this.logger.log(
        `User logged out, refresh token revoked for token: ${refreshTokenValue.substring(0, 10)}...`,
      );
    } else {
      this.logger.warn(
        `Logout attempt with invalid or already revoked refresh token: ${refreshTokenValue.substring(0, 10)}...`,
      );
    }
  }

  async refreshToken(oldRefreshToken: RefreshTokenDto): Promise<Tokens> {
    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(
        oldRefreshToken.refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        },
      );
    } catch (error) {
      this.logger.error(`Refresh token verification failed: ${error}`);
      throw new ForbiddenException('Refresh token invalid or revoked.');
    }

    const userId = decoded.userId;

    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      userId,
      token: oldRefreshToken.refreshToken,
      isRevoked: false,
    });

    if (!refreshTokenDoc) {
      this.logger.warn(`Refresh token not found or revoked for user ${userId}`);
      throw new ForbiddenException('Refresh token invalid or revoked.');
    }

    if (refreshTokenDoc.expiresAt < new Date()) {
      this.logger.warn(`Refresh token expired for user ${userId}`);
      throw new ForbiddenException('Refresh token expired.');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.error(`User not found for refresh token user ID: ${userId}`);
      await this.revokeRefreshToken(refreshTokenDoc._id.toString());
      throw new UnauthorizedException('User not found.');
    }

    await this.revokeRefreshToken(refreshTokenDoc._id.toString());

    const newTokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, newTokens.refresh_token);

    return newTokens;
  }

  private async generateTokens(
    user:
      | Omit<UserDocument, 'password'>
      | { _id: any; role: string; username: string },
  ): Promise<Tokens> {
    const accessTokenPayload = {
      userId: (user._id as any).toHexString(),
      username: user.username,
      role: user.role,
    };
    const refreshTokenPayload = {
      userId: (user._id as any).toHexString(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        ),
      }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private async saveRefreshToken(
    userId: string,
    token: string,
  ): Promise<RefreshTokenDocument> {
    const expiresInString = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );
    const expiresInMilliseconds = ms(expiresInString);

    if (typeof expiresInMilliseconds !== 'number') {
      throw new InternalServerErrorException(
        'Invalid refresh token expiration format.',
      );
    }

    const expiresAt = new Date(Date.now() + expiresInMilliseconds);

    const refreshTokenDoc = new this.refreshTokenModel({
      userId,
      token,
      expiresAt,
    });
    return refreshTokenDoc.save();
  }
}
