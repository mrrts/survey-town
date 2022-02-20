import { Inject, Injectable } from '@nestjs/common';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private saltRounds: number = 12;

  constructor(@Inject('BCRYPT') private bcrypt: typeof Bcrypt) {}

  async generateHash(plaintextPassword: string): Promise<string> {
    return this.bcrypt.hash(plaintextPassword, this.saltRounds);
  }

  async validatePassword(
    plaintextPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.bcrypt.compare(plaintextPassword, passwordHash);
  }
}
