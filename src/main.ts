import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      name: process.env.SESSION_COOKIE_NAME,
      secret: process.env.AUTH_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.USE_SECURE_SESSION,
        maxAge: /* 2 weeks in millis */ 1209600000,
      },
    } as session.SessionOptions),
  );

  app.use(helmet());
  app.enableCors({
    origin: [
      process.env.FRONT_END_ORIGIN,
    ],
    credentials: true
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
