import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { ProxyEventController } from './proxy.event.controller';
import { ProxyAuthController } from './proxy.auth.controller';

@Module({
  imports: [ConfigModule, HttpModule, AuthModule],
  controllers: [ProxyAuthController, ProxyEventController],
  providers: [ProxyService],
})
export class ProxyModule {}
