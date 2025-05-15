import { Module } from '@nestjs/common';
import { AuthServerController } from './auth-server.controller';

@Module({
  imports: [],
  controllers: [AuthServerController],
})
export class AuthServerModule {}
