import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveysModule } from './surveys/surveys.module';
import { AuthModule } from './auth/auth.module';
import { PasswordService } from './password/password.service';
import { PasswordModule } from './password/password.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { User, userSchema } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URL, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UsersModule,
    SurveysModule,
    AuthModule,
    PasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService, PasswordService, UsersService],
})
export class AppModule {}
