import { UserSchema } from '../user/schemas/user.schema';
import { User } from './domain/entites/user.entity';

import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controller/auth.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { JwtTokenService } from './application/service/jwt-token.service';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenSchema } from '../user/schemas/refresh-token.schema';
import { RefreshToken } from '../user/schemas/refresh-token.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    LoginUserUseCase,
    // Repositories
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    // Services
    JwtTokenService,
  ],
})
export class AccountModule {}
