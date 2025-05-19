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

  async findByAliveToken(refreshToken: string): Promise<RefreshToken> {
    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      token: refreshToken,
      isRevoked: false,
    });
    return refreshTokenDoc ? this.toDomain(refreshTokenDoc) : null;
  }
}
