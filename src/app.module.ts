import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveysModule } from './surveys/surveys.module';
import { AuthModule } from './auth/auth.module';
import { PasswordService } from './password/password.service';
import { PasswordModule } from './password/password.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { LoggerMiddleware } from './common/logger.middleware';
import { SurveysController } from './surveys/surveys.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/build'),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ThrottlerModule.forRoot({
      limit: 100,
      ttl: 10
    }),
    UsersModule,
    SurveysModule,
    AuthModule,
    PasswordModule,
  ],
  providers: [
    PasswordService,
    UsersService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: 'BCRYPT', useValue: bcrypt },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    process.env.NODE_ENV === 'development' && consumer.apply(LoggerMiddleware).forRoutes(SurveysController);
  }
}
