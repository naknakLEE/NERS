import { UserSchema } from '../user/schemas/user.schema';
import { User } from './domain/entites/user.entity';

import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controller/auth.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    CreateUserUseCase,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
})
export class AccountModule {}
