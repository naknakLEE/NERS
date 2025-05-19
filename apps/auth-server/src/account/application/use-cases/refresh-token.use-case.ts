import { JwtTokenService, Tokens } from '../service/jwt-token.service';
import {
  ForbiddenException,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from '@app/dto';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.interface';

export class RefreshTokenUseCase {
  private readonly logger = new Logger(RefreshTokenUseCase.name);
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(oldRefreshToken: RefreshTokenDto): Promise<Tokens> {
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

    const refreshTokenDoc =
      await this.refreshTokenRepository.findByUserIdAndToken(
        userId,
        oldRefreshToken.refreshToken,
        false,
      );

    if (!refreshTokenDoc) {
      this.logger.warn(`Refresh token not found or revoked for user ${userId}`);
      throw new ForbiddenException('Refresh token invalid or revoked.');
    }

    if (refreshTokenDoc.expiresAt < new Date()) {
      this.logger.warn(`Refresh token expired for user ${userId}`);
      throw new ForbiddenException('Refresh token expired.');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.error(`User not found for refresh token user ID: ${userId}`);
      await this.jwtTokenService.revokeRefreshToken(refreshTokenDoc.id);
      throw new UnauthorizedException('User not found.');
    }

    await this.jwtTokenService.revokeRefreshToken(refreshTokenDoc.id);

    const newTokens = await this.jwtTokenService.generateTokens(user);
    await this.jwtTokenService.saveRefreshToken(
      user.id,
      newTokens.refresh_token,
    );

    return newTokens;
  }
}
