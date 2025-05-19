import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { UsernameVO } from '../../domain/value-objects/username.vo';
import { RoleVO } from '../../domain/value-objects/role.vo';
import { User } from '../../domain/entites/user.entity';
import { CreateUserDto } from '@app/dto';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PlainPasswordVO } from '../../domain/value-objects/password.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException(`Username '${dto.username}' already exists.`);
    }

    const newUser = await User.register(
      new UsernameVO(dto.username),
      new PlainPasswordVO(dto.password),
      new RoleVO(dto.role),
    );

    return this.userRepository.create(newUser);
  }
}
