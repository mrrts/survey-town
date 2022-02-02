import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordModule } from 'src/password/password.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

const userModelModule = MongooseModule.forFeature([
  { name: User.modelName, schema: userSchema }
]);

@Module({
  imports: [
    PasswordModule,
    userModelModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [
    UsersService,
    UserRepository,
    userModelModule
  ]
})
export class UsersModule {}
