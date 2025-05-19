import { User } from '../entites/user.entity';
import { UpdateQuery } from 'mongoose';
import { UserDocument } from '../../infrastructure/repositories/schemas/user.schema';
import { RefreshToken } from '../entites/refresh-token.entity';
import { RefreshTokenDocument } from '../../infrastructure/repositories/schemas/refresh-token.schema';
export interface IRefreshTokenRepository {
  findByAliveToken(refreshToken: string): Promise<RefreshToken>;
  // update(
  //   token: string,
  //   data: UpdateQuery<RefreshTokenDocument>,
  // ): Promise<RefreshToken>;
}
