import { Module } from '@nestjs/common';
import { EventServerController } from './event-server.controller';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';
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
    EventModule,
    RewardModule,
  ],
  controllers: [EventServerController],
})
export class EventServerModule {}
