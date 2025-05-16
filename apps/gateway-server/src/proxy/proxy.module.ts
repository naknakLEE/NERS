import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ConfigModule } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, HttpModule, AuthModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
