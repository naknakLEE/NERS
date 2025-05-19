import { Inject, NotFoundException } from '@nestjs/common';

import { UpdateUserRoleDto } from '@app/dto';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, updateUserRoleDto: UpdateUserRoleDto) {
    const { role } = updateUserRoleDto;

    const user = await this.userRepository.findByIdAndUpdate(userId, { role });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
