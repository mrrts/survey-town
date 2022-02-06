import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { IUser, USER_ROLES } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { get, set } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private usersService: UsersService
  ) {}

  async login(loginDto: LoginDto, req: Request): Promise<IUser> {
    const { emailAddress, plaintextPassword } = loginDto;
    const user: IUser = await this.usersService.findByEmailAddress(emailAddress);

    if (!user) {
      throw new NotFoundException(`User not found with email address ${emailAddress}`);
    }

    const correctPassword = await this.passwordService.validatePassword(
      plaintextPassword,
      user.passwordHash
    );
    
    if (correctPassword) {
      set(req, 'session._user', user.safe());
      return get(req, 'session._user');
    } 

    throw new UnauthorizedException('Invalid credentials');
  }

  logout(req: Request) {
    let success = false;
    req.session.destroy((err) => {
      if (!err) { success = true; }
    });
    return success;
  }

  async register(dto: RegisterDto, req: Request): Promise<IUser> {
    const userByHandle: IUser = await this.usersService.findByHandle(dto.handle);
    const userByEmail: IUser = await this.usersService.findByEmailAddress(dto.emailAddress);

    if (userByHandle) {
      throw new ConflictException('Handle already exists');
    }

    if (userByEmail) {
      throw new ConflictException('Email address already exists');
    }

    const createUserDto: CreateUserDto = {
      ...dto,
      roles: [USER_ROLES.USER]
    };

    await this.usersService.create(createUserDto);

    const loginDto: LoginDto = {
      emailAddress: dto.emailAddress,
      plaintextPassword: dto.plaintextPassword
    };

    return this.login(loginDto, req);
  }

}
