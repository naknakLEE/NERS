import { Module } from '@nestjs/common';
import { AuthServerController } from './auth-server.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AuthServerController],
  imports: [AuthModule],
})
export class AuthServerModule {}
