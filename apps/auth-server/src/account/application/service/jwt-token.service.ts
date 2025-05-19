import { RefreshToken } from '../../domain/entites/refresh-token.entity';

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { User } from '../../domain/entites/user.entity';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.interface';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class JwtTokenService {
  constructor(
    @Inject('RefreshTokenRepository')
    private refreshTokenRepository: IRefreshTokenRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(tokenId, { isRevoked: true });
  }

  async generateTokens(user: User): Promise<Tokens> {
    const accessTokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
    const refreshTokenPayload = {
      userId: user.id,
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

  async saveRefreshToken(userId: string, token: string): Promise<RefreshToken> {
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

    const refreshToken = new RefreshToken(
      null,
      userId,
      token,
      expiresAt,
      false,
    );
    const refreshTokenDoc =
      await this.refreshTokenRepository.create(refreshToken);
    return refreshTokenDoc;
  }
}
