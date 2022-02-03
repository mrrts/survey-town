import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private saltRounds: number = 10;

  async generateHash(plaintextPassword: string): Promise<string> {
    return bcrypt.hash(plaintextPassword, this.saltRounds);
  }

  async validatePassword(plaintextPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plaintextPassword, passwordHash);
  }
}
