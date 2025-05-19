import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '@app/dto';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PlainPasswordVO } from '../../domain/value-objects/password.vo';
import { JwtTokenService, Tokens } from '../service/jwt-token.service';
@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(loginDto: LoginDto): Promise<Tokens> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.password.matches(
      new PlainPasswordVO(password),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.jwtTokenService.generateTokens(user);
    await this.jwtTokenService.saveRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }
}
