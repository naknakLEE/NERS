import { Model, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.interface';
import { RefreshTokenDocument } from './schemas/refresh-token.schema';
import { RefreshToken } from '../../domain/entites/refresh-token.entity';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  private toDomain(refreshTokenDoc: RefreshTokenDocument): RefreshToken {
    return new RefreshToken(
      refreshTokenDoc._id.toString(),
      refreshTokenDoc.userId.toString(),
      refreshTokenDoc.token,
      refreshTokenDoc.expiresAt,
      refreshTokenDoc.isRevoked,
    );
  }

  async findByToken(
    refreshToken: string,
    isRevoked?: boolean,
  ): Promise<RefreshToken> {
    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      token: refreshToken,
      isRevoked: isRevoked,
    });
    return refreshTokenDoc ? this.toDomain(refreshTokenDoc) : null;
  }

  async findByUserIdAndToken(
    userId: string,
    token: string,
    isRevoked?: boolean,
  ): Promise<RefreshToken> {
    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      userId: userId,
      token: token,
      isRevoked: isRevoked,
    });
    return refreshTokenDoc ? this.toDomain(refreshTokenDoc) : null;
  }

  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    const createData = {
      userId: refreshToken.userId,
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
      isRevoked: refreshToken.isRevoked,
    };
    const refreshTokenDoc = await this.refreshTokenModel.create(createData);
    return this.toDomain(refreshTokenDoc);
  }

  async update(
    token: string,
    data: UpdateQuery<RefreshTokenDocument>,
  ): Promise<RefreshToken> {
    const refreshTokenDoc = await this.refreshTokenModel.findOneAndUpdate(
      { token },
      data,
      { new: true },
    );
    return refreshTokenDoc ? this.toDomain(refreshTokenDoc) : null;
  }
}
