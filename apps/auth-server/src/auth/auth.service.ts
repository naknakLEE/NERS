import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  register(createUserDto: CreateUserDto) {
    this.logger.log(createUserDto);
    return createUserDto;
  }
}
