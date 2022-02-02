import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PasswordService } from '../password/password.service';
import { IUser } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private usersService: UsersService
  ) {}

  async login(loginDto: LoginDto, req: Request): Promise<IUser|null> {
    const { emailAddress, plaintextPassword } = loginDto;
    const user: IUser = await this.usersService.findByEmailAddress(emailAddress);
    const correctPassword = await this.passwordService.validatePassword(plaintextPassword, user.passwordHash);
    if (correctPassword) {
      (req.session as any)._user = user.safe();
      return (req.session as any)._user;
    } 
    return null;
  }

  logout(req: Request) {
    let success = false;
    req.session.destroy((err) => {
      if (!err) { success = true; }
    });
    return success;
  }
}
