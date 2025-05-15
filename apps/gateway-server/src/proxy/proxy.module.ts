import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ConfigModule } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}

