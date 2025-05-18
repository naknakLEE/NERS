import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../user/schemas/refresh-token.schema';
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
  providers: [AuthService],
})
export class AuthModule {}
