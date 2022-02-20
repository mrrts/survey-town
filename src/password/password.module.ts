import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

@Module({
  providers: [
    PasswordService,
    { provide: 'BCRYPT', useValue: bcrypt },
  ],
  exports: [PasswordService],
})
export class PasswordModule {}
