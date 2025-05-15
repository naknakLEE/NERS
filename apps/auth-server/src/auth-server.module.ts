import { Module } from '@nestjs/common';
import { AuthServerController } from './auth-server.controller';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthServerController],
})
export class AuthServerModule {}
