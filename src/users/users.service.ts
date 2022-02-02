import { Injectable } from '@nestjs/common';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const passwordHash = await this.passwordService.generateHash(createUserDto.plaintextPassword);
    return this.userRepository.create({
      emailAddress: createUserDto.emailAddress,
      passwordHash
    });
  }

  findByEmailAddress(emailAddress: string): Promise<IUser> {
    return this.userRepository.findByEmailAddress(emailAddress);
  }

}
