import { Module } from '@nestjs/common';
import { ProxyModule } from './proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule],
})
export class AppModule {}
