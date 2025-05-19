import { JwtTokenService } from '../service/jwt-token.service';
import { Inject, Logger } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.interface';

export class LogoutUserUseCase {
  private readonly logger = new Logger(LogoutUserUseCase.name);
  constructor(
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await this.refreshTokenRepository.findByToken(
      refreshToken,
      false,
    );
    if (refreshTokenDoc) {
      await this.jwtTokenService.revokeRefreshToken(refreshTokenDoc.id);
      this.logger.log(
        `User logged out, refresh token revoked for token: ${refreshToken.substring(0, 10)}...`,
      );
    } else {
      this.logger.warn(
        `Logout attempt with invalid or already revoked refresh token: ${refreshToken.substring(0, 10)}...`,
      );
    }
  }
}
