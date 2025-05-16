import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { ConstantsService } from '@app/constants';

@Module({
  imports: [ConfigModule],
  providers: [JwtStrategy, ConstantsService],
  exports: [ConstantsService],
})
export class AuthModule {}
