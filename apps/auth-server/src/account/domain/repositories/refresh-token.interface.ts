import { UpdateQuery } from 'mongoose';
import { RefreshToken } from '../entites/refresh-token.entity';
import { RefreshTokenDocument } from '../../infrastructure/repositories/schemas/refresh-token.schema';

export interface IRefreshTokenRepository {
  findByToken(refreshToken: string, isRevoked?: boolean): Promise<RefreshToken>;
  findByUserIdAndToken(
    userId: string,
    token: string,
    isRevoked?: boolean,
  ): Promise<RefreshToken>;
  create(refreshToken: RefreshToken): Promise<RefreshToken>;
  update(
    token: string,
    data: UpdateQuery<RefreshTokenDocument>,
  ): Promise<RefreshToken>;
}
