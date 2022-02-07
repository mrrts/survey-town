import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IAppSession } from '../auth/entities/session.entity';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      handle: createUserDto.handle,
      passwordHash,
      roles: createUserDto.roles
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = dto.plaintextPassword 
      ? await this.passwordService.generateHash(dto.plaintextPassword)
      : null;
  
    const data = {
      ...dto,
      passwordHash,
      updatedAt: new Date()
    };

    if (!dto.plaintextPassword) {
      delete data.passwordHash;
    }
    
    await this.userRepository.updateOne(id, data);

    return this.userRepository.findById(id);
  }

  findAll(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  findByEmailAddress(emailAddress: string): Promise<IUser> {
    return this.userRepository.findByEmailAddress(emailAddress);
  }

  findByHandle(handle: string): Promise<IUser> {
    return this.userRepository.findByHandle(handle);
  }

  async getSelfFromSession(session: IAppSession): Promise<IUser> {
    const freshUserLookup = await this.userRepository.findById(session?._user?.uuid);
    if (!freshUserLookup) {
      throw new UnauthorizedException('No active session');
    }
    return freshUserLookup;
  }

  async findAllHandles(): Promise<Partial<IUser>[]> {
    const allUsers = await this.findAll();
    return allUsers.map((user: IUser) => ({
      uuid: user.uuid,
      handle: user.handle
    }));
  } 

}
